import type { Meta, StoryObj } from '@storybook/react'
import { useState, useEffect, useMemo } from 'react'
import {
  DataTable, CommandPalette, TreeView, Combobox, ColorPicker,
  TagsInput, PropertyGrid, EditableText, Button, Badge, Text,
} from '@forgeui/components'
import type {
  ColumnDef, CommandGroup, TreeNode, ComboboxOption,
  PropertySection, SelectOption,
} from '@forgeui/components'

const meta: Meta = {
  title: 'Complex/Gallery',
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'ForgeUI Phase 2b — complex inputs and data components.' } },
  },
}
export default meta
type Story = StoryObj

// ---------------------------------------------------------------------------
// DataTable
// ---------------------------------------------------------------------------
interface Asset {
  id: string
  name: string
  type: string
  size: number
  status: 'ready' | 'processing' | 'error'
  modified: string
}

const ASSET_NAMES = ['player_mesh', 'explosion_vfx', 'water_surface', 'sky_dome', 'rock_cliff', 'tree_oak', 'building_tower', 'chest_treasure'] as const
const ASSET_TYPES = ['Mesh', 'VFX', 'Material', 'Texture', 'Audio', 'Prefab'] as const
const ASSET_STATUSES = ['ready', 'ready', 'ready', 'processing', 'error'] as const
const MODIFIED_LABELS = ['Today', 'Yesterday', '3 days ago', 'Last week'] as const

const ASSET_DATA: Asset[] = Array.from({ length: 60 }, (_, i) => ({
  id: String(i + 1),
  name: (ASSET_NAMES[i % ASSET_NAMES.length] ?? 'asset') + `_${i + 1}.glb`,
  type: ASSET_TYPES[i % ASSET_TYPES.length] ?? 'Mesh',
  size: Math.round((((i * 7 + 3) % 200) / 10 + 0.1) * 100) / 100,
  status: ASSET_STATUSES[i % ASSET_STATUSES.length] ?? 'ready',
  modified: MODIFIED_LABELS[i % MODIFIED_LABELS.length] ?? 'Today',
}))

const ASSET_COLUMNS: ColumnDef<Asset>[] = [
  { accessorKey: 'name',     header: 'Name',     size: 240 },
  { accessorKey: 'type',     header: 'Type',     size: 100 },
  { accessorKey: 'size',     header: 'Size (MB)', size: 100, cell: info => `${info.getValue<number>().toFixed(1)} MB` },
  { accessorKey: 'status',   header: 'Status',   size: 110, cell: info => {
    const v = info.getValue<string>()
    const c = v === 'ready' ? 'success' : v === 'processing' ? 'warning' : 'danger'
    return <Badge color={c}>{v}</Badge>
  }},
  { accessorKey: 'modified', header: 'Modified', size: 120 },
]

export const DataTableStory: Story = {
  name: 'DataTable',
  render: () => (
    <div style={{ height: '480px', display: 'flex', flexDirection: 'column' }}>
      <DataTable
        columns={ASSET_COLUMNS}
        data={ASSET_DATA}
        sorting
        filtering
        rowSelection
        pagination
        pageSize={15}
      />
    </div>
  ),
}

export const DataTableVirtualized: Story = {
  name: 'DataTable — virtualized (10k rows)',
  render: () => {
    const BIG_TYPES = ['Mesh', 'Texture', 'Audio', 'Material'] as const
    const bigData = useMemo(() => Array.from({ length: 10000 }, (_, i) => ({
      id: String(i),
      name: `asset_${i.toString().padStart(5, '0')}.glb`,
      type: BIG_TYPES[i % BIG_TYPES.length] ?? 'Mesh',
      size: Math.round(((i * 13 + 7) % 2000)) / 100,
      status: 'ready' as const,
      modified: 'Today',
    })), [])
    return (
      <div style={{ height: '480px', display: 'flex', flexDirection: 'column' }}>
        <DataTable columns={ASSET_COLUMNS} data={bigData} sorting virtualized />
      </div>
    )
  },
}

