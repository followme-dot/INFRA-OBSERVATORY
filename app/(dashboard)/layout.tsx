'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { SplashScreen } from '@/components/effects/SplashScreen';
import { useUIStore } from '@/stores/uiStore';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarCollapsed, showSplash, setShowSplash } = useUIStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Only show splash on first load
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    if (hasSeenSplash) {
      setShowSplash(false);
    }
  }, [setShowSplash]);

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem('hasSeenSplash', 'true');
  };

  if (!isClient) {
    return null;
  }

  return (
    <>
      {/* Splash Screen */}
      {showSplash && (
        <SplashScreen onComplete={handleSplashComplete} duration={4000} />
      )}

      {/* Main Layout */}
      <div className="min-h-screen bg-bg-primary">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <motion.main
          initial={false}
          animate={{ marginLeft: sidebarCollapsed ? 72 : 256 }}
          transition={{ duration: 0.2 }}
          className="min-h-screen"
        >
          {/* Header */}
          <Header />

          {/* Page Content */}
          <div className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </div>
        </motion.main>
      </div>
    </>
  );
}
