import * as React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn, formatNumber, formatCurrency } from '@/lib/utils'
import type { MetricSummary } from '@/types/analytics'

interface MetricCardProps {
  title: string
  metric?: MetricSummary
  isLoading?: boolean
  format?: 'number' | 'currency' | 'compact'
  icon?: React.ComponentType<{ className?: string }>
  className?: string
}

export function MetricCard({
  title,
  metric,
  isLoading = false,
  format = 'compact',
  icon: Icon,
  className,
}: MetricCardProps) {
  function formatValue(value: number) {
    switch (format) {
      case 'currency':
        return formatCurrency(value)
      case 'number':
        return formatNumber(value)
      case 'compact':
      default:
        return formatNumber(value, true)
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        ) : metric ? (
          <>
            <div className="text-2xl font-bold">{formatValue(metric.current)}</div>
            <div className="flex items-center gap-1 mt-1">
              {metric.changeDirection === 'up' ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : metric.changeDirection === 'down' ? (
                <TrendingDown className="h-4 w-4 text-red-500" />
              ) : (
                <Minus className="h-4 w-4 text-muted-foreground" />
              )}
              <span
                className={cn(
                  'text-xs font-medium',
                  metric.changeDirection === 'up' && 'text-green-500',
                  metric.changeDirection === 'down' && 'text-red-500',
                  metric.changeDirection === 'flat' && 'text-muted-foreground'
                )}
              >
                {metric.changePercent >= 0 ? '+' : ''}
                {metric.changePercent.toFixed(1)}%
              </span>
              <span className="text-xs text-muted-foreground">vs last period</span>
            </div>
          </>
        ) : (
          <div className="text-2xl font-bold text-muted-foreground">—</div>
        )}
      </CardContent>
    </Card>
  )
}
