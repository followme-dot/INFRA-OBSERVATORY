'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Server,
  FileText,
  Activity,
  GitBranch,
  Bell,
  Target,
  LayoutGrid,
  DollarSign,
  Settings,
  ChevronLeft,
  ChevronRight,
  Boxes,
  AlertTriangle,
  Clock,
  Users,
} from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navigation: NavSection[] = [
  {
    title: 'Overview',
    items: [
      {
        label: 'Dashboard',
        href: '/overview',
        icon: <LayoutDashboard className="h-5 w-5" />,
      },
      {
        label: 'Platforms',
        href: '/platforms',
        icon: <Boxes className="h-5 w-5" />,
      },
    ],
  },
  {
    title: 'Observability',
    items: [
      {
        label: 'Logs',
        href: '/logs',
        icon: <FileText className="h-5 w-5" />,
      },
      {
        label: 'Metrics',
        href: '/metrics',
        icon: <Activity className="h-5 w-5" />,
      },
      {
        label: 'Traces',
        href: '/traces',
        icon: <GitBranch className="h-5 w-5" />,
      },
    ],
  },
  {
    title: 'Reliability',
    items: [
      {
        label: 'Alerts',
        href: '/alerts',
        icon: <Bell className="h-5 w-5" />,
        badge: 3,
        badgeColor: 'bg-status-critical',
      },
      {
        label: 'Incidents',
        href: '/alerts/incidents',
        icon: <AlertTriangle className="h-5 w-5" />,
      },
      {
        label: 'SLOs',
        href: '/slo',
        icon: <Target className="h-5 w-5" />,
      },
      {
        label: 'On-Call',
        href: '/alerts/on-call',
        icon: <Clock className="h-5 w-5" />,
      },
    ],
  },
  {
    title: 'Insights',
    items: [
      {
        label: 'Dashboards',
        href: '/dashboards',
        icon: <LayoutGrid className="h-5 w-5" />,
      },
      {
        label: 'Costs',
        href: '/costs',
        icon: <DollarSign className="h-5 w-5" />,
      },
    ],
  },
  {
    title: 'Settings',
    items: [
      {
        label: 'Settings',
        href: '/settings',
        icon: <Settings className="h-5 w-5" />,
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebarCollapse } = useUIStore();

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 72 : 256 }}
      transition={{ duration: 0.2 }}
      className="fixed left-0 top-0 h-screen bg-bg-secondary border-r border-glass-border z-40 flex flex-col"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-glass-border">
        <Logo size="md" showText={!sidebarCollapsed} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {navigation.map((section) => (
          <div key={section.title} className="mb-6">
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-3 mb-2 text-xs font-semibold text-text-muted uppercase tracking-wider"
                >
                  {section.title}
                </motion.h3>
              )}
            </AnimatePresence>

            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

                return (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
                        isActive
                          ? 'bg-accent-primary/10 text-accent-primary'
                          : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
                      )}
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Active Indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent-primary rounded-r-full"
                        />
                      )}

                      {/* Icon */}
                      <span
                        className={cn(
                          'flex-shrink-0',
                          isActive && 'text-accent-primary'
                        )}
                      >
                        {item.icon}
                      </span>

                      {/* Label */}
                      <AnimatePresence>
                        {!sidebarCollapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            className="flex-1 text-sm font-medium whitespace-nowrap"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {/* Badge */}
                      {item.badge && !sidebarCollapsed && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={cn(
                            'px-2 py-0.5 text-xs font-bold rounded-full text-white',
                            item.badgeColor || 'bg-accent-primary'
                          )}
                        >
                          {item.badge}
                        </motion.span>
                      )}

                      {/* Collapsed Badge */}
                      {item.badge && sidebarCollapsed && (
                        <span
                          className={cn(
                            'absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-[10px] font-bold rounded-full text-white',
                            item.badgeColor || 'bg-accent-primary'
                          )}
                        >
                          {item.badge}
                        </span>
                      )}

                      {/* Tooltip for collapsed state */}
                      {sidebarCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-bg-tertiary text-text-primary text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                          {item.label}
                        </div>
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse Button */}
      <div className="p-2 border-t border-glass-border">
        <button
          onClick={toggleSidebarCollapse}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
