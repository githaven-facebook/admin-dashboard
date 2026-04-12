'use client'

import {
  useQuery,
  useMutation,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  getContentQueue,
  getContentById,
  approveContent,
  rejectContent,
  escalateContent,
  removeContent,
  bulkAction,
  getModerationHistory,
  getSimilarContent,
} from '@/lib/api/moderation'
import type { ModerationQueueParams, BulkModerationPayload } from '@/types/moderation'

export const moderationKeys = {
  all: ['moderation'] as const,
  queues: () => [...moderationKeys.all, 'queue'] as const,
  queue: (params: ModerationQueueParams) => [...moderationKeys.queues(), params] as const,
  details: () => [...moderationKeys.all, 'detail'] as const,
  detail: (id: string) => [...moderationKeys.details(), id] as const,
  history: (id: string) => [...moderationKeys.detail(id), 'history'] as const,
  similar: (id: string) => [...moderationKeys.detail(id), 'similar'] as const,
}

export function useModerationQueue(params: ModerationQueueParams) {
  return useInfiniteQuery({
    queryKey: moderationKeys.queue(params),
    queryFn: ({ pageParam = 1 }) => getContentQueue({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1
      }
      return undefined
    },
    staleTime: 30 * 1000,
  })
}

export function useModerationQueuePaginated(params: ModerationQueueParams) {
  return useQuery({
    queryKey: moderationKeys.queue(params),
    queryFn: () => getContentQueue(params),
    staleTime: 30 * 1000,
  })
}

export function useContentReview(id: string) {
  return useQuery({
    queryKey: moderationKeys.detail(id),
    queryFn: () => getContentById(id),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
  })
}

export function useModerationHistory(id: string) {
  return useQuery({
    queryKey: moderationKeys.history(id),
    queryFn: () => getModerationHistory(id),
    enabled: Boolean(id),
  })
}

export function useSimilarContent(id: string) {
  return useQuery({
    queryKey: moderationKeys.similar(id),
    queryFn: () => getSimilarContent(id),
    enabled: Boolean(id),
  })
}

export function useModerateContent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      action,
      payload,
    }: {
      id: string
      action: 'approve' | 'reject' | 'escalate' | 'remove'
      payload: { reason: string; note?: string }
    }) => {
      switch (action) {
        case 'approve':
          return approveContent(id, payload)
        case 'reject':
          return rejectContent(id, payload)
        case 'escalate':
          return escalateContent(id, payload)
        case 'remove':
          return removeContent(id, payload)
      }
    },
    onSuccess: (updatedReport) => {
      if (updatedReport) {
        queryClient.setQueryData(moderationKeys.detail(updatedReport.id), updatedReport)
      }
      queryClient.invalidateQueries({ queryKey: moderationKeys.queues() })
    },
  })
}

export function useBulkModerate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: BulkModerationPayload) => bulkAction(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: moderationKeys.queues() })
    },
  })
}