// ---------------------------------------------------------------------------
// CommandPalette
// ---------------------------------------------------------------------------
const COMMANDS: CommandGroup[] = [
  {
    label: 'Scene',
    items: [
      { id: 'new-scene',   label: 'New Scene',         shortcut: '⌘N', keywords: ['create', 'blank'],      onSelect: () => alert('New scene') },
      { id: 'open-scene',  label: 'Open Scene…',       shortcut: '⌘O', keywords: ['load', 'file'],         onSelect: () => alert('Open') },
      { id: 'save-scene',  label: 'Save Scene',        shortcut: '⌘S', keywords: ['write'],                onSelect: () => alert('Save') },
    ],
  },
  {
    label: 'Assets',
    items: [
      { id: 'import-mesh', label: 'Import 3D Asset…',  keywords: ['mesh', 'glb', 'fbx', 'obj'],          onSelect: () => alert('Import') },
      { id: 'create-mat',  label: 'Create Material',   keywords: ['shader', 'pbr'],                       onSelect: () => alert('Material') },
      { id: 'bake-light',  label: 'Bake Lightmaps',    keywords: ['lighting', 'gi', 'global illumination'], onSelect: () => alert('Bake') },
    ],
  },
  {
    label: 'Build',
    items: [
      { id: 'build-all',   label: 'Build Project',     shortcut: '⌘B', keywords: ['compile', 'package'],  onSelect: () => alert('Build') },
      { id: 'run',         label: 'Run in Editor',     shortcut: '⌘P', keywords: ['play', 'preview'],     onSelect: () => alert('Run') },
      { id: 'profiler',    label: 'Open Profiler',     keywords: ['performance', 'fps', 'memory'],        onSelect: () => alert('Profiler') },
    ],
  },
]

export const CommandPaletteStory: Story = {
  name: 'CommandPalette',
  render: function CommandPaletteDemo() {
    const [open, setOpen] = useState(false)
    useEffect(() => {
      const handler = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setOpen(true) }
      }
      document.addEventListener('keydown', handler)
      return () => document.removeEventListener('keydown', handler)
    }, [])
    return (
      <div>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Open Command Palette <Badge style={{ marginLeft: '8px', fontFamily: 'var(--forge-font-mono)' }}>⌘K</Badge>
        </Button>
        <CommandPalette open={open} onOpenChange={setOpen} groups={COMMANDS} />
      </div>
    )
  },
}

// ---------------------------------------------------------------------------
// TreeView
// ---------------------------------------------------------------------------
const SCENE_TREE: TreeNode[] = [
  {
    id: 'root', label: '🌍 Scene Root',
    children: [
      {
        id: 'env', label: '🌄 Environment',
        children: [
          { id: 'sky', label: '☁ Sky Dome' },
          { id: 'sun', label: '☀ Directional Light' },
          { id: 'fog', label: '🌫 Fog Volume' },
        ],
      },
      {
        id: 'player', label: '🧑 Player',
        children: [
          { id: 'player-mesh', label: '△ Mesh' },
          { id: 'player-cam',  label: '🎥 Camera' },
          { id: 'player-col',  label: '◻ Collider' },
          {
            id: 'player-weapons', label: '⚔ Weapons',
            children: [
              { id: 'sword', label: '🗡 Sword' },
              { id: 'shield', label: '🛡 Shield' },
            ],
          },
        ],
      },
      {
        id: 'enemies', label: '👾 Enemies',
        children: [
          { id: 'goblin-1', label: '👾 Goblin_01' },
          { id: 'goblin-2', label: '👾 Goblin_02' },
          { id: 'boss',     label: '💀 Boss — disabled', disabled: true },
        ],
      },
    ],
  },
]

