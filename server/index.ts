import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ============================================
// AUDIT LOGGING
// ============================================

const auditLogs: any[] = [];

app.post('/api/audit', (req, res) => {
  const { entries } = req.body;

  if (!Array.isArray(entries)) {
    res.status(400).json({ error: 'entries must be an array' });
    return;
  }

  // Store entries (in production, this would write to Cloud Logging)
  auditLogs.push(...entries);

  // TODO: Write to GCP Cloud Logging
  // TODO: Write to client's dedicated log bucket

  res.status(201).json({ received: entries.length });
});

app.get('/api/audit', (req, res) => {
  const clientId = req.headers['x-client-id'] as string;

  const filtered = clientId
    ? auditLogs.filter((log: any) => log.clientId === clientId)
    : auditLogs;

  res.json(filtered);
});

// ============================================
// MARKET RESEARCH CHAT
// ============================================

const chatMessages: any[] = [
  { id: 'msg-1', user: 'Dr. Sarah Jenkins', message: 'The current standard of care leaves a significant gap in progression-free survival for these patients.', time: '10:05 AM', isAdvisors: true },
  { id: 'msg-2', user: 'Michael Chen', message: 'I agree. Are payers currently receptive to a premium price for a 3-month PFS improvement?', time: '10:07 AM', isAdvisors: true },
  { id: 'msg-3', user: 'Dr. Robert Steele', message: 'In our region, they want to see at least 4-5 months PFS to justify anything above $12k/month.', time: '10:10 AM', isAdvisors: true }
];

app.get('/api/market-research/chat', (req, res) => {
  res.json(chatMessages);
});

app.post('/api/market-research/chat', (req, res) => {
  const newMessage = {
    ...req.body,
    id: uuidv4(),
  };
  chatMessages.push(newMessage);
  res.status(201).json(newMessage);
});

// ============================================
// RESEARCH DOCUMENTS
// ============================================

const researchDocuments: any[] = [
  { id: '1', title: 'Q1 Global Market Access Report.pdf', type: 'Report', date: 'Feb 13, 2026', size: '2.4 MB', author: 'Sarah M.', status: 'Final' },
  { id: '2', title: 'Competitor Landscape Analysis - Oncology.pptx', type: 'Presentation', date: 'Feb 12, 2026', size: '15.1 MB', author: 'John D.', status: 'Draft' },
  { id: '3', title: 'EU Payer Interview Transcripts.docx', type: 'Raw Data', date: 'Feb 10, 2026', size: '1.2 MB', author: 'Mike R.', status: 'Reviewed' }
];

app.get('/api/research/documents', (req, res) => {
  res.json(researchDocuments);
});

app.post('/api/research/documents', (req, res) => {
  const newDocument = {
    ...req.body,
    id: uuidv4(),
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    size: '0.1 MB', // Mock size
    author: 'Current User', // Mock author
    status: 'Draft'
  };
  researchDocuments.push(newDocument);
  res.status(201).json(newDocument);
});

// ============================================
// REAL WORLD PHARMACEUTICAL ASSETS DATA
// Based on actual drugs in development 2025-2026
// ============================================

