import type { Meta, StoryObj } from '@storybook/react'
import { TilePreview, Text, Stack } from '@forgeui/components'
import { useState } from 'react'

const meta: Meta = {
  title: 'Domain/TilePreview',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Canvas-based tile renderer with nearest-neighbor scaling. Supports ImageData, HTMLCanvasElement, ImageBitmap, URL, or null sources. Designed for pixel art tile workflows.',
      },
    },
  },
}
export default meta
type Story = StoryObj

/**
 * Creates a mock tile as an OffscreenCanvas with a flat color and optional pattern.
 */
function createMockTile(
  size: number,
  color: string,
  options?: { pattern?: 'solid' | 'checker' | 'gradient'; label?: string },
): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas

  const pattern = options?.pattern ?? 'solid'

  if (pattern === 'checker') {
    const cellSize = size / 4
    for (let y = 0; y < size; y += cellSize) {
      for (let x = 0; x < size; x += cellSize) {
        const isLight = ((x / cellSize + y / cellSize) | 0) % 2 === 0
        ctx.fillStyle = isLight ? color : '#1a1a2e'
        ctx.fillRect(x, y, cellSize, cellSize)
      }
    }
  } else if (pattern === 'gradient') {
    const grad = ctx.createLinearGradient(0, 0, size, size)
    grad.addColorStop(0, color)
    grad.addColorStop(1, '#1a1a2e')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, size, size)
  } else {
    ctx.fillStyle = color
    ctx.fillRect(0, 0, size, size)
  }

  return canvas
}

export const Sizes: Story = {
  name: 'Display Sizes',
  render: () => {
    const tile32 = createMockTile(32, '#4a9e4a')
    const tile64 = createMockTile(64, '#4a9e4a')

    return (
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Text size="sm" style={{ fontWeight: 500 }}>
          Same 32px tile at different display sizes
        </Text>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'end' }}>
          <Stack gap="1">
            <Text size="xs" style={{ color: 'var(--forge-text-muted)' }}>
              32px
            </Text>
            <TilePreview source={tile32} size={32} />
          </Stack>
          <Stack gap="1">
            <Text size="xs" style={{ color: 'var(--forge-text-muted)' }}>
              64px
            </Text>
            <TilePreview source={tile32} size={64} />
          </Stack>
          <Stack gap="1">
            <Text size="xs" style={{ color: 'var(--forge-text-muted)' }}>
              128px
            </Text>
            <TilePreview source={tile64} size={128} />
          </Stack>
          <Stack gap="1">
            <Text size="xs" style={{ color: 'var(--forge-text-muted)' }}>
              256px
            </Text>
            <TilePreview source={tile64} size={256} />
          </Stack>
        </div>
      </div>
    )
  },
}

export const BorderVariants: Story = {
  name: 'Border Variants',
  render: () => {
    const tile = createMockTile(32, '#5e81ac')

    return (
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Text size="sm" style={{ fontWeight: 500 }}>
          Border states for selection and validation feedback
        </Text>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'end' }}>
          {(['none', 'default', 'selected', 'error'] as const).map((b) => (
            <Stack key={b} gap="1">
              <Text size="xs" style={{ color: 'var(--forge-text-muted)' }}>
                {b}
              </Text>
              <TilePreview source={tile} size={80} border={b} />
            </Stack>
          ))}
        </div>
      </div>
    )
  },
}

export const WithLabels: Story = {
  name: 'Label Overlay',
  render: () => {
    const colors = ['#4a9e4a', '#b48c56', '#5e81ac', '#a3555a', '#7e6bab']

    return (
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Text size="sm" style={{ fontWeight: 500 }}>
          Labels for tile case identification
        </Text>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['MS-0', 'MS-1', 'MS-3', 'MS-7', 'MS-14'].map((label, i) => (
            <TilePreview
              key={label}
              source={createMockTile(32, colors[i] ?? '#666')}
              size={64}
              label={label}
            />
          ))}
        </div>
      </div>
    )
  },
}

export const Backgrounds: Story = {
  name: 'Background Modes',
  render: () => {
    // Create a tile with transparency
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#4a9e4a'
      ctx.beginPath()
      ctx.arc(16, 16, 12, 0, Math.PI * 2)
      ctx.fill()
    }

    return (
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Text size="sm" style={{ fontWeight: 500 }}>
          Background modes for transparent tiles
        </Text>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'end' }}>
          {(['checkerboard', 'black', 'white', 'none'] as const).map((bg) => (
            <Stack key={bg} gap="1">
              <Text size="xs" style={{ color: 'var(--forge-text-muted)' }}>
                {bg}
              </Text>
              <TilePreview source={canvas} size={96} background={bg} />
            </Stack>
          ))}
        </div>
      </div>
    )
  },
}

export const PixelGrid: Story = {
  name: 'Pixel Grid Overlay',
  render: () => {
    const tile = createMockTile(8, '#4a9e4a', { pattern: 'checker' })

    return (
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Text size="sm" style={{ fontWeight: 500 }}>
          Pixel grid overlay at high zoom (8px tile displayed at 256px = 32x zoom)
        </Text>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Stack gap="1">
            <Text size="xs" style={{ color: 'var(--forge-text-muted)' }}>
              Without grid
            </Text>
            <TilePreview source={tile} size={256} showGrid={false} />
          </Stack>
          <Stack gap="1">
            <Text size="xs" style={{ color: 'var(--forge-text-muted)' }}>
              With grid
            </Text>
            <TilePreview source={tile} size={256} showGrid />
          </Stack>
        </div>
      </div>
    )
  },
}

export const NullSource: Story = {
  name: 'Empty / Null Source',
  render: () => (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Text size="sm" style={{ fontWeight: 500 }}>
        Placeholder when no tile data is available
      </Text>
      <div style={{ display: 'flex', gap: '16px' }}>
        <TilePreview source={null} size={64} />
        <TilePreview source={null} size={96} label="Missing" />
        <TilePreview source={null} size={96} border="error" label="Failed" />
      </div>
    </div>
  ),
}

export const Interactive: Story = {
  name: 'Click & Hover',
  render: function TileSelectionDemo() {
    const [selected, setSelected] = useState<string | null>(null)
    const colors = ['#4a9e4a', '#b48c56', '#5e81ac', '#a3555a']
    const labels = ['Grass', 'Sand', 'Water', 'Stone']

    return (
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Text size="sm" style={{ fontWeight: 500 }}>
          Click to select a tile (selected: {selected ?? 'none'})
        </Text>
        <div style={{ display: 'flex', gap: '8px' }}>
          {labels.map((label, i) => (
            <TilePreview
              key={label}
              source={createMockTile(32, colors[i] ?? '#666')}
              size={80}
              label={label}
              border={selected === label ? 'selected' : 'default'}
              onClick={() => setSelected(selected === label ? null : label)}
            />
          ))}
        </div>
      </div>
    )
  },
}
