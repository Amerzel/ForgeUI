import type { Meta, StoryObj } from '@storybook/react'
import { Stack, Container, Text } from '@forgeui/components'

const meta: Meta = {
  title: 'Layout/Container',
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj

export const ContainerStory: Story = {
  name: 'Container — max-width wrapper',
  render: () => (
    <Stack gap={6} p={4}>
      {(['sm', 'md', 'lg'] as const).map(size => (
        <div key={size}>
          <Text size="sm" color="muted">size=&quot;{size}&quot;</Text>
          <Container size={size} style={{ marginTop: 8, background: 'var(--forge-surface)', border: '1px solid var(--forge-border)', borderRadius: 4, padding: 12 }}>
            <Text size="sm">Container size=&quot;{size}&quot;</Text>
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
