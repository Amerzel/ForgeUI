import type { Meta, StoryObj } from '@storybook/react'
import { Avatar } from '@forgeui/components'

const meta: Meta = {
  title: 'Composites/Avatar',
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj

export const Default: Story = {
  name: 'Avatar',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
          <Avatar key={size} alt="James Dev" fallback="JD" size={size} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Avatar alt="Anna" fallback="A" size="md" />
        <Avatar alt="Bob Chen" fallback="BC" size="md" />
        <Avatar alt="Dev Team" fallback="DT" size="md" />
        <Avatar alt="Guest" fallback="?" size="md" />
      </div>
      <div style={{ display: 'flex', gap: '-8px' }}>
        {['JD', 'BC', 'AT', 'MR'].map((f, i) => (
          <div
            key={f}
            style={{ marginLeft: i > 0 ? '-10px' : 0, position: 'relative', zIndex: 4 - i }}
          >
            <Avatar alt={f} fallback={f} size="sm" />
          </div>
        ))}
        <div style={{ marginLeft: '-10px', zIndex: 0, position: 'relative' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--forge-surface)',
              border: '1px solid var(--forge-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              color: 'var(--forge-text-muted)',
            }}
          >
            +3
          </div>
        </div>
      </div>
    </div>
  ),
}
