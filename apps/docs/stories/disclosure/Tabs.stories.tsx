import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Tabs } from '@forgeui/components'

const meta: Meta<typeof Tabs> = {
  title: 'Disclosure/Tabs',
  component: Tabs,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Tabs>

const TAB_ITEMS = [
  {
    value: 'inspector',
    label: 'Inspector',
    content: (
      <div style={{ color: 'var(--forge-text-muted)', fontSize: '13px', lineHeight: 1.6 }}>
        <strong style={{ color: 'var(--forge-text)' }}>Transform</strong>
        <div>Position: 0, 0, 0</div>
        <div>Rotation: 0°, 0°, 0°</div>
        <div>Scale: 1, 1, 1</div>
      </div>
    ),
  },
  {
    value: 'materials',
    label: 'Materials',
    content: (
      <div style={{ color: 'var(--forge-text-muted)', fontSize: '13px' }}>
        Albedo, Normal, Roughness, Metallic maps displayed here.
      </div>
    ),
  },
  {
    value: 'physics',
    label: 'Physics',
    content: (
      <div style={{ color: 'var(--forge-text-muted)', fontSize: '13px' }}>
        Rigidbody, Collider, Joints configuration.
      </div>
    ),
  },
  {
    value: 'locked',
    label: 'Locked',
    content: <div>Locked content</div>,
    disabled: true,
  },
]

export const Line: Story = {
  name: 'Tabs — line variant',
  render: function TabsLineDemo() {
    const [value, setValue] = useState('inspector')
    return (
      <div style={{ maxWidth: '480px' }}>
        <Tabs items={TAB_ITEMS} value={value} onValueChange={setValue} variant="line" />
      </div>
    )
  },
}

export const Solid: Story = {
  name: 'Tabs — solid variant',
  render: function TabsSolidDemo() {
    const [value, setValue] = useState('inspector')
    return (
      <div style={{ maxWidth: '480px' }}>
        <Tabs items={TAB_ITEMS} value={value} onValueChange={setValue} variant="solid" />
      </div>
    )
  },
}

export const Vertical: Story = {
  name: 'Tabs — vertical',
  render: function TabsVerticalDemo() {
    const [value, setValue] = useState('inspector')
    return (
      <div style={{ maxWidth: '540px' }}>
        <Tabs items={TAB_ITEMS.slice(0, 3)} value={value} onValueChange={setValue} orientation="vertical" />
      </div>
    )
  },
}
