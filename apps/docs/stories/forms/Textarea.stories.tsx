import type { Meta, StoryObj } from '@storybook/react'
import { Textarea, FormField } from '@forgeui/components'

const meta: Meta<typeof Textarea> = {
  title: 'Forms/Textarea',
  component: Textarea,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  name: 'Textarea',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '320px' }}>
      <FormField label="Notes" htmlFor="ta-default">
        <Textarea id="ta-default" placeholder="Enter your notes…" rows={3} />
      </FormField>
      <FormField label="Error" htmlFor="ta-error" error="Required">
        <Textarea id="ta-error" error placeholder="Required" rows={3} />
      </FormField>
      <FormField label="Auto-grow" htmlFor="ta-auto">
        <Textarea id="ta-auto" autoGrow placeholder="Grows as you type…" />
      </FormField>
    </div>
  ),
}
