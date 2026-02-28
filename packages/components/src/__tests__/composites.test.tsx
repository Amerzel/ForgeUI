import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { ThemeProvider } from '../ThemeProvider/index.js'
import {
  Drawer,
  Collapsible,
  Toolbar,
  Steps,
  Avatar,
  AspectRatio,
  Breadcrumb,
  Menubar,
  Table,
  AppShell,
  DropZone,
  Pagination,
  StatCard,
  HealthRow,
  NavItem,
  ModuleToolbar,
  EntityCard,
  MiniMap,
  ApprovalPanel,
} from '../index.js'
import type { Step, BreadcrumbItem, MenubarMenu } from '../index.js'

function Themed({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>
}

// ---------------------------------------------------------------------------
// Drawer
// ---------------------------------------------------------------------------
describe('Drawer', () => {
  it('renders content when open=true', () => {
    render(
      <Themed>
        <Drawer open={true} onOpenChange={() => {}} title="Settings" description="Adjust your settings.">
          <p>Drawer body</p>
        </Drawer>
      </Themed>
    )
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    expect(screen.getByText('Adjust your settings.')).toBeInTheDocument()
    expect(screen.getByText('Drawer body')).toBeInTheDocument()
  })

  it('does not render when open=false', () => {
    render(
      <Themed>
        <Drawer open={false} onOpenChange={() => {}} title="Settings">
          <p>Drawer body</p>
        </Drawer>
      </Themed>
    )
    expect(screen.queryByText('Drawer body')).not.toBeInTheDocument()
  })

  it('renders close button', () => {
    render(
      <Themed>
        <Drawer open={true} onOpenChange={() => {}} title="Close Test">
          content
        </Drawer>
      </Themed>
    )
    expect(screen.getByRole('button', { name: 'Close drawer' })).toBeInTheDocument()
  })

  it('has no axe violations when open', async () => {
    const { container } = render(
      <Themed>
        <Drawer open={true} onOpenChange={() => {}} title="Accessible Drawer" description="Drawer description.">
          <p>Content</p>
        </Drawer>
      </Themed>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Collapsible
// ---------------------------------------------------------------------------
describe('Collapsible', () => {
  it('renders trigger', () => {
    render(
      <Themed>
        <Collapsible trigger="Show more">
          <p>Hidden content</p>
        </Collapsible>
      </Themed>
    )
    expect(screen.getByText('Show more')).toBeInTheDocument()
  })

  it('opens on trigger click', async () => {
    const user = userEvent.setup()
    render(
      <Themed>
        <Collapsible trigger="Toggle">
          <p>Revealed content</p>
        </Collapsible>
      </Themed>
    )
    // Radix Collapsible removes closed content from DOM
    expect(screen.queryByText('Revealed content')).not.toBeInTheDocument()
    await user.click(screen.getByText('Toggle'))
    expect(screen.getByText('Revealed content')).toBeInTheDocument()
  })

  it('can be defaultOpen', () => {
    render(
      <Themed>
        <Collapsible trigger="Toggle" defaultOpen>
          <p>Open by default</p>
        </Collapsible>
      </Themed>
    )
    expect(screen.getByText('Open by default')).toBeVisible()
  })

  it('calls onOpenChange', async () => {
    const handler = vi.fn()
    const user = userEvent.setup()
    render(
      <Themed>
        <Collapsible trigger="Toggle" onOpenChange={handler}>
          <p>content</p>
        </Collapsible>
      </Themed>
    )
    await user.click(screen.getByText('Toggle'))
    expect(handler).toHaveBeenCalledWith(true)
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <Themed>
        <Collapsible trigger="Section">
          <p>Content</p>
        </Collapsible>
      </Themed>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Toolbar
// ---------------------------------------------------------------------------
describe('Toolbar', () => {
  it('renders buttons', () => {
    render(
      <Themed>
        <Toolbar aria-label="Text formatting">
          <Toolbar.Button>Bold</Toolbar.Button>
          <Toolbar.Button>Italic</Toolbar.Button>
        </Toolbar>
      </Themed>
    )
    expect(screen.getByRole('toolbar', { name: 'Text formatting' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Bold' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Italic' })).toBeInTheDocument()
  })

  it('renders separator', () => {
    render(
      <Themed>
        <Toolbar aria-label="Edit toolbar">
          <Toolbar.Button>Cut</Toolbar.Button>
          <Toolbar.Separator />
          <Toolbar.Button>Paste</Toolbar.Button>
        </Toolbar>
      </Themed>
    )
    expect(screen.getByRole('separator')).toBeInTheDocument()
  })

  it('renders toggle group', () => {
    render(
      <Themed>
        <Toolbar aria-label="Align">
          <Toolbar.ToggleGroup type="single" aria-label="Alignment">
            <Toolbar.ToggleItem value="left">Left</Toolbar.ToggleItem>
            <Toolbar.ToggleItem value="center">Center</Toolbar.ToggleItem>
          </Toolbar.ToggleGroup>
        </Toolbar>
      </Themed>
    )
    expect(screen.getByText('Left')).toBeInTheDocument()
    expect(screen.getByText('Center')).toBeInTheDocument()
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <Themed>
        <Toolbar aria-label="Accessible toolbar">
          <Toolbar.Button>Action</Toolbar.Button>
        </Toolbar>
      </Themed>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Steps
// ---------------------------------------------------------------------------
describe('Steps', () => {
  const STEPS: Step[] = [
    { label: 'Setup', status: 'completed' },
    { label: 'Configure', status: 'active', description: 'Set your options' },
    { label: 'Deploy', status: 'pending' },
  ]

  it('renders all step labels', () => {
    render(
      <Themed>
        <Steps steps={STEPS} />
      </Themed>
    )
    expect(screen.getByText('Setup')).toBeInTheDocument()
    expect(screen.getByText('Configure')).toBeInTheDocument()
    expect(screen.getByText('Deploy')).toBeInTheDocument()
  })

  it('marks active step with aria-current=step', () => {
    render(
      <Themed>
        <Steps steps={STEPS} />
      </Themed>
    )
    const active = screen.getByText('Configure').closest('li')
    expect(active).toHaveAttribute('aria-current', 'step')
  })

  it('renders description for active step', () => {
    render(
      <Themed>
        <Steps steps={STEPS} />
      </Themed>
    )
    expect(screen.getByText('Set your options')).toBeInTheDocument()
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <Themed>
        <Steps steps={STEPS} />
      </Themed>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Avatar
// ---------------------------------------------------------------------------
describe('Avatar', () => {
  it('renders fallback initials when no src', async () => {
    render(
      <Themed>
        <Avatar alt="James Smith" fallback="JS" />
      </Themed>
    )
    // Radix Avatar Fallback fires via async timer — use findByText
    expect(await screen.findByText('JS')).toBeInTheDocument()
  })

  it('auto-generates initials from alt when no fallback', async () => {
    render(
      <Themed>
        <Avatar alt="James Smith" />
      </Themed>
    )
    expect(await screen.findByText('JA')).toBeInTheDocument()
  })

  it('renders the avatar container', () => {
    const { container } = render(
      <Themed>
        <Avatar src="https://example.com/avatar.png" alt="Profile picture" />
      </Themed>
    )
    // jsdom does not load images; verify the root element renders
    expect(container.querySelector('.forge-avatar')).toBeInTheDocument()
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <Themed>
        <Avatar alt="John Doe" fallback="JD" />
      </Themed>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// AspectRatio
// ---------------------------------------------------------------------------
describe('AspectRatio', () => {
  it('renders children', () => {
    render(
      <Themed>
        <AspectRatio ratio={16 / 9}>
          <img src="test.png" alt="Wide landscape" />
        </AspectRatio>
      </Themed>
    )
    expect(screen.getByAltText('Wide landscape')).toBeInTheDocument()
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <Themed>
        <AspectRatio ratio={4 / 3}>
          <div role="img" aria-label="A picture">content</div>
        </AspectRatio>
      </Themed>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Breadcrumb
// ---------------------------------------------------------------------------
describe('Breadcrumb', () => {
  const ITEMS: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: 'ForgeUI' },
  ]

  it('renders all crumbs', () => {
    render(
      <Themed>
        <Breadcrumb items={ITEMS} />
      </Themed>
    )
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('ForgeUI')).toBeInTheDocument()
  })

  it('marks last item with aria-current=page', () => {
    render(
      <Themed>
        <Breadcrumb items={ITEMS} />
      </Themed>
    )
    expect(screen.getByText('ForgeUI')).toHaveAttribute('aria-current', 'page')
  })

  it('renders links for non-last items', () => {
    render(
      <Themed>
        <Breadcrumb items={ITEMS} />
      </Themed>
    )
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/projects')
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <Themed>
        <Breadcrumb items={ITEMS} />
      </Themed>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Menubar
// ---------------------------------------------------------------------------
describe('Menubar', () => {
  const MENUS: MenubarMenu[] = [
    {
      label: 'File',
      items: [
        { label: 'New', shortcut: '⌘N', onSelect: vi.fn() },
        { label: 'Open', shortcut: '⌘O', onSelect: vi.fn() },
        { type: 'separator' },
        { label: 'Exit', onSelect: vi.fn() },
      ],
    },
    {
      label: 'Edit',
      items: [
        { label: 'Undo', shortcut: '⌘Z', onSelect: vi.fn() },
        { label: 'Redo', shortcut: '⌘Y', onSelect: vi.fn() },
      ],
    },
  ]

  it('renders menu labels', () => {
    render(
      <Themed>
        <Menubar menus={MENUS} />
      </Themed>
    )
    expect(screen.getByText('File')).toBeInTheDocument()
    expect(screen.getByText('Edit')).toBeInTheDocument()
  })

  it('opens menu on click and shows items', async () => {
    const user = userEvent.setup()
    render(
      <Themed>
        <Menubar menus={MENUS} />
      </Themed>
    )
    await user.click(screen.getByText('File'))
    expect(screen.getByText('New')).toBeInTheDocument()
    expect(screen.getByText('Open')).toBeInTheDocument()
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <Themed>
        <Menubar menus={MENUS} />
      </Themed>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Table
// ---------------------------------------------------------------------------
describe('Table', () => {
  it('renders table structure', () => {
    render(
      <Themed>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>Name</Table.Head>
              <Table.Head>Status</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>ForgeUI</Table.Cell>
              <Table.Cell>Active</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Themed>
    )
    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('ForgeUI')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('renders sortable column header', () => {
    const onSort = vi.fn()
    render(
      <Themed>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head sortDirection="asc" onSort={onSort}>Name</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body />
        </Table>
      </Themed>
    )
    const th = screen.getByRole('columnheader', { name: /Name/ })
    expect(th).toHaveAttribute('aria-sort', 'ascending')
    fireEvent.click(th)
    expect(onSort).toHaveBeenCalled()
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <Themed>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>Col A</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Data</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Themed>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// AppShell
// ---------------------------------------------------------------------------
describe('AppShell', () => {
  it('renders main content', () => {
    render(
      <Themed>
        <AppShell>
          <p>Main content</p>
        </AppShell>
      </Themed>
    )
    expect(screen.getByText('Main content')).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('renders nav slot', () => {
    render(
      <Themed>
        <AppShell nav={<span>TopNav</span>}>
          content
        </AppShell>
      </Themed>
    )
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByText('TopNav')).toBeInTheDocument()
  })

  it('renders sidebar slot', () => {
    render(
      <Themed>
        <AppShell sidebar={<span>SidePanel</span>}>
          content
        </AppShell>
      </Themed>
    )
    expect(screen.getByRole('complementary')).toBeInTheDocument()
    expect(screen.getByText('SidePanel')).toBeInTheDocument()
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <Themed>
        <AppShell nav={<span>Nav</span>} sidebar={<span>Sidebar</span>}>
          <p>Main</p>
        </AppShell>
      </Themed>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// DropZone
// ---------------------------------------------------------------------------
describe('DropZone', () => {
  it('renders default placeholder', () => {
    render(
      <Themed>
        <DropZone onDrop={() => {}} />
      </Themed>
    )
    expect(screen.getByText(/Drop files here or click to browse/)).toBeInTheDocument()
  })

  it('shows accepted types and max size', () => {
    render(
      <Themed>
        <DropZone onDrop={() => {}} accept={['.png', '.jpg']} maxSize={5 * 1024 * 1024} />
      </Themed>
    )
    expect(screen.getByText(/\.png/)).toBeInTheDocument()
    expect(screen.getByText(/5\.0 MB/)).toBeInTheDocument()
  })

  it('renders custom children', () => {
    render(
      <Themed>
        <DropZone onDrop={() => {}}>
          <span>Custom drop UI</span>
        </DropZone>
      </Themed>
    )
    expect(screen.getByText('Custom drop UI')).toBeInTheDocument()
  })

  it('shows error when wrong file type dropped', () => {
    render(
      <Themed>
        <DropZone onDrop={() => {}} accept={['.png']} />
      </Themed>
    )
    const file = new File(['hello'], 'test.txt', { type: 'text/plain' })
    const dt = { files: Object.assign([file], { item: () => file, length: 1 }) }
    fireEvent.drop(screen.getByRole('button'), {
      dataTransfer: dt,
    })
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('calls onDrop with valid files', () => {
    const onDrop = vi.fn()
    render(
      <Themed>
        <DropZone onDrop={onDrop} accept={['.png']} />
      </Themed>
    )
    const file = new File(['img'], 'photo.png', { type: 'image/png' })
    const dt = { files: Object.assign([file], { item: () => file, length: 1 }) }
    fireEvent.drop(screen.getByRole('button'), {
      dataTransfer: dt,
    })
    expect(onDrop).toHaveBeenCalledWith([file])
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <Themed>
        <DropZone onDrop={() => {}} accept={['.png', '.jpg']} />
      </Themed>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------
describe('Pagination', () => {
  it('renders page buttons', () => {
    render(
      <Themed>
        <Pagination page={1} pageSize={10} total={50} onPageChange={() => {}} />
      </Themed>
    )
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Page 1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Page 2' })).toBeInTheDocument()
  })

  it('shows results summary', () => {
    render(
      <Themed>
        <Pagination page={2} pageSize={10} total={50} onPageChange={() => {}} />
      </Themed>
    )
    expect(screen.getByText('11–20 of 50')).toBeInTheDocument()
  })

  it('disables prev on first page', () => {
    render(
      <Themed>
        <Pagination page={1} pageSize={10} total={30} onPageChange={() => {}} />
      </Themed>
    )
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled()
  })

  it('disables next on last page', () => {
    render(
      <Themed>
        <Pagination page={3} pageSize={10} total={30} onPageChange={() => {}} />
      </Themed>
    )
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled()
  })

  it('calls onPageChange when navigating', async () => {
    const onPageChange = vi.fn()
    const user = userEvent.setup()
    render(
      <Themed>
        <Pagination page={1} pageSize={10} total={30} onPageChange={onPageChange} />
      </Themed>
    )
    await user.click(screen.getByRole('button', { name: 'Next page' }))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('marks current page as aria-current=page', () => {
    render(
      <Themed>
        <Pagination page={2} pageSize={10} total={30} onPageChange={() => {}} />
      </Themed>
    )
    expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page')
  })

  it('renders page size selector', () => {
    const onPageSizeChange = vi.fn()
    render(
      <Themed>
        <Pagination
          page={1} pageSize={10} total={100}
          onPageChange={() => {}}
          pageSizeOptions={[10, 25, 50]}
          onPageSizeChange={onPageSizeChange}
        />
      </Themed>
    )
    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
    fireEvent.change(select, { target: { value: '25' } })
    expect(onPageSizeChange).toHaveBeenCalledWith(25)
  })

  it('shows No results when total is 0', () => {
    render(
      <Themed>
        <Pagination page={1} pageSize={10} total={0} onPageChange={() => {}} />
      </Themed>
    )
    expect(screen.getByText('No results')).toBeInTheDocument()
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <Themed>
        <Pagination page={2} pageSize={10} total={50} onPageChange={() => {}} />
      </Themed>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// StatCard
// ---------------------------------------------------------------------------
describe('StatCard', () => {
  it('renders label and value', () => {
    render(<Themed><StatCard label="Entities" value={142} /></Themed>)
    expect(screen.getByText('Entities')).toBeInTheDocument()
    expect(screen.getByText('142')).toBeInTheDocument()
  })

  it('renders delta when provided', () => {
    render(<Themed><StatCard label="Quests" value={38} delta="+3" /></Themed>)
    expect(screen.getByText('+3')).toBeInTheDocument()
  })

  it('renders icon when provided', () => {
    render(<Themed><StatCard label="Level" value={12} icon="⚔️" /></Themed>)
    expect(screen.getByText('⚔️')).toBeInTheDocument()
  })

  it('fires onClick when clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Themed><StatCard label="Zones" value={6} onClick={onClick} /></Themed>)
    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('has role=button only when clickable', () => {
    const { rerender } = render(<Themed><StatCard label="A" value={1} /></Themed>)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    rerender(<Themed><StatCard label="A" value={1} onClick={() => {}} /></Themed>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('responds to Enter key when clickable', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Themed><StatCard label="X" value={0} onClick={onClick} /></Themed>)
    screen.getByRole('button').focus()
    await user.keyboard('{Enter}')
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <Themed><StatCard label="Factions" value={7} icon="🛡️" delta="+1" /></Themed>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// HealthRow
// ---------------------------------------------------------------------------
describe('HealthRow', () => {
  it('renders name and detail', () => {
    render(<Themed><HealthRow name="Entity Store" status="ok" detail="142 artifacts" /></Themed>)
    expect(screen.getByText('Entity Store')).toBeInTheDocument()
    expect(screen.getByText('142 artifacts')).toBeInTheDocument()
  })

  it('renders icon when provided', () => {
    render(<Themed><HealthRow name="Rules" status="ok" detail="Valid" icon="📐" /></Themed>)
    expect(screen.getByText('📐')).toBeInTheDocument()
  })

  it('has status role with accessible label', () => {
    render(<Themed><HealthRow name="Pipeline" status="error" detail="2 issues" /></Themed>)
    expect(screen.getByRole('status', { name: 'Pipeline: Error' })).toBeInTheDocument()
  })

  it('shows spinner for running status', () => {
    const { container } = render(<Themed><HealthRow name="Build" status="running" detail="Building…" /></Themed>)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <Themed><HealthRow name="Terrain" status="warn" detail="1 gap" icon="🏔️" /></Themed>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// NavItem
// ---------------------------------------------------------------------------
describe('NavItem', () => {
  it('renders label', () => {
    render(<Themed><NavItem label="Entities" /></Themed>)
    expect(screen.getByRole('button', { name: /Entities/ })).toBeInTheDocument()
  })

  it('renders icon when provided', () => {
    render(<Themed><NavItem label="Quests" icon="📜" /></Themed>)
    expect(screen.getByText('📜')).toBeInTheDocument()
  })

  it('renders count badge when provided', () => {
    render(<Themed><NavItem label="Entities" count={142} /></Themed>)
    expect(screen.getByText('142')).toBeInTheDocument()
  })

  it('sets aria-current=page when active', () => {
    render(<Themed><NavItem label="Active" active /></Themed>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-current', 'page')
  })

  it('fires onClick', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Themed><NavItem label="Click" onClick={onClick} /></Themed>)
    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('is disabled when disabled=true', () => {
    render(<Themed><NavItem label="Disabled" disabled /></Themed>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <Themed><NavItem label="Entities" icon="👤" active count={42} /></Themed>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// ModuleToolbar
// ---------------------------------------------------------------------------
describe('ModuleToolbar', () => {
  it('renders title', () => {
    render(<Themed><ModuleToolbar title="Entities" /></Themed>)
    expect(screen.getByRole('toolbar', { name: 'Entities' })).toBeInTheDocument()
    expect(screen.getByText('Entities')).toBeInTheDocument()
  })

  it('renders badge when provided', () => {
    render(<Themed><ModuleToolbar badge="EA" title="Entities" /></Themed>)
    expect(screen.getByText('EA')).toBeInTheDocument()
  })

  it('renders children in middle slot', () => {
    render(
      <Themed>
        <ModuleToolbar title="Entities">
          <span>View switcher</span>
        </ModuleToolbar>
      </Themed>
    )
    expect(screen.getByText('View switcher')).toBeInTheDocument()
  })

  it('renders actions on the right', () => {
    render(
      <Themed>
        <ModuleToolbar title="Entities" actions={<button>Save</button>} />
      </Themed>
    )
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <Themed><ModuleToolbar badge="QF" title="Quests" actions={<button>Add</button>} /></Themed>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// EntityCard
// ---------------------------------------------------------------------------
describe('EntityCard', () => {
  it('renders name and type', () => {
    render(
      <Themed><EntityCard name="Gandalf" type="Character" /></Themed>
    )
    expect(screen.getByText('Gandalf')).toBeInTheDocument()
    expect(screen.getByText('Character')).toBeInTheDocument()
  })

  it('renders status badge', () => {
    render(
      <Themed><EntityCard name="Mordor" type="Location" status="Canon" statusColor="var(--forge-success)" /></Themed>
    )
    expect(screen.getByText('Canon')).toBeInTheDocument()
  })

  it('renders tags', () => {
    render(
      <Themed><EntityCard name="Sting" type="Item" tags={['weapon', 'elvish']} /></Themed>
    )
    expect(screen.getByText('weapon')).toBeInTheDocument()
    expect(screen.getByText('elvish')).toBeInTheDocument()
  })

  it('renders metadata', () => {
    render(
      <Themed><EntityCard name="Test" type="Character" meta={[{ label: 'Age', value: '42' }]} /></Themed>
    )
    expect(screen.getByText('Age')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('handles click and selected state', async () => {
    const onClick = vi.fn()
    render(
      <Themed><EntityCard name="Test" type="NPC" selected onClick={onClick} /></Themed>
    )
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(button)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <Themed><EntityCard name="Test" type="Character" status="Draft" tags={['npc']} /></Themed>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// MiniMap
// ---------------------------------------------------------------------------
describe('MiniMap', () => {
  it('renders with aria-label', () => {
    render(
      <Themed>
        <MiniMap contentWidth={1000} contentHeight={800} viewport={{ x: 0, y: 0, width: 400, height: 300 }} />
      </Themed>
    )
    expect(screen.getByRole('img', { name: 'Minimap navigation' })).toBeInTheDocument()
  })

  it('renders children content', () => {
    render(
      <Themed>
        <MiniMap contentWidth={1000} contentHeight={800} viewport={{ x: 0, y: 0, width: 400, height: 300 }}>
          <div data-testid="map-content">dots</div>
        </MiniMap>
      </Themed>
    )
    expect(screen.getByTestId('map-content')).toBeInTheDocument()
  })

  it('calls onViewportChange on pointer down', () => {
    const onChange = vi.fn()
    render(
      <Themed>
        <MiniMap contentWidth={1000} contentHeight={800} viewport={{ x: 0, y: 0, width: 400, height: 300 }} onViewportChange={onChange} />
      </Themed>
    )
    const map = screen.getByRole('img')
    fireEvent.pointerDown(map, { clientX: 100, clientY: 70 })
    expect(onChange).toHaveBeenCalled()
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <Themed>
        <MiniMap contentWidth={1000} contentHeight={800} viewport={{ x: 0, y: 0, width: 400, height: 300 }} />
      </Themed>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// ApprovalPanel
// ---------------------------------------------------------------------------
describe('ApprovalPanel', () => {
  it('renders title, status, and children', () => {
    render(
      <Themed>
        <ApprovalPanel title="Entity Update" status="pending">
          <p>Review content</p>
        </ApprovalPanel>
      </Themed>
    )
    expect(screen.getByText('Entity Update')).toBeInTheDocument()
    expect(screen.getByText('Pending Review')).toBeInTheDocument()
    expect(screen.getByText('Review content')).toBeInTheDocument()
  })

  it('shows approve/reject buttons when pending', () => {
    render(
      <Themed>
        <ApprovalPanel title="Test" onApprove={() => {}} onReject={() => {}}>
          <p>content</p>
        </ApprovalPanel>
      </Themed>
    )
    expect(screen.getByRole('button', { name: 'Approve' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reject' })).toBeInTheDocument()
  })

  it('hides buttons when approved', () => {
    render(
      <Themed>
        <ApprovalPanel title="Test" status="approved" onApprove={() => {}}>
          <p>content</p>
        </ApprovalPanel>
      </Themed>
    )
    expect(screen.getByText('Approved')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Approve' })).not.toBeInTheDocument()
  })

  it('calls onApprove with rationale', async () => {
    const onApprove = vi.fn()
    render(
      <Themed>
        <ApprovalPanel title="Test" onApprove={onApprove}>
          <p>content</p>
        </ApprovalPanel>
      </Themed>
    )
    const textarea = screen.getByPlaceholderText('Add rationale (optional)…')
    await userEvent.type(textarea, 'Looks good')
    await userEvent.click(screen.getByRole('button', { name: 'Approve' }))
    expect(onApprove).toHaveBeenCalledWith('Looks good')
  })

  it('calls onReject with rationale', async () => {
    const onReject = vi.fn()
    render(
      <Themed>
        <ApprovalPanel title="Test" onReject={onReject}>
          <p>content</p>
        </ApprovalPanel>
      </Themed>
    )
    await userEvent.type(screen.getByPlaceholderText('Add rationale (optional)…'), 'Needs work')
    await userEvent.click(screen.getByRole('button', { name: 'Reject' }))
    expect(onReject).toHaveBeenCalledWith('Needs work')
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <Themed>
        <ApprovalPanel title="Test" status="pending" onApprove={() => {}} onReject={() => {}}>
          <p>content</p>
        </ApprovalPanel>
      </Themed>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
