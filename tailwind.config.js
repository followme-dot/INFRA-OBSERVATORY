/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Fondos
        'bg-primary': '#0a0a0f',
        'bg-secondary': '#0d1117',
        'bg-tertiary': '#161b22',

        // Acentos Primarios - Cyan/Azul Eléctrico
        'accent-primary': '#00d4ff',
        'accent-primary-dim': '#0099cc',

        // Acentos Secundarios - Dorado/Amber
        'accent-secondary': '#f59e0b',
        'accent-secondary-dim': '#d97706',
        'accent-warning': '#fbbf24',

        // Estados
        'status-healthy': '#10b981',
        'status-warning': '#f59e0b',
        'status-critical': '#ef4444',
        'status-unknown': '#6b7280',
        'status-maintenance': '#8b5cf6',

        // Severidades
        'severity-info': '#3b82f6',
        'severity-low': '#10b981',
        'severity-medium': '#f59e0b',
        'severity-high': '#f97316',
        'severity-critical': '#ef4444',

        // Texto
        'text-primary': '#f0f6fc',
        'text-secondary': '#8b949e',
        'text-muted': '#6e7681',

        // Colores de gráficos
        'chart-1': '#00d4ff',
        'chart-2': '#7c3aed',
        'chart-3': '#10b981',
        'chart-4': '#f59e0b',
        'chart-5': '#ef4444',
        'chart-6': '#ec4899',
        'chart-7': '#3b82f6',
        'chart-8': '#14b8a6',
        'chart-9': '#f97316',
        'chart-10': '#8b5cf6',
        'chart-11': '#06b6d4',
        'chart-12': '#84cc16',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 50%, #00d4ff 100%)',
        'gradient-accent': 'linear-gradient(90deg, #00d4ff 0%, #a855f7 50%, #06b6d4 100%)',
        'gradient-gold': 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0a0a0f 0%, #0d1117 100%)',
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 212, 255, 0.3)',
        'glow-cyan-strong': '0 0 40px rgba(0, 212, 255, 0.5)',
        'glow-purple': '0 0 20px rgba(124, 58, 237, 0.3)',
        'glow-green': '0 0 12px rgba(16, 185, 129, 0.5)',
        'glow-red': '0 0 12px rgba(239, 68, 68, 0.5)',
        'glow-amber': '0 0 12px rgba(245, 158, 11, 0.5)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      },
      backdropBlur: {
        'glass': '20px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'radar-scan': 'radarScan 4s linear infinite',
        'radar-ping': 'radarPing 2s ease-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'typing': 'typing 3.5s steps(40, end)',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        radarScan: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        radarPing: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 212, 255, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.8)' },
        },
        typing: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};
