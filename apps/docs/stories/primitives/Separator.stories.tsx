import type { Meta, StoryObj } from '@storybook/react'
import { Separator, Text } from '@forgeui/components'

const meta: Meta<typeof Separator> = {
  title: 'Primitives/Separator',
  component: Separator,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Separator>

export const Default: Story = {
  name: 'Separator',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Text>Above separator</Text>
      <Separator />
      <Text>Below separator</Text>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', height: '40px' }}>
        <Text>Left</Text>
        <Separator orientation="vertical" />
        <Text>Right</Text>
      </div>
    </div>
  ),
}
