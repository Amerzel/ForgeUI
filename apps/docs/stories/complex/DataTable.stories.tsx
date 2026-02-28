import type { Meta, StoryObj } from '@storybook/react'
import { useMemo } from 'react'
import { DataTable, Badge } from '@forgeui/components'
import type { ColumnDef } from '@forgeui/components'

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

const meta: Meta = {
  title: 'Complex/DataTable',
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj

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
