// Platform Types
export interface Platform {
  id: string;
  code: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  baseUrl?: string;
  status: PlatformStatus;
  healthScore: number;
  lastHealthCheck?: string;
  isActive: boolean;
  criticality: 'critical' | 'high' | 'medium' | 'low';
  settings?: Record<string, unknown>;
  defaultAvailabilityTarget: number;
  defaultLatencyTargetMs: number;
  createdAt: string;
  updatedAt: string;
}

export type PlatformStatus = 'healthy' | 'degraded' | 'critical' | 'unknown' | 'maintenance';

// Service Types
export interface Service {
  id: string;
  platformId: string;
  name: string;
  slug: string;
  description?: string;
  serviceType: ServiceType;
  technology?: string;
  status: ServiceStatus;
  healthScore: number;
  lastSeen?: string;
  team?: string;
  ownerEmail?: string;
  healthEndpoint?: string;
  metricsPort: number;
  cpuLimit?: string;
  memoryLimit?: string;
  replicas: number;
  isActive: boolean;
  settings?: Record<string, unknown>;
  labels?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export type ServiceType = 'api' | 'worker' | 'database' | 'cache' | 'queue' | 'gateway';
export type ServiceStatus = 'healthy' | 'degraded' | 'critical' | 'unknown' | 'maintenance';

// Log Types
export interface LogEntry {
  id: string;
  timestamp: string;
  platformId: string;
  serviceId: string;
  level: LogLevel;
  message: string;
  traceId?: string;
  spanId?: string;
  requestId?: string;
  userId?: string;
  source?: string;
  environment?: string;
  host?: string;
  containerId?: string;
  podName?: string;
  attributes?: Record<string, unknown>;
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

// Metric Types
export interface Metric {
  id: string;
  timestamp: string;
  platformId: string;
  serviceId: string;
  name: string;
  metricType: MetricType;
  value: number;
  labels?: Record<string, string>;
  aggregation?: AggregationType;
  unit?: string;
  description?: string;
}

export type MetricType = 'counter' | 'gauge' | 'histogram' | 'summary';
export type AggregationType = 'sum' | 'avg' | 'min' | 'max' | 'count' | 'p50' | 'p90' | 'p99';

export interface MetricDataPoint {
  timestamp: string;
  value: number;
}

export interface MetricSeries {
  name: string;
  labels: Record<string, string>;
  data: MetricDataPoint[];
}

// Trace Types
export interface Trace {
  id: string;
  traceId: string;
  platformId: string;
  rootServiceId: string;
  startTime: string;
  endTime?: string;
  durationMs: number;
  rootSpanName: string;
  servicesInvolved: string[];
  spanCount: number;
  status: TraceStatus;
  hasError: boolean;
  errorMessage?: string;
  httpMethod?: string;
  httpPath?: string;
  httpStatusCode?: number;
  userId?: string;
  createdAt: string;
}

export type TraceStatus = 'ok' | 'error' | 'timeout';

export interface Span {
  id: string;
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  serviceId: string;
  startTime: string;
  endTime?: string;
  durationMs: number;
  name: string;
  kind: SpanKind;
  status: SpanStatus;
  statusMessage?: string;
  attributes?: Record<string, unknown>;
  events?: SpanEvent[];
  links?: SpanLink[];
}

export type SpanKind = 'server' | 'client' | 'producer' | 'consumer' | 'internal';
export type SpanStatus = 'ok' | 'error' | 'unset';

export interface SpanEvent {
  name: string;
  timestamp: string;
  attributes?: Record<string, unknown>;
}

export interface SpanLink {
  traceId: string;
  spanId: string;
  attributes?: Record<string, unknown>;
}

// Alert Types
export interface AlertRule {
  id: string;
  name: string;
  description?: string;
  platformId?: string;
  serviceId?: string;
  metricName: string;
  conditionOperator: ConditionOperator;
  threshold: number;
  durationSeconds: number;
  customQuery?: string;
  severity: AlertSeverity;
  notificationChannels: string[];
  escalationPolicyId?: string;
  isMuted: boolean;
  mutedUntil?: string;
  mutedReason?: string;
  isActive: boolean;
  lastTriggered?: string;
  labels?: Record<string, string>;
  annotations?: Record<string, string>;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export type ConditionOperator = 'gt' | 'lt' | 'gte' | 'lte' | 'eq' | 'neq';
export type AlertSeverity = 'info' | 'low' | 'medium' | 'high' | 'critical';

export interface Alert {
  id: string;
  ruleId: string;
  platformId: string;
  serviceId: string;
  name: string;
  description?: string;
  severity: AlertSeverity;
  currentValue: number;
  threshold: number;
  status: AlertStatus;
  firedAt: string;
  resolvedAt?: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  labels?: Record<string, string>;
  annotations?: Record<string, string>;
  incidentId?: string;
}

export type AlertStatus = 'firing' | 'resolved' | 'acknowledged';

// Incident Types
export interface Incident {
  id: string;
  title: string;
  description?: string;
  severity: AlertSeverity;
  status: IncidentStatus;
  startedAt: string;
  detectedAt?: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  closedAt?: string;
  affectedPlatforms: string[];
  affectedServices: string[];
  customerImpact: CustomerImpact;
  rootCause?: string;
  resolution?: string;
  commanderId?: string;
  assignedTo: string[];
  timeline: IncidentTimelineEntry[];
  postmortemUrl?: string;
  actionItems: ActionItem[];
  createdAt: string;
  updatedAt: string;
}

export type IncidentStatus = 'open' | 'acknowledged' | 'investigating' | 'resolved' | 'closed';
export type CustomerImpact = 'none' | 'minor' | 'major' | 'critical';

export interface IncidentTimelineEntry {
  timestamp: string;
  action: string;
  user?: string;
  note?: string;
}

export interface ActionItem {
  id: string;
  description: string;
  assignee?: string;
  dueDate?: string;
  status: 'pending' | 'in_progress' | 'completed';
}

// SLO Types
export interface SLO {
  id: string;
  name: string;
  description?: string;
  platformId: string;
  serviceId?: string;
  sliType: SLIType;
  sliQuery: string;
  target: number;
  windowType: 'rolling' | 'calendar';
  windowDays: number;
  currentValue?: number;
  errorBudgetRemaining?: number;
  lastCalculated?: string;
  burnRateThreshold: number;
  alertOnBudgetExhaustion: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SLIType = 'availability' | 'latency' | 'error_rate' | 'throughput';

// Dashboard Types
export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  slug: string;
  ownerId?: string;
  isPublic: boolean;
  layout: DashboardLayout[];
  timeRange: string;
  refreshInterval: number;
  variables: DashboardVariable[];
  tags: string[];
  isStarred: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardLayout {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface DashboardVariable {
  name: string;
  type: 'query' | 'constant' | 'custom';
  query?: string;
  options?: string[];
  defaultValue?: string;
}

export interface DashboardWidget {
  id: string;
  dashboardId: string;
  x: number;
  y: number;
  w: number;
  h: number;
  widgetType: WidgetType;
  title?: string;
  description?: string;
  config: Record<string, unknown>;
  queries: WidgetQuery[];
  createdAt: string;
  updatedAt: string;
}

export type WidgetType =
  | 'line_chart'
  | 'area_chart'
  | 'bar_chart'
  | 'pie_chart'
  | 'gauge'
  | 'stat'
  | 'table'
  | 'logs'
  | 'heatmap'
  | 'text'
  | 'slo_status'
  | 'alert_list';

export interface WidgetQuery {
  id: string;
  query: string;
  legend?: string;
  color?: string;
}

// Cost Types
export interface CostRecord {
  id: string;
  date: string;
  platformId: string;
  serviceId?: string;
  resourceType: ResourceType;
  resourceName?: string;
  costUsd: number;
  usageQuantity?: number;
  usageUnit?: string;
  provider?: CloudProvider;
  region?: string;
  tags?: Record<string, string>;
}

export type ResourceType = 'compute' | 'storage' | 'network' | 'database' | 'other';
export type CloudProvider = 'aws' | 'gcp' | 'azure';

// Integration Types
export interface Integration {
  id: string;
  name: string;
  type: IntegrationType;
  config: Record<string, unknown>;
  isActive: boolean;
  lastUsed?: string;
  lastError?: string;
  createdAt: string;
  updatedAt: string;
}

export type IntegrationType = 'slack' | 'pagerduty' | 'opsgenie' | 'email' | 'webhook' | 'teams';

// Overview Types
export interface SystemOverview {
  healthScore: number;
  totalPlatforms: number;
  totalServices: number;
  healthyServices: number;
  degradedServices: number;
  criticalServices: number;
  activeAlerts: number;
  criticalAlerts: number;
  openIncidents: number;
  requestsPerSecond: number;
  errorRate: number;
  p99Latency: number;
}

export interface PlatformOverview extends Platform {
  serviceCount: number;
  healthyServiceCount: number;
  alertCount: number;
  requestsPerSecond: number;
  errorRate: number;
  p99Latency: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}

// Time Range Types
export interface TimeRange {
  from: Date;
  to: Date;
}

export type TimeRangePreset = '15m' | '1h' | '6h' | '24h' | '7d' | '30d' | 'custom';
