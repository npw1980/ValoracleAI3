import { useState } from 'react';
import {
  Rocket,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Building2,
  Users,
  BarChart3,
  FileText,
  Sparkles,
  BookOpen,
  Video,
  MessageCircle,
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const steps = [
  { id: 1, title: 'Welcome', description: 'Get started with ValOracle' },
  { id: 2, title: 'Profile', description: 'Set up your profile' },
  { id: 3, title: 'Organization', description: 'Connect your organization' },
  { id: 4, title: 'First Project', description: 'Create your first project' },
  { id: 5, title: 'Ready', description: 'Start using ValOracle' },
];

const features = [
  { icon: BarChart3, title: 'Asset Management', description: 'Track your drug portfolio' },
  { icon: Rocket, title: 'Launch Workflows', description: 'Streamlined launch process' },
  { icon: FileText, title: 'Research Hub', description: 'Centralized research' },
  { icon: Users, title: 'Team Collaboration', description: 'Work together seamlessly' },
];

const resources = [
  { icon: BookOpen, title: 'Documentation', description: 'Detailed guides and tutorials' },
  { icon: Video, title: 'Video Tutorials', description: 'Step-by-step video guides' },
  { icon: MessageCircle, title: 'Community', description: 'Connect with other users' },
  { icon: Sparkles, title: 'AI Assistant', description: 'Get help from Val' },
];

export function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const isStepComplete = (stepId: number) => completedSteps.includes(stepId);

  const handleNext = () => {
    if (!isStepComplete(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center py-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
              <Rocket className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
              Welcome to ValOracle
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
              The comprehensive platform for pharmaceutical launch management, HEOR modeling, and real-world evidence generation.
            </p>
            <Button onClick={handleNext} size="lg">
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        );
      case 2:
        return (
          <div className="py-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
                Set Up Your Profile
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Tell us a bit about yourself
              </p>
            </div>
            <div className="max-w-sm mx-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue="Nathan White"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Role
                </label>
                <select className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                  <option>HEOR Specialist</option>
                  <option>Product Manager</option>
                  <option>Market Access</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Therapeutic Area
                </label>
                <select className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                  <option>Oncology</option>
                  <option>Cardiology</option>
                  <option>Neurology</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="py-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
                Connect Your Organization
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Join or create your team workspace
              </p>
            </div>
            <div className="space-y-3 max-w-sm mx-auto">
              <button className="w-full p-4 rounded-xl border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20 flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-800 dark:text-white">Join Existing Organization</p>
                  <p className="text-sm text-slate-500">Enter an invitation code</p>
                </div>
              </button>
              <button className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800">
                <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Plus className="w-6 h-6 text-slate-500" />
                </div>
                <div>
                  <p className="font-medium text-slate-800 dark:text-white">Create New Organization</p>
                  <p className="text-sm text-slate-500">Start fresh with a new team</p>
                </div>
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="py-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
                Create Your First Project
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Get started with a template
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, i) => (
                <button key={i} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-left hover:border-blue-300 dark:hover:border-blue-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <feature.icon className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3" />
                  <p className="font-medium text-slate-800 dark:text-white">{feature.title}</p>
                  <p className="text-sm text-slate-500">{feature.description}</p>
                </button>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="text-center py-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
              You're All Set!
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
              Start exploring ValOracle and let our AI assistant help you along the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="secondary">
                <BookOpen className="w-4 h-4" />
                View Documentation
              </Button>
              <Button>
                <Rocket className="w-4 h-4" />
                Go to Dashboard
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => setCurrentStep(step.id)}
                className={`flex items-center gap-2 ${
                  currentStep === step.id
                    ? 'text-blue-600 dark:text-blue-400'
                    : isStepComplete(step.id)
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-slate-400'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === step.id
                    ? 'bg-blue-600 text-white'
                    : isStepComplete(step.id)
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700'
                }`}>
                  {isStepComplete(step.id) ? <CheckCircle2 className="w-5 h-5" /> : step.id}
                </div>
                <span className="hidden sm:inline text-sm font-medium">{step.title}</span>
              </button>
              {index < steps.length - 1 && (
                <div className={`w-8 sm:w-16 h-0.5 mx-2 ${
                  isStepComplete(step.id) ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Main Card */}
        <Card className="bg-white dark:bg-slate-800">
          <CardContent className="p-8">
            {renderStepContent()}

            {/* Navigation */}
            {currentStep < 5 && (
              <div className="flex items-center justify-between mt-8 pt-8 border-t border-slate-100 dark:border-slate-700">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button onClick={handleNext}>
                  {currentStep === 4 ? 'Finish' : 'Continue'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resources */}
        {currentStep < 5 && (
          <div className="mt-6">
            <p className="text-center text-sm text-slate-500 mb-4">Need help? Explore our resources</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {resources.map((resource, i) => (
                <button key={i} className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-300 transition-colors text-center">
                  <resource.icon className="w-5 h-5 text-slate-500 mx-auto mb-1" />
                  <span className="text-xs text-slate-600 dark:text-slate-400">{resource.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Plus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
