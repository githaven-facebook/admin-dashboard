'use client'

import * as React from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { MetricCard } from '@/components/analytics/metric-card'
import { EngagementChart } from '@/components/analytics/engagement-chart'
import { RevenueChart } from '@/components/analytics/revenue-chart'
import { DataTable } from '@/components/common/data-table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useDashboardSummary, useDailyMetrics, useEngagementData, useRevenueData, useTopContent } from '@/hooks/use-analytics'
import { formatDate, formatNumber } from '@/lib/utils'
import type { TimeRange } from '@/types/analytics'
import type { Column } from '@/components/common/data-table'

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = React.useState<TimeRange>('30d')

  const { data: summary, isLoading: summaryLoading } = useDashboardSummary()
  const { data: engagementData, isLoading: engagementLoading } = useEngagementData({ timeRange })
  const { data: revenueData, isLoading: revenueLoading } = useRevenueData({ timeRange })
  const { data: topContent, isLoading: topContentLoading } = useTopContent({ timeRange, limit: 10 })

  const topContentColumns: Column<NonNullable<typeof topContent>[number]>[] = [
    { key: 'title', header: 'Content', sortable: false, render: (_, row) => (
      <div>
        <div className="font-medium text-sm">{row.title}</div>
        <div className="text-xs text-muted-foreground">{row.type} · {row.authorName}</div>
      </div>
    )},
    { key: 'viewCount', header: 'Views', sortable: true, render: (v) => formatNumber(v as number, true) },
    { key: 'engagementCount', header: 'Engagements', sortable: true, render: (v) => formatNumber(v as number, true) },
    { key: 'shareCount', header: 'Shares', sortable: true, render: (v) => formatNumber(v as number, true) },
    { key: 'createdAt', header: 'Date', render: (v) => formatDate(v as string) },
  ]

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Analytics</h1>
                <p className="text-muted-foreground">Platform performance metrics</p>
              </div>
              <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard title="Daily Active Users" metric={summary?.dau} isLoading={summaryLoading} format="compact" />
              <MetricCard title="Monthly Active Users" metric={summary?.mau} isLoading={summaryLoading} format="compact" />
              <MetricCard title="New Users" metric={summary?.newUsers} isLoading={summaryLoading} format="compact" />
              <MetricCard title="Revenue" metric={summary?.revenue} isLoading={summaryLoading} format="currency" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <EngagementChart data={engagementData} isLoading={engagementLoading} chartType="line" title="Engagement Trends" />
              <EngagementChart data={engagementData} isLoading={engagementLoading} chartType="bar" title="Engagement Breakdown" />
            </div>

            <RevenueChart data={revenueData} isLoading={revenueLoading} title="Revenue Over Time" />

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top Content</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={topContentColumns}
                  data={topContent ?? []}
                  isLoading={topContentLoading}
                  emptyMessage="No content data available."
                  getRowId={(row) => row.id}
                />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
