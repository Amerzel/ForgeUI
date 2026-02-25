import type { Meta, StoryObj } from '@storybook/react'
import {
  Box, Stack, Flex, Group, Grid, Center, Spacer,
  Container, SimpleGrid, Wrap,
  Button, Badge, Text, Separator, Card,
} from '@forgeui/components'

// ---------------------------------------------------------------------------
// Meta — one file covers all layout primitives
// ---------------------------------------------------------------------------
const meta: Meta = {
  title: 'Layout/Primitives',
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

// Utility swatch for visualising layout
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

// ---------------------------------------------------------------------------
// Box
// ---------------------------------------------------------------------------
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

      <Text weight="semibold">Polymorphic — as="section"</Text>
      <Box as="section" p={4} bg="surface" radius="md" style={{ border: '1px solid var(--forge-border)' }}>
        <Text size="sm">Rendered as &lt;section&gt;</Text>
      </Box>
    </Stack>
  ),
}

// ---------------------------------------------------------------------------
// Stack
// ---------------------------------------------------------------------------
export const StackStory: Story = {
  name: 'Stack — vertical layout',
  render: () => (
    <Flex gap={8} p={6} wrap="wrap" align="flex-start">
      <Stack gap={2} style={{ width: 180 }}>
        <Text size="sm" color="muted">gap=2 (8px)</Text>
        <Block label="Item 1" />
        <Block label="Item 2" />
        <Block label="Item 3" />
      </Stack>

      <Stack gap={4} style={{ width: 180 }}>
        <Text size="sm" color="muted">gap=4 (16px)</Text>
        <Block label="Item 1" />
        <Block label="Item 2" />
        <Block label="Item 3" />
      </Stack>

      <Stack gap={2} reverse style={{ width: 180 }}>
        <Text size="sm" color="muted">reverse=true</Text>
        <Block label="1 (bottom)" />
        <Block label="2" />
        <Block label="3 (top)" />
      </Stack>
    </Flex>
  ),
}

// ---------------------------------------------------------------------------
// Flex
// ---------------------------------------------------------------------------
export const FlexStory: Story = {
  name: 'Flex — directional layout',
  render: () => (
    <Stack gap={6} p={6}>
      <div>
        <Text size="sm" color="muted">Row (default) + gap=3</Text>
        <Flex gap={3} style={{ marginTop: 8 }}>
          <Block label="A" /><Block label="B" /><Block label="C" />
        </Flex>
      </div>

      <div>
        <Text size="sm" color="muted">Row + justify=space-between + align=center</Text>
        <Flex justify="space-between" align="center" style={{ marginTop: 8, border: '1px dashed var(--forge-border)', padding: 8, borderRadius: 4 }}>
          <Block label="Left" />
          <Block label="Center" />
          <Block label="Right" />
        </Flex>
      </div>

      <div>
        <Text size="sm" color="muted">Column direction + gap=2</Text>
        <Flex direction="column" gap={2} style={{ marginTop: 8, width: 200 }}>
          <Block label="Top" /><Block label="Middle" /><Block label="Bottom" />
        </Flex>
      </div>

      <div>
        <Text size="sm" color="muted">Spacer push</Text>
        <Flex style={{ marginTop: 8, border: '1px dashed var(--forge-border)', padding: 8, borderRadius: 4 }}>
          <Block label="Logo" />
          <Spacer />
          <Block label="Actions" />
        </Flex>
      </div>
    </Stack>
  ),
}

// ---------------------------------------------------------------------------
// Group
// ---------------------------------------------------------------------------
export const GroupStory: Story = {
  name: 'Group — horizontal composition',
  render: () => (
    <Stack gap={6} p={6}>
      <div>
        <Text size="sm" color="muted">Default (gap=2, align=center)</Text>
        <Group style={{ marginTop: 8 }}>
          <Button size="sm">Save</Button>
          <Button size="sm" variant="ghost">Cancel</Button>
          <Separator orientation="vertical" style={{ height: 20 }} />
          <Badge color="success">Saved</Badge>
        </Group>
      </div>

      <div>
        <Text size="sm" color="muted">grow=true — equal width children</Text>
        <Group grow gap={2} style={{ marginTop: 8, width: 400 }}>
          <Button variant="primary">Confirm</Button>
          <Button variant="ghost">Cancel</Button>
          <Button variant="danger">Delete</Button>
        </Group>
      </div>

      <div>
        <Text size="sm" color="muted">Wrapping badge list</Text>
        <Group wrap="wrap" gap={2} style={{ marginTop: 8 }}>
          {['Fighter', 'Mage', 'Rogue', 'Cleric', 'Paladin', 'Ranger', 'Druid'].map(c => (
            <Badge key={c} variant="subtle">{c}</Badge>
          ))}
        </Group>
      </div>
    </Stack>
  ),
}

