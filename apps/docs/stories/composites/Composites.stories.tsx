import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import {
  Drawer, Collapsible, Toolbar, Steps, Avatar, AspectRatio,
  Breadcrumb, Menubar, Table, AppShell, ResizablePanelGroup,
  ResizablePanel, DropZone, Pagination, Button, IconButton,
  Badge, Text, Heading,
} from '@forgeui/components'
import type { Step, MenubarMenu, BreadcrumbItem } from '@forgeui/components'

const meta: Meta = {
  title: 'Composites/Gallery',
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'ForgeUI Phase 2a — composites, layout, and data-display components.' } },
  },
}
export default meta
type Story = StoryObj

// ---------------------------------------------------------------------------
// Drawer
// ---------------------------------------------------------------------------
export const DrawerStory: Story = {
  name: 'Drawer',
  render: function DrawerDemo() {
    const [open, setOpen] = useState(false)
    const [side, setSide] = useState<'left' | 'right' | 'top' | 'bottom'>('right')
    return (
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {(['right', 'left', 'bottom'] as const).map(s => (
          <Button key={s} variant="secondary" onClick={() => { setSide(s); setOpen(true) }}>
            Open {s}
          </Button>
        ))}
        <Drawer
          open={open}
          onOpenChange={setOpen}
          side={side}
          title="Entity Inspector"
          description="View and edit component properties for the selected entity."
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '0 24px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text size="sm" style={{ color: 'var(--forge-text-muted)' }}>Transform</Text>
              <Badge>Active</Badge>
            </div>
            {['Position', 'Rotation', 'Scale'].map(prop => (
              <div key={prop} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--forge-border-subtle)' }}>
                <Text size="sm">{prop}</Text>
                <Text size="sm" style={{ color: 'var(--forge-text-muted)', fontFamily: 'var(--forge-font-mono)' }}>
                  {prop === 'Scale' ? '1.0, 1.0, 1.0' : '0.0, 0.0, 0.0'}
                </Text>
              </div>
            ))}
            <Button variant="primary" onClick={() => setOpen(false)}>Close Inspector</Button>
          </div>
        </Drawer>
      </div>
    )
  },
}

// ---------------------------------------------------------------------------
// Collapsible
// ---------------------------------------------------------------------------
export const CollapsibleStory: Story = {
  name: 'Collapsible',
  render: function CollapsibleDemo() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '360px' }}>
        {[
          { label: 'Transform', content: 'Position · Rotation · Scale' },
          { label: 'Physics', content: 'Mass · Friction · Restitution · Constraints' },
          { label: 'Rendering', content: 'Material · Cast Shadows · Receive Shadows · Layer Mask' },
        ].map(({ label, content }) => (
          <div key={label} style={{ border: '1px solid var(--forge-border)', borderRadius: 'var(--forge-radius-md)', overflow: 'hidden' }}>
            <Collapsible
              defaultOpen={label === 'Transform'}
              trigger={
                <div style={{ padding: '10px 12px', backgroundColor: 'var(--forge-surface)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Text size="sm" style={{ fontWeight: 500 }}>{label}</Text>
                </div>
              }
            >
              <div style={{ padding: '12px', backgroundColor: 'var(--forge-bg)', color: 'var(--forge-text-muted)', fontSize: 'var(--forge-font-size-sm)' }}>
                {content}
              </div>
            </Collapsible>
          </div>
        ))}
      </div>
    )
  },
}

