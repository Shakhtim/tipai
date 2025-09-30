import { Request, Response } from 'express';
import { YandexGPTService } from '../services/yandexgpt.service';
import { GigaChatService } from '../services/gigachat.service';
import { KandinskyService } from '../services/kandinsky.service';
import { ChatGPTRUService } from '../services/chatgpt_ru.service';
import { OpenAIService } from '../services/openai.service';
import { ClaudeService } from '../services/claude.service';
import { QueryRequest, AIResponse, QueryResponse, AIProvider } from '../types';
import { AI_PROVIDERS } from '../config/aiProviders';

import type { QueryOptions } from '../types';

// Service interface for type safety
interface AIService {
  isAvailable(): boolean;
  query(prompt: string, options?: QueryOptions): Promise<string>;
}

// Lazy initialization of services to ensure env vars are loaded
// Always recreate services to pick up latest env vars
function getServices(): Record<string, AIService> {
  return {
    yandexgpt: new YandexGPTService(),
    gigachat: new GigaChatService(),
    kandinsky: new KandinskyService(),
    chatgpt_ru: new ChatGPTRUService(),
    openai: new OpenAIService(),
    claude: new ClaudeService()
  };
}

export class AIController {
  async query(req: Request, res: Response): Promise<void> {
    try {
      const { query, providers, options }: QueryRequest = req.body;

      if (!query || query.trim().length === 0) {
        res.status(400).json({
          success: false,
          error: 'Query is required'
        });
        return;
      }

      const selectedProviders = providers || Object.keys(getServices());
      const startTime = Date.now();

      // Parallel queries to all selected AI providers
      const promises = selectedProviders.map(async (providerId): Promise<AIResponse> => {
        const service = getServices()[providerId as keyof ReturnType<typeof getServices>];
        const providerConfig = AI_PROVIDERS[providerId as keyof typeof AI_PROVIDERS];
        const providerName = providerConfig?.name || providerId;
        const providerStartTime = Date.now();

        if (!service) {
          return {
            provider: providerName,
            model: 'unknown',
            response: null,
            status: 'error',
            error: 'Provider not found',
            executionTime: Date.now() - providerStartTime
          };
        }

        if (!service.isAvailable()) {
          return {
            provider: providerName,
            model: 'unknown',
            response: null,
            status: 'error',
            error: 'API key not configured',
            executionTime: Date.now() - providerStartTime
          };
        }

        try {
          const response = await service.query(query, options);
          return {
            provider: providerName,
            model: options?.model || providerConfig.models[0],
            response,
            status: 'success',
            executionTime: Date.now() - providerStartTime
          };
        } catch (error: any) {
          return {
            provider: providerName,
            model: options?.model || providerConfig.models[0],
            response: null,
            status: 'error',
            error: error.message || 'Unknown error occurred',
            executionTime: Date.now() - providerStartTime
          };
        }
      });

      const results = await Promise.all(promises);
      const totalExecutionTime = Date.now() - startTime;

      const response: QueryResponse = {
        success: true,
        results,
        totalExecutionTime
      };

      res.json(response);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error'
      });
    }
  }

  async getProviders(req: Request, res: Response): Promise<void> {
    try {
      const providers: AIProvider[] = Object.entries(getServices()).map(([id, service]) => {
        const config = AI_PROVIDERS[id as keyof typeof AI_PROVIDERS];
        return {
          id,
          name: config.name,
          models: config.models,
          available: service.isAvailable(),
          reason: service.isAvailable() ? undefined : 'API key not configured'
        };
      });

      res.json({ providers });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error'
      });
    }
  }

  async healthCheck(req: Request, res: Response): Promise<void> {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  }
}