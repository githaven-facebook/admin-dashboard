'use client'

import * as React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate, formatCurrency, formatNumber } from '@/lib/utils'
import type { RevenueData } from '@/types/analytics'

interface RevenueChartProps {
  data?: RevenueData[]
  isLoading?: boolean
  title?: string
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number; name: string }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border bg-background p-3 shadow-sm">
      <p className="mb-2 text-sm font-medium">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-sm text-muted-foreground">
          {entry.name}:{' '}
          <span className="font-medium text-foreground">
            {entry.name === 'Ad Revenue' || entry.name === 'Total Revenue'
              ? formatCurrency(entry.value)
              : formatNumber(entry.value)}
          </span>
        </p>
      ))}
    </div>
  )
}

export function RevenueChart({ data, isLoading = false, title = 'Revenue' }: RevenueChartProps) {
  const formattedData = data?.map((d) => ({
    ...d,
    date: formatDate(d.date, 'MMM d'),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : !formattedData?.length ? (
          <div className="flex h-64 items-center justify-center text-muted-foreground">
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={256}>
            <AreaChart data={formattedData}>
              <defs>
                <linearGradient id="totalRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1877f2" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#1877f2" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="adRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#42b883" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#42b883" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `$${formatNumber(v, true)}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="totalRevenue"
                stroke="#1877f2"
                fill="url(#totalRevenue)"
                name="Total Revenue"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="adRevenue"
                stroke="#42b883"
                fill="url(#adRevenue)"
                name="Ad Revenue"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
