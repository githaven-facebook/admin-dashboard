'use client'

import * as React from 'react'
import { notFound } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { UserDetailCard } from '@/components/users/user-detail-card'
import { UserActions } from '@/components/users/user-actions'
import { DataTable } from '@/components/common/data-table'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useUser, useUserActivity } from '@/hooks/use-users'
import { formatDateTime } from '@/lib/utils'
import type { UserActivity } from '@/types/user'
import type { Column } from '@/components/common/data-table'

const activityColumns: Column<UserActivity>[] = [
  { key: 'action', header: 'Action', render: (v) => <span className="font-medium text-sm">{v as string}</span> },
  { key: 'details', header: 'Details', render: (v) => <span className="text-sm text-muted-foreground">{v as string}</span> },
  { key: 'ipAddress', header: 'IP Address', render: (v) => <span className="font-mono text-xs">{v as string}</span> },
  { key: 'createdAt', header: 'Time', render: (v) => <span className="text-sm text-muted-foreground">{formatDateTime(v as string)}</span> },
]

interface UserDetailPageProps {
  params: { id: string }
}

export default function UserDetailPage({ params }: UserDetailPageProps) {
  const { data: user, isLoading, isError } = useUser(params.id)
  const { data: activityData, isLoading: activityLoading } = useUserActivity(params.id, { limit: 20 })

  if (isError) notFound()

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-bold">User Details</h1>
              <p className="text-muted-foreground">View and manage user account</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                {isLoading ? (
                  <Skeleton className="h-64 rounded-lg" />
                ) : user ? (
                  <UserDetailCard user={user} />
                ) : null}

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DataTable
                      columns={activityColumns}
                      data={activityData?.activities ?? []}
                      isLoading={activityLoading}
                      emptyMessage="No activity found."
                      getRowId={(a) => a.id}
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                {isLoading ? (
                  <Skeleton className="h-48 rounded-lg" />
                ) : user ? (
                  <UserActions user={user} />
                ) : null}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
