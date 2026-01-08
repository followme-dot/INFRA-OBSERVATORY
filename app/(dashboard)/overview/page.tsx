'use client';

import { motion } from 'framer-motion';
import { HealthScore } from '@/components/overview/HealthScore';
import { PlatformGrid, getMockPlatforms } from '@/components/overview/PlatformGrid';
import { ActiveAlerts, getMockAlerts } from '@/components/overview/ActiveAlerts';
import { SystemStats, getMockSystemStats } from '@/components/overview/SystemStats';
import {
  TimeSeriesChart,
  generateMockTimeSeriesData,
} from '@/components/charts/TimeSeriesChart';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatNumber, formatDuration } from '@/lib/utils';
import { RefreshCw, Download, ExternalLink } from 'lucide-react';

export default function OverviewPage() {
  // Mock data - replace with API calls
  const platforms = getMockPlatforms();
  const alerts = getMockAlerts();
  const systemStats = getMockSystemStats();

  // Calculate overall health score
  const overallHealthScore = Math.round(
    platforms.reduce((acc, p) => acc + p.healthScore, 0) / platforms.length
  );

  // Mock chart data
  const requestsData = generateMockTimeSeriesData(60, ['requests', 'errors']);
  const latencyData = generateMockTimeSeriesData(60, ['p50', 'p90', 'p99']);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            System Overview
          </h1>
          <p className="text-text-secondary mt-1">
            Real-time monitoring across all INFRA platforms
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" leftIcon={<Download className="h-4 w-4" />}>
            Export
          </Button>
          <Button variant="secondary" size="sm" leftIcon={<ExternalLink className="h-4 w-4" />}>
            Share
          </Button>
        </div>
      </div>

      {/* Top Section - Health Score + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Health Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-1"
        >
          <Card className="h-full flex flex-col items-center justify-center py-8">
            <h2 className="text-sm font-medium text-text-muted mb-4">
              System Health Score
            </h2>
            <HealthScore score={overallHealthScore} size="lg" />
            <div className="mt-6 flex items-center gap-4 text-sm">
              <div className="text-center">
                <p className="text-lg font-bold text-status-healthy">
                  {platforms.filter((p) => p.status === 'healthy').length}
                </p>
                <p className="text-xs text-text-muted">Healthy</p>
              </div>
              <div className="w-px h-8 bg-glass-border" />
              <div className="text-center">
                <p className="text-lg font-bold text-status-warning">
                  {platforms.filter((p) => p.status === 'warning' || p.status === 'degraded').length}
                </p>
                <p className="text-xs text-text-muted">Degraded</p>
              </div>
              <div className="w-px h-8 bg-glass-border" />
              <div className="text-center">
                <p className="text-lg font-bold text-status-critical">
                  {platforms.filter((p) => p.status === 'critical').length}
                </p>
                <p className="text-xs text-text-muted">Critical</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* System Stats */}
        <div className="lg:col-span-3">
          <SystemStats stats={systemStats} />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TimeSeriesChart
          title="Request Volume"
          subtitle="Requests per second across all platforms"
          data={requestsData}
          series={[
            { dataKey: 'requests', name: 'Requests', color: '#00d4ff' },
            { dataKey: 'errors', name: 'Errors', color: '#ef4444' },
          ]}
          type="area"
          height={250}
          formatValue={(v) => formatNumber(v * 100)}
        />

        <TimeSeriesChart
          title="Latency Distribution"
          subtitle="Response time percentiles"
          data={latencyData}
          series={[
            { dataKey: 'p50', name: 'P50', color: '#10b981' },
            { dataKey: 'p90', name: 'P90', color: '#f59e0b' },
            { dataKey: 'p99', name: 'P99', color: '#ef4444' },
          ]}
          type="line"
          height={250}
          formatValue={(v) => `${Math.round(v)}ms`}
        />
      </div>

      {/* Platforms Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              Platforms
            </h2>
            <p className="text-sm text-text-secondary">
              {platforms.length} platforms monitored
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success" size="sm">
              {platforms.filter((p) => p.status === 'healthy').length} healthy
            </Badge>
            {alerts.length > 0 && (
              <Badge variant="warning" size="sm">
                {alerts.length} alerts
              </Badge>
            )}
          </div>
        </div>

        <PlatformGrid platforms={platforms} />
      </div>

      {/* Bottom Section - Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActiveAlerts alerts={alerts} maxItems={5} />

        {/* Recent Incidents */}
        <Card>
          <CardHeader
            title="Recent Incidents"
            subtitle="Last 7 days"
            action={
              <Badge variant="success" size="sm">
                All resolved
              </Badge>
            }
          />
          <div className="space-y-3">
            {[
              {
                title: 'Payment Gateway Degradation',
                platform: 'INFRAPAY',
                duration: '23 minutes',
                resolved: '2 days ago',
                severity: 'high',
              },
              {
                title: 'Database Connection Pool Exhaustion',
                platform: 'INFRABANK',
                duration: '8 minutes',
                resolved: '4 days ago',
                severity: 'medium',
              },
              {
                title: 'CDN Cache Invalidation Delay',
                platform: 'INFRADEVTECH',
                duration: '45 minutes',
                resolved: '6 days ago',
                severity: 'low',
              },
            ].map((incident, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg bg-bg-tertiary/30 hover:bg-bg-tertiary/50 transition-colors cursor-pointer"
              >
                <div>
                  <h4 className="font-medium text-text-primary">
                    {incident.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-text-muted">
                    <span className="px-1.5 py-0.5 rounded bg-bg-tertiary">
                      {incident.platform}
                    </span>
                    <span>Duration: {incident.duration}</span>
                    <span>Resolved: {incident.resolved}</span>
                  </div>
                </div>
                <Badge
                  variant={
                    incident.severity === 'high'
                      ? 'warning'
                      : incident.severity === 'low'
                      ? 'success'
                      : 'default'
                  }
                  size="sm"
                >
                  {incident.severity}
                </Badge>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
