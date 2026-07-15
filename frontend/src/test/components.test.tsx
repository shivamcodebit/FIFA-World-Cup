import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import DensityBadge from '@/components/ui/DensityBadge'
import AlertCard from '@/components/ui/AlertCard'
import React from 'react'

describe('LoadingSpinner Component', () => {
  it('renders loading spinner with default label', () => {
    render(<LoadingSpinner />)
    const statusEl = screen.getByRole('status')
    expect(statusEl).toBeInTheDocument()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders loading spinner with custom label', () => {
    render(<LoadingSpinner label="Please wait" />)
    expect(screen.getByText('Please wait')).toBeInTheDocument()
  })
})

describe('DensityBadge Component', () => {
  it('renders Normal badge for low density', () => {
    render(<DensityBadge density={45} />)
    expect(screen.getByText('45%')).toBeInTheDocument()
    expect(screen.getByText('Normal')).toBeInTheDocument()
  })

  it('renders Busy badge for medium density', () => {
    render(<DensityBadge density={70} />)
    expect(screen.getByText('70%')).toBeInTheDocument()
    expect(screen.getByText('Busy')).toBeInTheDocument()
  })

  it('renders Critical badge for high density', () => {
    render(<DensityBadge density={90} />)
    expect(screen.getByText('90%')).toBeInTheDocument()
    expect(screen.getByText('Critical')).toBeInTheDocument()
  })

  it('hides label when showLabel is false', () => {
    render(<DensityBadge density={90} showLabel={false} />)
    expect(screen.getByText('90%')).toBeInTheDocument()
    expect(screen.queryByText('Critical')).not.toBeInTheDocument()
  })
})

describe('AlertCard Component', () => {
  it('renders alert card content', () => {
    render(
      <AlertCard title="Test Title" variant="warning">
        <p>This is a warning message</p>
      </AlertCard>
    )
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('This is a warning message')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('renders alert card with status role for info variant', () => {
    render(
      <AlertCard title="Info Title" variant="info">
        <p>This is an info message</p>
      </AlertCard>
    )
    expect(screen.getByText('Info Title')).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})
