import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { ThemeProvider } from '../ThemeProvider/index.js'
import { Accordion, Tabs } from '../index.js'

function Themed({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>
}

const ACCORDION_ITEMS = [
  { value: 'a', trigger: 'Section A', content: 'Content A' },
  { value: 'b', trigger: 'Section B', content: 'Content B' },
  { value: 'c', trigger: 'Section C (disabled)', content: 'Content C', disabled: true },
]

const TAB_ITEMS = [
  { value: 'one', label: 'Tab 1', content: <p>Panel 1</p> },
  { value: 'two', label: 'Tab 2', content: <p>Panel 2</p> },
  { value: 'three', label: 'Tab 3', content: <p>Panel 3</p>, disabled: true },
]

// ---------------------------------------------------------------------------
// Accordion
// ---------------------------------------------------------------------------
describe('Accordion', () => {
  it('renders all trigger labels', () => {
    render(
      <Themed>
        <Accordion items={ACCORDION_ITEMS} />
      </Themed>,
    )
    expect(screen.getByText('Section A')).toBeInTheDocument()
    expect(screen.getByText('Section B')).toBeInTheDocument()
  })

  it('content is not in DOM initially (single, collapsible)', () => {
    render(
      <Themed>
        <Accordion items={ACCORDION_ITEMS} />
      </Themed>,
    )
    // Radix removes closed content from DOM
    expect(screen.queryByText('Content A')).not.toBeInTheDocument()
  })

  it('expands item on click', async () => {
    const user = userEvent.setup()
    render(
      <Themed>
        <Accordion items={ACCORDION_ITEMS} />
      </Themed>,
    )
    await user.click(screen.getByText('Section A'))
    expect(screen.getByText('Content A')).toBeVisible()
  })

  it('collapses open item on second click (collapsible=true)', async () => {
    const user = userEvent.setup()
    render(
      <Themed>
        <Accordion items={ACCORDION_ITEMS} collapsible />
      </Themed>,
    )
    await user.click(screen.getByText('Section A'))
    await user.click(screen.getByText('Section A'))
    expect(screen.queryByText('Content A')).not.toBeInTheDocument()
  })

  it('disabled item cannot be opened', async () => {
    const user = userEvent.setup()
    render(
      <Themed>
        <Accordion items={ACCORDION_ITEMS} />
      </Themed>,
    )
    await user.click(screen.getByText('Section C (disabled)'))
    expect(screen.queryByText('Content C')).not.toBeInTheDocument()
  })

  it('controlled: shows value item open', () => {
    render(
      <Themed>
        <Accordion items={ACCORDION_ITEMS} value="b" onValueChange={vi.fn()} />
      </Themed>,
    )
    expect(screen.getByText('Content B')).toBeVisible()
  })

  it('multiple type: can open multiple items', async () => {
    const user = userEvent.setup()
    render(
      <Themed>
        <Accordion type="multiple" items={ACCORDION_ITEMS} />
      </Themed>,
    )
    await user.click(screen.getByText('Section A'))
    await user.click(screen.getByText('Section B'))
    expect(screen.getByText('Content A')).toBeVisible()
    expect(screen.getByText('Content B')).toBeVisible()
  })

  it('has no a11y violations (closed)', async () => {
    const { container } = render(
      <Themed>
        <Accordion items={ACCORDION_ITEMS} />
      </Themed>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no a11y violations (open)', async () => {
    const { container } = render(
      <Themed>
        <Accordion items={ACCORDION_ITEMS} value="a" onValueChange={vi.fn()} />
      </Themed>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------
describe('Tabs', () => {
  it('renders all tab labels', () => {
    render(
      <Themed>
        <Tabs items={TAB_ITEMS} />
      </Themed>,
    )
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Tab 3' })).toBeInTheDocument()
  })

  it('first tab is active by default', () => {
    render(
      <Themed>
        <Tabs items={TAB_ITEMS} />
      </Themed>,
    )
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('data-state', 'active')
    expect(screen.getByText('Panel 1')).toBeInTheDocument()
  })

  it('switches panel on tab click', async () => {
    const user = userEvent.setup()
    render(
      <Themed>
        <Tabs items={TAB_ITEMS} />
      </Themed>,
    )
    await user.click(screen.getByRole('tab', { name: 'Tab 2' }))
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('data-state', 'active')
    expect(screen.getByText('Panel 2')).toBeInTheDocument()
  })

  it('disabled tab cannot be activated', async () => {
    const user = userEvent.setup()
    render(
      <Themed>
        <Tabs items={TAB_ITEMS} />
      </Themed>,
    )
    await user.click(screen.getByRole('tab', { name: 'Tab 3' }))
    expect(screen.getByRole('tab', { name: 'Tab 3' })).toHaveAttribute('data-state', 'inactive')
  })

  it('calls onValueChange when tab changes', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <Themed>
        <Tabs items={TAB_ITEMS} onValueChange={onValueChange} />
      </Themed>,
    )
    await user.click(screen.getByRole('tab', { name: 'Tab 2' }))
    expect(onValueChange).toHaveBeenCalledWith('two')
  })

  it('controlled: shows specified value tab', () => {
    render(
      <Themed>
        <Tabs items={TAB_ITEMS} value="two" onValueChange={vi.fn()} />
      </Themed>,
    )
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('data-state', 'active')
  })

  it('renders solid variant without error', () => {
    render(
      <Themed>
        <Tabs items={TAB_ITEMS} variant="solid" />
      </Themed>,
    )
    expect(screen.getByRole('tablist')).toBeInTheDocument()
  })

  it('renders vertical orientation', () => {
    render(
      <Themed>
        <Tabs items={TAB_ITEMS} orientation="vertical" />
      </Themed>,
    )
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical')
  })

  it('has no a11y violations', async () => {
    const { container } = render(
      <Themed>
        <Tabs items={TAB_ITEMS} />
      </Themed>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
