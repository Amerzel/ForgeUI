import type { Meta, StoryObj } from '@storybook/react'
import { Box, Stack, Flex, Text } from '@forgeui/components'

function Block({ label, color = 'surface-raised' }: { label?: string; color?: string }) {
  return (
    <Box
      bg={color}
      p={3}
      radius="md"
      style={{
        border: '1px solid var(--forge-border)',
        color: 'var(--forge-text-muted)',
        fontSize: 'var(--forge-font-size-xs)',
        textAlign: 'center',
        whiteSpace: 'nowrap',
      }}
    >
      {label ?? 'block'}
    </Box>
  )
}

const meta: Meta = {
  title: 'Layout/Stack',
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj

export const StackStory: Story = {
  name: 'Stack — vertical layout',
  render: () => (
    <Flex gap={8} p={6} wrap="wrap" align="flex-start">
      <Stack gap={2} style={{ width: 180 }}>
        <Text size="sm" color="muted">
          gap=2 (8px)
        </Text>
        <Block label="Item 1" />
        <Block label="Item 2" />
        <Block label="Item 3" />
      </Stack>

      <Stack gap={4} style={{ width: 180 }}>
        <Text size="sm" color="muted">
          gap=4 (16px)
        </Text>
        <Block label="Item 1" />
        <Block label="Item 2" />
        <Block label="Item 3" />
      </Stack>

      <Stack gap={2} reverse style={{ width: 180 }}>
        <Text size="sm" color="muted">
          reverse=true
        </Text>
        <Block label="1 (bottom)" />
        <Block label="2" />
        <Block label="3 (top)" />
      </Stack>
    </Flex>
  ),
}
