import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { ContextBar } from './ContextBar';
import { ValPanel } from '../ai/ValPanel';
import { GlobalSearch } from '../ui/GlobalSearch';
import { useAppStore } from '../../stores/appStore';
import type { Asset } from '../../types';

// Initialize with sample data
const initializeStore = (set: any) => {
  // Set initial notifications
  const initialNotifications = [
    { id: '1', title: 'Task Due Tomorrow', message: 'Review ABC-123 evidence gaps is due tomorrow', type: 'warning' as const, read: false, createdAt: new Date().toISOString() },
    { id: '2', title: 'Workflow Updated', message: 'ABC-123 Launch Workflow progressed to Step 8', type: 'info' as const, read: false, createdAt: new Date().toISOString() },
    { id: '3', title: 'Contract Signed', message: 'Payer Contract - BCBS has been executed', type: 'success' as const, read: true, createdAt: new Date().toISOString() },
  ];

  set({ notifications: initialNotifications });
};

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const {
    valPanelOpen,
    setValPanelOpen,
    commandPaletteOpen,
    currentAsset,
    notifications
  } = useAppStore();

  // Initialize store with sample data
  useEffect(() => {
    const store = useAppStore.getState();
    if (store.notifications.length === 0) {
      initializeStore(useAppStore.setState);
    }
  }, []);

  // Set current asset context when on asset detail pages
  useEffect(() => {
    if (location.pathname.startsWith('/assets/') && location.pathname !== '/assets') {
      const assetId = location.pathname.split('/')[2];
      // Set a sample asset as current context
      if (!useAppStore.getState().currentAsset) {
        const sampleAsset: Asset = {
          id: assetId || '1',
          code: 'ABC-123',
          name: 'Oncology Candidate X',
          indication: 'NSCLC',
          phase: 'Phase 2',
          therapeuticArea: 'Oncology',
          status: 'Active',
          team: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        useAppStore.setState({ currentAsset: sampleAsset });
      }
    }
  }, [location]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        useAppStore.getState().setCommandPaletteOpen(true);
      }
      // Cmd/Ctrl + B for sidebar toggle
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        setSidebarOpen(prev => !prev);
      }
      // Cmd/Ctrl + V for Val panel
      if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
        e.preventDefault();
        useAppStore.getState().setValPanelOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900">
      {/* Top Bar */}
      <TopBar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} unreadCount={unreadCount} />

      {/* Context Bar */}
      <ContextBar show={!!currentAsset} />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar open={sidebarOpen} />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>

        {/* AI Assistant Panel */}
        <ValPanel
          open={valPanelOpen}
          onClose={() => setValPanelOpen(false)}
        />
      </div>

      {/* Command Palette */}
      {commandPaletteOpen && <GlobalSearch />}
    </div>
  );
}
