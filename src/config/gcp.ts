interface GCPConfig {
  projectId: string;
  region: string;
  location: string;
}

export const gcpConfig: GCPConfig = {
  projectId: import.meta.env.VITE_GCP_PROJECT_ID ?? '',
  region: import.meta.env.VITE_GCP_REGION ?? 'us-central1',
  location: import.meta.env.VITE_VERTEX_LOCATION ?? 'us-central1',
};

export const isGCPConfigured = Boolean(gcpConfig.projectId);
