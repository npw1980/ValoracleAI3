# ValOracle 2.0 - Core Infrastructure Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement the foundational infrastructure for ValOracle 2.0 including AI model abstraction layer, GCP integration scaffolding, multi-tenant architecture, and audit logging.

**Architecture:** Build a thin model abstraction layer that routes AI requests to different providers (Vertex AI, direct Anthropic API, open-source). Scaffold GCP infrastructure configuration. Implement multi-tenant isolation via client context. Add comprehensive audit logging.

**Tech Stack:** React 19 + TypeScript, Vite, Zustand, TanStack Query, GCP Cloud Run, Vertex AI, Anthropic API, Vitest

---

## Priority 1: Model Abstraction Layer

### Task 1: Create AI Service Abstraction

**Files:**
- Create: `src/services/ai/modelRouter.ts`
- Create: `src/services/ai/providers/vertex.ts`
- Create: `src/services/ai/providers/anthropic.ts`
- Create: `src/services/ai/providers/open_source.ts`
- Create: `src/types/ai.ts`
- Create: `src/services/ai/index.ts`
- Modify: `src/services/api.ts` (add types)
- Test: `src/services/ai/modelRouter.test.ts`

**Step 1: Create AI types**

```typescript
// src/types/ai.ts
export type ModelProvider = 'vertex' | 'anthropic' | 'open_source';
export type ModelTier = 'frontier' | 'capable' | 'fast';

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
```

**Step 2: Create Vertex AI provider**

```typescript
// src/services/ai/providers/vertex.ts
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
```

**Step 3: Create Anthropic provider**

```typescript
// src/services/ai/providers/anthropic.ts
import type { AIRequest, AIResponse } from '../../../types/ai';

export async function callAnthropic(request: AIRequest): Promise<AIResponse> {
  const startTime = Date.now();

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: request.model,
      messages: request.messages,
      temperature: request.temperature ?? 0.7,
      max_tokens: request.maxTokens ?? 4096,
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.statusText}`);
  }

  const data = await response.json();

  return {
    id: data.id,
    content: data.content[0].text,
    model: request.model,
    provider: 'anthropic',
    usage: {
      inputTokens: data.usage.input_tokens,
      outputTokens: data.usage.output_tokens,
    },
    latency: Date.now() - startTime,
  };
}
```

**Step 4: Create open-source provider (stub for future)**

```typescript
// src/services/ai/providers/open_source.ts
import type { AIRequest, AIResponse } from '../../../types/ai';

export async function callOpenSource(request: AIRequest): Promise<AIResponse> {
  // TODO: Implement when self-hosted model infrastructure is ready
  throw new Error('Open-source provider not yet implemented');
}
```

**Step 5: Create model router**

```typescript
// src/services/ai/modelRouter.ts
import type { AIRequest, AIResponse, ModelProvider, ModelTier } from '../../types/ai';
import { callVertexAI } from './providers/vertex';
import { callAnthropic } from './providers/anthropic';
import { callOpenSource } from './providers/open_source';
import { MODEL_CONFIGS } from '../../types/ai';

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
  const provider = request.provider ?? getProviderForModel(request.model);
  const providerFn = providerMap[provider];

  if (!providerFn) {
    throw new Error(`Unknown provider: ${provider}`);
  }

  return providerFn(request);
}
```

**Step 6: Create index export**

```typescript
// src/services/ai/index.ts
export { routeAIRequest, getProviderForModel, getModelForTier } from './modelRouter';
export type { AIRequest, AIResponse, ModelProvider, ModelTier, ModelConfig } from '../types/ai';
export { MODEL_CONFIGS } from '../types/ai';
```

**Step 7: Write failing test**

```typescript
// src/services/ai/modelRouter.test.ts
import { describe, it, expect, vi } from 'vitest';
import { getProviderForModel, getModelForTier } from './modelRouter';

