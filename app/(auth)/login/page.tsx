'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Shield, Loader2 } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/stores/authStore';

export default function LoginPage() {
  const router = useRouter();
  const { login, setLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Simulated login - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Demo user
      const user = {
        id: '1',
        email,
        name: 'Admin User',
        role: 'admin' as const,
      };

      login(user, 'demo-token');
      router.push('/overview');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      {/* Login Card */}
      <div className="glass-panel p-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Welcome Back
          </h1>
          <p className="text-text-secondary text-sm">
            Sign in to access your observability dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg bg-status-critical/10 border border-status-critical/30 text-status-critical text-sm"
            >
              {error}
            </motion.div>
          )}

          <Input
            label="Email"
            type="email"
            placeholder="admin@infra.io"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-text-primary transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-text-secondary cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-glass-border bg-bg-tertiary checked:bg-accent-primary"
              />
              Remember me
            </label>
            <a
              href="#"
              className="text-accent-primary hover:text-accent-primary/80 transition-colors"
            >
              Forgot password?
            </a>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={isLoading}
            rightIcon={!isLoading && <ArrowRight className="h-4 w-4" />}
          >
            Sign In
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-glass-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-bg-secondary text-text-muted">
              Or continue with
            </span>
          </div>
        </div>

        {/* SSO Button */}
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          leftIcon={<Shield className="h-4 w-4" />}
          onClick={() => {
            // SSO integration with INFRA IAM
            console.log('SSO Login');
          }}
        >
          Sign in with INFRA IAM
        </Button>

        {/* Footer */}
        <p className="text-center text-xs text-text-muted mt-8">
          Protected by INFRA Security.{' '}
          <a href="#" className="text-accent-primary hover:underline">
            Privacy Policy
          </a>{' '}
          &{' '}
          <a href="#" className="text-accent-primary hover:underline">
            Terms of Service
          </a>
        </p>
      </div>

      {/* Platform Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 flex justify-center gap-8"
      >
        {[
          { label: 'Platforms', value: '9' },
          { label: 'Services', value: '247' },
          { label: 'Uptime', value: '99.99%' },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-2xl font-bold gradient-text">{stat.value}</p>
            <p className="text-xs text-text-muted">{stat.label}</p>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
