/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Plus,
  Send,
  MoreHorizontal,
  Pause,
  Play,
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAppStore } from '../stores/appStore';

// Empty states - no mock data for testing

const workflows: { id: string; name: string; description: string; icon: any; steps: number; duration: string; color: string }[] = [];

const recentWork: { id: string; name: string; type: string; status: string; progress: number }[] = [];

export function WorkLauncher() {
  const navigate = useNavigate();
  const { setValPanelOpen, addChatMessage } = useAppStore();
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [pausedWorkflows, setPausedWorkflows] = useState<Set<string>>(new Set());
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // W-03: Toggle workflow pause/play
  const toggleWorkflowPause = (workId: string) => {
    setPausedWorkflows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(workId)) {
        newSet.delete(workId);
      } else {
        newSet.add(workId);
      }
      return newSet;
    });
    setOpenMenuId(null);
  };
  const [valInput, setValInput] = useState('');

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-600',
      purple: 'bg-purple-100 text-purple-600',
      green: 'bg-green-100 text-green-600',
      amber: 'bg-amber-100 text-amber-600',
    };
    return colors[color] || colors.blue;
  };

  const getNavigatePath = (id: string) => {
    switch (id) {
      case 'launch': return '/launch';
      case 'analyze': return '/analyze';
      case 'contract': return '/contracts';
      default: return '/work';
    }
  };

  // W-01: Handle Val AI input submission
  const handleValSubmit = () => {
    if (!valInput.trim()) return;

    // Add user message to chat
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: valInput,
      timestamp: new Date().toString(),
    };
    addChatMessage(userMessage);

    // Open Val panel to show the conversation
    setValPanelOpen(true);

    // Clear input
    setValInput('');
  };

  const handleValKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleValSubmit();
    }
  };

  // W-02: Get the correct path for continue button based on work type
  const getContinuePath = (work: { id: string; type: string; status: string }) => {
    if (work.status === 'Completed') return '/work';
    switch (work.type) {
      case 'Launch': return '/launch';
      case 'Analysis': return '/analyze';
      case 'Contract': return '/contracts';
      default: return '/work';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 mb-6">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-3">What would you like to do?</h1>
        <p className="text-lg text-slate-500">
          Start a new workflow or continue where you left off. Val can help guide you through any process.
        </p>
      </div>

      {/* Quick Actions with Val - W-01: Input with submit handler */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-800 mb-2">Ask Val to help</h3>
              <p className="text-sm text-slate-600 mb-4">
                Just tell Val what you want to accomplish. Type below or choose an example:
              </p>

              {/* W-01: Input field with submit on Enter/Click */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={valInput}
                    onChange={(e) => setValInput(e.target.value)}
                    onKeyDown={handleValKeyDown}
                    placeholder="Tell Val what you want to do..."
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm bg-white"
                  />
                  <button
                    onClick={handleValSubmit}
                    disabled={!valInput.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Set up a launch for ABC-123', path: '/launch' },
                  { label: 'Run a competitive analysis', path: '/analyze' },
                  { label: 'Create a new contract workflow', path: '/contracts' },
                  { label: 'Analyze evidence gaps', path: '/research' },
                ].map((example, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(example.path)}
                    className="px-3 py-1.5 bg-white rounded-lg border border-blue-200 text-sm text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    "{example.label}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Selection */}
      <div>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Start a New Workflow</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workflows.map((workflow) => (
            <Link
              key={workflow.id}
              to={getNavigatePath(workflow.id)}
              className={`block p-6 rounded-xl border-2 transition-all hover:shadow-md ${
                selectedWorkflow === workflow.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
              onClick={() => setSelectedWorkflow(workflow.id)}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getColorClasses(workflow.color)}`}>
                  <workflow.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 mb-1">{workflow.name}</h3>
                  <p className="text-sm text-slate-500 mb-3">{workflow.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span>{workflow.steps} steps</span>
                    <span>•</span>
                    <span>{workflow.duration}</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Work - W-02: Continue buttons with proper navigation */}
      <div>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Continue Working</h2>
        <div className="space-y-3">
          {recentWork.map((work) => {
            const isPaused = pausedWorkflows.has(work.id);
            return (
            <Card key={work.id} variant="elevated" className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {work.status === 'Completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : isPaused ? (
                      <Pause className="w-5 h-5 text-amber-500" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-slate-800">{work.name}</p>
                      <p className="text-sm text-slate-500">{work.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {work.status !== 'Completed' && (
                      <>
                        {/* W-03: Pause/Play button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleWorkflowPause(work.id)}
                          title={isPaused ? 'Resume' : 'Pause'}
                        >
                          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                        </Button>
                        <div className="w-32">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-slate-500">Progress</span>
                            <span className="font-medium text-slate-700">{work.progress}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${work.progress}%` }}
                            />
                          </div>
                        </div>
                      </>
                    )}
                    {/* W-02: Navigate to specific workflow detail page */}
                    <Button variant="ghost" size="sm" onClick={() => navigate(getContinuePath(work))}>
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                    {/* W-03: 3-dot menu */}
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setOpenMenuId(openMenuId === work.id ? null : work.id)}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                      {openMenuId === work.id && (
                        <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-10">
                          <button
                            className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                            onClick={() => {
                              navigate(getContinuePath(work));
                              setOpenMenuId(null);
                            }}
                          >
                            View Details
                          </button>
                          <button
                            className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                            onClick={() => setOpenMenuId(null)}
                          >
                            Edit
                          </button>
                          <button
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                            onClick={() => setOpenMenuId(null)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
          })}
        </div>
      </div>

      {/* Templates */}
      <div>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Quick Starts</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'New Asset', icon: Plus, path: '/assets' },
            { label: 'New Task', icon: Plus, path: '/workspace' },
            { label: 'New Contract', icon: Plus, path: '/contracts' },
            { label: 'Upload Document', icon: Plus, path: '/research' },
          ].map((action) => (
            <Link
              key={action.label}
              to={action.path}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <action.icon className="w-5 h-5 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
