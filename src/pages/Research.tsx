import { useState } from 'react';
import {
  FileText,
  Plus,
  Star,
  ExternalLink,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';

const recentDocuments = [
  { id: '1', name: 'Competitive Analysis - NSCLC Market', type: 'Report', updatedAt: '2 hours ago', starred: true },
  { id: '2', name: 'ABC-123 Evidence Gap Analysis', type: 'Analysis', updatedAt: 'Yesterday', starred: true },
  { id: '3', name: 'Pricing Strategy Q1 2026', type: 'Strategy', updatedAt: '2 days ago', starred: false },
  { id: '4', name: 'KOL Interview Summary - Dr. Smith', type: 'Notes', updatedAt: '3 days ago', starred: false },
  { id: '5', name: 'HEOR Model Results', type: 'Model', updatedAt: '1 week ago', starred: false },
];

const landscapes = [
  { id: '1', name: 'NSCLC Competitive Landscape', assets: 5, status: 'Active', lastUpdated: '1 day ago' },
  { id: '2', name: 'Heart Failure Market Analysis', assets: 3, status: 'Active', lastUpdated: '3 days ago' },
  { id: '3', name: 'Alzheimers Pipeline Review', assets: 4, status: 'Draft', lastUpdated: '1 week ago' },
];

const monitors = [
  { id: '1', name: 'Competitor Pricing - Keytruda', frequency: 'Weekly', status: 'Active', nextUpdate: 'Tomorrow' },
  { id: '2', name: 'Clinical Trial Updates', frequency: 'Daily', status: 'Active', nextUpdate: 'In 2 hours' },
  { id:  '3', name: 'Regulatory Changes', frequency: 'Weekly', status: 'Paused', nextUpdate: 'N/A' },
];

export function Research() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Report',
  });

  // Filter documents based on search query
  const filteredDocuments = recentDocuments.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDocumentClick = (docId: string) => {
    setSelectedDoc(docId);
    // TODO: Open preview modal or navigate to document details
    console.log('Opening document:', docId, selectedDoc);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Research Hub</h1>
          <p className="text-slate-500 mt-1">Access documents, landscapes, and monitoring.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4" />
            New Document
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <Input
          placeholder="Search documents, landscapes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Recent Documents */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Documents</CardTitle>
          <Button variant="ghost" size="sm">
            View all
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => handleDocumentClick(doc.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-800">{doc.name}</p>
                      {doc.starred && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                    </div>
                    <p className="text-sm text-slate-500">{doc.type} • {doc.updatedAt}</p>
                  </div>
                </div>
                <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Landscapes & Monitors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Landscapes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Landscapes</CardTitle>
            <Button variant="ghost" size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {landscapes.map((landscape) => (
                <div
                  key={landscape.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="font-medium text-slate-800">{landscape.name}</p>
                    <p className="text-sm text-slate-500">{landscape.assets} assets • {landscape.lastUpdated}</p>
                  </div>
                  <Badge variant={landscape.status === 'Active' ? 'success' : 'default'}>
                    {landscape.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monitors */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Research Monitors</CardTitle>
            <Button variant="ghost" size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {monitors.map((monitor) => (
                <div
                  key={monitor.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="font-medium text-slate-800">{monitor.name}</p>
                    <p className="text-sm text-slate-500">{monitor.frequency}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={monitor.status === 'Active' ? 'success' : 'warning'}>
                      {monitor.status}
                    </Badge>
                    <p className="text-xs text-slate-400 mt-1">Next: {monitor.nextUpdate}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Document Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Document"
        description="Add a new document to your research hub"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              setIsModalOpen(false);
              setFormData({ name: '', type: 'Report' });
            }}>Create Document</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Document Name"
            placeholder="e.g., Competitive Analysis - NSCLC Market"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Document Type</label>
            <select
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="Report">Report</option>
              <option value="Analysis">Analysis</option>
              <option value="Strategy">Strategy</option>
              <option value="Notes">Notes</option>
              <option value="Model">Model</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
