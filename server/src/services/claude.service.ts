import axios from 'axios';
import { QueryOptions } from '../types';
import { AI_PROVIDERS, DEFAULT_OPTIONS } from '../config/aiProviders';

export class ClaudeService {
  private apiKey: string | undefined;
  private endpoint: string;

  constructor() {
    this.apiKey = process.env.ANTHROPIC_API_KEY;
    this.endpoint = AI_PROVIDERS.claude.endpoint;
  }

  async query(prompt: string, options: QueryOptions = {}): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Anthropic API key not configured');
    }

    const response = await axios.post(
      this.endpoint,
      {
        model: options.model || 'claude-3-sonnet-20240229',
        messages: [{ role: 'user', content: prompt }],
        temperature: options.temperature || DEFAULT_OPTIONS.temperature,
        max_tokens: options.maxTokens || DEFAULT_OPTIONS.maxTokens
      },
      {
        headers: {
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.content[0].text;
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }
}