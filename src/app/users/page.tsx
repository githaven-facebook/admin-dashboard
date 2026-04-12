'use client'

import * as React from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { UserTable } from '@/components/users/user-table'
import { SearchInput } from '@/components/common/search-input'
import { Pagination } from '@/components/common/pagination'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useUsers, useSuspendUser, useBanUser } from '@/hooks/use-users'
import type { User, UserStatus, UserRole } from '@/types/user'

const PAGE_SIZE = 20

export default function UsersPage() {
  const [query, setQuery] = React.useState('')
  const [status, setStatus] = React.useState<UserStatus | 'all'>('all')
  const [role, setRole] = React.useState<UserRole | 'all'>('all')
  const [page, setPage] = React.useState(1)
  const [sortBy, setSortBy] = React.useState<string>('createdAt')
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc')
  const [suspendTarget, setSuspendTarget] = React.useState<User | null>(null)
  const [banTarget, setBanTarget] = React.useState<User | null>(null)

  const { data, isLoading } = useUsers({
    query: query || undefined,
    status: status === 'all' ? undefined : status,
    role: role === 'all' ? undefined : role,
    page,
    limit: PAGE_SIZE,
    sortBy: sortBy as 'name' | 'email' | 'createdAt' | 'lastActiveAt' | 'reportCount',
    sortOrder,
  })

  const suspendMutation = useSuspendUser()
  const banMutation = useBanUser()

  function handleSort(key: string) {
    if (sortBy === key) {
      setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(key)
      setSortOrder('desc')
    }
    setPage(1)
  }

  function handleFilterChange() {
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
              <h1 className="text-2xl font-bold">Users</h1>
              <p className="text-muted-foreground">
                {data?.total != null ? `${data.total.toLocaleString()} total users` : 'Manage platform users'}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <SearchInput
                value={query}
                onChange={(v) => { setQuery(v); handleFilterChange() }}
                placeholder="Search by name or email…"
                className="w-72"
              />
              <Select
                value={status}
                onValueChange={(v) => { setStatus(v as UserStatus | 'all'); handleFilterChange() }}
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="banned">Banned</SelectItem>
                  <SelectItem value="pending_verification">Pending</SelectItem>
                  <SelectItem value="deactivated">Deactivated</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={role}
                onValueChange={(v) => { setRole(v as UserRole | 'all'); handleFilterChange() }}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="analyst">Analyst</SelectItem>
                  <SelectItem value="ad_reviewer">Ad Reviewer</SelectItem>
                  <SelectItem value="content_moderator">Moderator</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <UserTable
              users={data?.users ?? []}
              isLoading={isLoading}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
              onSuspend={setSuspendTarget}
              onBan={setBanTarget}
            />

            {data && data.totalPages > 1 && (
              <div className="flex justify-center pt-2">
                <Pagination
                  page={page}
                  totalPages={data.totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </div>
        </main>
      </div>

      <ConfirmDialog
        open={Boolean(suspendTarget)}
        onOpenChange={(o) => !o && setSuspendTarget(null)}
        title="Suspend User"
        description={`Are you sure you want to suspend ${suspendTarget?.name}?`}
        confirmLabel="Suspend"
        variant="destructive"
        isLoading={suspendMutation.isPending}
        onConfirm={() => {
          if (suspendTarget) {
            suspendMutation.mutate(
              { id: suspendTarget.id, payload: { reason: 'Suspended by admin', notifyUser: true } },
              { onSuccess: () => setSuspendTarget(null) }
            )
          }
        }}
      />

      <ConfirmDialog
        open={Boolean(banTarget)}
        onOpenChange={(o) => !o && setBanTarget(null)}
        title="Ban User"
        description={`Are you sure you want to ban ${banTarget?.name}? This is a severe action.`}
        confirmLabel="Ban User"
        variant="destructive"
        isLoading={banMutation.isPending}
        onConfirm={() => {
          if (banTarget) {
            banMutation.mutate(
              { id: banTarget.id, payload: { reason: 'Banned by admin', notifyUser: true, appealable: true } },
              { onSuccess: () => setBanTarget(null) }
            )
          }
        }}
      />
    </div>
  )
}
