import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { DataTable } from '@/components/common/data-table'
import type { Column } from '@/components/common/data-table'

interface TestRow {
  id: string
  name: string
  email: string
  age: number
  [key: string]: unknown
}

const testData: TestRow[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', age: 30 },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', age: 25 },
  { id: '3', name: 'Carol Williams', email: 'carol@example.com', age: 35 },
]

const columns: Column<TestRow>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'email', header: 'Email' },
  { key: 'age', header: 'Age', sortable: true },
]

describe('DataTable', () => {
  it('renders table headers correctly', () => {
    render(<DataTable columns={columns} data={testData} getRowId={(r) => r.id} />)
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Age')).toBeInTheDocument()
  })

  it('renders data rows correctly', () => {
    render(<DataTable columns={columns} data={testData} getRowId={(r) => r.id} />)
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
    expect(screen.getByText('bob@example.com')).toBeInTheDocument()
    expect(screen.getByText('35')).toBeInTheDocument()
  })

  it('shows empty message when no data', () => {
    render(
      <DataTable
        columns={columns}
        data={[]}
        emptyMessage="No records found."
        getRowId={(r) => r.id}
      />
    )
    expect(screen.getByText('No records found.')).toBeInTheDocument()
  })

  it('shows skeleton rows when loading', () => {
    const { container } = render(
      <DataTable columns={columns} data={[]} isLoading={true} getRowId={(r) => r.id} />
    )
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('calls onSort when sortable header is clicked', () => {
    const onSort = vi.fn()
    render(
      <DataTable
        columns={columns}
        data={testData}
        onSort={onSort}
        sortBy="name"
        sortOrder="asc"
        getRowId={(r) => r.id}
      />
    )
    fireEvent.click(screen.getByText('Name'))
    expect(onSort).toHaveBeenCalledWith('name')
  })

  it('calls onRowClick when row is clicked', () => {
    const onRowClick = vi.fn()
    render(
      <DataTable
        columns={columns}
        data={testData}
        onRowClick={onRowClick}
        getRowId={(r) => r.id}
      />
    )
    fireEvent.click(screen.getByText('Alice Johnson'))
    expect(onRowClick).toHaveBeenCalledWith(testData[0])
  })

  it('renders custom cell renderer', () => {
    const customColumns: Column<TestRow>[] = [
      {
        key: 'name',
        header: 'Name',
        render: (_, row) => <span data-testid="custom-cell">{row.name.toUpperCase()}</span>,
      },
    ]
    render(<DataTable columns={customColumns} data={testData} getRowId={(r) => r.id} />)
    expect(screen.getByText('ALICE JOHNSON')).toBeInTheDocument()
  })

  it('renders checkboxes when selection is enabled', () => {
    const onSelectRow = vi.fn()
    const onSelectAll = vi.fn()
    render(
      <DataTable
        columns={columns}
        data={testData}
        getRowId={(r) => r.id}
        selectedIds={new Set()}
        onSelectRow={onSelectRow}
        onSelectAll={onSelectAll}
      />
    )
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes.length).toBe(testData.length + 1) // rows + header
  })
})