// ---------------------------------------------------------------------------
// Toolbar
// ---------------------------------------------------------------------------
export const ToolbarStory: Story = {
  name: 'Toolbar',
  render: function ToolbarDemo() {
    const [activeTool, setActiveTool] = useState('select')
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Toolbar aria-label="Editor toolbar">
          <Toolbar.Button onClick={() => alert('New')}>New</Toolbar.Button>
          <Toolbar.Button onClick={() => alert('Open')}>Open</Toolbar.Button>
          <Toolbar.Button onClick={() => alert('Save')}>Save</Toolbar.Button>
          <Toolbar.Separator />
          <Toolbar.Button onClick={() => alert('Undo')}>↩ Undo</Toolbar.Button>
          <Toolbar.Button onClick={() => alert('Redo')}>↪ Redo</Toolbar.Button>
          <Toolbar.Separator />
          <Toolbar.ToggleGroup type="single" value={activeTool} onValueChange={v => { if (v) setActiveTool(v) }}>
            <Toolbar.ToggleItem value="select" aria-label="Select">✦ Select</Toolbar.ToggleItem>
            <Toolbar.ToggleItem value="move" aria-label="Move">✥ Move</Toolbar.ToggleItem>
            <Toolbar.ToggleItem value="rotate" aria-label="Rotate">↻ Rotate</Toolbar.ToggleItem>
            <Toolbar.ToggleItem value="scale" aria-label="Scale">⤡ Scale</Toolbar.ToggleItem>
          </Toolbar.ToggleGroup>
        </Toolbar>
        <Text size="sm" style={{ color: 'var(--forge-text-muted)' }}>Active tool: {activeTool}</Text>
      </div>
    )
  },
}

// ---------------------------------------------------------------------------
// Steps
// ---------------------------------------------------------------------------
const IMPORT_STEPS: Step[] = [
  { label: 'Select file',     status: 'completed' },
  { label: 'Configure',       status: 'completed' },
  { label: 'Map materials',   status: 'active'    },
  { label: 'Preview',         status: 'pending'   },
  { label: 'Import',          status: 'pending'   },
]

const FAILED_STEPS: Step[] = [
  { label: 'Parse',       status: 'completed' },
  { label: 'Validate',    status: 'error',     description: 'Invalid vertex count' },
  { label: 'Build LODs',  status: 'pending'   },
  { label: 'Export',      status: 'pending'   },
]

export const StepsStory: Story = {
  name: 'Steps',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '600px' }}>
      <div>
        <Text size="sm" style={{ color: 'var(--forge-text-muted)', marginBottom: '12px', display: 'block' }}>Asset import wizard</Text>
        <Steps steps={IMPORT_STEPS} />
      </div>
      <div>
        <Text size="sm" style={{ color: 'var(--forge-text-muted)', marginBottom: '12px', display: 'block' }}>Build pipeline — error state</Text>
        <Steps steps={FAILED_STEPS} />
      </div>
    </div>
  ),
}

// ---------------------------------------------------------------------------
// Avatar
// ---------------------------------------------------------------------------
export const AvatarStory: Story = {
  name: 'Avatar',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(size => (
          <Avatar key={size} alt="James Dev" fallback="JD" size={size} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Avatar alt="Anna" fallback="A" size="md" />
        <Avatar alt="Bob Chen" fallback="BC" size="md" />
        <Avatar alt="Dev Team" fallback="DT" size="md" />
        <Avatar alt="Guest" fallback="?" size="md" />
      </div>
      <div style={{ display: 'flex', gap: '-8px' }}>
        {['JD', 'BC', 'AT', 'MR'].map((f, i) => (
          <div key={f} style={{ marginLeft: i > 0 ? '-10px' : 0, position: 'relative', zIndex: 4 - i }}>
            <Avatar alt={f} fallback={f} size="sm" />
          </div>
        ))}
        <div style={{ marginLeft: '-10px', zIndex: 0, position: 'relative' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--forge-surface)', border: '1px solid var(--forge-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'var(--forge-text-muted)' }}>+3</div>
        </div>
      </div>
    </div>
  ),
}

// ---------------------------------------------------------------------------
// AspectRatio
// ---------------------------------------------------------------------------
export const AspectRatioStory: Story = {
  name: 'AspectRatio',
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      {([
        { ratio: 16 / 9, label: '16:9', color: 'var(--forge-accent)' },
        { ratio: 4 / 3,  label: '4:3',  color: 'var(--forge-success)' },
        { ratio: 1,      label: '1:1',  color: 'var(--forge-warning)' },
      ] as const).map(({ ratio, label, color }) => (
        <div key={label} style={{ width: '180px' }}>
          <AspectRatio ratio={ratio}>
            <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--forge-surface)', border: '1px solid var(--forge-border)', borderRadius: 'var(--forge-radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '4px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: 'var(--forge-radius-sm)', backgroundColor: color, opacity: 0.3 }} />
              <Text size="xs" style={{ color: 'var(--forge-text-muted)' }}>{label}</Text>
            </div>
          </AspectRatio>
        </div>
      ))}
    </div>
  ),
}

