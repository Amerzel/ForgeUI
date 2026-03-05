import type { Meta, StoryObj } from '@storybook/react'
import { TilingGrid, TilePreview, Text, Stack } from '@forgeui/components'

const meta: Meta = {
  title: 'Domain/TilingGrid',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Renders a tile repeated NxN to evaluate seamlessness. Supports single-tile repeat and per-cell heterogeneous grids via getCellSource callback.',
      },
    },
  },
}
export default meta
type Story = StoryObj

function createMockTile(size: number, color: string): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas
  ctx.fillStyle = color
  ctx.fillRect(0, 0, size, size)
  // Add subtle corner markers to show tile boundaries
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
  ctx.fillRect(0, 0, 4, 4)
  ctx.fillRect(size - 4, 0, 4, 4)
  ctx.fillRect(0, size - 4, 4, 4)
  ctx.fillRect(size - 4, size - 4, 4, 4)
  return canvas
}

export const Default: Story = {
  name: '3×3 Repeat',
  render: () => {
    const tile = createMockTile(32, '#4a9e4a')

    return (
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Text size="sm" style={{ fontWeight: 500 }}>
          Single tile repeated 3×3 — check for visible seams
        </Text>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'start' }}>
          <Stack gap="1">
            <Text size="xs" style={{ color: 'var(--forge-text-muted)' }}>
              Source tile
            </Text>
            <TilePreview source={tile} size={64} label="Grass" />
          </Stack>
          <Stack gap="1">
            <Text size="xs" style={{ color: 'var(--forge-text-muted)' }}>
              3×3 tiling
            </Text>
            <TilingGrid source={tile} size={256} />
          </Stack>
        </div>
      </div>
    )
  },
}

export const WithBoundaries: Story = {
  name: 'Boundary Lines',
  render: () => {
    const tile = createMockTile(64, '#5e81ac')

    return (
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Text size="sm" style={{ fontWeight: 500 }}>
          Dashed boundary lines help identify seam locations
        </Text>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Stack gap="1">
            <Text size="xs" style={{ color: 'var(--forge-text-muted)' }}>
              No boundaries
            </Text>
            <TilingGrid source={tile} size={256} />
          </Stack>
          <Stack gap="1">
            <Text size="xs" style={{ color: 'var(--forge-text-muted)' }}>
              With boundaries
            </Text>
            <TilingGrid source={tile} size={256} showBoundaries />
          </Stack>
        </div>
      </div>
    )
  },
}

export const GridSizes: Story = {
  name: 'Grid Sizes',
  render: () => {
    const tile = createMockTile(32, '#b48c56')

    return (
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Text size="sm" style={{ fontWeight: 500 }}>
          Different grid dimensions
        </Text>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'start' }}>
          {[
            { cols: 2, rows: 2 },
            { cols: 3, rows: 3 },
            { cols: 5, rows: 5 },
          ].map(({ cols, rows }) => (
            <Stack key={`${cols}x${rows}`} gap="1">
              <Text size="xs" style={{ color: 'var(--forge-text-muted)' }}>
                {cols}×{rows}
              </Text>
              <TilingGrid source={tile} size={200} cols={cols} rows={rows} showBoundaries />
            </Stack>
          ))}
        </div>
      </div>
    )
  },
}

export const HeterogeneousGrid: Story = {
  name: 'Heterogeneous Grid (getCellSource)',
  render: () => {
    const grass = createMockTile(32, '#4a9e4a')
    const sand = createMockTile(32, '#b48c56')

    return (
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Text size="sm" style={{ fontWeight: 500 }}>
          Per-cell tile sources — useful for transition tile testing
        </Text>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'start' }}>
          <Stack gap="1">
            <Text size="xs" style={{ color: 'var(--forge-text-muted)' }}>
              Source tiles
            </Text>
            <div style={{ display: 'flex', gap: '4px' }}>
              <TilePreview source={grass} size={48} label="Grass" />
              <TilePreview source={sand} size={48} label="Sand" />
            </div>
          </Stack>
          <Stack gap="1">
            <Text size="xs" style={{ color: 'var(--forge-text-muted)' }}>
              Center = sand, surround = grass
            </Text>
            <TilingGrid
              size={256}
              cols={3}
              rows={3}
              showBoundaries
              getCellSource={(col, row) => (col === 1 && row === 1 ? sand : grass)}
            />
          </Stack>
          <Stack gap="1">
            <Text size="xs" style={{ color: 'var(--forge-text-muted)' }}>
              Checkerboard pattern
            </Text>
            <TilingGrid
              size={256}
              cols={4}
              rows={4}
              showBoundaries
              getCellSource={(col, row) => ((col + row) % 2 === 0 ? grass : sand)}
            />
          </Stack>
        </div>
      </div>
    )
  },
}
