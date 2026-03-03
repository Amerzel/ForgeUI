import type { Meta, StoryObj } from '@storybook/react'
import { Label } from '@forgeui/components'

const meta: Meta<typeof Label> = {
  title: 'Primitives/Label',
  component: Label,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Label>

export const Default: Story = {
  name: 'Label',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Label htmlFor="demo-input">Field label</Label>
      <input
        id="demo-input"
        style={{
          padding: '4px 8px',
          background: 'var(--forge-surface)',
          border: '1px solid var(--forge-border)',
          borderRadius: '4px',
          color: 'var(--forge-text)',
        }}
        placeholder="Input"
      />
      <Label htmlFor="demo-input-2" disabled>
        Disabled label
      </Label>
      <input
        id="demo-input-2"
        disabled
        style={{
          padding: '4px 8px',
          background: 'var(--forge-surface)',
          border: '1px solid var(--forge-border)',
          borderRadius: '4px',
          color: 'var(--forge-text)',
          opacity: 0.5,
        }}
      />
    </div>
  ),
}
