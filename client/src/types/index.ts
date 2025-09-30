export type AIProvider = {
  id: string;
  name: string;
  models: string[];
  available: boolean;
  reason?: string;
};

export type QueryRequest = {
  query: string;
  providers?: string[];
  options?: QueryOptions;
};

export type QueryOptions = {
  temperature?: number;
  maxTokens?: number;
  model?: string;
};

export type AIResponse = {
  provider: string;
  model: string;
  response: string | null;
  status: 'success' | 'error' | 'loading';
  error?: string;
  executionTime: number;
  tokensUsed?: number;
};

export type QueryResponse = {
  success: boolean;
  results: AIResponse[];
  totalExecutionTime: number;
};