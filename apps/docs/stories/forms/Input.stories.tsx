import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Input, FormField } from '@forgeui/components'

const meta: Meta<typeof Input> = {
  title: 'Forms/Input',
  component: Input,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Input>

function InputClearable() {
  const [value, setValue] = useState('Some value')
  return (
    <Input
      id="inp-clear"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      clearable
      onClear={() => setValue('')}
    />
  )
}

export const States: Story = {
  name: 'Input — states',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '320px' }}>
      <FormField label="Default" htmlFor="inp-default">
        <Input id="inp-default" placeholder="Type here…" />
      </FormField>
      <FormField label="With hint" htmlFor="inp-hint" hint="Enter your username">
        <Input id="inp-hint" placeholder="username" />
      </FormField>
      <FormField label="Error state" htmlFor="inp-error" error="This field is required">
        <Input id="inp-error" error placeholder="Required field" />
      </FormField>
      <FormField label="Disabled" htmlFor="inp-disabled">
        <Input id="inp-disabled" disabled value="Read only value" onChange={() => {}} />
      </FormField>
      <FormField label="Clearable" htmlFor="inp-clear">
        <InputClearable />
      </FormField>
    </div>
  ),
}

export const Sizes: Story = {
  name: 'Input — sizes',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '320px' }}>
      <Input aria-label="Small input" size="sm" placeholder="Small" />
      <Input aria-label="Medium input" size="md" placeholder="Medium" />
      <Input aria-label="Large input" size="lg" placeholder="Large" />
    </div>
  ),
}
