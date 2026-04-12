export type ContentType = 'post' | 'comment' | 'photo' | 'video' | 'story' | 'reel'

export type ReportReason =
  | 'spam'
  | 'harassment'
  | 'hate_speech'
  | 'violence'
  | 'nudity'
  | 'misinformation'
  | 'copyright'
  | 'other'

export type ReportStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'escalated'

export type ModerationDecision = 'approve' | 'reject' | 'escalate' | 'remove'

export interface ContentReport {
  id: string
  contentId: string
  contentType: ContentType
  contentPreview: string
  contentUrl?: string
  authorId: string
  authorName: string
  authorAvatar?: string
  reporterId: string
  reporterName: string
  reason: ReportReason
  description?: string
  status: ReportStatus
  assignedTo?: string
  reportCount: number
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  resolvedBy?: string
  decision?: ModerationDecision
  moderationNote?: string
}

export interface ModerationAction {
  id: string
  reportId: string
  moderatorId: string
  moderatorName: string
  action: ModerationDecision
  reason: string
  note?: string
  createdAt: string
}

export interface ModerationQueue {
  items: ContentReport[]
  total: number
  pending: number
  underReview: number
  page: number
  limit: number
  totalPages: number
}

export interface ModerationQueueParams {
  status?: ReportStatus
  contentType?: ContentType
  reason?: ReportReason
  assignedTo?: string
  page?: number
  limit?: number
  sortBy?: 'createdAt' | 'reportCount' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
}

export interface BulkModerationPayload {
  reportIds: string[]
  action: ModerationDecision
  reason: string
  note?: string
}

export interface AppealRequest {
  id: string
  reportId: string
  userId: string
  userName: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  resolvedAt?: string
}
