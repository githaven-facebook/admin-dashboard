export type TimeRange = '7d' | '30d' | '90d' | '1y' | 'custom'

export interface DailyMetrics {
  date: string
  dau: number
  mau: number
  newUsers: number
  churned: number
  sessions: number
  avgSessionDuration: number
  pageViews: number
}

export interface EngagementData {
  date: string
  likes: number
  comments: number
  shares: number
  posts: number
  stories: number
  reactions: number
}

export interface RevenueData {
  date: string
  adRevenue: number
  totalRevenue: number
  impressions: number
  clicks: number
  ctr: number
  cpm: number
}

export interface TopContent {
  id: string
  type: 'post' | 'video' | 'story' | 'reel'
  title: string
  authorName: string
  authorAvatar?: string
  engagementCount: number
  viewCount: number
  shareCount: number
  createdAt: string
}

export interface MetricSummary {
  current: number
  previous: number
  changePercent: number
  changeDirection: 'up' | 'down' | 'flat'
}

export interface DashboardSummary {
  dau: MetricSummary
  mau: MetricSummary
  newUsers: MetricSummary
  revenue: MetricSummary
  pendingModerationCount: number
  activeAlertsCount: number
  adReviewQueueCount: number
}

export interface AnalyticsParams {
  timeRange: TimeRange
  startDate?: string
  endDate?: string
  granularity?: 'daily' | 'weekly' | 'monthly'
}
