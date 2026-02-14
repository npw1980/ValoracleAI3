import { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Clock,
  Circle,
  Calendar,
  MoreHorizontal,
  GripVertical,
} from 'lucide-react';
import { Badge } from './Badge';

interface WorkflowStep {
  id: string;
  name: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'skipped';
  assignee?: { name: string; avatar?: string };
  dueDate?: string;
}

interface WorkflowPhase {
  id: string;
  name: string;
  steps: WorkflowStep[];
}

interface WorkflowViewerProps {
  phases: WorkflowPhase[];
  onStepClick?: (stepId: string) => void;
}

export function WorkflowViewer({ phases, onStepClick }: WorkflowViewerProps) {
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(
    new Set(phases.map(p => p.id))
  );

  const togglePhase = (phaseId: string) => {
    setExpandedPhases(prev => {
      const next = new Set(prev);
      if (next.has(phaseId)) {
        next.delete(phaseId);
      } else {
        next.add(phaseId);
      }
      return next;
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-500 animate-pulse" />;
      case 'skipped':
        return <Circle className="w-5 h-5 text-slate-300" />;
      default:
        return <Circle className="w-5 h-5 text-slate-300" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'skipped':
        return 'bg-slate-100 text-slate-500 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-400 border-slate-200';
    }
  };

  const completedCount = phases.reduce((acc, phase) =>
    acc + phase.steps.filter(s => s.status === 'completed').length, 0
  );
  const totalCount = phases.reduce((acc, phase) => acc + phase.steps.length, 0);
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Progress Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-medium text-slate-700">Overall Progress</p>
            <p className="text-xs text-slate-500">{completedCount} of {totalCount} steps completed</p>
          </div>
          <p className="text-2xl font-bold text-slate-800">{progress}%</p>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Phases */}
      <div className="space-y-3">
        {phases.map((phase) => {
          const isExpanded = expandedPhases.has(phase.id);
          const phaseCompleted = phase.steps.every(s => s.status === 'completed');
          const phaseInProgress = phase.steps.some(s => s.status === 'in-progress');

          return (
            <div key={phase.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              {/* Phase Header */}
              <button
                onClick={() => togglePhase(phase.id)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                )}
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-800">{phase.name}</span>
                    {phaseCompleted && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    {phaseInProgress && !phaseCompleted && <Clock className="w-4 h-4 text-blue-500" />}
                  </div>
                  <p className="text-xs text-slate-500">{phase.steps.length} steps</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        phaseCompleted ? 'bg-green-500' : phaseInProgress ? 'bg-blue-500' : 'bg-slate-200'
                      }`}
                      style={{
                        width: `${(phase.steps.filter(s => s.status === 'completed').length / phase.steps.length) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </button>

              {/* Steps */}
              {isExpanded && (
                <div className="border-t border-slate-100">
                  {phase.steps.map((step) => (
                    <div
                      key={step.id}
                      onClick={() => onStepClick?.(step.id)}
                      className={`
                        flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer
                        border-b border-slate-50 last:border-b-0
                        ${step.status === 'in-progress' ? 'bg-blue-50/50' : ''}
                      `}
                    >
                      <GripVertical className="w-4 h-4 text-slate-300 cursor-grab" />
                      {getStatusIcon(step.status)}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${
                          step.status === 'completed' ? 'text-slate-600' :
                          step.status === 'in-progress' ? 'text-blue-800' : 'text-slate-400'
                        }`}>
                          {step.name}
                        </p>
                        {step.description && (
                          <p className="text-xs text-slate-400 truncate">{step.description}</p>
                        )}
                      </div>
                      <Badge className={getStatusColor(step.status)}>
                        {step.status === 'in-progress' ? 'In Progress' : step.status}
                      </Badge>
                      {step.assignee && (
                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                          <span className="text-xs font-medium text-slate-600">
                            {step.assignee.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      )}
                      {step.dueDate && (
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {step.dueDate}
                        </span>
                      )}
                      <button className="p-1 rounded hover:bg-slate-100">
                        <MoreHorizontal className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
