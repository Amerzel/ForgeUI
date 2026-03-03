import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from '@forgeui/components'

const meta: Meta<typeof Badge> = {
  title: 'Primitives/Badge',
  component: Badge,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Badge>

export const Variants: Story = {
  name: 'Badge — variants',
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {(['accent', 'info', 'success', 'warning', 'danger', 'neutral'] as const).map((color) =>
        (['solid', 'subtle', 'outline'] as const).map((variant) => (
          <Badge key={`${color}-${variant}`} color={color} variant={variant}>
            {color}
          </Badge>
        )),
      )}
    </div>
  ),
}
