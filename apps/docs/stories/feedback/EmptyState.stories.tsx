import type { Meta, StoryObj } from '@storybook/react'
import { EmptyState } from '@forgeui/components'

const meta: Meta<typeof EmptyState> = {
  title: 'Feedback/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Centered empty state placeholder with icon, title, description, and optional action button.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof EmptyState>

export const Default: Story = {
  args: {
    icon: '📂',
    title: 'No items found',
    description: 'There are no items matching your current filters.',
  },
}

export const WithAction: Story = {
  name: 'With Action Button',
  args: {
    icon: '🗂',
    title: 'No entities yet',
    description: 'Create your first entity to get started with the catalog.',
    action: { label: 'Create Entity', onClick: () => alert('Create clicked!') },
  },
}

export const SearchEmpty: Story = {
  name: 'Search No Results',
  args: {
    icon: '🔍',
    title: 'No results',
    description: 'Try adjusting your search terms or filters.',
  },
}

export const ErrorState: Story = {
  name: 'Error State',
  args: {
    icon: '⚠️',
    title: 'Something went wrong',
    description: 'Failed to load data. Please try again.',
    action: { label: 'Retry', onClick: () => alert('Retry clicked!') },
  },
}

export const NoIcon: Story = {
  name: 'Minimal (No Icon)',
  args: {
    title: 'Nothing here',
    description: 'This section is empty.',
  },
}