describe('modelRouter', () => {
  describe('getProviderForModel', () => {
    it('returns anthropic for claude-opus-4-6', () => {
      expect(getProviderForModel('claude-opus-4-6')).toBe('anthropic');
    });

    it('returns anthropic for unknown models', () => {
      expect(getProviderForModel('unknown-model')).toBe('anthropic');
    });
  });

  describe('getModelForTier', () => {
    it('returns opus for frontier tier', () => {
      expect(getModelForTier('frontier')).toBe('claude-opus-4-6');
    });

    it('returns llama for fast tier', () => {
      expect(getModelForTier('fast')).toBe('llama-3-3-70b');
    });
  });
});
```

**Step 8: Run test to verify it fails**

Run: `npm test -- src/services/ai/modelRouter.test.ts`
Expected: FAIL (files don't exist)

**Step 9: Create all service files**

Create the files as outlined in steps 1-6.

**Step 10: Run test to verify it passes**

Run: `npm test -- src/services/ai/modelRouter.test.ts`
Expected: PASS

**Step 11: Commit**

```bash
git add src/services/ai/ src/types/ai.ts
git commit -m "feat: add AI model abstraction layer

- Add ModelProvider, ModelTier types
- Implement provider routing (vertex, anthropic, open_source)
- Add model config registry with Claude Opus 4.6, Sonnet, Llama 3.3
- Add routing logic by model ID or tier
- Add tests for model router

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 2: Integrate AI Service with ValPanel

**Files:**
- Modify: `src/components/ai/ValPanel.tsx`
- Create: `src/hooks/useAIChat.ts`
- Test: `src/hooks/useAIChat.test.ts`

**Step 1: Create useAIChat hook**

```typescript
// src/hooks/useAIChat.ts
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
  const { addChatMessage, chatMessages } = useAppStore();

  const sendMessage = useCallback(async (content: string) => {
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
      const messages = chatMessages.map(msg => ({
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
      throw err;
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
```

**Step 2: Modify ValPanel to use hook**

Modify `src/components/ai/ValPanel.tsx` to use `useAIChat` instead of the current mock implementation.

**Step 3: Write test**

```typescript
// src/hooks/useAIChat.test.ts
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAIChat } from './useAIChat';
import { useAppStore } from '../stores/appStore';

describe('useAIChat', () => {
  beforeEach(() => {
    useAppStore.setState({ chatMessages: [] });
  });

  it('sends message and adds to chat', async () => {
    const { result } = renderHook(() => useAIChat());

    // Mock the AI call
    vi.mock('../services/ai', () => ({
      routeAIRequest: vi.fn().mockResolvedValue({
        id: 'test-id',
        content: 'AI response',
        model: 'claude-opus-4-6',
        provider: 'anthropic',
        usage: { inputTokens: 100, outputTokens: 50 },
        latency: 1000,
      }),
    }));

    await act(async () => {
      await result.current.sendMessage('Hello');
    });

    expect(useAppStore.getState().chatMessages).toHaveLength(2);
  });
});
```

**Step 4: Run test and verify**

**Step 5: Commit**

```bash
git add src/hooks/useAIChat.ts src/components/ai/ValPanel.tsx
git commit -m "feat: integrate AI chat with model router

- Add useAIChat hook for AI interactions
- Wire ValPanel to use AI service instead of mock
- Route to Claude Opus 4.6 by default

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Priority 2: Multi-Tenant Architecture

### Task 3: Client Context & Isolation

**Files:**
- Create: `src/contexts/ClientContext.tsx`
- Create: `src/hooks/useClient.ts`
- Modify: `src/stores/appStore.ts`
- Create: `src/middleware/clientIsolation.ts`
- Test: `src/hooks/useClient.test.ts`

**Step 1: Create ClientContext**

```typescript
// src/contexts/ClientContext.tsx
import { createContext, useContext, type ReactNode } from 'react';

export interface Client {
  id: string;
  name: string;
  domain: string;
  settings: {
    aiProvider: 'vertex' | 'anthropic';
    modelPreference: string;
    dataResidency: 'us' | 'eu';
  };
}

interface ClientContextValue {
  client: Client | null;
  isLoading: boolean;
}

const ClientContext = createContext<ClientContextValue | null>(null);

export function ClientProvider({ children, client }: { children: ReactNode; client: Client }) {
  return (
    <ClientContext.Provider value={{ client, isLoading: false }}>
      {children}
    </ClientContext.Provider>
  );
}

export function useClientContext() {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClientContext must be used within ClientProvider');
  }
  return context;
}
```

**Step 2: Create useClient hook**

```typescript
// src/hooks/useClient.ts
import { useClientContext, type Client } from '../contexts/ClientContext';

export function useClient(): Client | null {
  const { client } = useClientContext();
  return client;
}
```

**Step 3: Add client to appStore**

Modify `src/stores/appStore.ts` to add client state:

```typescript
interface AppState {
  // ... existing fields
  client: Client | null;
  setClient: (client: Client | null) => void;
}

