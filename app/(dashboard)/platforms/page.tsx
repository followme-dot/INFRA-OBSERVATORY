'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Building2,
  CreditCard,
  Vault,
  Coins,
  Gem,
  Code,
  Hammer,
  Shield,
  GraduationCap,
  ArrowUpRight,
  Activity,
  Server,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { StatusBadge } from '@/components/ui/StatusDot';
import { useState } from 'react';
import { PLATFORMS } from '@/lib/constants';
import { cn, formatNumber } from '@/lib/utils';

const platformIcons: Record<string, React.ReactNode> = {
  infrabank: <Building2 className="h-6 w-6" />,
  infrapay: <CreditCard className="h-6 w-6" />,
  infravault: <Vault className="h-6 w-6" />,
  infradigital: <Coins className="h-6 w-6" />,
  infracoinn: <Gem className="h-6 w-6" />,
  infradevtech: <Code className="h-6 w-6" />,
  infraforge: <Hammer className="h-6 w-6" />,
  infrainsurance: <Shield className="h-6 w-6" />,
  infraschool: <GraduationCap className="h-6 w-6" />,
};

// Mock data
const platformsData = PLATFORMS.map((p, i) => ({
  ...p,
  status: i === 2 ? 'warning' : i === 5 ? 'degraded' : 'healthy' as const,
  healthScore: i === 2 ? 78 : i === 5 ? 85 : 95 + Math.floor(Math.random() * 5),
  serviceCount: parseInt(p.estimatedServices.split('-')[0]) + Math.floor(Math.random() * 10),
  healthyServices: parseInt(p.estimatedServices.split('-')[0]),
  alertCount: i === 2 ? 3 : i === 5 ? 1 : 0,
  requestsPerSecond: Math.floor(Math.random() * 5000) + 500,
  errorRate: i === 2 ? 1.5 : Math.random() * 0.5,
  p99Latency: Math.floor(Math.random() * 200) + 100,
  uptime: '99.99%',
}));

export default function PlatformsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredPlatforms = platformsData.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: platformsData.length,
    healthy: platformsData.filter((p) => p.status === 'healthy').length,
    warning: platformsData.filter((p) => p.status === 'warning' || p.status === 'degraded').length,
    critical: platformsData.filter((p) => p.status === 'critical').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Platforms</h1>
          <p className="text-text-secondary mt-1">
            Monitor all {stats.total} INFRA platforms
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center">
              <Server className="h-5 w-5 text-accent-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
              <p className="text-xs text-text-muted">Total Platforms</p>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-status-healthy/10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-status-healthy" />
            </div>
            <div>
              <p className="text-2xl font-bold text-status-healthy">{stats.healthy}</p>
              <p className="text-xs text-text-muted">Healthy</p>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-status-warning/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-status-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-status-warning">{stats.warning}</p>
              <p className="text-xs text-text-muted">Degraded</p>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-status-critical/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-status-critical" />
            </div>
            <div>
              <p className="text-2xl font-bold text-status-critical">{stats.critical}</p>
              <p className="text-xs text-text-muted">Critical</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card padding="md">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search platforms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>
          <div className="flex gap-2">
            {['all', 'healthy', 'warning', 'critical'].map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setFilterStatus(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Platforms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredPlatforms.map((platform, index) => (
          <motion.div
            key={platform.code}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link href={`/platforms/${platform.code}`}>
              <Card hoverable className="group h-full" padding="none">
                {/* Header */}
                <div className="p-4 border-b border-glass-border">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{
                          backgroundColor: `${platform.color}20`,
                          color: platform.color,
                        }}
                      >
                        {platformIcons[platform.code]}
                      </div>
                      <div>
                        <h3 className="font-semibold text-text-primary group-hover:text-accent-primary transition-colors">
                          {platform.name}
                        </h3>
                        <p className="text-xs text-text-muted">{platform.description}</p>
                      </div>
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                {/* Stats */}
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <StatusBadge status={platform.status} />
                    <Badge
                      variant={platform.criticality === 'critical' ? 'danger' : platform.criticality === 'high' ? 'warning' : 'default'}
                      size="sm"
                    >
                      {platform.criticality}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold text-text-primary">{platform.serviceCount}</p>
                      <p className="text-xs text-text-muted">Services</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-text-primary">{platform.healthScore}%</p>
                      <p className="text-xs text-text-muted">Health</p>
                    </div>
                    <div>
                      <p className={cn(
                        'text-lg font-bold',
                        platform.alertCount > 0 ? 'text-status-warning' : 'text-status-healthy'
                      )}>
                        {platform.alertCount}
                      </p>
                      <p className="text-xs text-text-muted">Alerts</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-glass-border flex items-center justify-between text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      <Activity className="h-3 w-3" />
                      {formatNumber(platform.requestsPerSecond)}/s
                    </span>
                    <span>Err: {platform.errorRate.toFixed(2)}%</span>
                    <span>P99: {platform.p99Latency}ms</span>
                  </div>
                </div>

                {/* Color bar */}
                <div
                  className="h-1"
                  style={{
                    background: `linear-gradient(90deg, ${platform.color}, ${platform.color}50)`,
                  }}
                />
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
