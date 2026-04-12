'use client'

import * as React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/lib/utils'
import type { ErrorRateData, LatencyData } from '@/types/system'

interface HealthTimelineProps {
  errorRates?: ErrorRateData[]
  latencyData?: LatencyData[]
  isLoading?: boolean
}

export function HealthTimeline({ errorRates, latencyData, isLoading = false }: HealthTimelineProps) {
  const groupedErrors = React.useMemo(() => {
    if (!errorRates) return []
    const byTime = new Map<string, Record<string, number>>()
    for (const d of errorRates) {
      const t = formatDate(d.timestamp, 'HH:mm')
      if (!byTime.has(t)) byTime.set(t, { time: 0 })
      const entry = byTime.get(t)!
      entry[d.serviceName] = d.errorRate
    }
    return Array.from(byTime.entries()).map(([time, vals]) => ({ time, ...vals }))
  }, [errorRates])

  const serviceNames = React.useMemo(() => {
    if (!errorRates) return []
    return [...new Set(errorRates.map((d) => d.serviceName))]
  }, [errorRates])

  const COLORS = ['#1877f2', '#42b883', '#ff6b35', '#9b59b6', '#e74c3c', '#1abc9c']

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Error Rates Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : groupedErrors.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-muted-foreground">
              No error rate data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={192}>
              <LineChart data={groupedErrors}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(v: number) => `${v.toFixed(2)}%`} />
                <Legend />
                {serviceNames.map((name, i) => (
                  <Line
                    key={name}
                    type="monotone"
                    dataKey={name}
                    stroke={COLORS[i % COLORS.length]}
                    dot={false}
                    strokeWidth={2}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {latencyData && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">P99 Latency (ms)</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={192}>
                <LineChart data={latencyData.slice(0, 30)}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="timestamp"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => formatDate(v, 'HH:mm')}
                  />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}ms`} />
                  <Tooltip formatter={(v: number) => `${v}ms`} />
                  <Legend />
                  <Line type="monotone" dataKey="p99" stroke="#e74c3c" name="P99" dot={false} strokeWidth={2} />
                  <Line type="monotone" dataKey="p95" stroke="#ff6b35" name="P95" dot={false} strokeWidth={2} />
                  <Line type="monotone" dataKey="avg" stroke="#1877f2" name="Avg" dot={false} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
