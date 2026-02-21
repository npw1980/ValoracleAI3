// Workflow and Template Data for ValOracle v3.0

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'launch' | 'analysis' | 'contract' | 'research' | 'heor';
  type?: string;
  duration: string;
  steps: WorkflowPhase[];
  estimatedCost?: string;
  teamSize?: number;
  tags: string[];
}

export interface WorkflowPhase {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
}

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  type: 'manual' | 'automated' | 'approval' | 'review';
  estimatedDays: number;
  dependencies?: string[];
}

// Launch Workflow Templates
export const launchTemplates: WorkflowTemplate[] = [
  {
    id: 'launch-standard',
    name: 'Standard Product Launch',
    description: 'Comprehensive launch workflow covering all aspects from strategy to market access',
    category: 'launch',
    duration: '12-16 weeks',
    estimatedCost: '$500K - $1M',
    teamSize: 8,
    tags: ['Full Launch', 'Phase 3', 'Market Access'],
    steps: [
      {
        id: 'phase-1',
        name: 'Foundation',
        description: 'Set up launch infrastructure and strategy',
        steps: [
          { id: 's1', name: 'Launch Core Team Formation', description: 'Assemble cross-functional team', type: 'manual', estimatedDays: 3 },
          { id: 's2', name: 'Product Profile Finalization', description: 'Complete product labeling and claims', type: 'manual', estimatedDays: 5 },
          { id: 's3', name: 'Target Market Selection', description: 'Identify priority geographic markets', type: 'manual', estimatedDays: 5 },
          { id: 's4', name: 'Competitive Analysis', description: 'Map competitive landscape', type: 'automated', estimatedDays: 3 },
        ],
      },
      {
        id: 'phase-2',
        name: 'Evidence Generation',
        description: 'Develop clinical and health economic evidence',
        steps: [
          { id: 's5', name: 'Evidence Gap Analysis', description: 'Identify missing evidence requirements', type: 'manual', estimatedDays: 5 },
          { id: 's6', name: 'HEOR Model Development', description: 'Build cost-effectiveness models', type: 'manual', estimatedDays: 14 },
          { id: 's7', name: 'KOL Engagement Plan', description: 'Identify and plan KOL interactions', type: 'manual', estimatedDays: 5 },
          { id: 's8', name: 'Clinical Data Synthesis', description: 'Compile clinical trial data', type: 'automated', estimatedDays: 7 },
        ],
      },
      {
        id: 'phase-3',
        name: 'Pricing & Access',
        description: 'Finalize pricing strategy and secure access',
        steps: [
          { id: 's9', name: 'Price Modeling', description: 'Develop pricing scenarios', type: 'manual', estimatedDays: 10 },
          { id: 's10', name: 'Payer Research', description: 'Conduct payer interviews', type: 'manual', estimatedDays: 10 },
          { id: 's11', name: 'Value Proposition Development', description: 'Create payer-facing materials', type: 'manual', estimatedDays: 7 },
          { id: 's12', name: 'Formulary Strategy', description: 'Plan formulary positioning', type: 'manual', estimatedDays: 5 },
        ],
      },
      {
        id: 'phase-4',
        name: 'Contracting',
        description: 'Negotiate and execute payer contracts',
        steps: [
          { id: 's13', name: 'Contract Template Selection', description: 'Choose appropriate contract templates', type: 'manual', estimatedDays: 3 },
          { id: 's14', name: 'Legal Review', description: 'Review contract terms', type: 'approval', estimatedDays: 7 },
          { id: 's15', name: 'Payer Negotiations', description: 'Negotiate contract terms', type: 'manual', estimatedDays: 14 },
          { id: 's16', name: 'Contract Execution', description: 'Sign and activate contracts', type: 'approval', estimatedDays: 5 },
        ],
      },
      {
        id: 'phase-5',
        name: 'Launch Execution',
        description: 'Execute market launch activities',
        steps: [
          { id: 's17', name: 'Launch Materials Production', description: 'Create HCP marketing materials', type: 'manual', estimatedDays: 10 },
          { id: 's18', name: 'Sales Force Training', description: 'Train sales team on product', type: 'manual', estimatedDays: 5 },
          { id: 's19', name: 'HCP Engagement Launch', description: 'Begin physician outreach', type: 'manual', estimatedDays: 3 },
          { id: 's20', name: 'Market Launch', description: 'Commercial availability', type: 'approval', estimatedDays: 1 },
          { id: 's21', name: 'Launch Monitoring', description: 'Track launch metrics', type: 'automated', estimatedDays: 14 },
        ],
      },
    ],
  },
  {
    id: 'launch-fast-track',
    name: 'Fast Track Launch',
    description: 'Accelerated timeline for urgent market entry with key activities prioritized',
    category: 'launch',
    duration: '6-8 weeks',
    estimatedCost: '$250K - $500K',
    teamSize: 5,
    tags: ['Accelerated', 'Urgent', 'Limited Markets'],
    steps: [
      {
        id: 'phase-1',
        name: 'Quick Foundation',
        description: 'Rapid setup for launch',
        steps: [
          { id: 's1', name: 'Rapid Team Assembly', description: 'Quick team formation', type: 'manual', estimatedDays: 1 },
          { id: 's2', name: 'Priority Markets', description: 'Select 2-3 key markets', type: 'manual', estimatedDays: 2 },
        ],
      },
      {
        id: 'phase-2',
        name: 'Essential Evidence',
        description: 'Focus on critical evidence only',
        steps: [
          { id: 's3', name: 'Key Evidence Compilation', description: 'Compile must-have evidence', type: 'manual', estimatedDays: 5 },
          { id: 's4', name: 'Basic HEOR', description: 'Simple cost-effectiveness summary', type: 'manual', estimatedDays: 7 },
        ],
      },
      {
        id: 'phase-3',
        name: 'Priority Launch',
        description: 'Execute in priority markets',
        steps: [
          { id: 's5', name: 'Priority Contracts', description: 'Target key payers only', type: 'manual', estimatedDays: 10 },
          { id: 's6', name: 'Core Launch Materials', description: 'Essential marketing only', type: 'manual', estimatedDays: 5 },
          { id: 's7', name: 'Launch', description: 'Market entry', type: 'approval', estimatedDays: 1 },
        ],
      },
    ],
  },
  {
    id: 'launch-evidence-focused',
    name: 'Evidence-Focused Launch',
    description: 'Emphasizes health economics and evidence generation for premium pricing',
    category: 'launch',
    duration: '16-20 weeks',
    estimatedCost: '$750K - $1.5M',
    teamSize: 10,
    tags: ['HEOR', 'Premium Pricing', 'Academic'],
    steps: [
      {
        id: 'phase-1',
        name: 'Evidence Strategy',
        description: 'Comprehensive evidence planning',
        steps: [
          { id: 's1', name: 'Evidence Requirements Mapping', description: 'Detailed gap analysis', type: 'manual', estimatedDays: 10 },
          { id: 's2', name: 'HEOR Strategic Plan', description: 'Full HEOR roadmap', type: 'manual', estimatedDays: 7 },
          { id: 's3', name: 'Publication Strategy', description: 'Scientific communication plan', type: 'manual', estimatedDays: 5 },
        ],
      },
      {
        id: 'phase-2',
        name: 'Deep Evidence',
        description: 'Extensive evidence development',
        steps: [
          { id: 's4', name: 'CEA Model Development', description: 'Full cost-effectiveness analysis', type: 'manual', estimatedDays: 30 },
          { id: 's5', name: 'Budget Impact Models', description: 'Payer-specific models', type: 'manual', estimatedDays: 14 },
          { id: 's6', name: 'Patient-reported Outcomes', description: 'QoL and PRO instrument development', type: 'manual', estimatedDays: 14 },
          { id: 's7', name: 'Indirect Treatment Comparisons', description: 'Network meta-analysis', type: 'automated', estimatedDays: 21 },
        ],
      },
      {
        id: 'phase-3',
        name: 'Access Strategy',
        description: 'Premium positioning',
        steps: [
          { id: 's8', name: 'Value Dossier Development', description: 'Comprehensive value story', type: 'manual', estimatedDays: 14 },
          { id: 's9', name: 'ICER Submission', description: 'Submit to pricing watchdog', type: 'manual', estimatedDays: 7 },
          { id: 's10', name: 'Premium Pricing Strategy', description: 'Justify premium price point', type: 'manual', estimatedDays: 7 },
        ],
      },
      {
        id: 'phase-4',
        name: 'Full Launch',
        description: 'Complete market launch',
        steps: [
          { id: 's11', name: 'Full Contracting', description: 'Comprehensive contract portfolio', type: 'manual', estimatedDays: 21 },
          { id: 's12', name: 'Launch Excellence', description: 'Full launch execution', type: 'manual', estimatedDays: 14 },
        ],
      },
    ],
  },
];

