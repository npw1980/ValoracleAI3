/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  BarChart3,
  Users,
  Calendar,
  ArrowUpRight,
  Sparkles,
  Activity,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { MetricCard, MiniChart, ProgressRing, AvatarGroup } from '../components/ui/Charts';
import { getDashboardStats, getAssets, getActivity, getTasks } from '../services/api';
import { useAppStore } from '../stores/appStore';

// Empty states for clean testing - no mock data

// Suggestion chips for Ask Val
const suggestionChips = [
  { id: '1', label: 'Show me assets', query: 'Show me all assets' },
  { id: '2', label: 'Create workflow', query: 'Create a new workflow' },
  { id: '3', label: 'View tasks', query: 'Show my tasks' },
  { id: '4', label: 'Portfolio health', query: 'What is my portfolio health?' },
];

export function Dashboard() {
  const navigate = useNavigate();
  const { setValPanelOpen, setValQuery } = useAppStore();

  const [greeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  });

  // Handle suggestion chip click - open ValPanel with query
  const handleSuggestionClick = (query: string) => {
    setValQuery(query);
    setValPanelOpen(true);
  };

  // API data state
  const [statsData, setStatsData] = useState<any>(null);
  const [assetsData, setAssetsData] = useState<any[]>([]);
  const [activityData, setActivityData] = useState<any[]>([]);
  const [tasksData, setTasksData] = useState<any[]>([]);

  useEffect(() => {
    // Fetch data from API with fallback to mock data
    getDashboardStats()
      .then(data => setStatsData(data))
      .catch(() => {});

    getAssets()
      .then(data => setAssetsData(data.slice(0, 4)))
      .catch(() => {});

    getActivity()
      .then(data => setActivityData(data))
      .catch(() => {});

    getTasks()
      .then(data => setTasksData(data))
      .catch(() => {});
  }, []);

  // Build stats from API only - no fallback
  const stats = statsData ? [
    { label: 'Active Assets', value: String(statsData.activeAssets || 0), change: statsData.portfolioGrowth || 0, trend: 'up' as const, icon: BarChart3, sparkline: [] },
    { label: 'Tasks Due Today', value: String(statsData.tasksDueToday || 0), change: 0, trend: 'neutral' as const, icon: Clock, sparkline: [] },
    { label: 'Workflows Active', value: String(statsData.workflowsActive || 0), change: 0, trend: 'neutral' as const, icon: Activity, sparkline: [] },
    { label: 'Team Members', value: String(statsData.teamMembers || 0), change: 0, trend: 'neutral' as const, icon: Users, sparkline: [] },
  ] : [];

  // Use API assets only - no fallback
  const recentAssets = assetsData.length > 0 ? assetsData : [];

  const upcomingTasks = tasksData.length > 0 ? tasksData.slice(0, 4).map((t: any) => ({
    id: t.id,
    title: t.name,
    priority: t.priority || 'Medium',
    dueDate: t.endDate || 'TBD',
    status: t.status
  })) : [];

  const portfolioHealth = assetsData.length > 0 ? assetsData.slice(0, 4).map((a: any) => ({
    name: a.code,
    health: a.health || 0,
    trend: [0, 0, 0, 0, 0]
  })) : [];

  const recentActivityData = activityData.length > 0 ? activityData : [];
  const team: { name: string }[] = [];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      default: return 'default';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{greeting}, Nathan</h1>
          <p className="text-slate-500 mt-1">Here's what's happening with your portfolio today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={() => setValPanelOpen(true)}
          >
            <Sparkles className="w-4 h-4" />
            Ask Val
          </Button>
          <Link to="/work">
            <Button>
              Start Work
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <MetricCard
            key={stat.label}
            title={stat.label}
            value={stat.value}
            change={stat.change}
            trend={stat.trend as 'up' | 'down' | 'neutral'}
            icon={stat.icon}
            sparklineData={stat.sparkline}
          />
        ))}
      </div>

      {/* Ask Val Suggestion Chips (D-02) */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Quick questions for Val</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestionChips.map((chip) => (
              <button
                key={chip.id}
                onClick={() => handleSuggestionClick(chip.query)}
                className="px-3 py-1.5 bg-white border border-blue-200 rounded-full text-sm text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-colors flex items-center gap-1.5"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio Health */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Portfolio Health</CardTitle>
              <Link to="/assets" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View all <ArrowUpRight className="w-4 h-4" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {portfolioHealth.map((asset) => (
                  <div
                    key={asset.name}
                    className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/assets/${asset.name.toLowerCase()}`)}
                    title={`${asset.name}: ${asset.health}% health score. Click to view asset details.`}
                  >
                    <div className="flex items-center gap-4">
                      <ProgressRing value={asset.health} size={48} color={asset.health >= 70 ? '#10b981' : asset.health >= 50 ? '#f59e0b' : '#ef4444'} />
                      <div>
                        <p className="font-semibold text-slate-800">{asset.name}</p>
                        <p className="text-sm text-slate-500">Asset Health Score</p>
                      </div>
                    </div>
                    <div className="w-32">
                      <MiniChart data={asset.trend} labels={['W1', 'W2', 'W3', 'W4', 'W5']} height={32} colors={[asset.health >= 70 ? '#10b981' : asset.health >= 50 ? '#f59e0b' : '#ef4444']} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Tasks */}
        <div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Upcoming Tasks</CardTitle>
              <Link to="/workspace" className="text-sm text-blue-600 hover:text-blue-700">
                View all
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="px-6 py-4">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-slate-800">{task.title}</p>
                      <Badge variant={getPriorityColor(task.priority) as any}>
                        {task.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                      <Calendar className="w-3 h-3" />
                      {task.dueDate}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Assets & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Assets */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Assets</CardTitle>
            <Link to="/assets" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View all <ArrowUpRight className="w-4 h-4" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {recentAssets.map((asset) => (
                <Link
                  key={asset.id}
                  to={`/assets/${asset.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-800">{asset.code}</p>
                        <Badge variant="info">{asset.phase}</Badge>
                      </div>
                      <p className="text-sm text-slate-500">{asset.name} • {asset.indication}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-700">Health</p>
                      <p className={`text-lg font-bold ${asset.health >= 70 ? 'text-green-600' : asset.health >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                        {asset.health}%
                      </p>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-slate-300" />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {recentActivityData.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => {
                    // Extract asset code from activity item (e.g., "ABC-123 pricing" -> "ABC-123")
                    const assetCodeMatch = activity.item.match(/[A-Z]+-\d+/);
                    if (assetCodeMatch) {
                      // Find the asset in recentAssets to get the full ID
                      const asset = recentAssets.find(a => a.code === assetCodeMatch[0]);
                      if (asset) {
                        navigate(`/assets/${asset.id}`);
                        return;
                      }
                    }
                    // Default fallback - navigate to assets page
                    navigate('/assets');
                  }}
                >
                  {activity.action === 'Completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : activity.action === 'Updated' ? (
                    <AlertCircle className="w-5 h-5 text-blue-500" />
                  ) : activity.action === 'Created' ? (
                    <Plus className="w-5 h-5 text-purple-500" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                      <div className="w-2 h-2 bg-slate-400 rounded-full" />
                    </div>
                  )}
                  <p className="flex-1 text-sm text-slate-700">
                    <span className="font-medium">{activity.user}</span>{' '}
                    {activity.action.toLowerCase()}{' '}
                    <span className="text-blue-600 hover:text-blue-700">{activity.item}</span>
                  </p>
                  <p className="text-xs text-slate-400">{activity.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Team View */}
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Team Overview</h3>
              <p className="text-slate-400 text-sm">5 team members working on 3 active projects</p>
            </div>
            <AvatarGroup users={team} max={5} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
