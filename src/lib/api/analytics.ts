import apiClient from './client'
import type {
  DailyMetrics,
  EngagementData,
  RevenueData,
  TopContent,
  DashboardSummary,
  AnalyticsParams,
} from '@/types/analytics'

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const { data } = await apiClient.get<DashboardSummary>('/analytics/summary')
  return data
}

export async function getDailyMetrics(params: AnalyticsParams): Promise<DailyMetrics[]> {
  const { data } = await apiClient.get<DailyMetrics[]>('/analytics/daily-metrics', { params })
  return data
}

export async function getEngagementData(params: AnalyticsParams): Promise<EngagementData[]> {
  const { data } = await apiClient.get<EngagementData[]>('/analytics/engagement', { params })
  return data
}

export async function getRevenueData(params: AnalyticsParams): Promise<RevenueData[]> {
  const { data } = await apiClient.get<RevenueData[]>('/analytics/revenue', { params })
  return data
}

export async function getTopContent(
  params: AnalyticsParams & { limit?: number }
): Promise<TopContent[]> {
  const { data } = await apiClient.get<TopContent[]>('/analytics/top-content', { params })
  return data
}
