import type { Meta, StoryObj } from '@storybook/react'
import { Select, FormField } from '@forgeui/components'

const meta: Meta<typeof Select> = {
  title: 'Forms/Select',
  component: Select,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Select>

const SELECT_OPTIONS = [
  { value: 'js', label: 'JavaScript' },
  { value: 'ts', label: 'TypeScript' },
  { value: 'rust', label: 'Rust' },
  { value: 'go', label: 'Go', disabled: true },
]

export const Default: Story = {
  name: 'Select',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '280px' }}>
      <FormField label="Language" htmlFor="sel-default">
        <Select id="sel-default" options={SELECT_OPTIONS} placeholder="Select language…" />
      </FormField>
      <FormField label="Error state" htmlFor="sel-error" error="Selection required">
        <Select id="sel-error" options={SELECT_OPTIONS} error />
      </FormField>
      <FormField label="Disabled" htmlFor="sel-disabled">
        <Select id="sel-disabled" options={SELECT_OPTIONS} disabled />
      </FormField>
    </div>
  ),
}
