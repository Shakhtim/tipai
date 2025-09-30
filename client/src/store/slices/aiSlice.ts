import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { aiService } from '../../services/aiService';
import type { QueryRequest, AIResponse, AIProvider } from '../../types';

interface AIState {
  providers: AIProvider[];
  selectedProviders: string[];
  currentQuery: string;
  results: AIResponse[];
  loading: boolean;
  error: string | null;
  totalExecutionTime: number;
}

const initialState: AIState = {
  providers: [],
  selectedProviders: [],
  currentQuery: '',
  results: [],
  loading: false,
  error: null,
  totalExecutionTime: 0
};

export const fetchProviders = createAsyncThunk(
  'ai/fetchProviders',
  async () => {
    const providers = await aiService.getProviders();
    return providers;
  }
);

export const fetchAIResponses = createAsyncThunk(
  'ai/fetchResponses',
  async (data: QueryRequest) => {
    const response = await aiService.query(data);
    return response;
  }
);

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    setCurrentQuery: (state, action: PayloadAction<string>) => {
      state.currentQuery = action.payload;
    },
    setSelectedProviders: (state, action: PayloadAction<string[]>) => {
      state.selectedProviders = action.payload;
    },
    toggleProvider: (state, action: PayloadAction<string>) => {
      const provider = action.payload;
      if (state.selectedProviders.includes(provider)) {
        state.selectedProviders = state.selectedProviders.filter(p => p !== provider);
      } else {
        state.selectedProviders.push(provider);
      }
    },
    clearResults: (state) => {
      state.results = [];
      state.error = null;
      state.totalExecutionTime = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch providers
      .addCase(fetchProviders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProviders.fulfilled, (state, action) => {
        state.loading = false;
        state.providers = action.payload;
        state.selectedProviders = action.payload
          .filter(p => p.available)
          .map(p => p.id);
      })
      .addCase(fetchProviders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch providers';
      })
      // Fetch AI responses
      .addCase(fetchAIResponses.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.results = [];
      })
      .addCase(fetchAIResponses.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.results;
        state.totalExecutionTime = action.payload.totalExecutionTime;
      })
      .addCase(fetchAIResponses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch AI responses';
      });
  }
});

export const { setCurrentQuery, setSelectedProviders, toggleProvider, clearResults } = aiSlice.actions;
export default aiSlice.reducer;