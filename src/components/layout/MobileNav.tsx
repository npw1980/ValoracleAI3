import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, LayoutDashboard, Rocket, BarChart3, FileText, Briefcase, FolderOpen, Users, Settings, Menu, ChevronRight, ListTodo, Beaker, Calculator, Database, Shield, CreditCard, MessageSquare, Code, Smartphone } from 'lucide-react';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/work', icon: Rocket, label: 'Work' },
  { path: '/launch', icon: Beaker, label: 'Launch' },
  { path: '/projects', icon: ListTodo, label: 'Projects' },
  { path: '/analyze', icon: BarChart3, label: 'Analyze' },
  { path: '/assets', icon: FolderOpen, label: 'Assets' },
  { path: '/research', icon: FileText, label: 'Research' },
  { path: '/contracts', icon: FileText, label: 'Contracts' },
  { path: '/heor', icon: Calculator, label: 'HEOR Models' },
  { path: '/data', icon: Database, label: 'RWD Data' },
  { path: '/market-research', icon: MessageSquare, label: 'Market Research' },
  { path: '/workspace', icon: Briefcase, label: 'Workspace' },
  { path: '/library', icon: Users, label: 'Library' },
  { path: '/settings', icon: Settings, label: 'Settings' },
  { path: '/audit', icon: Shield, label: 'Audit Log' },
  { path: '/billing', icon: CreditCard, label: 'Billing' },
  { path: '/api', icon: Code, label: 'API Docs' },
  { path: '/mobile', icon: Smartphone, label: 'Mobile' },
];

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Slide-out panel */}
      <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white dark:bg-slate-900 z-50 lg:hidden flex flex-col animate-slide-in-left">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="ValOracle" className="h-8 w-auto" />
            <span className="font-semibold text-slate-800 dark:text-white">ValOracle</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">NW</span>
            </div>
            <div>
              <p className="font-medium text-slate-800 dark:text-white">Nathan White</p>
              <p className="text-sm text-slate-500">nathan@valoracle.ai</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-3">
            {navItems.map((item) => (
              <NavItem
                key={item.path}
                {...item}
                onClick={onClose}
              />
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>v3.0.0</span>
            <span>Logged in</span>
          </div>
        </div>
      </div>
    </>
  );
}

function NavItem({ path, icon: Icon, label, onClick }: { path: string; icon: any; label: string; onClick: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <button
      onClick={() => {
        navigate(path);
        onClick();
      }}
      className={`
        w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors
        ${isActive
          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
        }
      `}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5" />
        <span className="font-medium">{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 opacity-50" />
    </button>
  );
}

export function MobileNavTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
    >
      <Menu className="w-6 h-6" />
    </button>
  );
}