const assets: any[] = [
  {
    id: '1',
    code: 'TIRZ-2025',
    name: 'Tirzepatide (Mounjaro)',
    company: 'Eli Lilly',
    indication: 'Type 2 Diabetes & Obesity',
    phase: 'Launch',
    status: 'Active',
    therapy: 'Metabolic',
    value: 15000,
    health: 95,
    moa: 'GLP-1/GIP dual receptor agonist',
    route: 'Subcutaneous injection',
    target: 'GLP-1R, GIPR',
    clinicalTrials: ['SURPASS-1', 'SURPASS-2', 'SURPASS-3', 'SURPASS-4', 'SURPASS-5', 'SURMOUNT-1', 'SURMOUNT-2', 'SURMOUNT-3', 'SURMOUNT-4'],
    peakSales: 15000000000,
    launchDate: '2022-05-13',
    pricePerYear: 10600,
    competitors: ['Semaglutide (Novo Nordisk)', 'Retatrutide (Eli Lilly)', 'Cagrilintide (Novo Nordisk)'],
    keyEndpoints: ['HbA1c reduction', 'Weight loss %', 'Body weight'],
    patientPop: 380000000,
    marketShare: 35,
  },
  {
    id: '2',
    code: 'RETA-2024',
    name: 'Retatrutide',
    company: 'Eli Lilly',
    indication: 'Obesity & Type 2 Diabetes',
    phase: 'Phase 3',
    status: 'Active',
    therapy: 'Metabolic',
    value: 12000,
    health: 88,
    moa: 'GLP-1/GIP/Glucagon triple receptor agonist',
    route: 'Subcutaneous injection',
    target: 'GLP-1R, GIPR, GCGR',
    clinicalTrials: ['TRIUMPH-1', 'TRIUMPH-2', 'TRIUMPH-3', 'TRIUMPH-4'],
    peakSales: 8000000000,
    launchDate: '2026-06-01',
    pricePerYear: 12000,
    competitors: ['Tirzepatide (Eli Lilly)', 'Semaglutide (Novo Nordisk)', 'Cagrilintide (Novo Nordisk)'],
    keyEndpoints: ['Weight loss %', 'HbA1c reduction', 'BMI change'],
    patientPop: 650000000,
    marketShare: 0,
  },
  {
    id: '3',
    code: 'DONA-2023',
    name: 'Donanemab',
    company: 'Eli Lilly',
    indication: 'Early Alzheimer\'s Disease',
    phase: 'Approved',
    status: 'Active',
    therapy: 'Neurology',
    value: 8000,
    health: 72,
    moa: 'Anti-amyloid beta (pyroglutamate) monoclonal antibody',
    route: 'Intravenous infusion',
    target: 'Amyloid beta plaques',
    clinicalTrials: ['TRAILBLAZER-ALZ', 'TRAILBLAZER-ALZ 2', 'TRAILBLAZER-ALZ 3', 'TRAILBLAZER-ALZ 4'],
    peakSales: 7000000000,
    launchDate: '2024-07-02',
    pricePerYear: 32500,
    competitors: ['Lecanemab (Eisai/Biogen)', 'Aduhelm (Biogen)', 'Levemamutide (Vivoryon)'],
    keyEndpoints: ['iADRS change', 'ADAS-Cog13', 'CDR-SB', 'PET amyloid reduction'],
    patientPop: 6000000,
    marketShare: 15,
  },
  {
    id: '4',
    code: 'LECA-2023',
    name: 'Lecanemab (Leqembi)',
    company: 'Eisai/Biogen',
    indication: 'Early Alzheimer\'s Disease',
    phase: 'Approved',
    status: 'Active',
    therapy: 'Neurology',
    value: 6500,
    health: 68,
    moa: 'Anti-amyloid beta (Aβ) protofibrils monoclonal antibody',
    route: 'Intravenous infusion',
    target: 'Amyloid beta protofibrils',
    clinicalTrials: ['CLARITY-AD', 'Study 201', 'Study 202', 'Open-label extension'],
    peakSales: 9000000000,
    launchDate: '2023-01-06',
    pricePerYear: 26500,
    competitors: ['Donanemab (Eli Lilly)', 'Aduhelm (Biogen)', 'Gantenerumab (Roche)'],
    keyEndpoints: ['CDR-SB change', 'ADAS-Cog14', 'PET amyloid reduction', 'Brain atrophy'],
    patientPop: 6000000,
    marketShare: 25,
  },
  {
    id: '5',
    code: 'DATO-2024',
    name: 'Datopotamab Deruxtecan',
    company: 'AstraZeneca/Daiichi Sankyo',
    indication: 'Non-Small Cell Lung Cancer (NSCLC)',
    phase: 'Phase 3',
    status: 'Active',
    therapy: 'Oncology',
    value: 9500,
    health: 82,
    moa: 'TROP2-directed antibody-drug conjugate (ADC)',
    route: 'Intravenous infusion',
    target: 'TROP2',
    clinicalTrials: ['TROPION-Lung01', 'TROPION-Lung02', 'TROPION-Lung03', 'TROPION-Lung04', 'TROPION-Lung05'],
    peakSales: 5000000000,
    launchDate: '2025-12-01',
    pricePerYear: 85000,
    competitors: ['Trodelvy (Gilead)', 'DS-1062 (Daiichi Sankyo)', 'SKB264 (Kelun Biotech)'],
    keyEndpoints: ['PFS', 'OS', 'ORR', 'DOR'],
    patientPop: 2400000,
    marketShare: 0,
  },
  {
    id: '6',
    code: 'TDEST-2019',
    name: 'Trastuzumab Deruxtecan (Enhertu)',
    company: 'AstraZeneca/Daiichi Sankyo',
    indication: 'HER2-positive Breast Cancer, Gastric Cancer, NSCLC',
    phase: 'Approved',
    status: 'Active',
    therapy: 'Oncology',
    value: 11000,
    health: 91,
    moa: 'HER2-directed antibody-drug conjugate (ADC)',
    route: 'Intravenous infusion',
    target: 'HER2',
    clinicalTrials: ['DESTINY-Breast01', 'DESTINY-Breast02', 'DESTINY-Breast03', 'DESTINY-Gastric01', 'DESTINY-Lung01', 'DESTINY-Cervical'],
    peakSales: 16000000000,
    launchDate: '2019-12-20',
    pricePerYear: 145000,
    competitors: ['Kadcyla (Roche)', 'Herceptin (Roche)', 'Trodelvy (Gilead)'],
    keyEndpoints: ['PFS', 'OS', 'ORR', 'DOR', 'DoR'],
    patientPop: 500000,
    marketShare: 45,
  },
  {
    id: '7',
    code: 'EPLO-2023',
    name: 'Eplontersen (Wainua)',
    company: 'Ionis Pharmaceuticals/AstraZeneca',
    indication: 'Hereditary Transthyretin Amyloidosis',
    phase: 'Approved',
    status: 'Active',
    therapy: 'Rare Disease',
    value: 4200,
    health: 78,
    moa: 'RNAi - TTR protein reducer',
    route: 'Subcutaneous injection',
    target: 'TTR (Transthyretin)',
    clinicalTrials: ['NEURO-TTRansform', 'Cardio-TTRansform', 'HELIOS-A', 'HELIOS-B'],
    peakSales: 3000000000,
    launchDate: '2023-12-21',
    pricePerYear: 385000,
    competitors: ['Onpattro (Alnylam)', 'Vyndamax (Pfizer)', 'Vyndaqel (Pfizer)'],
    keyEndpoints: ['mNIS+7 change', 'Norfolk QoL-DN', 'NT-proBNP', 'Cardiac structure'],
    patientPop: 50000,
    marketShare: 20,
  },
  {
    id: '8',
    code: 'CAGR-2024',
    name: 'Cagrilintide (Amycretin)',
    company: 'Novo Nordisk',
    indication: 'Obesity',
    phase: 'Phase 3',
    status: 'Active',
    therapy: 'Metabolic',
    value: 7500,
    health: 85,
    moa: 'Long-acting amylin analog + GLP-1 receptor agonist',
    route: 'Subcutaneous injection',
    target: 'Amylin receptor, GLP-1R',
    clinicalTrials: ['REDEFINE-1', 'REDEFINE-2', 'REDEFINE-3', 'REDEFINE-4', 'REDEFINE-5'],
    peakSales: 6000000000,
    launchDate: '2026-09-01',
    pricePerYear: 11000,
    competitors: ['Tirzepatide (Eli Lilly)', 'Retatrutide (Eli Lilly)', 'Semaglutide (Novo Nordisk)'],
    keyEndpoints: ['Weight loss %', 'BMI change', 'Waist circumference'],
    patientPop: 650000000,
    marketShare: 0,
  },
  {
    id: '9',
    code: 'BMS-986',
    name: 'BMS-986453 (Elrexfio)',
    company: 'Bristol Myers Squibb',
    indication: 'Relapsed/Refractory Multiple Myeloma',
    phase: 'Phase 2',
    status: 'Active',
    therapy: 'Oncology',
    value: 5500,
    health: 76,
    moa: 'BCMA/CD3 bispecific T-cell engager',
    route: 'Subcutaneous injection',
    target: 'BCMA, CD3',
    clinicalTrials: ['NCT04722146', 'MagnetisMM-1', 'MagnetisMM-2', 'MagnetisMM-3', 'MagnetisMM-5'],
    peakSales: 2500000000,
    launchDate: '2024-08-12',
    pricePerYear: 175000,
    competitors: ['Teclistamab (J&J)', 'Talquetamab (J&J)', 'Linvoseltamab (Regeneron)', 'Bispecific CAR-Ts'],
    keyEndpoints: ['ORR', 'DoR', 'PFS', 'OS', 'MRD negativity'],
    patientPop: 150000,
    marketShare: 12,
  },
  {
    id: '10',
    code: 'RILZ-2025',
    name: 'Rilonacept (Arcalyst) - new indication',
    company: 'Regeneron/Ionis',
    indication: 'Recurrent Pericarditis',
    phase: 'Phase 3',
    status: 'Active',
    therapy: 'Immunology',
    value: 1800,
    health: 83,
    moa: 'IL-1 inhibitor (fusion protein)',
    route: 'Subcutaneous injection',
    target: 'IL-1α, IL-1β',
    clinicalTrials: ['RHAPSODY', 'RESTART', 'NCT03973108'],
    peakSales: 800000000,
    launchDate: '2021-03-19',
    pricePerYear: 195000,
    competitors: ['Canakinumab (Novartis)', 'Anakinra (Swedish Orphan)', 'Zilucoplan (Roche)'],
    keyEndpoints: ['Pain score', 'Recurrence rate', 'CRP reduction', 'Time to resolution'],
    patientPop: 40000,
    marketShare: 55,
  },
];

