const API_BASE = 'http://localhost:3002/api';
import { useAppStore } from '../stores/appStore';

interface DashboardStats {
  portfolioGrowth: number;
  activeAssets: number;
  tasksDueToday: number;
  workflowsActive: number;
  teamMembers: number;
}

function getClientId(): string | null {
  return useAppStore.getState().client?.id ?? null;
}

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const clientId = getClientId();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (clientId) {
    headers['X-Client-ID'] = clientId;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers,
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

// Dashboard
export async function getDashboardStats() {
  return fetchAPI<DashboardStats>('/dashboard/stats');
}

// Assets - use existing Asset type from types
import type { Asset, Task, TeamMember } from '../types';

export async function getAssets() {
  return fetchAPI<Asset[]>('/assets');
}

export async function getAsset(id: string) {
  return fetchAPI<Asset>(`/assets/${id}`);
}

export async function createAsset(data: Partial<Asset>) {
  return fetchAPI<Asset>('/assets', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateAsset(id: string, data: Partial<Asset>) {
  return fetchAPI<Asset>(`/assets/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteAsset(id: string) {
  return fetchAPI<void>(`/assets/${id}`, {
    method: 'DELETE',
  });
}

// Projects
interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  tasks: Task[];
  members: TeamMember[];
  createdAt: string;
  updatedAt: string;
}

export async function getProjects() {
  return fetchAPI<Project[]>('/projects');
}

export async function getProject(id: string) {
  return fetchAPI<Project>(`/projects/${id}`);
}

export async function createProject(data: Partial<Project>) {
  return fetchAPI<Project>('/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateProject(id: string, data: Partial<Project>) {
  return fetchAPI<Project>(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// Tasks
export async function getTasks(projectId?: string) {
  const query = projectId ? `?projectId=${projectId}` : '';
  return fetchAPI<Task[]>(`/tasks${query}`);
}

export async function createTask(data: Omit<Task, 'id' | 'createdAt'>) {
  return fetchAPI<Task>('/tasks', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateTask(id: string, data: Partial<Task>) {
  return fetchAPI<Task>(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// Advisors
export async function getAdvisors() {
  return fetchAPI<TeamMember[]>('/advisors');
}

export async function getAdvisor(id: string) {
  return fetchAPI<TeamMember>(`/advisors/${id}`);
}

export async function createAdvisor(data: Omit<TeamMember, 'id'>) {
  return fetchAPI<TeamMember>('/advisors', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Contracts
interface Contract {
  id: string;
  title: string;
  parties: string[];
  status: string;
  value: number;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export async function getContracts() {
  return fetchAPI<Contract[]>('/contracts');
}

export async function createContract(data: Omit<Contract, 'id' | 'createdAt'>) {
  return fetchAPI<Contract>('/contracts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateContract(id: string, data: Partial<Contract>) {
  return fetchAPI<Contract>(`/contracts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// Forum
interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: TeamMember;
  replies: number;
  createdAt: string;
}

export async function getForumPosts() {
  return fetchAPI<ForumPost[]>('/forum/posts');
}

export async function createForumPost(data: Omit<ForumPost, 'id' | 'author' | 'replies' | 'createdAt'>) {
  return fetchAPI<ForumPost>('/forum/posts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Team
export async function getTeamMembers() {
  return fetchAPI<TeamMember[]>('/team');
}

// Activity
interface Activity {
  id: string;
  type: string;
  description: string;
  user: TeamMember;
  assetId?: string;
  createdAt: string;
}

export async function getActivity() {
  return fetchAPI<Activity[]>('/activity');
}

// HEOR
interface HEORModelInput {
  assetId: string;
  parameters: Record<string, number>;
}

interface HEORModelResult {
  id: string;
  assetId: string;
  results: Record<string, number>;
  createdAt: string;
}

export async function runHEORModel(data: Partial<HEORModelInput>) {
  return fetchAPI<HEORModelResult>('/heor/run', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
