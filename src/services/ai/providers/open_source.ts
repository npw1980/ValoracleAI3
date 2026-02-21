import type { AIRequest, AIResponse } from '../../../types/ai';

export async function callOpenSource(request: AIRequest): Promise<AIResponse> {
  // TODO: Implement when self-hosted model infrastructure is ready
  throw new Error('Open-source provider not yet implemented');
}
