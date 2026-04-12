'use client'

import * as React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { ContentReviewCard } from '@/components/moderation/content-review-card'
import { ModerationActions } from '@/components/moderation/moderation-actions'
import { ContentQueue } from '@/components/moderation/content-queue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useContentReview, useSimilarContent } from '@/hooks/use-moderation'

interface ContentDetailPageProps {
  params: { id: string }
}

export default function ContentDetailPage({ params }: ContentDetailPageProps) {
  const { data: report, isLoading, isError } = useContentReview(params.id)
  const { data: similar } = useSimilarContent(params.id)

  if (isError) notFound()

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <Button asChild variant="ghost" size="sm">
                <Link href="/moderation">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Queue
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Content Review</h1>
                <p className="text-xs text-muted-foreground font-mono">ID: {params.id}</p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                {isLoading ? (
                  <>
                    <Skeleton className="h-48 rounded-lg" />
                    <Skeleton className="h-32 rounded-lg" />
                  </>
                ) : report ? (
                  <ContentReviewCard report={report} />
                ) : null}

                {similar && similar.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Similar Content</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ContentQueue reports={similar.slice(0, 3)} />
                    </CardContent>
                  </Card>
                )}
              </div>

              <div>
                {isLoading ? (
                  <Skeleton className="h-64 rounded-lg" />
                ) : report ? (
                  <ModerationActions report={report} />
                ) : null}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
