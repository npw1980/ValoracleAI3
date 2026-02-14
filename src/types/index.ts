// Core application types for ValOracle v3.0

// Asset types
export interface Asset {
  id: string;
  name: string;
  code: string;
  indication: string;
  phase: AssetPhase;
  therapeuticArea: string;
  status: AssetStatus;
  team: TeamMember[];
  createdAt: string;
  updatedAt: string;
}

export type AssetPhase = 'Discovery' | 'Preclinical' | 'Phase 1' | 'Phase 2' | 'Phase 3' | 'Launch' | 'Marketed';
export type AssetStatus = 'Active' | 'On Hold' | 'Completed' | 'Archived';

// Team types
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

// Task types
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: TeamMember;
  dueDate?: string;
  assetId?: string;
  createdAt: string;
}

export type TaskStatus = 'Todo' | 'In Progress' | 'Review' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';

// Workflow types
export interface Workflow {
  id: string;
  name: string;
  type: WorkflowType;
  status: WorkflowStatus;
  steps: WorkflowStep[];
  assetId?: string;
  createdAt: string;
}

export type WorkflowType = 'Launch' | 'Analysis' | 'Contract' | 'Research' | 'Custom';
export type WorkflowStatus = 'Draft' | 'Active' | 'Paused' | 'Completed';

export interface WorkflowStep {
  id: string;
  name: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Skipped';
  assignee?: TeamMember;
  dueDate?: string;
}

// Notification types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

// AI Chat types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  actions?: ChatAction[];
}

export interface ChatAction {
  id: string;
  label: string;
  type: 'suggestion' | 'command';
  action: string;
}

// Search types
export interface SearchResult {
  id: string;
  type: 'asset' | 'task' | 'workflow' | 'document' | 'team';
  title: string;
  subtitle: string;
  url: string;
}

// Context types
export interface AppContext {
  currentAsset?: Asset;
  currentView: string;
  sidebarOpen: boolean;
  valPanelOpen: boolean;
}

// Settings types
export interface UserSettings {
  id: string;
  userId: string;
  theme: 'light' | 'dark' | 'system';
  aiPreference: 'minimal' | 'standard' | 'advanced' | 'full';
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
}
