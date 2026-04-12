'use client'

import * as React from 'react'
import Link from 'next/link'
import { notFound, useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle, XCircle, Flag } from 'lucide-react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { AdDetailPanel } from '@/components/ads/ad-detail-panel'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useAdCampaign, useReviewAd } from '@/hooks/use-ads'

interface AdDetailPageProps {
  params: { id: string }
}

export default function AdDetailPage({ params }: AdDetailPageProps) {
  const router = useRouter()
  const { data: campaign, isLoading, isError } = useAdCampaign(params.id)
  const reviewMutation = useReviewAd()
  const [rejectionReason, setRejectionReason] = React.useState('')
  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  if (isError) notFound()

  async function handleApprove() {
    if (!campaign) return
    try {
      await reviewMutation.mutateAsync({ id: campaign.id, action: 'approve', payload: { action: 'approve' } })
      setFeedback({ type: 'success', msg: 'Campaign approved successfully.' })
      setTimeout(() => router.push('/ads'), 1500)
    } catch {
      setFeedback({ type: 'error', msg: 'Action failed. Please try again.' })
    }
  }

  async function handleReject() {
    if (!campaign || !rejectionReason.trim()) return
    try {
      await reviewMutation.mutateAsync({
        id: campaign.id,
        action: 'reject',
        payload: { action: 'reject', reason: rejectionReason },
      })
      setFeedback({ type: 'success', msg: 'Campaign rejected.' })
      setTimeout(() => router.push('/ads'), 1500)
    } catch {
      setFeedback({ type: 'error', msg: 'Action failed. Please try again.' })
    }
  }

  const isPendingReview = campaign?.status === 'pending_review' || campaign?.status === 'under_review'

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <Button asChild variant="ghost" size="sm">
                <Link href="/ads">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Queue
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Ad Campaign Review</h1>
                <p className="text-xs text-muted-foreground font-mono">ID: {params.id}</p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                {isLoading ? (
                  <Skeleton className="h-96 rounded-lg" />
                ) : campaign ? (
                  <AdDetailPanel campaign={campaign} />
                ) : null}
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Review Decision</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {feedback && (
                      <div className={`rounded-md px-3 py-2 text-sm ${
                        feedback.type === 'success'
                          ? 'bg-green-50 text-green-800'
                          : 'bg-destructive/10 text-destructive'
                      }`}>
                        {feedback.msg}
                      </div>
                    )}

                    {!isPendingReview ? (
                      <div className="rounded-lg bg-muted/50 p-4 text-center text-sm text-muted-foreground">
                        This campaign has already been reviewed.
                      </div>
                    ) : (
                      <>
                        <Button
                          className="w-full gap-2"
                          onClick={handleApprove}
                          disabled={reviewMutation.isPending}
                        >
                          <CheckCircle className="h-4 w-4" />
                          Approve Campaign
                        </Button>

                        <div className="space-y-2">
                          <Input
                            placeholder="Rejection reason (required to reject)…"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                          />
                          <Button
                            variant="destructive"
                            className="w-full gap-2"
                            onClick={handleReject}
                            disabled={reviewMutation.isPending || !rejectionReason.trim()}
                          >
                            <XCircle className="h-4 w-4" />
                            Reject Campaign
                          </Button>
                        </div>

                        <Button
                          variant="outline"
                          className="w-full gap-2 text-orange-600"
                          onClick={() => {
                            if (campaign) {
                              reviewMutation.mutate({
                                id: campaign.id,
                                action: 'flag',
                                payload: { action: 'flag', reason: 'Flagged for policy review' },
                              })
                            }
                          }}
                          disabled={reviewMutation.isPending}
                        >
                          <Flag className="h-4 w-4" />
                          Flag for Policy Review
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
