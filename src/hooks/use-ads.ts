'use client'

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import {
  getAdReviewQueue,
  getAdCampaign,
  approveAd,
  rejectAd,
  flagPolicyViolation,
  getAdvertiserAccount,
  getAdvertiserCampaigns,
} from '@/lib/api/ads'
import type { AdReviewQueueParams, AdReviewPayload } from '@/types/ads'

export const adKeys = {
  all: ['ads'] as const,
  queues: () => [...adKeys.all, 'queue'] as const,
  queue: (params: AdReviewQueueParams) => [...adKeys.queues(), params] as const,
  campaigns: () => [...adKeys.all, 'campaign'] as const,
  campaign: (id: string) => [...adKeys.campaigns(), id] as const,
  advertisers: () => [...adKeys.all, 'advertiser'] as const,
  advertiser: (id: string) => [...adKeys.advertisers(), id] as const,
  advertiserCampaigns: (id: string) => [...adKeys.advertiser(id), 'campaigns'] as const,
}

export function useAdReviewQueue(params: AdReviewQueueParams) {
  return useQuery({
    queryKey: adKeys.queue(params),
    queryFn: () => getAdReviewQueue(params),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  })
}

export function useAdCampaign(id: string) {
  return useQuery({
    queryKey: adKeys.campaign(id),
    queryFn: () => getAdCampaign(id),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
  })
}

export function useAdvertiserAccount(advertiserId: string) {
  return useQuery({
    queryKey: adKeys.advertiser(advertiserId),
    queryFn: () => getAdvertiserAccount(advertiserId),
    enabled: Boolean(advertiserId),
  })
}

export function useAdvertiserCampaigns(
  advertiserId: string,
  params?: { page?: number; limit?: number }
) {
  return useQuery({
    queryKey: [...adKeys.advertiserCampaigns(advertiserId), params],
    queryFn: () => getAdvertiserCampaigns(advertiserId, params),
    enabled: Boolean(advertiserId),
  })
}

export function useReviewAd() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      action,
      payload,
    }: {
      id: string
      action: 'approve' | 'reject' | 'flag'
      payload: AdReviewPayload
    }) => {
      switch (action) {
        case 'approve':
          return approveAd(id, { note: payload.note })
        case 'reject':
          return rejectAd(id, {
            reason: payload.reason ?? '',
            policyViolations: payload.policyViolations,
            note: payload.note,
          })
        case 'flag':
          return flagPolicyViolation(id, payload)
      }
    },
    onSuccess: (updatedCampaign) => {
      if (updatedCampaign) {
        queryClient.setQueryData(adKeys.campaign(updatedCampaign.id), updatedCampaign)
      }
      queryClient.invalidateQueries({ queryKey: adKeys.queues() })
    },
  })
}