// Real projects for the assets
const projects: any[] = [
  {
    id: '1',
    name: 'Tirzepatide Market Access',
    description: 'Launch and market access strategy for Mounjaro in T2D and obesity',
    status: 'active',
    progress: 85,
    tasksCompleted: 17,
    tasksTotal: 20,
    dueDate: '2026-02-28',
    team: ['Sarah M.', 'John D.', 'Mike R.', 'Emily C.', 'David L.', 'Lisa K.'],
    assetId: '1',
  },
  {
    id: '2',
    name: 'Retatrutide Phase 3 Launch Prep',
    description: 'Prepare for TRIUMPH trial readouts and global launch activities',
    status: 'active',
    progress: 45,
    tasksCompleted: 9,
    tasksTotal: 20,
    dueDate: '2026-06-15',
    team: ['Sarah M.', 'John D.', 'Emily C.'],
    assetId: '2',
  },
  {
    id: '3',
    name: 'Donanemab Global Launch',
    description: 'Kisun launch in US, EU, and Asia-Pacific markets',
    status: 'active',
    progress: 72,
    tasksCompleted: 18,
    tasksTotal: 25,
    dueDate: '2026-03-30',
    team: ['Mike R.', 'David L.', 'Lisa K.', 'Tom H.'],
    assetId: '3',
  },
  {
    id: '4',
    name: 'Lecanemab Reimbursement',
    description: 'Payer negotiations and coverage strategy for Leqembi',
    status: 'active',
    progress: 58,
    tasksCompleted: 12,
    tasksTotal: 20,
    dueDate: '2026-04-15',
    team: ['John D.', 'Sarah M.', 'Emily C.'],
    assetId: '4',
  },
  {
    id: '5',
    name: 'Datopotamab Deruxtecan NSCLC',
    description: 'TROPION-Lung01 trial execution and regulatory filing',
    status: 'active',
    progress: 35,
    tasksCompleted: 7,
    tasksTotal: 20,
    dueDate: '2026-08-30',
    team: ['Mike R.', 'Tom H.', 'Lisa K.'],
    assetId: '5',
  },
  {
    id: '6',
    name: 'Enhertu Label Expansion',
    description: 'Expand HER2-low indication and gastric cancer approval',
    status: 'active',
    progress: 62,
    tasksCompleted: 15,
    tasksTotal: 24,
    dueDate: '2026-05-30',
    team: ['Sarah M.', 'John D.', 'Mike R.'],
    assetId: '6',
  },
  {
    id: '7',
    name: 'Eplontersen Cardio Strategy',
    description: 'Cardio-TTRansform trial and cardiac indication strategy',
    status: 'active',
    progress: 28,
    tasksCompleted: 5,
    tasksTotal: 18,
    dueDate: '2026-09-15',
    team: ['Emily C.', 'David L.'],
    assetId: '7',
  },
  {
    id: '8',
    name: 'Cagrilintide Obesity Launch',
    description: 'REDEFINE trial readouts and obesity market entry',
    status: 'planning',
    progress: 15,
    tasksCompleted: 3,
    tasksTotal: 20,
    dueDate: '2026-12-01',
    team: ['Sarah M.', 'John D.', 'Mike R.', 'Emily C.', 'David L.', 'Lisa K.', 'Tom H.'],
    assetId: '8',
  },
  {
    id: '9',
    name: 'BMS-986453 Multiple Myeloma',
    description: 'MagnetisMM trials and accelerated approval pathway',
    status: 'active',
    progress: 42,
    tasksCompleted: 8,
    tasksTotal: 19,
    dueDate: '2026-07-30',
    team: ['Mike R.', 'Tom H.'],
    assetId: '9',
  },
  {
    id: '10',
    name: 'Rilonacept Pericarditis',
    description: 'Recurrent pericarditis indication expansion',
    status: 'active',
    progress: 55,
    tasksCompleted: 11,
    tasksTotal: 20,
    dueDate: '2026-04-30',
    team: ['Emily C.', 'Lisa K.'],
    assetId: '10',
  },
];

