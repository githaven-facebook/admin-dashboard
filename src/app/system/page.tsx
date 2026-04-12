'use client'

import * as React from 'react'
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { ServiceStatusGrid } from '@/components/system/service-status-grid'
import { HealthTimeline } from '@/components/system/health-timeline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useQuery } from '@tanstack/react-query'
import { getServiceHealth, getSystemHealthSummary, getAlerts, getErrorRates } from '@/lib/api/system'
import { formatRelativeTime } from '@/lib/utils'
import type { AlertSeverity } from '@/types/system'

const alertSeverityConfig: Record<AlertSeverity, { color: string; icon: React.ComponentType<{ className?: string }> }> = {
  info: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  warning: { color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle },
  error: { color: 'bg-orange-100 text-orange-800', icon: AlertTriangle },
  critical: { color: 'bg-red-100 text-red-800', icon: XCircle },
}

export default function SystemPage() {
  const now = new Date()
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString()

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['system', 'summary'],
    queryFn: getSystemHealthSummary,
    refetchInterval: 30 * 1000,
  })

  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ['system', 'services'],
    queryFn: getServiceHealth,
    refetchInterval: 30 * 1000,
  })

  const { data: alertsData, isLoading: alertsLoading } = useQuery({
    queryKey: ['system', 'alerts'],
    queryFn: () => getAlerts({ resolved: false, limit: 10 }),
  })

  const { data: errorRates, isLoading: errorRatesLoading } = useQuery({
    queryKey: ['system', 'error-rates'],
    queryFn: () => getErrorRates({ startTime: oneHourAgo, endTime: now.toISOString() }),
  })

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">System Health</h1>
                <p className="text-muted-foreground">Real-time service monitoring</p>
              </div>
              {summaryLoading ? (
                <Skeleton className="h-8 w-32" />
              ) : summary && (
                <div className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium ${
                  summary.overallStatus === 'healthy' ? 'bg-green-100 text-green-800' :
                  summary.overallStatus === 'degraded' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {summary.overallStatus === 'healthy' ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                  <span className="capitalize">{summary.overallStatus}</span>
                </div>
              )}
            </div>

            {/* Summary stats */}
            {summary && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: 'Total Services', value: summary.totalServices },
                  { label: 'Healthy', value: summary.healthyServices, color: 'text-green-600' },
                  { label: 'Degraded', value: summary.degradedServices, color: 'text-yellow-600' },
                  { label: 'Down', value: summary.downServices, color: 'text-red-600' },
                ].map((stat) => (
                  <Card key={stat.label}>
                    <CardContent className="p-4 text-center">
                      <div className={`text-3xl font-bold ${stat.color ?? ''}`}>{stat.value}</div>
                      <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div>
              <h2 className="text-lg font-semibold mb-3">Service Status</h2>
              <ServiceStatusGrid services={services ?? []} isLoading={servicesLoading} />
            </div>

            <HealthTimeline errorRates={errorRates} isLoading={errorRatesLoading} />

            {/* Active alerts */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Active Alerts</CardTitle>
                  {alertsData?.total != null && alertsData.total > 0 && (
                    <Badge variant="destructive">{alertsData.total}</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {alertsLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
                  </div>
                ) : !alertsData?.alerts.length ? (
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    No active alerts
                  </div>
                ) : (
                  <div className="space-y-2">
                    {alertsData.alerts.map((alert) => {
                      const config = alertSeverityConfig[alert.severity]
                      const Icon = config.icon
                      return (
                        <div
                          key={alert.id}
                          className={`flex items-start gap-3 rounded-lg p-3 ${config.color}`}
                        >
                          <Icon className="h-4 w-4 mt-0.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{alert.title}</span>
                              {alert.serviceName && (
                                <Badge variant="outline" className="text-xs">{alert.serviceName}</Badge>
                              )}
                            </div>
                            <p className="text-xs mt-0.5 opacity-80">{alert.description}</p>
                            <p className="text-xs mt-1 opacity-60">{formatRelativeTime(alert.triggeredAt)}</p>
                          </div>
                          {alert.runbook && (
                            <Button
                              asChild
                              variant="ghost"
                              size="sm"
                              className="shrink-0 text-xs h-7"
                            >
                              <a href={alert.runbook} target="_blank" rel="noopener noreferrer">
                                Runbook
                              </a>
                            </Button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
