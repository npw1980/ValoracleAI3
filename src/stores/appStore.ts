import { create } from 'zustand';
import type { Asset, Task, Notification, AppContext, UserSettings, ChatMessage } from '../types';

interface AppState {
  // Context
  context: AppContext;
  setContext: (context: Partial<AppContext>) => void;

  // Assets
  currentAsset: Asset | null;
  setCurrentAsset: (asset: Asset | null) => void;
  assets: Asset[];
  setAssets: (assets: Asset[]) => void;

  // Tasks
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;

  // AI Panel (Val)
  valPanelOpen: boolean;
  valPanelCollapsed: boolean;
  valQuery: string;
  setValPanelOpen: (open: boolean) => void;
  setValPanelCollapsed: (collapsed: boolean) => void;
  setValQuery: (query: string) => void;
  chatMessages: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;

  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Settings
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;

  // Command Palette
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Context
  context: {
    currentView: 'dashboard',
    sidebarOpen: true,
    valPanelOpen: false,
  },
  setContext: (newContext) => set((state) => ({
    context: { ...state.context, ...newContext }
  })),

  // Assets
  currentAsset: null,
  setCurrentAsset: (asset) => set({ currentAsset: asset }),
  assets: [],
  setAssets: (assets) => set({ assets }),

  // Tasks
  tasks: [],
  setTasks: (tasks) => set({ tasks }),

  // Notifications - D-01: Added mock notifications so they actually work
  notifications: [
    { id: '1', title: 'Task Updated', message: 'ABC-123 Launch workflow was updated by John D.', read: false, actionUrl: '/launch', type: 'info', createdAt: new Date().toISOString() },
    { id: '2', title: 'Analysis Complete', message: 'Competitive analysis for NSCLC is ready', read: false, actionUrl: '/analyze', type: 'success', createdAt: new Date().toISOString() },
    { id: '3', title: 'Contract Review', message: 'Payer contract BCBS requires your review', read: false, actionUrl: '/contracts', type: 'warning', createdAt: new Date().toISOString() },
    { id: '4', title: 'Milestone Approaching', message: 'Phase 3 trial enrollment ends in 3 days', read: true, actionUrl: '/assets', type: 'info', createdAt: new Date().toISOString() },
  ],
  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications]
  })),
  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    )
  })),

  // AI Panel (Val)
  valPanelOpen: false,
  valPanelCollapsed: false,
  valQuery: '',
  setValPanelOpen: (open) => set({ valPanelOpen: open }),
  setValPanelCollapsed: (collapsed) => set({ valPanelCollapsed: collapsed }),
  setValQuery: (query) => set({ valQuery: query }),
  chatMessages: [],
  addChatMessage: (message) => set((state) => ({
    chatMessages: [...state.chatMessages, message]
  })),

  // Sidebar
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  sidebarCollapsed: false,
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  // Settings
  settings: {
    id: '1',
    userId: 'user-1',
    theme: 'system',
    aiPreference: 'standard',
    notifications: {
      email: true,
      push: true,
      inApp: true,
    },
  },
  updateSettings: (newSettings) => set((state) => ({
    settings: { ...state.settings, ...newSettings }
  })),

  // Command Palette
  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
}));
