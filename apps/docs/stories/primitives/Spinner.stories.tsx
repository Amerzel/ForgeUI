import type { Meta, StoryObj } from '@storybook/react'
import { Spinner } from '@forgeui/components'

const meta: Meta<typeof Spinner> = {
  title: 'Primitives/Spinner',
  component: Spinner,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Spinner>

export const Sizes: Story = {
  name: 'Spinner — sizes',
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Spinner size="sm" label="Loading small" />
      <Spinner size="md" label="Loading medium" />
      <Spinner size="lg" label="Loading large" />
    </div>
  ),
}
