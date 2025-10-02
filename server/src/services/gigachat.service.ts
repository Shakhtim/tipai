import axios from 'axios';
import https from 'https';
import { randomUUID } from 'crypto';
import { QueryOptions } from '../types';
import { AI_PROVIDERS, DEFAULT_OPTIONS } from '../config/aiProviders';

export class GigaChatService {
  private authToken: string | undefined;
  private endpoint: string;
  private accessToken: string = '';
  private tokenExpiry: number = 0;
  private httpsAgent: https.Agent;

  constructor() {
    this.authToken = process.env.GIGACHAT_AUTH_TOKEN;
    this.endpoint = AI_PROVIDERS.gigachat.endpoint;

    // Отключаем проверку SSL сертификата для GigaChat
    this.httpsAgent = new https.Agent({
      rejectUnauthorized: false
    });
  }

  private async getAccessToken(): Promise<string> {
    const now = Date.now();

    // Проверяем, не истек ли токен (с запасом 5 минут)
    if (this.accessToken && this.tokenExpiry > now + 300000) {
      return this.accessToken;
    }

    if (!this.authToken) {
      throw new Error('GigaChat credentials not configured');
    }

    try {
      const payload = 'scope=GIGACHAT_API_PERS';

      const response = await axios.post(
        'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
        payload,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'RqUID': randomUUID(),
            'Authorization': `Basic ${this.authToken}`
          },
          httpsAgent: this.httpsAgent
        }
      );

      this.accessToken = response.data.access_token;
      // Токен действует 30 минут (1800000 мс)
      this.tokenExpiry = now + 1800000;

      return this.accessToken;
    } catch (error: any) {
      console.error('GigaChat OAuth error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      });
      throw new Error(`Failed to get GigaChat access token: ${JSON.stringify(error.response?.data) || error.message}`);
    }
  }

  async query(prompt: string, options: QueryOptions = {}): Promise<string> {
    return this.queryWithHistory([{ role: 'user', content: prompt }], options);
  }

  async queryWithHistory(messages: Array<{role: string; content: string}>, options: QueryOptions = {}): Promise<string> {
    if (!this.authToken) {
      throw new Error('GigaChat credentials not configured');
    }

    const token = await this.getAccessToken();

    // Convert generic messages to GigaChat format
    const gigachatMessages = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    }));

    const response = await axios.post(
      this.endpoint,
      {
        model: options.model || 'GigaChat',
        messages: gigachatMessages,
        temperature: options.temperature || DEFAULT_OPTIONS.temperature,
        max_tokens: options.maxTokens || DEFAULT_OPTIONS.maxTokens
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        httpsAgent: this.httpsAgent
      }
    );

    return response.data.choices[0].message.content;
  }

  isAvailable(): boolean {
    return !!this.authToken;
  }
}