export type UserRole = 'super_admin' | 'content_moderator' | 'ad_reviewer' | 'analyst' | 'user'

export type UserStatus = 'active' | 'suspended' | 'banned' | 'pending_verification' | 'deactivated'

export interface User {
  id: string
  email: string
  name: string
  username: string
  avatar?: string
  role: UserRole
  status: UserStatus
  isVerified: boolean
  createdAt: string
  updatedAt: string
  lastActiveAt: string
  profileUrl?: string
  location?: string
  bio?: string
  followerCount: number
  followingCount: number
  postCount: number
  reportCount: number
  linkedAccounts?: LinkedAccount[]
}

export interface LinkedAccount {
  id: string
  provider: string
  accountId: string
  connectedAt: string
}

export interface UserActivity {
  id: string
  userId: string
  action: string
  details: string
  ipAddress: string
  userAgent: string
  createdAt: string
}

export interface UserSearchParams {
  query?: string
  status?: UserStatus
  role?: UserRole
  page?: number
  limit?: number
  sortBy?: 'name' | 'email' | 'createdAt' | 'lastActiveAt' | 'reportCount'
  sortOrder?: 'asc' | 'desc'
  isVerified?: boolean
  createdAfter?: string
  createdBefore?: string
}

export interface UserListResponse {
  users: User[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface UserUpdatePayload {
  name?: string
  role?: UserRole
  status?: UserStatus
  isVerified?: boolean
}

export interface SuspendUserPayload {
  reason: string
  durationDays?: number
  notifyUser: boolean
}

export interface BanUserPayload {
  reason: string
  notifyUser: boolean
  appealable: boolean
}
