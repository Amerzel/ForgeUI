import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { RadioGroup } from '@forgeui/components'

const meta: Meta<typeof RadioGroup> = {
  title: 'Forms/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof RadioGroup>

const RADIO_OPTIONS = [
  { value: 'low',    label: 'Low priority' },
  { value: 'medium', label: 'Medium priority' },
  { value: 'high',   label: 'High priority' },
  { value: 'urgent', label: 'Urgent (disabled)', disabled: true },
]

export const Default: Story = {
  name: 'RadioGroup',
  render: function RadioDemo() {
    const [value, setValue] = useState('medium')
    return (
      <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
        <legend style={{ color: 'var(--forge-text-muted)', fontSize: '13px', marginBottom: '8px' }}>Priority</legend>
        <RadioGroup options={RADIO_OPTIONS} value={value} onValueChange={setValue} />
      </fieldset>
    )
  },
}
