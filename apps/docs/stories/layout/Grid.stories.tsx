import type { Meta, StoryObj } from '@storybook/react'
import { Box, Stack, Grid, Text } from '@forgeui/components'

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
  title: 'Layout/Grid',
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj

export const GridStory: Story = {
  name: 'Grid — CSS grid',
  render: () => (
    <Stack gap={6} p={6}>
      <div>
        <Text size="sm" color="muted">
          columns=3 (equal thirds)
        </Text>
        <Grid columns={3} gap={3} style={{ marginTop: 8 }}>
          <Block label="1" />
          <Block label="2" />
          <Block label="3" />
          <Block label="4" />
          <Block label="5" />
          <Block label="6" />
        </Grid>
      </div>

      <div>
        <Text size="sm" color="muted">
          Custom template: &quot;300px 1fr 360px&quot; (inspector layout)
        </Text>
        <Grid columns="300px 1fr 360px" gap={2} style={{ marginTop: 8 }}>
          <Block label="Sidebar (300px)" color="surface" />
          <Block label="Canvas (1fr)" color="surface-raised" />
          <Block label="Inspector (360px)" color="surface" />
        </Grid>
      </div>

      <div>
        <Text size="sm" color="muted">
          Grid.Col span
        </Text>
        <Grid columns={12} gap={2} style={{ marginTop: 8 }}>
          <Grid.Col span={8}>
            <Block label="span 8" />
          </Grid.Col>
          <Grid.Col span={4}>
            <Block label="span 4" />
          </Grid.Col>
          <Grid.Col span={4}>
            <Block label="span 4" />
          </Grid.Col>
          <Grid.Col span={4}>
            <Block label="span 4" />
          </Grid.Col>
          <Grid.Col span={4}>
            <Block label="span 4" />
          </Grid.Col>
        </Grid>
      </div>

      <div>
        <Text size="sm" color="muted">
          Named template areas
        </Text>
        <Grid
          areas={'"header header" "sidebar main"'}
          columns="200px 1fr"
          rows="48px 1fr"
          gap={2}
          style={{ marginTop: 8, height: 160 }}
        >
          <Grid.Col area="header">
            <Block label="header" color="surface" />
          </Grid.Col>
          <Grid.Col area="sidebar">
            <Block label="sidebar" />
          </Grid.Col>
          <Grid.Col area="main">
            <Block label="main" color="surface-raised" />
          </Grid.Col>
        </Grid>
      </div>
    </Stack>
  ),
}
