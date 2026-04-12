'use client'

import * as React from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate, formatNumber } from '@/lib/utils'
import type { EngagementData } from '@/types/analytics'

interface EngagementChartProps {
  data?: EngagementData[]
  isLoading?: boolean
  chartType?: 'line' | 'bar'
  title?: string
}

export function EngagementChart({
  data,
  isLoading = false,
  chartType = 'line',
  title = 'Engagement Overview',
}: EngagementChartProps) {
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
        ) : chartType === 'bar' ? (
          <ResponsiveContainer width="100%" height={256}>
            <BarChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => formatNumber(v, true)} />
              <Tooltip formatter={(v: number) => formatNumber(v)} />
              <Legend />
              <Bar dataKey="likes" fill="#1877f2" name="Likes" radius={[2, 2, 0, 0]} />
              <Bar dataKey="comments" fill="#42b883" name="Comments" radius={[2, 2, 0, 0]} />
              <Bar dataKey="shares" fill="#ff6b35" name="Shares" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={256}>
            <LineChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => formatNumber(v, true)} />
              <Tooltip formatter={(v: number) => formatNumber(v)} />
              <Legend />
              <Line
                type="monotone"
                dataKey="likes"
                stroke="#1877f2"
                name="Likes"
                dot={false}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="comments"
                stroke="#42b883"
                name="Comments"
                dot={false}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="shares"
                stroke="#ff6b35"
                name="Shares"
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
