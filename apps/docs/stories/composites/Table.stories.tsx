import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Table, Badge, Text } from '@forgeui/components'

const meta: Meta = {
  title: 'Composites/Table',
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj

const ASSETS = [
  { name: 'player_mesh.glb',       type: 'Mesh',     size: '1.2 MB',  modified: 'Today' },
  { name: 'diffuse_albedo.png',    type: 'Texture',  size: '4.8 MB',  modified: 'Yesterday' },
  { name: 'explosion_vfx.prefab',  type: 'Prefab',   size: '128 KB',  modified: '3 days ago' },
  { name: 'footstep_grass.ogg',    type: 'Audio',    size: '92 KB',   modified: 'Last week' },
  { name: 'water_surface.mat',     type: 'Material', size: '8 KB',    modified: 'Last week' },
]

export const Default: Story = {
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
