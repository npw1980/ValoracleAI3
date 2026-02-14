import { useState } from 'react';
import {
  Users,
  MessageSquare,
  Video,
  Phone,
  Search,
  Filter,
  Plus,
  Send,
  Mic,
  MicOff,
  VideoIcon,
  VideoOff,
  PhoneOff,
  MessageCircle,
  Award,
  DollarSign,
  Clock,
  Star,
  ThumbsUp,
  UserPlus,
  Mail,
  MapPin,
  Briefcase,
  Brain,
  Sparkles,
  BarChart3,
  FileText,
  Building2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

// Types
interface Advisor {
  id: string;
  name: string;
  email: string;
  specialty: string;
  location: string;
  experience: number;
  hourlyRate: number;
  status: 'active' | 'pending' | 'inactive';
  rating: number;
  projectsCompleted: number;
  avatar?: string;
}

interface ForumPost {
  id: string;
  author: Advisor;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  replies: number;
  likes: number;
  views: number;
  pinned: boolean;
}

interface LiveSession {
  id: string;
  title: string;
  topic: string;
  moderator: Advisor;
  participants: number;
  maxParticipants: number;
  status: 'scheduled' | 'live' | 'ended';
  scheduledAt: string;
}

interface InterviewRequest {
  id: string;
  advisor: Advisor;
  topic: string;
  duration: number;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  scheduledAt: string;
  notes?: string;
}

// Mock Data
const advisors: Advisor[] = [
  { id: '1', name: 'Dr. Sarah Chen', email: 'sarah.chen@email.com', specialty: 'Oncologist', location: 'Boston, MA', experience: 15, hourlyRate: 350, status: 'active', rating: 4.9, projectsCompleted: 45 },
  { id: '2', name: 'Dr. Michael Rodriguez', email: 'm.rodriguez@email.com', specialty: 'Cardiologist', location: 'New York, NY', experience: 12, hourlyRate: 300, status: 'active', rating: 4.8, projectsCompleted: 38 },
  { id: '3', name: 'Dr. Emily Watson', email: 'e.watson@email.com', specialty: 'Neurologist', location: 'Chicago, IL', experience: 8, hourlyRate: 275, status: 'active', rating: 4.7, projectsCompleted: 22 },
  { id: '4', name: 'Dr. James Park', email: 'j.park@email.com', specialty: 'Immunologist', location: 'San Francisco, CA', experience: 10, hourlyRate: 325, status: 'pending', rating: 4.6, projectsCompleted: 15 },
  { id: '5', name: 'Dr. Lisa Thompson', email: 'l.thompson@email.com', specialty: 'Rheumatologist', location: 'Seattle, WA', experience: 18, hourlyRate: 400, status: 'active', rating: 5.0, projectsCompleted: 62 },
];

const forumPosts: ForumPost[] = [
  { id: '1', author: advisors[0], title: 'NSCLC Treatment Landscape 2026', content: 'Latest insights on immunotherapy combinations...', category: 'Clinical', createdAt: '2 hours ago', replies: 12, likes: 34, views: 156, pinned: true },
  { id: '2', author: advisors[1], title: 'Payer perspectives on gene therapies', content: 'Discussion on reimbursement challenges...', category: 'Market Access', createdAt: '5 hours ago', replies: 8, likes: 21, views: 89, pinned: false },
  { id: '3', author: advisors[2], title: 'Alzheimers diagnostic criteria updates', content: 'New FDA guidance implications...', category: 'Regulatory', createdAt: '1 day ago', replies: 15, likes: 42, views: 203, pinned: false },
];

const liveSessions: LiveSession[] = [
  { id: '1', title: 'Oncology Advisory Board', topic: 'Emerging biomarkers', moderator: advisors[0], participants: 12, maxParticipants: 20, status: 'live', scheduledAt: 'Now' },
  { id: '2', title: 'Cardiology KOL Round Table', topic: 'Heart failure guidelines', moderator: advisors[1], participants: 0, maxParticipants: 15, status: 'scheduled', scheduledAt: 'Tomorrow 2pm EST' },
  { id: '3', title: 'Rare Disease Forum', topic: 'Orphan drug development', moderator: advisors[4], participants: 8, maxParticipants: 10, status: 'live', scheduledAt: 'Now' },
];

const interviewRequests: InterviewRequest[] = [
  { id: '1', advisor: advisors[0], topic: 'NSCLC treatment patterns', duration: 30, status: 'scheduled', scheduledAt: 'Feb 15, 2026 10:00 AM' },
  { id: '2', advisor: advisors[1], topic: 'Cardiovascular outcomes', duration: 45, status: 'pending', scheduledAt: 'Feb 18, 2026 2:00 PM' },
  { id: '3', advisor: advisors[2], topic: 'Neurology market access', duration: 30, status: 'completed', scheduledAt: 'Feb 10, 2026' },
];

const behavioralInsights = [
  { id: '1', title: 'Loss Aversion in Treatment Decisions', description: 'Patients 23% more likely to avoid treatment when framed as potential loss', category: 'Cognitive Bias', confidence: 92 },
  { id: '2', title: 'Social Proof in Prescribing', description: 'Peer recommendation increases acceptance by 45%', category: 'Social Influence', confidence: 88 },
  { id: '3', title: 'Anchoring in Pricing', description: 'Initial price reference significantly impacts value perception', category: 'Behavioral Economics', confidence: 85 },
];

export function MarketResearch() {
  const [activeTab, setActiveTab] = useState('advisors');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLiveChat, setShowLiveChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);

  const filteredAdvisors = advisors.filter(advisor =>
    advisor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    advisor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'live': return 'danger';
      case 'scheduled': return 'info';
      case 'pending': return 'warning';
      case 'completed': return 'success';
      case 'inactive': return 'default';
      default: return 'default';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Market Research</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">KOL advisor network and research tools.</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <UserPlus className="w-4 h-4" />
            Recruit Advisor
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        <Card variant="elevated" className="cursor-pointer hover:border-blue-300" onClick={() => setActiveTab('advisors')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{advisors.filter(a => a.status === 'active').length}</p>
                <p className="text-sm text-slate-500">Active Advisors</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated" className="cursor-pointer hover:border-blue-300" onClick={() => setActiveTab('forum')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{forumPosts.length}</p>
                <p className="text-sm text-slate-500">Forum Topics</p>
              </div>
              <MessageSquare className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated" className="cursor-pointer hover:border-blue-300" onClick={() => setActiveTab('live')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{liveSessions.filter(s => s.status === 'live').length}</p>
                <p className="text-sm text-slate-500">Live Sessions</p>
              </div>
              <Video className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated" className="cursor-pointer hover:border-blue-300" onClick={() => setActiveTab('phone')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{interviewRequests.filter(i => i.status === 'pending').length}</p>
                <p className="text-sm text-slate-500">Pending Interviews</p>
              </div>
              <Phone className="w-8 h-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated" className="cursor-pointer hover:border-blue-300" onClick={() => setActiveTab('insights')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{behavioralInsights.length}</p>
                <p className="text-sm text-slate-500">AI Insights</p>
              </div>
              <Brain className="w-8 h-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'advisors', label: 'Advisors', icon: Users },
          { id: 'forum', label: 'Forum', icon: MessageSquare },
          { id: 'live', label: 'Live Chat', icon: Video },
          { id: 'phone', label: 'Phone Interviews', icon: Phone },
          { id: 'insights', label: 'Behavioral Insights', icon: Brain },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Advisors Tab */}
      {activeTab === 'advisors' && (
        <div className="space-y-4">
          {/* Search */}
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search advisors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="secondary">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>

          {/* Advisors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAdvisors.map((advisor) => (
              <Card key={advisor.id} variant="elevated" className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                      {advisor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800 dark:text-white">{advisor.name}</h3>
                      <p className="text-sm text-slate-500">{advisor.specialty}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-sm font-medium">{advisor.rating}</span>
                      </div>
                    </div>
                    <Badge variant={getStatusBadge(advisor.status) as any}>{advisor.status}</Badge>
                  </div>

                  <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {advisor.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      {advisor.experience} years experience
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      {advisor.projectsCompleted} projects completed
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                    <div>
                      <p className="text-lg font-bold text-slate-800 dark:text-white">${advisor.hourlyRate}</p>
                      <p className="text-xs text-slate-500">/hour</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm">
                        <Mail className="w-4 h-4" />
                      </Button>
                      <Button size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Forum Tab */}
      {activeTab === 'forum' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {/* New Post Button */}
            <Button className="w-full">
              <Plus className="w-4 h-4" />
              New Discussion
            </Button>

            {/* Forum Posts */}
            {forumPosts.map((post) => (
              <Card key={post.id} variant="bordered" className={post.pinned ? 'border-blue-300' : ''}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                      {post.author.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {post.pinned && <Badge variant="info">Pinned</Badge>}
                        <Badge variant="default">{post.category}</Badge>
                      </div>
                      <h3 className="font-semibold text-slate-800 dark:text-white mb-2">{post.title}</h3>
                      <p className="text-sm text-slate-500 mb-3">{post.content}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span>{post.author.name}</span>
                        <span>•</span>
                        <span>{post.createdAt}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                    <button className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
                      <ThumbsUp className="w-4 h-4" />
                      {post.likes}
                    </button>
                    <button className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
                      <MessageCircle className="w-4 h-4" />
                      {post.replies}
                    </button>
                    <span className="text-sm text-slate-400">{post.views} views</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {['Clinical', 'Market Access', 'Regulatory', 'Pricing', 'HEOR'].map((cat) => (
                  <button key={cat} className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                    <span className="text-sm text-slate-600 dark:text-slate-400">{cat}</span>
                    <Badge variant="default">12</Badge>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Live Chat Tab */}
      {activeTab === 'live' && (
        <div className="space-y-4">
          {/* Live Sessions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveSessions.map((session) => (
              <Card key={session.id} variant={session.status === 'live' ? 'elevated' : 'bordered'} className={session.status === 'live' ? 'border-green-300' : ''}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant={session.status === 'live' ? 'success' : 'default'}>
                      {session.status === 'live' ? '● Live Now' : session.status}
                    </Badge>
                    <span className="text-sm text-slate-500">{session.scheduledAt}</span>
                  </div>
                  <h3 className="font-semibold text-slate-800 dark:text-white mb-1">{session.title}</h3>
                  <p className="text-sm text-slate-500 mb-4">{session.topic}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-500">{session.participants}/{session.maxParticipants}</span>
                    </div>
                    <Button size="sm" onClick={() => setShowLiveChat(true)}>
                      Join
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* AI Moderator */}
          <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">AI Moderator Assistant</h3>
                  <p className="text-sm text-white/80">Real-time topic analysis and summary generation</p>
                </div>
                <Button className="bg-white/20 hover:bg-white/30 border-0">
                  Enable AI
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Phone Interviews Tab */}
      {activeTab === 'phone' && (
        <div className="space-y-4">
          {/* Interview Pipeline */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {['Pending', 'Scheduled', 'In Progress', 'Completed'].map((status) => {
              const requests = interviewRequests.filter(i => i.status.toLowerCase() === status.toLowerCase());
              return (
                <Card key={status}>
                  <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
                    <CardTitle className="text-sm">{status}</CardTitle>
                    <Badge variant="default">{requests.length}</Badge>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    {requests.map((request) => (
                      <div key={request.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                            {request.advisor.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800 dark:text-white">{request.advisor.name}</p>
                            <p className="text-xs text-slate-500">{request.advisor.specialty}</p>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{request.topic}</p>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {request.duration} min
                          </span>
                          <span>{request.scheduledAt}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* AI Phone Integration */}
          <Card className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Phone className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">AI-Powered Phone Interviews</h3>
                  <p className="text-sm text-white/80">Nvidia PersonaPlex + Minimax 2.5 - Real-time transcription and analysis</p>
                </div>
                <Button className="bg-white/20 hover:bg-white/30 border-0">
                  <Phone className="w-4 h-4" />
                  Schedule Call
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Behavioral Insights Tab */}
      {activeTab === 'insights' && (
        <div className="space-y-4">
          {/* AI Analysis Header */}
          <Card className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Brain className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Behavioral Science AI Engine</h3>
                  <p className="text-sm text-white/80">Cognitive bias detection and behavioral intervention recommendations</p>
                </div>
                <Button className="bg-white/20 hover:bg-white/30 border-0">
                  <Sparkles className="w-4 h-4" />
                  Generate Insights
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Insights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {behavioralInsights.map((insight) => (
              <Card key={insight.id} variant="bordered" className="hover:border-indigo-300 transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="info">{insight.category}</Badge>
                    <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                      <BarChart3 className="w-4 h-4" />
                      {insight.confidence}% confidence
                    </div>
                  </div>
                  <h3 className="font-semibold text-slate-800 dark:text-white mb-2">{insight.title}</h3>
                  <p className="text-sm text-slate-500 mb-4">{insight.description}</p>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" className="flex-1">
                      <FileText className="w-4 h-4" />
                      Report
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Sparkles className="w-4 h-4" />
                      Apply to Strategy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Application Areas */}
          <Card>
            <CardHeader>
              <CardTitle>Application Areas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Patient Engagement', icon: Users },
                  { name: 'Payer Negotiations', icon: Building2 },
                  { name: 'HCP Marketing', icon: Briefcase },
                  { name: 'Pricing Strategy', icon: DollarSign },
                ].map((area) => (
                  <button key={area.name} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors text-center">
                    <area.icon className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{area.name}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Live Chat Modal */}
      {showLiveChat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl h-[600px] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white">Oncology Advisory Board</h3>
                <p className="text-sm text-slate-500">Live discussion • 12 participants</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setIsMuted(!isMuted)}>
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsVideoOn(!isVideoOn)}>
                  {isVideoOn ? <VideoIcon className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowLiveChat(false)}>
                  <PhoneOff className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* AI Summary */}
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <span className="font-medium text-indigo-700 dark:text-indigo-300">AI Summary</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">Key themes emerging: biomarker-driven therapy adoption, combination regimen cost concerns, and regional access disparities.</p>
              </div>

              {/* Messages */}
              {[
                { user: 'Dr. Sarah Chen', message: 'We\'re seeing significant uptake in PD-L1 high patients...', time: '2:34 PM' },
                { user: 'Dr. Michael Rodriguez', message: 'What about the budget impact for smaller practices?', time: '2:35 PM' },
                { user: 'Dr. Lisa Thompson', message: 'In my experience, the rebate structures have been key...', time: '2:36 PM' },
              ].map((msg, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {msg.user.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-800 dark:text-white text-sm">{msg.user}</span>
                      <span className="text-xs text-slate-400">{msg.time}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="flex-1"
                />
                <Button>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
