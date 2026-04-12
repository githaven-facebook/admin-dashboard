import apiClient from './client'
import type {
  AdCampaign,
  AdvertiserAccount,
  AdReviewQueueParams,
  AdReviewPayload,
} from '@/types/ads'

interface AdReviewQueueResponse {
  campaigns: AdCampaign[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export async function getAdReviewQueue(
  params: AdReviewQueueParams
): Promise<AdReviewQueueResponse> {
  const { data } = await apiClient.get<AdReviewQueueResponse>('/ads/review-queue', { params })
  return data
}

export async function getAdCampaign(id: string): Promise<AdCampaign> {
  const { data } = await apiClient.get<AdCampaign>(`/ads/campaigns/${id}`)
  return data
}

export async function approveAd(id: string, payload: { note?: string }): Promise<AdCampaign> {
  const { data } = await apiClient.post<AdCampaign>(`/ads/campaigns/${id}/approve`, payload)
  return data
}

export async function rejectAd(
  id: string,
  payload: { reason: string; policyViolations?: string[]; note?: string }
): Promise<AdCampaign> {
  const { data } = await apiClient.post<AdCampaign>(`/ads/campaigns/${id}/reject`, payload)
  return data
}

export async function flagPolicyViolation(
  id: string,
  payload: AdReviewPayload
): Promise<AdCampaign> {
  const { data } = await apiClient.post<AdCampaign>(`/ads/campaigns/${id}/flag`, payload)
  return data
}

export async function getAdvertiserAccount(advertiserId: string): Promise<AdvertiserAccount> {
  const { data } = await apiClient.get<AdvertiserAccount>(`/ads/advertisers/${advertiserId}`)
  return data
}

export async function getAdvertiserCampaigns(
  advertiserId: string,
  params?: { page?: number; limit?: number }
): Promise<AdReviewQueueResponse> {
  const { data } = await apiClient.get<AdReviewQueueResponse>(
    `/ads/advertisers/${advertiserId}/campaigns`,
    { params }
  )
  return data
}
