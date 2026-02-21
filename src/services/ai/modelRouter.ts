import type { AIRequest, AIResponse, ModelProvider, ModelTier } from '../../types/ai';
import { callVertexAI } from './providers/vertex';
import { callAnthropic } from './providers/anthropic';
import { callOpenSource } from './providers/open_source';
import { MODEL_CONFIGS } from '../../types/ai';
import { logAuditEvent } from '../audit';
import { getActiveModel } from '../../config/models';

const providerMap: Record<ModelProvider, (req: AIRequest) => Promise<AIResponse>> = {
  vertex: callVertexAI,
  anthropic: callAnthropic,
  open_source: callOpenSource,
};

export function getProviderForModel(modelId: string): ModelProvider {
  const config = MODEL_CONFIGS[modelId];
  if (!config) {
    // Default to Anthropic for unknown models
    return 'anthropic';
  }
  return config.provider;
}

export function getModelForTier(tier: ModelTier): string {
  switch (tier) {
    case 'frontier':
      return 'claude-opus-4-6';
    case 'capable':
      return 'claude-sonnet-4-5';
    case 'fast':
      return 'llama-3-3-70b';
  }
}

export async function routeAIRequest(request: AIRequest): Promise<AIResponse> {
  // If no specific model requested, use active version
  const effectiveModel = request.model || getActiveModel()?.modelId || 'claude-opus-4-6';
  const effectiveRequest = { ...request, model: effectiveModel };

  logAuditEvent('chat_message_sent', 'ai_request', undefined, {
    model: effectiveModel,
  });

  const provider = effectiveRequest.provider ?? getProviderForModel(effectiveModel);
  const providerFn = providerMap[provider];

  if (!providerFn) {
    throw new Error(`Unknown provider: ${provider}`);
  }

  const response = await providerFn(effectiveRequest);

  logAuditEvent('chat_message_received', 'ai_response', response.id, {
    model: effectiveModel,
    latency: response.latency,
  });

  return response;
}
