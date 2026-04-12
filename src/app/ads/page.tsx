'use client'

import * as React from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { AdReviewTable } from '@/components/ads/ad-review-table'
import { Pagination } from '@/components/common/pagination'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useAdReviewQueue, useReviewAd } from '@/hooks/use-ads'
import type { AdCampaign, AdReviewStatus } from '@/types/ads'

const PAGE_SIZE = 20

export default function AdsPage() {
  const [status, setStatus] = React.useState<AdReviewStatus | 'all'>('pending_review')
  const [hasViolations, setHasViolations] = React.useState<boolean | undefined>(undefined)
  const [page, setPage] = React.useState(1)
  const [sortBy, setSortBy] = React.useState('createdAt')
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc')
  const [approveTarget, setApproveTarget] = React.useState<AdCampaign | null>(null)
  const [rejectTarget, setRejectTarget] = React.useState<AdCampaign | null>(null)

  const { data, isLoading } = useAdReviewQueue({
    status: status === 'all' ? undefined : status,
    hasViolations,
    page,
    limit: PAGE_SIZE,
    sortBy: sortBy as 'createdAt' | 'budget' | 'updatedAt',
    sortOrder,
  })

  const reviewMutation = useReviewAd()

  function handleSort(key: string) {
    if (sortBy === key) {
      setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(key)
      setSortOrder('desc')
    }
    setPage(1)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold">Ad Review Queue</h1>
              <p className="text-muted-foreground">
                {data?.total != null ? (
                  <>
                    {data.total.toLocaleString()} campaigns
                    {status === 'pending_review' && data.total > 0 && (
                      <Badge variant="destructive" className="ml-2 text-xs">
                        Needs review
                      </Badge>
                    )}
                  </>
                ) : (
                  'Review and approve ad campaigns'
                )}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Select
                value={status}
                onValueChange={(v) => { setStatus(v as AdReviewStatus | 'all'); setPage(1) }}
              >
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending_review">Pending Review</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={hasViolations === undefined ? 'all' : String(hasViolations)}
                onValueChange={(v) => {
                  setHasViolations(v === 'all' ? undefined : v === 'true')
                  setPage(1)
                }}
              >
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Policy violations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Campaigns</SelectItem>
                  <SelectItem value="true">Has Violations</SelectItem>
                  <SelectItem value="false">No Violations</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <AdReviewTable
              campaigns={data?.campaigns ?? []}
              isLoading={isLoading}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
              onApprove={setApproveTarget}
              onReject={setRejectTarget}
            />

            {data && data.totalPages > 1 && (
              <div className="flex justify-center pt-2">
                <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
              </div>
            )}
          </div>
        </main>
      </div>

      <ConfirmDialog
        open={Boolean(approveTarget)}
        onOpenChange={(o) => !o && setApproveTarget(null)}
        title="Approve Campaign"
        description={`Approve "${approveTarget?.name}"? It will go live per its scheduled start date.`}
        confirmLabel="Approve"
        isLoading={reviewMutation.isPending}
        onConfirm={() => {
          if (approveTarget) {
            reviewMutation.mutate(
              { id: approveTarget.id, action: 'approve', payload: { action: 'approve' } },
              { onSuccess: () => setApproveTarget(null) }
            )
          }
        }}
      />

      <ConfirmDialog
        open={Boolean(rejectTarget)}
        onOpenChange={(o) => !o && setRejectTarget(null)}
        title="Reject Campaign"
        description={`Reject "${rejectTarget?.name}"? The advertiser will be notified.`}
        confirmLabel="Reject"
        variant="destructive"
        isLoading={reviewMutation.isPending}
        onConfirm={() => {
          if (rejectTarget) {
            reviewMutation.mutate(
              {
                id: rejectTarget.id,
                action: 'reject',
                payload: { action: 'reject', reason: 'Does not meet advertising policies' },
              },
              { onSuccess: () => setRejectTarget(null) }
            )
          }
        }}
      />
    </div>
  )
}
