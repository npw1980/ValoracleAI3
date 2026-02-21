import { useState, useCallback } from 'react';
import { routeAIRequest, type AIRequest, type AIResponse } from '../services/ai';
import { useAppStore } from '../stores/appStore';
import type { ChatMessage } from '../types';

interface UseAIChatOptions {
  model?: string;
  temperature?: number;
}

export function useAIChat(options: UseAIChatOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addChatMessage } = useAppStore();
  const chatMessages = useAppStore((state) => state.chatMessages);

  const sendMessage = useCallback(async (content: string): Promise<AIResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Add user message
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
      };
      addChatMessage(userMessage);

      // Build messages for API
      const messages = chatMessages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));
      messages.push({ role: 'user', content });

      // Call AI
      const request: AIRequest = {
        messages,
        model: options.model ?? 'claude-opus-4-6',
        temperature: options.temperature ?? 0.7,
      };

      const response = await routeAIRequest(request);

      // Add AI response
      const aiMessage: ChatMessage = {
        id: response.id,
        role: 'assistant',
        content: response.content,
        timestamp: new Date().toISOString(),
      };
      addChatMessage(aiMessage);

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [addChatMessage, chatMessages, options.model, options.temperature]);

  return {
    sendMessage,
    isLoading,
    error,
  };
}
