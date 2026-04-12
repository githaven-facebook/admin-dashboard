import apiClient from './client'
import type {
  User,
  UserActivity,
  UserListResponse,
  UserSearchParams,
  UserUpdatePayload,
  SuspendUserPayload,
  BanUserPayload,
} from '@/types/user'

export async function getUsers(params: UserSearchParams): Promise<UserListResponse> {
  const { data } = await apiClient.get<UserListResponse>('/users', { params })
  return data
}

export async function getUserById(id: string): Promise<User> {
  const { data } = await apiClient.get<User>(`/users/${id}`)
  return data
}

export async function updateUser(id: string, payload: UserUpdatePayload): Promise<User> {
  const { data } = await apiClient.patch<User>(`/users/${id}`, payload)
  return data
}

export async function suspendUser(id: string, payload: SuspendUserPayload): Promise<User> {
  const { data } = await apiClient.post<User>(`/users/${id}/suspend`, payload)
  return data
}

export async function unsuspendUser(id: string): Promise<User> {
  const { data } = await apiClient.post<User>(`/users/${id}/unsuspend`)
  return data
}

export async function banUser(id: string, payload: BanUserPayload): Promise<User> {
  const { data } = await apiClient.post<User>(`/users/${id}/ban`, payload)
  return data
}

export async function unbanUser(id: string): Promise<User> {
  const { data } = await apiClient.post<User>(`/users/${id}/unban`)
  return data
}

export async function verifyUser(id: string): Promise<User> {
  const { data } = await apiClient.post<User>(`/users/${id}/verify`)
  return data
}

export async function assignRole(
  id: string,
  role: User['role']
): Promise<User> {
  const { data } = await apiClient.post<User>(`/users/${id}/role`, { role })
  return data
}

export async function getUserActivity(
  id: string,
  params?: { page?: number; limit?: number }
): Promise<{ activities: UserActivity[]; total: number }> {
  const { data } = await apiClient.get<{ activities: UserActivity[]; total: number }>(
    `/users/${id}/activity`,
    { params }
  )
  return data
}
