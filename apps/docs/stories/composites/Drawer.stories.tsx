import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Drawer, Button, Text, Badge } from '@forgeui/components'

const meta: Meta = {
  title: 'Composites/Drawer',
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj

export const Default: Story = {
  name: 'Drawer',
  render: function DrawerDemo() {
    const [open, setOpen] = useState(false)
    const [side, setSide] = useState<'left' | 'right' | 'top' | 'bottom'>('right')
    return (
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {(['right', 'left', 'bottom'] as const).map(s => (
          <Button key={s} variant="secondary" onClick={() => { setSide(s); setOpen(true) }}>
            Open {s}
          </Button>
        ))}
        <Drawer
          open={open}
          onOpenChange={setOpen}
          side={side}
          title="Entity Inspector"
          description="View and edit component properties for the selected entity."
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '0 24px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text size="sm" style={{ color: 'var(--forge-text-muted)' }}>Transform</Text>
              <Badge>Active</Badge>
            </div>
            {['Position', 'Rotation', 'Scale'].map(prop => (
              <div key={prop} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--forge-border-subtle)' }}>
                <Text size="sm">{prop}</Text>
                <Text size="sm" style={{ color: 'var(--forge-text-muted)', fontFamily: 'var(--forge-font-mono)' }}>
                  {prop === 'Scale' ? '1.0, 1.0, 1.0' : '0.0, 0.0, 0.0'}
                </Text>
              </div>
            ))}
            <Button variant="primary" onClick={() => setOpen(false)}>Close Inspector</Button>
          </div>
        </Drawer>
      </div>
    )
  },
}
