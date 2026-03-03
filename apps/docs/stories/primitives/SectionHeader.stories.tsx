import type { Meta, StoryObj } from '@storybook/react'
import { SectionHeader, Button, Text } from '@forgeui/components'

const meta: Meta<typeof SectionHeader> = {
  title: 'Primitives/SectionHeader',
  component: SectionHeader,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Uppercase mono-font section label with optional description and action slot.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof SectionHeader>

export const Default: Story = {
  args: {
    children: 'Section Title',
  },
}

export const WithDescription: Story = {
  name: 'With Description',
  args: {
    children: 'Build Configuration',
    description: 'Manage build settings and optimization parameters.',
  },
}

export const WithAction: Story = {
  name: 'With Action',
  args: {
    children: 'Recent Activity',
    action: (
      <Button variant="ghost" size="sm">
        View All
      </Button>
    ),
  },
}

export const SectionLayout: Story = {
  name: 'Section Layout Example',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '480px' }}>
      <div>
        <SectionHeader
          action={
            <Button variant="ghost" size="sm">
              Edit
            </Button>
          }
        >
          General Settings
        </SectionHeader>
        <Text size="sm" style={{ color: 'var(--forge-text-muted)', padding: '8px 0' }}>
          Section content goes here...
        </Text>
      </div>
      <div>
        <SectionHeader description="Asset processing pipeline configuration">
          Pipeline
        </SectionHeader>
        <Text size="sm" style={{ color: 'var(--forge-text-muted)', padding: '8px 0' }}>
          Pipeline settings content...
        </Text>
      </div>
      <div>
        <SectionHeader>Advanced</SectionHeader>
        <Text size="sm" style={{ color: 'var(--forge-text-muted)', padding: '8px 0' }}>
          Advanced configuration options...
        </Text>
      </div>
    </div>
  ),
}
