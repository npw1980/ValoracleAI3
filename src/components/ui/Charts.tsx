import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';

interface ChartProps {
  data: number[];
  labels: string[];
  height?: number;
  showGrid?: boolean;
  colors?: string[];
}

export function MiniChart({
  data,
  labels,
  height = 60,
  showGrid = false,
  colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b']
}: ChartProps) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  return (
    <div className="relative" style={{ height }}>
      {showGrid && (
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="w-full border-t border-slate-100" />
          ))}
        </div>
      )}
      <div className="flex items-end justify-between gap-1 h-full">
        {data.map((value, i) => {
          const percentage = ((value - min) / range) * 100;
          return (
            <div
              key={i}
              className="flex-1 rounded-sm transition-all hover:opacity-80"
              style={{
                height: `${Math.max(percentage, 4)}%`,
                backgroundColor: colors[i % colors.length],
              }}
              title={`${labels[i]}: ${value}`}
            />
          );
        })}
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ElementType;
  sparklineData?: number[];
}

export function MetricCard({ title, value, change, trend, icon: Icon, sparklineData }: MetricCardProps) {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-slate-400';
  };

  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
          {Icon ? <Icon className="w-5 h-5 text-slate-600" /> : <BarChart3 className="w-5 h-5 text-slate-600" />}
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${getTrendColor()}`}>
            {getTrendIcon()}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>

      {sparklineData && (
        <div className="mb-3 -mx-2">
          <MiniChart
            data={sparklineData}
            labels={sparklineData.map((_, i) => `P${i + 1}`)}
            height={40}
          />
        </div>
      )}

      <p className="text-2xl font-bold text-slate-800">{value}</p>
      <p className="text-sm text-slate-500">{title}</p>
    </div>
  );
}

interface ProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
}

export function ProgressRing({
  value,
  size = 60,
  strokeWidth = 6,
  color = '#3b82f6',
  label
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      {label && (
        <span className="absolute text-xs font-medium text-slate-600">{label}</span>
      )}
    </div>
  );
}

interface AvatarGroupProps {
  users: { name: string; avatar?: string }[];
  max?: number;
}

export function AvatarGroup({ users, max = 4 }: AvatarGroupProps) {
  const visible = users.slice(0, max);
  const remaining = users.length - max;

  return (
    <div className="flex -space-x-2">
      {visible.map((user, i) => (
        <div
          key={i}
          className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-white flex items-center justify-center text-white text-xs font-medium"
          title={user.name}
        >
          {user.name.split(' ').map(n => n[0]).join('')}
        </div>
      ))}
      {remaining > 0 && (
        <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-slate-600 text-xs font-medium">
          +{remaining}
        </div>
      )}
    </div>
  );
}

interface TimelineProps {
  items: {
    id: string;
    title: string;
    subtitle?: string;
    date: string;
    status?: 'completed' | 'in-progress' | 'pending';
    icon?: React.ElementType;
  }[];
}

export function Timeline({ items }: TimelineProps) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      default: return 'bg-slate-300';
    }
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={item.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(item.status)}`} />
            {index < items.length - 1 && (
              <div className="w-0.5 h-full bg-slate-200 mt-1" />
            )}
          </div>
          <div className="flex-1 pb-4">
            <p className="font-medium text-slate-800">{item.title}</p>
            {item.subtitle && (
              <p className="text-sm text-slate-500">{item.subtitle}</p>
            )}
            <p className="text-xs text-slate-400 mt-1">{item.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon = BarChart3, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
      {description && (
        <p className="text-slate-500 text-center max-w-sm mb-4">{description}</p>
      )}
      {action}
    </div>
  );
}
