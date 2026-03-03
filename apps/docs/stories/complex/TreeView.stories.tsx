import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { TreeView, Text } from '@forgeui/components'
import type { TreeNode } from '@forgeui/components'

const SCENE_TREE: TreeNode[] = [
  {
    id: 'root',
    label: '🌍 Scene Root',
    children: [
      {
        id: 'env',
        label: '🌄 Environment',
        children: [
          { id: 'sky', label: '☁ Sky Dome' },
          { id: 'sun', label: '☀ Directional Light' },
          { id: 'fog', label: '🌫 Fog Volume' },
        ],
      },
      {
        id: 'player',
        label: '🧑 Player',
        children: [
          { id: 'player-mesh', label: '△ Mesh' },
          { id: 'player-cam', label: '🎥 Camera' },
          { id: 'player-col', label: '◻ Collider' },
          {
            id: 'player-weapons',
            label: '⚔ Weapons',
            children: [
              { id: 'sword', label: '🗡 Sword' },
              { id: 'shield', label: '🛡 Shield' },
            ],
          },
        ],
      },
      {
        id: 'enemies',
        label: '👾 Enemies',
        children: [
          { id: 'goblin-1', label: '👾 Goblin_01' },
          { id: 'goblin-2', label: '👾 Goblin_02' },
          { id: 'boss', label: '💀 Boss — disabled', disabled: true },
        ],
      },
    ],
  },
]

const meta: Meta = {
  title: 'Complex/TreeView',
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj

export const TreeViewStory: Story = {
  name: 'TreeView',
  render: function TreeViewDemo() {
    const [selected, setSelected] = useState<string>('player')
    const [expanded, setExpanded] = useState<string[]>(['root', 'player', 'env'])
    return (
      <div style={{ display: 'flex', gap: '16px' }}>
        <div
          style={{
            width: '280px',
            border: '1px solid var(--forge-border)',
            borderRadius: 'var(--forge-radius-md)',
            padding: '8px',
            backgroundColor: 'var(--forge-surface)',
          }}
        >
          <Text
            size="xs"
            style={{
              color: 'var(--forge-text-muted)',
              padding: '0 4px 8px',
              display: 'block',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Scene Hierarchy
          </Text>
          <TreeView
            nodes={SCENE_TREE}
            selected={selected}
            expanded={expanded}
            onSelect={setSelected}
            onExpand={(id, open) =>
              setExpanded((prev) => (open ? [...prev, id] : prev.filter((e) => e !== id)))
            }
          />
        </div>
        <Text size="sm" style={{ color: 'var(--forge-text-muted)', paddingTop: '8px' }}>
          Selected: <strong style={{ color: 'var(--forge-accent)' }}>{selected}</strong>
        </Text>
      </div>
    )
  },
}
