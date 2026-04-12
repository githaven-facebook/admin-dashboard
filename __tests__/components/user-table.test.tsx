import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { UserTable } from '@/components/users/user-table'
import type { User } from '@/types/user'

const mockUsers: User[] = [
  {
    id: '1',
    email: 'alice@example.com',
    name: 'Alice Johnson',
    username: 'alicej',
    role: 'user',
    status: 'active',
    isVerified: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    lastActiveAt: '2024-03-01T08:30:00Z',
    followerCount: 1200,
    followingCount: 300,
    postCount: 45,
    reportCount: 0,
  },
  {
    id: '2',
    email: 'bob@example.com',
    name: 'Bob Smith',
    username: 'bobsmith',
    role: 'content_moderator',
    status: 'suspended',
    isVerified: false,
    createdAt: '2023-06-20T14:00:00Z',
    updatedAt: '2024-02-01T12:00:00Z',
    lastActiveAt: '2024-02-01T12:00:00Z',
    followerCount: 80,
    followingCount: 120,
    postCount: 12,
    reportCount: 3,
  },
]

describe('UserTable', () => {
  it('renders user names and emails', () => {
    render(<UserTable users={mockUsers} />)
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
    expect(screen.getByText('Bob Smith')).toBeInTheDocument()
  })

  it('renders status badges', () => {
    render(<UserTable users={mockUsers} />)
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('Suspended')).toBeInTheDocument()
  })

  it('renders role badges', () => {
    render(<UserTable users={mockUsers} />)
    expect(screen.getByText('User')).toBeInTheDocument()
    expect(screen.getByText('Moderator')).toBeInTheDocument()
  })

  it('shows loading skeletons when isLoading', () => {
    const { container } = render(<UserTable users={[]} isLoading={true} />)
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('shows empty message when no users', () => {
    render(<UserTable users={[]} />)
    expect(screen.getByText('No users found.')).toBeInTheDocument()
  })

  it('calls onSuspend when suspend action is triggered', async () => {
    const onSuspend = vi.fn()
    render(<UserTable users={[mockUsers[0]]} onSuspend={onSuspend} />)

    // Open dropdown for first user
    const actionButtons = screen.getAllByRole('button', { name: /actions/i })
    fireEvent.click(actionButtons[0])

    const suspendItem = await screen.findByText('Suspend')
    fireEvent.click(suspendItem)
    expect(onSuspend).toHaveBeenCalledWith(mockUsers[0])
  })

  it('calls onSort when sortable column header is clicked', () => {
    const onSort = vi.fn()
    render(
      <UserTable
        users={mockUsers}
        onSort={onSort}
        sortBy="name"
        sortOrder="asc"
      />
    )
    fireEvent.click(screen.getByText('User'))
    expect(onSort).toHaveBeenCalledWith('name')
  })

  it('shows report count with destructive color for users with reports', () => {
    render(<UserTable users={mockUsers} />)
    const reportCounts = screen.getAllByText(/^[0-9]+$/)
    const reportCountForBob = reportCounts.find((el) => el.textContent === '3')
    expect(reportCountForBob).toHaveClass('text-destructive')
  })
})
