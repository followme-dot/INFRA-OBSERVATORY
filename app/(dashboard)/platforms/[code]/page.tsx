'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  CreditCard,
  Vault,
  Coins,
  Gem,
  Code,
  Hammer,
  Shield,
  GraduationCap,
  Activity,
  Server,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatusBadge } from '@/components/ui/StatusDot';
import { PLATFORMS } from '@/lib/constants';
import { cn, formatNumber } from '@/lib/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

const platformIcons: Record<string, React.ReactNode> = {
  infrabank: <Building2 className="h-8 w-8" />,
  infrapay: <CreditCard className="h-8 w-8" />,
  infravault: <Vault className="h-8 w-8" />,
  infradigital: <Coins className="h-8 w-8" />,
  infracoinn: <Gem className="h-8 w-8" />,
  infradevtech: <Code className="h-8 w-8" />,
  infraforge: <Hammer className="h-8 w-8" />,
  infrainsurance: <Shield className="h-8 w-8" />,
  infraschool: <GraduationCap className="h-8 w-8" />,
};

// Mock time series data
const generateTimeSeriesData = (points: number, baseValue: number, variance: number) => {
  return Array.from({ length: points }, (_, i) => {
    const time = new Date(Date.now() - (points - i) * 60000);
    return {
      time: time.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      value: baseValue + Math.random() * variance - variance / 2,
    };
  });
};

// Mock services data
const generateServices = (platformCode: string) => {
  const serviceTypes = ['api', 'worker', 'database', 'cache', 'queue', 'gateway'];
  const count = Math.floor(Math.random() * 15) + 10;
  return Array.from({ length: count }, (_, i) => ({
    id: `${platformCode}-svc-${i + 1}`,
    name: `${platformCode}-${serviceTypes[i % serviceTypes.length]}-${Math.floor(i / serviceTypes.length) + 1}`,
    type: serviceTypes[i % serviceTypes.length],
    status: Math.random() > 0.15 ? 'healthy' : Math.random() > 0.5 ? 'degraded' : 'critical',
    cpu: Math.floor(Math.random() * 60) + 10,
    memory: Math.floor(Math.random() * 50) + 30,
    requests: Math.floor(Math.random() * 1000) + 100,
    errorRate: Math.random() * 2,
    latency: Math.floor(Math.random() * 150) + 20,
  }));
};

