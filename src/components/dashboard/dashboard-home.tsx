'use client'

import * as React from 'react'
import Link from 'next/link'
import { Users, Shield, Megaphone, AlertTriangle } from 'lucide-react'
import { MetricCard } from '@/components/analytics/metric-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useDashboardSummary } from '@/hooks/use-analytics'
import { formatRelativeTime } from '@/lib/utils'

const quickLinks = [
  { href: '/users', label: 'Manage Users', icon: Users, description: 'Search, suspend, ban' },
  { href: '/moderation', label: 'Moderation Queue', icon: Shield, description: 'Review reports' },
  { href: '/ads', label: 'Ad Review', icon: Megaphone, description: 'Approve campaigns' },
]

export function DashboardHome() {
  const { data: summary, isLoading } = useDashboardSummary()
  const now = new Date().toISOString()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back. Here&apos;s what&apos;s happening on the platform.
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Daily Active Users"
          metric={summary?.dau}
          isLoading={isLoading}
          format="compact"
          icon={Users}
        />
        <MetricCard
          title="Monthly Active Users"
          metric={summary?.mau}
          isLoading={isLoading}
          format="compact"
        />
        <MetricCard
          title="New Users"
          metric={summary?.newUsers}
          isLoading={isLoading}
          format="compact"
        />
        <MetricCard
          title="Revenue"
          metric={summary?.revenue}
          isLoading={isLoading}
          format="currency"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Moderation queue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Moderation Queue</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              <>
                <div className="text-3xl font-bold">
                  {summary?.pendingModerationCount ?? 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">items pending review</p>
                <Button asChild size="sm" className="mt-4 w-full" variant="outline">
                  <Link href="/moderation">Review Queue</Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Ad review queue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ad Review Queue</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              <>
                <div className="text-3xl font-bold">
                  {summary?.adReviewQueueCount ?? 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">campaigns pending approval</p>
                <Button asChild size="sm" className="mt-4 w-full" variant="outline">
                  <Link href="/ads">Review Ads</Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Active alerts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <div className="text-3xl font-bold">{summary?.activeAlertsCount ?? 0}</div>
                  {(summary?.activeAlertsCount ?? 0) > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      Action needed
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">active system alerts</p>
                <Button asChild size="sm" className="mt-4 w-full" variant="outline">
                  <Link href="/system">View System</Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {quickLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 rounded-lg border bg-card p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-facebook-100">
                  <Icon className="h-5 w-5 text-facebook-500" />
                </div>
                <div>
                  <div className="font-medium text-sm">{link.label}</div>
                  <div className="text-xs text-muted-foreground">{link.description}</div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Last updated {formatRelativeTime(now)}
      </p>
    </div>
  )
}