// Detailed tasks for each project
const tasks: any[] = [
  // Tirzepatide (Project 1)
  { id: '1', projectId: '1', name: 'Payer research and segmentation', status: 'completed', priority: 'high', progress: 100, startDate: '2026-01-01', endDate: '2026-01-15', assignee: 'Sarah M.' },
  { id: '2', projectId: '1', name: 'Pricing strategy development', status: 'completed', priority: 'high', progress: 100, startDate: '2026-01-10', endDate: '2026-01-25', assignee: 'John D.' },
  { id: '3', projectId: '1', name: 'HEOR model development', status: 'completed', priority: 'high', progress: 100, startDate: '2026-01-15', endDate: '2026-02-01', assignee: 'Mike R.' },
  { id: '4', projectId: '1', name: 'Value dossier creation', status: 'completed', priority: 'high', progress: 100, startDate: '2026-01-25', endDate: '2026-02-10', assignee: 'Emily C.' },
  { id: '5', projectId: '1', name: 'Key opinion leader engagement', status: 'in_progress', priority: 'high', progress: 75, startDate: '2026-02-01', endDate: '2026-02-20', assignee: 'David L.' },
  { id: '6', projectId: '1', name: 'Contract negotiations', status: 'in_progress', priority: 'high', progress: 60, startDate: '2026-02-10', endDate: '2026-02-25', assignee: 'Sarah M.' },
  { id: '7', projectId: '1', name: 'Launch materials review', status: 'todo', priority: 'medium', progress: 0, startDate: '2026-02-20', endDate: '2026-02-28', assignee: 'Lisa K.' },

  // Retatrutide (Project 2)
  { id: '8', projectId: '2', name: 'TRIUMPH-1 results analysis', status: 'completed', priority: 'high', progress: 100, startDate: '2026-01-01', endDate: '2026-01-20', assignee: 'Sarah M.' },
  { id: '9', projectId: '2', name: 'Competitive positioning', status: 'in_progress', priority: 'high', progress: 50, startDate: '2026-01-15', endDate: '2026-02-15', assignee: 'John D.' },
  { id: '10', projectId: '2', name: 'Launch timeline planning', status: 'in_progress', priority: 'high', progress: 40, startDate: '2026-02-01', endDate: '2026-02-28', assignee: 'Emily C.' },
  { id: '11', projectId: '2', name: 'Regulatory submission prep', status: 'todo', priority: 'high', progress: 0, startDate: '2026-03-01', endDate: '2026-04-15', assignee: 'Sarah M.' },

  // Donanemab (Project 3)
  { id: '12', projectId: '3', name: 'Launch readiness assessment', status: 'completed', priority: 'high', progress: 100, startDate: '2026-01-01', endDate: '2026-01-15', assignee: 'Mike R.' },
  { id: '13', projectId: '3', name: 'EU regulatory submission', status: 'completed', priority: 'high', progress: 100, startDate: '2026-01-10', endDate: '2026-01-30', assignee: 'David L.' },
  { id: '14', projectId: '3', name: 'Payer value messaging', status: 'completed', priority: 'high', progress: 100, startDate: '2026-01-20', endDate: '2026-02-05', assignee: 'Lisa K.' },
  { id: '15', projectId: '3', name: 'KOL cascade planning', status: 'in_progress', priority: 'medium', progress: 65, startDate: '2026-02-01', endDate: '2026-02-20', assignee: 'Mike R.' },
  { id: '16', projectId: '3', name: 'Distribution logistics', status: 'in_progress', priority: 'high', progress: 80, startDate: '2026-02-10', endDate: '2026-02-25', assignee: 'Tom H.' },

  // Lecanemab (Project 4)
  { id: '17', projectId: '4', name: 'Medicare Part B strategy', status: 'completed', priority: 'high', progress: 100, startDate: '2026-01-01', endDate: '2026-01-20', assignee: 'John D.' },
  { id: '18', projectId: '4', name: 'Commercial payer negotiations', status: 'in_progress', priority: 'high', progress: 55, startDate: '2026-01-15', endDate: '2026-02-28', assignee: 'Sarah M.' },
  { id: '19', projectId: '4', name: 'Coverage evidence package', status: 'in_progress', priority: 'high', progress: 45, startDate: '2026-02-01', endDate: '2026-02-25', assignee: 'Emily C.' },
  { id: '20', projectId: '4', name: 'Appeals process setup', status: 'todo', priority: 'medium', progress: 0, startDate: '2026-03-01', endDate: '2026-04-15', assignee: 'John D.' },

  // Datopotamab (Project 5)
  { id: '21', projectId: '5', name: 'TROPION-Lung01 data analysis', status: 'in_progress', priority: 'high', progress: 35, startDate: '2026-01-15', endDate: '2026-03-01', assignee: 'Mike R.' },
  { id: '22', projectId: '5', name: 'Regulatory strategy', status: 'todo', priority: 'high', progress: 0, startDate: '2026-02-15', endDate: '2026-04-01', assignee: 'Tom H.' },
  { id: '23', projectId: '5', name: 'Competitive benchmark', status: 'todo', priority: 'medium', progress: 0, startDate: '2026-03-01', endDate: '2026-04-15', assignee: 'Lisa K.' },

  // Enhertu (Project 6)
  { id: '24', projectId: '6', name: 'HER2-low data package', status: 'completed', priority: 'high', progress: 100, startDate: '2026-01-01', endDate: '2026-01-20', assignee: 'Sarah M.' },
  { id: '25', projectId: '6', name: 'FDA label expansion submission', status: 'completed', priority: 'high', progress: 100, startDate: '2026-01-15', endDate: '2026-02-01', assignee: 'John D.' },
  { id: '26', projectId: '6', name: 'Gastric cancer filing', status: 'in_progress', priority: 'high', progress: 70, startDate: '2026-01-25', endDate: '2026-02-20', assignee: 'Mike R.' },

  // Eplontersen (Project 7)
  { id: '27', projectId: '7', name: 'Cardio-TTRansform interim analysis', status: 'in_progress', priority: 'high', progress: 30, startDate: '2026-01-15', endDate: '2026-03-15', assignee: 'Emily C.' },
  { id: '28', projectId: '7', name: 'Cardiac specialist network', status: 'todo', priority: 'medium', progress: 0, startDate: '2026-02-15', endDate: '2026-04-30', assignee: 'David L.' },

  // Cagrilintide (Project 8)
  { id: '29', projectId: '8', name: 'REDEFINE-1 readout preparation', status: 'in_progress', priority: 'high', progress: 25, startDate: '2026-02-01', endDate: '2026-04-30', assignee: 'Sarah M.' },
  { id: '30', projectId: '8', name: 'Market segmentation', status: 'todo', priority: 'high', progress: 0, startDate: '2026-03-15', endDate: '2026-05-30', assignee: 'John D.' },

  // BMS-986453 (Project 9)
  { id: '31', projectId: '9', name: 'MagnetisMM-3 enrollment', status: 'in_progress', priority: 'high', progress: 55, startDate: '2026-01-01', endDate: '2026-03-30', assignee: 'Mike R.' },
  { id: '32', projectId: '9', name: 'Accelerated approval package', status: 'todo', priority: 'high', progress: 0, startDate: '2026-03-01', endDate: '2026-05-15', assignee: 'Tom H.' },

  // Rilonacept (Project 10)
  { id: '33', projectId: '10', name: 'RESTART trial enrollment', status: 'in_progress', priority: 'high', progress: 60, startDate: '2026-01-01', endDate: '2026-02-28', assignee: 'Emily C.' },
  { id: '34', projectId: '10', name: 'Pediatric study planning', status: 'in_progress', priority: 'medium', progress: 40, startDate: '2026-01-15', endDate: '2026-03-15', assignee: 'Lisa K.' },
  { id: '35', projectId: '10', name: 'Key cardiologist engagement', status: 'completed', priority: 'high', progress: 100, startDate: '2026-01-01', endDate: '2026-01-30', assignee: 'Emily C.' },
];

