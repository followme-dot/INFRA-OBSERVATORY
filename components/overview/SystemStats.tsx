'use client';

import { motion } from 'framer-motion';
import {
  Activity,
  Server,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Zap,
  Clock,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn, formatNumber, formatDuration } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  color?: string;
  index?: number;
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = '#00d4ff',
  index = 0,
}: StatCardProps) {
  const TrendIcon =
    trend?.direction === 'up'
      ? TrendingUp
      : trend?.direction === 'down'
      ? TrendingDown
      : Minus;

  const trendColor =
    trend?.direction === 'up'
      ? 'text-status-healthy'
      : trend?.direction === 'down'
      ? 'text-status-critical'
      : 'text-text-muted';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="relative overflow-hidden" padding="md">
        {/* Background Glow */}
        <div
          className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: color }}
        />

        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-text-muted">{title}</span>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${color}20`, color }}
            >
              {icon}
            </div>
          </div>

          {/* Value */}
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-text-primary">{value}</span>
            {subtitle && (
              <span className="text-sm text-text-muted mb-1">{subtitle}</span>
            )}
          </div>

          {/* Trend */}
          {trend && (
            <div className={cn('flex items-center gap-1 mt-2', trendColor)}>
              <TrendIcon className="h-4 w-4" />
              <span className="text-sm font-medium">
                {trend.value > 0 ? '+' : ''}
                {trend.value}%
              </span>
              {trend.label && (
                <span className="text-xs text-text-muted ml-1">
                  {trend.label}
                </span>
              )}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

interface SystemStatsProps {
  stats: {
    totalServices: number;
    healthyServices: number;
    requestsPerSecond: number;
    errorRate: number;
    p99Latency: number;
    activeAlerts: number;
    criticalAlerts: number;
  };
}

export function SystemStats({ stats }: SystemStatsProps) {
  const healthyPercentage = Math.round(
    (stats.healthyServices / stats.totalServices) * 100
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        title="Total Services"
        value={stats.totalServices}
        subtitle={`${stats.healthyServices} healthy`}
        icon={<Server className="h-4 w-4" />}
        trend={{
          value: 2,
          direction: 'up',
          label: 'vs last week',
        }}
        color="#00d4ff"
        index={0}
      />

      <StatCard
        title="Requests/sec"
        value={formatNumber(stats.requestsPerSecond)}
        icon={<Activity className="h-4 w-4" />}
        trend={{
          value: 12,
          direction: 'up',
          label: 'vs last hour',
        }}
        color="#7c3aed"
        index={1}
      />

      <StatCard
        title="Error Rate"
        value={`${stats.errorRate.toFixed(2)}%`}
        icon={<Zap className="h-4 w-4" />}
        trend={{
          value: -0.5,
          direction: 'down',
          label: 'vs last hour',
        }}
        color={stats.errorRate > 1 ? '#ef4444' : '#10b981'}
        index={2}
      />

      <StatCard
        title="P99 Latency"
        value={formatDuration(stats.p99Latency)}
        icon={<Clock className="h-4 w-4" />}
        trend={{
          value: -8,
          direction: 'down',
          label: 'vs last hour',
        }}
        color="#f59e0b"
        index={3}
      />
    </div>
  );
}

// Quick stats row for header area
interface QuickStatsProps {
  stats: {
    platforms: number;
    services: number;
    uptime: string;
    activeAlerts: number;
  };
}

export function QuickStats({ stats }: QuickStatsProps) {
  return (
    <div className="flex items-center gap-6">
      {[
        { label: 'Platforms', value: stats.platforms },
        { label: 'Services', value: stats.services },
        { label: 'Uptime', value: stats.uptime },
        {
          label: 'Alerts',
          value: stats.activeAlerts,
          color: stats.activeAlerts > 0 ? 'text-status-warning' : undefined,
        },
      ].map((stat) => (
        <div key={stat.label} className="text-center">
          <p
            className={cn(
              'text-2xl font-bold',
              stat.color || 'gradient-text'
            )}
          >
            {stat.value}
          </p>
          <p className="text-xs text-text-muted">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

// Mock data for development
export function getMockSystemStats() {
  return {
    totalServices: 247,
    healthyServices: 241,
    requestsPerSecond: 45230,
    errorRate: 0.34,
    p99Latency: 156,
    activeAlerts: 3,
    criticalAlerts: 1,
  };
}
