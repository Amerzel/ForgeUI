import type { Meta, StoryObj } from '@storybook/react'
import { Collapsible, Text } from '@forgeui/components'

const meta: Meta = {
  title: 'Composites/Collapsible',
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj

export const Default: Story = {
  name: 'Collapsible',
  render: function CollapsibleDemo() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '360px' }}>
        {[
          { label: 'Transform', content: 'Position · Rotation · Scale' },
          { label: 'Physics', content: 'Mass · Friction · Restitution · Constraints' },
          { label: 'Rendering', content: 'Material · Cast Shadows · Receive Shadows · Layer Mask' },
        ].map(({ label, content }) => (
          <div key={label} style={{ border: '1px solid var(--forge-border)', borderRadius: 'var(--forge-radius-md)', overflow: 'hidden' }}>
            <Collapsible
              defaultOpen={label === 'Transform'}
              trigger={
                <div style={{ padding: '10px 12px', backgroundColor: 'var(--forge-surface)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Text size="sm" style={{ fontWeight: 500 }}>{label}</Text>
                </div>
              }
            >
              <div style={{ padding: '12px', backgroundColor: 'var(--forge-bg)', color: 'var(--forge-text-muted)', fontSize: 'var(--forge-font-size-sm)' }}>
                {content}
              </div>
            </Collapsible>
          </div>
        ))}
      </div>
    )
  },
}
