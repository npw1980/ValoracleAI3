import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Rocket,
  BarChart3,
  FileText,
  Briefcase,
  FolderOpen,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Beaker,
  ListTodo,
  Calculator,
  Database,
  Shield,
  CreditCard,
  MessageSquare,
  Code,
  Smartphone,
} from 'lucide-react';
import { useAppStore } from '../../stores/appStore';

interface SidebarProps {
  open: boolean;
}

const mainNavItems = [
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
];

const bottomNavItems = [
  { path: '/workspace', icon: Briefcase, label: 'Workspace' },
  { path: '/library', icon: Users, label: 'Library' },
  { path: '/settings', icon: Settings, label: 'Settings' },
  { path: '/audit', icon: Shield, label: 'Audit Log' },
  { path: '/billing', icon: CreditCard, label: 'Billing' },
  { path: '/api', icon: Code, label: 'API Docs' },
  { path: '/mobile', icon: Smartphone, label: 'Mobile' },
];

export function Sidebar({ open }: SidebarProps) {
  const { sidebarCollapsed, setSidebarCollapsed } = useAppStore();

  if (!open) return null;

  return (
    <aside
      className={`
        flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 transition-all duration-200 shrink-0
        ${sidebarCollapsed ? 'w-16' : 'w-60'}
      `}
    >
      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="px-3 space-y-1">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                ${isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                }
              `}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!sidebarCollapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Divider */}
        <div className="mx-3 my-4 h-px bg-slate-200" />

        {/* Bottom nav */}
        <div className="px-3 space-y-1">
          {bottomNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                ${isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                }
              `}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!sidebarCollapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Collapse toggle */}
      <div className="p-3 border-t border-slate-200">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
