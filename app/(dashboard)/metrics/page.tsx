'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  Download,
  RefreshCw,
  Cpu,
  HardDrive,
  Wifi,
  Database,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { PLATFORMS, TIME_RANGES } from '@/lib/constants';
import { cn, formatNumber } from '@/lib/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
} from 'recharts';

// Generate time series data
const generateTimeSeries = (points: number, baseValue: number, variance: number) => {
  return Array.from({ length: points }, (_, i) => {
    const time = new Date(Date.now() - (points - i) * 60000);
    return {
      time: time.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      value: Math.max(0, baseValue + Math.random() * variance - variance / 2),
    };
  });
};

// Metric categories
const metricCategories = [
  { id: 'system', name: 'System', icon: Cpu },
  { id: 'application', name: 'Application', icon: Activity },
  { id: 'database', name: 'Database', icon: Database },
  { id: 'network', name: 'Network', icon: Wifi },
];

// Available metrics
const availableMetrics = [
  { id: 'cpu_usage', name: 'CPU Usage', unit: '%', category: 'system', baseValue: 45, variance: 30 },
  { id: 'memory_usage', name: 'Memory Usage', unit: '%', category: 'system', baseValue: 65, variance: 15 },
  { id: 'disk_usage', name: 'Disk Usage', unit: '%', category: 'system', baseValue: 55, variance: 5 },
  { id: 'network_in', name: 'Network In', unit: 'MB/s', category: 'network', baseValue: 150, variance: 100 },
  { id: 'network_out', name: 'Network Out', unit: 'MB/s', category: 'network', baseValue: 80, variance: 60 },
  { id: 'request_rate', name: 'Request Rate', unit: 'req/s', category: 'application', baseValue: 2500, variance: 1000 },
  { id: 'error_rate', name: 'Error Rate', unit: '%', category: 'application', baseValue: 0.5, variance: 0.4 },
  { id: 'latency_p50', name: 'Latency (P50)', unit: 'ms', category: 'application', baseValue: 45, variance: 20 },
  { id: 'latency_p99', name: 'Latency (P99)', unit: 'ms', category: 'application', baseValue: 180, variance: 80 },
  { id: 'db_connections', name: 'DB Connections', unit: '', category: 'database', baseValue: 50, variance: 30 },
  { id: 'db_query_time', name: 'Query Time', unit: 'ms', category: 'database', baseValue: 15, variance: 10 },
  { id: 'cache_hit_rate', name: 'Cache Hit Rate', unit: '%', category: 'database', baseValue: 92, variance: 5 },
];

const getTrend = (data: { value: number }[]) => {
  if (data.length < 2) return 'stable';
  const recent = data.slice(-5).reduce((a, b) => a + b.value, 0) / 5;
  const earlier = data.slice(0, 5).reduce((a, b) => a + b.value, 0) / 5;
  const diff = ((recent - earlier) / earlier) * 100;
  if (diff > 5) return 'up';
  if (diff < -5) return 'down';
  return 'stable';
};

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === 'up') return <TrendingUp className="h-4 w-4 text-status-warning" />;
  if (trend === 'down') return <TrendingDown className="h-4 w-4 text-status-healthy" />;
  return <Minus className="h-4 w-4 text-text-muted" />;
};

export default function MetricsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('1h');
  const [pinnedMetrics, setPinnedMetrics] = useState<string[]>(['cpu_usage', 'request_rate', 'latency_p99', 'error_rate']);

  const filteredMetrics = availableMetrics.filter((metric) => {
    const matchesSearch = metric.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || metric.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const togglePinned = (metricId: string) => {
    setPinnedMetrics((prev) =>
      prev.includes(metricId) ? prev.filter((m) => m !== metricId) : [...prev, metricId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Metrics Explorer</h1>
          <p className="text-text-secondary mt-1">
            Monitor system and application metrics across all platforms
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="bg-glass-bg border border-glass-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
          >
            {TIME_RANGES.map((range) => (
              <option key={range.value} value={range.value}>
                Last {range.label}
              </option>
            ))}
          </select>
          <Button variant="secondary" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="primary" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Chart
          </Button>
        </div>
      </div>

      {/* Pinned Metrics Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {pinnedMetrics.map((metricId) => {
          const metric = availableMetrics.find((m) => m.id === metricId);
          if (!metric) return null;
          const data = generateTimeSeries(30, metric.baseValue, metric.variance);
          const currentValue = data[data.length - 1]?.value || 0;
          const trend = getTrend(data);
          const platform = PLATFORMS.find((p) => p.code === selectedPlatform) || PLATFORMS[0];

          return (
            <motion.div
              key={metricId}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              layout
            >
              <Card padding="md">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-text-primary">{metric.name}</h3>
                      <TrendIcon trend={trend} />
                    </div>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-bold text-text-primary">
                        {metric.unit === '%' ? currentValue.toFixed(1) : formatNumber(currentValue)}
                      </span>
                      <span className="text-sm text-text-muted">{metric.unit}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePinned(metricId)}
                  >
                    Unpin
                  </Button>
                </div>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id={`gradient-${metricId}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={platform.color} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={platform.color} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="time" tick={{ fill: '#6b7280', fontSize: 10 }} />
                      <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.9)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                        }}
                        formatter={(value: number) => [`${value.toFixed(2)} ${metric.unit}`, metric.name]}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={platform.color}
                        fill={`url(#gradient-${metricId})`}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Filters */}
      <Card padding="md">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search metrics..."
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

            <Button
              variant={selectedCategory === 'all' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All
            </Button>
            {metricCategories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
              >
                <cat.icon className="h-4 w-4 mr-1" />
                {cat.name}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Available Metrics */}
      <Card padding="md">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Available Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMetrics.map((metric) => {
            const isPinned = pinnedMetrics.includes(metric.id);
            const data = generateTimeSeries(15, metric.baseValue, metric.variance);
            const currentValue = data[data.length - 1]?.value || 0;
            const trend = getTrend(data);
            const CategoryIcon = metricCategories.find((c) => c.id === metric.category)?.icon || Activity;

            return (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                  'p-4 rounded-lg border transition-all cursor-pointer',
                  isPinned
                    ? 'border-accent-primary bg-accent-primary/5'
                    : 'border-glass-border hover:border-accent-primary/50 hover:bg-glass-bg/50'
                )}
                onClick={() => togglePinned(metric.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CategoryIcon className="h-4 w-4 text-text-muted" />
                    <span className="text-sm font-medium text-text-primary">{metric.name}</span>
                  </div>
                  <TrendIcon trend={trend} />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-text-primary">
                    {metric.unit === '%' ? currentValue.toFixed(1) : formatNumber(currentValue)}
                  </span>
                  <span className="text-xs text-text-muted">{metric.unit}</span>
                </div>
                <div className="h-12 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={isPinned ? '#00d4ff' : '#6b7280'}
                        strokeWidth={1.5}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <Badge variant="default" size="sm">{metric.category}</Badge>
                  {isPinned && <Badge variant="success" size="sm">Pinned</Badge>}
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
