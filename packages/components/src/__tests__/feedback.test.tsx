import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { ThemeProvider } from '../ThemeProvider/index.js'
import { Alert, Progress, Skeleton, ToastProvider, ToastList, EmptyState } from '../index.js'
import type { ToastItem } from '../index.js'

function Themed({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>
}

// ---------------------------------------------------------------------------
// Alert
// ---------------------------------------------------------------------------
describe('Alert', () => {
  it('renders children', () => {
    render(<Themed><Alert>Something happened.</Alert></Themed>)
    expect(screen.getByText('Something happened.')).toBeInTheDocument()
  })

  it('renders title when provided', () => {
    render(<Themed><Alert title="Warning" variant="warning">Be careful.</Alert></Themed>)
    expect(screen.getByText('Warning')).toBeInTheDocument()
    expect(screen.getByText('Be careful.')).toBeInTheDocument()
  })

  it('has role="region" by default', () => {
    render(<Themed><Alert title="Info">Message</Alert></Themed>)
    expect(screen.getByRole('region', { name: 'Info' })).toBeInTheDocument()
  })

  it('has role="alert" when live=true', () => {
    render(<Themed><Alert live>Urgent message</Alert></Themed>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('renders dismiss button and calls onDismiss', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    render(<Themed><Alert title="Info" onDismiss={onDismiss}>Message</Alert></Themed>)
    await user.click(screen.getByRole('button', { name: 'Dismiss' }))
    expect(onDismiss).toHaveBeenCalledOnce()
  })

  it('renders all variants without error', () => {
    const variants = ['info', 'success', 'warning', 'danger'] as const
    for (const v of variants) {
      render(<Themed><Alert variant={v} title={v}>{v} message</Alert></Themed>)
    }
    expect(screen.getAllByText('info message').length).toBeGreaterThan(0)
  })

  it('has no a11y violations', async () => {
    const { container } = render(
      <Themed><Alert title="File saved" variant="success">Your changes have been saved.</Alert></Themed>
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('live alert has no a11y violations', async () => {
    const { container } = render(
      <Themed><Alert live title="Error" variant="danger">Operation failed.</Alert></Themed>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Progress
// ---------------------------------------------------------------------------
describe('Progress', () => {
  it('has role="progressbar"', () => {
    render(<Themed><Progress value={50} label="Loading" /></Themed>)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('sets aria-valuenow from value', () => {
    render(<Themed><Progress value={75} label="Progress" /></Themed>)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75')
  })

  it('indeterminate — no aria-valuenow', () => {
    render(<Themed><Progress label="Loading" /></Themed>)
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow')
  })

  it('shows percentage text when showValue=true', () => {
    render(<Themed><Progress value={42} label="Progress" showValue /></Themed>)
    expect(screen.getByText('42%')).toBeInTheDocument()
  })

  it('renders all variants without error', () => {
    const variants = ['default', 'success', 'warning', 'danger'] as const
    for (const v of variants) {
      render(<Themed><Progress value={50} variant={v} label={v} /></Themed>)
    }
    expect(screen.getAllByRole('progressbar').length).toBeGreaterThan(0)
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Themed><Progress value={60} label="Upload progress" /></Themed>)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('indeterminate has no a11y violations', async () => {
    const { container } = render(<Themed><Progress label="Loading assets" /></Themed>)
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------
describe('Skeleton', () => {
  it('renders with aria-hidden', () => {
    render(<Themed><Skeleton width={200} height={20} /></Themed>)
    const el = document.querySelector('.forge-skeleton')
    expect(el).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders as circle when circle=true', () => {
    render(<Themed><Skeleton circle width={40} height={40} /></Themed>)
    const el = document.querySelector('.forge-skeleton') as HTMLElement
    expect(el.style.borderRadius).toBe('9999px')
  })

  it('accepts string width/height', () => {
    render(<Themed><Skeleton width="50%" height="1rem" /></Themed>)
    const el = document.querySelector('.forge-skeleton') as HTMLElement
    expect(el.style.width).toBe('50%')
    expect(el.style.height).toBe('1rem')
  })

  it('has no a11y violations', async () => {
    const { container } = render(
      <Themed>
        <div role="status" aria-label="Loading content">
          <Skeleton width="100%" height={16} />
          <Skeleton width="80%" height={16} />
        </div>
      </Themed>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Toast
// ---------------------------------------------------------------------------
describe('Toast', () => {
  const sampleToast: ToastItem = {
    id: 't1',
    title: 'File saved',
    description: 'Your changes have been saved.',
    variant: 'success',
  }

  it('renders toast title and description', () => {
    render(
      <Themed>
        <ToastProvider>
          <ToastList toasts={[sampleToast]} onDismiss={vi.fn()} />
        </ToastProvider>
      </Themed>
    )
    expect(screen.getByText('File saved')).toBeInTheDocument()
    expect(screen.getByText('Your changes have been saved.')).toBeInTheDocument()
  })

  it('renders dismiss button', () => {
    render(
      <Themed>
        <ToastProvider>
          <ToastList toasts={[sampleToast]} onDismiss={vi.fn()} />
        </ToastProvider>
      </Themed>
    )
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument()
  })

  it('calls onDismiss when dismiss button clicked', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    render(
      <Themed>
        <ToastProvider>
          <ToastList toasts={[sampleToast]} onDismiss={onDismiss} />
        </ToastProvider>
      </Themed>
    )
    await user.click(screen.getByRole('button', { name: 'Dismiss' }))
    expect(onDismiss).toHaveBeenCalledWith('t1')
  })

  it('renders action button when action provided', () => {
    const toastWithAction: ToastItem = {
      ...sampleToast,
      id: 't2',
      action: { label: 'Undo', onClick: vi.fn() },
    }
    render(
      <Themed>
        <ToastProvider>
          <ToastList toasts={[toastWithAction]} onDismiss={vi.fn()} />
        </ToastProvider>
      </Themed>
    )
    expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument()
  })

  it('renders multiple toasts', () => {
    const toasts: ToastItem[] = [
      { id: 'a', title: 'Toast A' },
      { id: 'b', title: 'Toast B' },
    ]
    render(
      <Themed>
        <ToastProvider>
          <ToastList toasts={toasts} onDismiss={vi.fn()} />
        </ToastProvider>
      </Themed>
    )
    expect(screen.getByText('Toast A')).toBeInTheDocument()
    expect(screen.getByText('Toast B')).toBeInTheDocument()
  })

  it('renders empty list without error', () => {
    render(
      <Themed>
        <ToastProvider>
          <ToastList toasts={[]} onDismiss={vi.fn()} />
        </ToastProvider>
      </Themed>
    )
    expect(document.querySelector('.forge-toast')).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// EmptyState
// ---------------------------------------------------------------------------
describe('EmptyState', () => {
  it('renders title', () => {
    render(<Themed><EmptyState title="No entities" /></Themed>)
    expect(screen.getByText('No entities')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(<Themed><EmptyState title="Empty" description="Create one to get started." /></Themed>)
    expect(screen.getByText('Create one to get started.')).toBeInTheDocument()
  })

  it('renders icon when provided', () => {
    render(<Themed><EmptyState icon="🌍" title="No worlds" /></Themed>)
    expect(screen.getByText('🌍')).toBeInTheDocument()
  })

  it('renders action button and fires onClick', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Themed><EmptyState title="No data" action={{ label: 'Create', onClick }} /></Themed>)
    await user.click(screen.getByRole('button', { name: 'Create' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <Themed><EmptyState icon="📭" title="Nothing here" description="Start by adding items." action={{ label: 'Add', onClick: () => {} }} /></Themed>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