export const TreeViewStory: Story = {
  name: 'TreeView',
  render: function TreeViewDemo() {
    const [selected, setSelected] = useState<string>('player')
    const [expanded, setExpanded] = useState<string[]>(['root', 'player', 'env'])
    return (
      <div style={{ display: 'flex', gap: '16px' }}>
        <div style={{ width: '280px', border: '1px solid var(--forge-border)', borderRadius: 'var(--forge-radius-md)', padding: '8px', backgroundColor: 'var(--forge-surface)' }}>
          <Text size="xs" style={{ color: 'var(--forge-text-muted)', padding: '0 4px 8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Scene Hierarchy</Text>
          <TreeView
            nodes={SCENE_TREE}
            selected={selected}
            expanded={expanded}
            onSelect={setSelected}
            onExpand={(id, open) => setExpanded(prev => open ? [...prev, id] : prev.filter(e => e !== id))}
          />
        </div>
        <Text size="sm" style={{ color: 'var(--forge-text-muted)', paddingTop: '8px' }}>
          Selected: <strong style={{ color: 'var(--forge-accent)' }}>{selected}</strong>
        </Text>
      </div>
    )
  },
}

// ---------------------------------------------------------------------------
// Combobox
// ---------------------------------------------------------------------------
const SHADER_OPTIONS: ComboboxOption[] = [
  { value: 'pbr-standard',   label: 'PBR Standard' },
  { value: 'pbr-metallic',   label: 'PBR Metallic' },
  { value: 'unlit',          label: 'Unlit' },
  { value: 'toon',           label: 'Toon / Cel Shading' },
  { value: 'water',          label: 'Water Surface' },
  { value: 'particle',       label: 'Particle' },
  { value: 'sky',            label: 'Skybox' },
  { value: 'terrain',        label: 'Terrain Blend' },
  { value: 'emissive',       label: 'Emissive Glow' },
  { value: 'glass',          label: 'Glass / Transparent' },
]

export const ComboboxStory: Story = {
  name: 'Combobox',
  render: function ComboboxDemo() {
    const [shader, setShader] = useState('pbr-standard')
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '320px' }}>
        <div>
          <Text size="sm" style={{ color: 'var(--forge-text-muted)', marginBottom: '6px', display: 'block' }}>Shader type</Text>
          <Combobox
            options={SHADER_OPTIONS}
            value={shader}
            onChange={setShader}
            placeholder="Search shaders…"
          />
          <Text size="xs" style={{ color: 'var(--forge-text-muted)', marginTop: '4px' }}>
            Selected: {SHADER_OPTIONS.find(o => o.value === shader)?.label}
          </Text>
        </div>
        <div>
          <Text size="sm" style={{ color: 'var(--forge-text-muted)', marginBottom: '6px', display: 'block' }}>Loading state</Text>
          <Combobox options={[]} placeholder="Search assets…" loading empty="Loading…" />
        </div>
      </div>
    )
  },
}

// ---------------------------------------------------------------------------
// ColorPicker
// ---------------------------------------------------------------------------
export const ColorPickerStory: Story = {
  name: 'ColorPicker',
  render: function ColorPickerDemo() {
    const [color, setColor] = useState('#e94560')
    const [colorAlpha, setColorAlpha] = useState('#4ade8080')
    return (
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div>
          <Text size="sm" style={{ color: 'var(--forge-text-muted)', marginBottom: '8px', display: 'block' }}>Faction color (no alpha)</Text>
          <ColorPicker
            value={color}
            onChange={setColor}
            swatches={['#e94560', '#4ade80', '#818cf8', '#f9a8d4', '#fb923c', '#38bdf8', '#a78bfa', '#34d399']}
          />
          <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: 'var(--forge-radius-sm)', backgroundColor: color, border: '1px solid var(--forge-border)' }} />
            <Text size="xs" style={{ fontFamily: 'var(--forge-font-mono)' }}>{color}</Text>
          </div>
        </div>
        <div>
          <Text size="sm" style={{ color: 'var(--forge-text-muted)', marginBottom: '8px', display: 'block' }}>Fog color (with alpha)</Text>
          <ColorPicker value={colorAlpha} onChange={setColorAlpha} alpha />
        </div>
      </div>
    )
  },
}

// ---------------------------------------------------------------------------
// TagsInput
// ---------------------------------------------------------------------------
export const TagsInputStory: Story = {
  name: 'TagsInput',
  render: function TagsInputDemo() {
    const [tags, setTags] = useState(['outdoor', 'fantasy', 'medieval'])
    const [layers, setLayers] = useState(['Default', 'Player'])
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px' }}>
        <div>
          <Text size="sm" style={{ color: 'var(--forge-text-muted)', marginBottom: '6px', display: 'block' }}>Asset tags</Text>
          <TagsInput
            value={tags}
            onChange={setTags}
            suggestions={['outdoor', 'indoor', 'fantasy', 'sci-fi', 'medieval', 'modern', 'character', 'environment', 'prop', 'vfx']}
            placeholder="Add tag…"
          />
        </div>
        <div>
          <Text size="sm" style={{ color: 'var(--forge-text-muted)', marginBottom: '6px', display: 'block' }}>Layer mask (max 4)</Text>
          <TagsInput
            value={layers}
            onChange={setLayers}
            suggestions={['Default', 'Player', 'Enemy', 'UI', 'Environment', 'Projectile', 'Trigger']}
            max={4}
            placeholder="Add layer…"
          />
        </div>
      </div>
    )
  },
}

// ---------------------------------------------------------------------------
// PropertyGrid
// ---------------------------------------------------------------------------
const RIGIDBODY_OPTIONS: SelectOption[] = [
  { value: 'dynamic',   label: 'Dynamic' },
  { value: 'kinematic', label: 'Kinematic' },
  { value: 'static',    label: 'Static' },
]

