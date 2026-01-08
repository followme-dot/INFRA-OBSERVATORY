import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number, decimals: number = 2): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(decimals)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(decimals)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(decimals)}K`;
  }
  return value.toFixed(decimals);
}

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

export function formatDuration(ms: number): string {
  if (ms < 1) return `${(ms * 1000).toFixed(2)}μs`;
  if (ms < 1000) return `${ms.toFixed(2)}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
  if (ms < 3600000) return `${(ms / 60000).toFixed(2)}m`;
  return `${(ms / 3600000).toFixed(2)}h`;
}

export function formatPercentage(value: number, decimals: number = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function formatUptime(percentage: number): string {
  const nines = Math.floor(-Math.log10(1 - percentage));
  return `${(percentage * 100).toFixed(nines + 1)}%`;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    healthy: 'status-healthy',
    ok: 'status-healthy',
    up: 'status-healthy',
    degraded: 'status-warning',
    warning: 'status-warning',
    critical: 'status-critical',
    error: 'status-critical',
    down: 'status-critical',
    unknown: 'status-unknown',
    maintenance: 'status-maintenance',
  };
  return colors[status.toLowerCase()] || 'status-unknown';
}

export function getSeverityColor(severity: string): string {
  const colors: Record<string, string> = {
    info: 'severity-info',
    low: 'severity-low',
    medium: 'severity-medium',
    high: 'severity-high',
    critical: 'severity-critical',
  };
  return colors[severity.toLowerCase()] || 'severity-info';
}

export function getLogLevelColor(level: string): string {
  const colors: Record<string, string> = {
    debug: 'text-gray-500',
    info: 'text-blue-400',
    warn: 'text-amber-400',
    warning: 'text-amber-400',
    error: 'text-red-400',
    fatal: 'text-red-600 bg-red-500/10',
    critical: 'text-red-600 bg-red-500/10',
  };
  return colors[level.toLowerCase()] || 'text-gray-400';
}

export function relativeTime(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return then.toLocaleDateString();
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export const PLATFORM_COLORS: Record<string, string> = {
  infrabank: '#00d4ff',
  infrapay: '#7c3aed',
  infravault: '#10b981',
  infradigital: '#f59e0b',
  infracoinn: '#ec4899',
  infradevtech: '#3b82f6',
  infraforge: '#ef4444',
  infrainsurance: '#06b6d4',
  infraschool: '#8b5cf6',
};

export const CHART_COLORS = [
  '#00d4ff',
  '#7c3aed',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#ec4899',
  '#3b82f6',
  '#14b8a6',
  '#f97316',
  '#8b5cf6',
  '#06b6d4',
  '#84cc16',
];
