// AI service types and model configurations
export type ModelProvider = 'vertex' | 'anthropic' | 'open_source';
export type ModelTier = 'frontier' | 'capable' | 'fast';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIRequest {
  messages: ChatMessage[];
  model: string;
  temperature?: number;
  maxTokens?: number;
  provider?: ModelProvider;
  tier?: ModelTier;
}

export interface AIResponse {
  id: string;
  content: string;
  model: string;
  provider: ModelProvider;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
  latency: number;
}

export interface ModelConfig {
  id: string;
  name: string;
  provider: ModelProvider;
  tier: ModelTier;
  contextWindow: number;
  supportsStreaming: boolean;
}

export const MODEL_CONFIGS: Record<string, ModelConfig> = {
  'claude-opus-4-6': {
    id: 'claude-opus-4-6',
    name: 'Claude Opus 4.6',
    provider: 'anthropic',
    tier: 'frontier',
    contextWindow: 200000,
    supportsStreaming: true,
  },
  'claude-sonnet-4-5': {
    id: 'claude-sonnet-4-5',
    name: 'Claude Sonnet 4.5',
    provider: 'anthropic',
    tier: 'capable',
    contextWindow: 200000,
    supportsStreaming: true,
  },
  'llama-3-3-70b': {
    id: 'llama-3-3-70b',
    name: 'Llama 3.3 70B',
    provider: 'open_source',
    tier: 'fast',
    contextWindow: 128000,
    supportsStreaming: true,
  },
};
