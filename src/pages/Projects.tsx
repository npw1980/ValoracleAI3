/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import {
  Plus,
  LayoutGrid,
  List,
  Calendar,
  Filter,
  Search,
  Settings,
  Loader2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { GanttChart, ProjectBoard, type Task } from '../components/ui/GanttChart';
import { getProjects, getTasks, createProject } from '../services/api';

// Fallback mock tasks
const mockTasks: Task[] = [
  {
    id: '1',
    name: 'Launch Strategy Development',
    startDate: new Date(2026, 0, 15),
    endDate: new Date(2026, 1, 15),
    progress: 75,
    status: 'in_progress',
    priority: 'high',
    assignee: 'Sarah M.',
    color: '#3b82f6',
  },
  {
    id: '2',
    name: 'Evidence Gap Analysis',
    startDate: new Date(2026, 0, 20),
    endDate: new Date(2026, 1, 10),
    progress: 100,
    status: 'completed',
    priority: 'high',
    assignee: 'John D.',
    color: '#10b981',
  },
  {
    id: '3',
    name: 'Pricing Strategy',
    startDate: new Date(2026, 1, 1),
    endDate: new Date(2026, 1, 28),
    progress: 45,
    status: 'in_progress',
    priority: 'medium',
    assignee: 'Mike R.',
    dependencies: ['2'],
    color: '#3b82f6',
  },
  {
    id: '4',
    name: 'Payer Research',
    startDate: new Date(2026, 1, 10),
    endDate: new Date(2026, 2, 15),
    progress: 20,
    status: 'in_progress',
    priority: 'medium',
    assignee: 'Emily C.',
    dependencies: ['3'],
    color: '#3b82f6',
  },
  {
    id: '5',
    name: 'KOL Engagement',
    startDate: new Date(2026, 1, 15),
    endDate: new Date(2026, 2, 30),
    progress: 0,
    status: 'todo',
    priority: 'low',
    assignee: 'Sarah M.',
    color: '#e2e8f0',
  },
  {
    id: '6',
    name: 'Contract Negotiation',
    startDate: new Date(2026, 2, 1),
    endDate: new Date(2026, 3, 15),
    progress: 0,
    status: 'todo',
    priority: 'high',
    assignee: 'John D.',
    dependencies: ['4'],
    color: '#e2e8f0',
  },
  {
    id: '7',
    name: 'Launch Materials',
    startDate: new Date(2026, 2, 15),
    endDate: new Date(2026, 3, 30),
    progress: 0,
    status: 'todo',
    priority: 'medium',
    assignee: 'Mike R.',
    color: '#e2e8f0',
  },
  {
    id: '8',
    name: 'Market Launch',
    startDate: new Date(2026, 4, 1),
    endDate: new Date(2026, 4, 15),
    progress: 0,
    status: 'todo',
    priority: 'high',
    color: '#e2e8f0',
  },
];

// Fallback mock projects
const mockProjects = [
  {
    id: '1',
    name: 'ABC-123 Launch',
    description: 'Phase 2 NSCLC asset launch',
    status: 'active',
    progress: 65,
    tasks: 12,
    completedTasks: 8,
    team: ['Sarah M.', 'John D.', 'Mike R.', 'Emily C.'],
    dueDate: 'Apr 15, 2026',
  },
  {
    id: '2',
    name: 'DEF-456 Pricing',
    description: 'Phase 3 cardiovascular pricing',
    status: 'active',
    progress: 35,
    tasks: 8,
    completedTasks: 3,
    team: ['Sarah M.', 'David L.'],
    dueDate: 'May 30, 2026',
  },
  {
    id: '3',
    name: 'GHI-789 Analysis',
    description: 'Market access analysis',
    status: 'planning',
    progress: 10,
    tasks: 5,
    completedTasks: 0,
    team: ['John D.', 'Mike R.'],
    dueDate: 'Jun 15, 2026',
  },
];

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  progress: number;
  tasks?: number;
  completedTasks?: number;
  tasksTotal?: number;
  tasksCompleted?: number;
  team: string[];
  dueDate: string;
}