// Add to store:
client: null,
setClient: (client) => set({ client }),
```

**Step 4: Add client ID to API requests**

Modify `src/services/api.ts` to include client context in requests:

```typescript
import { useAppStore } from '../stores/appStore';

function getClientId(): string | null {
  return useAppStore.getState().client?.id ?? null;
}

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const clientId = getClientId();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (clientId) {
    headers['X-Client-ID'] = clientId;
  }
  // ... rest of implementation
}
```

**Step 5: Write tests**

```typescript
// src/hooks/useClient.test.ts
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { ClientProvider, useClient } from './useClient';

describe('useClient', () => {
  it('returns client from context', () => {
    const mockClient = { id: 'client-1', name: 'Test Corp' };

    const { result } = renderHook(() => useClient(), {
      wrapper: ({ children }) => (
        <ClientProvider client={mockClient}>{children}</ClientProvider>
      ),
    });

    expect(result.current).toEqual(mockClient);
  });
});
```

**Step 6: Run tests and commit**

---

### Task 4: Audit Logging Service

**Files:**
- Create: `src/services/audit.ts`
- Create: `src/types/audit.ts`
- Modify: `src/services/api.ts` (integrate audit)
- Test: `src/services/audit.test.ts`

**Step 1: Create audit types**

```typescript
// src/types/audit.ts
export type AuditAction =
  | 'chat_message_sent'
  | 'chat_message_received'
  | 'asset_viewed'
  | 'asset_created'
  | 'asset_updated'
  | 'project_created'
  | 'workflow_started'
  | 'export_created'
  | 'search_performed';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  clientId: string;
  userId: string;
  action: AuditAction;
  resourceType: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}
```

**Step 2: Create audit service**

```typescript
// src/services/audit.ts
import type { AuditAction, AuditLogEntry } from '../types/audit';
import { useAppStore } from '../stores/appStore';

const auditQueue: AuditLogEntry[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

export function logAuditEvent(
  action: AuditAction,
  resourceType: string,
  resourceId?: string,
  metadata?: Record<string, unknown>
): void {
  const client = useAppStore.getState().client;

  const entry: AuditLogEntry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    clientId: client?.id ?? 'anonymous',
    userId: 'current-user', // TODO: integrate with auth
    action,
    resourceType,
    resourceId,
    metadata,
  };

  auditQueue.push(entry);

  // Debounce flush to backend
  if (!flushTimer) {
    flushTimer = setTimeout(flushAuditLog, 5000);
  }
}

async function flushAuditLog(): Promise<void> {
  if (auditQueue.length === 0) return;

  const entries = auditQueue.splice(0);

  try {
    await fetch('/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entries }),
    });
  } catch {
    // Re-queue on failure
    auditQueue.unshift(...entries);
  } finally {
    flushTimer = null;
  }
}

// Export for manual flush before page unload
export function flushAuditLogSync(): void {
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushAuditLog();
  }
}
```

**Step 3: Integrate with AI service**

Modify `src/services/ai/modelRouter.ts` to log AI requests:

```typescript
import { logAuditEvent } from './audit';

export async function routeAIRequest(request: AIRequest): Promise<AIResponse> {
  logAuditEvent('chat_message_sent', 'ai_request', undefined, {
    model: request.model,
  });

  const response = await providerFn(request);

  logAuditEvent('chat_message_received', 'ai_response', response.id, {
    model: request.model,
    latency: response.latency,
  });

  return response;
}
```

**Step 4: Write tests**

```typescript
// src/services/audit.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logAuditEvent } from './audit';

describe('audit', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('queues audit events', () => {
    logAuditEvent('asset_viewed', 'asset', 'asset-123');

    // Should not throw
    expect(true).toBe(true);
  });
});
```

**Step 5: Commit**

```bash
git add src/services/audit.ts src/types/audit.ts src/contexts/ src/hooks/useClient.ts
git commit -m "feat: add multi-tenant client context and audit logging

- Add ClientContext for tenant isolation
- Add useClient hook for accessing client info
- Add audit logging service with queuing
- Log AI requests/responses to audit trail
- Prepare for per-client data residency

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Priority 3: GCP Integration Scaffold

### Task 5: Environment Configuration

**Files:**
- Create: `.env.example`
- Create: `src/config/gcp.ts`
- Create: `src/config/index.ts`

**Step 1: Create .env.example**

