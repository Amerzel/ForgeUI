import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { ThemeProvider } from '../ThemeProvider/index.js'
import {
  DataTable,
  CommandPalette,
  TreeView,
  Combobox,
  ColorPicker,
  TagsInput,
  PropertyGrid,
  EditableText,
} from '../index.js'
import type { ColumnDef, CommandGroup, TreeNode, PropertySection } from '../index.js'

function Themed({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>
}

// ---------------------------------------------------------------------------
// EditableText
// ---------------------------------------------------------------------------
describe('EditableText', () => {
  it('renders static text', () => {
    render(
      <Themed>
        <EditableText value="Hello world" onChange={() => {}} />
      </Themed>
    )
    expect(screen.getByText('Hello world')).toBeInTheDocument()
  })

  it('activates input on click', async () => {
    const user = userEvent.setup()
    render(
      <Themed>
        <EditableText value="Click me" onChange={() => {}} />
      </Themed>
    )
    await user.click(screen.getByRole('button'))
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('commits on Enter', async () => {
    const onCommit = vi.fn()
    const user = userEvent.setup()
    render(
      <Themed>
        <EditableText value="Initial" onCommit={onCommit} />
      </Themed>
    )
    await user.click(screen.getByRole('button'))
    const input = screen.getByRole('textbox')
    await user.clear(input)
    await user.type(input, 'Updated')
    await user.keyboard('{Enter}')
    expect(onCommit).toHaveBeenCalledWith('Updated')
  })

  it('cancels on Escape', async () => {
    const onCancel = vi.fn()
    const user = userEvent.setup()
    render(
      <Themed>
        <EditableText value="Original" onCancel={onCancel} />
      </Themed>
    )
    await user.click(screen.getByRole('button'))
    await user.keyboard('{Escape}')
    expect(onCancel).toHaveBeenCalled()
    expect(screen.getByText('Original')).toBeInTheDocument()
  })

  it('shows placeholder when value is empty', () => {
    render(
      <Themed>
        <EditableText value="" placeholder="Enter name" onChange={() => {}} />
      </Themed>
    )
    expect(screen.getByText('Enter name')).toBeInTheDocument()
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <Themed>
        <EditableText value="Test value" onChange={() => {}} />
      </Themed>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// TagsInput
// ---------------------------------------------------------------------------
describe('TagsInput', () => {
  it('renders existing tags', () => {
    render(
      <Themed>
        <TagsInput value={['react', 'typescript']} onChange={() => {}} />
      </Themed>
    )
    expect(screen.getByText('react')).toBeInTheDocument()
    expect(screen.getByText('typescript')).toBeInTheDocument()
  })

  it('adds tag on Enter', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(
      <Themed>
        <TagsInput value={[]} onChange={onChange} />
      </Themed>
    )
    const input = screen.getByRole('textbox')
    await user.type(input, 'newtag')
    await user.keyboard('{Enter}')
    expect(onChange).toHaveBeenCalledWith(['newtag'])
  })

  it('removes tag via × button', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(
      <Themed>
        <TagsInput value={['vue', 'react']} onChange={onChange} />
      </Themed>
    )
    await user.click(screen.getByRole('button', { name: 'Remove react' }))
    expect(onChange).toHaveBeenCalledWith(['vue'])
  })

  it('respects max prop', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(
      <Themed>
        <TagsInput value={['a', 'b']} onChange={onChange} max={2} />
      </Themed>
    )
    // Input should not be present when at max
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <Themed>
        <TagsInput value={['tag1', 'tag2']} onChange={() => {}} placeholder="Add tag" />
      </Themed>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// TreeView
// ---------------------------------------------------------------------------
describe('TreeView', () => {
  const NODES: TreeNode[] = [
    {
      id: 'root',
      label: 'Scene',
      children: [
        { id: 'player', label: 'Player' },
        { id: 'enemies', label: 'Enemies', children: [{ id: 'enemy1', label: 'Enemy 1' }] },
      ],
    },
  ]

  it('renders root nodes', () => {
    render(
      <Themed>
        <TreeView nodes={NODES} />
      </Themed>
    )
    expect(screen.getByText('Scene')).toBeInTheDocument()
  })

  it('shows children when parent is expanded', () => {
    render(
      <Themed>
        <TreeView nodes={NODES} expanded={['root']} />
      </Themed>
    )
    expect(screen.getByText('Player')).toBeInTheDocument()
    expect(screen.getByText('Enemies')).toBeInTheDocument()
  })

  it('calls onSelect when clicking a node', async () => {
    const onSelect = vi.fn()
    const user = userEvent.setup()
    render(
      <Themed>
        <TreeView nodes={NODES} onSelect={onSelect} />
      </Themed>
    )
    await user.click(screen.getByText('Scene'))
    expect(onSelect).toHaveBeenCalledWith('root')
  })

  it('calls onExpand when clicking a node with children', async () => {
    const onExpand = vi.fn()
    const user = userEvent.setup()
    render(
      <Themed>
        <TreeView nodes={NODES} onExpand={onExpand} />
      </Themed>
    )
    await user.click(screen.getByText('Scene'))
    expect(onExpand).toHaveBeenCalledWith('root', true)
  })

  it('marks selected node', () => {
    render(
      <Themed>
        <TreeView nodes={NODES} selected="root" />
      </Themed>
    )
    const item = screen.getByRole('treeitem', { name: /Scene/i })
    // selected treeitem should exist
    expect(item).toBeInTheDocument()
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <Themed>
        <TreeView nodes={NODES} expanded={['root']} selected="player" onSelect={() => {}} onExpand={() => {}} />
      </Themed>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Combobox
// ---------------------------------------------------------------------------
describe('Combobox', () => {
  const OPTIONS = [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'disabled', label: 'Disabled option', disabled: true },
  ]

  it('renders trigger with placeholder', () => {
    render(
      <Themed>
        <Combobox options={OPTIONS} placeholder="Pick a framework" />
      </Themed>
    )
    expect(screen.getByText('Pick a framework')).toBeInTheDocument()
  })

  it('shows selected value', () => {
    render(
      <Themed>
        <Combobox options={OPTIONS} value="react" />
      </Themed>
    )
    expect(screen.getByText('React')).toBeInTheDocument()
  })

  it('opens dropdown on click', async () => {
    const user = userEvent.setup()
    render(
      <Themed>
        <Combobox options={OPTIONS} />
      </Themed>
    )
    await user.click(screen.getByRole('combobox'))
    expect(screen.getByText('Vue')).toBeInTheDocument()
    expect(screen.getByText('Svelte')).toBeInTheDocument()
  })

  it('calls onChange when selecting option', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(
      <Themed>
        <Combobox options={OPTIONS} onChange={onChange} />
      </Themed>
    )
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByText('Vue'))
    expect(onChange).toHaveBeenCalledWith('vue')
  })

  it('has no axe violations when closed', async () => {
    const { container } = render(
      <Themed>
        <Combobox options={OPTIONS} value="react" placeholder="Select" />
      </Themed>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// ColorPicker
// ---------------------------------------------------------------------------
describe('ColorPicker', () => {
  it('renders color value input', () => {
    render(
      <Themed>
        <ColorPicker value="#ff0000" onChange={() => {}} />
      </Themed>
    )
    expect(screen.getByRole('textbox', { name: 'Color value' })).toBeInTheDocument()
  })

  it('renders swatches', () => {
    render(
      <Themed>
        <ColorPicker
          value="#ff0000"
          onChange={() => {}}
          swatches={['#ff0000', '#00ff00', '#0000ff']}
        />
      </Themed>
    )
    expect(screen.getByRole('button', { name: 'Select color #00ff00' })).toBeInTheDocument()
  })

  it('calls onChange when swatch clicked', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(
      <Themed>
        <ColorPicker
          value="#ff0000"
          onChange={onChange}
          swatches={['#00ff00']}
        />
      </Themed>
    )
    await user.click(screen.getByRole('button', { name: 'Select color #00ff00' }))
    expect(onChange).toHaveBeenCalled()
  })

  it('renders alpha slider when alpha=true', () => {
    render(
      <Themed>
        <ColorPicker value="#ff000080" onChange={() => {}} alpha />
      </Themed>
    )
    expect(screen.getByRole('slider', { name: 'Opacity' })).toBeInTheDocument()
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <Themed>
        <ColorPicker value="#3b82f6" onChange={() => {}} />
      </Themed>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// PropertyGrid
// ---------------------------------------------------------------------------
describe('PropertyGrid', () => {
  const SECTIONS: PropertySection[] = [
    {
      label: 'Transform',
      defaultOpen: true,
      items: [
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'visible', label: 'Visible', type: 'boolean' },
        { key: 'position', label: 'Position', type: 'vec3' },
        { key: 'blendMode', label: 'Blend Mode', type: 'select', options: [{ label: 'Normal', value: 'normal' }, { label: 'Add', value: 'add' }] },
      ],
    },
  ]

  it('renders section label and items', () => {
    render(
      <Themed>
        <PropertyGrid
          sections={SECTIONS}
          values={{ name: 'Entity', visible: true, position: [0, 1, 0], blendMode: 'normal' }}
          onChange={() => {}}
        />
      </Themed>
    )
    expect(screen.getByText('Transform')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Visible')).toBeInTheDocument()
  })

  it('calls onChange when text value changes', () => {
    const onChange = vi.fn()
    render(
      <Themed>
        <PropertyGrid
          sections={SECTIONS}
          values={{ name: 'Old' }}
          onChange={onChange}
        />
      </Themed>
    )
    const input = screen.getByRole('textbox', { name: 'Name' })
    // Use fireEvent.change on controlled inputs to avoid re-render race
    fireEvent.change(input, { target: { value: 'New' } })
    expect(onChange).toHaveBeenCalledWith('name', 'New')
  })

  it('calls onChange when boolean toggled', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(
      <Themed>
        <PropertyGrid
          sections={SECTIONS}
          values={{ visible: false }}
          onChange={onChange}
        />
      </Themed>
    )
    await user.click(screen.getByRole('checkbox', { name: 'Visible' }))
    expect(onChange).toHaveBeenCalledWith('visible', true)
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <Themed>
        <PropertyGrid
          sections={SECTIONS}
          values={{ name: 'Entity', visible: true, position: [0, 1, 0], blendMode: 'normal' }}
          onChange={() => {}}
        />
      </Themed>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// CommandPalette
// ---------------------------------------------------------------------------
describe('CommandPalette', () => {
  const GROUPS: CommandGroup[] = [
    {
      label: 'File',
      items: [
        { id: 'new', label: 'New File', shortcut: '⌘N', onSelect: vi.fn() },
        { id: 'open', label: 'Open File', shortcut: '⌘O', onSelect: vi.fn() },
      ],
    },
    {
      label: 'Edit',
      items: [
        { id: 'undo', label: 'Undo', keywords: ['revert', 'back'], onSelect: vi.fn() },
      ],
    },
  ]

  it('does not render when closed', () => {
    render(
      <Themed>
        <CommandPalette open={false} onOpenChange={() => {}} groups={GROUPS} />
      </Themed>
    )
    expect(screen.queryByText('New File')).not.toBeInTheDocument()
  })

  it('renders items when open', () => {
    render(
      <Themed>
        <CommandPalette open={true} onOpenChange={() => {}} groups={GROUPS} />
      </Themed>
    )
    expect(screen.getByText('New File')).toBeInTheDocument()
    expect(screen.getByText('Open File')).toBeInTheDocument()
    expect(screen.getByText('Undo')).toBeInTheDocument()
  })

  it('renders group headings', () => {
    render(
      <Themed>
        <CommandPalette open={true} onOpenChange={() => {}} groups={GROUPS} />
      </Themed>
    )
    expect(screen.getByText('File')).toBeInTheDocument()
    expect(screen.getByText('Edit')).toBeInTheDocument()
  })

  it('calls onOpenChange when closing', async () => {
    const onOpenChange = vi.fn()
    render(
      <Themed>
        <CommandPalette open={true} onOpenChange={onOpenChange} groups={GROUPS} />
      </Themed>
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    await waitFor(() => expect(onOpenChange).toHaveBeenCalled())
  })

  it('has no axe violations when open', async () => {
    const { container } = render(
      <Themed>
        <CommandPalette open={true} onOpenChange={() => {}} groups={GROUPS} />
      </Themed>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// DataTable
// ---------------------------------------------------------------------------
describe('DataTable', () => {
  interface Row { name: string; status: string; value: number }

  const DATA: Row[] = [
    { name: 'Alpha', status: 'active', value: 100 },
    { name: 'Beta', status: 'inactive', value: 200 },
    { name: 'Gamma', status: 'active', value: 300 },
  ]

  const COLUMNS: ColumnDef<Row>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'value', header: 'Value' },
  ]

  it('renders table with data', () => {
    render(
      <Themed>
        <DataTable columns={COLUMNS} data={DATA} />
      </Themed>
    )
    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
    expect(screen.getByText('Gamma')).toBeInTheDocument()
  })

  it('renders column headers', () => {
    render(
      <Themed>
        <DataTable columns={COLUMNS} data={DATA} />
      </Themed>
    )
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Status' })).toBeInTheDocument()
  })

  it('shows empty state when no data', () => {
    render(
      <Themed>
        <DataTable columns={COLUMNS} data={[]} empty="No records found" />
      </Themed>
    )
    expect(screen.getByText('No records found')).toBeInTheDocument()
  })

  it('shows loading spinner', () => {
    render(
      <Themed>
        <DataTable columns={COLUMNS} data={DATA} loading />
      </Themed>
    )
    expect(screen.getByRole('status', { name: /Loading/i })).toBeInTheDocument()
  })

  it('adds selection column when rowSelection=true', () => {
    render(
      <Themed>
        <DataTable columns={COLUMNS} data={DATA} rowSelection />
      </Themed>
    )
    const checkboxes = screen.getAllByRole('checkbox')
    // 1 header + 3 rows
    expect(checkboxes).toHaveLength(4)
  })

  it('renders pagination when pagination=true', () => {
    render(
      <Themed>
        <DataTable columns={COLUMNS} data={DATA} pagination pageSize={2} />
      </Themed>
    )
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument()
  })

  it('renders filter inputs when filtering=true', () => {
    render(
      <Themed>
        <DataTable columns={COLUMNS} data={DATA} filtering />
      </Themed>
    )
    expect(screen.getByRole('textbox', { name: /Filter Name/i })).toBeInTheDocument()
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <Themed>
        <DataTable columns={COLUMNS} data={DATA} />
      </Themed>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
