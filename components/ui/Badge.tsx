'use client';

import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-bg-tertiary text-text-secondary',
        primary: 'bg-accent-primary/10 text-accent-primary',
        secondary: 'bg-accent-secondary/10 text-accent-secondary',
        success: 'bg-status-healthy/10 text-status-healthy',
        warning: 'bg-status-warning/10 text-status-warning',
        danger: 'bg-status-critical/10 text-status-critical',
        info: 'bg-severity-info/10 text-severity-info',
        purple: 'bg-status-maintenance/10 text-status-maintenance',
        outline: 'border border-text-muted text-text-secondary',
      },
      size: {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-xs px-2.5 py-1',
        lg: 'text-sm px-3 py-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
  dotColor?: string;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, dot, dotColor, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              'w-1.5 h-1.5 rounded-full mr-1.5',
              dotColor || 'bg-current'
            )}
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge, badgeVariants };
