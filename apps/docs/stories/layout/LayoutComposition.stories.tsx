import type { Meta, StoryObj } from '@storybook/react'
import {
  Box, Stack, Grid, Group, SimpleGrid, Wrap,
  Button, Spacer, Badge, Text,
} from '@forgeui/components'

const meta: Meta = {
  title: 'Layout/Composition',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

export const CompositionDemo: Story = {
  name: 'Composition — inspector panel layout',
  render: () => (
    <Grid columns="260px 1fr" style={{ height: '100vh' }}>
      {/* Sidebar */}
      <Box bg="surface" style={{ borderRight: '1px solid var(--forge-border)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Box p={3} style={{ borderBottom: '1px solid var(--forge-border)' }}>
          <Text size="sm" weight="semibold">Scene Graph</Text>
        </Box>
        <Box p={2} style={{ flex: 1, overflowY: 'auto' }}>
          <Stack gap={1}>
            {['World Root', '  Goblin Camp', '    Goblin Chief', '    Goblin Guard', '  Forest Clearing'].map(n => (
              <Box key={n} p={2} radius="sm" bg="surface" style={{ cursor: 'pointer' }}>
                <Text size="xs" style={{ fontFamily: 'var(--forge-font-mono)' }}>{n}</Text>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>

      {/* Main */}
      <Stack gap={0} style={{ overflow: 'hidden' }}>
        {/* Toolbar */}
        <Box p={2} bg="surface" style={{ borderBottom: '1px solid var(--forge-border)' }}>
          <Group gap={2}>
            <Button size="sm" variant="primary">Save</Button>
            <Button size="sm" variant="ghost">Duplicate</Button>
            <Spacer />
            <Badge color="success">Saved</Badge>
          </Group>
        </Box>

        {/* Content area */}
        <Box p={4} style={{ flex: 1, overflowY: 'auto' }}>
          <Stack gap={4}>
            <Text size="md" weight="semibold">Goblin Chief</Text>
            <SimpleGrid cols={2} spacing={3}>
              <Box bg="surface" p={3} radius="md">
                <Stack gap={1}>
                  <Text size="xs" color="muted">Health</Text>
                  <Text size="sm" weight="medium">85 / 100</Text>
                </Stack>
              </Box>
              <Box bg="surface" p={3} radius="md">
                <Stack gap={1}>
                  <Text size="xs" color="muted">Faction</Text>
                  <Text size="sm" weight="medium">Ironback Clan</Text>
                </Stack>
              </Box>
            </SimpleGrid>
            <Wrap gap={2}>
              {['Aggressive', 'Pack Leader', 'Fire Resistant'].map(t => (
                <Badge key={t} variant="subtle" color="warning">{t}</Badge>
              ))}
            </Wrap>
          </Stack>
        </Box>
      </Stack>
    </Grid>
  ),
}
