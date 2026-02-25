import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import {
  Dialog, Tooltip, TooltipProvider, DropdownMenu, ContextMenu, Popover,
  Button, IconButton, FormField, Input, Select,
} from '@forgeui/components'
import type { MenuEntry } from '@forgeui/components'

const meta: Meta = {
  title: 'Overlays/Gallery',
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'ForgeUI overlay components.' } },
  },
}
export default meta
type Story = StoryObj

// ---------------------------------------------------------------------------
// Dialog
// ---------------------------------------------------------------------------
export const Dialogs: Story = {
  name: 'Dialog',
  render: function DialogDemo() {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title="Project Settings"
          description="Configure global settings for this project."
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <FormField label="Project name" htmlFor="dlg-name">
              <Input id="dlg-name" defaultValue="My Game Project" />
            </FormField>
            <FormField label="Build target" htmlFor="dlg-target">
              <Select
                id="dlg-target"
                options={[
                  { value: 'windows', label: 'Windows' },
                  { value: 'linux', label: 'Linux' },
                  { value: 'macos', label: 'macOS' },
                  { value: 'web', label: 'WebGL' },
                ]}
              />
            </FormField>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '8px' }}>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => setOpen(false)}>Save</Button>
            </div>
          </div>
        </Dialog>
      </>
    )
  },
}

// ---------------------------------------------------------------------------
// Tooltip
// ---------------------------------------------------------------------------
export const Tooltips: Story = {
  name: 'Tooltip',
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', padding: '40px 20px' }}>
      <Tooltip content="Save document (⌘S)">
        <Button variant="ghost" size="sm" aria-label="Save">💾 Save</Button>
      </Tooltip>
      <Tooltip content="Top tooltip" side="top">
        <Button variant="secondary" size="sm">Top</Button>
      </Tooltip>
      <Tooltip content="Right tooltip" side="right">
        <Button variant="secondary" size="sm">Right</Button>
      </Tooltip>
      <Tooltip content="Bottom tooltip" side="bottom">
        <Button variant="secondary" size="sm">Bottom</Button>
      </Tooltip>
      <Tooltip content="Left tooltip" side="left">
        <Button variant="secondary" size="sm">Left</Button>
      </Tooltip>
      <Tooltip content="This won't show" disabled>
        <Button variant="secondary" size="sm">Disabled tooltip</Button>
      </Tooltip>
    </div>
  ),
}

// ---------------------------------------------------------------------------
// DropdownMenu
// ---------------------------------------------------------------------------
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

export const DropdownMenus: Story = {
  name: 'DropdownMenu',
  render: () => (
    <DropdownMenu
      trigger={<Button variant="secondary">File ▾</Button>}
      items={FILE_MENU}
    />
  ),
}

// ---------------------------------------------------------------------------
// ContextMenu
// ---------------------------------------------------------------------------
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

export const ContextMenus: Story = {
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

// ---------------------------------------------------------------------------
// Popover
// ---------------------------------------------------------------------------
export const Popovers: Story = {
  name: 'Popover',
  render: function PopoverDemo() {
    const [open, setOpen] = useState(false)
    return (
      <div style={{ padding: '20px' }}>
        <Popover
          trigger={<Button variant="secondary">Filters ▾</Button>}
          open={open}
          onOpenChange={setOpen}
          width="260px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <strong style={{ fontSize: '13px', color: 'var(--forge-text)' }}>Filter assets</strong>
            <FormField label="Type" htmlFor="pop-type">
              <Select
                id="pop-type"
                options={[
                  { value: 'mesh', label: 'Mesh' },
                  { value: 'texture', label: 'Texture' },
                  { value: 'material', label: 'Material' },
                  { value: 'audio', label: 'Audio' },
                ]}
                placeholder="All types"
              />
            </FormField>
            <FormField label="Name contains" htmlFor="pop-name">
              <Input id="pop-name" placeholder="Search…" size="sm" />
            </FormField>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>Reset</Button>
              <Button variant="primary" size="sm" onClick={() => setOpen(false)}>Apply</Button>
            </div>
          </div>
        </Popover>
      </div>
    )
  },
}
