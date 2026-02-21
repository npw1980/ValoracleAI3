import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAppStore } from './appStore';

describe('appStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAppStore.setState({
      notifications: [],
      valQuery: '',
      chatMessages: [],
      commandPaletteOpen: false,
      sidebarOpen: true,
    });
  });

  describe('Notifications', () => {
    it('adds a notification', () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.addNotification({
          id: '1',
          title: 'Test',
          message: 'Test message',
          type: 'info',
          read: false,
          createdAt: new Date().toISOString(),
        });
      });

      expect(result.current.notifications).toHaveLength(1);
      expect(result.current.notifications[0].title).toBe('Test');
    });

    it('marks notification as read', () => {
      const { result } = renderHook(() => useAppStore());

      // Add notification first
      act(() => {
        result.current.addNotification({
          id: '1',
          title: 'Test',
          message: 'Test message',
          type: 'info',
          read: false,
          createdAt: new Date().toISOString(),
        });
      });

      // Mark as read
      act(() => {
        result.current.markNotificationRead('1');
      });

      expect(result.current.notifications[0].read).toBe(true);
    });
  });

  describe('Val Panel', () => {
    it('sets val query', () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.setValQuery('test query');
      });

      expect(result.current.valQuery).toBe('test query');
    });

    it('clears val query', () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.setValQuery('test query');
      });

      act(() => {
        result.current.setValQuery('');
      });

      expect(result.current.valQuery).toBe('');
    });
  });

  describe('Chat Messages', () => {
    it('adds chat message', () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.addChatMessage({
          id: '1',
          role: 'user',
          content: 'Hello',
          timestamp: new Date().toISOString(),
        });
      });

      expect(result.current.chatMessages).toHaveLength(1);
      expect(result.current.chatMessages[0].content).toBe('Hello');
    });
  });

  describe('Command Palette', () => {
    it('opens and closes command palette', () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.setCommandPaletteOpen(true);
      });

      expect(result.current.commandPaletteOpen).toBe(true);

      act(() => {
        result.current.setCommandPaletteOpen(false);
      });

      expect(result.current.commandPaletteOpen).toBe(false);
    });
  });

  describe('Sidebar', () => {
    it('toggles sidebar', () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.setSidebarOpen(false);
      });

      expect(result.current.sidebarOpen).toBe(false);
    });
  });

  describe('Settings', () => {
    it('updates settings', () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.updateSettings({ theme: 'dark' });
      });

      expect(result.current.settings.theme).toBe('dark');
    });
  });
});