// Analysis Templates
export const analysisTemplates: WorkflowTemplate[] = [
  {
    id: 'analysis-market',
    name: 'Market Analysis',
    description: 'Comprehensive market intelligence and competitive analysis',
    category: 'analysis',
    duration: '4-6 weeks',
    tags: ['Market Research', 'Competitive'],
    steps: [
      {
        id: 'phase-1',
        name: 'Market Sizing',
        description: 'Quantify market opportunity',
        steps: [
          { id: 's1', name: 'Epidemiology Analysis', description: 'Disease prevalence and incidence', type: 'manual', estimatedDays: 5 },
          { id: 's2', name: 'Market Segmentation', description: 'Identify patient segments', type: 'manual', estimatedDays: 5 },
          { id: 's3', name: 'Revenue Forecasting', description: 'Market revenue projections', type: 'automated', estimatedDays: 3 },
        ],
      },
      {
        id: 'phase-2',
        name: 'Competitive Intelligence',
        description: 'Analyze competitive landscape',
        steps: [
          { id: 's4', name: 'Competitor Mapping', description: 'Identify key competitors', type: 'manual', estimatedDays: 3 },
          { id: 's5', name: 'Product Analysis', description: 'Compare product features', type: 'manual', estimatedDays: 5 },
          { id: 's6', name: 'Pricing Analysis', description: 'Competitor pricing review', type: 'manual', estimatedDays: 5 },
        ],
      },
    ],
  },
  {
    id: 'analysis-pricing',
    name: 'Pricing Strategy',
    description: 'Data-driven pricing analysis and optimization',
    category: 'analysis',
    duration: '6-8 weeks',
    tags: ['Pricing', 'Value-Based'],
    steps: [
      {
        id: 'phase-1',
        name: 'Price Research',
        description: 'Gather pricing intelligence',
        steps: [
          { id: 's1', name: 'International Price Benchmarking', description: 'Compare global prices', type: 'manual', estimatedDays: 7 },
          { id: 's2', name: 'WTP Studies', description: 'Willigness-to-pay research', type: 'manual', estimatedDays: 14 },
        ],
      },
      {
        id: 'phase-2',
        name: 'Price Modeling',
        description: 'Develop pricing scenarios',
        steps: [
          { id: 's3', name: 'Price-Volume Models', description: 'Forecast scenarios', type: 'automated', estimatedDays: 7 },
          { id: 's4', name: 'Payer Acceptance Testing', description: 'Validate pricing with payers', type: 'manual', estimatedDays: 10 },
        ],
      },
    ],
  },
];

