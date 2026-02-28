import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Progress } from '@forgeui/components'

const meta: Meta<typeof Progress> = {
  title: 'Feedback/Progress',
  component: Progress,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Progress>

export const Variants: Story = {
  name: 'Progress — variants',
  render: function ProgressDemo() {
    const [value, setValue] = useState(60)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px' }}>
        <Progress value={value} label="Upload progress" showValue />
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setValue(v => Math.max(0, v - 10))} style={{ padding: '4px 8px', cursor: 'pointer', background: 'var(--forge-surface)', border: '1px solid var(--forge-border)', borderRadius: '4px', color: 'var(--forge-text)' }}>-10</button>
          <button onClick={() => setValue(v => Math.min(100, v + 10))} style={{ padding: '4px 8px', cursor: 'pointer', background: 'var(--forge-surface)', border: '1px solid var(--forge-border)', borderRadius: '4px', color: 'var(--forge-text)' }}>+10</button>
        </div>
        <Progress variant="success" value={100} label="Completed" showValue />
        <Progress variant="warning" value={78} label="Warning threshold" size="sm" />
        <Progress variant="danger" value={95} label="Critical" size="lg" />
        <Progress label="Indeterminate (loading…)" />
      </div>
    )
  },
}
