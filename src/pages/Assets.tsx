/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  MoreHorizontal,
  BarChart3,
  FolderOpen,
  Grid3X3,
  List,
  Eye,
  Edit,
  Trash2,
  Loader2,
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { DataTable, type Column } from '../components/ui/DataTable';
import { getAssets, createAsset, deleteAsset } from '../services/api';


interface Asset {
  id: string;
  code: string;
  name: string;
  phase: string;
  status: string;
  indication: string;
  therapeuticArea?: string;
  teamSize?: number;
  value?: string;
  therapy?: string;
  health?: number;
}

export function Assets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal state for creating new asset
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    phase: 'Preclinical',
    status: 'Active',
    indication: '',
    therapeuticArea: 'Oncology',
    value: '',
  });

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAssets();
      // Transform API data to match frontend format
      const transformed = data.map((asset: any) => ({
        ...asset,
        therapeuticArea: asset.therapy || asset.therapeuticArea,
        value: asset.value ? `$${asset.value}M` : asset.value,
        teamSize: asset.teamSize || Math.floor(Math.random() * 10) + 1,
      }));
      setAssets(transformed);
    } catch {
      // No fallback - clean state for testing
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAsset = async () => {
    setIsSubmitting(true);
    const newAsset = {
      code: formData.code || `NEW-${Math.floor(Math.random() * 1000)}`,
      name: formData.name || 'New Asset',
      phase: formData.phase as 'Discovery' | 'Preclinical' | 'Phase 1' | 'Phase 2' | 'Phase 3' | 'Launch' | 'Marketed',
      status: formData.status as 'Active' | 'On Hold' | 'Completed' | 'Archived',
      indication: formData.indication || 'New Indication',
      therapeuticArea: formData.therapeuticArea,
      value: formData.value ? parseInt(formData.value) : Math.floor(Math.random() * 500) + 50,
    };
    try {
      const created = await createAsset(newAsset);
      setAssets([...assets, created]);
      setIsModalOpen(false);
      setFormData({
        code: '',
        name: '',
        phase: 'Preclinical',
        status: 'Active',
        indication: '',
        therapeuticArea: 'Oncology',
        value: '',
      });
    } catch {
      console.log('Failed to create asset, adding locally');
      setAssets([...assets, { ...newAsset, id: String(Date.now()), value: `$${newAsset.value}M` }]);
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCreateModal = () => {
    setFormData({
      code: `ASSET-${Math.floor(Math.random() * 9000) + 1000}`,
      name: '',
      phase: 'Preclinical',
      status: 'Active',
      indication: '',
      therapeuticArea: 'Oncology',
      value: '',
    });
    setIsModalOpen(true);
  };

  const handleDeleteAsset = async (id: string) => {
    try {
      await deleteAsset(id);
      setAssets(assets.filter(a => a.id !== id));
    } catch {
      console.log('Failed to delete, removing locally');
      setAssets(assets.filter(a => a.id !== id));
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' ||
                       (activeTab === 'active' && asset.status === 'Active') ||
                       (activeTab === 'onhold' && asset.status === 'On Hold');
    return matchesSearch && matchesTab;
  });

  const getPhaseColor = (phase: string) => {
    if (phase.includes('Phase 3') || phase === 'Launch') return 'success';
    if (phase.includes('Phase 2')) return 'info';
    if (phase.includes('Phase 1')) return 'warning';
    return 'default';
  };

  const columns: Column<Asset>[] = [
    {
      key: 'code',
      title: 'Asset',
      sortable: true,
      render: (item) => (
        <Link to={`/assets/${item.id}`} className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-medium text-slate-800 dark:text-white">{item.code}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{item.name}</p>
          </div>
        </Link>
      ),
    },
    {
      key: 'phase',
      title: 'Phase',
      sortable: true,
      width: '120px',
      render: (item) => (
        <Badge variant={getPhaseColor(item.phase) as any}>{item.phase}</Badge>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      width: '100px',
      render: (item) => (
        <Badge variant={item.status === 'Active' ? 'success' : 'warning'}>
          {item.status}
        </Badge>
      ),
    },
    {
      key: 'indication',
      title: 'Indication',
      sortable: true,
    },
    {
      key: 'therapeuticArea',
      title: 'Therapeutic Area',
      sortable: true,
    },
    {
      key: 'teamSize',
      title: 'Team',
      sortable: true,
      width: '80px',
      render: (item) => (
        <span className="text-slate-600 dark:text-slate-400">{item.teamSize}</span>
      ),
    },
    {
      key: 'value',
      title: 'Est. Value',
      sortable: true,
      width: '100px',
      render: (item) => (
        <span className="text-green-600 dark:text-green-400 font-medium">{item.value}</span>
      ),
    },
  ];

  const tableActions = [
    {
      label: 'View',
      icon: Eye,
      onClick: (item: Asset) => console.log('View', item),
    },
    {
      label: 'Edit',
      icon: Edit,
      onClick: (item: Asset) => console.log('Edit', item),
    },
    {
      label: 'Delete',
      icon: Trash2,
      onClick: (item: Asset) => handleDeleteAsset(item.id),
    },
  ];

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Assets</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your drug portfolio and assets.</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4" />
          New Asset
        </Button>
      </div>

      {/* Filters & View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="w-full sm:max-w-xs">
            <Input
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Tabs defaultTab="all" onChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="onhold">On Hold</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'table'
                ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAssets.map((asset) => (
            <Link key={asset.id} to={`/assets/${asset.id}`}>
              <Card variant="elevated" className="hover:shadow-md transition-all hover:border-blue-300 dark:hover:border-blue-600 h-full">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs font-medium text-blue-600 dark:text-blue-400">{asset.code}</p>
                    <h3 className="font-semibold text-slate-800 dark:text-white mt-1 truncate">{asset.name}</h3>
                  </div>

                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 truncate">{asset.indication}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant={getPhaseColor(asset.phase) as any}>{asset.phase}</Badge>
                    <Badge variant={asset.status === 'Active' ? 'success' : 'warning'}>
                      {asset.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                    <span className="text-xs text-slate-500 dark:text-slate-400">{asset.therapeuticArea}</span>
                    <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium">
                      <span>{asset.value}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <DataTable
          data={filteredAssets}
          columns={columns}
          searchable={false}
          pagination
          pageSize={8}
          actions={tableActions}
          emptyMessage="No assets found"
        />
      )}

      {filteredAssets.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-2">No assets found</h3>
          <p className="text-slate-500 dark:text-slate-400">Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Create Asset Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Asset"
        description="Add a new pharmaceutical asset to your portfolio"
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleCreateAsset} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                'Create Asset'
              )}
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Asset Code"
            placeholder="e.g., ABC-123"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            required
          />
          <Input
            label="Asset Name"
            placeholder="e.g., Tirzepatide"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Phase</label>
            <select
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
              value={formData.phase}
              onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
            >
              <option value="Preclinical">Preclinical</option>
              <option value="Phase 1">Phase 1</option>
              <option value="Phase 2">Phase 2</option>
              <option value="Phase 3">Phase 3</option>
              <option value="Launch">Launch</option>
              <option value="Marketed">Marketed</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Status</label>
            <select
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Active">Active</option>
              <option value="On Hold">On Hold</option>
              <option value="Discontinued">Discontinued</option>
            </select>
          </div>
          <Input
            label="Indication"
            placeholder="e.g., Type 2 Diabetes"
            value={formData.indication}
            onChange={(e) => setFormData({ ...formData, indication: e.target.value })}
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Therapeutic Area</label>
            <select
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
              value={formData.therapeuticArea}
              onChange={(e) => setFormData({ ...formData, therapeuticArea: e.target.value })}
            >
              <option value="Oncology">Oncology</option>
              <option value="Metabolic">Metabolic</option>
              <option value="Neurology">Neurology</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Immunology">Immunology</option>
              <option value="Rare Disease">Rare Disease</option>
              <option value="Infectious Disease">Infectious Disease</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <Input
            label="Estimated Value ($M)"
            placeholder="e.g., 250"
            type="number"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
          />
        </div>
      </Modal>
    </div>
  );
}
