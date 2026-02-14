import { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Plus,
  Filter,
  Download,
  ChevronRight,
  Target,
  FlaskConical,
  Calendar,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';

// Empty states - no mock data for testing
const competitors: { id: string; name: string; company: string; revenue: string; trend: string; marketShare: number }[] = [];
const pipelineData: { id: string; drug: string; company: string; phase: string; indication: string; mechanism: string }[] = [];
const pricingInsights: { region: string; avgPrice: string; range: string; payers: number; coverage: string }[] = [];

// A-03: analyses state is now managed in component (see above)

export function Analyze() {
  const [, setActiveTab] = useState('competitors');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // A-03: State for created analyses
  const [analyses, setAnalyses] = useState<{id: string; name: string; type: string; date: string; status: string}[]>([
    { id: '1', name: 'NSCLC Market Size 2025', type: 'Market Sizing', date: 'Feb 10, 2026', status: 'Complete' }
  ]);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Market Sizing',
    indication: '',
    region: 'US',
  });

  // Filter competitors based on search query
  const filteredCompetitors = competitors.filter(comp =>
    comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comp.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Export data to CSV
  const handleExport = () => {
    const dataToExport = filteredCompetitors;

    const headers = ['Drug', 'Company', 'Revenue', 'Trend', 'Market Share'];
    const csvContent = [
      headers.join(','),
      ...dataToExport.map(comp => [
        comp.name,
        comp.company,
        comp.revenue,
        comp.trend,
        `${comp.marketShare}%`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `competitors_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // Handle form submission - A-03: Actually save the analysis
  const handleCreateAnalysis = () => {
    if (!formData.name) return; // Basic validation
    const newAnalysis = {
      id: String(Date.now()),
      name: formData.name,
      type: formData.type,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Draft'
    };
    setAnalyses([newAnalysis, ...analyses]);
    setIsModalOpen(false);
    setFormData({ name: '', type: 'Market Sizing', indication: '', region: 'US' });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Analyze</h1>
          <p className="text-slate-500 mt-1">Market intelligence, competitive analysis, and pricing insights.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleExport}>
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4" />
            New Analysis
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="elevated">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">$52B</p>
                <p className="text-sm text-slate-500">NSCLC Market</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">+8%</p>
                <p className="text-sm text-slate-500">YoY Growth</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">4</p>
                <p className="text-sm text-slate-500">Key Competitors</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Target className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">12</p>
                <p className="text-sm text-slate-500">Assets in Pipeline</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs - A-01: Added margin-bottom for proper spacing from header */}
      <div className="mb-6" style={{ marginTop: '24px' }}>
      <Tabs defaultTab="competitors" onChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="analyses">My Analyses</TabsTrigger>
        </TabsList>

        {/* Competitors Tab */}
        <TabsContent value="competitors">
          <div className="space-y-6">
            {/* Market Share Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Competitive Landscape - NSCLC</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-500">Market Share Visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Competitor Table */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Competitor Details</CardTitle>
                <div className="flex gap-2">
                  <Input
                    placeholder="Search competitors..."
                    className="w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button variant="secondary" size="sm">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Drug</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Company</th>
                      <th className="text-right px-6 py-3 text-sm font-medium text-slate-600">Revenue</th>
                      <th className="text-right px-6 py-3 text-sm font-medium text-slate-600">Trend</th>
                      <th className="text-right px-6 py-3 text-sm font-medium text-slate-600">Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCompetitors.map((comp) => (
                      <tr key={comp.id} className="hover:bg-slate-50 cursor-pointer">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                              <FlaskConical className="w-4 h-4 text-slate-500" />
                            </div>
                            <span className="font-medium text-slate-800">{comp.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{comp.company}</td>
                        <td className="px-6 py-4 text-right font-medium text-slate-800">{comp.revenue}</td>
                        <td className="px-6 py-4 text-right">
                          <span className="inline-flex items-center gap-1 text-green-600">
                            <TrendingUp className="w-4 h-4" />
                            {comp.trend}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${comp.marketShare}%` }} />
                            </div>
                            <span className="text-sm text-slate-600">{comp.marketShare}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pipeline Tab */}
        <TabsContent value="pipeline">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>NSCLC Pipeline</CardTitle>
              <Button variant="secondary" size="sm">
                <Filter className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Drug</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Company</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Phase</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Indication</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Mechanism</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pipelineData.map((drug) => (
                    <tr key={drug.id} className="hover:bg-slate-50 cursor-pointer">
                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-800">{drug.drug}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{drug.company}</td>
                      <td className="px-6 py-4">
                        <Badge variant={
                          drug.phase === 'Phase 3' ? 'success' :
                          drug.phase === 'Phase 2' ? 'info' :
                          drug.phase === 'Phase 1' ? 'warning' : 'default'
                        }>
                          {drug.phase}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{drug.indication}</td>
                      <td className="px-6 py-4 text-slate-600">{drug.mechanism}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pricingInsights.map((region) => (
              <Card key={region.region} variant="elevated">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-800">{region.region}</h3>
                    <Badge variant="info">{region.coverage} covered</Badge>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-2xl font-bold text-slate-800">{region.avgPrice}</p>
                      <p className="text-sm text-slate-500">Average annual price</p>
                    </div>
                    <div className="pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Range</span>
                        <span className="text-slate-700 font-medium">{region.range}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-slate-500">Key payers</span>
                        <span className="text-slate-700 font-medium">{region.payers}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* My Analyses Tab */}
        <TabsContent value="analyses">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {analyses.map((analysis) => (
                  <div key={analysis.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-slate-500" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{analysis.name}</p>
                        <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                          <span>{analysis.type}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {analysis.date}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={analysis.status === 'Complete' ? 'success' : analysis.status === 'In Review' ? 'warning' : 'default'}>
                        {analysis.status}
                      </Badge>
                      <ChevronRight className="w-5 h-5 text-slate-300" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>

      {/* Create Analysis Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Analysis"
        description="Start a new market analysis or competitive research"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateAnalysis}>Create Analysis</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Analysis Name"
            placeholder="e.g., NSCLC Market Size 2026-2030"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Analysis Type</label>
              <select
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="Market Sizing">Market Sizing</option>
                <option value="Pricing">Pricing</option>
                <option value="Competitive">Competitive</option>
                <option value="Access">Access</option>
                <option value="Forecasting">Forecasting</option>
              </select>
            </div>
            <Input
              label="Indication"
              placeholder="e.g., NSCLC"
              value={formData.indication}
              onChange={(e) => setFormData({ ...formData, indication: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Region</label>
            <select
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
            >
              <option value="US">United States</option>
              <option value="EU">Europe</option>
              <option value="Japan">Japan</option>
              <option value="Global">Global</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
