import type { Meta, StoryObj } from '@storybook/react'
import { Menubar } from '@forgeui/components'
import type { MenubarMenu } from '@forgeui/components'

const meta: Meta = {
  title: 'Composites/Menubar',
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj

const APP_MENUS: MenubarMenu[] = [
  {
    label: 'File',
    items: [
      { label: 'New Scene',   shortcut: '⌘N',  onSelect: () => alert('New') },
      { label: 'Open…',       shortcut: '⌘O',  onSelect: () => alert('Open') },
      { label: 'Save',        shortcut: '⌘S',  onSelect: () => alert('Save') },
      { label: 'Save As…',    shortcut: '⌘⇧S', onSelect: () => alert('Save As') },
      { type: 'separator' },
      {
        type: 'sub',
        label: 'Export',
        items: [
          { label: 'As GLTF',   onSelect: () => alert('GLTF') },
          { label: 'As FBX',    onSelect: () => alert('FBX') },
          { label: 'As OBJ',    onSelect: () => alert('OBJ') },
        ],
      },
      { type: 'separator' },
      { label: 'Quit', variant: 'danger', onSelect: () => alert('Quit') },
    ],
  },
  {
    label: 'Edit',
    items: [
      { label: 'Undo',       shortcut: '⌘Z',  onSelect: () => alert('Undo') },
      { label: 'Redo',       shortcut: '⌘⇧Z', onSelect: () => alert('Redo') },
      { type: 'separator' },
      { label: 'Cut',        shortcut: '⌘X',  onSelect: () => alert('Cut') },
      { label: 'Copy',       shortcut: '⌘C',  onSelect: () => alert('Copy') },
      { label: 'Paste',      shortcut: '⌘V',  onSelect: () => alert('Paste') },
      { type: 'separator' },
      { label: 'Select All', shortcut: '⌘A',  onSelect: () => alert('Select All') },
    ],
  },
  {
    label: 'View',
    items: [
      { label: 'Toggle Sidebar',  shortcut: '⌘B',  onSelect: () => alert('Sidebar') },
      { label: 'Toggle Inspector', shortcut: '⌘I', onSelect: () => alert('Inspector') },
      { type: 'separator' },
      { label: 'Zoom In',  shortcut: '⌘+',  onSelect: () => alert('Zoom In') },
      { label: 'Zoom Out', shortcut: '⌘-',  onSelect: () => alert('Zoom Out') },
      { label: 'Fit All',  shortcut: '⌘0',  onSelect: () => alert('Fit') },
    ],
  },
]

export const Default: Story = {
  name: 'Menubar',
  render: () => (
    <div style={{ padding: '8px', backgroundColor: 'var(--forge-surface)', borderRadius: 'var(--forge-radius-md)', border: '1px solid var(--forge-border)' }}>
      <Menubar menus={APP_MENUS} />
    </div>
  ),
}
