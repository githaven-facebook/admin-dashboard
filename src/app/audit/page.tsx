'use client'

import * as React from 'react'
import { Download } from 'lucide-react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { DataTable } from '@/components/common/data-table'
import { SearchInput } from '@/components/common/search-input'
import { Pagination } from '@/components/common/pagination'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useQuery } from '@tanstack/react-query'
import { getAuditLogs, exportAuditLogs, type AuditLog } from '@/lib/api/audit'
import { formatDateTime } from '@/lib/utils'
import type { Column } from '@/components/common/data-table'

const PAGE_SIZE = 50

const actionColors: Record<string, string> = {
  user_suspended: 'bg-yellow-100 text-yellow-800',
  user_banned: 'bg-red-100 text-red-800',
  user_verified: 'bg-green-100 text-green-800',
  content_approved: 'bg-green-100 text-green-800',
  content_rejected: 'bg-red-100 text-red-800',
  ad_approved: 'bg-green-100 text-green-800',
  ad_rejected: 'bg-red-100 text-red-800',
  role_assigned: 'bg-blue-100 text-blue-800',
  login: 'bg-gray-100 text-gray-800',
}

const columns: Column<AuditLog>[] = [
  {
    key: 'actorName',
    header: 'Actor',
    render: (_, log) => (
      <div>
        <div className="font-medium text-sm">{log.actorName}</div>
        <div className="text-xs text-muted-foreground">{log.actorRole}</div>
      </div>
    ),
  },
  {
    key: 'action',
    header: 'Action',
    render: (_, log) => (
      <span
        className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${actionColors[log.action] ?? 'bg-gray-100 text-gray-800'}`}
      >
        {log.action.replace(/_/g, ' ')}
      </span>
    ),
  },
  {
    key: 'targetType',
    header: 'Target',
    render: (_, log) => (
      <div>
        <Badge variant="outline" className="text-xs capitalize">{log.targetType}</Badge>
        {log.targetName && (
          <div className="text-xs text-muted-foreground mt-0.5">{log.targetName}</div>
        )}
      </div>
    ),
  },
  {
    key: 'ipAddress',
    header: 'IP Address',
    render: (v) => <span className="font-mono text-xs">{v as string}</span>,
  },
  {
    key: 'createdAt',
    header: 'Timestamp',
    sortable: true,
    render: (v) => <span className="text-sm text-muted-foreground">{formatDateTime(v as string)}</span>,
  },
]

export default function AuditPage() {
  const [query, setQuery] = React.useState('')
  const [startDate, setStartDate] = React.useState('')
  const [endDate, setEndDate] = React.useState('')
  const [page, setPage] = React.useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['audit', 'logs', { query, startDate, endDate, page }],
    queryFn: () =>
      getAuditLogs({
        query: query || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        page,
        limit: PAGE_SIZE,
        sortOrder: 'desc',
      }),
  })

  async function handleExport() {
    const blob = await exportAuditLogs({
      query: query || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Audit Log</h1>
                <p className="text-muted-foreground">
                  {data?.total != null
                    ? `${data.total.toLocaleString()} log entries`
                    : 'All admin actions are logged here'}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>

            <div className="flex flex-wrap gap-3">
              <SearchInput
                value={query}
                onChange={(v) => { setQuery(v); setPage(1) }}
                placeholder="Search by actor, action, target…"
                className="w-72"
              />
              <Input
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setPage(1) }}
                className="w-40"
                placeholder="Start date"
              />
              <Input
                type="date"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setPage(1) }}
                className="w-40"
                placeholder="End date"
              />
            </div>

            <DataTable
              columns={columns}
              data={data?.logs ?? []}
              isLoading={isLoading}
              emptyMessage="No audit log entries found."
              getRowId={(log) => log.id}
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
