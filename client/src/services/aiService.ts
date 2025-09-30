import axios from 'axios';
import type { QueryRequest, QueryResponse, AIProvider } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log('Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const aiService = {
  async query(data: QueryRequest): Promise<QueryResponse> {
    const response = await apiClient.post<QueryResponse>('/query', data);
    return response.data;
  },

  async getProviders(): Promise<AIProvider[]> {
    const response = await apiClient.get<{ providers: AIProvider[] }>('/providers');
    return response.data.providers;
  },

  async healthCheck(): Promise<{ status: string; timestamp: string; uptime: number }> {
    const response = await apiClient.get('/health');
    return response.data;
  }
};