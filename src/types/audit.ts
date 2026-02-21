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
