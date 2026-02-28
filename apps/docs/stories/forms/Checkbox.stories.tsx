import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Checkbox } from '@forgeui/components'

const meta: Meta<typeof Checkbox> = {
  title: 'Forms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
  name: 'Checkbox',
  render: function CheckboxDemo() {
    const [a, setA] = useState(false)
    const [b, setB] = useState(true)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Checkbox label="Unchecked" checked={a} onCheckedChange={(v) => setA(v === true)} />
        <Checkbox label="Checked" checked={b} onCheckedChange={(v) => setB(v === true)} />
        <Checkbox label="Indeterminate" indeterminate />
        <Checkbox label="Disabled unchecked" disabled />
        <Checkbox label="Disabled checked" checked disabled />
      </div>
    )
  },
}
