import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  Clock,
  ArrowRight,
  BarChart3,
  FileText,
  CheckSquare,
  Users,
  FlaskConical,
} from 'lucide-react';
import { useAppStore } from '../../stores/appStore';

// Mock search results
const searchData = {
  assets: [
    { id: '1', name: 'ABC-123', subtitle: 'Oncology Candidate X', type: 'asset', url: '/assets/1' },
    { id: '2', name: 'DEF-456', subtitle: 'Cardio Drug Y', type: 'asset', url: '/assets/2' },
    { id: '3', name: 'GHI-789', subtitle: 'Neuro Agent Z', type: 'asset', url: '/assets/3' },
  ],
  tasks: [
    { id: '1', name: 'Review ABC-123 evidence gaps', subtitle: 'Due Today', type: 'task', url: '/workspace' },
    { id: '2', name: 'Submit pricing proposal', subtitle: 'Due Tomorrow', type: 'task', url: '/workspace' },
  ],
  documents: [
    { id: '1', name: 'Competitive Analysis - NSCLC', subtitle: 'Updated 2 hours ago', type: 'document', url: '/research' },
    { id: '2', name: 'ABC-123 Evidence Gap Analysis', subtitle: 'Updated Yesterday', type: 'document', url: '/research' },
  ],
  workflows: [
    { id: '1', name: 'ABC-123 Launch Workflow', subtitle: 'Active - 65%', type: 'workflow', url: '/launch' },
  ],
};

interface SearchResult {
  id: string;
  name: string;
  subtitle: string;
  type: 'asset' | 'task' | 'document' | 'workflow';
  url: string;
}

export function GlobalSearch() {
  const navigate = useNavigate();
  const { commandPaletteOpen, setCommandPaletteOpen } = useAppStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches] = useState(['ABC-123', 'launch workflow', 'pricing analysis']);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter results based on query
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const allResults: SearchResult[] = [];

    // Search through all categories
    Object.entries(searchData).forEach(([category, items]) => {
      items.forEach((item: any) => {
        if (
          item.name.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q)
        ) {
          allResults.push({
            ...item,
            type: category.slice(0, -1) as SearchResult['type'],
          });
        }
      });
    });

    setResults(allResults.slice(0, 8));
    setSelectedIndex(0);
  }, [query]);

  // Focus input when opened
  useEffect(() => {
    if (commandPaletteOpen) {
      inputRef.current?.focus();
      setQuery('');
      setResults([]);
    }
  }, [commandPaletteOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!commandPaletteOpen) return;

      switch (e.key) {
        case 'Escape':
          setCommandPaletteOpen(false);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(i => Math.min(i + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(i => Math.max(i - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            navigate(results[selectedIndex].url);
            setCommandPaletteOpen(false);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, results, selectedIndex, navigate, setCommandPaletteOpen]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'asset': return BarChart3;
      case 'task': return CheckSquare;
      case 'document': return FileText;
      case 'workflow': return FlaskConical;
      default: return Search;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'asset': return 'bg-blue-100 text-blue-600';
      case 'task': return 'bg-amber-100 text-amber-600';
      case 'document': return 'bg-purple-100 text-purple-600';
      case 'workflow': return 'bg-green-100 text-green-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  if (!commandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setCommandPaletteOpen(false)}
      />

      {/* Search Panel */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search assets, tasks, documents..."
            className="flex-1 text-lg outline-none placeholder:text-slate-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded hover:bg-slate-100 text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="px-2 py-1 text-xs bg-slate-100 rounded border border-slate-200 text-slate-500">
            ESC
          </kbd>
        </div>

        {/* Results or Recent */}
        <div className="max-h-96 overflow-y-auto">
          {query.trim() ? (
            // Search Results
            results.length > 0 ? (
              <div className="py-2">
                <div className="px-4 py-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Results
                </div>
                {results.map((result, index) => {
                  const Icon = getTypeIcon(result.type);
                  return (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => {
                        navigate(result.url);
                        setCommandPaletteOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                        ${index === selectedIndex ? 'bg-blue-50' : 'hover:bg-slate-50'}
                      `}
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${getTypeColor(result.type)}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate ${index === selectedIndex ? 'text-blue-700' : 'text-slate-800'}`}>
                          {result.name}
                        </p>
                        <p className="text-sm text-slate-500 truncate">{result.subtitle}</p>
                      </div>
                      {index === selectedIndex && (
                        <ArrowRight className="w-4 h-4 text-blue-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center">
                <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No results found for "{query}"</p>
              </div>
            )
          ) : (
            // Recent Searches
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Recent Searches
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={search}
                  onClick={() => setQuery(search)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors
                    ${index === selectedIndex ? 'bg-blue-50' : 'hover:bg-slate-50'}
                  `}
                >
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className={index === selectedIndex ? 'text-blue-700' : 'text-slate-700'}>
                    {search}
                  </span>
                </button>
              ))}

              {/* Quick Links */}
              <div className="px-4 py-2 text-xs font-medium text-slate-500 uppercase tracking-wider mt-4">
                Quick Links
              </div>
              {[
                { label: 'Go to Dashboard', icon: BarChart3, url: '/' },
                { label: 'Go to Assets', icon: BarChart3, url: '/assets' },
                { label: 'Go to Workspace', icon: Users, url: '/workspace' },
              ].map((link, index) => (
                <button
                  key={link.label}
                  onClick={() => {
                    navigate(link.url);
                    setCommandPaletteOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors
                    ${index + recentSearches.length === selectedIndex ? 'bg-blue-50' : 'hover:bg-slate-50'}
                  `}
                >
                  <link.icon className="w-4 h-4 text-slate-400" />
                  <span className={index + recentSearches.length === selectedIndex ? 'text-blue-700' : 'text-slate-700'}>
                    {link.label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-400">
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
