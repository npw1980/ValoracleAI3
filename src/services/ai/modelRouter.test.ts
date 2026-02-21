import { describe, it, expect, beforeEach } from 'vitest';
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
