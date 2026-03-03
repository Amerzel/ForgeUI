import type { Meta, StoryObj } from '@storybook/react'
import { Box, Stack, Flex, Spacer, Text } from '@forgeui/components'

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
  title: 'Layout/Flex',
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj

export const FlexStory: Story = {
  name: 'Flex — directional layout',
  render: () => (
    <Stack gap={6} p={6}>
      <div>
        <Text size="sm" color="muted">
          Row (default) + gap=3
        </Text>
        <Flex gap={3} style={{ marginTop: 8 }}>
          <Block label="A" />
          <Block label="B" />
          <Block label="C" />
        </Flex>
      </div>

      <div>
        <Text size="sm" color="muted">
          Row + justify=space-between + align=center
        </Text>
        <Flex
          justify="space-between"
          align="center"
          style={{
            marginTop: 8,
            border: '1px dashed var(--forge-border)',
            padding: 8,
            borderRadius: 4,
          }}
        >
          <Block label="Left" />
          <Block label="Center" />
          <Block label="Right" />
        </Flex>
      </div>

      <div>
        <Text size="sm" color="muted">
          Column direction + gap=2
        </Text>
        <Flex direction="column" gap={2} style={{ marginTop: 8, width: 200 }}>
          <Block label="Top" />
          <Block label="Middle" />
          <Block label="Bottom" />
        </Flex>
      </div>

      <div>
        <Text size="sm" color="muted">
          Spacer push
        </Text>
        <Flex
          style={{
            marginTop: 8,
            border: '1px dashed var(--forge-border)',
            padding: 8,
            borderRadius: 4,
          }}
        >
          <Block label="Logo" />
          <Spacer />
          <Block label="Actions" />
        </Flex>
      </div>
    </Stack>
  ),
}
