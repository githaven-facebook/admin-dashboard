'use client'

import * as React from 'react'
import Link from 'next/link'
import { MoreHorizontal, Eye, UserX, Ban, CheckCircle, Shield } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTable } from '@/components/common/data-table'
import { StatusBadge } from '@/components/common/status-badge'
import { generateInitials, formatDate } from '@/lib/utils'
import type { User } from '@/types/user'
import type { Column } from '@/components/common/data-table'

const roleLabels: Record<string, string> = {
  super_admin: 'Super Admin',
  content_moderator: 'Moderator',
  ad_reviewer: 'Ad Reviewer',
  analyst: 'Analyst',
  user: 'User',
}

interface UserTableProps {
  users: User[]
  isLoading?: boolean
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  onSort?: (key: string) => void
  onSuspend?: (user: User) => void
  onBan?: (user: User) => void
  onVerify?: (user: User) => void
}

export function UserTable({
  users,
  isLoading,
  sortBy,
  sortOrder,
  onSort,
  onSuspend,
  onBan,
  onVerify,
}: UserTableProps) {
  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'User',
      sortable: true,
      render: (_, user) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-xs">{generateInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-sm flex items-center gap-1">
              {user.name}
              {user.isVerified && (
                <CheckCircle className="h-3.5 w-3.5 text-facebook-500" aria-label="Verified" />
              )}
            </div>
            <div className="text-xs text-muted-foreground">{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (_, user) => <StatusBadge status={user.status} />,
    },
    {
      key: 'role',
      header: 'Role',
      render: (_, user) => (
        <Badge variant="outline" className="text-xs">
          {roleLabels[user.role] ?? user.role}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Joined',
      sortable: true,
      render: (v) => (
        <span className="text-sm text-muted-foreground">{formatDate(v as string)}</span>
      ),
    },
    {
      key: 'lastActiveAt',
      header: 'Last Active',
      sortable: true,
      render: (v) => (
        <span className="text-sm text-muted-foreground">{formatDate(v as string)}</span>
      ),
    },
    {
      key: 'reportCount',
      header: 'Reports',
      sortable: true,
      render: (v) => (
        <span className={`text-sm font-medium ${(v as number) > 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
          {v as number}
        </span>
      ),
    },
    {
      key: 'id',
      header: '',
      className: 'w-12',
      render: (_, user) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/users/${user.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {user.status === 'active' && (
              <DropdownMenuItem
                onClick={() => onSuspend?.(user)}
                className="text-yellow-600 focus:text-yellow-600"
              >
                <UserX className="mr-2 h-4 w-4" />
                Suspend
              </DropdownMenuItem>
            )}
            {user.status !== 'banned' && (
              <DropdownMenuItem
                onClick={() => onBan?.(user)}
                className="text-destructive focus:text-destructive"
              >
                <Ban className="mr-2 h-4 w-4" />
                Ban User
              </DropdownMenuItem>
            )}
            {!user.isVerified && (
              <DropdownMenuItem onClick={() => onVerify?.(user)}>
                <Shield className="mr-2 h-4 w-4" />
                Verify
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={users}
      isLoading={isLoading}
      emptyMessage="No users found."
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSort={onSort}
      getRowId={(u) => u.id}
    />
  )
}
