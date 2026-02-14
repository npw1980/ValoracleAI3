const API_BASE = 'http://localhost:3002/api';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

// Dashboard
export async function getDashboardStats() {
  return fetchAPI<{
    portfolioGrowth: number;
    activeAssets: number;
    tasksDueToday: number;
    workflowsActive: number;
    teamMembers: number;
  }>('/dashboard/stats');
}

// Assets
export async function getAssets() {
  return fetchAPI<any[]>('/assets');
}

export async function getAsset(id: string) {
  return fetchAPI<any>(`/assets/${id}`);
}

export async function createAsset(data: any) {
  return fetchAPI<any>('/assets', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateAsset(id: string, data: any) {
  return fetchAPI<any>(`/assets/${id}`, {
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
export async function getProjects() {
  return fetchAPI<any[]>('/projects');
}

export async function getProject(id: string) {
  return fetchAPI<any>(`/projects/${id}`);
}

export async function createProject(data: any) {
  return fetchAPI<any>('/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateProject(id: string, data: any) {
  return fetchAPI<any>(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// Tasks
export async function getTasks(projectId?: string) {
  const query = projectId ? `?projectId=${projectId}` : '';
  return fetchAPI<any[]>(`/tasks${query}`);
}

export async function createTask(data: any) {
  return fetchAPI<any>('/tasks', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateTask(id: string, data: any) {
  return fetchAPI<any>(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// Advisors
export async function getAdvisors() {
  return fetchAPI<any[]>('/advisors');
}

export async function getAdvisor(id: string) {
  return fetchAPI<any>(`/advisors/${id}`);
}

export async function createAdvisor(data: any) {
  return fetchAPI<any>('/advisors', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Contracts
export async function getContracts() {
  return fetchAPI<any[]>('/contracts');
}

export async function createContract(data: any) {
  return fetchAPI<any>('/contracts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateContract(id: string, data: any) {
  return fetchAPI<any>(`/contracts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// Forum
export async function getForumPosts() {
  return fetchAPI<any[]>('/forum/posts');
}

export async function createForumPost(data: any) {
  return fetchAPI<any>('/forum/posts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Team
export async function getTeamMembers() {
  return fetchAPI<any[]>('/team');
}

// Activity
export async function getActivity() {
  return fetchAPI<any[]>('/activity');
}

// HEOR
export async function runHEORModel(data: any) {
  return fetchAPI<any>('/heor/run', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
