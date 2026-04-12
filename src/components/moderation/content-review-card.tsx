import * as React from 'react'
import { Flag, User, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/common/status-badge'
import { formatDateTime } from '@/lib/utils'
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

interface ContentReviewCardProps {
  report: ContentReport
}

export function ContentReviewCard({ report }: ContentReviewCardProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Content Preview</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="capitalize">{report.contentType}</Badge>
              <StatusBadge status={report.status} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm whitespace-pre-wrap">{report.contentPreview}</p>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>Posted by <strong className="text-foreground">{report.authorName}</strong></span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Report Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Reason</p>
              <Badge variant="outline">{reasonLabels[report.reason] ?? report.reason}</Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Total Reports</p>
              <div className="flex items-center gap-1 font-medium">
                <Flag className="h-4 w-4 text-destructive" />
                {report.reportCount}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Reported By</p>
              <p className="font-medium">{report.reporterName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Reported At</p>
              <p className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatDateTime(report.createdAt)}
              </p>
            </div>
          </div>
          {report.description && (
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Additional Context</p>
              <p className="text-sm">{report.description}</p>
            </div>
          )}
          {report.moderationNote && (
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Moderation Note</p>
              <p className="text-sm text-muted-foreground">{report.moderationNote}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
