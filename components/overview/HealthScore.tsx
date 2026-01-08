'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HealthScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

export function HealthScore({
  score,
  size = 'md',
  showLabel = true,
  animated = true,
}: HealthScoreProps) {
  const getColor = (score: number) => {
    if (score >= 90) return { color: '#10b981', label: 'Healthy' };
    if (score >= 70) return { color: '#f59e0b', label: 'Degraded' };
    if (score >= 50) return { color: '#f97316', label: 'Warning' };
    return { color: '#ef4444', label: 'Critical' };
  };

  const { color, label } = getColor(score);

  const sizes = {
    sm: { container: 'w-24 h-24', stroke: 8, text: 'text-xl', label: 'text-xs' },
    md: { container: 'w-40 h-40', stroke: 10, text: 'text-3xl', label: 'text-sm' },
    lg: { container: 'w-56 h-56', stroke: 12, text: 'text-5xl', label: 'text-base' },
  };

  const { container, stroke, text, label: labelSize } = sizes[size];

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={cn('relative flex items-center justify-center', container)}>
      {/* Background Glow */}
      <div
        className="absolute inset-4 rounded-full blur-xl opacity-30"
        style={{ backgroundColor: color }}
      />

      {/* SVG Circle */}
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
        {/* Background Circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-bg-tertiary"
        />

        {/* Progress Circle */}
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: animated ? strokeDashoffset : strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{
            filter: `drop-shadow(0 0 6px ${color})`,
          }}
        />
      </svg>

      {/* Center Content */}
      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <span className={cn('font-bold', text)} style={{ color }}>
            {score}
          </span>
          {showLabel && (
            <p className={cn('text-text-muted mt-1', labelSize)}>{label}</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}

interface MiniHealthScoreProps {
  score: number;
  className?: string;
}

export function MiniHealthScore({ score, className }: MiniHealthScoreProps) {
  const getColor = (score: number) => {
    if (score >= 90) return '#10b981';
    if (score >= 70) return '#f59e0b';
    if (score >= 50) return '#f97316';
    return '#ef4444';
  };

  const color = getColor(score);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
      />
      <span className="text-sm font-medium" style={{ color }}>
        {score}%
      </span>
    </div>
  );
}
