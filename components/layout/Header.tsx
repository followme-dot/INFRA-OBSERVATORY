'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  RefreshCw,
  Command,
  ChevronDown,
  Clock,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatusDot } from '@/components/ui/StatusDot';
import { useUIStore } from '@/stores/uiStore';
import { useTimeRangeStore } from '@/stores/timeRangeStore';
import { useAuthStore } from '@/stores/authStore';
import { TIME_RANGES, REFRESH_INTERVALS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function Header() {
  const { openCommandPalette } = useUIStore();
  const { preset, setPreset, refreshInterval, setRefreshInterval, refresh } = useTimeRangeStore();
  const { user, logout } = useAuthStore();
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showRefreshDropdown, setShowRefreshDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    refresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <header className="h-16 bg-bg-secondary/80 backdrop-blur-lg border-b border-glass-border sticky top-0 z-30">
      <div className="h-full px-6 flex items-center justify-between gap-4">
        {/* Left Section - Search */}
        <div className="flex-1 max-w-xl">
          <button
            onClick={openCommandPalette}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-bg-tertiary border border-glass-border text-text-muted hover:text-text-secondary hover:border-accent-primary/30 transition-all"
          >
            <Search className="h-4 w-4" />
            <span className="text-sm">Search logs, metrics, traces...</span>
            <div className="ml-auto flex items-center gap-1 text-xs">
              <kbd className="px-1.5 py-0.5 rounded bg-bg-secondary border border-glass-border">
                <Command className="h-3 w-3 inline" />
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-bg-secondary border border-glass-border">
                K
              </kbd>
            </div>
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Live Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-status-healthy/10 border border-status-healthy/20">
            <StatusDot status="healthy" size="sm" />
            <span className="text-xs font-medium text-status-healthy">Live</span>
          </div>

          {/* Time Range Selector */}
          <div className="relative">
            <button
              onClick={() => setShowTimeDropdown(!showTimeDropdown)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-tertiary border border-glass-border text-text-secondary hover:text-text-primary hover:border-accent-primary/30 transition-all"
            >
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">
                {TIME_RANGES.find((t) => t.value === preset)?.label || preset}
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {showTimeDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowTimeDropdown(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-full mt-2 w-40 py-2 rounded-lg bg-bg-secondary border border-glass-border shadow-lg z-50"
                >
                  {TIME_RANGES.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => {
                        setPreset(range.value as any);
                        setShowTimeDropdown(false);
                      }}
                      className={cn(
                        'w-full px-4 py-2 text-left text-sm hover:bg-bg-tertiary transition-colors',
                        preset === range.value
                          ? 'text-accent-primary bg-accent-primary/10'
                          : 'text-text-secondary'
                      )}
                    >
                      Last {range.label}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </div>

          {/* Auto Refresh */}
          <div className="relative">
            <button
              onClick={() => setShowRefreshDropdown(!showRefreshDropdown)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-tertiary border border-glass-border text-text-secondary hover:text-text-primary hover:border-accent-primary/30 transition-all"
            >
              <Zap className="h-4 w-4" />
              <span className="text-sm font-medium">
                {REFRESH_INTERVALS.find((r) => r.value === refreshInterval)?.label || 'Off'}
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {showRefreshDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowRefreshDropdown(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-full mt-2 w-32 py-2 rounded-lg bg-bg-secondary border border-glass-border shadow-lg z-50"
                >
                  {REFRESH_INTERVALS.map((interval) => (
                    <button
                      key={interval.value}
                      onClick={() => {
                        setRefreshInterval(interval.value);
                        setShowRefreshDropdown(false);
                      }}
                      className={cn(
                        'w-full px-4 py-2 text-left text-sm hover:bg-bg-tertiary transition-colors',
                        refreshInterval === interval.value
                          ? 'text-accent-primary bg-accent-primary/10'
                          : 'text-text-secondary'
                      )}
                    >
                      {interval.label}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </div>

          {/* Manual Refresh */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            className="text-text-secondary hover:text-text-primary"
          >
            <RefreshCw
              className={cn('h-4 w-4', isRefreshing && 'animate-spin')}
            />
          </Button>

          {/* Divider */}
          <div className="w-px h-8 bg-glass-border" />

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-text-secondary hover:text-text-primary"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-[10px] font-bold rounded-full bg-status-critical text-white">
              3
            </span>
          </Button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-bg-tertiary transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-primary to-purple-600 flex items-center justify-center text-sm font-bold text-bg-primary">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <ChevronDown className="h-4 w-4 text-text-muted" />
            </button>

            {showUserDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserDropdown(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-full mt-2 w-56 py-2 rounded-lg bg-bg-secondary border border-glass-border shadow-lg z-50"
                >
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-glass-border">
                    <p className="font-medium text-text-primary">
                      {user?.name || 'Admin User'}
                    </p>
                    <p className="text-sm text-text-muted">
                      {user?.email || 'admin@infra.io'}
                    </p>
                    <Badge variant="primary" size="sm" className="mt-2">
                      {user?.role || 'Admin'}
                    </Badge>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors">
                      <User className="h-4 w-4" />
                      Profile
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors">
                      <Settings className="h-4 w-4" />
                      Settings
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="pt-1 border-t border-glass-border">
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-status-critical hover:bg-status-critical/10 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
