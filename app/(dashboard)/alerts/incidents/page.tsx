'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  AlertCircle,
  Clock,
  User,
  Users,
  MessageSquare,
  Plus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Activity,
  FileText,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { PLATFORMS } from '@/lib/constants';
import { cn } from '@/lib/utils';

// Mock incidents data
const generateIncidents = () => {
  const titles = [
    'Payment Processing Degradation',
    'Database Connection Pool Exhaustion',
    'API Gateway High Latency',
    'Authentication Service Outage',
    'Cache Cluster Failover',
    'SSL Certificate Renewal Failure',
    'Memory Leak in Worker Nodes',
    'Network Partition Event',
  ];

  const statuses = ['investigating', 'identified', 'monitoring', 'resolved'] as const;
  const severities = ['sev1', 'sev2', 'sev3', 'sev4'] as const;

  return Array.from({ length: 12 }, (_, i) => {
    const platform = PLATFORMS[Math.floor(Math.random() * PLATFORMS.length)];
    const status = i < 3 ? statuses[Math.floor(Math.random() * 2)] : statuses[Math.floor(Math.random() * statuses.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const startTime = new Date(Date.now() - Math.random() * 7 * 86400000);

    return {
      id: `INC-${1000 + i}`,
      title: titles[Math.floor(Math.random() * titles.length)],
      platform: platform.code,
      platformName: platform.name,
      platformColor: platform.color,
      severity,
      status,
      commander: ['Maria Garcia', 'Carlos Lopez', 'Ana Martinez', 'Pedro Sanchez'][Math.floor(Math.random() * 4)],
      responders: Math.floor(Math.random() * 4) + 1,
      startTime: startTime.toISOString(),
      duration: status === 'resolved'
        ? Math.floor(Math.random() * 180) + 30
        : Math.floor((Date.now() - startTime.getTime()) / 60000),
      impactedServices: Math.floor(Math.random() * 5) + 1,
      updates: Math.floor(Math.random() * 10) + 2,
      resolvedAt: status === 'resolved'
        ? new Date(startTime.getTime() + (Math.random() * 180 + 30) * 60000).toISOString()
        : null,
    };
  }).sort((a, b) => {
    const statusOrder = { investigating: 0, identified: 1, monitoring: 2, resolved: 3 };
    const sevOrder = { sev1: 0, sev2: 1, sev3: 2, sev4: 3 };
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return sevOrder[a.severity] - sevOrder[b.severity];
  });
};

const statusConfig = {
  investigating: { label: 'Investigating', color: 'bg-status-critical text-white', icon: AlertCircle },
  identified: { label: 'Identified', color: 'bg-status-warning text-white', icon: AlertTriangle },
  monitoring: { label: 'Monitoring', color: 'bg-status-info text-white', icon: Activity },
  resolved: { label: 'Resolved', color: 'bg-status-healthy text-white', icon: CheckCircle },
};

const severityConfig = {
  sev1: { label: 'SEV-1', color: 'bg-red-600', description: 'Critical - Complete outage' },
  sev2: { label: 'SEV-2', color: 'bg-orange-500', description: 'Major - Significant impact' },
  sev3: { label: 'SEV-3', color: 'bg-yellow-500', description: 'Minor - Degraded service' },
  sev4: { label: 'SEV-4', color: 'bg-blue-500', description: 'Low - Minimal impact' },
};

export default function IncidentsPage() {
  const [incidents] = useState(() => generateIncidents());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || incident.status === selectedStatus;
    const matchesSeverity = selectedSeverity === 'all' || incident.severity === selectedSeverity;
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const activeIncidents = incidents.filter((i) => i.status !== 'resolved');
  const stats = {
    active: activeIncidents.length,
    sev1: activeIncidents.filter((i) => i.severity === 'sev1').length,
    sev2: activeIncidents.filter((i) => i.severity === 'sev2').length,
    mttr: Math.round(
      incidents
        .filter((i) => i.status === 'resolved')
        .reduce((a, b) => a + b.duration, 0) /
        incidents.filter((i) => i.status === 'resolved').length
    ),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/alerts">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Incidents</h1>
            <p className="text-text-secondary mt-1">
              Incident management and response tracking
            </p>
          </div>
        </div>
        <Button variant="primary" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Declare Incident
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-status-critical/10 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-status-critical" />
            </div>
            <div>
              <p className="text-2xl font-bold text-status-critical">{stats.active}</p>
              <p className="text-xs text-text-muted">Active Incidents</p>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-600/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-500">{stats.sev1}</p>
              <p className="text-xs text-text-muted">SEV-1 Active</p>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-500">{stats.sev2}</p>
              <p className="text-xs text-text-muted">SEV-2 Active</p>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-accent-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{stats.mttr}m</p>
              <p className="text-xs text-text-muted">Avg MTTR</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card padding="md">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search incidents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              className="bg-glass-bg border border-glass-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="investigating">Investigating</option>
              <option value="identified">Identified</option>
              <option value="monitoring">Monitoring</option>
              <option value="resolved">Resolved</option>
            </select>

            <select
              className="bg-glass-bg border border-glass-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
            >
              <option value="all">All Severities</option>
              <option value="sev1">SEV-1</option>
              <option value="sev2">SEV-2</option>
              <option value="sev3">SEV-3</option>
              <option value="sev4">SEV-4</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Incidents List */}
      <div className="space-y-3">
        {filteredIncidents.map((incident, index) => {
          const StatusIcon = statusConfig[incident.status].icon;

          return (
            <motion.div
              key={incident.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
            >
              <Card
                hoverable
                padding="md"
                className={cn(
                  'border-l-4',
                  incident.severity === 'sev1'
                    ? 'border-red-600'
                    : incident.severity === 'sev2'
                    ? 'border-orange-500'
                    : incident.severity === 'sev3'
                    ? 'border-yellow-500'
                    : 'border-blue-500'
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn('p-2 rounded-lg', statusConfig[incident.status].color)}>
                    <StatusIcon className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-sm text-text-muted">{incident.id}</span>
                          <Badge className={severityConfig[incident.severity].color} size="sm">
                            {severityConfig[incident.severity].label}
                          </Badge>
                          <Badge className={statusConfig[incident.status].color} size="sm">
                            {statusConfig[incident.status].label}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-text-primary mt-1">{incident.title}</h3>
                      </div>
                      <Button variant="secondary" size="sm">
                        View Details
                      </Button>
                    </div>

                    <div className="flex items-center gap-6 mt-3 flex-wrap text-sm text-text-muted">
                      <Badge
                        size="sm"
                        style={{ backgroundColor: `${incident.platformColor}20`, color: incident.platformColor }}
                      >
                        {incident.platformName}
                      </Badge>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {incident.status === 'resolved'
                          ? `Duration: ${incident.duration}m`
                          : `Ongoing: ${incident.duration}m`}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {incident.commander}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {incident.responders} responders
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {incident.updates} updates
                      </span>
                      <span className="flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {incident.impactedServices} services impacted
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredIncidents.length === 0 && (
        <Card padding="lg" className="text-center">
          <CheckCircle className="h-12 w-12 text-status-healthy mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary">No incidents found</h3>
          <p className="text-text-muted mt-1">
            {selectedStatus === 'all' && selectedSeverity === 'all'
              ? 'All systems are operating normally'
              : 'Try adjusting your filters'}
          </p>
        </Card>
      )}
    </div>
  );
}