// ---------------------------------------------------------------------------
// Grid
// ---------------------------------------------------------------------------
export const GridStory: Story = {
  name: 'Grid — CSS grid',
  render: () => (
    <Stack gap={6} p={6}>
      <div>
        <Text size="sm" color="muted">columns=3 (equal thirds)</Text>
        <Grid columns={3} gap={3} style={{ marginTop: 8 }}>
          <Block label="1" /><Block label="2" /><Block label="3" />
          <Block label="4" /><Block label="5" /><Block label="6" />
        </Grid>
      </div>

      <div>
        <Text size="sm" color="muted">Custom template: "300px 1fr 360px" (inspector layout)</Text>
        <Grid columns="300px 1fr 360px" gap={2} style={{ marginTop: 8 }}>
          <Block label="Sidebar (300px)" color="surface" />
          <Block label="Canvas (1fr)" color="surface-raised" />
          <Block label="Inspector (360px)" color="surface" />
        </Grid>
      </div>

      <div>
        <Text size="sm" color="muted">Grid.Col span</Text>
        <Grid columns={12} gap={2} style={{ marginTop: 8 }}>
          <Grid.Col span={8}><Block label="span 8" /></Grid.Col>
          <Grid.Col span={4}><Block label="span 4" /></Grid.Col>
          <Grid.Col span={4}><Block label="span 4" /></Grid.Col>
          <Grid.Col span={4}><Block label="span 4" /></Grid.Col>
          <Grid.Col span={4}><Block label="span 4" /></Grid.Col>
        </Grid>
      </div>

      <div>
        <Text size="sm" color="muted">Named template areas</Text>
        <Grid
          areas={'"header header" "sidebar main"'}
          columns="200px 1fr"
          rows="48px 1fr"
          gap={2}
          style={{ marginTop: 8, height: 160 }}
        >
          <Grid.Col area="header"><Block label="header" color="surface" /></Grid.Col>
          <Grid.Col area="sidebar"><Block label="sidebar" /></Grid.Col>
          <Grid.Col area="main"><Block label="main" color="surface-raised" /></Grid.Col>
        </Grid>
      </div>
    </Stack>
  ),
}

// ---------------------------------------------------------------------------
// Center
// ---------------------------------------------------------------------------
export const CenterStory: Story = {
  name: 'Center — centering utility',
  render: () => (
    <Stack gap={6} p={6}>
      <div>
        <Text size="sm" color="muted">Center in fixed-height container</Text>
        <Center style={{ height: 120, marginTop: 8, border: '1px dashed var(--forge-border)', borderRadius: 4 }}>
          <Badge color="accent">Centered</Badge>
        </Center>
      </div>
      <div>
        <Text size="sm" color="muted">inline=true</Text>
        <Center inline style={{ marginTop: 8 }}>
          <Text size="sm">Inline centered</Text>
        </Center>
      </div>
    </Stack>
  ),
}

// ---------------------------------------------------------------------------
// Container
// ---------------------------------------------------------------------------
export const ContainerStory: Story = {
  name: 'Container — max-width wrapper',
  render: () => (
    <Stack gap={6} p={4}>
      {(['sm', 'md', 'lg'] as const).map(size => (
        <div key={size}>
          <Text size="sm" color="muted">size="{size}"</Text>
          <Container size={size} style={{ marginTop: 8, background: 'var(--forge-surface)', border: '1px solid var(--forge-border)', borderRadius: 4, padding: 12 }}>
            <Text size="sm">Container size="{size}"</Text>
          </Container>
        </div>
      ))}
      <div>
        <Text size="sm" color="muted">fluid (no max-width)</Text>
        <Container fluid style={{ marginTop: 8, background: 'var(--forge-surface)', border: '1px solid var(--forge-border)', borderRadius: 4, padding: 12 }}>
          <Text size="sm">Fluid container — full width</Text>
        </Container>
      </div>
    </Stack>
  ),
}

// ---------------------------------------------------------------------------
// SimpleGrid
// ---------------------------------------------------------------------------
export const SimpleGridStory: Story = {
  name: 'SimpleGrid — equal columns',
  render: () => (
    <Stack gap={6} p={6}>
      <div>
        <Text size="sm" color="muted">cols=4 (stat cards)</Text>
        <SimpleGrid cols={4} spacing={3} style={{ marginTop: 8 }}>
          {['Entities', 'Quests', 'Factions', 'Locations'].map(label => (
            <Card key={label}>
              <Card.Body><Text size="sm" weight="semibold">{label}</Text></Card.Body>
            </Card>
          ))}
        </SimpleGrid>
      </div>

      <div>
        <Text size="sm" color="muted">minChildWidth="200px" (auto-fit)</Text>
        <SimpleGrid minChildWidth="200px" spacing={3} style={{ marginTop: 8 }}>
          {Array.from({ length: 5 }, (_, i) => (
            <Block key={i} label={`Item ${i + 1}`} />
          ))}
        </SimpleGrid>
      </div>
    </Stack>
  ),
}

// ---------------------------------------------------------------------------
// Wrap
// ---------------------------------------------------------------------------
export const WrapStory: Story = {
  name: 'Wrap — flex-wrap',
  render: () => (
    <Stack gap={6} p={6}>
      <div>
        <Text size="sm" color="muted">Tags list</Text>
        <Wrap gap={2} style={{ marginTop: 8 }}>
          {['Prophecy', 'Ancient', 'Forbidden', 'Dragon', 'Arcane', 'Sacred', 'Cursed', 'Divine', 'Shadow', 'Light'].map(tag => (
            <Badge key={tag} variant="subtle" color="info">{tag}</Badge>
          ))}
        </Wrap>
      </div>

      <div>
        <Text size="sm" color="muted">Action chips</Text>
        <Wrap gap={2} style={{ marginTop: 8 }}>
          {['Fighter', 'Mage', 'Rogue', 'Cleric'].map(cls => (
            <Button key={cls} size="sm" variant="ghost">{cls}</Button>
          ))}
        </Wrap>
      </div>
    </Stack>
  ),
}

// ---------------------------------------------------------------------------
// Composition demo — realistic inspector panel layout
// ---------------------------------------------------------------------------
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
