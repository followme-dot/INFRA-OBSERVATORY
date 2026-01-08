'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  ExternalLink,
  GitBranch,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { PLATFORMS } from '@/lib/constants';
import { cn, formatNumber } from '@/lib/utils';

// Mock trace data
const generateTraces = (count: number) => {
  const operations = [
    'POST /api/v1/payments',
    'GET /api/v1/users/:id',
    'PUT /api/v1/accounts',
    'DELETE /api/v1/sessions',
    'POST /api/v1/transfers',
    'GET /api/v1/transactions',
    'POST /api/v1/auth/login',
    'GET /api/v1/balance',
  ];

  return Array.from({ length: count }, (_, i) => {
    const platform = PLATFORMS[Math.floor(Math.random() * PLATFORMS.length)];
    const duration = Math.floor(Math.random() * 500) + 20;
    const spanCount = Math.floor(Math.random() * 8) + 3;
    const hasError = Math.random() > 0.85;
    const timestamp = new Date(Date.now() - i * Math.random() * 300000);

    return {
      id: `trace-${Math.random().toString(36).slice(2, 10)}`,
      timestamp: timestamp.toISOString(),
      operation: operations[Math.floor(Math.random() * operations.length)],
      platform: platform.code,
      platformName: platform.name,
      platformColor: platform.color,
      duration,
      spanCount,
      status: hasError ? 'error' : 'success',
      services: [`${platform.code}-gateway`, `${platform.code}-api`, `${platform.code}-db`].slice(
        0,
        Math.floor(Math.random() * 3) + 1
      ),
      spans: Array.from({ length: spanCount }, (_, j) => ({
        id: `span-${j}`,
        name: j === 0 ? 'HTTP Request' : j === 1 ? 'Auth Validation' : j === 2 ? 'Database Query' : `Process ${j}`,
        service: `${platform.code}-${j === 0 ? 'gateway' : j === 1 ? 'auth' : j === 2 ? 'db' : 'worker'}`,
        duration: Math.floor(duration * (0.1 + Math.random() * 0.3)),
        offset: Math.floor((j / spanCount) * duration * 0.6),
        status: hasError && j === spanCount - 1 ? 'error' : 'success',
      })),
    };
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export default function TracesPage() {
  const [traces] = useState(() => generateTraces(50));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [expandedTraces, setExpandedTraces] = useState<Set<string>>(new Set());
  const [minDuration, setMinDuration] = useState<number>(0);

  const filteredTraces = traces.filter((trace) => {
    const matchesSearch =
      trace.operation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trace.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = selectedPlatform === 'all' || trace.platform === selectedPlatform;
    const matchesStatus = selectedStatus === 'all' || trace.status === selectedStatus;
    const matchesDuration = trace.duration >= minDuration;
    return matchesSearch && matchesPlatform && matchesStatus && matchesDuration;
  });

  const toggleTraceExpansion = (traceId: string) => {
    setExpandedTraces((prev) => {
      const next = new Set(prev);
      if (next.has(traceId)) {
        next.delete(traceId);
      } else {
        next.add(traceId);
      }
      return next;
    });
  };

  const stats = {
    total: traces.length,
    errors: traces.filter((t) => t.status === 'error').length,
    avgDuration: Math.round(traces.reduce((a, b) => a + b.duration, 0) / traces.length),
    p99Duration: Math.round(
      [...traces].sort((a, b) => b.duration - a.duration)[Math.floor(traces.length * 0.01)]?.duration || 0
    ),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Distributed Traces</h1>
          <p className="text-text-secondary mt-1">
            Analyze request flows across services
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center">
              <GitBranch className="h-5 w-5 text-accent-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
              <p className="text-xs text-text-muted">Total Traces</p>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-status-critical/10 flex items-center justify-center">
              <XCircle className="h-5 w-5 text-status-critical" />
            </div>
            <div>
              <p className="text-2xl font-bold text-status-critical">{stats.errors}</p>
              <p className="text-xs text-text-muted">Errors</p>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-status-info/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-status-info" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{stats.avgDuration}ms</p>
              <p className="text-xs text-text-muted">Avg Duration</p>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-status-warning/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-status-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{stats.p99Duration}ms</p>
              <p className="text-xs text-text-muted">P99 Duration</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card padding="md">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by trace ID or operation..."
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

            <select
              className="bg-glass-bg border border-glass-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="error">Error</option>
            </select>

            <Input
              type="number"
              placeholder="Min duration (ms)"
              className="w-40"
              value={minDuration || ''}
              onChange={(e) => setMinDuration(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
      </Card>

      {/* Traces List */}
      <Card padding="none" className="overflow-hidden">
        <div className="divide-y divide-glass-border">
          {filteredTraces.map((trace, index) => (
            <motion.div
              key={trace.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.02 }}
            >
              <div
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-glass-bg/50 transition-colors"
                onClick={() => toggleTraceExpansion(trace.id)}
              >
                <button className="text-text-muted hover:text-text-primary transition-colors">
                  {expandedTraces.has(trace.id) ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    {trace.status === 'error' ? (
                      <XCircle className="h-5 w-5 text-status-critical" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-status-healthy" />
                    )}
                    <span className="font-mono text-sm text-text-primary">{trace.operation}</span>
                    <Badge
                      size="sm"
                      style={{ backgroundColor: `${trace.platformColor}20`, color: trace.platformColor }}
                    >
                      {trace.platformName}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-text-muted">
                    <span className="font-mono">{trace.id}</span>
                    <span>•</span>
                    <span>{new Date(trace.timestamp).toLocaleString('es-ES')}</span>
                    <span>•</span>
                    <span>{trace.spanCount} spans</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={cn(
                      'text-lg font-bold',
                      trace.duration > 300 ? 'text-status-warning' : 'text-text-primary'
                    )}>
                      {trace.duration}ms
                    </p>
                    <p className="text-xs text-text-muted">Duration</p>
                  </div>
                </div>
              </div>

              {/* Expanded Trace View */}
              {expandedTraces.has(trace.id) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="px-4 pb-4 bg-bg-tertiary/50"
                >
                  <div className="p-4 rounded-lg border border-glass-border">
                    <h4 className="text-sm font-medium text-text-primary mb-4">Span Timeline</h4>
                    <div className="space-y-2">
                      {trace.spans.map((span, i) => (
                        <div key={span.id} className="flex items-center gap-3">
                          <div className="w-32 text-xs text-text-muted truncate">{span.service}</div>
                          <div className="flex-1 h-6 bg-bg-secondary rounded relative">
                            <div
                              className={cn(
                                'absolute h-full rounded',
                                span.status === 'error' ? 'bg-status-critical' : 'bg-accent-primary'
                              )}
                              style={{
                                left: `${(span.offset / trace.duration) * 100}%`,
                                width: `${Math.max((span.duration / trace.duration) * 100, 2)}%`,
                              }}
                            />
                            <div
                              className="absolute top-1/2 -translate-y-1/2 text-xs text-text-primary px-1 truncate"
                              style={{
                                left: `${(span.offset / trace.duration) * 100 + 1}%`,
                              }}
                            >
                              {span.name}
                            </div>
                          </div>
                          <div className="w-16 text-xs text-text-muted text-right">{span.duration}ms</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <Button variant="secondary" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Full Trace
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {filteredTraces.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-text-muted">
            <GitBranch className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg">No traces found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        )}
      </Card>
    </div>
  );
}