export default function PlatformDetailPage() {
  const params = useParams();
  const code = params.code as string;

  const platform = PLATFORMS.find((p) => p.code === code);

  if (!platform) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card padding="lg" className="text-center">
          <AlertTriangle className="h-12 w-12 text-status-warning mx-auto mb-4" />
          <h2 className="text-xl font-bold text-text-primary mb-2">Platform Not Found</h2>
          <p className="text-text-muted mb-4">The platform &quot;{code}&quot; does not exist.</p>
          <Link href="/platforms">
            <Button variant="primary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Platforms
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Mock platform data
  const platformData = {
    ...platform,
    status: 'healthy' as const,
    healthScore: 96,
    uptime: '99.99%',
    services: generateServices(code),
    requestsPerSecond: Math.floor(Math.random() * 5000) + 1000,
    errorRate: Math.random() * 0.5,
    p50Latency: Math.floor(Math.random() * 50) + 20,
    p99Latency: Math.floor(Math.random() * 200) + 100,
    activeAlerts: Math.floor(Math.random() * 3),
    activeIncidents: 0,
  };

  const requestsData = generateTimeSeriesData(30, platformData.requestsPerSecond, 500);
  const latencyData = generateTimeSeriesData(30, platformData.p50Latency, 20);
  const errorData = generateTimeSeriesData(30, platformData.errorRate, 0.3);

  const healthyServices = platformData.services.filter((s) => s.status === 'healthy').length;
  const degradedServices = platformData.services.filter((s) => s.status === 'degraded').length;
  const criticalServices = platformData.services.filter((s) => s.status === 'critical').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link href="/platforms">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor: `${platform.color}20`,
              color: platform.color,
            }}
          >
            {platformIcons[platform.code]}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-text-primary">{platform.name}</h1>
              <StatusBadge status={platformData.status} />
            </div>
            <p className="text-text-muted mt-1">{platform.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="primary" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Dashboard
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center">
              <Activity className="h-5 w-5 text-accent-primary" />
            </div>
            <div>
              <p className="text-lg font-bold text-text-primary">{platformData.healthScore}%</p>
              <p className="text-xs text-text-muted">Health Score</p>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-status-healthy/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-status-healthy" />
            </div>
            <div>
              <p className="text-lg font-bold text-text-primary">{platformData.uptime}</p>
              <p className="text-xs text-text-muted">Uptime (30d)</p>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-secondary/10 flex items-center justify-center">
              <Server className="h-5 w-5 text-accent-secondary" />
            </div>
            <div>
              <p className="text-lg font-bold text-text-primary">{platformData.services.length}</p>
              <p className="text-xs text-text-muted">Services</p>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-status-info/10 flex items-center justify-center">
              <Zap className="h-5 w-5 text-status-info" />
            </div>
            <div>
              <p className="text-lg font-bold text-text-primary">{formatNumber(platformData.requestsPerSecond)}/s</p>
              <p className="text-xs text-text-muted">Requests</p>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-status-warning/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-status-warning" />
            </div>
            <div>
              <p className={cn(
                'text-lg font-bold',
                platformData.activeAlerts > 0 ? 'text-status-warning' : 'text-status-healthy'
              )}>
                {platformData.activeAlerts}
              </p>
              <p className="text-xs text-text-muted">Active Alerts</p>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-status-critical/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-status-critical" />
            </div>
            <div>
              <p className={cn(
                'text-lg font-bold',
                platformData.activeIncidents > 0 ? 'text-status-critical' : 'text-status-healthy'
              )}>
                {platformData.activeIncidents}
              </p>
              <p className="text-xs text-text-muted">Incidents</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card padding="md">
          <h3 className="text-sm font-medium text-text-primary mb-4">Requests per Second</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={requestsData}>
                <defs>
                  <linearGradient id="requestsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={platform.color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={platform.color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="time" tick={{ fill: '#6b7280', fontSize: 10 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={platform.color}
                  fill="url(#requestsGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card padding="md">
          <h3 className="text-sm font-medium text-text-primary mb-4">Latency (P50)</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={latencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="time" tick={{ fill: '#6b7280', fontSize: 10 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card padding="md">
          <h3 className="text-sm font-medium text-text-primary mb-4">Error Rate (%)</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={errorData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="time" tick={{ fill: '#6b7280', fontSize: 10 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Services Overview */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Services</h3>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-status-healthy" />
              <span className="text-text-muted">{healthyServices} Healthy</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-status-warning" />
              <span className="text-text-muted">{degradedServices} Degraded</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-status-critical" />
              <span className="text-text-muted">{criticalServices} Critical</span>
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-glass-border">
                <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">Service</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">Type</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">Status</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">CPU</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">Memory</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">Req/s</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">Error %</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border">
              {platformData.services.slice(0, 10).map((service, index) => (
                <motion.tr
                  key={service.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="hover:bg-glass-bg/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <span className="font-medium text-text-primary">{service.name}</span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="default" size="sm">{service.type}</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={service.status as 'healthy' | 'degraded' | 'critical'} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={cn(
                      'text-sm',
                      service.cpu > 80 ? 'text-status-critical' : service.cpu > 60 ? 'text-status-warning' : 'text-text-secondary'
                    )}>
                      {service.cpu}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={cn(
                      'text-sm',
                      service.memory > 80 ? 'text-status-critical' : service.memory > 60 ? 'text-status-warning' : 'text-text-secondary'
                    )}>
                      {service.memory}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-text-secondary">
                    {formatNumber(service.requests)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={cn(
                      'text-sm',
                      service.errorRate > 1 ? 'text-status-critical' : service.errorRate > 0.5 ? 'text-status-warning' : 'text-text-secondary'
                    )}>
                      {service.errorRate.toFixed(2)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-text-secondary">
                    {service.latency}ms
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {platformData.services.length > 10 && (
          <div className="mt-4 text-center">
            <Button variant="secondary" size="sm">
              View All {platformData.services.length} Services
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
