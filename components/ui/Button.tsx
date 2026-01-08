'use client';

import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-r from-accent-primary to-cyan-400 text-bg-primary hover:shadow-glow-cyan hover:scale-[1.02] active:scale-[0.98]',
        secondary:
          'bg-bg-tertiary text-text-primary border border-glass-border hover:bg-bg-secondary hover:border-accent-primary/30',
        ghost:
          'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary',
        danger:
          'bg-status-critical/10 text-status-critical border border-status-critical/30 hover:bg-status-critical/20',
        success:
          'bg-status-healthy/10 text-status-healthy border border-status-healthy/30 hover:bg-status-healthy/20',
        warning:
          'bg-status-warning/10 text-status-warning border border-status-warning/30 hover:bg-status-warning/20',
        outline:
          'border border-accent-primary/50 text-accent-primary hover:bg-accent-primary/10',
        link: 'text-accent-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 px-3 text-xs gap-1.5',
        md: 'h-10 px-4 text-sm gap-2',
        lg: 'h-12 px-6 text-base gap-2',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
        'icon-lg': 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
