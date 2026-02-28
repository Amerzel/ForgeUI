import type { Meta, StoryObj } from '@storybook/react'
import { AppShell, Menubar, Text } from '@forgeui/components'
import type { MenubarMenu } from '@forgeui/components'

const meta: Meta = {
  title: 'Composites/AppShell',
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
  name: 'AppShell',
  parameters: {
    layout: 'fullscreen',
    docs: { description: { story: 'Full-viewport CSS grid layout. Scroll down to see the panel layout.' } },
  },
  render: () => (
    <div style={{ height: '600px', minWidth: '1280px', overflow: 'hidden' }}>
      <AppShell
        nav={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '16px', width: '100%' }}>
            <span style={{ color: 'var(--forge-accent)', fontWeight: 700, fontSize: '14px' }}>⚒ ForgeUI</span>
            <span style={{ color: 'var(--forge-border)', margin: '0 4px' }}>|</span>
            <Menubar menus={APP_MENUS} />
          </div>
        }
        sidebar={
          <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Text size="xs" style={{ color: 'var(--forge-text-muted)', padding: '0 8px 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Scene</Text>
            {['Root', '  Camera', '  Player', '    Mesh', '    Collider', '  Lights'].map(item => (
              <div key={item} style={{ padding: '4px 8px', borderRadius: 'var(--forge-radius-sm)', fontSize: 'var(--forge-font-size-sm)', color: item === '  Player' ? 'var(--forge-accent)' : 'var(--forge-text-muted)', backgroundColor: item === '  Player' ? 'var(--forge-surface-hover)' : 'transparent', cursor: 'default' }}>
                {item}
              </div>
            ))}
          </div>
        }
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--forge-text-muted)', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '48px', opacity: 0.2 }}>⚒</div>
          <Text size="sm">Main viewport — resize window to test</Text>
        </div>
      </AppShell>
    </div>
  ),
}
