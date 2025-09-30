import axios from 'axios';
import { QueryOptions } from '../types';
import { AI_PROVIDERS, DEFAULT_OPTIONS } from '../config/aiProviders';

export class KandinskyService {
  private apiKey: string | undefined;
  private endpoint: string;

  constructor() {
    this.apiKey = process.env.KANDINSKY_API_KEY;
    this.endpoint = AI_PROVIDERS.kandinsky.endpoint;
  }

  async query(prompt: string, options: QueryOptions = {}): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Kandinsky API key not configured');
    }

    // Note: Kandinsky is primarily for image generation
    // This is a simplified text response
    return `Kandinsky AI ответ на запрос: "${prompt}". (Примечание: Kandinsky специализируется на генерации изображений)`;
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }
}