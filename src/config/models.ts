export interface ModelVersion {
  id: string;
  modelId: string;
  provider: string;
  rolloutPercent: number;
  enabled: boolean;
  evaluationNotes?: string;
}

export const modelVersions: ModelVersion[] = [
  {
    id: 'v1',
    modelId: 'claude-opus-4-6',
    provider: 'anthropic',
    rolloutPercent: 100,
    enabled: true,
    evaluationNotes: 'Primary production model',
  },
];

export function getActiveModel(): ModelVersion | undefined {
  return modelVersions.find((m) => m.enabled);
}