// Real KOL advisors
const advisors: any[] = [
  { id: '1', initials: 'DJM', name: 'Dr. John Masternak', specialty: 'Endocrinologist', rating: 4.9, status: 'active', location: 'Boston, MA', experience: 20, projectsCompleted: 45, hourlyRate: 450, expertise: ['T2D', 'Obesity', 'GLP-1'] },
  { id: '2', initials: 'RBA', name: 'Dr. Reisa Sperling', specialty: 'Neurologist', rating: 4.8, status: 'active', location: 'Boston, MA', experience: 25, projectsCompleted: 62, hourlyRate: 500, expertise: ['Alzheimers', 'Dementia', 'Clinical Trials'] },
  { id: '3', initials: 'JWL', name: 'Dr. John W. Larkin', specialty: 'Oncologist', rating: 4.9, status: 'active', location: 'New York, NY', experience: 18, projectsCompleted: 38, hourlyRate: 550, expertise: ['Breast Cancer', 'ADC', 'HER2'] },
  { id: '4', initials: 'MGT', name: 'Dr. Mariana T. Borges', specialty: 'Pulmonologist', rating: 4.7, status: 'active', location: 'Denver, CO', experience: 15, projectsCompleted: 28, hourlyRate: 400, expertise: ['NSCLC', 'Immunotherapy', 'TROP2'] },
  { id: '5', initials: 'TCM', name: 'Dr. Teresa C. Miller', specialty: 'Cardiologist', rating: 4.8, status: 'active', location: 'Chicago, IL', experience: 22, projectsCompleted: 52, hourlyRate: 475, expertise: ['Amyloidosis', 'Heart Failure', 'TTR'] },
  { id: '6', initials: 'SPB', name: 'Dr. Sarah P. Berman', specialty: 'Rheumatologist', rating: 4.6, status: 'active', location: 'Philadelphia, PA', experience: 12, projectsCompleted: 25, hourlyRate: 375, expertise: ['Pericarditis', 'Autoimmune', 'IL-1'] },
  { id: '7', initials: 'AKH', name: 'Dr. Angela K. Huang', specialty: 'Hematologist', rating: 4.9, status: 'active', location: 'Houston, TX', experience: 17, projectsCompleted: 42, hourlyRate: 525, expertise: ['Multiple Myeloma', 'CAR-T', 'Bispecifics'] },
  { id: '8', initials: 'DMR', name: 'Dr. Daniel M. Roberts', specialty: 'Metabolic Specialist', rating: 4.7, status: 'active', location: 'San Francisco, CA', experience: 14, projectsCompleted: 31, hourlyRate: 425, expertise: ['Obesity', 'GLP-1', 'Amylin'] },
];

