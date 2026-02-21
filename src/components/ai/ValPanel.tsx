import { useState, useRef, useEffect } from 'react';
import {
  X,
  Minimize2,
  Maximize2,
  Send,
  Sparkles,
  Bot,
  User,
  Lightbulb,
  Zap,
} from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import type { ChatMessage } from '../../types';

interface ValPanelProps {
  open: boolean;
  onClose: () => void;
}

const quickActions = [
  { label: 'Analyze evidence gaps', icon: Lightbulb },
  { label: 'Create launch workflow', icon: Zap },
  { label: 'Generate report', icon: Sparkles },
];

export function ValPanel({ open, onClose }: ValPanelProps) {
  const { valPanelCollapsed, setValPanelCollapsed, chatMessages, addChatMessage, valQuery, setValQuery } = useAppStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevValQueryRef = useRef(valQuery);

  // Apply valQuery from store when panel opens - use ref to avoid cascading renders
  useEffect(() => {
    if (valQuery && valQuery !== prevValQueryRef.current) {
      prevValQueryRef.current = valQuery;
      // Use timeout to avoid synchronous setState in effect
      const timer = setTimeout(() => {
        setInput(valQuery);
        setValQuery('');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [valQuery, setValQuery]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    addChatMessage(userMessage);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I understand you want to "${input}". Let me help you with that.\n\nAs your AI assistant, I can:\n- Navigate to any page or asset\n- Create workflows and tasks\n- Analyze data and generate insights\n- Answer questions about your portfolio\n\nWhat would you like me to do?`,
        timestamp: new Date().toISOString(),
        actions: [
          { id: '1', label: 'Show me assets', type: 'suggestion', action: 'navigate:/assets' },
          { id: '2', label: 'Create workflow', type: 'command', action: 'workflow:create' },
        ],
      };
      addChatMessage(aiResponse);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!open) return null;

  return (
    <div
      className={`
        bg-white border-l border-slate-200 flex flex-col transition-all duration-200
        ${valPanelCollapsed ? 'w-16' : 'w-96'}
        ${open ? 'translate-x-0' : 'translate-x-full'}
      `}
    >
      {/* Header */}
      <div className="h-12 px-4 flex items-center justify-between border-b border-slate-200 shrink-0">
        {valPanelCollapsed ? (
          <Sparkles className="w-5 h-5 text-blue-600" />
        ) : (
          <>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Val</h3>
                <p className="text-xs text-slate-500">Your AI Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setValPanelCollapsed(!valPanelCollapsed)}
                className="p-1.5 rounded hover:bg-slate-100 text-slate-500"
              >
                {valPanelCollapsed ? (
                  <Maximize2 className="w-4 h-4" />
                ) : (
                  <Minimize2 className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>

      {!valPanelCollapsed && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                  <Bot className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="text-sm font-medium text-slate-800 mb-1">
                  Hi, I'm Val
                </h4>
                <p className="text-xs text-slate-500 mb-4">
                  Your AI colleague. Ask me anything.
                </p>
                <div className="space-y-2">
                  {quickActions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(action.label)}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-sm text-slate-600 transition-colors"
                    >
                      <action.icon className="w-4 h-4 text-blue-500" />
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center shrink-0
                      ${msg.role === 'user' ? 'bg-slate-200' : 'bg-blue-100'}
                    `}
                  >
                    {msg.role === 'user' ? (
                      <User className="w-4 h-4 text-slate-600" />
                    ) : (
                      <Bot className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div
                    className={`
                      max-w-[80%] rounded-2xl px-4 py-2
                      ${msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-800'
                      }
                    `}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    {msg.actions && (
                      <div className="mt-3 space-y-1.5">
                        {msg.actions.map((action) => (
                          <button
                            key={action.id}
                            className={`
                              w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                              ${msg.role === 'user'
                                ? 'bg-blue-700 hover:bg-blue-800 text-blue-100'
                                : 'bg-white hover:bg-blue-50 text-blue-700 border border-blue-200'
                              }
                            `}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-blue-600" />
                </div>
                <div className="bg-slate-100 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Val anything..."
                  rows={1}
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none text-sm"
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-center">
              Val can make mistakes. Please verify important information.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
