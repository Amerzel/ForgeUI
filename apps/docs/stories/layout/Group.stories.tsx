import type { Meta, StoryObj } from '@storybook/react'
import { Stack, Group, Button, Badge, Separator, Text } from '@forgeui/components'

const meta: Meta = {
  title: 'Layout/Group',
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj

export const GroupStory: Story = {
  name: 'Group — horizontal composition',
  render: () => (
    <Stack gap={6} p={6}>
      <div>
        <Text size="sm" color="muted">
          Default (gap=2, align=center)
        </Text>
        <Group style={{ marginTop: 8 }}>
          <Button size="sm">Save</Button>
          <Button size="sm" variant="ghost">
            Cancel
          </Button>
          <Separator orientation="vertical" style={{ height: 20 }} />
          <Badge color="success">Saved</Badge>
        </Group>
      </div>

      <div>
        <Text size="sm" color="muted">
          grow=true — equal width children
        </Text>
        <Group grow gap={2} style={{ marginTop: 8, width: 400 }}>
          <Button variant="primary">Confirm</Button>
          <Button variant="ghost">Cancel</Button>
          <Button variant="danger">Delete</Button>
        </Group>
      </div>

      <div>
        <Text size="sm" color="muted">
          Wrapping badge list
        </Text>
        <Group wrap="wrap" gap={2} style={{ marginTop: 8 }}>
          {['Fighter', 'Mage', 'Rogue', 'Cleric', 'Paladin', 'Ranger', 'Druid'].map((c) => (
            <Badge key={c} variant="subtle">
              {c}
            </Badge>
          ))}
        </Group>
      </div>
    </Stack>
  ),
}