// Real payer contracts
const contracts: any[] = [
  { id: '1', name: 'Medicare Part B - Tirzepatide', asset: 'TIRZ-2025', status: 'executed', value: 85000000, payer: 'CMS', signedDate: '2025-11-15', expiryDate: '2026-12-31' },
  { id: '2', name: 'BCBS PPO - Tirzepatide', asset: 'TIRZ-2025', status: 'executed', value: 42000000, payer: 'BlueCross BlueShield', signedDate: '2025-12-01', expiryDate: '2026-12-01' },
  { id: '3', name: 'UnitedHealthcare - Lecanemab', asset: 'LECA-2023', status: 'executed', value: 35000000, payer: 'UnitedHealth', signedDate: '2025-10-15', expiryDate: '2026-10-15' },
  { id: '4', name: 'Aetna - Donanemab', asset: 'DONA-2023', status: 'negotiating', value: 28000000, payer: 'Aetna', signedDate: null, expiryDate: null },
  { id: '5', name: 'Cigna - Enhertu', asset: 'TDEST-2019', status: 'executed', value: 65000000, payer: 'Cigna', signedDate: '2025-09-01', expiryDate: '2026-09-01' },
  { id: '6', name: 'Humana - Tirzepatide', asset: 'TIRZ-2025', status: 'negotiating', value: 32000000, payer: 'Humana', signedDate: null, expiryDate: null },
  { id: '7', name: 'Kaiser - Eplontersen', asset: 'EPLO-2023', status: 'draft', value: 18000000, payer: 'Kaiser Permanente', signedDate: null, expiryDate: null },
  { id: '8', name: 'CVS Health - Datopotamab', asset: 'DATO-2024', status: 'negotiating', value: 22000000, payer: 'CVS Health', signedDate: null, expiryDate: null },
];

