import type { Meta, StoryObj } from '@storybook/react'
import { Box, Stack, SimpleGrid, Card, Text } from '@forgeui/components'

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
  title: 'Layout/SimpleGrid',
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj

export const SimpleGridStory: Story = {
  name: 'SimpleGrid — equal columns',
  render: () => (
    <Stack gap={6} p={6}>
      <div>
        <Text size="sm" color="muted">
          cols=4 (stat cards)
        </Text>
        <SimpleGrid cols={4} spacing={3} style={{ marginTop: 8 }}>
          {['Entities', 'Quests', 'Factions', 'Locations'].map((label) => (
            <Card key={label}>
              <Card.Body>
                <Text size="sm" weight="semibold">
                  {label}
                </Text>
              </Card.Body>
            </Card>
          ))}
        </SimpleGrid>
      </div>

      <div>
        <Text size="sm" color="muted">
          minChildWidth=&quot;200px&quot; (auto-fit)
        </Text>
        <SimpleGrid minChildWidth="200px" spacing={3} style={{ marginTop: 8 }}>
          {Array.from({ length: 5 }, (_, i) => (
            <Block key={i} label={`Item ${i + 1}`} />
          ))}
        </SimpleGrid>
      </div>
    </Stack>
  ),
}
