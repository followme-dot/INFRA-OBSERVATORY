'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
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
  AlertTriangle,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { StatusDot, StatusBadge } from '@/components/ui/StatusDot';
import { MiniHealthScore } from '@/components/overview/HealthScore';
import { PLATFORMS } from '@/lib/constants';
import { cn, formatNumber } from '@/lib/utils';
import type { PlatformOverview } from '@/types';

// Platform icons mapping
const platformIcons: Record<string, React.ReactNode> = {
  infrabank: <Building2 className="h-5 w-5" />,
  infrapay: <CreditCard className="h-5 w-5" />,
  infravault: <Vault className="h-5 w-5" />,
  infradigital: <Coins className="h-5 w-5" />,
  infracoinn: <Gem className="h-5 w-5" />,
  infradevtech: <Code className="h-5 w-5" />,
  infraforge: <Hammer className="h-5 w-5" />,
  infrainsurance: <Shield className="h-5 w-5" />,
  infraschool: <GraduationCap className="h-5 w-5" />,
};

interface PlatformCardProps {
  platform: PlatformOverview;
  index: number;
}

function PlatformCard({ platform, index }: PlatformCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/platforms/${platform.code}`}>
        <Card
          hoverable
          className="group relative overflow-hidden"
          padding="none"
        >
          {/* Background Glow */}
          <div
            className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"
            style={{ backgroundColor: platform.color }}
          />

          <div className="p-4 relative">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: `${platform.color}20`,
                    color: platform.color,
                  }}
                >
                  {platformIcons[platform.code]}
                </div>

                {/* Name & Status */}
                <div>
                  <h3 className="font-semibold text-text-primary group-hover:text-accent-primary transition-colors">
                    {platform.name}
                  </h3>
                  <StatusBadge
                    status={platform.status}
                    size="sm"
                    showLabel={false}
                  />
                </div>
              </div>

              {/* Arrow */}
              <ArrowUpRight className="h-5 w-5 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-2 rounded-lg bg-bg-tertiary/50">
                <p className="text-xs text-text-muted mb-1">Services</p>
                <p className="text-lg font-semibold text-text-primary">
                  {platform.serviceCount}
                  <span className="text-xs text-status-healthy ml-1">
                    {platform.healthyServiceCount} healthy
                  </span>
                </p>
              </div>
              <div className="p-2 rounded-lg bg-bg-tertiary/50">
                <p className="text-xs text-text-muted mb-1">Alerts</p>
                <p className="text-lg font-semibold text-text-primary">
                  {platform.alertCount > 0 ? (
                    <span className="text-status-warning">
                      {platform.alertCount}
                    </span>
                  ) : (
                    <span className="text-status-healthy">0</span>
                  )}
                </p>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Activity className="h-3 w-3 text-text-muted" />
                  <span className="text-text-secondary">
                    {formatNumber(platform.requestsPerSecond)}/s
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-text-muted">Err:</span>
                  <span
                    className={cn(
                      platform.errorRate > 1
                        ? 'text-status-critical'
                        : platform.errorRate > 0.1
                        ? 'text-status-warning'
                        : 'text-status-healthy'
                    )}
                  >
                    {platform.errorRate.toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* Health Score */}
              <MiniHealthScore score={platform.healthScore} />
            </div>
          </div>

          {/* Criticality Indicator */}
          <div
            className="h-1 w-full"
            style={{
              background: `linear-gradient(90deg, ${platform.color}50, ${platform.color}20)`,
            }}
          />
        </Card>
      </Link>
    </motion.div>
  );
}

interface PlatformGridProps {
  platforms: PlatformOverview[];
}

export function PlatformGrid({ platforms }: PlatformGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {platforms.map((platform, index) => (
        <PlatformCard key={platform.id} platform={platform} index={index} />
      ))}
    </div>
  );
}

// Mock data for development
export function getMockPlatforms(): PlatformOverview[] {
  return PLATFORMS.map((p, i) => ({
    id: p.id,
    code: p.code,
    name: p.name,
    description: p.description,
    color: p.color,
    icon: p.icon,
    status: i === 2 ? 'warning' : i === 5 ? 'degraded' : 'healthy',
    healthScore: i === 2 ? 78 : i === 5 ? 85 : 95 + Math.floor(Math.random() * 5),
    lastHealthCheck: new Date().toISOString(),
    isActive: true,
    criticality: p.criticality,
    defaultAvailabilityTarget: 0.999,
    defaultLatencyTargetMs: 500,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    serviceCount: parseInt(p.estimatedServices.split('-')[0]) + Math.floor(Math.random() * 10),
    healthyServiceCount: parseInt(p.estimatedServices.split('-')[0]),
    alertCount: i === 2 ? 3 : i === 5 ? 1 : 0,
    requestsPerSecond: Math.floor(Math.random() * 5000) + 500,
    errorRate: i === 2 ? 1.5 : Math.random() * 0.5,
    p99Latency: Math.floor(Math.random() * 200) + 100,
  }));
}
