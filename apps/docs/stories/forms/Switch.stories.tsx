import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Switch } from '@forgeui/components'

const meta: Meta<typeof Switch> = {
  title: 'Forms/Switch',
  component: Switch,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Switch>

export const Default: Story = {
  name: 'Switch',
  render: function SwitchDemo() {
    const [on, setOn] = useState(false)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Switch label="Dark mode" checked={on} onCheckedChange={setOn} />
        <Switch label="Enabled (on)" checked size="md" onCheckedChange={() => {}} />
        <Switch label="Small" checked={on} onCheckedChange={setOn} size="sm" />
        <Switch label="Disabled" disabled />
      </div>
    )
  },
}
