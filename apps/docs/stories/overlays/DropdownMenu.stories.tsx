import type { Meta, StoryObj } from '@storybook/react'
import { DropdownMenu, Button } from '@forgeui/components'
import type { MenuEntry } from '@forgeui/components'

const meta: Meta<typeof DropdownMenu> = {
  title: 'Overlays/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof DropdownMenu>

const FILE_MENU: MenuEntry[] = [
  { label: 'New Scene',   shortcut: '⌘N', onSelect: () => alert('New scene') },
  { label: 'Open…',       shortcut: '⌘O', onSelect: () => alert('Open') },
  { label: 'Save',        shortcut: '⌘S', onSelect: () => alert('Save') },
  { label: 'Save As…',    shortcut: '⌘⇧S', onSelect: () => alert('Save As') },
  { type: 'separator' },
  {
    type: 'sub',
    label: 'Export',
    items: [
      { label: 'Export as GLTF', onSelect: () => alert('GLTF') },
      { label: 'Export as FBX',  onSelect: () => alert('FBX') },
      { label: 'Export as OBJ',  onSelect: () => alert('OBJ') },
    ],
  },
  { type: 'separator' },
  { label: 'Delete Scene', variant: 'danger', onSelect: () => alert('Delete') },
]

export const Default: Story = {
  name: 'DropdownMenu',
  render: () => (
    <DropdownMenu
      trigger={<Button variant="secondary">File ▾</Button>}
      items={FILE_MENU}
    />
  ),
}
