export interface AIProvider {
  id: string;
  name: string;
  models: string[];
  available: boolean;
  reason?: string;
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface QueryRequest {
  query: string;
  providers?: string[];
  options?: QueryOptions;
  conversationHistory?: ConversationMessage[];
}

export interface QueryOptions {
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

export interface AIResponse {
  provider: string;
  model: string;
  response: string | null;
  status: 'success' | 'error';
  error?: string;
  executionTime: number;
  tokensUsed?: number;
}

export interface QueryResponse {
  success: boolean;
  results: AIResponse[];
  totalExecutionTime: number;
}