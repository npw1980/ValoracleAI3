import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logAuditEvent, getAuditQueue } from './audit';

describe('audit', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('queues audit events', () => {
    logAuditEvent('asset_viewed', 'asset', 'asset-123');

    const queue = getAuditQueue();
    expect(queue).toHaveLength(1);
    expect(queue[0].action).toBe('asset_viewed');
    expect(queue[0].resourceType).toBe('asset');
    expect(queue[0].resourceId).toBe('asset-123');
  });

  it('includes client id from store', () => {
    logAuditEvent('asset_viewed', 'asset', 'asset-123');

    const queue = getAuditQueue();
    expect(queue[0].clientId).toBe('anonymous'); // No client set in test
  });
});
