import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { StatusBadge } from '@/components/common/status-badge'

describe('StatusBadge', () => {
  it('renders active status correctly', () => {
    render(<StatusBadge status="active" />)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('renders suspended status correctly', () => {
    render(<StatusBadge status="suspended" />)
    expect(screen.getByText('Suspended')).toBeInTheDocument()
  })

  it('renders banned status correctly', () => {
    render(<StatusBadge status="banned" />)
    expect(screen.getByText('Banned')).toBeInTheDocument()
  })

  it('renders pending_verification status correctly', () => {
    render(<StatusBadge status="pending_verification" />)
    expect(screen.getByText('Pending')).toBeInTheDocument()
  })

  it('renders healthy system status', () => {
    render(<StatusBadge status="healthy" />)
    expect(screen.getByText('Healthy')).toBeInTheDocument()
  })

  it('renders degraded system status', () => {
    render(<StatusBadge status="degraded" />)
    expect(screen.getByText('Degraded')).toBeInTheDocument()
  })

  it('renders down system status', () => {
    render(<StatusBadge status="down" />)
    expect(screen.getByText('Down')).toBeInTheDocument()
  })

  it('renders approved report status', () => {
    render(<StatusBadge status="approved" />)
    expect(screen.getByText('Approved')).toBeInTheDocument()
  })

  it('renders rejected report status', () => {
    render(<StatusBadge status="rejected" />)
    expect(screen.getByText('Rejected')).toBeInTheDocument()
  })

  it('applies additional className', () => {
    const { container } = render(<StatusBadge status="active" className="test-class" />)
    expect(container.firstChild).toHaveClass('test-class')
  })

  it('handles unknown status gracefully', () => {
    render(<StatusBadge status={'unknown_status' as 'active'} />)
    expect(screen.getByText('unknown_status')).toBeInTheDocument()
  })
})
