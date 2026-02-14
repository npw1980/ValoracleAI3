import { X, Tag } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { useAppStore } from '../../stores/appStore';

interface ContextBarProps {
  show?: boolean;
}

export function ContextBar({ show = true }: ContextBarProps) {
  const { currentAsset, setCurrentAsset } = useAppStore();

  if (!show || !currentAsset) return null;

  return (
    <div className="h-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center px-4 gap-3 shrink-0">
      {/* Asset */}
      <div className="flex items-center gap-2">
        <Tag className="w-4 h-4 text-blue-500" />
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Asset:</span>
        <Badge variant="info" className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
          {currentAsset.code}
        </Badge>
      </div>

      <div className="w-px h-5 bg-slate-200 dark:bg-slate-700" />

      {/* Phase */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-500 dark:text-slate-400">Phase:</span>
        <Badge variant="default">{currentAsset.phase}</Badge>
      </div>

      <div className="w-px h-5 bg-slate-200 dark:bg-slate-700" />

      {/* Therapeutic Area */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-500 dark:text-slate-400">Area:</span>
        <span className="text-sm text-slate-700 dark:text-slate-300">{currentAsset.therapeuticArea}</span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Clear Context */}
      <button
        onClick={() => setCurrentAsset(null)}
        className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
      >
        <X className="w-4 h-4" />
        Clear
      </button>
    </div>
  );
}
