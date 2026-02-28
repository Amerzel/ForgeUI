import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Toolbar, Text } from '@forgeui/components'

const meta: Meta = {
  title: 'Composites/Toolbar',
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj

export const Default: Story = {
  name: 'Toolbar',
  render: function ToolbarDemo() {
    const [activeTool, setActiveTool] = useState('select')
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Toolbar aria-label="Editor toolbar">
          <Toolbar.Button onClick={() => alert('New')}>New</Toolbar.Button>
          <Toolbar.Button onClick={() => alert('Open')}>Open</Toolbar.Button>
          <Toolbar.Button onClick={() => alert('Save')}>Save</Toolbar.Button>
          <Toolbar.Separator />
          <Toolbar.Button onClick={() => alert('Undo')}>↩ Undo</Toolbar.Button>
          <Toolbar.Button onClick={() => alert('Redo')}>↪ Redo</Toolbar.Button>
          <Toolbar.Separator />
          <Toolbar.ToggleGroup type="single" value={activeTool} onValueChange={v => { if (v) setActiveTool(v) }}>
            <Toolbar.ToggleItem value="select" aria-label="Select">✦ Select</Toolbar.ToggleItem>
            <Toolbar.ToggleItem value="move" aria-label="Move">✥ Move</Toolbar.ToggleItem>
            <Toolbar.ToggleItem value="rotate" aria-label="Rotate">↻ Rotate</Toolbar.ToggleItem>
            <Toolbar.ToggleItem value="scale" aria-label="Scale">⤡ Scale</Toolbar.ToggleItem>
          </Toolbar.ToggleGroup>
        </Toolbar>
        <Text size="sm" style={{ color: 'var(--forge-text-muted)' }}>Active tool: {activeTool}</Text>
      </div>
    )
  },
}
