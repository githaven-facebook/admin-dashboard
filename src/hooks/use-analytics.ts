'use client'

import { useQuery } from '@tanstack/react-query'
import {
  getDashboardSummary,
  getDailyMetrics,
  getEngagementData,
  getRevenueData,
  getTopContent,
} from '@/lib/api/analytics'
import type { AnalyticsParams } from '@/types/analytics'

const ANALYTICS_STALE_TIME = 5 * 60 * 1000 // 5 minutes

export const analyticsKeys = {
  all: ['analytics'] as const,
  summary: () => [...analyticsKeys.all, 'summary'] as const,
  dailyMetrics: (params: AnalyticsParams) =>
    [...analyticsKeys.all, 'daily-metrics', params] as const,
  engagement: (params: AnalyticsParams) => [...analyticsKeys.all, 'engagement', params] as const,
  revenue: (params: AnalyticsParams) => [...analyticsKeys.all, 'revenue', params] as const,
  topContent: (params: AnalyticsParams & { limit?: number }) =>
    [...analyticsKeys.all, 'top-content', params] as const,
}

export function useDashboardSummary() {
  return useQuery({
    queryKey: analyticsKeys.summary(),
    queryFn: getDashboardSummary,
    staleTime: 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
  })
}

export function useDailyMetrics(params: AnalyticsParams) {
  return useQuery({
    queryKey: analyticsKeys.dailyMetrics(params),
    queryFn: () => getDailyMetrics(params),
    staleTime: ANALYTICS_STALE_TIME,
  })
}

export function useEngagementData(params: AnalyticsParams) {
  return useQuery({
    queryKey: analyticsKeys.engagement(params),
    queryFn: () => getEngagementData(params),
    staleTime: ANALYTICS_STALE_TIME,
  })
}

export function useRevenueData(params: AnalyticsParams) {
  return useQuery({
    queryKey: analyticsKeys.revenue(params),
    queryFn: () => getRevenueData(params),
    staleTime: ANALYTICS_STALE_TIME,
  })
}

export function useTopContent(params: AnalyticsParams & { limit?: number }) {
  return useQuery({
    queryKey: analyticsKeys.topContent(params),
    queryFn: () => getTopContent(params),
    staleTime: ANALYTICS_STALE_TIME,
  })
}
