'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Bell, Clock, ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { relativeTime, cn } from '@/lib/utils';
import type { Alert, AlertSeverity } from '@/types';

const severityConfig: Record<
  AlertSeverity,
  { color: string; bg: string; icon: React.ReactNode }
> = {
  info: {
    color: 'text-severity-info',
    bg: 'bg-severity-info/10',
    icon: <Bell className="h-4 w-4" />,
  },
  low: {
    color: 'text-severity-low',
    bg: 'bg-severity-low/10',
    icon: <Bell className="h-4 w-4" />,
  },
  medium: {
    color: 'text-severity-medium',
    bg: 'bg-severity-medium/10',
    icon: <AlertTriangle className="h-4 w-4" />,
  },
  high: {
    color: 'text-severity-high',
    bg: 'bg-severity-high/10',
    icon: <AlertTriangle className="h-4 w-4" />,
  },
  critical: {
    color: 'text-severity-critical',
    bg: 'bg-severity-critical/10',
    icon: <AlertTriangle className="h-4 w-4" />,
  },
};

interface AlertItemProps {
  alert: Alert;
  index: number;
}

function AlertItem({ alert, index }: AlertItemProps) {
  const config = severityConfig[alert.severity];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        'flex items-start gap-3 p-3 rounded-lg border transition-colors hover:bg-bg-tertiary/50 cursor-pointer',
        config.bg,
        'border-transparent hover:border-glass-border'
      )}
    >
      {/* Icon */}
      <div className={cn('mt-0.5', config.color)}>{config.icon}</div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-text-primary truncate">
            {alert.name}
          </h4>
          <Badge
            variant={
              alert.severity === 'critical'
                ? 'danger'
                : alert.severity === 'high'
                ? 'warning'
                : 'default'
            }
            size="sm"
          >
            {alert.severity}
          </Badge>
        </div>

        {alert.description && (
          <p className="text-sm text-text-secondary mt-1 line-clamp-2">
            {alert.description}
          </p>
        )}

        <div className="flex items-center gap-3 mt-2 text-xs text-text-muted">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {relativeTime(alert.firedAt)}
          </span>
          {alert.labels?.platform && (
            <span className="px-1.5 py-0.5 rounded bg-bg-tertiary">
              {alert.labels.platform}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

interface ActiveAlertsProps {
  alerts: Alert[];
  maxItems?: number;
}

export function ActiveAlerts({ alerts, maxItems = 5 }: ActiveAlertsProps) {
  const displayAlerts = alerts.slice(0, maxItems);
  const hasMore = alerts.length > maxItems;

  // Count by severity
  const criticalCount = alerts.filter((a) => a.severity === 'critical').length;
  const highCount = alerts.filter((a) => a.severity === 'high').length;

  return (
    <Card>
      <CardHeader
        title="Active Alerts"
        subtitle={`${alerts.length} active`}
        action={
          <div className="flex items-center gap-2">
            {criticalCount > 0 && (
              <Badge variant="danger" size="sm">
                {criticalCount} critical
              </Badge>
            )}
            {highCount > 0 && (
              <Badge variant="warning" size="sm">
                {highCount} high
              </Badge>
            )}
          </div>
        }
      />

      <div className="space-y-2">
        {displayAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-text-muted">
            <Bell className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm">No active alerts</p>
            <p className="text-xs mt-1">All systems operating normally</p>
          </div>
        ) : (
          displayAlerts.map((alert, index) => (
            <AlertItem key={alert.id} alert={alert} index={index} />
          ))
        )}
      </div>

      {hasMore && (
        <div className="mt-4 pt-4 border-t border-glass-border">
          <Link href="/alerts">
            <Button
              variant="ghost"
              className="w-full justify-center"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              View all {alerts.length} alerts
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
}

// Mock data for development
export function getMockAlerts(): Alert[] {
  return [
    {
      id: '1',
      ruleId: 'rule-1',
      platformId: 'infrabank',
      serviceId: 'auth-service',
      name: 'High Error Rate - Auth Service',
      description: 'Error rate exceeded 5% threshold for the past 5 minutes',
      severity: 'critical',
      currentValue: 7.5,
      threshold: 5,
      status: 'firing',
      firedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      labels: { platform: 'INFRABANK', service: 'auth-service' },
      annotations: { runbook: 'https://runbooks.infra.io/auth-errors' },
    },
    {
      id: '2',
      ruleId: 'rule-2',
      platformId: 'infrapay',
      serviceId: 'payment-processor',
      name: 'High Latency - Payment Processor',
      description: 'P99 latency exceeded 2000ms',
      severity: 'high',
      currentValue: 2500,
      threshold: 2000,
      status: 'firing',
      firedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      labels: { platform: 'INFRAPAY', service: 'payment-processor' },
      annotations: {},
    },
    {
      id: '3',
      ruleId: 'rule-3',
      platformId: 'infradigital',
      serviceId: 'order-book',
      name: 'Memory Usage Warning',
      description: 'Memory usage at 85%',
      severity: 'medium',
      currentValue: 85,
      threshold: 80,
      status: 'firing',
      firedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      labels: { platform: 'INFRADIGITAL', service: 'order-book' },
      annotations: {},
    },
  ];
}