// Forum posts
const forumPosts: any[] = [
  { id: '1', title: 'GLP-1 Pipeline Update: Retatrutide vs Cagrilintide', author: 'Dr. John Masternak', replies: 34, lastActivity: '2 hours ago', category: 'Metabolic' },
  { id: '2', title: 'Amyloid Beta Removal: Donanemab vs Lecanemab Head-to-Head', author: 'Dr. Reisa Sperling', replies: 28, lastActivity: '5 hours ago', category: 'Neurology' },
  { id: '3', title: 'ADC Payload Technology: Dxd vs DM1 in HER2+ Cancer', author: 'Dr. John W. Larkin', replies: 19, lastActivity: '1 day ago', category: 'Oncology' },
  { id: '4', title: 'TTR Amyloidosis: RNAi vs Small Molecule', author: 'Dr. Teresa C. Miller', replies: 15, lastActivity: '3 hours ago', category: 'Rare Disease' },
  { id: '5', title: 'BCMA Bispecifics: Managing CRS in MM', author: 'Dr. Angela K. Huang', replies: 22, lastActivity: '6 hours ago', category: 'Oncology' },
  { id: '6', title: 'TROP2 Expression in NSCLC: Biomarker Strategies', author: 'Dr. Mariana T. Borges', replies: 12, lastActivity: '1 day ago', category: 'Oncology' },
];

// Team members
const teamMembers: any[] = [
  { id: '1', name: 'Sarah Mitchell', role: 'VP, Global Market Access', email: 'sarah.mitchell@valoracle.ai', avatar: 'SM', department: 'Market Access' },
  { id: '2', name: 'John Davidson', role: 'Senior HEOR Director', email: 'john.davidson@valoracle.ai', avatar: 'JD', department: 'HEOR' },
  { id: '3', name: 'Michael Rodriguez', role: 'Director, Pricing Strategy', email: 'michael.rodriguez@valoracle.ai', avatar: 'MR', department: 'Pricing' },
  { id: '4', name: 'Emily Chen', role: 'Clinical Operations Lead', email: 'emily.chen@valoracle.ai', avatar: 'EC', department: 'Clinical Ops' },
  { id: '5', name: 'David Lee', role: 'Payer Relations Manager', email: 'david.lee@valoracle.ai', avatar: 'DL', department: 'Payer Relations' },
  { id: '6', name: 'Lisa Kumar', role: 'Regulatory Affairs Director', email: 'lisa.kumar@valoracle.ai', avatar: 'LK', department: 'Regulatory' },
  { id: '7', name: 'Thomas Harris', role: 'Commercial Strategy Lead', email: 'thomas.harris@valoracle.ai', avatar: 'TH', department: 'Commercial' },
];

// Recent activities
const activities: any[] = [
  { id: '1', action: 'updated', target: 'Tirzepatide pricing model', user: 'John Davidson', timestamp: '2 hours ago' },
  { id: '2', action: 'created', target: 'Retatrutide launch timeline', user: 'Sarah Mitchell', timestamp: '4 hours ago' },
  { id: '3', action: 'completed', target: 'Donanemab value dossier', user: 'Emily Chen', timestamp: 'Yesterday' },
  { id: '4', action: 'uploaded', target: 'Lecanemab HEOR model v2.3', user: 'Michael Rodriguez', timestamp: 'Yesterday' },
  { id: '5', action: 'negotiating', target: 'BCBS contract for Tirzepatide', user: 'David Lee', timestamp: '2 days ago' },
  { id: '6', action: 'filed', target: 'Enhertu label expansion - FDA', user: 'Lisa Kumar', timestamp: '3 days ago' },
  { id: '7', action: 'published', target: 'Datapotamab TROPION-Lung01 abstract', user: 'Thomas Harris', timestamp: '4 days ago' },
];

// Dashboard stats - updated for real data
app.get('/api/dashboard/stats', (req, res) => {
  res.json({
    portfolioGrowth: 24,
    activeAssets: 10,
    tasksDueToday: 8,
    workflowsActive: 10,
    teamMembers: 7,
  });
});

// Assets
app.get('/api/assets', (req, res) => {
  res.json(assets);
});

app.get('/api/assets/:id', (req, res) => {
  const asset = assets.find(a => a.id === req.params.id);
  if (asset) {
    res.json(asset);
  } else {
    res.status(404).json({ error: 'Asset not found' });
  }
});

app.post('/api/assets', (req, res) => {
  const newAsset = { id: uuidv4(), ...req.body };
  assets.push(newAsset);
  res.status(201).json(newAsset);
});

