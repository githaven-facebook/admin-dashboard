import * as React from 'react'
import { CheckCircle, AlertTriangle, XCircle, HelpCircle, Clock, Wrench } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatRelativeTime } from '@/lib/utils'
import type { ServiceHealth, ServiceStatus } from '@/types/system'

const statusConfig: Record<ServiceStatus, {
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
  label: string
}> = {
  healthy: { icon: CheckCircle, color: 'text-green-500', bgColor: 'bg-green-50 dark:bg-green-900/20', label: 'Healthy' },
  degraded: { icon: AlertTriangle, color: 'text-yellow-500', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20', label: 'Degraded' },
  down: { icon: XCircle, color: 'text-red-500', bgColor: 'bg-red-50 dark:bg-red-900/20', label: 'Down' },
  unknown: { icon: HelpCircle, color: 'text-gray-400', bgColor: 'bg-gray-50 dark:bg-gray-900/20', label: 'Unknown' },
  maintenance: { icon: Wrench, color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/20', label: 'Maintenance' },
}

interface ServiceStatusGridProps {
  services: ServiceHealth[]
  isLoading?: boolean
}

export function ServiceStatusGrid({ services, isLoading = false }: ServiceStatusGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-lg" />
        ))}
      </div>
    )
  }

  if (services.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border py-12 text-muted-foreground">
        No services found
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => {
        const config = statusConfig[service.status] ?? statusConfig.unknown
        const Icon = config.icon

        return (
          <Card key={service.id} className={`border-l-4 ${
            service.status === 'healthy' ? 'border-l-green-500' :
            service.status === 'degraded' ? 'border-l-yellow-500' :
            service.status === 'down' ? 'border-l-red-500' :
            service.status === 'maintenance' ? 'border-l-blue-500' :
            'border-l-gray-300'
          }`}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">{service.name}</CardTitle>
                <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${config.bgColor} ${config.color}`}>
                  <Icon className="h-3 w-3" />
                  {config.label}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{service.description}</p>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Uptime</p>
                  <p className="text-sm font-semibold">{service.uptimePercent.toFixed(2)}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Latency</p>
                  <p className="text-sm font-semibold">{service.avgLatencyMs}ms</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Error Rate</p>
                  <p className={`text-sm font-semibold ${service.errorRate > 1 ? 'text-destructive' : ''}`}>
                    {service.errorRate.toFixed(2)}%
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatRelativeTime(service.checks[0]?.checkedAt ?? service.lastDeployedAt)}
                </span>
                <span>v{service.version}</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
