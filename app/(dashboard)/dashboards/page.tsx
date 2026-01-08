'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Plus,
  Search,
  Star,
  StarOff,
  MoreVertical,
  Clock,
  User,
  Copy,
  Trash2,
  Edit,
  ExternalLink,
  Grid,
  List,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { PLATFORMS } from '@/lib/constants';
import { cn } from '@/lib/utils';

// Mock dashboards data
const generateDashboards = () => {
  const templates = [
    { name: 'Platform Overview', description: 'High-level platform health and metrics', type: 'overview' },
    { name: 'Service Performance', description: 'Detailed service-level performance metrics', type: 'performance' },
    { name: 'Error Analysis', description: 'Error rates and debugging information', type: 'errors' },
    { name: 'Infrastructure', description: 'Infrastructure and resource utilization', type: 'infrastructure' },
    { name: 'Business Metrics', description: 'Key business and transaction metrics', type: 'business' },
    { name: 'SRE Golden Signals', description: 'Latency, traffic, errors, and saturation', type: 'sre' },
  ];

  return PLATFORMS.slice(0, 6).flatMap((platform, platformIndex) =>
    templates.slice(0, 2 + Math.floor(Math.random() * 3)).map((template, templateIndex) => ({
      id: `dashboard-${platformIndex}-${templateIndex}`,
      name: `${platform.name} - ${template.name}`,
      description: template.description,
      platform: platform.code,
      platformName: platform.name,
      platformColor: platform.color,
      type: template.type,
      starred: Math.random() > 0.7,
      panels: Math.floor(Math.random() * 12) + 4,
      createdBy: ['admin@infra.com', 'sre@infra.com', 'devops@infra.com'][Math.floor(Math.random() * 3)],
      createdAt: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 7 * 86400000).toISOString(),
      views: Math.floor(Math.random() * 500) + 50,
    }))
  );
};

export default function DashboardsPage() {
  const [dashboards, setDashboards] = useState(() => generateDashboards());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showStarredOnly, setShowStarredOnly] = useState(false);

  const filteredDashboards = dashboards.filter((dashboard) => {
    const matchesSearch =
      dashboard.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dashboard.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = selectedPlatform === 'all' || dashboard.platform === selectedPlatform;
    const matchesStarred = !showStarredOnly || dashboard.starred;
    return matchesSearch && matchesPlatform && matchesStarred;
  });

  const toggleStar = (dashboardId: string) => {
    setDashboards((prev) =>
      prev.map((d) => (d.id === dashboardId ? { ...d, starred: !d.starred } : d))
    );
  };

  const stats = {
    total: dashboards.length,
    starred: dashboards.filter((d) => d.starred).length,
    platforms: new Set(dashboards.map((d) => d.platform)).size,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Dashboards</h1>
          <p className="text-text-secondary mt-1">
            Custom dashboards and visualizations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            Import
          </Button>
          <Button variant="primary" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Dashboard
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center">
              <LayoutDashboard className="h-5 w-5 text-accent-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
              <p className="text-xs text-text-muted">Total Dashboards</p>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <Star className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{stats.starred}</p>
              <p className="text-xs text-text-muted">Starred</p>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-secondary/10 flex items-center justify-center">
              <Grid className="h-5 w-5 text-accent-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{stats.platforms}</p>
              <p className="text-xs text-text-muted">Platforms</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card padding="md">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search dashboards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              className="bg-glass-bg border border-glass-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
            >
              <option value="all">All Platforms</option>
              {PLATFORMS.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.name}
                </option>
              ))}
            </select>

            <Button
              variant={showStarredOnly ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setShowStarredOnly(!showStarredOnly)}
            >
              <Star className={cn('h-4 w-4 mr-1', showStarredOnly && 'fill-current')} />
              Starred
            </Button>

            <div className="flex gap-1 border border-glass-border rounded-lg p-1">
              <button
                className={cn(
                  'p-1.5 rounded transition-colors',
                  viewMode === 'grid' ? 'bg-accent-primary text-white' : 'text-text-muted hover:text-text-primary'
                )}
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                className={cn(
                  'p-1.5 rounded transition-colors',
                  viewMode === 'list' ? 'bg-accent-primary text-white' : 'text-text-muted hover:text-text-primary'
                )}
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Dashboards Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDashboards.map((dashboard, index) => (
            <motion.div
              key={dashboard.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <Card hoverable padding="none" className="group">
                <div
                  className="h-2"
                  style={{ backgroundColor: dashboard.platformColor }}
                />
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-text-primary truncate group-hover:text-accent-primary transition-colors">
                          {dashboard.name}
                        </h3>
                        <button
                          className="text-text-muted hover:text-yellow-500 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStar(dashboard.id);
                          }}
                        >
                          {dashboard.starred ? (
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          ) : (
                            <StarOff className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-sm text-text-muted mt-1 line-clamp-2">
                        {dashboard.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <Badge
                      size="sm"
                      style={{ backgroundColor: `${dashboard.platformColor}20`, color: dashboard.platformColor }}
                    >
                      {dashboard.platformName}
                    </Badge>
                    <Badge variant="default" size="sm">
                      {dashboard.panels} panels
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-glass-border text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(dashboard.updatedAt).toLocaleDateString('es-ES')}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {dashboard.createdBy.split('@')[0]}
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card padding="none" className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-glass-border bg-glass-bg/50">
                <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">Name</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">Platform</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">Panels</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">Created By</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">Updated</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border">
              {filteredDashboards.map((dashboard, index) => (
                <motion.tr
                  key={dashboard.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className="hover:bg-glass-bg/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="text-text-muted hover:text-yellow-500 transition-colors"
                        onClick={() => toggleStar(dashboard.id)}
                      >
                        {dashboard.starred ? (
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        ) : (
                          <StarOff className="h-4 w-4" />
                        )}
                      </button>
                      <span className="font-medium text-text-primary">{dashboard.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      size="sm"
                      style={{ backgroundColor: `${dashboard.platformColor}20`, color: dashboard.platformColor }}
                    >
                      {dashboard.platformName}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-text-secondary">{dashboard.panels}</td>
                  <td className="py-3 px-4 text-text-secondary">{dashboard.createdBy.split('@')[0]}</td>
                  <td className="py-3 px-4 text-text-muted text-sm">
                    {new Date(dashboard.updatedAt).toLocaleDateString('es-ES')}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {filteredDashboards.length === 0 && (
        <Card padding="lg" className="text-center">
          <LayoutDashboard className="h-12 w-12 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary">No dashboards found</h3>
          <p className="text-text-muted mt-1">Try adjusting your filters or create a new dashboard</p>
          <Button variant="primary" size="sm" className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Create Dashboard
          </Button>
        </Card>
      )}
    </div>
  );
}
