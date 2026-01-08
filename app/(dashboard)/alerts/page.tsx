'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Search,
  Filter,
  Bell,
  BellOff,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  User,
  MessageSquare,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { PLATFORMS, ALERT_SEVERITIES } from '@/lib/constants';
import { cn } from '@/lib/utils';

// Mock alerts data
const generateAlerts = (count: number) => {
  const alertTypes = [
    { title: 'High CPU Usage', description: 'CPU usage exceeded 90% threshold' },
    { title: 'Memory Pressure', description: 'Memory usage is critically high' },
    { title: 'Error Rate Spike', description: 'Error rate increased by 300%' },
    { title: 'Latency Degradation', description: 'P99 latency exceeded 500ms' },
    { title: 'Database Connection Pool', description: 'Connection pool near exhaustion' },
    { title: 'Certificate Expiring', description: 'SSL certificate expires in 7 days' },
    { title: 'Disk Space Low', description: 'Available disk space below 10%' },
    { title: 'Service Unavailable', description: 'Health check failures detected' },
  ];

  const severities = ['info', 'low', 'medium', 'high', 'critical'] as const;
  const statuses = ['firing', 'acknowledged', 'resolved'] as const;

  return Array.from({ length: count }, (_, i) => {
    const platform = PLATFORMS[Math.floor(Math.random() * PLATFORMS.length)];
    const alert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const status = i < 5 ? 'firing' : statuses[Math.floor(Math.random() * statuses.length)];
    const timestamp = new Date(Date.now() - i * Math.random() * 3600000);

    return {
      id: `alert-${i + 1}`,
      title: alert.title,
      description: alert.description,
      platform: platform.code,
      platformName: platform.name,
      platformColor: platform.color,
      service: `${platform.code}-${['api', 'worker', 'db', 'cache'][Math.floor(Math.random() * 4)]}-1`,
      severity,
      status,
      timestamp: timestamp.toISOString(),
      acknowledgedBy: status === 'acknowledged' ? 'admin@infra.com' : null,
      resolvedAt: status === 'resolved' ? new Date(timestamp.getTime() + 1800000).toISOString() : null,
      labels: {
        env: 'production',
        team: ['platform', 'infra', 'sre'][Math.floor(Math.random() * 3)],
      },
    };
  }).sort((a, b) => {
    // Sort by status (firing first) then by severity
    const statusOrder = { firing: 0, acknowledged: 1, resolved: 2 };
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
};

const severityIcons: Record<string, React.ReactNode> = {
  info: <Info className="h-5 w-5 text-blue-400" />,
  low: <AlertCircle className="h-5 w-5 text-green-400" />,
  medium: <AlertTriangle className="h-5 w-5 text-amber-400" />,
  high: <AlertTriangle className="h-5 w-5 text-orange-400" />,
  critical: <XCircle className="h-5 w-5 text-red-500" />,
};

const severityColors: Record<string, string> = {
  info: 'border-blue-400/50 bg-blue-400/5',
  low: 'border-green-400/50 bg-green-400/5',
  medium: 'border-amber-400/50 bg-amber-400/5',
  high: 'border-orange-400/50 bg-orange-400/5',
  critical: 'border-red-500/50 bg-red-500/5',
};

const statusColors: Record<string, string> = {
  firing: 'bg-status-critical text-white',
  acknowledged: 'bg-status-warning text-white',
  resolved: 'bg-status-healthy text-white',
};

export default function AlertsPage() {
  const [alerts] = useState(() => generateAlerts(30));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = selectedPlatform === 'all' || alert.platform === selectedPlatform;
    const matchesSeverity = selectedSeverity === 'all' || alert.severity === selectedSeverity;
    const matchesStatus = selectedStatus === 'all' || alert.status === selectedStatus;
    return matchesSearch && matchesPlatform && matchesSeverity && matchesStatus;
  });

  const stats = {
    firing: alerts.filter((a) => a.status === 'firing').length,
    acknowledged: alerts.filter((a) => a.status === 'acknowledged').length,
    critical: alerts.filter((a) => a.severity === 'critical' && a.status === 'firing').length,
    total: alerts.length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Alerts</h1>
          <p className="text-text-secondary mt-1">
            Monitor and manage alerts across all platforms
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/alerts/incidents">
            <Button variant="secondary" size="sm">
              <AlertCircle className="h-4 w-4 mr-2" />
              Incidents
            </Button>
          </Link>
          <Link href="/alerts/on-call">
            <Button variant="secondary" size="sm">
              <User className="h-4 w-4 mr-2" />
              On-Call
            </Button>
          </Link>
          <Button variant="primary" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Rule
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-status-critical/10 flex items-center justify-center">
              <Bell className="h-5 w-5 text-status-critical animate-pulse" />
            </div>
            <div>
              <p className="text-2xl font-bold text-status-critical">{stats.firing}</p>
              <p className="text-xs text-text-muted">Firing</p>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-status-warning/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-status-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-status-warning">{stats.acknowledged}</p>
              <p className="text-xs text-text-muted">Acknowledged</p>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-500">{stats.critical}</p>
              <p className="text-xs text-text-muted">Critical</p>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center">
              <Bell className="h-5 w-5 text-accent-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
              <p className="text-xs text-text-muted">Total Alerts</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card padding="md">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search alerts..."
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

            <select
              className="bg-glass-bg border border-glass-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
            >
              <option value="all">All Severities</option>
              {ALERT_SEVERITIES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>

            <select
              className="bg-glass-bg border border-glass-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="firing">Firing</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
          >
            <Card
              padding="md"
              className={cn(
                'border-l-4 transition-all hover:bg-glass-bg/80',
                severityColors[alert.severity]
              )}
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">{severityIcons[alert.severity]}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-text-primary">{alert.title}</h3>
                        <Badge className={statusColors[alert.status]} size="sm">
                          {alert.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-text-muted mt-1">{alert.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {alert.status === 'firing' && (
                        <>
                          <Button variant="secondary" size="sm">
                            Acknowledge
                          </Button>
                          <Button variant="ghost" size="sm">
                            <BellOff className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-3 flex-wrap text-xs text-text-muted">
                    <Badge
                      size="sm"
                      style={{ backgroundColor: `${alert.platformColor}20`, color: alert.platformColor }}
                    >
                      {alert.platformName}
                    </Badge>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(alert.timestamp).toLocaleString('es-ES')}
                    </span>
                    <span className="font-mono">{alert.service}</span>
                    {alert.acknowledgedBy && (
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {alert.acknowledgedBy}
                      </span>
                    )}
                    {alert.resolvedAt && (
                      <span className="flex items-center gap-1 text-status-healthy">
                        <CheckCircle className="h-3 w-3" />
                        Resolved {new Date(alert.resolvedAt).toLocaleTimeString('es-ES')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredAlerts.length === 0 && (
        <Card padding="lg" className="text-center">
          <CheckCircle className="h-12 w-12 text-status-healthy mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary">No alerts found</h3>
          <p className="text-text-muted mt-1">
            {selectedStatus === 'firing'
              ? 'All systems are operating normally'
              : 'Try adjusting your filters'}
          </p>
        </Card>
      )}
    </div>
  );
}
