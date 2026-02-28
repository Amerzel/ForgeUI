import type { Meta, StoryObj } from '@storybook/react'
import { AspectRatio, Text } from '@forgeui/components'

const meta: Meta = {
  title: 'Composites/AspectRatio',
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj

export const Default: Story = {
  name: 'AspectRatio',
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      {([
        { ratio: 16 / 9, label: '16:9', color: 'var(--forge-accent)' },
        { ratio: 4 / 3,  label: '4:3',  color: 'var(--forge-success)' },
        { ratio: 1,      label: '1:1',  color: 'var(--forge-warning)' },
      ] as const).map(({ ratio, label, color }) => (
        <div key={label} style={{ width: '180px' }}>
          <AspectRatio ratio={ratio}>
            <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--forge-surface)', border: '1px solid var(--forge-border)', borderRadius: 'var(--forge-radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '4px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: 'var(--forge-radius-sm)', backgroundColor: color, opacity: 0.3 }} />
              <Text size="xs" style={{ color: 'var(--forge-text-muted)' }}>{label}</Text>
            </div>
          </AspectRatio>
        </div>
      ))}
    </div>
  ),
}
