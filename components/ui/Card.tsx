'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'bordered' | 'elevated';
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'glass',
      hoverable = false,
      padding = 'md',
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      default: 'bg-bg-secondary border border-bg-tertiary',
      glass: 'glass-panel',
      bordered: 'bg-bg-secondary/50 border border-accent-primary/20',
      elevated: 'bg-bg-secondary shadow-lg shadow-black/20',
    };

    const paddings = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl transition-all duration-200',
          variants[variant],
          paddings[padding],
          hoverable &&
            'hover:border-accent-primary/40 hover:shadow-glow-cyan cursor-pointer hover:scale-[1.01]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, subtitle, action, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-between mb-4', className)}
        {...props}
      >
        {children || (
          <>
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-text-primary">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-text-secondary mt-0.5">{subtitle}</p>
              )}
            </div>
            {action && <div>{action}</div>}
          </>
        )}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

const CardContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('', className)} {...props} />
));

CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center pt-4 mt-4 border-t border-bg-tertiary',
      className
    )}
    {...props}
  />
));

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardContent, CardFooter };
