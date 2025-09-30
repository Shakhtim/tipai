import axios from 'axios';
import { QueryOptions } from '../types';
import { AI_PROVIDERS, DEFAULT_OPTIONS } from '../config/aiProviders';

export class OpenAIService {
  private apiKey: string | undefined;
  private endpoint: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.endpoint = AI_PROVIDERS.openai.endpoint;
  }

  async query(prompt: string, options: QueryOptions = {}): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await axios.post(
      this.endpoint,
      {
        model: options.model || 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: options.temperature || DEFAULT_OPTIONS.temperature,
        max_tokens: options.maxTokens || DEFAULT_OPTIONS.maxTokens
      },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
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