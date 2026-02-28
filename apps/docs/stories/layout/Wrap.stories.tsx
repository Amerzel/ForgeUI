import type { Meta, StoryObj } from '@storybook/react'
import { Stack, Wrap, Badge, Button, Text } from '@forgeui/components'

const meta: Meta = {
  title: 'Layout/Wrap',
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj

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
