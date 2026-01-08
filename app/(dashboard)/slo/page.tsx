'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  Plus,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PLATFORMS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Generate error budget data
const generateErrorBudgetData = (points: number, remaining: number) => {
  const data = [];
  let current = 100;
  for (let i = 0; i < points; i++) {
    const time = new Date(Date.now() - (points - i) * 86400000);
    const consumption = (100 - remaining) / points + (Math.random() - 0.5) * 2;
    current = Math.max(0, current - consumption);
    data.push({
      date: time.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
      value: Math.max(remaining, current),
    });
  }
  return data;
};

// Mock SLO data
const generateSLOs = () => {
  return PLATFORMS.slice(0, 6).flatMap((platform) => [
    {
      id: `${platform.code}-availability`,
      name: `${platform.name} - Availability`,
      platform: platform.code,
      platformName: platform.name,
      platformColor: platform.color,
      type: 'availability',
      target: 99.9,
      current: 99.85 + Math.random() * 0.2,
      window: '30d',
      errorBudgetRemaining: Math.random() * 80 + 20,
      status: Math.random() > 0.2 ? 'healthy' : 'at_risk',
      burnRate: Math.random() * 2,
    },
    {
      id: `${platform.code}-latency`,
      name: `${platform.name} - Latency P99`,
      platform: platform.code,
      platformName: platform.name,
      platformColor: platform.color,
      type: 'latency',
      target: 200,
      current: 150 + Math.random() * 100,
      window: '30d',
      errorBudgetRemaining: Math.random() * 80 + 20,
      status: Math.random() > 0.2 ? 'healthy' : 'at_risk',
      burnRate: Math.random() * 2,
    },
  ]);
};

export default function SLOPage() {
  const [slos] = useState(() => generateSLOs());
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredSLOs = slos.filter((slo) => {
    const matchesPlatform = selectedPlatform === 'all' || slo.platform === selectedPlatform;
    const matchesType = selectedType === 'all' || slo.type === selectedType;
    return matchesPlatform && matchesType;
  });

  const stats = {
    total: slos.length,
    healthy: slos.filter((s) => s.status === 'healthy').length,
    atRisk: slos.filter((s) => s.status === 'at_risk').length,
    breached: slos.filter((s) => s.status === 'breached').length,
    avgBudgetRemaining: Math.round(slos.reduce((a, b) => a + b.errorBudgetRemaining, 0) / slos.length),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">SLO Dashboard</h1>
          <p className="text-text-secondary mt-1">
            Service Level Objectives and Error Budgets
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Manage SLOs
          </Button>
          <Button variant="primary" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create SLO
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center">
              <Target className="h-5 w-5 text-accent-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
              <p className="text-xs text-text-muted">Total SLOs</p>
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
              <p className="text-2xl font-bold text-status-warning">{stats.atRisk}</p>
              <p className="text-xs text-text-muted">At Risk</p>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-status-critical/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-status-critical" />
            </div>
            <div>
              <p className="text-2xl font-bold text-status-critical">{stats.breached}</p>
              <p className="text-xs text-text-muted">Breached</p>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-secondary/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-accent-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{stats.avgBudgetRemaining}%</p>
              <p className="text-xs text-text-muted">Avg Budget</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card padding="md">
        <div className="flex flex-wrap gap-4">
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

          <div className="flex gap-2">
            <Button
              variant={selectedType === 'all' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSelectedType('all')}
            >
              All Types
            </Button>
            <Button
              variant={selectedType === 'availability' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSelectedType('availability')}
            >
              Availability
            </Button>
            <Button
              variant={selectedType === 'latency' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSelectedType('latency')}
            >
              Latency
            </Button>
          </div>
        </div>
      </Card>

      {/* SLO Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredSLOs.map((slo, index) => {
          const errorBudgetData = generateErrorBudgetData(30, slo.errorBudgetRemaining);
          const isAtRisk = slo.status === 'at_risk';
          const isBreached = slo.status === 'breached';

          return (
            <motion.div
              key={slo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                padding="md"
                className={cn(
                  'border-l-4 transition-all hover:bg-glass-bg/80',
                  isBreached
                    ? 'border-status-critical'
                    : isAtRisk
                    ? 'border-status-warning'
                    : 'border-status-healthy'
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge
                        size="sm"
                        style={{ backgroundColor: `${slo.platformColor}20`, color: slo.platformColor }}
                      >
                        {slo.platformName}
                      </Badge>
                      <Badge variant={slo.type === 'availability' ? 'info' : 'warning'} size="sm">
                        {slo.type}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-text-primary mt-2">{slo.name}</h3>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-text-muted">Target</p>
                    <p className="text-lg font-bold text-text-primary">
                      {slo.type === 'availability' ? `${slo.target}%` : `${slo.target}ms`}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Current</p>
                    <p className={cn(
                      'text-lg font-bold',
                      slo.type === 'availability'
                        ? slo.current >= slo.target ? 'text-status-healthy' : 'text-status-critical'
                        : slo.current <= slo.target ? 'text-status-healthy' : 'text-status-critical'
                    )}>
                      {slo.type === 'availability' ? `${slo.current.toFixed(2)}%` : `${Math.round(slo.current)}ms`}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Error Budget</p>
                    <p className={cn(
                      'text-lg font-bold',
                      slo.errorBudgetRemaining > 50
                        ? 'text-status-healthy'
                        : slo.errorBudgetRemaining > 20
                        ? 'text-status-warning'
                        : 'text-status-critical'
                    )}>
                      {slo.errorBudgetRemaining.toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={errorBudgetData}>
                      <defs>
                        <linearGradient id={`budget-${slo.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor={isBreached ? '#ef4444' : isAtRisk ? '#f59e0b' : '#10b981'}
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor={isBreached ? '#ef4444' : isAtRisk ? '#f59e0b' : '#10b981'}
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} />
                      <YAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.9)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                        }}
                        formatter={(value: number) => [`${value.toFixed(1)}%`, 'Budget Remaining']}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={isBreached ? '#ef4444' : isAtRisk ? '#f59e0b' : '#10b981'}
                        fill={`url(#budget-${slo.id})`}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-glass-border text-xs text-text-muted">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {slo.window} window
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Burn rate: {slo.burnRate.toFixed(2)}x
                  </span>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredSLOs.length === 0 && (
        <Card padding="lg" className="text-center">
          <Target className="h-12 w-12 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary">No SLOs found</h3>
          <p className="text-text-muted mt-1">Try adjusting your filters or create a new SLO</p>
        </Card>
      )}
    </div>
  );
}
