import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  LayoutDashboard,
  FolderOpen,
  FileText,
  Rocket,
  Settings,
  Users,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { useAppStore } from '../../stores/appStore';

const commands = [
  { id: 'dashboard', label: 'Go to Dashboard', icon: LayoutDashboard, path: '/' },
  { id: 'assets', label: 'Go to Assets', icon: FolderOpen, path: '/assets' },
  { id: 'research', label: 'Go to Research', icon: FileText, path: '/research' },
  { id: 'launch', label: 'Go to Launch', icon: Rocket, path: '/launch' },
  { id: 'workspace', label: 'Go to Workspace', icon: Users, path: '/workspace' },
  { id: 'settings', label: 'Go to Settings', icon: Settings, path: '/settings' },
  { id: 'new-asset', label: 'Create new asset', icon: Plus, action: 'create-asset' },
  { id: 'new-workflow', label: 'Create new workflow', icon: Plus, action: 'create-workflow' },
];

export function CommandPalette() {
  const navigate = useNavigate();
  const { setCommandPaletteOpen } = useAppStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, filteredCommands.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
        const cmd = filteredCommands[selectedIndex];
        if (cmd.path) {
          navigate(cmd.path);
        }
        setCommandPaletteOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [filteredCommands, selectedIndex, navigate, setCommandPaletteOpen]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => setCommandPaletteOpen(false)}
      />

      {/* Palette */}
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search or type a command..."
            className="flex-1 text-base outline-none placeholder:text-slate-400"
          />
          <kbd className="px-2 py-0.5 text-xs bg-slate-100 rounded border border-slate-200 text-slate-500">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-2">
          {filteredCommands.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-slate-500">
              No results found for "{query}"
            </p>
          ) : (
            filteredCommands.map((cmd, index) => (
              <button
                key={cmd.id}
                onClick={() => {
                  if (cmd.path) navigate(cmd.path);
                  setCommandPaletteOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors
                  ${index === selectedIndex ? 'bg-blue-50' : 'hover:bg-slate-50'}
                `}
              >
                <div className={`
                  w-8 h-8 rounded-lg flex items-center justify-center
                  ${index === selectedIndex ? 'bg-blue-100' : 'bg-slate-100'}
                `}>
                  <cmd.icon className={`w-4 h-4 ${index === selectedIndex ? 'text-blue-600' : 'text-slate-500'}`} />
                </div>
                <span className={`flex-1 text-sm ${index === selectedIndex ? 'text-blue-700 font-medium' : 'text-slate-700'}`}>
                  {cmd.label}
                </span>
                {index === selectedIndex && (
                  <ArrowRight className="w-4 h-4 text-blue-400" />
                )}
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-slate-100 rounded">↑↓</kbd> Navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-slate-100 rounded">↵</kbd> Select
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-slate-100 rounded">esc</kbd> Close
          </span>
        </div>
      </div>
    </div>
  );
}
