import type { Meta, StoryObj } from '@storybook/react'
import { Skeleton } from '@forgeui/components'

const meta: Meta<typeof Skeleton> = {
  title: 'Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Skeleton>

export const LoadingState: Story = {
  name: 'Skeleton — loading state',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Card loading state */}
      <div
        role="status"
        aria-label="Loading content"
        style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', width: '320px' }}
      >
        <Skeleton circle width={40} height={40} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Skeleton width="60%" height={14} />
          <Skeleton width="100%" height={12} />
          <Skeleton width="80%" height={12} />
        </div>
      </div>
      {/* Table rows */}
      <div
        role="status"
        aria-label="Loading table"
        style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '400px' }}
      >
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} style={{ display: 'flex', gap: '12px' }}>
            <Skeleton width={120} height={14} />
            <Skeleton width={80} height={14} />
            <Skeleton width="100%" height={14} />
          </div>
        ))}
      </div>
    </div>
  ),
}
