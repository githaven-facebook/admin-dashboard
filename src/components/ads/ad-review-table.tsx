'use client'

import * as React from 'react'
import Link from 'next/link'
import { MoreHorizontal, Eye, CheckCircle, XCircle, Flag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import { formatDate, formatCurrency } from '@/lib/utils'
import type { AdCampaign } from '@/types/ads'
import type { Column } from '@/components/common/data-table'

const objectiveLabels: Record<string, string> = {
  awareness: 'Awareness',
  traffic: 'Traffic',
  engagement: 'Engagement',
  leads: 'Leads',
  app_promotion: 'App Promotion',
  sales: 'Sales',
}

interface AdReviewTableProps {
  campaigns: AdCampaign[]
  isLoading?: boolean
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  onSort?: (key: string) => void
  onApprove?: (campaign: AdCampaign) => void
  onReject?: (campaign: AdCampaign) => void
  onFlag?: (campaign: AdCampaign) => void
}

export function AdReviewTable({
  campaigns,
  isLoading,
  sortBy,
  sortOrder,
  onSort,
  onApprove,
  onReject,
  onFlag,
}: AdReviewTableProps) {
  const columns: Column<AdCampaign>[] = [
    {
      key: 'name',
      header: 'Campaign',
      sortable: true,
      render: (_, c) => (
        <div>
          <div className="font-medium text-sm">{c.name}</div>
          <div className="text-xs text-muted-foreground">{c.advertiserName}</div>
        </div>
      ),
    },
    {
      key: 'objective',
      header: 'Objective',
      render: (_, c) => (
        <Badge variant="outline" className="text-xs">
          {objectiveLabels[c.objective] ?? c.objective}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (_, c) => <StatusBadge status={c.status} />,
    },
    {
      key: 'budget',
      header: 'Budget',
      sortable: true,
      render: (_, c) => (
        <span className="text-sm font-medium">
          {formatCurrency(c.budget, c.currency)}
        </span>
      ),
    },
    {
      key: 'policyViolations',
      header: 'Violations',
      render: (_, c) => (
        c.policyViolations.length > 0 ? (
          <Badge variant="destructive" className="text-xs gap-1">
            <Flag className="h-3 w-3" />
            {c.policyViolations.length}
          </Badge>
        ) : (
          <span className="text-xs text-muted-foreground">None</span>
        )
      ),
    },
    {
      key: 'createdAt',
      header: 'Submitted',
      sortable: true,
      render: (v) => <span className="text-sm text-muted-foreground">{formatDate(v as string)}</span>,
    },
    {
      key: 'id',
      header: '',
      className: 'w-12',
      render: (_, campaign) => (
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
              <Link href={`/ads/${campaign.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {campaign.status === 'pending_review' && (
              <>
                <DropdownMenuItem
                  onClick={() => onApprove?.(campaign)}
                  className="text-green-600 focus:text-green-600"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onReject?.(campaign)}
                  className="text-destructive focus:text-destructive"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onFlag?.(campaign)}
                  className="text-orange-600 focus:text-orange-600"
                >
                  <Flag className="mr-2 h-4 w-4" />
                  Flag Violation
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={campaigns}
      isLoading={isLoading}
      emptyMessage="No campaigns in review queue."
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSort={onSort}
      getRowId={(c) => c.id}
    />
  )
}
