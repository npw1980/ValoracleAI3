import { useState } from 'react';
import {
  FileText,
  FlaskConical,
  Download,
  Upload,
  Grid,
  List,
  Plus,
  Star,
  Clock,
  MoreHorizontal,
  File,
  Presentation,
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/Tabs';

const models = [
  { id: '1', name: 'Cost-Effectiveness Model v2', type: 'HEOR', asset: 'ABC-123', updated: '2 days ago', starred: true },
  { id: '2', name: 'Budget Impact Model', type: 'HEOR', asset: 'DEF-456', updated: '1 week ago', starred: false },
  { id: '3', name: 'Patient Simulation Model', type: 'HEOR', asset: 'ABC-123', updated: '2 weeks ago', starred: true },
];

const reports = [
  { id: '1', name: 'Q4 2025 Market Report', type: 'Report', asset: null, updated: '3 days ago', starred: true },
  { id: '2', name: 'NSCLC Competitive Analysis', type: 'Report', asset: null, updated: '1 week ago', starred: false },
  { id: '3', name: 'Pricing Strategy 2026', type: 'Report', asset: 'ABC-123', updated: '2 weeks ago', starred: false },
];

const folders = [
  { id: '1', name: 'HEOR Models', count: 15, icon: FlaskConical },
  { id: '2', name: 'Reports', count: 42, icon: FileText },
  { id: '3', name: 'Templates', count: 18, icon: File },
  { id: '4', name: 'Presentations', count: 23, icon: Presentation },
];

const recentFiles = [
  ...models.map(m => ({ ...m, fileType: 'model' })),
  ...reports.map(r => ({ ...r, fileType: 'report' })),
].sort((a, b) => a.updated.localeCompare(b.updated)).slice(0, 6);

export function Library() {
  const [, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'HEOR': return FlaskConical;
      case 'Report': return FileText;
      default: return File;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'HEOR': return 'bg-purple-100 text-purple-600';
      case 'Report': return 'bg-blue-100 text-blue-600';
      case 'Workflow': return 'bg-green-100 text-green-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Library</h1>
          <p className="text-slate-500 mt-1">Models, reports, templates, and reusable resources.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">
            <Upload className="w-4 h-4" />
            Upload
          </Button>
          <Button>
            <Plus className="w-4 h-4" />
            New Folder
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Tabs defaultTab="all" onChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="models">Models</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-slate-200'}`}
          >
            <Grid className="w-4 h-4 text-slate-600" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-slate-200'}`}
          >
            <List className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Folders */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {folders.map((folder) => (
          <Card key={folder.id} variant="elevated" className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <folder.icon className="w-5 h-5 text-amber-600" />
                </div>
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">{folder.name}</h3>
              <p className="text-sm text-slate-500">{folder.count} items</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Files */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Recently Used</h2>
          <Button variant="ghost" size="sm">View all</Button>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentFiles.map((file) => {
              const Icon = getTypeIcon(file.type);
              return (
                <Card key={file.id} variant="elevated" className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(file.type)}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <button className="p-1 rounded hover:bg-slate-100">
                        <MoreHorizontal className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-slate-800 truncate flex-1">{file.name}</h3>
                      {file.starred && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <Badge variant="default">{file.type}</Badge>
                      <span className="text-slate-500">{file.updated}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {recentFiles.map((file) => {
                  const Icon = getTypeIcon(file.type);
                  return (
                    <div key={file.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(file.type)}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-slate-800">{file.name}</p>
                            {file.starred && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                          </div>
                          <p className="text-sm text-slate-500">{file.type} • {file.asset || 'Global'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-500">{file.updated}</span>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Models Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">HEOR Models</h2>
          <Button variant="ghost" size="sm">View all</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {models.map((model) => (
            <Card key={model.id} variant="bordered" className="hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <FlaskConical className="w-5 h-5 text-purple-600" />
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
                <h3 className="font-semibold text-slate-800 mb-1">{model.name}</h3>
                <p className="text-sm text-slate-500 mb-3">Asset: {model.asset}</p>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock className="w-3 h-3" />
                  Updated {model.updated}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
