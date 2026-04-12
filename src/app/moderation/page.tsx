'use client'

import * as React from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { ContentQueue } from '@/components/moderation/content-queue'
import { Pagination } from '@/components/common/pagination'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useModerationQueuePaginated, useBulkModerate } from '@/hooks/use-moderation'
import type { ReportStatus, ContentType, ReportReason } from '@/types/moderation'

const PAGE_SIZE = 20

export default function ModerationPage() {
  const [status, setStatus] = React.useState<ReportStatus | 'all'>('pending')
  const [contentType, setContentType] = React.useState<ContentType | 'all'>('all')
  const [reason, setReason] = React.useState<ReportReason | 'all'>('all')
  const [page, setPage] = React.useState(1)
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())

  const { data, isLoading } = useModerationQueuePaginated({
    status: status === 'all' ? undefined : status,
    contentType: contentType === 'all' ? undefined : contentType,
    reason: reason === 'all' ? undefined : reason,
    page,
    limit: PAGE_SIZE,
    sortBy: 'createdAt',
    sortOrder: 'asc',
  })

  const bulkMutation = useBulkModerate()

  function handleSelectItem(id: string, checked: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  async function handleBulkAction(action: 'approve' | 'reject') {
    if (selectedIds.size === 0) return
    await bulkMutation.mutateAsync({
      reportIds: Array.from(selectedIds),
      action,
      reason: action === 'approve' ? 'Bulk approved' : 'Bulk rejected',
    })
    setSelectedIds(new Set())
  }

  const reports = data?.items ?? []

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold">Moderation Queue</h1>
                <p className="text-muted-foreground">
                  {data?.total != null ? (
                    <>
                      {data.total.toLocaleString()} reports
                      {data.pending > 0 && (
                        <Badge variant="destructive" className="ml-2 text-xs">
                          {data.pending} pending
                        </Badge>
                      )}
                    </>
                  ) : (
                    'Review reported content'
                  )}
                </p>
              </div>

              {selectedIds.size > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {selectedIds.size} selected
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkAction('approve')}
                    disabled={bulkMutation.isPending}
                  >
                    Approve All
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleBulkAction('reject')}
                    disabled={bulkMutation.isPending}
                  >
                    Reject All
                  </Button>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <Select
                value={status}
                onValueChange={(v) => { setStatus(v as ReportStatus | 'all'); setPage(1) }}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="escalated">Escalated</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={contentType}
                onValueChange={(v) => { setContentType(v as ContentType | 'all'); setPage(1) }}
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="post">Post</SelectItem>
                  <SelectItem value="comment">Comment</SelectItem>
                  <SelectItem value="photo">Photo</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="story">Story</SelectItem>
                  <SelectItem value="reel">Reel</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={reason}
                onValueChange={(v) => { setReason(v as ReportReason | 'all'); setPage(1) }}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reasons</SelectItem>
                  <SelectItem value="spam">Spam</SelectItem>
                  <SelectItem value="harassment">Harassment</SelectItem>
                  <SelectItem value="hate_speech">Hate Speech</SelectItem>
                  <SelectItem value="violence">Violence</SelectItem>
                  <SelectItem value="nudity">Nudity</SelectItem>
                  <SelectItem value="misinformation">Misinformation</SelectItem>
                  <SelectItem value="copyright">Copyright</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <ContentQueue
              reports={reports}
              isLoading={isLoading}
              selectedIds={selectedIds}
              onSelectItem={handleSelectItem}
            />

            {data && data.totalPages > 1 && (
              <div className="flex justify-center pt-2">
                <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
