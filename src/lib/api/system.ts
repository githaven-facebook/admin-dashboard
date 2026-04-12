import apiClient from './client'
import type {
  ServiceHealth,
  AlertInfo,
  ErrorRateData,
  LatencyData,
  DeploymentInfo,
  SystemHealthSummary,
} from '@/types/system'

export async function getSystemHealthSummary(): Promise<SystemHealthSummary> {
  const { data } = await apiClient.get<SystemHealthSummary>('/system/health/summary')
  return data
}

export async function getServiceHealth(): Promise<ServiceHealth[]> {
  const { data } = await apiClient.get<ServiceHealth[]>('/system/health/services')
  return data
}

export async function getServiceById(id: string): Promise<ServiceHealth> {
  const { data } = await apiClient.get<ServiceHealth>(`/system/health/services/${id}`)
  return data
}

export async function getAlerts(params?: {
  resolved?: boolean
  severity?: string
  page?: number
  limit?: number
}): Promise<{ alerts: AlertInfo[]; total: number }> {
  const { data } = await apiClient.get<{ alerts: AlertInfo[]; total: number }>('/system/alerts', {
    params,
  })
  return data
}

export async function resolveAlert(id: string): Promise<AlertInfo> {
  const { data } = await apiClient.post<AlertInfo>(`/system/alerts/${id}/resolve`)
  return data
}

export async function getErrorRates(params: {
  startTime: string
  endTime: string
  serviceIds?: string[]
  granularity?: string
}): Promise<ErrorRateData[]> {
  const { data } = await apiClient.get<ErrorRateData[]>('/system/metrics/error-rates', { params })
  return data
}

export async function getLatencyData(params: {
  startTime: string
  endTime: string
  serviceIds?: string[]
  granularity?: string
}): Promise<LatencyData[]> {
  const { data } = await apiClient.get<LatencyData[]>('/system/metrics/latency', { params })
  return data
}

export async function getDeployments(params?: {
  serviceId?: string
  page?: number
  limit?: number
}): Promise<{ deployments: DeploymentInfo[]; total: number }> {
  const { data } = await apiClient.get<{ deployments: DeploymentInfo[]; total: number }>(
    '/system/deployments',
    { params }
  )
  return data
}
