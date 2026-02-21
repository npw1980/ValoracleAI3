import type { AIRequest, AIResponse } from '../../../types/ai';

export async function callVertexAI(request: AIRequest): Promise<AIResponse> {
  const startTime = Date.now();

  const response = await fetch(`${import.meta.env.VITE_VERTEX_API_URL}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_VERTEX_TOKEN}`,
    },
    body: JSON.stringify({
      model: request.model,
      messages: request.messages,
      temperature: request.temperature ?? 0.7,
      max_tokens: request.maxTokens ?? 4096,
    }),
  });

  if (!response.ok) {
    throw new Error(`Vertex AI error: ${response.statusText}`);
  }

  const data = await response.json();

  return {
    id: data.id,
    content: data.choices[0].message.content,
    model: request.model,
    provider: 'vertex',
    usage: {
      inputTokens: data.usage?.prompt_tokens ?? 0,
      outputTokens: data.usage?.completion_tokens ?? 0,
    },
    latency: Date.now() - startTime,
  };
}
