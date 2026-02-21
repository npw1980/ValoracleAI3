import type { Request, Response } from 'express';
import type { AuditLogEntry } from '../../types/audit';

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

// Export for testing
export function getInMemoryAuditLogs(): AuditLogEntry[] {
  return auditLogs;
}
