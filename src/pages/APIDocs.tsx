import { useState } from 'react';
import {
  BookOpen,
  Code,
  Copy,
  Check,
  ChevronRight,
  Search,
  Key,
  Shield,
  Clock,
  Zap,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const apiEndpoints = [
  {
    category: 'Assets',
    endpoints: [
      { method: 'GET', path: '/api/v1/assets', description: 'List all assets', status: 'stable' },
      { method: 'GET', path: '/api/v1/assets/:id', description: 'Get asset details', status: 'stable' },
      { method: 'POST', path: '/api/v1/assets', description: 'Create new asset', status: 'stable' },
      { method: 'PUT', path: '/api/v1/assets/:id', description: 'Update asset', status: 'stable' },
      { method: 'DELETE', path: '/api/v1/assets/:id', description: 'Delete asset', status: 'beta' },
    ],
  },
  {
    category: 'HEOR Models',
    endpoints: [
      { method: 'GET', path: '/api/v1/models', description: 'List HEOR models', status: 'stable' },
      { method: 'POST', path: '/api/v1/models/run', description: 'Execute model', status: 'stable' },
      { method: 'GET', path: '/api/v1/models/:id/results', description: 'Get model results', status: 'stable' },
      { method: 'POST', path: '/api/v1/models/:id/sensitivity', description: 'Run sensitivity analysis', status: 'beta' },
    ],
  },
  {
    category: 'Contracts',
    endpoints: [
      { method: 'GET', path: '/api/v1/contracts', description: 'List contracts', status: 'stable' },
      { method: 'POST', path: '/api/v1/contracts', description: 'Create contract', status: 'stable' },
      { method: 'PUT', path: '/api/v1/contracts/:id/status', description: 'Update contract status', status: 'stable' },
    ],
  },
  {
    category: 'Market Research',
    endpoints: [
      { method: 'GET', path: '/api/v1/advisors', description: 'List KOL advisors', status: 'stable' },
      { method: 'POST', path: '/api/v1/interviews/schedule', description: 'Schedule interview', status: 'stable' },
      { method: 'GET', path: '/api/v1/forum/posts', description: 'Get forum posts', status: 'beta' },
    ],
  },
  {
    category: 'Data',
    endpoints: [
      { method: 'GET', path: '/api/v1/data/sources', description: 'List data sources', status: 'stable' },
      { method: 'POST', path: '/api/v1/data/query', description: 'Execute data query', status: 'stable' },
      { method: 'GET', path: '/api/v1/data/catalog', description: 'Search data catalog', status: 'beta' },
    ],
  },
];

const codeExamples = {
  'List Assets': `curl -X GET "https://api.valoracle.ai/v1/assets" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`,

  'Run HEOR Model': `curl -X POST "https://api.valoracle.ai/v1/models/run" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"model_id": "cea-001", "parameters": {...}}'`,

  'Python SDK': `from valoracle import Client

client = Client(api_key="YOUR_API_KEY")

# List assets
assets = client.assets.list()

# Run model
results = client.models.run(
    model_id="cea-001",
    parameters={"population": 10000}
)`,
};

export function APIDocumentation() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEndpoint, setSelectedEndpoint] = useState<typeof apiEndpoints[0]['endpoints'][0] | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'POST': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'PUT': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'DELETE': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">API Documentation</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Integrate ValOracle into your applications.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">
            <Key className="w-4 h-4" />
            Get API Key
          </Button>
          <Button>
            <BookOpen className="w-4 h-4" />
            View Guides
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card variant="elevated">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Code className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{apiEndpoints.reduce((acc, cat) => acc + cat.endpoints.length, 0)}</p>
                <p className="text-sm text-slate-500">Endpoints</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Zap className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">99.9%</p>
                <p className="text-sm text-slate-500">Uptime SLA</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">OAuth 2.0</p>
                <p className="text-sm text-slate-500">Authentication</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">&lt;100ms</p>
                <p className="text-sm text-slate-500">Avg Response</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search endpoints..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Endpoints */}
        <div className="space-y-4">
          {apiEndpoints.map((category) => (
            <Card key={category.category}>
              <CardHeader>
                <CardTitle>{category.category}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                  {category.endpoints.map((endpoint) => (
                    <button
                      key={endpoint.path}
                      onClick={() => setSelectedEndpoint(endpoint)}
                      className={`w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                        selectedEndpoint?.path === endpoint.path ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded text-xs font-mono font-medium ${getMethodColor(endpoint.method)}`}>
                          {endpoint.method}
                        </span>
                        <span className="text-sm font-mono text-slate-700 dark:text-slate-300">{endpoint.path}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={endpoint.status === 'stable' ? 'success' : 'warning'}>
                          {endpoint.status}
                        </Badge>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Code Examples */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Examples</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(codeExamples).map(([name, code]) => (
                <div key={name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{name}</span>
                    <button
                      onClick={() => copyCode(code, name)}
                      className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      {copiedCode === name ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  </div>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-xs overflow-x-auto">
                    <code>{code}</code>
                  </pre>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* SDKs */}
          <Card>
            <CardHeader>
              <CardTitle>Official SDKs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {['Python', 'JavaScript', 'R', 'Julia'].map((sdk) => (
                  <button
                    key={sdk}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Code className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">{sdk}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
