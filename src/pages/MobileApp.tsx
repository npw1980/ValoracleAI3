import { useState } from 'react';
import {
  Smartphone,
  Bell,
  Search,
  Home,
  Folder,
  MessageSquare,
  BarChart3,
  Settings,
  Download,
  Star,
  Check,
  Wifi,
  Zap,
  Shield,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const appFeatures = [
  { icon: BarChart3, title: 'Dashboard', description: 'View portfolio metrics', available: true },
  { icon: Folder, title: 'Assets', description: 'Manage drug portfolio', available: true },
  { icon: MessageSquare, title: 'Research', description: 'Access forums', available: true },
  { icon: Bell, title: 'Notifications', description: 'Real-time alerts', available: true },
  { icon: Search, title: 'Search', description: 'Global search', available: true },
  { icon: Settings, title: 'Settings', description: 'App preferences', available: true },
];

const notifications = [
  { id: '1', title: 'Workflow Updated', message: 'ABC-123 progressed to Step 5', time: '2 min ago', read: false },
  { id: '2', title: 'Contract Signed', message: 'BCBS contract executed', time: '1 hour ago', read: false },
  { id: '3', title: 'Task Due', message: 'Evidence review due today', time: '3 hours ago', read: true },
];

const reviews = [
  { id: '1', user: 'Sarah M.', rating: 5, comment: 'Essential for launch management', date: 'Feb 10, 2026' },
  { id: '2', user: 'John D.', rating: 5, comment: 'Best HEOR tool I\'ve used', date: 'Feb 8, 2026' },
  { id: '3', user: 'Mike R.', rating: 4, comment: 'Great mobile experience', date: 'Feb 5, 2026' },
];

export function MobileApp() {
  const [downloadProgress, setDownloadProgress] = useState(0);

  const simulateDownload = () => {
    setDownloadProgress(0);
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Mobile Experience</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">ValOracle on the go.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">
            <Settings className="w-4 h-4" />
            PWA Settings
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Phone Mockup */}
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden">
          <CardContent className="p-8">
            <div className="flex justify-center">
              <div className="relative">
                {/* Phone Frame */}
                <div className="w-64 h-[500px] rounded-[3rem] bg-slate-900 border-4 border-slate-700 shadow-2xl overflow-hidden">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-800 rounded-b-2xl z-10" />

                  {/* Screen Content */}
                  <div className="h-full bg-slate-100 dark:bg-slate-900 pt-10 pb-4 px-4 overflow-hidden">
                    {/* App Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">VO</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                          <span className="text-blue-600 text-xs font-bold">NW</span>
                        </div>
                      </div>
                    </div>

                    {/* Dashboard Preview */}
                    <div className="space-y-3">
                      <div className="bg-white dark:bg-slate-800 rounded-xl p-3 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Active Assets</p>
                            <p className="text-lg font-bold text-slate-800 dark:text-white">12</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 shadow-sm">
                          <p className="text-xs text-slate-500">Tasks Due</p>
                          <p className="text-lg font-bold text-slate-800 dark:text-white">8</p>
                        </div>
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 shadow-sm">
                          <p className="text-xs text-slate-500">Workflows</p>
                          <p className="text-lg font-bold text-slate-800 dark:text-white">5</p>
                        </div>
                      </div>

                      {/* Bottom Nav */}
                      <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-4 py-2 flex justify-between">
                        <Home className="w-5 h-5 text-blue-600" />
                        <Folder className="w-5 h-5 text-slate-400" />
                        <MessageSquare className="w-5 h-5 text-slate-400" />
                        <Settings className="w-5 h-5 text-slate-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features & Download */}
        <div className="space-y-6">
          {/* Download Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white">ValOracle Mobile</h2>
                  <p className="text-slate-500">iOS & Android</p>
                </div>
              </div>

              {downloadProgress < 100 ? (
                <div className="space-y-3">
                  <Button className="w-full" onClick={simulateDownload}>
                    <Download className="w-4 h-4" />
                    {downloadProgress > 0 ? `Downloading... ${downloadProgress}%` : 'Download App'}
                  </Button>
                  {downloadProgress > 0 && (
                    <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all"
                        style={{ width: `${downloadProgress}%` }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">Download Complete!</span>
                </div>
              )}

              <p className="text-xs text-slate-500 mt-4 text-center">
                Also available as PWA - Add to Home Screen
              </p>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <Card>
            <CardHeader>
              <CardTitle>App Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {appFeatures.map((feature, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl border ${
                      feature.available
                        ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10'
                        : 'border-slate-200 dark:border-slate-700 opacity-50'
                    }`}
                  >
                    <feature.icon className={`w-5 h-5 mb-2 ${feature.available ? 'text-green-600' : 'text-slate-400'}`} />
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{feature.title}</p>
                    <p className="text-xs text-slate-500">{feature.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Offline & Security */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="elevated">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Wifi className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-white">Offline Mode</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              View cached assets and documents offline. Changes sync when connected.
            </p>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-white">Push Notifications</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Real-time alerts for workflow updates, task assignments, and more.
            </p>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-white">Biometric Lock</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Face ID / Touch ID / Fingerprint authentication for secure access.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Notifications Preview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Notifications</CardTitle>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {notifications.map((notif) => (
              <div key={notif.id} className="flex items-center gap-4 px-6 py-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  notif.read ? 'bg-slate-100 dark:bg-slate-800' : 'bg-blue-100 dark:bg-blue-900/30'
                }`}>
                  <Bell className={`w-5 h-5 ${notif.read ? 'text-slate-400' : 'text-blue-600'}`} />
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${notif.read ? 'text-slate-600 dark:text-slate-400' : 'text-slate-800 dark:text-white'}`}>
                    {notif.title}
                  </p>
                  <p className="text-sm text-slate-500">{notif.message}</p>
                </div>
                <span className="text-xs text-slate-400">{notif.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* App Store & Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* App Store */}
        <Card>
          <CardHeader>
            <CardTitle>Download On</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button variant="secondary" className="flex-1">
                <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                App Store
              </Button>
              <Button variant="secondary" className="flex-1">
                <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                Google Play
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reviews */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>App Reviews</CardTitle>
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span className="font-bold">4.8</span>
              <span className="text-slate-500">(2.4k reviews)</span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-slate-700 max-h-48 overflow-y-auto">
              {reviews.map((review) => (
                <div key={review.id} className="px-6 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                        {review.user.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-medium text-slate-800 dark:text-white">{review.user}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{review.comment}</p>
                  <p className="text-xs text-slate-400">{review.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
