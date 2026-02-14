import { Sparkles, X, ArrowRight } from 'lucide-react';

interface AISuggestionProps {
  title: string;
  description?: string;
  suggestions?: string[];
  onDismiss?: () => void;
  onAction?: (action: string) => void;
}

export function AISuggestion({ title, description, suggestions, onDismiss, onAction }: AISuggestionProps) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900">{title}</p>
              {description && (
                <p className="text-xs text-blue-700 mt-0.5">{description}</p>
              )}
            </div>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="p-1 rounded hover:bg-blue-100 text-blue-400"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {suggestions && suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {suggestions.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => onAction?.(suggestion)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-200 rounded-lg text-xs font-medium text-blue-700 hover:bg-blue-50 transition-colors"
                >
                  {suggestion}
                  <ArrowRight className="w-3 h-3" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface InlineAIActionProps {
  label: string;
  onClick: () => void;
}

export function InlineAIAction({ label, onClick }: InlineAIActionProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
    >
      <Sparkles className="w-3 h-3" />
      {label}
    </button>
  );
}
