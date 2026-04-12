'use client'

import * as React from 'react'
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export interface Column<T> {
  key: keyof T | string
  header: string
  sortable?: boolean
  className?: string
  render?: (value: unknown, row: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  isLoading?: boolean
  emptyMessage?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  onSort?: (key: string) => void
  onRowClick?: (row: T) => void
  getRowId?: (row: T) => string
  selectedIds?: Set<string>
  onSelectRow?: (id: string, checked: boolean) => void
  onSelectAll?: (checked: boolean) => void
}

function SortIcon({
  columnKey,
  sortBy,
  sortOrder,
}: {
  columnKey: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}) {
  if (sortBy !== columnKey) return <ChevronsUpDown className="ml-1 h-4 w-4 opacity-50" />
  if (sortOrder === 'asc') return <ChevronUp className="ml-1 h-4 w-4" />
  return <ChevronDown className="ml-1 h-4 w-4" />
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'No data found.',
  sortBy,
  sortOrder,
  onSort,
  onRowClick,
  getRowId,
  selectedIds,
  onSelectRow,
  onSelectAll,
}: DataTableProps<T>) {
  const hasSelection = Boolean(getRowId && onSelectRow && onSelectAll)
  const allSelected = Boolean(
    selectedIds && data.length > 0 && data.every((row) => selectedIds.has(getRowId!(row)))
  )
  const someSelected = Boolean(
    selectedIds && !allSelected && data.some((row) => selectedIds.has(getRowId!(row)))
  )

  return (
    <div className="w-full overflow-auto rounded-md border">
      <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors hover:bg-muted/50">
            {hasSelection && (
              <th className="h-12 w-12 px-4 text-left align-middle">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected
                  }}
                  onChange={(e) => onSelectAll!(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                  aria-label="Select all"
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={cn(
                  'h-12 px-4 text-left align-middle font-medium text-muted-foreground',
                  col.className
                )}
              >
                {col.sortable && onSort ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3 h-8 font-medium"
                    onClick={() => onSort(String(col.key))}
                  >
                    {col.header}
                    <SortIcon
                      columnKey={String(col.key)}
                      sortBy={sortBy}
                      sortOrder={sortOrder}
                    />
                  </Button>
                ) : (
                  col.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b transition-colors">
                {hasSelection && (
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-4" />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-4 py-3">
                    <Skeleton className="h-4 w-full" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (hasSelection ? 1 : 0)}
                className="h-24 px-4 text-center text-muted-foreground"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => {
              const rowId = getRowId ? getRowId(row) : String(rowIndex)
              const isSelected = selectedIds?.has(rowId) ?? false
              return (
                <tr
                  key={rowId}
                  className={cn(
                    'border-b transition-colors hover:bg-muted/50',
                    isSelected && 'bg-muted/30',
                    onRowClick && 'cursor-pointer'
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {hasSelection && (
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => onSelectRow!(rowId, e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300"
                        aria-label={`Select row ${rowId}`}
                      />
                    </td>
                  )}
                  {columns.map((col) => {
                    const value = row[col.key as keyof T]
                    return (
                      <td
                        key={String(col.key)}
                        className={cn('px-4 py-3 align-middle', col.className)}
                      >
                        {col.render ? col.render(value, row) : String(value ?? '')}
                      </td>
                    )
                  })}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
