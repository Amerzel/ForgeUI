import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { ThemeProvider } from '../ThemeProvider/index.js'
import { Dialog, Tooltip, TooltipProvider, DropdownMenu, ContextMenu, Popover } from '../index.js'
import type { MenuEntry } from '../index.js'

function Themed({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>
}

const MENU_ITEMS: MenuEntry[] = [
  { label: 'Copy', shortcut: '⌘C', onSelect: vi.fn() },
  { label: 'Paste', shortcut: '⌘V', onSelect: vi.fn() },
  { type: 'separator' },
  { label: 'Delete', variant: 'danger', onSelect: vi.fn() },
  { label: 'Disabled item', disabled: true },
]

// ---------------------------------------------------------------------------
// Dialog
// ---------------------------------------------------------------------------
describe('Dialog', () => {
  it('renders content when open=true', () => {
    render(
      <Themed>
        <Dialog open={true} onOpenChange={() => {}} title="Settings" description="Adjust your preferences.">
          <p>Dialog body</p>
        </Dialog>
      </Themed>
    )
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByText('Adjust your preferences.')).toBeInTheDocument()
    expect(screen.getByText('Dialog body')).toBeInTheDocument()
  })

  it('does not render when open=false', () => {
    render(
      <Themed>
        <Dialog open={false} onOpenChange={() => {}} title="Settings">
          <p>Hidden body</p>
        </Dialog>
      </Themed>
    )
    expect(screen.queryByText('Settings')).not.toBeInTheDocument()
  })

  it('close button calls onOpenChange(false)', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <Themed>
        <Dialog open={true} onOpenChange={onOpenChange} title="Edit">
          <p>Body</p>
        </Dialog>
      </Themed>
    )
    await user.click(screen.getByRole('button', { name: 'Close dialog' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('trigger opens dialog', async () => {
    const user = userEvent.setup()
    render(
      <Themed>
        <Dialog trigger={<button>Open</button>} title="My Dialog">
          <p>Content here</p>
        </Dialog>
      </Themed>
    )
    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByRole('heading', { name: 'My Dialog' })).toBeInTheDocument()
  })

  it('has no a11y violations when open', async () => {
    const { container } = render(
      <Themed>
        <Dialog open={true} onOpenChange={() => {}} title="Confirm action" description="This cannot be undone.">
          <p>Proceed?</p>
        </Dialog>
      </Themed>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Tooltip
// ---------------------------------------------------------------------------
describe('Tooltip', () => {
  it('renders trigger child', () => {
    render(
      <Themed>
        <TooltipProvider>
          <Tooltip content="Helpful info">
            <button>Hover me</button>
          </Tooltip>
        </TooltipProvider>
      </Themed>
    )
    expect(screen.getByRole('button', { name: 'Hover me' })).toBeInTheDocument()
  })

  it('shows tooltip on focus', async () => {
    const user = userEvent.setup()
    render(
      <Themed>
        <TooltipProvider>
          <Tooltip content="Tooltip text" delayDuration={0}>
            <button>Target</button>
          </Tooltip>
        </TooltipProvider>
      </Themed>
    )
    await user.tab()
    expect(screen.getByRole('tooltip', { name: 'Tooltip text' })).toBeInTheDocument()
  })

  it('does not render tooltip when disabled=true', async () => {
    const user = userEvent.setup()
    render(
      <Themed>
        <TooltipProvider>
          <Tooltip content="Hidden tip" disabled>
            <button>Target</button>
          </Tooltip>
        </TooltipProvider>
      </Themed>
    )
    await user.tab()
    expect(screen.queryByText('Hidden tip')).not.toBeInTheDocument()
  })

  it('has no a11y violations', async () => {
    const { container } = render(
      <Themed>
        <TooltipProvider>
          <Tooltip content="Save document">
            <button aria-label="Save">💾</button>
          </Tooltip>
        </TooltipProvider>
      </Themed>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// DropdownMenu
// ---------------------------------------------------------------------------
describe('DropdownMenu', () => {
  it('renders trigger', () => {
    render(
      <Themed>
        <DropdownMenu trigger={<button>Open menu</button>} items={MENU_ITEMS} />
      </Themed>
    )
    expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument()
  })

  it('shows menu items on trigger click', async () => {
    const user = userEvent.setup()
    render(
      <Themed>
        <DropdownMenu trigger={<button>Actions</button>} items={MENU_ITEMS} />
      </Themed>
    )
    await user.click(screen.getByRole('button', { name: 'Actions' }))
    expect(screen.getByRole('menuitem', { name: 'Copy ⌘C' })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toBeInTheDocument()
  })

  it('calls onSelect when item clicked', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    const items: MenuEntry[] = [{ label: 'Export', onSelect }]
    render(
      <Themed>
        <DropdownMenu trigger={<button>Menu</button>} items={items} />
      </Themed>
    )
    await user.click(screen.getByRole('button', { name: 'Menu' }))
    await user.click(screen.getByRole('menuitem', { name: 'Export' }))
    expect(onSelect).toHaveBeenCalledOnce()
  })

  it('has no a11y violations when open', async () => {
    const { container } = render(
      <Themed>
        <DropdownMenu trigger={<button>Menu</button>} items={MENU_ITEMS} open={true} onOpenChange={() => {}} />
      </Themed>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// ContextMenu
// ---------------------------------------------------------------------------
describe('ContextMenu', () => {
  it('renders trigger area', () => {
    render(
      <Themed>
        <ContextMenu items={MENU_ITEMS}>
          <div data-testid="ctx-area">Right-click here</div>
        </ContextMenu>
      </Themed>
    )
    expect(screen.getByTestId('ctx-area')).toBeInTheDocument()
  })

  it('shows menu on right-click', async () => {
    render(
      <Themed>
        <ContextMenu items={MENU_ITEMS}>
          <div>Right-click area</div>
        </ContextMenu>
      </Themed>
    )
    fireEvent.contextMenu(screen.getByText('Right-click area'))
    expect(screen.getByRole('menuitem', { name: 'Copy ⌘C' })).toBeInTheDocument()
  })

  it('has no a11y violations', async () => {
    const { container } = render(
      <Themed>
        <ContextMenu items={MENU_ITEMS}>
          <div>Right-click area</div>
        </ContextMenu>
      </Themed>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Popover
// ---------------------------------------------------------------------------
describe('Popover', () => {
  it('renders trigger', () => {
    render(
      <Themed>
        <Popover trigger={<button>Open popover</button>}>
          <p>Popover content</p>
        </Popover>
      </Themed>
    )
    expect(screen.getByRole('button', { name: 'Open popover' })).toBeInTheDocument()
  })

  it('shows content on trigger click', async () => {
    const user = userEvent.setup()
    render(
      <Themed>
        <Popover trigger={<button>Filters</button>}>
          <p>Filter options here</p>
        </Popover>
      </Themed>
    )
    await user.click(screen.getByRole('button', { name: 'Filters' }))
    expect(screen.getByText('Filter options here')).toBeInTheDocument()
  })

  it('calls onOpenChange when opened', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <Themed>
        <Popover trigger={<button>Open</button>} onOpenChange={onOpenChange}>
          <p>Content</p>
        </Popover>
      </Themed>
    )
    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(onOpenChange).toHaveBeenCalledWith(true)
  })

  it('has no a11y violations (closed)', async () => {
    const { container } = render(
      <Themed>
        <Popover trigger={<button>Open</button>}>
          <p>Panel content</p>
        </Popover>
      </Themed>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
