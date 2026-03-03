import type { Meta, StoryObj } from '@storybook/react'
import { Tooltip, TooltipProvider, Button } from '@forgeui/components'

const meta: Meta<typeof Tooltip> = {
  title: 'Overlays/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  name: 'Tooltip',
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', padding: '40px 20px' }}>
      <Tooltip content="Save document (⌘S)">
        <Button variant="ghost" size="sm" aria-label="Save">
          💾 Save
        </Button>
      </Tooltip>
      <Tooltip content="Top tooltip" side="top">
        <Button variant="secondary" size="sm">
          Top
        </Button>
      </Tooltip>
      <Tooltip content="Right tooltip" side="right">
        <Button variant="secondary" size="sm">
          Right
        </Button>
      </Tooltip>
      <Tooltip content="Bottom tooltip" side="bottom">
        <Button variant="secondary" size="sm">
          Bottom
        </Button>
      </Tooltip>
      <Tooltip content="Left tooltip" side="left">
        <Button variant="secondary" size="sm">
          Left
        </Button>
      </Tooltip>
      <Tooltip content="This won't show" disabled>
        <Button variant="secondary" size="sm">
          Disabled tooltip
        </Button>
      </Tooltip>
    </div>
  ),
}
