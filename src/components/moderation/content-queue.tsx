'use client'

import * as React from 'react'
import Link from 'next/link'
import { Flag, Eye, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { StatusBadge } from '@/components/common/status-badge'
import { formatRelativeTime, truncate } from '@/lib/utils'
import type { ContentReport } from '@/types/moderation'

const reasonLabels: Record<string, string> = {
  spam: 'Spam',
  harassment: 'Harassment',
  hate_speech: 'Hate Speech',
  violence: 'Violence',
  nudity: 'Nudity',
  misinformation: 'Misinformation',
  copyright: 'Copyright',
  other: 'Other',
}

const contentTypeColors: Record<string, string> = {
  post: 'bg-blue-100 text-blue-700',
  comment: 'bg-purple-100 text-purple-700',
  photo: 'bg-green-100 text-green-700',
  video: 'bg-orange-100 text-orange-700',
  story: 'bg-pink-100 text-pink-700',
  reel: 'bg-cyan-100 text-cyan-700',
}

interface ContentQueueProps {
  reports: ContentReport[]
  isLoading?: boolean
  selectedIds?: Set<string>
  onSelectItem?: (id: string, checked: boolean) => void
}

export function ContentQueue({
  reports,
  isLoading = false,
  selectedIds,
  onSelectItem,
}: ContentQueueProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-lg" />
        ))}
      </div>
    )
  }

  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border py-16 text-center">
        <Flag className="h-10 w-10 text-muted-foreground mb-3" />
        <p className="text-muted-foreground">No reports in queue</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {reports.map((report) => (
        <Card key={report.id} className="hover:bg-muted/30 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {onSelectItem && (
                <input
                  type="checkbox"
                  checked={selectedIds?.has(report.id) ?? false}
                  onChange={(e) => onSelectItem(report.id, e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300"
                  aria-label={`Select report ${report.id}`}
                />
              )}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium capitalize ${contentTypeColors[report.contentType] ?? 'bg-gray-100 text-gray-700'}`}
                  >
                    {report.contentType}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {reasonLabels[report.reason] ?? report.reason}
                  </Badge>
                  <StatusBadge status={report.status} />
                  {report.reportCount > 1 && (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Flag className="h-3 w-3" />
                      {report.reportCount} reports
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {truncate(report.contentPreview, 200)}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>By <strong className="text-foreground">{report.authorName}</strong></span>
                  <span>Reported by {report.reporterName}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatRelativeTime(report.createdAt)}
                  </span>
                </div>
              </div>
              <Button asChild variant="ghost" size="sm" className="shrink-0">
                <Link href={`/moderation/${report.id}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
