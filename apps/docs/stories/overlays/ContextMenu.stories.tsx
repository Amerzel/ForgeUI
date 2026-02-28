import type { Meta, StoryObj } from '@storybook/react'
import { ContextMenu } from '@forgeui/components'
import type { MenuEntry } from '@forgeui/components'

const meta: Meta<typeof ContextMenu> = {
  title: 'Overlays/ContextMenu',
  component: ContextMenu,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof ContextMenu>

const NODE_CONTEXT: MenuEntry[] = [
  { label: 'Rename',      shortcut: 'F2',  onSelect: () => alert('Rename') },
  { label: 'Duplicate',   shortcut: '⌘D',  onSelect: () => alert('Duplicate') },
  { label: 'Group nodes', shortcut: '⌘G',  onSelect: () => alert('Group') },
  { type: 'separator' },
  { label: 'Cut',   shortcut: '⌘X', onSelect: () => alert('Cut') },
  { label: 'Copy',  shortcut: '⌘C', onSelect: () => alert('Copy') },
  { label: 'Paste', shortcut: '⌘V', onSelect: () => alert('Paste') },
  { type: 'separator' },
  { label: 'Delete node', variant: 'danger', onSelect: () => alert('Delete') },
]

export const Default: Story = {
  name: 'ContextMenu',
  render: () => (
    <ContextMenu items={NODE_CONTEXT}>
      <div
        style={{
          width: '320px',
          height: '180px',
          backgroundColor: 'var(--forge-surface)',
          border: '2px dashed var(--forge-border)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--forge-text-muted)',
          fontSize: '13px',
          userSelect: 'none',
        }}
        role="region"
        aria-label="Node graph canvas — right-click for context menu"
      >
        Right-click anywhere in this area
      </div>
    </ContextMenu>
  ),
}
