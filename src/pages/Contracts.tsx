import { useState } from 'react';
import {
  FileText,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  DollarSign,
  ChevronRight,
  Download,
  Edit,
  Send,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/Tabs';

// Empty states - no mock data for testing
const contracts: { id: string; name: string; type: string; counterparty: string; asset: string; status: string; value: string; startDate: string; endDate: string; owner: string }[] = [];

const recentActivity: { id: string; action: string; item: string; user: string; time: string }[] = [];

export function Contracts() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<string | null>(null);
  const [contractsList, setContractsList] = useState(contracts);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Payer',
    counterparty: '',
    asset: '',
    value: '',
  });

  const handleCreateContract = () => {
    if (!formData.name || !formData.counterparty) {
      // Basic validation - require name and counterparty
      return;
    }

    const newContract = {
      id: String(contractsList.length + 1),
      name: formData.name,
      type: formData.type,
      counterparty: formData.counterparty,
      asset: formData.asset,
      status: 'Draft',
      value: formData.value || 'TBD',
      startDate: 'TBD',
      endDate: 'TBD',
      owner: 'You',
    };

    setContractsList([newContract, ...contractsList]);
    setIsModalOpen(false);
    setFormData({ name: '', type: 'Payer', counterparty: '', asset: '', value: '' });
  };

  const handleContractClick = (contractId: string) => {
    setSelectedContract(contractId);
    // TODO: Open contract details modal or navigate to contract details
    console.log('Viewing contract:', contractId, selectedContract);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Pending': return 'warning';
      case 'Draft': return 'default';
      case 'Review': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'Pending': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'Review': return <AlertCircle className="w-4 h-4 text-blue-500" />;
      default: return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  const filteredContracts = contractsList.filter(contract => {
    const matchesSearch = contract.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contract.counterparty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' ||
                      contract.status.toLowerCase() === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Contracts</h1>
          <p className="text-slate-500 mt-1">Manage payer contracts and agreements.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4" />
            New Contract
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card variant="elevated">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{contractsList.length}</p>
                <p className="text-sm text-slate-500">Total Contracts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">
                  {contractsList.filter(c => c.status === 'Active').length}
                </p>
                <p className="text-sm text-slate-500">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">
                  {contractsList.filter(c => c.status === 'Pending').length}
                </p>
                <p className="text-sm text-slate-500">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">$8M</p>
                <p className="text-sm text-slate-500">Total Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search contracts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Tabs defaultTab="all" onChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Contracts List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {filteredContracts.map((contract) => (
              <div
                key={contract.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => handleContractClick(contract.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    {getStatusIcon(contract.status)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-800">{contract.name}</p>
                      <Badge variant={getStatusColor(contract.status)}>
                        {contract.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {contract.counterparty}
                      </span>
                      <span className="text-blue-600">{contract.asset}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="font-semibold text-slate-800">{contract.value}</p>
                    <p className="text-sm text-slate-500">Contract Value</p>
                  </div>
                  <div className="text-right hidden md:block">
                    <p className="text-sm text-slate-600">{contract.startDate} - {contract.endDate}</p>
                    <p className="text-sm text-slate-500">Term</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-600">
                      {contract.owner.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 px-6 py-4">
                {activity.action.includes('executed') ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : activity.action.includes('review') ? (
                  <Send className="w-5 h-5 text-blue-500" />
                ) : activity.action.includes('update') ? (
                  <Edit className="w-5 h-5 text-amber-500" />
                ) : (
                  <FileText className="w-5 h-5 text-slate-400" />
                )}
                <p className="flex-1 text-sm text-slate-700">
                  <span className="font-medium">{activity.user}</span>{' '}
                  {activity.action.toLowerCase()} {activity.item}
                </p>
                <p className="text-xs text-slate-400">{activity.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Contract Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Contract"
        description="Add a new payer contract or agreement"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateContract}>Create Contract</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Contract Name"
            placeholder="e.g., Payer Contract - ABC-123"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Contract Type</label>
              <select
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="Payer">Payer</option>
                <option value="PBM">PBM</option>
                <option value="Health System">Health System</option>
                <option value="GPO">GPO</option>
              </select>
            </div>
            <Input
              label="Counterparty"
              placeholder="e.g., BlueCross BlueShield"
              value={formData.counterparty}
              onChange={(e) => setFormData({ ...formData, counterparty: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Related Asset"
              placeholder="e.g., ABC-123"
              value={formData.asset}
              onChange={(e) => setFormData({ ...formData, asset: e.target.value })}
            />
            <Input
              label="Contract Value"
              placeholder="e.g., $2.5M"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
