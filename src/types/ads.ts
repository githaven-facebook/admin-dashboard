export type AdReviewStatus =
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'under_review'
  | 'paused'
  | 'flagged'

export type AdObjective =
  | 'awareness'
  | 'traffic'
  | 'engagement'
  | 'leads'
  | 'app_promotion'
  | 'sales'

export type PolicyViolationType =
  | 'misleading_content'
  | 'prohibited_products'
  | 'targeting_violation'
  | 'image_violation'
  | 'text_violation'
  | 'landing_page_violation'
  | 'other'

export interface PolicyViolation {
  id: string
  type: PolicyViolationType
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  affectedElement: string
  policyReference: string
}

export interface AdCreative {
  id: string
  type: 'image' | 'video' | 'carousel' | 'collection'
  title: string
  body: string
  imageUrl?: string
  videoUrl?: string
  callToAction: string
  landingPageUrl: string
  displayUrl?: string
}

export interface AdTargeting {
  locations: string[]
  ageMin: number
  ageMax: number
  genders: string[]
  interests: string[]
  customAudiences: string[]
  estimatedReach: number
}

export interface AdCampaign {
  id: string
  name: string
  advertiserId: string
  advertiserName: string
  advertiserAccountStatus: 'active' | 'suspended' | 'flagged'
  objective: AdObjective
  status: AdReviewStatus
  budget: number
  currency: string
  startDate: string
  endDate?: string
  creative: AdCreative
  targeting: AdTargeting
  policyViolations: PolicyViolation[]
  reviewedBy?: string
  reviewedAt?: string
  rejectionReason?: string
  createdAt: string
  updatedAt: string
  impressions?: number
  clicks?: number
  spend?: number
}

export interface AdvertiserAccount {
  id: string
  name: string
  email: string
  businessName?: string
  status: 'active' | 'suspended' | 'flagged' | 'banned'
  totalCampaigns: number
  activeCampaigns: number
  totalSpend: number
  violationCount: number
  createdAt: string
}

export interface AdReviewQueueParams {
  status?: AdReviewStatus
  advertiserId?: string
  objective?: AdObjective
  hasViolations?: boolean
  page?: number
  limit?: number
  sortBy?: 'createdAt' | 'budget' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
}

export interface AdReviewPayload {
  action: 'approve' | 'reject' | 'flag'
  reason?: string
  policyViolations?: PolicyViolationType[]
  note?: string
}
