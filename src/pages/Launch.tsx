import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Rocket,
  Plus,
  ChevronRight,
  Clock,
  Circle,
  Calendar,
  MoreHorizontal,
  Play,
  Pause,
  GripVertical,
  Users,
  DollarSign,
  Check,
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { launchTemplates, analysisTemplates, contractTemplates, getTotalSteps, getTotalDays } from '../data/templates';

// Empty state - no mock data for testing
const activeWorkflows: { id: string; name: string; asset: string; status: string; progress: number; currentStep: string; startDate: string; dueDate: string }[] = [];

export function Launch() {
  const navigate = useNavigate();
  const [showWizard, setShowWizard] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // W-05: Wizard checkbox state
  const [wizardOptions, setWizardOptions] = useState({
    includeTeam: true,
    includeTimeline: true,
    includeBudget: true,
    includeNotifications: false,
  });

  // W-06: Handle save as draft
  const handleSaveDraft = () => {
    console.log('Saving workflow as draft:', {
      template: selectedTemplate,
      options: wizardOptions,
    });
    // In a real app, this would call an API to save the draft
    setShowWizard(false);
    setSelectedTemplate(null);
  };

  // W-06: Handle start workflow
  const handleStartWorkflow = () => {
    if (!selectedTemplate) return;

    console.log('Starting workflow:', {
      template: selectedTemplate,
      options: wizardOptions,
    });
    // In a real app, this would call an API to create and start the workflow
    // Navigate to the workflow detail page
    setShowWizard(false);
    navigate('/launch', { state: { workflowStarted: true } });
  };

  const toggleWizardOption = (key: keyof typeof wizardOptions) => {
    setWizardOptions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const allTemplates = [...launchTemplates, ...analysisTemplates, ...contractTemplates];
  const filteredTemplates = categoryFilter === 'all'
    ? allTemplates
    : allTemplates.filter(t => t.category === categoryFilter);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'launch': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'analysis': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
      case 'contract': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      case 'heor': return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Launch Center</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage product launches and workflows.</p>
        </div>
        <Button onClick={() => setShowWizard(true)}>
          <Plus className="w-4 h-4" />
          New Launch Workflow
        </Button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {['all', 'launch', 'analysis', 'contract'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              categoryFilter === cat
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {cat === 'all' ? 'All Templates' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Active Workflows - W-02: Make workflow cards clickable */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Active Workflows</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {activeWorkflows.map((workflow) => (
            <Card
              key={workflow.id}
              variant="elevated"
              className="cursor-pointer hover:shadow-lg transition-all"
              onClick={() => navigate(`/launch?workflow=${workflow.id}`)}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-800 dark:text-white">{workflow.name}</h3>
                      <Badge variant={workflow.status === 'Active' ? 'success' : 'warning'}>
                        {workflow.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{workflow.asset}</p>
                  </div>
                  <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-500 dark:text-slate-400">Progress</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{workflow.progress}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${workflow.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Clock className="w-4 h-4" />
                    <span>Current: {workflow.currentStep}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {workflow.status === 'Active' ? (
                      <Button variant="ghost" size="sm">
                        <Pause className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm">
                        <Play className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Started {workflow.startDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Due {workflow.dueDate}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Workflow Templates */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Workflow Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              variant="bordered"
              className={`cursor-pointer hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all ${
                selectedTemplate === template.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryColor(template.category)}`}>
                    <Rocket className="w-5 h-5" />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {template.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-white mb-1">{template.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{template.description}</p>
                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {template.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <GripVertical className="w-3 h-3" />
                    {getTotalSteps(template)} steps
                  </span>
                  {template.teamSize && (
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {template.teamSize} people
                    </span>
                  )}
                </div>
                {template.estimatedCost && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <DollarSign className="w-3 h-3" />
                    {template.estimatedCost}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Workflow Builder Wizard */}
      {showWizard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Create Launch Workflow</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Set up your launch workflow in 3 steps</p>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Step indicators */}
              <div className="flex items-center justify-center gap-4 mb-8">
                {['Template', 'Asset', 'Customize'].map((step, i) => (
                  <div key={step} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      i === 0 ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                    }`}>
                      {i + 1}
                    </div>
                    <span className={`text-sm ${i === 0 ? 'text-slate-800 dark:text-white font-medium' : 'text-slate-500'}`}>
                      {step}
                    </span>
                    {i < 2 && <ChevronRight className="w-4 h-4 text-slate-300" />}
                  </div>
                ))}
              </div>

              {/* Template Selection */}
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Select a Template</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {launchTemplates.slice(0, 3).map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`p-4 rounded-lg border-2 text-left transition-colors ${
                        selectedTemplate === template.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <h4 className="font-medium text-slate-800 dark:text-white">{template.name}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{getTotalSteps(template)} steps • {getTotalDays(template)} days</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Workflow Preview */}
              {selectedTemplate && (
                <div className="mt-8">
                  <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Workflow Preview</h3>
                  <div className="space-y-4">
                    {launchTemplates.find(t => t.id === selectedTemplate)?.steps.map((phase) => (
                      <div key={phase.id} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                          <h4 className="font-medium text-slate-800 dark:text-white">{phase.name}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{phase.description}</p>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-700">
                          {phase.steps.map((step) => (
                            <div key={step.id} className="flex items-center gap-3 px-4 py-2">
                              <Circle className="w-4 h-4 text-slate-300" />
                              <span className="text-sm text-slate-600 dark:text-slate-400">{step.name}</span>
                              <Badge variant="default" className="ml-auto text-xs">{step.estimatedDays}d</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* W-05: Wizard Checkboxes - Customize Options */}
                  <div className="mt-8">
                    <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Customize Your Workflow</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* W-05: Include Team Members checkbox */}
                      <label
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                          wizardOptions.includeTeam
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={wizardOptions.includeTeam}
                          onChange={() => toggleWizardOption('includeTeam')}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          wizardOptions.includeTeam
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-slate-300'
                        }`}>
                          {wizardOptions.includeTeam && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-sm text-slate-700 dark:text-slate-300">Include team member assignments</span>
                      </label>

                      {/* W-05: Include Timeline checkbox */}
                      <label
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                          wizardOptions.includeTimeline
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={wizardOptions.includeTimeline}
                          onChange={() => toggleWizardOption('includeTimeline')}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          wizardOptions.includeTimeline
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-slate-300'
                        }`}>
                          {wizardOptions.includeTimeline && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-sm text-slate-700 dark:text-slate-300">Include detailed timeline</span>
                      </label>

                      {/* W-05: Include Budget checkbox */}
                      <label
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                          wizardOptions.includeBudget
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={wizardOptions.includeBudget}
                          onChange={() => toggleWizardOption('includeBudget')}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          wizardOptions.includeBudget
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-slate-300'
                        }`}>
                          {wizardOptions.includeBudget && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-sm text-slate-700 dark:text-slate-300">Include budget tracking</span>
                      </label>

                      {/* W-05: Include Notifications checkbox */}
                      <label
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                          wizardOptions.includeNotifications
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={wizardOptions.includeNotifications}
                          onChange={() => toggleWizardOption('includeNotifications')}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          wizardOptions.includeNotifications
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-slate-300'
                        }`}>
                          {wizardOptions.includeNotifications && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-sm text-slate-700 dark:text-slate-300">Enable progress notifications</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-between">
              <Button variant="ghost" onClick={() => setShowWizard(false)}>
                Cancel
              </Button>
              <div className="flex gap-2">
                {/* W-06: Save as Draft button with onClick handler */}
                <Button variant="secondary" onClick={handleSaveDraft}>
                  Save as Draft
                </Button>
                {/* W-06: Start Workflow button with onClick handler */}
                <Button onClick={handleStartWorkflow} disabled={!selectedTemplate}>
                  Start Workflow
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
