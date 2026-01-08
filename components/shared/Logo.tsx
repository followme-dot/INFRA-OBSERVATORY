'use client';

import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 'md', showText = true, className }: LogoProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Logo Icon */}
      <div className="relative">
        {/* Glow */}
        <div className="absolute -inset-1 bg-accent-primary/20 blur-md rounded-full" />

        {/* Circle with Icon */}
        <div
          className={cn(
            'relative rounded-full bg-gradient-to-br from-accent-primary to-purple-600 flex items-center justify-center shadow-glow-cyan',
            sizes[size]
          )}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-1/2 h-1/2 text-bg-primary"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Radar/Observatory Icon */}
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="4" />
            <line x1="21.17" y1="8" x2="12" y2="8" />
            <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
            <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
          </svg>
        </div>
      </div>

      {/* Text */}
      {showText && (
        <div className={cn('font-bold', textSizes[size])}>
          <span className="text-text-primary">INFRA </span>
          <span className="gradient-text">OBSERVATORY</span>
        </div>
      )}
    </div>
  );
}

interface PlatformLogoProps {
  code: string;
  name: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  className?: string;
}

export function PlatformLogo({
  code,
  name,
  color,
  size = 'md',
  showName = false,
  className,
}: PlatformLogoProps) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  // Get initials from code (e.g., "infrabank" -> "IB")
  const initials = code
    .replace('infra', '')
    .substring(0, 2)
    .toUpperCase() || 'IN';

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'rounded-lg flex items-center justify-center font-bold',
          sizes[size]
        )}
        style={{
          backgroundColor: `${color}20`,
          color: color,
          boxShadow: `0 0 12px ${color}30`,
        }}
      >
        {initials}
      </div>
      {showName && (
        <span className="font-medium text-text-primary">{name}</span>
      )}
    </div>
  );
}