// ---------------------------------------------------------------------------
// Breadcrumb
// ---------------------------------------------------------------------------
const CRUMBS: BreadcrumbItem[] = [
  { label: 'Project', href: '#' },
  { label: 'Assets',  href: '#' },
  { label: 'Textures', href: '#' },
  { label: 'diffuse_albedo.png' },
]

export const BreadcrumbStory: Story = {
  name: 'Breadcrumb',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Breadcrumb items={CRUMBS} />
      <Breadcrumb items={[{ label: 'Project' }]} />
      <Breadcrumb items={[{ label: 'Project', href: '#' }, { label: 'SpaceShooter.level' }]} />
    </div>
  ),
}

// ---------------------------------------------------------------------------
// Menubar
// ---------------------------------------------------------------------------
const APP_MENUS: MenubarMenu[] = [
  {
    label: 'File',
    items: [
      { label: 'New Scene',   shortcut: '⌘N',  onSelect: () => alert('New') },
      { label: 'Open…',       shortcut: '⌘O',  onSelect: () => alert('Open') },
      { label: 'Save',        shortcut: '⌘S',  onSelect: () => alert('Save') },
      { label: 'Save As…',    shortcut: '⌘⇧S', onSelect: () => alert('Save As') },
      { type: 'separator' },
      {
        type: 'sub',
        label: 'Export',
        items: [
          { label: 'As GLTF',   onSelect: () => alert('GLTF') },
          { label: 'As FBX',    onSelect: () => alert('FBX') },
          { label: 'As OBJ',    onSelect: () => alert('OBJ') },
        ],
      },
      { type: 'separator' },
      { label: 'Quit', variant: 'danger', onSelect: () => alert('Quit') },
    ],
  },
  {
    label: 'Edit',
    items: [
      { label: 'Undo',       shortcut: '⌘Z',  onSelect: () => alert('Undo') },
      { label: 'Redo',       shortcut: '⌘⇧Z', onSelect: () => alert('Redo') },
      { type: 'separator' },
      { label: 'Cut',        shortcut: '⌘X',  onSelect: () => alert('Cut') },
      { label: 'Copy',       shortcut: '⌘C',  onSelect: () => alert('Copy') },
      { label: 'Paste',      shortcut: '⌘V',  onSelect: () => alert('Paste') },
      { type: 'separator' },
      { label: 'Select All', shortcut: '⌘A',  onSelect: () => alert('Select All') },
    ],
  },
  {
    label: 'View',
    items: [
      { label: 'Toggle Sidebar',  shortcut: '⌘B',  onSelect: () => alert('Sidebar') },
      { label: 'Toggle Inspector', shortcut: '⌘I', onSelect: () => alert('Inspector') },
      { type: 'separator' },
      { label: 'Zoom In',  shortcut: '⌘+',  onSelect: () => alert('Zoom In') },
      { label: 'Zoom Out', shortcut: '⌘-',  onSelect: () => alert('Zoom Out') },
      { label: 'Fit All',  shortcut: '⌘0',  onSelect: () => alert('Fit') },
    ],
  },
]

export const MenubarStory: Story = {
  name: 'Menubar',
  render: () => (
    <div style={{ padding: '8px', backgroundColor: 'var(--forge-surface)', borderRadius: 'var(--forge-radius-md)', border: '1px solid var(--forge-border)' }}>
      <Menubar menus={APP_MENUS} />
    </div>
  ),
}

