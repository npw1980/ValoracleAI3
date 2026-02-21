/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import {
  CheckSquare,
  Square,
  Clock,
  User,
  Calendar,
  AlertCircle,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/Tabs';

// Empty states - no mock data for testing
const tasks: { id: string; title: string; priority: string; status: string; assignee: string; dueDate: string; asset: string | null }[] = [];
const workflows: { id: string; name: string; type: string; status: string; progress: number; stepsCompleted: number; stepsTotal: number }[] = [];

export function Workspace() {
  const [activeTab, setActiveTab] = useState('tasks');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    priority: 'Medium',
    assignee: '',
    dueDate: '',
    asset: '',
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Done':
        return <CheckSquare className="w-5 h-5 text-green-500" />;
      case 'In Progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'Review':
        return <AlertCircle className="w-5 h-5 text-amber-500" />;
      default:
        return <Square className="w-5 h-5 text-slate-300" />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Workspace</h1>
          <p className="text-slate-500 mt-1">Manage tasks, workflows, and team collaboration.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" />
          New Task
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultTab="tasks" onChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Tasks */}
      {activeTab === 'tasks' && (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  {getStatusIcon(task.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-800 truncate">{task.title}</p>
                      <Badge variant={getPriorityColor(task.priority) as any}>
                        {task.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                      {task.asset && <span className="text-blue-600">{task.asset}</span>}
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {task.assignee}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {task.dueDate}
                      </span>
                    </div>
                  </div>
                  <Badge variant={
                    task.status === 'Done' ? 'success' :
                    task.status === 'In Progress' ? 'info' :
                    task.status === 'Review' ? 'warning' : 'default'
                  }>
                    {task.status}
                  </Badge>
                  <ChevronRight className="w-5 h-5 text-slate-300" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workflows */}
      {activeTab === 'workflows' && (
        <div className="space-y-4">
          {workflows.map((workflow) => (
            <Card key={workflow.id} variant="elevated" className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-slate-800">{workflow.name}</h3>
                    <p className="text-sm text-slate-500">{workflow.type}</p>
                  </div>
                  <Badge variant={workflow.status === 'Active' ? 'success' : 'default'}>
                    {workflow.status}
                  </Badge>
                </div>

                {/* Progress bar */}
                <div className="mb-2">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-slate-500">Progress</span>
                    <span className="font-medium text-slate-700">
                      {workflow.stepsCompleted} / {workflow.stepsTotal} steps
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${workflow.progress}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Task Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Task"
        description="Add a new task to your workspace"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              setIsModalOpen(false);
              setFormData({ title: '', priority: 'Medium', assignee: '', dueDate: '', asset: '' });
            }}>Create Task</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Task Title"
            placeholder="e.g., Review clinical data"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Priority</label>
              <select
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <Input
              label="Assignee"
              placeholder="e.g., Sarah M."
              value={formData.assignee}
              onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Due Date"
              placeholder="e.g., Feb 15"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
            <Input
              label="Related Asset"
              placeholder="e.g., ABC-123"
              value={formData.asset}
              onChange={(e) => setFormData({ ...formData, asset: e.target.value })}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
