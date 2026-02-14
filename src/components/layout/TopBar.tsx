import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Settings,
  ChevronDown,
  Command,
  Menu,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { useTheme } from '../../hooks/useTheme';

interface TopBarProps {
  onToggleSidebar?: () => void;
  unreadCount?: number;
}

export function TopBar({ onToggleSidebar, unreadCount: propUnreadCount }: TopBarProps) {
  const navigate = useNavigate();
  const { currentAsset, setCommandPaletteOpen, setValPanelOpen, notifications, markNotificationRead } = useAppStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  const unreadCount = propUnreadCount ?? notifications.filter(n => !n.read).length;

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  return (
    <header className="h-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center px-4 gap-3 shrink-0">
      {/* Menu button (mobile) */}
      <button
        onClick={onToggleSidebar}
        className="lg:hidden p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src="/logo.jpg" alt="ValOracle" className="h-6 w-auto" />
        <span className="font-semibold text-slate-800 dark:text-white hidden sm:block">ValOracle</span>
      </div>

      {/* Context Selector */}
      {currentAsset && (
        <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{currentAsset.code}</span>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>
      )}

      {/* Search */}
      <button
        onClick={() => setCommandPaletteOpen(true)}
        className="flex-1 max-w-md mx-auto flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-400"
      >
        <Search className="w-4 h-4" />
        <span className="text-sm">Search or ask AI...</span>
        <div className="ml-auto hidden sm:flex items-center gap-0.5 text-xs">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <Command className="w-3 h-3 inline" />
          </kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">K</kbd>
        </div>
      </button>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
          title={`Current: ${theme}`}
        >
          {resolvedTheme === 'dark' ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </button>

        {/* Val AI Assistant button */}
        <button
          onClick={() => setValPanelOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-medium transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">Ask Val</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
              <div className="p-3 border-b border-slate-100 dark:border-slate-700">
                <h3 className="font-semibold text-slate-800 dark:text-white">Notifications</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="p-4 text-sm text-slate-500 dark:text-slate-400 text-center">No notifications</p>
                ) : (
                  notifications.slice(0, 5).map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 border-b border-slate-50 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer ${!notif.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                      onClick={() => {
                        // Mark notification as read
                        markNotificationRead(notif.id);
                        // Close the notifications dropdown
                        setShowNotifications(false);
                        // Navigate to action URL if present, otherwise stay on current page
                        if (notif.actionUrl) {
                          navigate(notif.actionUrl);
                        }
                      }}
                    >
                      <p className="text-sm font-medium text-slate-800 dark:text-white">{notif.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <Link to="/settings" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
          <Settings className="w-5 h-5" />
        </Link>

        {/* User avatar */}
        <button className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-medium text-sm hover:ring-2 hover:ring-blue-500 hover:ring-offset-2 dark:hover:ring-offset-slate-900 transition-all">
          NW
        </button>
      </div>
    </header>
  );
}