// ---------------------------------------------------------------------------
// Table
// ---------------------------------------------------------------------------
const ASSETS = [
  { name: 'player_mesh.glb',       type: 'Mesh',     size: '1.2 MB',  modified: 'Today' },
  { name: 'diffuse_albedo.png',    type: 'Texture',  size: '4.8 MB',  modified: 'Yesterday' },
  { name: 'explosion_vfx.prefab',  type: 'Prefab',   size: '128 KB',  modified: '3 days ago' },
  { name: 'footstep_grass.ogg',    type: 'Audio',    size: '92 KB',   modified: 'Last week' },
  { name: 'water_surface.mat',     type: 'Material', size: '8 KB',    modified: 'Last week' },
]

export const TableStory: Story = {
  name: 'Table',
  render: function TableDemo() {
    const [sortCol, setSortCol] = useState<string | null>(null)
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
    const toggleSort = (col: string) => {
      if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
      else { setSortCol(col); setSortDir('asc') }
    }
    const sorted = [...ASSETS].sort((a, b) => {
      if (!sortCol) return 0
      const av = a[sortCol as keyof typeof a], bv = b[sortCol as keyof typeof b]
      return (av < bv ? -1 : av > bv ? 1 : 0) * (sortDir === 'asc' ? 1 : -1)
    })
    return (
      <Table style={{ maxWidth: '600px' }}>
        <Table.Header>
          <Table.Row>
            <Table.Head sortDirection={sortCol === 'name' ? sortDir : false} onSort={() => toggleSort('name')}>Name</Table.Head>
            <Table.Head sortDirection={sortCol === 'type' ? sortDir : false} onSort={() => toggleSort('type')}>Type</Table.Head>
            <Table.Head sortDirection={sortCol === 'size' ? sortDir : false} onSort={() => toggleSort('size')}>Size</Table.Head>
            <Table.Head>Modified</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sorted.map(row => (
            <Table.Row key={row.name}>
              <Table.Cell style={{ fontFamily: 'var(--forge-font-mono)', fontSize: 'var(--forge-font-size-xs)' }}>{row.name}</Table.Cell>
              <Table.Cell><Badge>{row.type}</Badge></Table.Cell>
              <Table.Cell style={{ color: 'var(--forge-text-muted)' }}>{row.size}</Table.Cell>
              <Table.Cell style={{ color: 'var(--forge-text-muted)' }}>{row.modified}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    )
  },
}

// ---------------------------------------------------------------------------
// AppShell
// ---------------------------------------------------------------------------
export const AppShellStory: Story = {
  name: 'AppShell',
  parameters: {
    layout: 'fullscreen',
    docs: { description: { story: 'Full-viewport CSS grid layout. Scroll down to see the panel layout.' } },
  },
  render: () => (
    <div style={{ height: '600px', minWidth: '1280px', overflow: 'hidden' }}>
      <AppShell
        nav={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '16px', width: '100%' }}>
            <span style={{ color: 'var(--forge-accent)', fontWeight: 700, fontSize: '14px' }}>⚒ ForgeUI</span>
            <span style={{ color: 'var(--forge-border)', margin: '0 4px' }}>|</span>
            <Menubar menus={APP_MENUS} />
          </div>
        }
        sidebar={
          <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Text size="xs" style={{ color: 'var(--forge-text-muted)', padding: '0 8px 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Scene</Text>
            {['Root', '  Camera', '  Player', '    Mesh', '    Collider', '  Lights'].map(item => (
              <div key={item} style={{ padding: '4px 8px', borderRadius: 'var(--forge-radius-sm)', fontSize: 'var(--forge-font-size-sm)', color: item === '  Player' ? 'var(--forge-accent)' : 'var(--forge-text-muted)', backgroundColor: item === '  Player' ? 'var(--forge-surface-hover)' : 'transparent', cursor: 'default' }}>
                {item}
              </div>
            ))}
          </div>
        }
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--forge-text-muted)', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '48px', opacity: 0.2 }}>⚒</div>
          <Text size="sm">Main viewport — resize window to test</Text>
        </div>
      </AppShell>
    </div>
  ),
}

// ---------------------------------------------------------------------------
// ResizablePanelGroup
// ---------------------------------------------------------------------------
export const ResizableStory: Story = {
  name: 'ResizablePanelGroup',
  render: () => (
    <div style={{ height: '320px', border: '1px solid var(--forge-border)', borderRadius: 'var(--forge-radius-md)', overflow: 'hidden' }}>
      <ResizablePanelGroup direction="horizontal" storageKey="story-panels">
        <ResizablePanel defaultSize={200} minSize={120}>
          <div style={{ height: '100%', padding: '12px', backgroundColor: 'var(--forge-surface)' }}>
            <Text size="xs" style={{ color: 'var(--forge-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Scene Graph</Text>
            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {['Root', 'Camera', 'Player', 'Lights'].map(n => (
                <div key={n} style={{ padding: '4px 8px', fontSize: 'var(--forge-font-size-sm)', color: 'var(--forge-text-muted)', borderRadius: 'var(--forge-radius-sm)' }}>{n}</div>
              ))}
            </div>
          </div>
        </ResizablePanel>
        <ResizablePanel flex>
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--forge-text-muted)' }}>
            ← Drag dividers to resize →
          </div>
        </ResizablePanel>
        <ResizablePanel defaultSize={220} minSize={140}>
          <div style={{ height: '100%', padding: '12px', backgroundColor: 'var(--forge-surface)' }}>
            <Text size="xs" style={{ color: 'var(--forge-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Inspector</Text>
            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['Position', 'Rotation', 'Scale'].map(p => (
                <div key={p} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text size="sm" style={{ color: 'var(--forge-text-muted)' }}>{p}</Text>
                  <Text size="sm" style={{ fontFamily: 'var(--forge-font-mono)', fontSize: '11px' }}>0.0, 0.0, 0.0</Text>
                </div>
              ))}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
}

// ---------------------------------------------------------------------------
// DropZone
// ---------------------------------------------------------------------------
export const DropZoneStory: Story = {
  name: 'DropZone',
  render: function DropZoneDemo() {
    const [files, setFiles] = useState<string[]>([])
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '480px' }}>
        <DropZone
          accept={['.glb', '.fbx', '.obj', 'model/gltf-binary']}
          multiple
          maxSize={100 * 1024 * 1024}
          onDrop={fs => setFiles(prev => [...prev, ...fs.map(f => f.name)])}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{ fontSize: '32px', opacity: 0.4 }}>📦</div>
            <Text size="sm">Drop 3D assets here (.glb, .fbx, .obj)</Text>
            <Text size="xs" style={{ color: 'var(--forge-text-muted)' }}>or click to browse — max 100 MB</Text>
          </div>
        </DropZone>
        {files.length > 0 && (
          <div>
            <Text size="xs" style={{ color: 'var(--forge-text-muted)', marginBottom: '8px', display: 'block' }}>Queued for import:</Text>
            {files.map((f, i) => (
              <div key={i} style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--forge-border-subtle)' }}>
                <Badge>3D</Badge>
                <Text size="sm" style={{ fontFamily: 'var(--forge-font-mono)', fontSize: '11px' }}>{f}</Text>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  },
}

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------
export const PaginationStory: Story = {
  name: 'Pagination',
  render: function PaginationDemo() {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(25)
    const total = 1234
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={p => { setPageSize(p); setPage(1) }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Text size="xs" style={{ color: 'var(--forge-text-muted)' }}>Small dataset (no ellipsis)</Text>
          <Pagination page={2} pageSize={10} total={50} onPageChange={() => {}} />
        </div>
        <div>
          <Text size="xs" style={{ color: 'var(--forge-text-muted)' }}>Disabled state</Text>
          <Pagination page={1} pageSize={25} total={500} onPageChange={() => {}} disabled />
        </div>
      </div>
    )
  },
}
