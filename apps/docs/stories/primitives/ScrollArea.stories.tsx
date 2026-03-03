import type { Meta, StoryObj } from '@storybook/react'
import { ScrollArea } from '@forgeui/components'

const meta: Meta<typeof ScrollArea> = {
  title: 'Primitives/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof ScrollArea>

export const Default: Story = {
  name: 'ScrollArea',
  render: () => (
    <ScrollArea
      style={{
        height: '160px',
        width: '300px',
        border: '1px solid var(--forge-border)',
        borderRadius: '6px',
      }}
    >
      <div style={{ padding: '16px' }}>
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} style={{ padding: '4px 0', color: 'var(--forge-text)', fontSize: '13px' }}>
            Item {i + 1} — long enough content to trigger scroll
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
}
