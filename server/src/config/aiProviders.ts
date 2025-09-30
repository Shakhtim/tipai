export const AI_PROVIDERS = {
  yandexgpt: {
    id: 'yandexgpt',
    name: 'YandexGPT',
    models: ['yandexgpt-lite', 'yandexgpt'],
    apiKeyEnv: 'YANDEX_API_KEY',
    folderIdEnv: 'YANDEX_FOLDER_ID',
    endpoint: 'https://llm.api.cloud.yandex.net/foundationModels/v1/completion'
  },
  gigachat: {
    id: 'gigachat',
    name: 'GigaChat',
    models: ['GigaChat', 'GigaChat-Pro'],
    apiKeyEnv: 'GIGACHAT_API_KEY',
    endpoint: 'https://gigachat.devices.sberbank.ru/api/v1/chat/completions'
  },
  kandinsky: {
    id: 'kandinsky',
    name: 'Kandinsky AI',
    models: ['kandinsky-3.0', 'kandinsky-2.2'],
    apiKeyEnv: 'KANDINSKY_API_KEY',
    endpoint: 'https://api-key.fusionbrain.ai/key/api/v1/text2image/run'
  },
  chatgpt_ru: {
    id: 'chatgpt_ru',
    name: 'ChatGPT RU',
    models: ['gpt-3.5-turbo', 'gpt-4'],
    apiKeyEnv: 'CHATGPT_RU_API_KEY',
    endpoint: 'https://api.chatgpt.com/v1/chat/completions'
  },
  openai: {
    id: 'openai',
    name: 'OpenAI GPT',
    models: ['gpt-4', 'gpt-3.5-turbo', 'gpt-4-turbo'],
    apiKeyEnv: 'OPENAI_API_KEY',
    endpoint: 'https://api.openai.com/v1/chat/completions'
  },
  claude: {
    id: 'claude',
    name: 'Anthropic Claude',
    models: ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'],
    apiKeyEnv: 'ANTHROPIC_API_KEY',
    endpoint: 'https://api.anthropic.com/v1/messages'
  }
};

export const DEFAULT_OPTIONS = {
  temperature: 0.7,
  maxTokens: 500
};