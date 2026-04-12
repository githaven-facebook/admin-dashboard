import apiClient from './client'

export interface AuditLog {
  id: string
  actorId: string
  actorName: string
  actorRole: string
  action: string
  targetType: string
  targetId: string
  targetName?: string
  details: Record<string, unknown>
  ipAddress: string
  userAgent: string
  createdAt: string
  sessionId?: string
}

export interface AuditLogParams {
  actorId?: string
  action?: string
  targetType?: string
  targetId?: string
  ipAddress?: string
  startDate?: string
  endDate?: string
  query?: string
  page?: number
  limit?: number
  sortOrder?: 'asc' | 'desc'
}

export interface AuditLogResponse {
  logs: AuditLog[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export async function getAuditLogs(params: AuditLogParams): Promise<AuditLogResponse> {
  const { data } = await apiClient.get<AuditLogResponse>('/audit/logs', { params })
  return data
}

export async function getAuditLogById(id: string): Promise<AuditLog> {
  const { data } = await apiClient.get<AuditLog>(`/audit/logs/${id}`)
  return data
}

export async function exportAuditLogs(params: AuditLogParams): Promise<Blob> {
  const { data } = await apiClient.get<Blob>('/audit/logs/export', {
    params: { ...params, format: 'csv' },
    responseType: 'blob',
  })
  return data
}
