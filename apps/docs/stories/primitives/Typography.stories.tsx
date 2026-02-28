import type { Meta, StoryObj } from '@storybook/react'
import { Text, Heading, Separator } from '@forgeui/components'

const meta: Meta = {
  title: 'Primitives/Typography',
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj

export const TextAndHeading: Story = {
  name: 'Text & Heading',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Heading level={1} size="3xl">Heading 1 — 3xl</Heading>
      <Heading level={2} size="2xl">Heading 2 — 2xl</Heading>
      <Heading level={3} size="xl">Heading 3 — xl</Heading>
      <Separator />
      <Text size="lg">Large body text</Text>
      <Text size="base">Base body text — default</Text>
      <Text size="sm" color="muted">Small muted text</Text>
      <Text size="xs" color="muted">Extra small muted text</Text>
    </div>
  ),
}