const INSPECTOR_SECTIONS: PropertySection[] = [
  {
    label: 'Transform',
    defaultOpen: true,
    items: [
      { key: 'position', label: 'Position', type: 'vec3' },
      { key: 'rotation', label: 'Rotation', type: 'vec3' },
      { key: 'scale',    label: 'Scale',    type: 'vec3' },
    ],
  },
  {
    label: 'Mesh Renderer',
    defaultOpen: true,
    items: [
      { key: 'castShadows',    label: 'Cast Shadows',    type: 'boolean' },
      { key: 'receiveShadows', label: 'Receive Shadows', type: 'boolean' },
      { key: 'emissiveColor',  label: 'Emissive Color',  type: 'color' },
      { key: 'lod',            label: 'LOD Bias',        type: 'number', min: 0, max: 2, step: 0.1 },
    ],
  },
  {
    label: 'Rigidbody',
    defaultOpen: false,
    items: [
      { key: 'bodyType',       label: 'Body Type',  type: 'select', options: RIGIDBODY_OPTIONS },
      { key: 'mass',           label: 'Mass (kg)',  type: 'number', min: 0, max: 1000, step: 0.5 },
      { key: 'useGravity',     label: 'Use Gravity', type: 'boolean' },
      { key: 'drag',           label: 'Drag',        type: 'number', min: 0, max: 10, step: 0.1 },
    ],
  },
]

export const PropertyGridStory: Story = {
  name: 'PropertyGrid',
  render: function PropertyGridDemo() {
    const [values, setValues] = useState<Record<string, unknown>>({
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale:    [1, 1, 1],
      castShadows:    true,
      receiveShadows: true,
      emissiveColor:  '#000000',
      lod:            1.0,
      bodyType:       'dynamic',
      mass:           70,
      useGravity:     true,
      drag:           0.1,
    })
    return (
      <div style={{ width: '300px', border: '1px solid var(--forge-border)', borderRadius: 'var(--forge-radius-md)', overflow: 'hidden' }}>
        <div style={{ padding: '10px 12px', backgroundColor: 'var(--forge-surface)', borderBottom: '1px solid var(--forge-border)' }}>
          <Text size="sm" style={{ fontWeight: 500 }}>Player Entity</Text>
        </div>
        <PropertyGrid
          sections={INSPECTOR_SECTIONS}
          values={values}
          onChange={(key, value) => setValues(prev => ({ ...prev, [key]: value }))}
        />
      </div>
    )
  },
}

// ---------------------------------------------------------------------------
// EditableText
// ---------------------------------------------------------------------------
export const EditableTextStory: Story = {
  name: 'EditableText',
  render: function EditableTextDemo() {
    const [entityName, setEntityName] = useState('Player_01')
    const [layerName, setLayerName] = useState('Background')
    const [nodeLabel, setNodeLabel] = useState('Multiply')
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '320px' }}>
        <div>
          <Text size="xs" style={{ color: 'var(--forge-text-muted)', marginBottom: '6px', display: 'block' }}>Entity name — click to rename</Text>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', backgroundColor: 'var(--forge-surface)', borderRadius: 'var(--forge-radius-md)', border: '1px solid var(--forge-border)' }}>
            <span style={{ fontSize: '16px' }}>🧑</span>
            <EditableText value={entityName} onCommit={setEntityName} />
          </div>
        </div>
        <div>
          <Text size="xs" style={{ color: 'var(--forge-text-muted)', marginBottom: '6px', display: 'block' }}>Timeline track</Text>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[layerName, 'Midground', 'Foreground'].map((name, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', backgroundColor: 'var(--forge-surface)', borderRadius: 'var(--forge-radius-sm)', border: '1px solid var(--forge-border)' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: ['var(--forge-accent)', 'var(--forge-success)', 'var(--forge-warning)'][i] }} />
                {i === 0 ? <EditableText value={name} onCommit={setLayerName} /> : <span style={{ fontSize: '13px', color: 'var(--forge-text)' }}>{name}</span>}
              </div>
            ))}
          </div>
        </div>
        <div>
          <Text size="xs" style={{ color: 'var(--forge-text-muted)', marginBottom: '6px', display: 'block' }}>Shader node</Text>
          <div style={{ display: 'inline-flex', alignItems: 'center', padding: '6px 12px', backgroundColor: 'var(--forge-surface)', border: '1px solid var(--forge-accent)', borderRadius: 'var(--forge-radius-md)', gap: '8px' }}>
            <span style={{ color: 'var(--forge-accent)', fontSize: '12px' }}>⬡</span>
            <EditableText value={nodeLabel} onCommit={setNodeLabel} />
          </div>
        </div>
      </div>
    )
  },
}
