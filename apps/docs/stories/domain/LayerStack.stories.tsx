import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { LayerStack, Text } from '@forgeui/components'
import type { Layer } from '@forgeui/components'

const meta: Meta = {
  title: 'Domain/LayerStack',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Layer list with visibility/lock/opacity toggles, drag-to-reorder, thumbnails, and compact mode.',
      },
    },
  },
}
export default meta
type Story = StoryObj

const INITIAL_LAYERS: Layer[] = [
  { id: 'overlay', label: 'UI Overlay', visible: true, locked: false, opacity: 100 },
  { id: 'vfx', label: 'VFX Particles', visible: true, locked: false, opacity: 80 },
  { id: 'characters', label: 'Characters', visible: true, locked: false, opacity: 100 },
  { id: 'props', label: 'Props & Objects', visible: true, locked: true, opacity: 100 },
  { id: 'terrain', label: 'Terrain', visible: true, locked: true, opacity: 100 },
  { id: 'background', label: 'Background', visible: false, locked: true, opacity: 50 },
]

export const Default: Story = {
  name: 'Layer Stack',
  render: function LayerStackDemo() {
    const [layers, setLayers] = useState<Layer[]>(INITIAL_LAYERS)
    const [selected, setSelected] = useState<string>('characters')

    return (
      <div
        style={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          maxWidth: '320px',
        }}
      >
        <Text size="sm" style={{ fontWeight: 500 }}>
          Scene Layers
        </Text>
        <LayerStack
          layers={layers}
          selectedId={selected}
          onSelect={setSelected}
          onReorder={setLayers}
        />
        <Text size="xs" style={{ color: 'var(--forge-text-muted)' }}>
          Drag to reorder · Toggle visibility 👁 and lock 🔒 · Adjust opacity
        </Text>
      </div>
    )
  },
}

export const Compact: Story = {
  name: 'Compact Mode',
  render: function LayerStackCompact() {
    const [layers, setLayers] = useState<Layer[]>(INITIAL_LAYERS)
    const [selected, setSelected] = useState<string>('characters')

    return (
      <div
        style={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          maxWidth: '280px',
        }}
      >
        <Text size="sm" style={{ fontWeight: 500 }}>
          Compact Layers
        </Text>
        <LayerStack
          layers={layers}
          selectedId={selected}
          onSelect={setSelected}
          onReorder={setLayers}
          compact
        />
      </div>
    )
  },
}
