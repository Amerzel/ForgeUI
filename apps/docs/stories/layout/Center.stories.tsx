import type { Meta, StoryObj } from '@storybook/react'
import { Stack, Center, Badge, Text } from '@forgeui/components'

const meta: Meta = {
  title: 'Layout/Center',
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj

export const CenterStory: Story = {
  name: 'Center — centering utility',
  render: () => (
    <Stack gap={6} p={6}>
      <div>
        <Text size="sm" color="muted">
          Center in fixed-height container
        </Text>
        <Center
          style={{
            height: 120,
            marginTop: 8,
            border: '1px dashed var(--forge-border)',
            borderRadius: 4,
          }}
        >
          <Badge color="accent">Centered</Badge>
        </Center>
      </div>
      <div>
        <Text size="sm" color="muted">
          inline=true
        </Text>
        <Center inline style={{ marginTop: 8 }}>
          <Text size="sm">Inline centered</Text>
        </Center>
      </div>
    </Stack>
  ),
}
