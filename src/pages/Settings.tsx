import { useState } from 'react';
import {
  User,
  Bell,
  Sparkles,
  Palette,
  Shield,
  Keyboard,
  HelpCircle,
  Check,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAppStore } from '../stores/appStore';

const settingsSections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'ai', label: 'AI Preferences', icon: Sparkles },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'shortcuts', label: 'Keyboard Shortcuts', icon: Keyboard },
  { id: 'help', label: 'Help & Support', icon: HelpCircle },
];

export function Settings() {
  const { settings, updateSettings } = useAppStore();
  const [activeSection, setActiveSection] = useState('ai');

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your preferences and account settings.</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-56 shrink-0">
          <Card>
            <CardContent className="p-2">
              {settingsSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors
                    ${activeSection === section.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-50'
                    }
                  `}
                >
                  <section.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{section.label}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeSection === 'ai' && (
            <Card>
              <CardHeader>
                <CardTitle>AI Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    How much AI assistance would you like?
                  </label>
                  <div className="space-y-3">
                    {[
                      { value: 'minimal', label: 'Minimal AI', description: 'Only explicit requests, no suggestions' },
                      { value: 'standard', label: 'Standard (Recommended)', description: 'AI assists when helpful, always asks' },
                      { value: 'advanced', label: 'Advanced AI', description: 'AI proactively suggests, auto-runs simple tasks' },
                      { value: 'full', label: 'Full AI', description: 'AI can execute without asking (sensitive actions require approval)' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updateSettings({ aiPreference: option.value as any })}
                        className={`
                          w-full flex items-center justify-between p-4 rounded-lg border-2 transition-colors text-left
                          ${settings.aiPreference === option.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-slate-200 hover:border-slate-300'
                          }
                        `}
                      >
                        <div>
                          <p className="font-medium text-slate-800">{option.label}</p>
                          <p className="text-sm text-slate-500">{option.description}</p>
                        </div>
                        {settings.aiPreference === option.value && (
                          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-sm font-medium text-slate-800 mb-3">Quick Actions</h4>
                  <div className="flex gap-3">
                    <Button variant="secondary">Reset AI Preferences</Button>
                    <Button variant="secondary">View AI Documentation</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: 'email', label: 'Email Notifications', description: 'Receive notifications via email' },
                  { key: 'push', label: 'Push Notifications', description: 'Receive browser push notifications' },
                  { key: 'inApp', label: 'In-App Notifications', description: 'Show notifications in the app' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
                    <div>
                      <p className="font-medium text-slate-800">{item.label}</p>
                      <p className="text-sm text-slate-500">{item.description}</p>
                    </div>
                    <button
                      onClick={() => updateSettings({
                        notifications: {
                          ...settings.notifications,
                          [item.key]: !settings.notifications[item.key as keyof typeof settings.notifications],
                        },
                      })}
                      className={`
                        w-12 h-6 rounded-full transition-colors relative
                        ${settings.notifications[item.key as keyof typeof settings.notifications] ? 'bg-blue-600' : 'bg-slate-300'}
                      `}
                    >
                      <span
                        className={`
                          absolute top-1 w-4 h-4 rounded-full bg-white transition-transform
                          ${settings.notifications[item.key as keyof typeof settings.notifications] ? 'left-7' : 'left-1'}
                        `}
                      />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeSection === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xl">
                    NW
                  </div>
                  <Button variant="secondary">Change Avatar</Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                    <input
                      type="text"
                      defaultValue="Nathan"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      defaultValue="White"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200"
                    />
                  </div>
                </div>
                <Button>Save Changes</Button>
              </CardContent>
            </Card>
          )}

          {activeSection === 'appearance' && (
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Theme</label>
                  <div className="flex gap-3">
                    {['light', 'dark', 'system'].map((theme) => (
                      <button
                        key={theme}
                        onClick={() => updateSettings({ theme: theme as any })}
                        className={`
                          flex-1 p-4 rounded-lg border-2 capitalize transition-colors
                          ${settings.theme === theme
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-slate-200 hover:border-slate-300'
                          }
                        `}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'shortcuts' && (
            <Card>
              <CardHeader>
                <CardTitle>Keyboard Shortcuts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { keys: ['⌘', 'K'], action: 'Open command palette' },
                    { keys: ['⌘', 'B'], action: 'Toggle sidebar' },
                    { keys: ['⌘', 'V'], action: 'Open Val AI assistant' },
                    { keys: ['⌘', '/'], action: 'Search' },
                    { keys: ['G', 'D'], action: 'Go to Dashboard' },
                    { keys: ['G', 'A'], action: 'Go to Assets' },
                  ].map((shortcut, i) => (
                    <div key={i} className="flex items-center justify-between py-2">
                      <span className="text-sm text-slate-600">{shortcut.action}</span>
                      <div className="flex gap-1">
                        {shortcut.keys.map((key, j) => (
                          <kbd key={j} className="px-2 py-1 bg-slate-100 rounded text-xs font-mono">
                            {key}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {(activeSection === 'security' || activeSection === 'help') && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-slate-500">This section is coming soon.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
