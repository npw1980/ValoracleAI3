/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import {
  Search,
  Download,
  Calendar,
  User,
  FileText,
  Lock,
  Trash2,
  Edit,
  Plus,
  LogIn,
  LogOut,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const auditEvents = [
  { id: '1', action: 'User Login', user: 'nathan@valoracle.ai', ip: '192.168.1.100', resource: 'ValOracle', details: 'Successful login via SSO', timestamp: '2026-02-13 09:45:23', severity: 'info' },
  { id: '2', action: 'Asset Created', user: 'nathan@valoracle.ai', ip: '192.168.1.100', resource: 'ABC-123', details: 'New asset created: Oncology Candidate X', timestamp: '2026-02-13 09:50:12', severity: 'info' },
  { id: '3', action: 'Document Uploaded', user: 'sarah@valoracle.ai', ip: '192.168.1.105', resource: 'Evidence Report', details: 'Uploaded: clinical_data_q4.xlsx', timestamp: '2026-02-13 10:15:45', severity: 'info' },
  { id: '4', action: 'HEOR Model Run', user: 'john@valoracle.ai', ip: '192.168.1.110', resource: 'CEA Model', details: 'Model executed with results: ICER=$45,230', timestamp: '2026-02-13 10:30:18', severity: 'info' },
  { id: '5', action: 'Contract Modified', user: 'sarah@valoracle.ai', ip: '192.168.1.105', resource: 'BCBS Contract', details: 'Updated payment terms', timestamp: '2026-02-13 11:00:33', severity: 'warning' },
  { id: '6', action: 'Permission Change', user: 'admin@valoracle.ai', ip: '192.168.1.1', resource: 'User: john@valoracle.ai', details: 'Added to Project Manager role', timestamp: '2026-02-13 11:30:00', severity: 'warning' },
  { id: '7', action: 'Data Export', user: 'mike@valoracle.ai', ip: '192.168.1.120', resource: 'Patient Data', details: 'Exported 5,000 records', timestamp: '2026-02-13 12:15:22', severity: 'info' },
  { id: '8', action: 'Failed Login', user: 'unknown', ip: '45.33.22.11', resource: 'ValOracle', details: 'Invalid credentials attempt', timestamp: '2026-02-13 12:30:45', severity: 'error' },
  { id: '9', action: 'Settings Changed', user: 'nathan@valoracle.ai', ip: '192.168.1.100', resource: 'Organization', details: 'Updated billing contact', timestamp: '2026-02-13 13:00:10', severity: 'info' },
  { id: '10', action: 'User Logout', user: 'sarah@valoracle.ai', ip: '192.168.1.105', resource: 'ValOracle', details: 'User logged out', timestamp: '2026-02-13 13:30:55', severity: 'info' },
  { id: '11', action: 'Data Deleted', user: 'admin@valoracle.ai', ip: '192.168.1.1', resource: 'Draft Report', details: 'Permanently deleted: draft_analysis_v1.docx', timestamp: '2026-02-13 14:00:00', severity: 'critical' },
  { id: '12', action: 'API Key Generated', user: 'john@valoracle.ai', ip: '192.168.1.110', resource: 'API', details: 'New API key created: vo_sk_****1234', timestamp: '2026-02-13 14:30:20', severity: 'warning' },
];

const eventTypes = [
  { value: 'all', label: 'All Events' },
  { value: 'auth', label: 'Authentication' },
  { value: 'data', label: 'Data Changes' },
  { value: 'settings', label: 'Settings' },
  { value: 'security', label: 'Security' },
];

const getSeverityBadge = (severity: string) => {
  switch (severity) {
    case 'error': return 'danger';
    case 'warning': return 'warning';
    case 'critical': return 'danger';
    default: return 'default';
  }
};

const getActionIcon = (action: string) => {
  if (action.includes('Login')) return <LogIn className="w-4 h-4" />;
  if (action.includes('Logout')) return <LogOut className="w-4 h-4" />;
  if (action.includes('Created')) return <Plus className="w-4 h-4" />;
  if (action.includes('Modified') || action.includes('Changed')) return <Edit className="w-4 h-4" />;
  if (action.includes('Deleted')) return <Trash2 className="w-4 h-4" />;
  if (action.includes('Export')) return <Download className="w-4 h-4" />;
  if (action.includes('Login') === false && action.includes('Failed')) return <Lock className="w-4 h-4" />;
  return <FileText className="w-4 h-4" />;
};

export function AuditLog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [eventFilter, setEventFilter] = useState('all');
  const [dateRange, setDateRange] = useState('7d');

  const filteredEvents = auditEvents.filter(event => {
    const matchesSearch = event.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        event.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        event.details.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const eventCounts = {
    total: auditEvents.length,
    info: auditEvents.filter(e => e.severity === 'info').length,
    warning: auditEvents.filter(e => e.severity === 'warning').length,
    error: auditEvents.filter(e => e.severity === 'error' || e.severity === 'critical').length,
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Audit Log</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Track all system activities and compliance events.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button variant="secondary">
            <Download className="w-4 h-4" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card variant="elevated">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{eventCounts.total}</p>
                <p className="text-sm text-slate-500">Total Events</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">{eventCounts.info}</p>
                <p className="text-sm text-slate-500">Info</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-amber-600">{eventCounts.warning}</p>
                <p className="text-sm text-slate-500">Warnings</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <FileText className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-600">{eventCounts.error}</p>
                <p className="text-sm text-slate-500">Errors</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Lock className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search audit logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {eventTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setEventFilter(type.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  eventFilter === type.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Resource
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Severity
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <Calendar className="w-4 h-4" />
                        {event.timestamp}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          event.severity === 'error' || event.severity === 'critical'
                            ? 'bg-red-100 dark:bg-red-900/30'
                            : event.severity === 'warning'
                            ? 'bg-amber-100 dark:bg-amber-900/30'
                            : 'bg-slate-100 dark:bg-slate-800'
                        }`}>
                          {getActionIcon(event.action)}
                        </div>
                        <span className="font-medium text-slate-800 dark:text-white">{event.action}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <User className="w-3 h-3 text-blue-600" />
                        </div>
                        <span className="text-sm text-slate-600 dark:text-slate-400">{event.user}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-mono">
                      {event.ip}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {event.resource}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate">
                      {event.details}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getSeverityBadge(event.severity) as any}>
                        {event.severity}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Info */}
      <Card className="bg-slate-800 text-white">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center shrink-0">
              <Lock className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Audit Compliance</h3>
              <p className="text-slate-400 text-sm">
                All audit logs are retained for 7 years in compliance with FDA 21 CFR Part 11, EMA, and GDPR requirements.
                Logs are encrypted at rest and cannot be modified or deleted.
              </p>
              <div className="flex gap-4 mt-4 text-sm">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  21 CFR Part 11
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  GDPR
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  HIPAA
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CheckCircle2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
