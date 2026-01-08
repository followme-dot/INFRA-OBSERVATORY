'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Cloud,
  Server,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  Calendar,
  Download,
  Filter,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
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
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

// Generate cost data
const generateCostTrend = (days: number, baseValue: number) => {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(Date.now() - (days - i) * 86400000);
    return {
      date: date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
      cost: baseValue + (Math.random() - 0.3) * baseValue * 0.2,
    };
  });
};

// Mock cost data by platform
const platformCosts = PLATFORMS.map((platform) => ({
  ...platform,
  currentMonth: Math.floor(Math.random() * 50000) + 10000,
  lastMonth: Math.floor(Math.random() * 50000) + 10000,
  forecast: Math.floor(Math.random() * 60000) + 12000,
  breakdown: {
    compute: Math.floor(Math.random() * 20000) + 5000,
    storage: Math.floor(Math.random() * 10000) + 2000,
    network: Math.floor(Math.random() * 5000) + 1000,
    database: Math.floor(Math.random() * 15000) + 3000,
    other: Math.floor(Math.random() * 5000) + 500,
  },
}));

const resourceTypes = [
  { name: 'Compute', icon: Cpu, color: '#00d4ff' },
  { name: 'Storage', icon: HardDrive, color: '#7c3aed' },
  { name: 'Network', icon: Wifi, color: '#10b981' },
  { name: 'Database', icon: Database, color: '#f59e0b' },
  { name: 'Other', icon: Cloud, color: '#6b7280' },
];

export default function CostsPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [timeRange, setTimeRange] = useState('30d');

  const totalCurrentMonth = platformCosts.reduce((a, b) => a + b.currentMonth, 0);
  const totalLastMonth = platformCosts.reduce((a, b) => a + b.lastMonth, 0);
  const totalForecast = platformCosts.reduce((a, b) => a + b.forecast, 0);
  const monthOverMonthChange = ((totalCurrentMonth - totalLastMonth) / totalLastMonth) * 100;

  const costTrendData = generateCostTrend(30, totalCurrentMonth / 30);

  const pieData = resourceTypes.map((type) => ({
    name: type.name,
    value: platformCosts.reduce(
      (a, b) => a + b.breakdown[type.name.toLowerCase() as keyof typeof b.breakdown],
      0
    ),
    color: type.color,
  }));

  const barData = platformCosts.slice(0, 6).map((p) => ({
    name: p.name.replace('INFRA', '').trim(),
    current: p.currentMonth,
    last: p.lastMonth,
    color: p.color,
  }));

  const filteredPlatforms =
    selectedPlatform === 'all'
      ? platformCosts
      : platformCosts.filter((p) => p.code === selectedPlatform);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Cost Attribution</h1>
          <p className="text-text-secondary mt-1">
            Infrastructure costs breakdown by platform and resource
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="bg-glass-bg border border-glass-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-accent-primary/10 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-accent-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">
                ${formatNumber(totalCurrentMonth)}
              </p>
              <p className="text-xs text-text-muted">Current Month</p>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-status-info/10 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-status-info" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">
                ${formatNumber(totalLastMonth)}
              </p>
              <p className="text-xs text-text-muted">Last Month</p>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'w-12 h-12 rounded-lg flex items-center justify-center',
                monthOverMonthChange > 0 ? 'bg-status-warning/10' : 'bg-status-healthy/10'
              )}
            >
              {monthOverMonthChange > 0 ? (
                <TrendingUp className="h-6 w-6 text-status-warning" />
              ) : (
                <TrendingDown className="h-6 w-6 text-status-healthy" />
              )}
            </div>
            <div>
              <p
                className={cn(
                  'text-2xl font-bold',
                  monthOverMonthChange > 0 ? 'text-status-warning' : 'text-status-healthy'
                )}
              >
                {monthOverMonthChange > 0 ? '+' : ''}{monthOverMonthChange.toFixed(1)}%
              </p>
              <p className="text-xs text-text-muted">Month/Month</p>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-accent-secondary/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-accent-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">
                ${formatNumber(totalForecast)}
              </p>
              <p className="text-xs text-text-muted">Forecast</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Cost Trend */}
        <Card padding="md" className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Cost Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={costTrendData}>
                <defs>
                  <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} />
                <YAxis
                  tick={{ fill: '#6b7280', fontSize: 10 }}
                  tickFormatter={(value) => `$${formatNumber(value)}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`$${formatNumber(value)}`, 'Cost']}
                />
                <Area
                  type="monotone"
                  dataKey="cost"
                  stroke="#00d4ff"
                  fill="url(#costGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Cost by Resource Type */}
        <Card padding="md">
          <h3 className="text-lg font-semibold text-text-primary mb-4">By Resource Type</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`$${formatNumber(value)}`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {pieData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-1 text-xs">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-text-muted">{entry.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Platform Comparison */}
      <Card padding="md">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Platform Comparison</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 10 }} />
              <YAxis
                tick={{ fill: '#6b7280', fontSize: 10 }}
                tickFormatter={(value) => `$${formatNumber(value)}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [`$${formatNumber(value)}`, '']}
              />
              <Legend />
              <Bar dataKey="current" name="Current Month" fill="#00d4ff" radius={[4, 4, 0, 0]} />
              <Bar dataKey="last" name="Last Month" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Platform Filter */}
      <Card padding="md">
        <div className="flex items-center gap-4 mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Cost by Platform</h3>
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlatforms.map((platform, index) => {
            const change = ((platform.currentMonth - platform.lastMonth) / platform.lastMonth) * 100;

            return (
              <motion.div
                key={platform.code}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card padding="md" className="border-l-4" style={{ borderLeftColor: platform.color }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-text-primary">{platform.name}</p>
                      <p className="text-xs text-text-muted">{platform.description}</p>
                    </div>
                    <Badge
                      size="sm"
                      variant={change > 10 ? 'danger' : change > 0 ? 'warning' : 'success'}
                    >
                      {change > 0 ? '+' : ''}{change.toFixed(1)}%
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-muted">Current Month</span>
                      <span className="font-medium text-text-primary">
                        ${formatNumber(platform.currentMonth)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-muted">Forecast</span>
                      <span className="font-medium text-text-secondary">
                        ${formatNumber(platform.forecast)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-glass-border">
                    <div className="flex gap-1">
                      {Object.entries(platform.breakdown).map(([key, value]) => {
                        const total = Object.values(platform.breakdown).reduce((a, b) => a + b, 0);
                        const percent = (value / total) * 100;
                        const resource = resourceTypes.find(
                          (r) => r.name.toLowerCase() === key
                        );
                        return (
                          <div
                            key={key}
                            className="h-2 rounded-full"
                            style={{
                              width: `${percent}%`,
                              backgroundColor: resource?.color || '#6b7280',
                            }}
                            title={`${resource?.name || key}: $${formatNumber(value)}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
