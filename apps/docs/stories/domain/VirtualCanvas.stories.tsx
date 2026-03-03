import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { VirtualCanvas, Button, Text, Badge } from '@forgeui/components'
import type { CanvasItem, CanvasViewport } from '@forgeui/components'

const meta: Meta = {
  title: 'Domain/VirtualCanvas',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Infinite pannable/zoomable canvas for level editors, world maps, and spatial layouts.',
      },
    },
    layout: 'fullscreen',
  },
}
export default meta
type Story = StoryObj

const MAP_ITEMS: CanvasItem[] = [
  {
    id: 'spawn',
    x: 100,
    y: 100,
    width: 120,
    height: 80,
    children: (
      <div style={{ padding: '8px', fontSize: '11px', color: 'var(--forge-text)' }}>
        🚩 Spawn Zone
      </div>
    ),
  },
  {
    id: 'boss',
    x: 600,
    y: 80,
    width: 160,
    height: 120,
    children: (
      <div style={{ padding: '8px', fontSize: '11px', color: 'var(--forge-danger)' }}>
        💀 Boss Arena
      </div>
    ),
  },
  {
    id: 'village',
    x: 200,
    y: 280,
    width: 200,
    height: 140,
    children: (
      <div style={{ padding: '8px', fontSize: '11px', color: 'var(--forge-success)' }}>
        🏘 Village
      </div>
    ),
  },
  {
    id: 'dungeon',
    x: 500,
    y: 260,
    width: 140,
    height: 100,
    children: (
      <div style={{ padding: '8px', fontSize: '11px', color: 'var(--forge-warning)' }}>
        ⚔ Dungeon Entrance
      </div>
    ),
  },
  {
    id: 'forest',
    x: -80,
    y: 200,
    width: 180,
    height: 160,
    children: (
      <div style={{ padding: '8px', fontSize: '11px', color: 'var(--forge-accent)' }}>
        🌲 Dark Forest
      </div>
    ),
  },
  {
    id: 'castle',
    x: 360,
    y: 420,
    width: 180,
    height: 130,
    children: (
      <div style={{ padding: '8px', fontSize: '11px', color: 'var(--forge-text)' }}>🏰 Castle</div>
    ),
  },
]

export const LevelEditor: Story = {
  name: 'Level Editor',
  render: function VirtualCanvasDemo() {
    const [viewport, setViewport] = useState<CanvasViewport>({ x: 120, y: 80, zoom: 0.9 })
    const [items, setItems] = useState(MAP_ITEMS)

    const handleItemChange = (updated: CanvasItem) => {
      setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
    }

    return (
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Text size="sm" style={{ fontWeight: 500 }}>
            Level Editor — world_01.level
          </Text>
          <Badge>{items.length} zones</Badge>
          <Text size="xs" style={{ color: 'var(--forge-text-muted)', marginLeft: 'auto' }}>
            Pan: middle-click or alt+drag · Zoom: scroll
          </Text>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewport({ x: 120, y: 80, zoom: 0.9 })}
          >
            Reset view
          </Button>
        </div>
        <VirtualCanvas
          items={items}
          viewport={viewport}
          onViewportChange={setViewport}
          onItemChange={handleItemChange}
          grid
          gridSize={40}
          style={{
            height: '460px',
            border: '1px solid var(--forge-border)',
            borderRadius: 'var(--forge-radius-md)',
          }}
        />
        <Text size="xs" style={{ color: 'var(--forge-text-muted)' }}>
          Zoom: {Math.round(viewport.zoom * 100)}% · Offset: ({Math.round(viewport.x)},{' '}
          {Math.round(viewport.y)}) · Click zones to select · Drag zones to reposition
        </Text>
      </div>
    )
  },
}
