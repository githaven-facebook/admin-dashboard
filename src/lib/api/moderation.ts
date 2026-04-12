import apiClient from './client'
import type {
  ContentReport,
  ModerationQueue,
  ModerationQueueParams,
  ModerationAction,
  BulkModerationPayload,
} from '@/types/moderation'

export async function getContentQueue(params: ModerationQueueParams): Promise<ModerationQueue> {
  const { data } = await apiClient.get<ModerationQueue>('/moderation/queue', { params })
  return data
}

export async function getContentById(id: string): Promise<ContentReport> {
  const { data } = await apiClient.get<ContentReport>(`/moderation/reports/${id}`)
  return data
}

export async function approveContent(
  id: string,
  payload: { reason: string; note?: string }
): Promise<ContentReport> {
  const { data } = await apiClient.post<ContentReport>(`/moderation/reports/${id}/approve`, payload)
  return data
}

export async function rejectContent(
  id: string,
  payload: { reason: string; note?: string }
): Promise<ContentReport> {
  const { data } = await apiClient.post<ContentReport>(`/moderation/reports/${id}/reject`, payload)
  return data
}

export async function escalateContent(
  id: string,
  payload: { reason: string; note?: string }
): Promise<ContentReport> {
  const { data } = await apiClient.post<ContentReport>(
    `/moderation/reports/${id}/escalate`,
    payload
  )
  return data
}

export async function removeContent(
  id: string,
  payload: { reason: string; note?: string }
): Promise<ContentReport> {
  const { data } = await apiClient.post<ContentReport>(`/moderation/reports/${id}/remove`, payload)
  return data
}

export async function bulkAction(payload: BulkModerationPayload): Promise<{ processed: number }> {
  const { data } = await apiClient.post<{ processed: number }>(
    '/moderation/bulk-action',
    payload
  )
  return data
}

export async function getModerationHistory(reportId: string): Promise<ModerationAction[]> {
  const { data } = await apiClient.get<ModerationAction[]>(
    `/moderation/reports/${reportId}/history`
  )
  return data
}

export async function getSimilarContent(reportId: string): Promise<ContentReport[]> {
  const { data } = await apiClient.get<ContentReport[]>(
    `/moderation/reports/${reportId}/similar`
  )
  return data
}
