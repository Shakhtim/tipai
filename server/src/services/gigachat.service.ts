import axios from 'axios';
import { QueryOptions } from '../types';
import { AI_PROVIDERS, DEFAULT_OPTIONS } from '../config/aiProviders';

export class GigaChatService {
  private apiKey: string | undefined;
  private endpoint: string;
  private accessToken: string = '';

  constructor() {
    this.apiKey = process.env.GIGACHAT_API_KEY;
    this.endpoint = AI_PROVIDERS.gigachat.endpoint;
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken) {
      return this.accessToken;
    }

    if (!this.apiKey) {
      throw new Error('GigaChat API key not configured');
    }

    const response = await axios.post(
      'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
      'scope=GIGACHAT_API_PERS',
      {
        headers: {
          'Authorization': `Basic ${this.apiKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'RqUID': Date.now().toString()
        }
      }
    );

    this.accessToken = response.data.access_token;
    return this.accessToken!;
  }

  async query(prompt: string, options: QueryOptions = {}): Promise<string> {
    if (!this.apiKey) {
      throw new Error('GigaChat API key not configured');
    }

    const token = await this.getAccessToken();

    const response = await axios.post(
      this.endpoint,
      {
        model: options.model || 'GigaChat',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: options.temperature || DEFAULT_OPTIONS.temperature,
        max_tokens: options.maxTokens || DEFAULT_OPTIONS.maxTokens
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }
}