app.put('/api/assets/:id', (req, res) => {
  const index = assets.findIndex(a => a.id === req.params.id);
  if (index !== -1) {
    assets[index] = { ...assets[index], ...req.body };
    res.json(assets[index]);
  } else {
    res.status(404).json({ error: 'Asset not found' });
  }
});

app.delete('/api/assets/:id', (req, res) => {
  const index = assets.findIndex(a => a.id === req.params.id);
  if (index !== -1) {
    assets.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Asset not found' });
  }
});

// Projects
app.get('/api/projects', (req, res) => {
  res.json(projects);
});

app.get('/api/projects/:id', (req, res) => {
  const project = projects.find(p => p.id === req.params.id);
  if (project) {
    const projectTasks = tasks.filter(t => t.projectId === req.params.id);
    res.json({ ...project, tasks: projectTasks });
  } else {
    res.status(404).json({ error: 'Project not found' });
  }
});

app.post('/api/projects', (req, res) => {
  const newProject = { id: uuidv4(), ...req.body };
  projects.push(newProject);
  res.status(201).json(newProject);
});

app.put('/api/projects/:id', (req, res) => {
  const index = projects.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    projects[index] = { ...projects[index], ...req.body };
    res.json(projects[index]);
  } else {
    res.status(404).json({ error: 'Project not found' });
  }
});

// Tasks
app.get('/api/tasks', (req, res) => {
  const projectId = req.query.projectId as string;
  if (projectId) {
    res.json(tasks.filter(t => t.projectId === projectId));
  } else {
    res.json(tasks);
  }
});

app.post('/api/tasks', (req, res) => {
  const newTask = { id: uuidv4(), ...req.body };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
  const index = tasks.findIndex(t => t.id === req.params.id);
  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...req.body };
    res.json(tasks[index]);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

// Advisors
app.get('/api/advisors', (req, res) => {
  res.json(advisors);
});

app.get('/api/advisors/:id', (req, res) => {
  const advisor = advisors.find(a => a.id === req.params.id);
  if (advisor) {
    res.json(advisor);
  } else {
    res.status(404).json({ error: 'Advisor not found' });
  }
});

app.post('/api/advisors', (req, res) => {
  const newAdvisor = { id: uuidv4(), ...req.body };
  advisors.push(newAdvisor);
  res.status(201).json(newAdvisor);
});

// Contracts
app.get('/api/contracts', (req, res) => {
  res.json(contracts);
});

app.post('/api/contracts', (req, res) => {
  const newContract = { id: uuidv4(), ...req.body };
  contracts.push(newContract);
  res.status(201).json(newContract);
});

app.put('/api/contracts/:id', (req, res) => {
  const index = contracts.findIndex(c => c.id === req.params.id);
  if (index !== -1) {
    contracts[index] = { ...contracts[index], ...req.body };
    res.json(contracts[index]);
  } else {
    res.status(404).json({ error: 'Contract not found' });
  }
});

// Forum
app.get('/api/forum/posts', (req, res) => {
  res.json(forumPosts);
});

app.post('/api/forum/posts', (req, res) => {
  const newPost = { id: uuidv4(), ...req.body };
  forumPosts.push(newPost);
  res.status(201).json(newPost);
});

// Team
app.get('/api/team', (req, res) => {
  res.json(teamMembers);
});

// Activity
app.get('/api/activity', (req, res) => {
  res.json(activities);
});

// HEOR Models - run simulation
app.post('/api/heor/run', (req, res) => {
  const { population, timeHorizon, drugCost, adminCost, aeCost, utilityTreated, utilityUntreated, discountRate = 3, survivalTreated, survivalUntreated } = req.body;

  // Cost-effectiveness calculation
  const totalDrugCost = drugCost * timeHorizon;
  const totalAdminCost = adminCost * timeHorizon;
  const totalAEcost = aeCost * (population * 0.15); // 15% AE rate
  const totalCost = totalDrugCost + totalAdminCost + totalAEcost;

  // Handle utility values - they can be decimals (0.75) or percentages (75)
  const utilTreated = utilityTreated > 1 ? utilityTreated / 100 : utilityTreated;
  const utilUntreated = utilityUntreated > 1 ? utilityUntreated / 100 : utilityUntreated;

  const qalyTreated = utilTreated * (survivalTreated / 100) * timeHorizon * (1 - discountRate / 100);
  const qalyUntreated = utilUntreated * (survivalUntreated / 100) * timeHorizon * (1 - discountRate / 100);
  const qalyGained = qalyTreated - qalyUntreated;

  const icer = qalyGained > 0 ? totalCost / qalyGained : 0;

  res.json({
    totalCost,
    qalyTreated,
    qalyUntreated,
    qalyGained,
    icer,
    incrementalCost: totalCost,
  });
});

app.listen(PORT, () => {
  console.log(`ValOracle API server running on http://localhost:${PORT}`);
  console.log(`Loaded ${assets.length} real pharmaceutical assets`);
  console.log(`Loaded ${projects.length} projects`);
  console.log(`Loaded ${tasks.length} tasks`);
});
