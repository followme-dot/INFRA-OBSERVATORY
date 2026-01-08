'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  User,
  Bell,
  Shield,
  Database,
  Webhook,
  Key,
  Mail,
  Slack,
  MessageSquare,
  Moon,
  Sun,
  Monitor,
  Save,
  RefreshCw,
  Plus,
  Trash2,
  Check,
  X,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'profile', name: 'Profile', icon: User },
  { id: 'notifications', name: 'Notifications', icon: Bell },
  { id: 'appearance', name: 'Appearance', icon: Monitor },
  { id: 'integrations', name: 'Integrations', icon: Webhook },
  { id: 'api-keys', name: 'API Keys', icon: Key },
  { id: 'data', name: 'Data Management', icon: Database },
];

const integrations = [
  { id: 'slack', name: 'Slack', icon: Slack, connected: true, description: 'Send alerts to Slack channels' },
  { id: 'email', name: 'Email', icon: Mail, connected: true, description: 'Email notifications for alerts' },
  { id: 'pagerduty', name: 'PagerDuty', icon: Bell, connected: false, description: 'Incident management integration' },
  { id: 'webhook', name: 'Webhooks', icon: Webhook, connected: true, description: 'Custom webhook endpoints' },
];

const apiKeys = [
  { id: '1', name: 'Production API Key', key: 'infra_prod_***************', created: '2024-01-15', lastUsed: '2024-03-20' },
  { id: '2', name: 'Development API Key', key: 'infra_dev_***************', created: '2024-02-01', lastUsed: '2024-03-19' },
  { id: '3', name: 'CI/CD Integration', key: 'infra_ci_***************', created: '2024-02-15', lastUsed: '2024-03-20' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');
  const [notifications, setNotifications] = useState({
    email: true,
    slack: true,
    push: false,
    digest: 'daily',
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="text-text-secondary mt-1">
          Manage your account and application preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <Card padding="sm">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                    activeTab === tab.id
                      ? 'bg-accent-primary/10 text-accent-primary'
                      : 'text-text-secondary hover:bg-glass-bg hover:text-text-primary'
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card padding="lg">
                <h2 className="text-lg font-semibold text-text-primary mb-4">Profile Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center text-2xl font-bold text-white">
                      A
                    </div>
                    <div>
                      <Button variant="secondary" size="sm">Change Avatar</Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-text-muted mb-1">Full Name</label>
                      <Input placeholder="Your name" defaultValue="Admin User" />
                    </div>
                    <div>
                      <label className="block text-sm text-text-muted mb-1">Email</label>
                      <Input placeholder="Email" defaultValue="admin@infra.com" type="email" />
                    </div>
                    <div>
                      <label className="block text-sm text-text-muted mb-1">Role</label>
                      <Input placeholder="Role" defaultValue="Administrator" disabled />
                    </div>
                    <div>
                      <label className="block text-sm text-text-muted mb-1">Team</label>
                      <Input placeholder="Team" defaultValue="Platform Engineering" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="primary">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              </Card>

              <Card padding="lg">
                <h2 className="text-lg font-semibold text-text-primary mb-4">Security</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-glass-border">
                    <div>
                      <p className="font-medium text-text-primary">Password</p>
                      <p className="text-sm text-text-muted">Last changed 30 days ago</p>
                    </div>
                    <Button variant="secondary" size="sm">Change Password</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-glass-border">
                    <div>
                      <p className="font-medium text-text-primary">Two-Factor Authentication</p>
                      <p className="text-sm text-text-muted">Add an extra layer of security</p>
                    </div>
                    <Badge variant="success">Enabled</Badge>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card padding="lg">
                <h2 className="text-lg font-semibold text-text-primary mb-4">Notification Preferences</h2>
                <div className="space-y-4">
                  {[
                    { key: 'email', label: 'Email Notifications', description: 'Receive alerts via email' },
                    { key: 'slack', label: 'Slack Notifications', description: 'Get notified in Slack channels' },
                    { key: 'push', label: 'Push Notifications', description: 'Browser push notifications' },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between p-4 rounded-lg border border-glass-border"
                    >
                      <div>
                        <p className="font-medium text-text-primary">{item.label}</p>
                        <p className="text-sm text-text-muted">{item.description}</p>
                      </div>
                      <button
                        onClick={() =>
                          setNotifications((prev) => ({
                            ...prev,
                            [item.key]: !prev[item.key as keyof typeof prev],
                          }))
                        }
                        className={cn(
                          'w-12 h-6 rounded-full transition-colors relative',
                          notifications[item.key as keyof typeof notifications]
                            ? 'bg-accent-primary'
                            : 'bg-gray-600'
                        )}
                      >
                        <div
                          className={cn(
                            'w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform',
                            notifications[item.key as keyof typeof notifications]
                              ? 'translate-x-6'
                              : 'translate-x-0.5'
                          )}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </Card>

              <Card padding="lg">
                <h2 className="text-lg font-semibold text-text-primary mb-4">Alert Digest</h2>
                <div className="space-y-2">
                  {['realtime', 'hourly', 'daily', 'weekly'].map((option) => (
                    <button
                      key={option}
                      onClick={() => setNotifications((prev) => ({ ...prev, digest: option }))}
                      className={cn(
                        'w-full flex items-center justify-between p-4 rounded-lg border transition-colors',
                        notifications.digest === option
                          ? 'border-accent-primary bg-accent-primary/5'
                          : 'border-glass-border hover:border-accent-primary/50'
                      )}
                    >
                      <span className="text-text-primary capitalize">{option}</span>
                      {notifications.digest === option && (
                        <Check className="h-5 w-5 text-accent-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card padding="lg">
                <h2 className="text-lg font-semibold text-text-primary mb-4">Theme</h2>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: 'dark', label: 'Dark', icon: Moon },
                    { id: 'light', label: 'Light', icon: Sun },
                    { id: 'system', label: 'System', icon: Monitor },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setTheme(option.id as typeof theme)}
                      className={cn(
                        'flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors',
                        theme === option.id
                          ? 'border-accent-primary bg-accent-primary/5'
                          : 'border-glass-border hover:border-accent-primary/50'
                      )}
                    >
                      <option.icon className={cn(
                        'h-8 w-8',
                        theme === option.id ? 'text-accent-primary' : 'text-text-muted'
                      )} />
                      <span className="text-sm text-text-primary">{option.label}</span>
                    </button>
                  ))}
                </div>
              </Card>

              <Card padding="lg">
                <h2 className="text-lg font-semibold text-text-primary mb-4">Display Options</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-glass-border">
                    <div>
                      <p className="font-medium text-text-primary">Compact Mode</p>
                      <p className="text-sm text-text-muted">Reduce spacing and padding</p>
                    </div>
                    <button className="w-12 h-6 rounded-full bg-gray-600 relative">
                      <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 left-0.5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-glass-border">
                    <div>
                      <p className="font-medium text-text-primary">Animations</p>
                      <p className="text-sm text-text-muted">Enable UI animations</p>
                    </div>
                    <button className="w-12 h-6 rounded-full bg-accent-primary relative">
                      <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 right-0.5" />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Integrations Tab */}
          {activeTab === 'integrations' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card padding="lg">
                <h2 className="text-lg font-semibold text-text-primary mb-4">Connected Services</h2>
                <div className="space-y-4">
                  {integrations.map((integration) => (
                    <div
                      key={integration.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-glass-border"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-glass-bg flex items-center justify-center">
                          <integration.icon className="h-5 w-5 text-text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-text-primary">{integration.name}</p>
                          <p className="text-sm text-text-muted">{integration.description}</p>
                        </div>
                      </div>
                      {integration.connected ? (
                        <div className="flex items-center gap-2">
                          <Badge variant="success">Connected</Badge>
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button variant="secondary" size="sm">Connect</Button>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* API Keys Tab */}
          {activeTab === 'api-keys' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card padding="lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-text-primary">API Keys</h2>
                  <Button variant="primary" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Generate Key
                  </Button>
                </div>
                <div className="space-y-4">
                  {apiKeys.map((apiKey) => (
                    <div
                      key={apiKey.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-glass-border"
                    >
                      <div>
                        <p className="font-medium text-text-primary">{apiKey.name}</p>
                        <p className="text-sm text-text-muted font-mono">{apiKey.key}</p>
                        <p className="text-xs text-text-muted mt-1">
                          Created: {apiKey.created} • Last used: {apiKey.lastUsed}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="secondary" size="sm">Regenerate</Button>
                        <Button variant="ghost" size="sm" className="text-status-critical hover:text-status-critical">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Data Management Tab */}
          {activeTab === 'data' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card padding="lg">
                <h2 className="text-lg font-semibold text-text-primary mb-4">Data Retention</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Logs', value: '30 days', description: 'Application and system logs' },
                    { label: 'Metrics', value: '90 days', description: 'Performance and system metrics' },
                    { label: 'Traces', value: '14 days', description: 'Distributed trace data' },
                    { label: 'Alerts', value: '365 days', description: 'Alert history and incidents' },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between p-4 rounded-lg border border-glass-border"
                    >
                      <div>
                        <p className="font-medium text-text-primary">{item.label}</p>
                        <p className="text-sm text-text-muted">{item.description}</p>
                      </div>
                      <Badge variant="default">{item.value}</Badge>
                    </div>
                  ))}
                </div>
              </Card>

              <Card padding="lg">
                <h2 className="text-lg font-semibold text-text-primary mb-4">Storage Usage</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Used</span>
                    <span className="text-text-primary font-medium">2.4 TB / 5 TB</span>
                  </div>
                  <div className="w-full h-3 bg-bg-tertiary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary"
                      style={{ width: '48%' }}
                    />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-text-muted">Logs</p>
                      <p className="font-medium text-text-primary">1.2 TB</p>
                    </div>
                    <div>
                      <p className="text-text-muted">Metrics</p>
                      <p className="font-medium text-text-primary">800 GB</p>
                    </div>
                    <div>
                      <p className="text-text-muted">Traces</p>
                      <p className="font-medium text-text-primary">300 GB</p>
                    </div>
                    <div>
                      <p className="text-text-muted">Other</p>
                      <p className="font-medium text-text-primary">100 GB</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
