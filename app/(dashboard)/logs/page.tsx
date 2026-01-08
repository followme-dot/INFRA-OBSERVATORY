'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Clock,
  AlertCircle,
  Info,
  AlertTriangle,
  XCircle,
  Skull,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { PLATFORMS, LOG_LEVELS } from '@/lib/constants';
import { cn } from '@/lib/utils';

// Mock log data
const generateLogs = (count: number) => {
  const services = PLATFORMS.flatMap((p) => [
    `${p.code}-api-1`,
    `${p.code}-worker-1`,
    `${p.code}-gateway-1`,
  ]);
  const levels = ['debug', 'info', 'warn', 'error', 'fatal'] as const;
  const messages = [
    'Request completed successfully',
    'Database connection established',
    'Cache hit for key user:12345',
    'Processing payment transaction',
    'Authentication token validated',
    'Rate limit exceeded for IP 192.168.1.1',
    'Failed to connect to external service',
    'Timeout waiting for response',
    'Invalid request parameters',
    'Memory usage above threshold',
    'CPU utilization spike detected',
    'New deployment started',
    'Health check passed',
    'Circuit breaker opened',
    'Retry attempt 3/5 for operation',
  ];

  return Array.from({ length: count }, (_, i) => {
    const level = levels[Math.floor(Math.random() * (Math.random() > 0.7 ? 5 : 2))];
    const timestamp = new Date(Date.now() - i * Math.random() * 60000);
    return {
      id: `log-${i}`,
      timestamp: timestamp.toISOString(),
      level,
      service: services[Math.floor(Math.random() * services.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      traceId: Math.random() > 0.5 ? `trace-${Math.random().toString(36).slice(2, 10)}` : null,
      metadata: {
        requestId: `req-${Math.random().toString(36).slice(2, 10)}`,
        userId: Math.random() > 0.5 ? `user-${Math.floor(Math.random() * 10000)}` : null,
        duration: Math.floor(Math.random() * 500),
      },
    };
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const levelIcons: Record<string, React.ReactNode> = {
  debug: <Info className="h-4 w-4 text-gray-500" />,
  info: <Info className="h-4 w-4 text-blue-400" />,
  warn: <AlertTriangle className="h-4 w-4 text-amber-400" />,
  error: <XCircle className="h-4 w-4 text-red-400" />,
  fatal: <Skull className="h-4 w-4 text-red-600" />,
};

const levelColors: Record<string, string> = {
  debug: 'text-gray-500',
  info: 'text-blue-400',
  warn: 'text-amber-400',
  error: 'text-red-400',
  fatal: 'text-red-600 font-bold',
};

export default function LogsPage() {
  const [logs] = useState(() => generateLogs(100));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const [isLive, setIsLive] = useState(false);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevels.length === 0 || selectedLevels.includes(log.level);
    const matchesPlatform = selectedPlatform === 'all' || log.service.startsWith(selectedPlatform);
    return matchesSearch && matchesLevel && matchesPlatform;
  });

  const toggleLogExpansion = (logId: string) => {
    setExpandedLogs((prev) => {
      const next = new Set(prev);
      if (next.has(logId)) {
        next.delete(logId);
      } else {
        next.add(logId);
      }
      return next;
    });
  };

  const toggleLevel = (level: string) => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const stats = {
    total: logs.length,
    errors: logs.filter((l) => l.level === 'error' || l.level === 'fatal').length,
    warnings: logs.filter((l) => l.level === 'warn').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Logs Explorer</h1>
          <p className="text-text-secondary mt-1">
            Search and analyze logs across all platforms
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isLive ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setIsLive(!isLive)}
          >
            <div className={cn('w-2 h-2 rounded-full mr-2', isLive ? 'bg-status-healthy animate-pulse' : 'bg-gray-500')} />
            {isLive ? 'Live' : 'Paused'}
          </Button>
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
              <p className="text-xs text-text-muted">Total Logs</p>
            </div>
            <Clock className="h-8 w-8 text-text-muted opacity-50" />
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-status-critical">{stats.errors}</p>
              <p className="text-xs text-text-muted">Errors</p>
            </div>
            <XCircle className="h-8 w-8 text-status-critical opacity-50" />
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-status-warning">{stats.warnings}</p>
              <p className="text-xs text-text-muted">Warnings</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-status-warning opacity-50" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card padding="md">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search logs by message, service, or trace ID..."
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

            {LOG_LEVELS.map((level) => (
              <Button
                key={level.value}
                variant={selectedLevels.includes(level.value) ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => toggleLevel(level.value)}
              >
                {levelIcons[level.value]}
                <span className="ml-1">{level.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Log Entries */}
      <Card padding="none" className="overflow-hidden">
        <div className="divide-y divide-glass-border">
          {filteredLogs.slice(0, 50).map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.01 }}
              className="hover:bg-glass-bg/50 transition-colors"
            >
              <div
                className="flex items-start gap-3 p-3 cursor-pointer"
                onClick={() => toggleLogExpansion(log.id)}
              >
                <button className="mt-1 text-text-muted hover:text-text-primary transition-colors">
                  {expandedLogs.has(log.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs text-text-muted font-mono">
                      {new Date(log.timestamp).toLocaleString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        fractionalSecondDigits: 3,
                      })}
                    </span>
                    <span className={cn('flex items-center gap-1 text-xs font-medium uppercase', levelColors[log.level])}>
                      {levelIcons[log.level]}
                      {log.level}
                    </span>
                    <Badge variant="default" size="sm">{log.service}</Badge>
                    {log.traceId && (
                      <Badge variant="info" size="sm">{log.traceId}</Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-text-primary font-mono truncate">
                    {log.message}
                  </p>
                </div>
              </div>

              {expandedLogs.has(log.id) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-10 pb-3"
                >
                  <div className="bg-bg-tertiary rounded-lg p-4 font-mono text-xs">
                    <pre className="text-text-secondary overflow-x-auto">
                      {JSON.stringify(
                        {
                          timestamp: log.timestamp,
                          level: log.level,
                          service: log.service,
                          message: log.message,
                          traceId: log.traceId,
                          ...log.metadata,
                        },
                        null,
                        2
                      )}
                    </pre>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {filteredLogs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-text-muted">
            <Search className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg">No logs found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        )}

        {filteredLogs.length > 50 && (
          <div className="p-4 border-t border-glass-border text-center">
            <Button variant="secondary" size="sm">
              Load More ({filteredLogs.length - 50} remaining)
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
