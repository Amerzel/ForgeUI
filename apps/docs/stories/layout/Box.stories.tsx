import type { Meta, StoryObj } from '@storybook/react'
import { Box, Stack, Flex, Text } from '@forgeui/components'

const meta: Meta = {
  title: 'Layout/Box',
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj

export const BoxTokenProps: Story = {
  name: 'Box — token-aware props',
  render: () => (
    <Stack gap={4} p={6}>
      <Text weight="semibold">Padding tokens (p=4, px=6, py=2)</Text>
      <Flex gap={4}>
        <Box p={4} bg="surface" radius="md" style={{ border: '1px solid var(--forge-border)' }}>
          <Text size="sm">p=4 (16px all)</Text>
        </Box>
        <Box px={6} py={2} bg="surface" radius="md" style={{ border: '1px solid var(--forge-border)' }}>
          <Text size="sm">px=6 py=2</Text>
        </Box>
        <Box pt={6} pb={2} pl={4} pr={2} bg="surface" radius="md" style={{ border: '1px solid var(--forge-border)' }}>
          <Text size="sm">pt=6 pb=2 pl=4 pr=2</Text>
        </Box>
      </Flex>

      <Text weight="semibold">Semantic colors</Text>
      <Flex gap={3} wrap="wrap">
        {(['bg', 'surface', 'surface-raised', 'accent', 'info-bg', 'success-bg', 'warning-bg', 'danger-bg'] as const).map(c => (
          <Box key={c} bg={c} p={3} radius="md" style={{ border: '1px solid var(--forge-border)', minWidth: 120 }}>
            <Text size="xs" color="muted">{c}</Text>
          </Box>
        ))}
      </Flex>

      <Text weight="semibold">Polymorphic — as=&quot;section&quot;</Text>
      <Box as="section" p={4} bg="surface" radius="md" style={{ border: '1px solid var(--forge-border)' }}>
        <Text size="sm">Rendered as &lt;section&gt;</Text>
      </Box>
    </Stack>
  ),
}
