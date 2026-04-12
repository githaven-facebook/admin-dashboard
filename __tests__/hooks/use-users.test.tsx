import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as React from 'react'
import { useUsers, useUser } from '@/hooks/use-users'
import * as usersApi from '@/lib/api/users'
import type { UserListResponse, User } from '@/types/user'

vi.mock('@/lib/api/users')

const mockUser: User = {
  id: 'user-1',
  email: 'test@example.com',
  name: 'Test User',
  username: 'testuser',
  role: 'user',
  status: 'active',
  isVerified: false,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  lastActiveAt: '2024-03-01T00:00:00Z',
  followerCount: 100,
  followingCount: 50,
  postCount: 10,
  reportCount: 0,
}

const mockListResponse: UserListResponse = {
  users: [mockUser],
  total: 1,
  page: 1,
  limit: 20,
  totalPages: 1,
}

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

describe('useUsers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches users list successfully', async () => {
    vi.mocked(usersApi.getUsers).mockResolvedValue(mockListResponse)

    const { result } = renderHook(() => useUsers({ page: 1, limit: 20 }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.users).toHaveLength(1)
    expect(result.current.data?.users[0].name).toBe('Test User')
  })

  it('passes query params to the API', async () => {
    vi.mocked(usersApi.getUsers).mockResolvedValue(mockListResponse)

    renderHook(
      () => useUsers({ query: 'test', status: 'active', page: 2, limit: 10 }),
      { wrapper: createWrapper() }
    )

    await waitFor(() =>
      expect(usersApi.getUsers).toHaveBeenCalledWith({
        query: 'test',
        status: 'active',
        page: 2,
        limit: 10,
      })
    )
  })

  it('handles API errors', async () => {
    vi.mocked(usersApi.getUsers).mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useUsers({ page: 1, limit: 20 }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})

describe('useUser', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches a single user successfully', async () => {
    vi.mocked(usersApi.getUserById).mockResolvedValue(mockUser)

    const { result } = renderHook(() => useUser('user-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.id).toBe('user-1')
    expect(result.current.data?.name).toBe('Test User')
  })

  it('is disabled when no id is provided', () => {
    const { result } = renderHook(() => useUser(''), {
      wrapper: createWrapper(),
    })

    expect(result.current.fetchStatus).toBe('idle')
    expect(usersApi.getUserById).not.toHaveBeenCalled()
  })
})
