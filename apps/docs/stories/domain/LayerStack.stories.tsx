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
  { id: 'overlay', name: 'UI Overlay', visible: true, locked: false, opacity: 1 },
  { id: 'vfx', name: 'VFX Particles', visible: true, locked: false, opacity: 0.8 },
  { id: 'characters', name: 'Characters', visible: true, locked: false, opacity: 1 },
  { id: 'props', name: 'Props & Objects', visible: true, locked: true, opacity: 1 },
  { id: 'terrain', name: 'Terrain', visible: true, locked: true, opacity: 1 },
  { id: 'background', name: 'Background', visible: false, locked: true, opacity: 0.5 },
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
          onLayerChange={(id, changes) => {
            setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, ...changes } : l)))
          }}
          style={{
            border: '1px solid var(--forge-border)',
            borderRadius: 'var(--forge-radius-md)',
          }}
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
          onLayerChange={(id, changes) => {
            setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, ...changes } : l)))
          }}
          compact
          style={{
            border: '1px solid var(--forge-border)',
            borderRadius: 'var(--forge-radius-md)',
          }}
        />
      </div>
    )
  },
}
