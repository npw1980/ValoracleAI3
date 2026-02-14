import { useState } from 'react';
import {
  Database,
  Search,
  Plus,
  ExternalLink,
  ChevronRight,
  Users,
  Activity,
  Beaker,
  FileText,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const dataSources = [
  { id: '1', name: 'IQVIA EMR', type: 'EHR', patients: 25000000, coverage: 'US', updates: 'Monthly', reliability: 95, lastUpdated: 'Jan 2026' },
  { id: '2', name: 'Optum Claims', type: 'Claims', patients: 18000000, coverage: 'US', updates: 'Weekly', reliability: 98, lastUpdated: 'Feb 2026' },
  { id: '3', name: 'SEER-Medicare', type: 'Registry', patients: 3500000, coverage: 'US', updates: 'Quarterly', reliability: 92, lastUpdated: 'Dec 2025' },
  { id: '4', name: 'CPRD Aurum', type: 'EHR', patients: 15000000, coverage: 'UK', updates: 'Monthly', reliability: 90, lastUpdated: 'Jan 2026' },
  { id: '5', name: 'SIDIAP', type: 'EHR', patients: 8000000, coverage: 'Spain', updates: 'Monthly', reliability: 88, lastUpdated: 'Jan 2026' },
  { id: '6', name: 'PCORnet', type: 'Network', patients: 20000000, coverage: 'US', updates: 'Real-time', reliability: 94, lastUpdated: 'Feb 2026' },
  { id: '7', name: 'NHANES', type: 'Survey', patients: 100000, coverage: 'US', updates: 'Biennial', reliability: 96, lastUpdated: '2024' },
  { id: '8', name: 'EHDEN Network', type: 'Network', patients: 150000000, coverage: 'EU', updates: 'Monthly', reliability: 89, lastUpdated: 'Feb 2026' },
];

const activeStudies = [
  { id: '1', name: 'NSCLC Treatment Patterns', status: 'In Progress', patients: 4500, dataSource: 'IQVIA EMR', progress: 65 },
  { id: '2', name: 'Cardiovascular Outcomes', status: 'In Progress', patients: 12000, dataSource: 'Optum Claims', progress: 40 },
  { id: '3', name: 'Real-world OS in Melanoma', status: 'Completed', patients: 2800, dataSource: 'SEER-Medicare', progress: 100 },
  { id: '4', name: 'Treatment Sequencing Analysis', status: 'Draft', patients: 0, dataSource: 'Multiple', progress: 10 },
];

const therapeuticAreas = ['All', 'Oncology', 'Cardiology', 'Neurology', 'Immunology', 'Metabolic', 'Infectious Disease'];

export function DataCatalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('All');
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  const filteredSources = dataSources.filter(source => {
    const matchesSearch = source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        source.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesArea = selectedArea === 'All' || true;
    return matchesSearch && matchesArea;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'info';
      default: return 'default';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Real-World Data</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Data catalog and RWE study builder.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">
            <RefreshCw className="w-4 h-4" />
            Sync Catalog
          </Button>
          <Button>
            <Plus className="w-4 h-4" />
            New Study
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card variant="elevated">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{dataSources.length}</p>
                <p className="text-sm text-slate-500">Data Sources</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">180M+</p>
                <p className="text-sm text-slate-500">Total Patients</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{activeStudies.filter(s => s.status === 'In Progress').length}</p>
                <p className="text-sm text-slate-500">Active Studies</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">12</p>
                <p className="text-sm text-slate-500">Countries</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Beaker className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search data sources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {therapeuticAreas.map((area) => (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedArea === area
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      {/* Data Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredSources.map((source) => (
          <Card
            key={source.id}
            variant="bordered"
            className={`cursor-pointer hover:border-blue-300 transition-all ${
              selectedSource === source.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : ''
            }`}
            onClick={() => setSelectedSource(source.id)}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <Badge variant="default">{source.type}</Badge>
              </div>

              <h3 className="font-semibold text-slate-800 dark:text-white mb-1">{source.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{source.coverage} • {source.updates}</p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Patients</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {(source.patients / 1000000).toFixed(1)}M
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Reliability</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${source.reliability}%` }}
                      />
                    </div>
                    <span className="text-slate-700 dark:text-slate-300">{source.reliability}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Last Updated</span>
                  <span className="text-slate-700 dark:text-slate-300">{source.lastUpdated}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                <Button variant="ghost" size="sm" className="flex-1">
                  <Search className="w-4 h-4" />
                  Browse
                </Button>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Studies */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>RWE Studies</CardTitle>
          <Button variant="secondary" size="sm">
            View All
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {activeStudies.map((study) => (
              <div key={study.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-slate-800 dark:text-white">{study.name}</h3>
                      <Badge variant={getStatusBadge(study.status)}>{study.status}</Badge>
                    </div>
                    <p className="text-sm text-slate-500">
                      {study.dataSource} • {study.patients > 0 ? `${study.patients.toLocaleString()} patients` : 'Draft'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {study.progress > 0 && study.progress < 100 && (
                    <div className="w-32">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-500">Progress</span>
                        <span className="font-medium text-slate-700">{study.progress}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${study.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {study.status === 'Completed' && (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  )}
                  <ChevronRight className="w-5 h-5 text-slate-300" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
