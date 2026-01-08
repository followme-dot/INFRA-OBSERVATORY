'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { format } from 'date-fns';
import { Card, CardHeader } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { CHART_COLORS } from '@/lib/utils';

interface DataPoint {
  timestamp: string | number;
  [key: string]: string | number;
}

interface TimeSeriesChartProps {
  title?: string;
  subtitle?: string;
  data: DataPoint[];
  series: {
    dataKey: string;
    name: string;
    color?: string;
  }[];
  type?: 'line' | 'area';
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  className?: string;
  formatValue?: (value: number) => string;
  action?: React.ReactNode;
}

function CustomTooltip({ active, payload, label, formatValue }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="glass-panel-sm p-3 min-w-[150px]">
      <p className="text-xs text-text-muted mb-2">
        {format(new Date(label), 'MMM d, HH:mm:ss')}
      </p>
      <div className="space-y-1.5">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-text-secondary">{entry.name}</span>
            </div>
            <span className="text-xs font-medium text-text-primary">
              {formatValue ? formatValue(entry.value) : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TimeSeriesChart({
  title,
  subtitle,
  data,
  series,
  type = 'line',
  height = 300,
  showLegend = true,
  showGrid = true,
  className,
  formatValue,
  action,
}: TimeSeriesChartProps) {
  const coloredSeries = useMemo(
    () =>
      series.map((s, i) => ({
        ...s,
        color: s.color || CHART_COLORS[i % CHART_COLORS.length],
      })),
    [series]
  );

  const ChartComponent = type === 'area' ? AreaChart : LineChart;
  const DataComponent = type === 'area' ? Area : Line;

  const content = (
    <ResponsiveContainer width="100%" height={height}>
      <ChartComponent
        data={data}
        margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
      >
        {showGrid && (
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(0, 212, 255, 0.1)"
            vertical={false}
          />
        )}

        <XAxis
          dataKey="timestamp"
          stroke="#6e7681"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => format(new Date(value), 'HH:mm')}
        />

        <YAxis
          stroke="#6e7681"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatValue}
        />

        <Tooltip
          content={<CustomTooltip formatValue={formatValue} />}
          cursor={{
            stroke: 'rgba(0, 212, 255, 0.3)',
            strokeWidth: 1,
          }}
        />

        {showLegend && (
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{
              paddingTop: 16,
              fontSize: 12,
              color: '#8b949e',
            }}
          />
        )}

        {coloredSeries.map((s) =>
          type === 'area' ? (
            <Area
              key={s.dataKey}
              type="monotone"
              dataKey={s.dataKey}
              name={s.name}
              stroke={s.color}
              strokeWidth={2}
              fill={`url(#gradient-${s.dataKey})`}
              dot={false}
              activeDot={{
                r: 4,
                strokeWidth: 2,
                fill: '#0a0a0f',
              }}
            />
          ) : (
            <Line
              key={s.dataKey}
              type="monotone"
              dataKey={s.dataKey}
              name={s.name}
              stroke={s.color}
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 4,
                strokeWidth: 2,
                fill: '#0a0a0f',
              }}
            />
          )
        )}

        {/* Gradient definitions for area charts */}
        <defs>
          {coloredSeries.map((s) => (
            <linearGradient
              key={`gradient-${s.dataKey}`}
              id={`gradient-${s.dataKey}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={s.color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={s.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
      </ChartComponent>
    </ResponsiveContainer>
  );

  if (!title) {
    return <div className={className}>{content}</div>;
  }

  return (
    <Card className={className}>
      <CardHeader title={title} subtitle={subtitle} action={action} />
      {content}
    </Card>
  );
}

// Generate mock time series data
export function generateMockTimeSeriesData(
  points: number = 24,
  series: string[] = ['value']
): DataPoint[] {
  const now = Date.now();
  const interval = (60 * 60 * 1000) / (points / 24); // Spread over 1 hour

  return Array.from({ length: points }, (_, i) => {
    const point: DataPoint = {
      timestamp: now - (points - i - 1) * interval,
    };

    series.forEach((key, seriesIndex) => {
      // Generate smooth random data
      const base = 50 + seriesIndex * 20;
      const variation = Math.sin(i / 3) * 20 + Math.random() * 10;
      point[key] = Math.max(0, base + variation);
    });

    return point;
  });
}