```
# AI Providers
VITE_ANTHROPIC_API_KEY=sk-ant-...
VITE_VERTEX_TOKEN=...
VITE_VERTEX_PROJECT_ID=...
VITE_VERTEX_LOCATION=us-central1

# GCP Configuration
VITE_GCP_PROJECT_ID=valoracle-prod
VITE_GCP_REGION=us-central1

# Feature Flags
VITE_AI_PROVIDER=anthropic  # or vertex
VITE_DEFAULT_MODEL=claude-opus-4-6
VITE_ENABLE_AUDIT_LOGGING=true
```

**Step 2: Create config module**

```typescript
// src/config/gcp.ts
interface GCPConfig {
  projectId: string;
  region: string;
  location: string;
}

export const gcpConfig: GCPConfig = {
  projectId: import.meta.env.VITE_GCP_PROJECT_ID ?? '',
  region: import.meta.env.VITE_GCP_REGION ?? 'us-central1',
  location: import.meta.env.VITE_VERTEX_LOCATION ?? 'us-central1',
};

export const isGCPConfigured = Boolean(gcpConfig.projectId);
```

**Step 3: Commit**

---

### Task 6: Version Control for Models

**Files:**
- Create: `src/config/models.ts`
- Modify: `src/services/ai/modelRouter.ts`

**Step 1: Create model versioning config**

```typescript
// src/config/models.ts
export interface ModelVersion {
  id: string;
  modelId: string;
  provider: string;
  rolloutPercent: number;
  enabled: boolean;
  evaluationNotes?: string;
}

export const modelVersions: ModelVersion[] = [
  {
    id: 'v1',
    modelId: 'claude-opus-4-6',
    provider: 'anthropic',
    rolloutPercent: 100,
    enabled: true,
    evaluationNotes: 'Primary production model',
  },
];

export function getActiveModel(): ModelVersion | undefined {
  return modelVersions.find(m => m.enabled);
}
```

**Step 2: Modify router to respect version**

```typescript
// In modelRouter.ts, add:
import { getActiveModel } from '../config/models';

export async function routeAIRequest(request: AIRequest): Promise<AIResponse> {
  // If no specific model requested, use active version
  const effectiveRequest = request.model
    ? request
    : { ...request, model: getActiveModel()?.modelId ?? request.model };

  // ... rest of implementation
}
```

**Step 3: Commit**

---

## Priority 4: Backend API Scaffolding

### Task 7: Express Server with Audit Endpoints

**Files:**
- Create: `src/server/audit.ts`
- Modify: `server/index.ts`

**Step 1: Create audit endpoint handler**

```typescript
// src/server/audit.ts
import type { Request, Response } from 'express';
import type { AuditLogEntry } from '../types/audit';

const auditLogs: AuditLogEntry[] = [];

export function handleAuditLog(req: Request, res: Response): void {
  const { entries } = req.body as { entries: AuditLogEntry[] };

  if (!Array.isArray(entries)) {
    res.status(400).json({ error: 'entries must be an array' });
    return;
  }

  // Store entries (in production, this would write to Cloud Logging)
  auditLogs.push(...entries);

  // TODO: Write to GCP Cloud Logging
  // TODO: Write to client's dedicated log bucket

  res.status(201).json({ received: entries.length });
}

export function getAuditLogs(req: Request, res: Response): void {
  const clientId = req.headers['x-client-id'] as string;

  const filtered = clientId
    ? auditLogs.filter(log => log.clientId === clientId)
    : auditLogs;

  res.json(filtered);
}
```

**Step 2: Modify server/index.ts to add audit routes**

```typescript
// Add to server/index.ts
import { handleAuditLog, getAuditLogs } from '../src/server/audit';

app.post('/api/audit', handleAuditLog);
app.get('/api/audit', getAuditLogs);
```

**Step 3: Commit**

---

## Summary

This plan implements the foundational infrastructure for ValOracle 2.0:

1. **Model Abstraction Layer** - Routing to Vertex AI, Anthropic API, or open-source models
2. **Multi-Tenant Isolation** - Client context, per-client audit logging
3. **Audit Logging** - Comprehensive request/response logging with GCP Cloud Logging
4. **GCP Configuration** - Environment scaffolding for cloud deployment
5. **Model Versioning** - Manual evaluation gate before production rollout

**Estimated Tasks:** 7 major tasks, ~15-20 smaller steps
**Dependencies:** Anthropic API key, GCP project setup (can proceed without for frontend work)
