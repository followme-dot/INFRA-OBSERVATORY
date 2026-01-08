'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, label, error, hint, leftIcon, rightIcon, ...props },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-secondary mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              'flex h-10 w-full rounded-lg bg-bg-tertiary border border-glass-border px-3 py-2 text-sm text-text-primary placeholder:text-text-muted',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary',
              'disabled:cursor-not-allowed disabled:opacity-50',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-status-critical focus:ring-status-critical/50',
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-status-critical">{error}</p>}
        {hint && !error && (
          <p className="mt-1 text-xs text-text-muted">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface SearchInputProps extends Omit<InputProps, 'leftIcon'> {
  onSearch?: (value: string) => void;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onSearch, onKeyDown, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSearch) {
        onSearch((e.target as HTMLInputElement).value);
      }
      onKeyDown?.(e);
    };

    return (
      <Input
        ref={ref}
        type="search"
        leftIcon={<Search className="h-4 w-4" />}
        placeholder="Search..."
        onKeyDown={handleKeyDown}
        className={className}
        {...props}
      />
    );
  }
);

SearchInput.displayName = 'SearchInput';

export { Input, SearchInput };
