'use client';

import { cn } from '@/lib/utils';

interface StatusDotProps {
  status: 'healthy' | 'warning' | 'critical' | 'unknown' | 'maintenance' | 'degraded';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  className?: string;
}

export function StatusDot({
  status,
  size = 'md',
  pulse = true,
  className,
}: StatusDotProps) {
  const normalizedStatus = status === 'degraded' ? 'warning' : status;

  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  };

  const colors = {
    healthy: 'bg-status-healthy',
    warning: 'bg-status-warning',
    critical: 'bg-status-critical',
    unknown: 'bg-status-unknown',
    maintenance: 'bg-status-maintenance',
  };

  const glows = {
    healthy: 'shadow-[0_0_8px_rgba(16,185,129,0.6)]',
    warning: 'shadow-[0_0_8px_rgba(245,158,11,0.6)]',
    critical: 'shadow-[0_0_8px_rgba(239,68,68,0.6)]',
    unknown: 'shadow-[0_0_6px_rgba(107,114,128,0.4)]',
    maintenance: 'shadow-[0_0_8px_rgba(139,92,246,0.6)]',
  };

  const pulseAnimations = {
    healthy: 'animate-pulse-slow',
    warning: 'animate-pulse-slow',
    critical: 'animate-pulse-fast',
    unknown: '',
    maintenance: 'animate-pulse-slow',
  };

  return (
    <span
      className={cn(
        'inline-block rounded-full',
        sizes[size],
        colors[normalizedStatus],
        glows[normalizedStatus],
        pulse && pulseAnimations[normalizedStatus],
        className
      )}
    />
  );
}

interface StatusBadgeProps {
  status: 'healthy' | 'warning' | 'critical' | 'unknown' | 'maintenance' | 'degraded';
  size?: 'sm' | 'md';
  showLabel?: boolean;
  className?: string;
}

export function StatusBadge({
  status,
  size = 'md',
  showLabel = true,
  className,
}: StatusBadgeProps) {
  const normalizedStatus = status === 'degraded' ? 'warning' : status;

  const labels = {
    healthy: 'Healthy',
    warning: 'Warning',
    critical: 'Critical',
    unknown: 'Unknown',
    maintenance: 'Maintenance',
  };

  const bgColors = {
    healthy: 'bg-status-healthy/10',
    warning: 'bg-status-warning/10',
    critical: 'bg-status-critical/10',
    unknown: 'bg-status-unknown/10',
    maintenance: 'bg-status-maintenance/10',
  };

  const textColors = {
    healthy: 'text-status-healthy',
    warning: 'text-status-warning',
    critical: 'text-status-critical',
    unknown: 'text-status-unknown',
    maintenance: 'text-status-maintenance',
  };

  const sizes_map = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        bgColors[normalizedStatus],
        textColors[normalizedStatus],
        sizes_map[size],
        className
      )}
    >
      <StatusDot status={status} size="sm" />
      {showLabel && labels[normalizedStatus]}
    </span>
  );
}