// Contract Templates
export const contractTemplates: WorkflowTemplate[] = [
  {
    id: 'contract-payer',
    name: 'Payer Contract',
    description: 'Standard payer contract negotiation workflow',
    category: 'contract',
    duration: '8-12 weeks',
    tags: ['Payer', 'Rebates', 'Formulary'],
    steps: [
      {
        id: 'phase-1',
        name: 'Preparation',
        description: 'Contract preparation',
        steps: [
          { id: 's1', name: 'Contract Strategy', description: 'Define terms and targets', type: 'manual', estimatedDays: 5 },
          { id: 's2', name: 'Template Selection', description: 'Choose contract template', type: 'manual', estimatedDays: 2 },
        ],
      },
      {
        id: 'phase-2',
        name: 'Negotiation',
        description: 'Payer negotiations',
        steps: [
          { id: 's3', name: 'Initial Offer', description: 'Submit contract proposal', type: 'manual', estimatedDays: 3 },
          { id: 's4', name: 'Terms Negotiation', description: 'Negotiate rebates and terms', type: 'manual', estimatedDays: 21 },
        ],
      },
      {
        id: 'phase-3',
        name: 'Execution',
        description: 'Finalize contract',
        steps: [
          { id: 's5', name: 'Legal Review', description: 'Final legal review', type: 'approval', estimatedDays: 7 },
          { id: 's6', name: 'Signature', description: 'Execute contract', type: 'approval', estimatedDays: 3 },
        ],
      },
    ],
  },
];

// Research Templates
export const researchTemplates: WorkflowTemplate[] = [
  {
    id: 'research-heor',
    name: 'HEOR Study',
    description: 'Health economics and outcomes research project',
    category: 'heor',
    duration: '12-24 weeks',
    tags: ['HEOR', 'Clinical', 'Economic'],
    steps: [
      {
        id: 'phase-1',
        name: 'Study Design',
        description: 'Plan research methodology',
        steps: [
          { id: 's1', name: 'Research Questions', description: 'Define study objectives', type: 'manual', estimatedDays: 5 },
          { id: 's2', name: 'Methodology Selection', description: 'Choose analytical approach', type: 'manual', estimatedDays: 7 },
        ],
      },
      {
        id: 'phase-2',
        name: 'Analysis',
        description: 'Conduct research',
        steps: [
          { id: 's3', name: 'Data Collection', description: 'Gather required data', type: 'manual', estimatedDays: 14 },
          { id: 's4', name: 'Statistical Analysis', description: 'Run analyses', type: 'automated', estimatedDays: 14 },
        ],
      },
      {
        id: 'phase-3',
        name: 'Reporting',
        description: 'Document findings',
        steps: [
          { id: 's5', name: 'Results Synthesis', description: 'Interpret findings', type: 'manual', estimatedDays: 7 },
          { id: 's6', name: 'Publication', description: 'Prepare manuscript', type: 'manual', estimatedDays: 14 },
        ],
      },
    ],
  },
];

// All Templates
export const allTemplates = [
  ...launchTemplates,
  ...analysisTemplates,
  ...contractTemplates,
  ...researchTemplates,
];

// Helper functions
export function getTemplatesByCategory(category: WorkflowTemplate['category']) {
  return allTemplates.filter(t => t.category === category);
}

export function getTemplateById(id: string) {
  return allTemplates.find(t => t.id === id);
}

export function getTotalSteps(template: WorkflowTemplate): number {
  return template.steps.reduce((acc, phase) => acc + phase.steps.length, 0);
}

export function getTotalDays(template: WorkflowTemplate): number {
  return template.steps.reduce((acc, phase) =>
    acc + phase.steps.reduce((a, step) => a + step.estimatedDays, 0), 0);
}
