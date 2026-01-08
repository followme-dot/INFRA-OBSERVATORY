'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SplashScreenProps {
  onComplete?: () => void;
  duration?: number;
}

export function SplashScreen({ onComplete, duration = 4000 }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [servicesFound, setServicesFound] = useState(0);
  const [phase, setPhase] = useState<'scanning' | 'connecting' | 'ready'>('scanning');
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const startTime = Date.now();
    const targetServices = 247;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      // Update services found
      const newServicesFound = Math.floor((newProgress / 100) * targetServices);
      setServicesFound(newServicesFound);

      // Update phase
      if (newProgress < 40) {
        setPhase('scanning');
      } else if (newProgress < 80) {
        setPhase('connecting');
      } else {
        setPhase('ready');
      }

      if (newProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setVisible(false);
          setTimeout(() => {
            onComplete?.();
          }, 500);
        }, 500);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  const phaseText = {
    scanning: 'Scanning Infrastructure...',
    connecting: 'Connecting to Services...',
    ready: 'Initializing Dashboard...',
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary"
        >
          {/* Background Grid */}
          <div className="absolute inset-0 radar-grid opacity-30" />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-bg-primary/50 to-bg-primary" />

          {/* Main Content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Radar Container */}
            <div className="relative w-80 h-80 mb-8">
              {/* Concentric Circles */}
              {[1, 2, 3, 4].map((ring) => (
                <motion.div
                  key={ring}
                  className="absolute inset-0 rounded-full border border-accent-primary/20"
                  style={{
                    width: `${ring * 25}%`,
                    height: `${ring * 25}%`,
                    top: `${50 - ring * 12.5}%`,
                    left: `${50 - ring * 12.5}%`,
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: ring * 0.1, duration: 0.5 }}
                />
              ))}

              {/* Ping Effect */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-accent-primary/40"
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />

              {/* Second Ping */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-accent-primary/30"
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeOut',
                  delay: 1,
                }}
              />

              {/* Radar Sweep Line */}
              <motion.div
                className="absolute top-1/2 left-1/2 w-1/2 h-0.5 origin-left"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(0,212,255,0.8) 0%, transparent 100%)',
                }}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />

              {/* Sweep Glow */}
              <motion.div
                className="absolute top-1/2 left-1/2 w-1/2 h-1/2 origin-top-left"
                style={{
                  background:
                    'conic-gradient(from 0deg, transparent 0deg, rgba(0,212,255,0.15) 30deg, transparent 60deg)',
                }}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />

              {/* Center Logo */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                  className="relative"
                >
                  {/* Glow Effect */}
                  <div className="absolute -inset-4 bg-accent-primary/20 blur-xl rounded-full" />

                  {/* Logo Circle */}
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-accent-primary to-purple-600 flex items-center justify-center shadow-glow-cyan">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-10 h-10 text-bg-primary"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="4" />
                      <line x1="21.17" y1="8" x2="12" y2="8" />
                      <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
                      <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
                    </svg>
                  </div>
                </motion.div>
              </div>

              {/* Floating Data Points */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i / 12) * 360;
                const delay = i * 0.15;
                const distance = 80 + Math.random() * 40;
                return (
                  <motion.div
                    key={i}
                    className={cn(
                      'absolute w-2 h-2 rounded-full',
                      i % 3 === 0
                        ? 'bg-status-healthy'
                        : i % 3 === 1
                        ? 'bg-accent-primary'
                        : 'bg-status-warning'
                    )}
                    style={{
                      top: `calc(50% + ${
                        Math.sin((angle * Math.PI) / 180) * distance
                      }px)`,
                      left: `calc(50% + ${
                        Math.cos((angle * Math.PI) / 180) * distance
                      }px)`,
                      boxShadow: `0 0 8px currentColor`,
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 1, 0],
                      scale: [0, 1, 1, 0],
                    }}
                    transition={{
                      duration: 3,
                      delay: delay,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                  />
                );
              })}
            </div>

            {/* Logo Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl font-bold mb-2">
                <span className="text-text-primary">INFRA </span>
                <span className="gradient-text">OBSERVATORY</span>
              </h1>
              <p className="text-text-secondary text-sm">
                Unified Observability Platform
              </p>
            </motion.div>

            {/* Progress Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="w-80"
            >
              {/* Status Text */}
              <div className="flex justify-between items-center mb-2">
                <motion.span
                  key={phase}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm text-accent-primary font-mono"
                >
                  {phaseText[phase]}
                </motion.span>
                <span className="text-sm text-text-muted font-mono">
                  {servicesFound} services
                </span>
              </div>

              {/* Progress Bar */}
              <div className="relative h-2 bg-bg-tertiary rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent-primary via-purple-500 to-accent-primary"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
                {/* Shimmer Effect */}
                <motion.div
                  className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['0%', '400%'] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>

              {/* Percentage */}
              <div className="text-center mt-2">
                <span className="text-lg font-mono text-text-primary">
                  {Math.round(progress)}%
                </span>
              </div>
            </motion.div>

            {/* Platform Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex gap-2 mt-8"
            >
              {['INFRABANK', 'INFRAPAY', 'INFRAVAULT', 'INFRADIGITAL'].map(
                (platform, i) => (
                  <motion.div
                    key={platform}
                    className="px-2 py-1 text-xs font-mono rounded bg-bg-tertiary border border-glass-border"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: progress > (i + 1) * 20 ? 1 : 0.3,
                      scale: progress > (i + 1) * 20 ? 1 : 0.9,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <span
                      className={cn(
                        progress > (i + 1) * 20
                          ? 'text-status-healthy'
                          : 'text-text-muted'
                      )}
                    >
                      {platform}
                    </span>
                  </motion.div>
                )
              )}
            </motion.div>
          </div>

          {/* Corner Decorations */}
          <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-accent-primary/30" />
          <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-accent-primary/30" />
          <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-accent-primary/30" />
          <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-accent-primary/30" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
