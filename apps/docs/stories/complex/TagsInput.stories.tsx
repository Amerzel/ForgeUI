import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { TagsInput, Text } from '@forgeui/components'

const meta: Meta = {
  title: 'Complex/TagsInput',
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj

export const TagsInputStory: Story = {
  name: 'TagsInput',
  render: function TagsInputDemo() {
    const [tags, setTags] = useState(['outdoor', 'fantasy', 'medieval'])
    const [layers, setLayers] = useState(['Default', 'Player'])
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px' }}>
        <div>
          <Text size="sm" style={{ color: 'var(--forge-text-muted)', marginBottom: '6px', display: 'block' }}>Asset tags</Text>
          <TagsInput
            value={tags}
            onChange={setTags}
            suggestions={['outdoor', 'indoor', 'fantasy', 'sci-fi', 'medieval', 'modern', 'character', 'environment', 'prop', 'vfx']}
            placeholder="Add tag…"
          />
        </div>
        <div>
          <Text size="sm" style={{ color: 'var(--forge-text-muted)', marginBottom: '6px', display: 'block' }}>Layer mask (max 4)</Text>
          <TagsInput
            value={layers}
            onChange={setLayers}
            suggestions={['Default', 'Player', 'Enemy', 'UI', 'Environment', 'Projectile', 'Trigger']}
            max={4}
            placeholder="Add layer…"
          />
        </div>
      </div>
    )
  },
}
