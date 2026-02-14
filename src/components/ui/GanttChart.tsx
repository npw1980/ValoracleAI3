import { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  MoreHorizontal,
  Calendar,
  Flag,
  CheckCircle2,
  Circle,
  Clock,
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

type DragEndEvent = {
  destination: { droppableId: string; index: number } | null;
  source: { droppableId: string; index: number };
  draggableId: string;
};
import { Card, CardContent } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';

export interface Task {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  dependencies?: string[];
  color?: string;
}

interface GanttChartProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onTaskUpdate?: (task: Task) => void;
  showDependencies?: boolean;
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_WIDTH = 40;
const ROW_HEIGHT = 48;
const HEADER_HEIGHT = 60;

const PRIORITY_COLORS = {
  low: '#64748b',
  medium: '#f59e0b',
  high: '#ef4444',
};

const STATUS_COLORS = {
  todo: '#e2e8f0',
  in_progress: '#3b82f6',
  completed: '#10b981',
};

export function GanttChart({
  tasks,
  onTaskClick,
  showDependencies = true,
}: GanttChartProps) {
  const [viewStartDate, setViewStartDate] = useState(() => {
    const date = new Date();
    date.setDate(1);
    return date;
  });
  const [viewDays] = useState(90);

  const totalWidth = viewDays * DAY_WIDTH;

  const days = useMemo(() => {
    const result: Date[] = [];
    for (let i = 0; i < viewDays; i++) {
      const date = new Date(viewStartDate);
      date.setDate(date.getDate() + i);
      result.push(date);
    }
    return result;
  }, [viewStartDate, viewDays]);

  const weeks = useMemo(() => {
    const result: { date: Date; days: Date[] }[] = [];
    let currentWeek: Date[] = [];

    days.forEach((day, index) => {
      currentWeek.push(day);
      if (day.getDay() === 6 || index === days.length - 1) {
        result.push({ date: currentWeek[0], days: currentWeek });
        currentWeek = [];
      }
    });
    return result;
  }, [days]);

  const getTaskPosition = (task: Task) => {
    const startOffset = Math.floor(
      (task.startDate.getTime() - viewStartDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const duration = Math.ceil(
      (task.endDate.getTime() - task.startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return {
      left: startOffset * DAY_WIDTH,
      width: Math.max(duration * DAY_WIDTH, DAY_WIDTH),
    };
  };

  const navigatePrev = () => {
    const newDate = new Date(viewStartDate);
    newDate.setDate(newDate.getDate() - 30);
    setViewStartDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(viewStartDate);
    newDate.setDate(newDate.getDate() + 30);
    setViewStartDate(newDate);
  };

  const navigateToday = () => {
    const date = new Date();
    date.setDate(1);
    setViewStartDate(date);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={navigatePrev}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={navigateToday}>
            Today
          </Button>
          <Button variant="ghost" size="sm" onClick={navigateNext}>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-2">
            {MONTH_NAMES[viewStartDate.getMonth()]} {viewStartDate.getFullYear()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <Plus className="w-4 h-4" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Gantt Header */}
      <div className="flex border-b border-slate-200 dark:border-slate-700">
        {/* Task List Header */}
        <div className="w-64 shrink-0 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50" style={{ height: HEADER_HEIGHT }}>
          <div className="h-[30px] px-4 flex items-center text-xs font-medium text-slate-500 uppercase">
            Task Name
          </div>
        </div>

        {/* Timeline Header */}
        <div className="flex-1 overflow-hidden">
          <div className="flex" style={{ height: HEADER_HEIGHT }}>
            {weeks.map((week, i) => (
              <div
                key={i}
                className="border-r border-slate-100 dark:border-slate-700"
                style={{ width: week.days.length * DAY_WIDTH }}
              >
                <div className="h-[30px] px-2 flex items-center text-xs font-medium text-slate-500 border-b border-slate-100 dark:border-slate-700">
                  {week.days[0].getDate() === 1 || i === 0
                    ? `${MONTH_NAMES[week.date.getMonth()]}`
                    : ''}
                </div>
                <div className="flex h-[30px]">
                  {week.days.map((day, j) => (
                    <div
                      key={j}
                      className={`flex items-center justify-center text-xs ${
                        isToday(day)
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 font-medium'
                          : 'text-slate-400'
                      }`}
                      style={{ width: DAY_WIDTH }}
                    >
                      {day.getDate()}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gantt Body */}
      <div className="overflow-x-auto">
        <div className="flex">
          {/* Task List - P-02: Added z-index to ensure task names float above timeline when scrolled */}
          <div className="w-64 shrink-0 border-r border-slate-200 dark:border-slate-700 relative z-10 bg-white dark:bg-slate-800">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center px-4 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
                style={{ height: ROW_HEIGHT }}
                onClick={() => onTaskClick?.(task)}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {task.status === 'completed' ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  ) : task.status === 'in_progress' ? (
                    <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                  )}
                  <span className="text-sm text-slate-700 dark:text-slate-300 truncate">
                    {task.name}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="relative" style={{ width: totalWidth }}>
            {/* Grid Lines */}
            <div className="absolute inset-0 flex">
              {weeks.map((week, i) => (
                <div
                  key={i}
                  className="border-r border-slate-100 dark:border-slate-700"
                  style={{ width: week.days.length * DAY_WIDTH }}
                >
                  <div className="flex h-full">
                    {week.days.map((day, j) => (
                      <div
                        key={j}
                        className={`border-r border-slate-50 dark:border-slate-800 ${
                          isToday(day) ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                        }`}
                        style={{ width: DAY_WIDTH, height: tasks.length * ROW_HEIGHT }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Task Bars */}
            <div className="relative" style={{ marginTop: 0, zIndex: 10 }}>
              {tasks.map((task, index) => {
                const pos = getTaskPosition(task);
                return (
                  <div
                    key={task.id}
                    className="absolute cursor-pointer group"
                    style={{
                      left: pos.left,
                      top: index * ROW_HEIGHT + (ROW_HEIGHT - 28) / 2,
                      width: pos.width,
                      height: 28,
                      zIndex: 20,
                    }}
                    onClick={() => onTaskClick?.(task)}
                  >
                    {/* Task Bar */}
                    <div
                      className="h-full rounded-md flex items-center px-2 relative overflow-hidden group-hover:shadow-md transition-shadow"
                      style={{
                        backgroundColor: task.color || STATUS_COLORS[task.status],
                        minWidth: 60,
                      }}
                    >
                      <div
                        className="absolute inset-0 bg-white/20"
                        style={{ width: `${task.progress}%` }}
                      />
                      <span className="text-xs text-white font-medium truncate relative z-10">
                        {task.name}
                      </span>
                      <span className="text-xs text-white/80 ml-auto relative z-10">
                        {task.progress}%
                      </span>
                    </div>

                    {/* Dependency Line */}
                    {showDependencies && task.dependencies?.map((depId) => {
                      const depTask = tasks.find(t => t.id === depId);
                      if (!depTask) return null;
                      const depIndex = tasks.indexOf(depTask);
                      const depPos = getTaskPosition(depTask);
                      return (
                        <svg
                          key={depId}
                          className="absolute inset-0 pointer-events-none"
                          style={{ width: totalWidth, height: tasks.length * ROW_HEIGHT }}
                        >
                          <path
                            d={`M ${depPos.left + depPos.width} ${depIndex * ROW_HEIGHT + ROW_HEIGHT / 2}
                                L ${depPos.left + depPos.width + 10} ${depIndex * ROW_HEIGHT + ROW_HEIGHT / 2}
                                L ${depPos.left + depPos.width + 10} ${index * ROW_HEIGHT + ROW_HEIGHT / 2 - 5}
                                L ${pos.left - 5} ${index * ROW_HEIGHT + ROW_HEIGHT / 2 - 5}
                                L ${pos.left - 5} ${index * ROW_HEIGHT + ROW_HEIGHT / 2}
                                L ${pos.left} ${index * ROW_HEIGHT + ROW_HEIGHT / 2}`}
                            fill="none"
                            stroke="#94a3b8"
                            strokeWidth={1.5}
                            strokeDasharray="4 2"
                          />
                        </svg>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 p-4 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-slate-200" />
          <span>To Do</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-500" />
          <span>In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-500" />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <Flag className="w-3 h-3 text-red-500" />
          <span>High Priority</span>
        </div>
      </div>
    </div>
  );
}

// Project Board View
interface BoardColumn {
  id: string;
  title: string;
  color: string;
}

const BOARD_COLUMNS: BoardColumn[] = [
  { id: 'backlog', title: 'Backlog', color: '#64748b' },
  { id: 'todo', title: 'To Do', color: '#3b82f6' },
  { id: 'in_progress', title: 'In Progress', color: '#f59e0b' },
  { id: 'review', title: 'In Review', color: '#8b5cf6' },
  { id: 'done', title: 'Done', color: '#10b981' },
];

interface ProjectBoardProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onDragEnd?: (result: DragEndEvent) => void;
}

export function ProjectBoard({ tasks, onTaskClick, onDragEnd }: ProjectBoardProps) {
  const getColumnTasks = (status: string) => {
    return tasks.filter(task => {
      if (status === 'backlog') return task.status === 'todo' && task.progress === 0;
      if (status === 'todo') return task.status === 'todo' && task.progress > 0;
      return task.status === status;
    });
  };

  const getPriorityIcon = (priority: string) => {
    return <Flag className={`w-3 h-3`} style={{ color: PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS] }} />;
  };

  const handleDragEnd = (result: DragEndEvent) => {
    if (onDragEnd) {
      onDragEnd(result);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {BOARD_COLUMNS.map((column) => (
          <div key={column.id} className="w-72 shrink-0">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: column.color }} />
              <h3 className="font-medium text-slate-800 dark:text-white">{column.title}</h3>
              <Badge variant="default" className="ml-auto">
                {getColumnTasks(column.id).length}
              </Badge>
            </div>
            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`space-y-3 min-h-[200px] ${snapshot.isDraggingOver ? 'bg-slate-50 dark:bg-slate-800/50 rounded-lg' : ''}`}
                >
                  {getColumnTasks(column.id).map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Card
                            variant="bordered"
                            className={`cursor-pointer hover:border-blue-300 transition-colors ${snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-500' : ''}`}
                            onClick={() => onTaskClick?.(task)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  {getPriorityIcon(task.priority)}
                                  <span className="text-sm font-medium text-slate-800 dark:text-white">
                                    {task.name}
                                  </span>
                                </div>
                                <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
                                  <MoreHorizontal className="w-4 h-4 text-slate-400" />
                                </button>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                  <Calendar className="w-3 h-3" />
                                  {task.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </div>
                                {task.assignee && (
                                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xs text-blue-600">
                                    {task.assignee.split(' ').map(n => n[0]).join('')}
                                  </div>
                                )}
                              </div>
                              {/* Progress Bar */}
                              <div className="mt-3">
                                <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full transition-all"
                                    style={{
                                      width: `${task.progress}%`,
                                      backgroundColor: STATUS_COLORS[task.status],
                                    }}
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  <button className="w-full p-2 text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg flex items-center justify-center gap-1">
                    <Plus className="w-4 h-4" />
                    Add task
                  </button>
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
