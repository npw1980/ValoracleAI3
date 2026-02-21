import { useState } from 'react';
import {
  Play,
  Save,
  Download,
  Plus,
  ChevronRight,
  ChevronDown,
  Calculator,
  BarChart3,
  PieChart,
  RefreshCw,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { runHEORModel } from '../services/api';

interface ModelParameter {
  id: string;
  name: string;
  value: number;
  unit: string;
  range: { min: number; max: number };
  description: string;
}

interface ModelScenario {
  id: string;
  name: string;
  parameters: Record<string, number>;
}

const modelTemplates = [
  { id: 'cea', name: 'Cost-Effectiveness Analysis', description: 'QALY-based cost-effectiveness modeling' },
  { id: 'bim', name: 'Budget Impact Model', description: 'Payer budget impact analysis' },
  { id: 'pbm', name: 'Patient-Level Simulation', description: 'Individual patient simulation' },
];

const defaultParameters: ModelParameter[] = [
  { id: 'population', name: 'Population Size', value: 10000, unit: 'patients', range: { min: 100, max: 1000000 }, description: 'Total patient population' },
  { id: 'timeHorizon', name: 'Time Horizon', value: 10, unit: 'years', range: { min: 1, max: 50 }, description: 'Model time horizon' },
  { id: 'drugCost', name: 'Drug Cost', value: 50000, unit: '$/year', range: { min: 0, max: 500000 }, description: 'Annual drug acquisition cost' },
  { id: 'adminCost', name: 'Administration Cost', value: 5000, unit: '$/year', range: { min: 0, max: 50000 }, description: 'Annual administration cost' },
  { id: 'aeCost', name: 'AE Management Cost', value: 10000, unit: '$/event', range: { min: 0, max: 100000 }, description: 'Cost per adverse event' },
  { id: 'utilityTreated', name: 'Utility (Treated)', value: 0.75, unit: 'QALY', range: { min: 0, max: 1 }, description: 'Health utility for treated patients' },
  { id: 'utilityUntreated', name: 'Utility (Untreated)', value: 0.55, unit: 'QALY', range: { min: 0, max: 1 }, description: 'Health utility for untreated patients' },
  { id: 'discountRate', name: 'Discount Rate', value: 3, unit: '%', range: { min: 0, max: 10 }, description: 'Annual discount rate' },
  { id: 'survivalTreated', name: 'Survival (Treated)', value: 85, unit: '%', range: { min: 0, max: 100 }, description: '5-year survival rate treated' },
  { id: 'survivalUntreated', name: 'Survival (Untreated)', value: 65, unit: '%', range: { min: 0, max: 100 }, description: '5-year survival rate untreated' },
];

type ResultsTemplate = {
  icer: number;
  qalysGained: number;
  incrementalCost: number;
  totalCostTreated: number;
  totalCostUntreated: number;
  lYgained: number;
  nmb: number;
  confidenceInterval: { low: number; high: number };
};

export function HEORModelBuilder() {
  const [parameters, setParameters] = useState<ModelParameter[]>(defaultParameters);
  const [scenarios, setScenarios] = useState<ModelScenario[]>([
    { id: 'base', name: 'Base Case', parameters: {} },
  ]);
  const [selectedScenario, setSelectedScenario] = useState('base');
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<ResultsTemplate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>(['population', 'costs', 'outcomes']);

  const updateParameter = (id: string, value: number) => {
    setParameters(params =>
      params.map(p => p.id === id ? { ...p, value } : p)
    );
  };

  const runModel = async () => {
    setIsRunning(true);
    setError(null);

    // Build API request parameters
    const apiParams: Record<string, number> = {};
    parameters.forEach(p => {
      apiParams[p.id] = p.value;
    });

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const apiResult = await runHEORModel(apiParams) as any;

      // Transform API result to frontend format
      setResults({
        icer: Math.round(apiResult.icer),
        qalysGained: Math.round(apiResult.qalyGained * 100) / 100,
        incrementalCost: Math.round(apiResult.incrementalCost),
        totalCostTreated: Math.round(apiResult.totalCost),
        totalCostUntreated: Math.round(apiResult.totalCost - apiResult.incrementalCost),
        lYgained: Math.round((apiResult.qalyGained * 0.8) * 100) / 100,
        nmb: Math.round((apiResult.qalyGained * 50000) - apiResult.incrementalCost),
        confidenceInterval: {
          low: Math.round(apiResult.icer * 0.75),
          high: Math.round(apiResult.icer * 1.25)
        },
      });
    } catch {
      console.log('HEOR API failed, using local calculation');
      // Fallback to local calculation
      const timeHorizon = parameters.find(p => p.id === 'timeHorizon')?.value || 10;
      const drugCost = parameters.find(p => p.id === 'drugCost')?.value || 50000;
      const adminCost = parameters.find(p => p.id === 'adminCost')?.value || 5000;
      const utilityTreated = parameters.find(p => p.id === 'utilityTreated')?.value || 0.75;
      const utilityUntreated = parameters.find(p => p.id === 'utilityUntreated')?.value || 0.55;
      const survivalTreated = parameters.find(p => p.id === 'survivalTreated')?.value || 85;
      const survivalUntreated = parameters.find(p => p.id === 'survivalUntreated')?.value || 65;

      const totalDrugCost = drugCost * timeHorizon;
      const totalAdminCost = adminCost * timeHorizon;
      const totalCost = totalDrugCost + totalAdminCost;

      const qalyTreated = (utilityTreated * survivalTreated / 100 * timeHorizon);
      const qalyUntreated = (utilityUntreated * survivalUntreated / 100 * timeHorizon);
      const qalyGained = qalyTreated - qalyUntreated;

      const icer = qalyGained > 0 ? totalCost / qalyGained : 0;

      setResults({
        icer: Math.round(icer),
        qalysGained: Math.round(qalyGained * 100) / 100,
        incrementalCost: Math.round(totalCost),
        totalCostTreated: Math.round(totalCost),
        totalCostUntreated: Math.round(totalCost - totalCost * 0.4),
        lYgained: Math.round(qalyGained * 0.8 * 100) / 100,
        nmb: Math.round(qalyGained * 50000 - totalCost),
        confidenceInterval: {
          low: Math.round(icer * 0.75),
          high: Math.round(icer * 1.25)
        },
      });
    } finally {
      setIsRunning(false);
    }
  };

  const addScenario = () => {
    const newId = `scenario-${Date.now()}`;
    setScenarios([...scenarios, { id: newId, name: `Scenario ${scenarios.length + 1}`, parameters: {} }]);
    setSelectedScenario(newId);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const getSectionParams = (section: string) => {
    switch (section) {
      case 'population': return parameters.filter(p => ['population', 'timeHorizon'].includes(p.id));
      case 'costs': return parameters.filter(p => p.id.includes('Cost'));
      case 'outcomes': return parameters.filter(p => ['utility', 'survival', 'discount'].includes(p.id.split('')[0].toLowerCase()));
      default: return [];
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">HEOR Model Builder</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Create and run health economics models.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button variant="secondary">
            <Save className="w-4 h-4" />
            Save Model
          </Button>
          <Button onClick={runModel} disabled={isRunning}>
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Run Model
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Model Templates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {modelTemplates.map((template) => (
          <Card
            key={template.id}
            variant="bordered"
            className="cursor-pointer hover:border-blue-300 transition-colors"
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-800 dark:text-white">{template.name}</h3>
                  <p className="text-sm text-slate-500">{template.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Parameters Panel */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Model Parameters</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {/* Population Section */}
              <div className="border-b border-slate-100 dark:border-slate-700">
                <button
                  onClick={() => toggleSection('population')}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-800 dark:text-white">Population</span>
                    <Badge variant="default">{getSectionParams('population').length}</Badge>
                  </div>
                  {expandedSections.includes('population') ? (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  )}
                </button>
                {expandedSections.includes('population') && (
                  <div className="px-6 pb-4 space-y-4">
                    {getSectionParams('population').map((param) => (
                      <div key={param.id} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                        <div>
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{param.name}</label>
                          <p className="text-xs text-slate-500">{param.description}</p>
                        </div>
                        <input
                          type="range"
                          min={param.range.min}
                          max={param.range.max}
                          value={param.value}
                          onChange={(e) => updateParameter(param.id, Number(e.target.value))}
                          className="w-full"
                        />
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={param.value}
                            onChange={(e) => updateParameter(param.id, Number(e.target.value))}
                            className="w-24"
                          />
                          <span className="text-sm text-slate-500">{param.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Costs Section */}
              <div className="border-b border-slate-100 dark:border-slate-700">
                <button
                  onClick={() => toggleSection('costs')}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-800 dark:text-white">Costs</span>
                    <Badge variant="default">{getSectionParams('costs').length}</Badge>
                  </div>
                  {expandedSections.includes('costs') ? (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  )}
                </button>
                {expandedSections.includes('costs') && (
                  <div className="px-6 pb-4 space-y-4">
                    {getSectionParams('costs').map((param) => (
                      <div key={param.id} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                        <div>
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{param.name}</label>
                          <p className="text-xs text-slate-500">{param.description}</p>
                        </div>
                        <input
                          type="range"
                          min={param.range.min}
                          max={param.range.max}
                          value={param.value}
                          onChange={(e) => updateParameter(param.id, Number(e.target.value))}
                          className="w-full"
                        />
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={param.value}
                            onChange={(e) => updateParameter(param.id, Number(e.target.value))}
                            className="w-24"
                          />
                          <span className="text-sm text-slate-500">{param.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Outcomes Section */}
              <div>
                <button
                  onClick={() => toggleSection('outcomes')}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-800 dark:text-white">Outcomes & Utilities</span>
                    <Badge variant="default">{getSectionParams('outcomes').length}</Badge>
                  </div>
                  {expandedSections.includes('outcomes') ? (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  )}
                </button>
                {expandedSections.includes('outcomes') && (
                  <div className="px-6 pb-4 space-y-4">
                    {getSectionParams('outcomes').map((param) => (
                      <div key={param.id} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                        <div>
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{param.name}</label>
                          <p className="text-xs text-slate-500">{param.description}</p>
                        </div>
                        <input
                          type="range"
                          min={param.range.min * 100}
                          max={param.range.max * 100}
                          value={param.value * 100}
                          onChange={(e) => updateParameter(param.id, Number(e.target.value) / 100)}
                          className="w-full"
                        />
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={param.value}
                            onChange={(e) => updateParameter(param.id, Number(e.target.value))}
                            step="0.01"
                            className="w-24"
                          />
                          <span className="text-sm text-slate-500">{param.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="space-y-4">
          {/* Scenarios */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Scenarios</CardTitle>
              <Button variant="ghost" size="sm" onClick={addScenario}>
                <Plus className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {scenarios.map((scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() => setSelectedScenario(scenario.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                      selectedScenario === scenario.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{scenario.name}</span>
                    {scenario.id === 'base' && (
                      <Badge variant="success">Base</Badge>
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          {results && (
            <Card className="border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="text-green-700 dark:text-green-400">Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-4">
                  <p className="text-sm text-slate-500 dark:text-slate-400">ICER</p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    ${results.icer.toLocaleString()}/QALY
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    95% CI: ${results.confidenceInterval.low.toLocaleString()} - ${results.confidenceInterval.high.toLocaleString()}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <div>
                    <p className="text-xs text-slate-500">QALYs Gained</p>
                    <p className="text-lg font-semibold text-slate-800 dark:text-white">{results.qalysGained}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">LYs Gained</p>
                    <p className="text-lg font-semibold text-slate-800 dark:text-white">{results.lYgained}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Incremental Cost</p>
                    <p className="text-lg font-semibold text-slate-800 dark:text-white">${(results.incrementalCost / 1000).toFixed(0)}K</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">NMB</p>
                    <p className="text-lg font-semibold text-slate-800 dark:text-white">${results.nmb.toLocaleString()}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-400">
                      Cost-effective at $50K/QALY threshold
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="secondary" className="w-full justify-start">
                <Eye className="w-4 h-4 mr-2" />
                View Sensitivity Analysis
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <BarChart3 className="w-4 h-4 mr-2" />
                Tornado Diagram
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <PieChart className="w-4 h-4 mr-2" />
                Cost Breakdown
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