export function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'gantt' | 'board' | 'list'>('gantt');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal state for creating new project
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planning',
    dueDate: '',
    team: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [projectsData, tasksData] = await Promise.all([
        getProjects(),
        getTasks()
      ]);

      // Transform projects
      const transformedProjects = projectsData.map((p: any) => ({
        ...p,
        tasks: p.tasksTotal || p.tasks,
        completedTasks: p.tasksCompleted || p.completedTasks,
        dueDate: p.dueDate ? new Date(p.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD',
      }));
      setProjects(transformedProjects);

      // Transform tasks
      const transformedTasks = tasksData.map((t: any) => ({
        id: t.id,
        name: t.name,
        startDate: new Date(t.startDate),
        endDate: new Date(t.endDate),
        progress: t.progress,
        status: t.status,
        priority: t.priority,
        assignee: t.assignee,
        color: '#3b82f6',
      }));
      setTasks(transformedTasks);
    } catch {
      console.log('Using fallback data');
      setProjects(mockProjects);
      setTasks(mockTasks);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    setIsSubmitting(true);
    const newProject = {
      name: formData.name || 'New Project',
      description: formData.description || 'Project description',
      status: formData.status,
      progress: 0,
      tasksTotal: 0,
      tasksCompleted: 0,
      team: formData.team ? formData.team.split(',').map(t => t.trim()) : [],
      dueDate: formData.dueDate || new Date().toISOString().split('T')[0],
    };
    try {
      const created = await createProject(newProject);
      setProjects([...projects, created as any]);
      setIsModalOpen(false);
      setFormData({ name: '', description: '', status: 'planning', dueDate: '', team: '' });
    } catch {
      console.log('Failed to create project, adding locally');
      setProjects([...projects, { ...newProject, id: String(Date.now()), tasks: 0, completedTasks: 0, dueDate: 'TBD' }]);
      setIsModalOpen(false);
      setFormData({ name: '', description: '', status: 'planning', dueDate: '', team: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCreateModal = () => {
    setFormData({
      name: '',
      description: '',
      status: 'planning',
      dueDate: '',
      team: '',
    });
    setIsModalOpen(true);
  };

  // Navigation handlers for P-01 and P-03, P-05
  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  const handleTaskClick = (task: Task) => {
    navigate(`/tasks/${task.id}`);
  };

  const handleTaskDragEnd = (result: any) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;

    // Map board column IDs to task statuses
    const statusMap: Record<string, Task['status']> = {
      'backlog': 'todo',
      'todo': 'todo',
      'in_progress': 'in_progress',
      'review': 'in_progress',
      'done': 'completed',
    };

    const updatedStatus = statusMap[newStatus];
    if (!updatedStatus) return;

    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === draggableId
          ? { ...task, status: updatedStatus }
          : task
      )
    );
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Projects</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage projects, tasks, and timelines.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">
            <Settings className="w-4 h-4" />
          </Button>
          <Button onClick={openCreateModal}>
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </div>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="elevated">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{projects.length}</p>
                <p className="text-sm text-slate-500">Active Projects</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <LayoutGrid className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{tasks.length}</p>
                <p className="text-sm text-slate-500">Total Tasks</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <List className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  {Math.round(tasks.reduce((acc, t) => acc + t.progress, 0) / (tasks.length || 1))}%
                </p>
                <p className="text-sm text-slate-500">Avg. Progress</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Card
            key={project.id}
            variant="elevated"
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleProjectClick(project.id)}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-white">{project.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{project.description}</p>
                </div>
                <Badge variant={project.status === 'active' ? 'success' : 'default'}>
                  {project.status}
                </Badge>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-500 dark:text-slate-400">Progress</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{project.progress}%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-3">
                <span>{project.completedTasks || 0}/{project.tasks || 0} tasks</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {project.dueDate}
                </span>
              </div>

              <div className="flex items-center -space-x-2">
                {(project.team || []).slice(0, 4).map((member, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 border-2 border-white dark:border-slate-800 flex items-center justify-center text-xs text-blue-600 dark:text-blue-400 font-medium"
                    title={member}
                  >
                    {member.split(' ').map(n => n[0]).join('')}
                  </div>
                ))}
                {(project.team || []).length > 4 && (
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center text-xs text-slate-500">
                    +{(project.team || []).length - 4}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="ghost" size="sm">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setView('gantt')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              view === 'gantt'
                ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Gantt
          </button>
          <button
            onClick={() => setView('board')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              view === 'board'
                ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Board
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              view === 'list'
                ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            List
          </button>
        </div>
      </div>

      {/* Gantt View */}
      {view === 'gantt' && (
        <GanttChart tasks={tasks} showDependencies={true} onTaskClick={handleTaskClick} />
      )}

      {/* Board View */}
      {view === 'board' && (
        <ProjectBoard tasks={tasks} onTaskClick={handleTaskClick} onDragEnd={handleTaskDragEnd} />
      )}

      {/* List View */}
      {view === 'list' && (
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-900/50">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-500 dark:text-slate-400">Task</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-500 dark:text-slate-400">Status</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-500 dark:text-slate-400">Priority</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-500 dark:text-slate-400">Assignee</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-500 dark:text-slate-400">Due Date</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-500 dark:text-slate-400">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {tasks.map((task) => (
                  <tr
                    key={task.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
                    onClick={() => handleTaskClick(task)}
                  >
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-800 dark:text-white">{task.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        task.status === 'completed' ? 'success' :
                        task.status === 'in_progress' ? 'warning' : 'default'
                      }>
                        {task.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm ${
                        task.priority === 'high' ? 'text-red-600' :
                        task.priority === 'medium' ? 'text-amber-600' : 'text-slate-500'
                      }`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {task.assignee && (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-xs text-blue-600">
                            {task.assignee.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-sm text-slate-600 dark:text-slate-400">{task.assignee}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {task.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-slate-500">{task.progress}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Create Project Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Project"
        description="Add a new project to your portfolio"
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleCreateProject} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                'Create Project'
              )}
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Project Name"
            placeholder="e.g., Tirzepatide Market Access"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Status</label>
            <select
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm resize-none"
              rows={3}
              placeholder="Describe the project goals and scope..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <Input
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />
          <Input
            label="Team Members"
            placeholder="e.g., Sarah M., John D., Mike R."
            value={formData.team}
            onChange={(e) => setFormData({ ...formData, team: e.target.value })}
            hint="Separate names with commas"
          />
        </div>
      </Modal>
    </div>
  );
}
