/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  BarChart3,
  Users,
  FileText,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
  TrendingUp,
  Target,
  FlaskConical,
  Plus,
  Edit2,
  Save,
  X,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { Textarea } from '../components/ui/Input';

// Empty state - no mock data for testing
const assetData = {
  id: '',
  code: '',
  name: '',
  indication: '',
  phase: '',
  status: '',
  therapeuticArea: '',
  sponsor: '',
  description: '',
  team: [] as { id: string; name: string; role: string }[],
  milestones: [] as { id: string; name: string; date: string; status: string }[],
  evidence: [] as { id: string; type: string; status: string; name: string }[],
  tasks: [] as { id: string; title: string; priority: string; status: string; dueDate: string }[],
};

const heorModels: { id: string; name: string; status: string; lastUpdated: string }[] = [];
const pricingData: { region: string; price: string; status: string; indication: string }[] = [];

export function AssetDetail() {
  useParams(); // Get ID from URL for future API calls
  const [, setActiveTab] = useState('overview');

  // AS-03: State for Value Story editing
  const [isValueStoryEditing, setIsValueStoryEditing] = useState(false);
  const [valueStory, setValueStory] = useState({
    unmetNeed: 'ABC-123 addresses a significant unmet need in second-line NSCLC treatment.',
    competitiveAdvantage: 'Superior efficacy compared to current standard of care in Phase 2 trials.',
    valueProposition: 'Cost-effective solution with improved patient outcomes.',
  });

  // AS-02: Milestone modal state
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<any>(null);

  // AS-02: Milestone click handlers - now opens modal
  const handleMilestoneClick = (milestoneId: string) => {
    if (milestoneId === 'new') {
      setSelectedMilestone({ id: 'new', name: '', date: '', status: 'upcoming' });
    } else {
      const milestone = assetData.milestones.find(m => m.id === milestoneId);
      setSelectedMilestone(milestone || null);
    }
    setIsMilestoneModalOpen(true);
  };

  const handleSaveMilestone = () => {
    // In real app, this would call an API
    console.log('Saving milestone:', selectedMilestone);
    setIsMilestoneModalOpen(false);
    setSelectedMilestone(null);
  };

  const getPhaseColor = (phase: string) => {
    if (phase.includes('Phase 3') || phase === 'Launch') return 'success';
    if (phase.includes('Phase 2')) return 'info';
    if (phase.includes('Phase 1')) return 'warning';
    return 'default';
  };

  const getEvidenceColor = (status: string) => {
    switch (status) {
      case 'complete': return 'success';
      case 'in-progress': return 'info';
      case 'gap': return 'error';
      default: return 'default';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link to="/assets" className="flex items-center gap-1 text-slate-500 hover:text-slate-700">
          <ArrowLeft className="w-4 h-4" />
          Assets
        </Link>
        <ChevronRight className="w-4 h-4 text-slate-400" />
        <span className="text-slate-800 font-medium">{assetData.code}</span>
      </div>

      {/* Header - AS-01: Added pb-4 for spacing */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <BarChart3 className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-slate-800">{assetData.code}</h1>
              <Badge variant={getPhaseColor(assetData.phase) as any}>{assetData.phase}</Badge>
              <Badge variant={assetData.status === 'Active' ? 'success' : 'warning'}>{assetData.status}</Badge>
            </div>
            <p className="text-lg text-slate-600">{assetData.name}</p>
            <p className="text-sm text-slate-500 mt-1">{assetData.indication} • {assetData.therapeuticArea}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">
            <Users className="w-4 h-4" />
            Team
          </Button>
          <Button>
            <FileText className="w-4 h-4" />
            Documents
          </Button>
        </div>
      </div>

      {/* Tabs - AS-04: Added Team and Documents tabs */}
      <Tabs defaultTab="overview" onChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="strategy">Strategy</TabsTrigger>
          <TabsTrigger value="heor">HEOR</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Description */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{assetData.description}</p>
                </CardContent>
              </Card>

              {/* Milestones - AS-02: Made clickable */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Milestones</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => handleMilestoneClick('new')}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {assetData.milestones.map((milestone) => (
                      <div
                        key={milestone.id}
                        className="flex items-center gap-4 p-3 -mx-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                        onClick={() => handleMilestoneClick(milestone.id)}
                      >
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center shrink-0
                          ${milestone.status === 'completed' ? 'bg-green-100' :
                            milestone.status === 'in-progress' ? 'bg-blue-100' : 'bg-slate-100'}
                        `}>
                          {milestone.status === 'completed' ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : milestone.status === 'in-progress' ? (
                            <Clock className="w-4 h-4 text-blue-600" />
                          ) : (
                            <div className="w-2 h-2 bg-slate-400 rounded-full" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-800">{milestone.name}</p>
                          <p className="text-sm text-slate-500">{milestone.date}</p>
                        </div>
                        <Badge variant={milestone.status === 'completed' ? 'success' :
                          milestone.status === 'in-progress' ? 'info' : 'default'}>
                          {milestone.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Evidence */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Evidence Status</CardTitle>
                  <Button variant="ghost" size="sm">View All</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {assetData.evidence.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                        <div className="flex items-center gap-3">
                          {item.status === 'gap' ? (
                            <AlertCircle className="w-5 h-5 text-red-500" />
                          ) : item.status === 'complete' ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                            <Clock className="w-5 h-5 text-blue-500" />
                          )}
                          <div>
                            <p className="font-medium text-slate-800">{item.name}</p>
                            <p className="text-sm text-slate-500">{item.type}</p>
                          </div>
                        </div>
                        <Badge variant={getEvidenceColor(item.status) as any}>
                          {item.status === 'gap' ? 'Gap' : item.status === 'complete' ? 'Complete' : 'In Progress'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Team */}
              <Card>
                <CardHeader>
                  <CardTitle>Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {assetData.team.map((member) => (
                      <div key={member.id} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-sm font-medium">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{member.name}</p>
                          <p className="text-xs text-slate-500">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tasks */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Tasks</CardTitle>
                  <Link to="/workspace" className="text-sm text-blue-600 hover:text-blue-700">View all</Link>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {assetData.tasks.map((task) => (
                      <div key={task.id} className="p-3 rounded-lg border border-slate-200">
                        <p className="text-sm font-medium text-slate-800">{task.title}</p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant={task.priority === 'High' ? 'error' : 'warning'}>{task.priority}</Badge>
                          <span className="text-xs text-slate-500">{task.dueDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Strategy Tab - AS-03: Value Story is now editable */}
        <TabsContent value="strategy">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Value Story</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsValueStoryEditing(!isValueStoryEditing)}
                >
                  {isValueStoryEditing ? (
                    <>
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent>
                {isValueStoryEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-1 block">Unmet Need</label>
                      <Textarea
                        value={valueStory.unmetNeed}
                        onChange={(e) => setValueStory({ ...valueStory, unmetNeed: e.target.value })}
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-1 block">Competitive Advantage</label>
                      <Textarea
                        value={valueStory.competitiveAdvantage}
                        onChange={(e) => setValueStory({ ...valueStory, competitiveAdvantage: e.target.value })}
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-1 block">Value Proposition</label>
                      <Textarea
                        value={valueStory.valueProposition}
                        onChange={(e) => setValueStory({ ...valueStory, valueProposition: e.target.value })}
                        rows={2}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => setIsValueStoryEditing(false)}>
                        <Save className="w-4 h-4 mr-1" />
                        Save Changes
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => setIsValueStoryEditing(false)}>
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-slate-800">Unmet Need</p>
                        <p className="text-sm text-slate-500">{valueStory.unmetNeed}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-slate-800">Competitive Advantage</p>
                        <p className="text-sm text-slate-500">{valueStory.competitiveAdvantage}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <DollarSign className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-slate-800">Value Proposition</p>
                        <p className="text-sm text-slate-500">{valueStory.valueProposition}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Launch Readiness</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Evidence Package', 'Pricing Strategy', 'KOL Engagement', 'Payer Strategy'].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">{item}</span>
                      <Badge variant={i < 2 ? 'success' : i === 2 ? 'warning' : 'default'}>
                        {i < 2 ? 'Ready' : i === 2 ? 'In Progress' : 'Not Started'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* HEOR Tab */}
        <TabsContent value="heor">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">HEOR Models</h2>
              <Button>
                <Plus className="w-4 h-4" />
                New Model
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {heorModels.map((model) => (
                <Card key={model.id} variant="elevated" className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <FlaskConical className="w-5 h-5 text-purple-600" />
                      </div>
                      <Badge variant={model.status === 'In Progress' ? 'info' : 'default'}>
                        {model.status}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-1">{model.name}</h3>
                    <p className="text-sm text-slate-500">Updated {model.lastUpdated}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">Regional Pricing</h2>
              <Button>
                <Plus className="w-4 h-4" />
                Add Region
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pricingData.map((pricing) => (
                <Card key={pricing.region} variant="elevated">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-slate-800">{pricing.region}</h3>
                      <Badge variant={pricing.status === 'Proposed' ? 'info' : 'default'}>
                        {pricing.status}
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{pricing.price}</p>
                    <p className="text-sm text-slate-500 mt-1">{pricing.indication}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Contracts Tab */}
        <TabsContent value="contracts">
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-800 mb-2">Contracts</h3>
              <p className="text-slate-500 mb-4">No contracts associated with this asset yet.</p>
              <Button>Create Contract</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AS-04: Team Tab - Coming Soon */}
        <TabsContent value="team">
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-800 mb-2">Team Management</h3>
              <p className="text-slate-500 mb-4">Team management for this asset is coming soon.</p>
              <Badge variant="info">Coming Soon</Badge>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AS-04: Documents Tab - Coming Soon */}
        <TabsContent value="documents">
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-800 mb-2">Document Library</h3>
              <p className="text-slate-500 mb-4">Document management for this asset is coming soon.</p>
              <Badge variant="info">Coming Soon</Badge>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AS-02: Milestone Modal */}
      {isMilestoneModalOpen && selectedMilestone && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                {selectedMilestone.id === 'new' ? 'Add Milestone' : 'Edit Milestone'}
              </h3>
              <button onClick={() => setIsMilestoneModalOpen(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Milestone Name</label>
                <input
                  type="text"
                  value={selectedMilestone.name}
                  onChange={(e) => setSelectedMilestone({ ...selectedMilestone, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  placeholder="e.g., Phase 2 Completion"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target Date</label>
                <input
                  type="date"
                  value={selectedMilestone.date}
                  onChange={(e) => setSelectedMilestone({ ...selectedMilestone, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                <select
                  value={selectedMilestone.status}
                  onChange={(e) => setSelectedMilestone({ ...selectedMilestone, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button variant="secondary" onClick={() => setIsMilestoneModalOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSaveMilestone} className="flex-1">
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
