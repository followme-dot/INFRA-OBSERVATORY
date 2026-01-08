'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SplashScreen } from '@/components/effects/SplashScreen';

export default function HomePage() {
  const router = useRouter();

  const handleSplashComplete = () => {
    // Check if user is authenticated (in a real app)
    // For now, redirect to overview
    router.push('/overview');
  };

  return <SplashScreen onComplete={handleSplashComplete} duration={4000} />;
}
