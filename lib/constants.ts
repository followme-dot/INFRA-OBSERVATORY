export const PLATFORMS = [
  {
    id: '1',
    code: 'infrabank',
    name: 'INFRABANK',
    description: 'Banca Digital Híbrida TradFi + DeFi',
    color: '#00d4ff',
    icon: 'building-bank',
    criticality: 'critical' as const,
    estimatedServices: '25-40',
  },
  {
    id: '2',
    code: 'infrapay',
    name: 'INFRA PAY & TREASURY',
    description: 'Pagos Internacionales y Tesorería IA',
    color: '#7c3aed',
    icon: 'credit-card',
    criticality: 'critical' as const,
    estimatedServices: '15-25',
  },
  {
    id: '3',
    code: 'infravault',
    name: 'INFRA VAULT CORE',
    description: 'Plataforma Multilateral de Liquidez',
    color: '#10b981',
    icon: 'vault',
    criticality: 'critical' as const,
    estimatedServices: '20-30',
  },
  {
    id: '4',
    code: 'infradigital',
    name: 'INFRA DIGITAL ASSETS',
    description: 'Custodia y Trading Institucional',
    color: '#f59e0b',
    icon: 'coins',
    criticality: 'critical' as const,
    estimatedServices: '30-50',
  },
  {
    id: '5',
    code: 'infracoinn',
    name: 'INFRACOINN',
    description: 'Tokenización de Activos Reales',
    color: '#ec4899',
    icon: 'gem',
    criticality: 'high' as const,
    estimatedServices: '15-20',
  },
  {
    id: '6',
    code: 'infradevtech',
    name: 'INFRA Dev·Tech',
    description: 'DevTools SaaS Marketplace',
    color: '#3b82f6',
    icon: 'code',
    criticality: 'high' as const,
    estimatedServices: '20-35',
  },
  {
    id: '7',
    code: 'infraforge',
    name: 'INFRA FORGE',
    description: 'Smart Contracts AI',
    color: '#ef4444',
    icon: 'hammer',
    criticality: 'medium' as const,
    estimatedServices: '10-15',
  },
  {
    id: '8',
    code: 'infrainsurance',
    name: 'INFRA Global Insurance',
    description: 'Seguros Multi-Línea',
    color: '#06b6d4',
    icon: 'shield-check',
    criticality: 'critical' as const,
    estimatedServices: '40-60',
  },
  {
    id: '9',
    code: 'infraschool',
    name: 'INFRA SCHOOL',
    description: 'EdTech + Fintech Educativo',
    color: '#8b5cf6',
    icon: 'graduation-cap',
    criticality: 'medium' as const,
    estimatedServices: '15-25',
  },
] as const;

export const TIME_RANGES = [
  { label: '15m', value: '15m', seconds: 900 },
  { label: '1h', value: '1h', seconds: 3600 },
  { label: '6h', value: '6h', seconds: 21600 },
  { label: '24h', value: '24h', seconds: 86400 },
  { label: '7d', value: '7d', seconds: 604800 },
  { label: '30d', value: '30d', seconds: 2592000 },
] as const;

export const LOG_LEVELS = [
  { label: 'Debug', value: 'debug', color: 'text-gray-500' },
  { label: 'Info', value: 'info', color: 'text-blue-400' },
  { label: 'Warn', value: 'warn', color: 'text-amber-400' },
  { label: 'Error', value: 'error', color: 'text-red-400' },
  { label: 'Fatal', value: 'fatal', color: 'text-red-600' },
] as const;

export const ALERT_SEVERITIES = [
  { label: 'Info', value: 'info', color: '#3b82f6' },
  { label: 'Low', value: 'low', color: '#10b981' },
  { label: 'Medium', value: 'medium', color: '#f59e0b' },
  { label: 'High', value: 'high', color: '#f97316' },
  { label: 'Critical', value: 'critical', color: '#ef4444' },
] as const;

export const SERVICE_TYPES = [
  { label: 'API', value: 'api' },
  { label: 'Worker', value: 'worker' },
  { label: 'Database', value: 'database' },
  { label: 'Cache', value: 'cache' },
  { label: 'Queue', value: 'queue' },
  { label: 'Gateway', value: 'gateway' },
] as const;

export const STATUS_OPTIONS = [
  { label: 'Healthy', value: 'healthy', color: '#10b981' },
  { label: 'Degraded', value: 'degraded', color: '#f59e0b' },
  { label: 'Critical', value: 'critical', color: '#ef4444' },
  { label: 'Unknown', value: 'unknown', color: '#6b7280' },
  { label: 'Maintenance', value: 'maintenance', color: '#8b5cf6' },
] as const;

export const REFRESH_INTERVALS = [
  { label: 'Off', value: 0 },
  { label: '5s', value: 5000 },
  { label: '10s', value: 10000 },
  { label: '30s', value: 30000 },
  { label: '1m', value: 60000 },
  { label: '5m', value: 300000 },
] as const;

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3013/api/v1';
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3013/ws';
