import axios from 'axios';
import { QueryOptions } from '../types';
import { AI_PROVIDERS, DEFAULT_OPTIONS } from '../config/aiProviders';

export class YandexGPTService {
  private iamToken: string | undefined;
  private folderId: string | undefined;
  private endpoint: string;

  constructor() {
    this.iamToken = process.env.YANDEX_IAM_TOKEN;
    this.folderId = process.env.YANDEX_FOLDER_ID;
    this.endpoint = AI_PROVIDERS.yandexgpt.endpoint;
  }

  async query(prompt: string, options: QueryOptions = {}): Promise<string> {
    if (!this.iamToken || !this.folderId) {
      throw new Error('Yandex IAM token or Folder ID not configured');
    }

    const modelUri = `gpt://${this.folderId}/${options.model || 'yandexgpt-lite'}/latest`;

    console.log('YandexGPT Request:', {
      endpoint: this.endpoint,
      modelUri,
      folderId: this.folderId,
      hasIAMToken: !!this.iamToken
    });

    try {
      const response = await axios.post(
        this.endpoint,
        {
          modelUri,
          completionOptions: {
            stream: false,
            temperature: options.temperature || DEFAULT_OPTIONS.temperature,
            maxTokens: options.maxTokens || DEFAULT_OPTIONS.maxTokens
          },
          messages: [
            {
              role: 'user',
              text: prompt
            }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${this.iamToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.result.alternatives[0].message.text;
    } catch (error: any) {
      console.error('YandexGPT Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  }

  isAvailable(): boolean {
    return !!(this.iamToken && this.folderId);
  }
}