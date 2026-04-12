export type ServiceStatus = 'healthy' | 'degraded' | 'down' | 'unknown' | 'maintenance'

export type AlertSeverity = 'info' | 'warning' | 'error' | 'critical'

export interface HealthCheck {
  name: string
  status: ServiceStatus
  responseTimeMs: number
  checkedAt: string
  message?: string
}

export interface ServiceHealth {
  id: string
  name: string
  description: string
  status: ServiceStatus
  uptime: number
  uptimePercent: number
  lastDeployedAt: string
  version: string
  region: string
  checks: HealthCheck[]
  errorRate: number
  avgLatencyMs: number
  p99LatencyMs: number
  requestsPerSecond: number
}

export interface AlertInfo {
  id: string
  severity: AlertSeverity
  title: string
  description: string
  serviceId?: string
  serviceName?: string
  triggeredAt: string
  resolvedAt?: string
  isResolved: boolean
  runbook?: string
}

export interface ErrorRateData {
  timestamp: string
  serviceName: string
  errorRate: number
  requestCount: number
  errorCount: number
}

export interface LatencyData {
  timestamp: string
  serviceName: string
  p50: number
  p95: number
  p99: number
  avg: number
}

export interface DeploymentInfo {
  id: string
  serviceId: string
  serviceName: string
  version: string
  deployedBy: string
  deployedAt: string
  status: 'success' | 'failed' | 'in_progress' | 'rolled_back'
  commitHash: string
  releaseNotes?: string
}

export interface SystemHealthSummary {
  overallStatus: ServiceStatus
  totalServices: number
  healthyServices: number
  degradedServices: number
  downServices: number
  activeAlerts: number
  criticalAlerts: number
  lastUpdated: string
}
