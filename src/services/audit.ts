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

// Export queue for testing
export function getAuditQueue(): AuditLogEntry[] {
  return auditQueue;
}
