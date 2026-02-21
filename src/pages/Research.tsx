import { useState } from 'react';
import {
  FileText,
  Plus,
  ExternalLink,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';

// Initial mock data
import { useEffect } from 'react';
import { getResearchDocuments, createResearchDocument, ResearchDocument } from '../services/api';

export function Research() {
  const [recentDocuments, setRecentDocuments] = useState<ResearchDocument[]>([]);

  useEffect(() => {
    getResearchDocuments().then(data => setRecentDocuments(data)).catch(console.error);
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Report',
  });

  // Filter documents based on search query
  const filteredDocuments = recentDocuments.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all cursor-pointer"
                onClick={() => handleDocumentClick(doc.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <FileText className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-white mb-2 line-clamp-2">{doc.title}</h3>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="default" className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-none">{doc.type}</Badge>
                  <span className="text-sm text-slate-500">• {doc.date}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-600 dark:text-blue-400 font-medium">View Analysis</span>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                </div>
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
            <Button onClick={async () => {
              const newDocData = {
                title: formData.name || 'Untitled Document',
                type: formData.type,
                updatedAt: 'Just now',
                starred: false
              };

              try {
                const createdDoc = await createResearchDocument(newDocData as Partial<ResearchDocument>);
                // Map API response to Component State expectations
                const mappedDoc: ResearchDocument = {
                  id: createdDoc.id,
                  title: createdDoc.title,
                  type: createdDoc.type,
                  date: createdDoc.date,
                  size: '1.2 MB',
                  author: 'System',
                  status: 'Draft'
                };

                setRecentDocuments(prev => [mappedDoc, ...prev]);
                setIsModalOpen(false);
                setFormData({ name: '', type: 'Report' });
              } catch (error) {
                console.error('Failed to create document:', error);
              }
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
