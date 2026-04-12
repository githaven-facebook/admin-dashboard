'use client'

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'
import {
  getUsers,
  getUserById,
  updateUser,
  suspendUser,
  unsuspendUser,
  banUser,
  unbanUser,
  verifyUser,
  assignRole,
  getUserActivity,
} from '@/lib/api/users'
import type {
  UserSearchParams,
  UserUpdatePayload,
  SuspendUserPayload,
  BanUserPayload,
  User,
} from '@/types/user'

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params: UserSearchParams) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  activity: (id: string) => [...userKeys.detail(id), 'activity'] as const,
}

export function useUsers(params: UserSearchParams) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => getUsers(params),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => getUserById(id),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
  })
}

export function useUserActivity(id: string, params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: [...userKeys.activity(id), params],
    queryFn: () => getUserActivity(id, params),
    enabled: Boolean(id),
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UserUpdatePayload }) =>
      updateUser(id, payload),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser)
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

export function useSuspendUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: SuspendUserPayload }) =>
      suspendUser(id, payload),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: userKeys.detail(id) })
      const previousUser = queryClient.getQueryData<User>(userKeys.detail(id))
      queryClient.setQueryData(userKeys.detail(id), (old: User | undefined) =>
        old ? { ...old, status: 'suspended' as const } : old
      )
      return { previousUser }
    },
    onError: (_err, { id }, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(userKeys.detail(id), context.previousUser)
      }
    },
    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

export function useUnsuspendUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => unsuspendUser(id),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser)
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

export function useBanUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: BanUserPayload }) =>
      banUser(id, payload),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: userKeys.detail(id) })
      const previousUser = queryClient.getQueryData<User>(userKeys.detail(id))
      queryClient.setQueryData(userKeys.detail(id), (old: User | undefined) =>
        old ? { ...old, status: 'banned' as const } : old
      )
      return { previousUser }
    },
    onError: (_err, { id }, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(userKeys.detail(id), context.previousUser)
      }
    },
    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

export function useUnbanUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => unbanUser(id),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser)
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

export function useVerifyUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => verifyUser(id),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser)
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

export function useAssignRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: User['role'] }) => assignRole(id, role),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser)
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}
