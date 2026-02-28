import type { Meta, StoryObj } from '@storybook/react'
import { useState, useEffect } from 'react'
import { CommandPalette, Button, Badge } from '@forgeui/components'
import type { CommandGroup } from '@forgeui/components'

const COMMANDS: CommandGroup[] = [
  {
    label: 'Scene',
    items: [
      { id: 'new-scene',   label: 'New Scene',         shortcut: '⌘N', keywords: ['create', 'blank'],      onSelect: () => alert('New scene') },
      { id: 'open-scene',  label: 'Open Scene…',       shortcut: '⌘O', keywords: ['load', 'file'],         onSelect: () => alert('Open') },
      { id: 'save-scene',  label: 'Save Scene',        shortcut: '⌘S', keywords: ['write'],                onSelect: () => alert('Save') },
    ],
  },
  {
    label: 'Assets',
    items: [
      { id: 'import-mesh', label: 'Import 3D Asset…',  keywords: ['mesh', 'glb', 'fbx', 'obj'],          onSelect: () => alert('Import') },
      { id: 'create-mat',  label: 'Create Material',   keywords: ['shader', 'pbr'],                       onSelect: () => alert('Material') },
      { id: 'bake-light',  label: 'Bake Lightmaps',    keywords: ['lighting', 'gi', 'global illumination'], onSelect: () => alert('Bake') },
    ],
  },
  {
    label: 'Build',
    items: [
      { id: 'build-all',   label: 'Build Project',     shortcut: '⌘B', keywords: ['compile', 'package'],  onSelect: () => alert('Build') },
      { id: 'run',         label: 'Run in Editor',     shortcut: '⌘P', keywords: ['play', 'preview'],     onSelect: () => alert('Run') },
      { id: 'profiler',    label: 'Open Profiler',     keywords: ['performance', 'fps', 'memory'],        onSelect: () => alert('Profiler') },
    ],
  },
]

const meta: Meta = {
  title: 'Complex/CommandPalette',
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj

export const CommandPaletteStory: Story = {
  name: 'CommandPalette',
  render: function CommandPaletteDemo() {
    const [open, setOpen] = useState(false)
    useEffect(() => {
      const handler = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setOpen(true) }
      }
      document.addEventListener('keydown', handler)
      return () => document.removeEventListener('keydown', handler)
    }, [])
    return (
      <div>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Open Command Palette <Badge style={{ marginLeft: '8px', fontFamily: 'var(--forge-font-mono)' }}>⌘K</Badge>
        </Button>
        <CommandPalette open={open} onOpenChange={setOpen} groups={COMMANDS} />
      </div>
    )
  },
}
