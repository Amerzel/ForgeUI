import type { Meta, StoryObj } from '@storybook/react'
import { IconButton } from '@forgeui/components'

const meta: Meta<typeof IconButton> = {
  title: 'Primitives/IconButton',
  component: IconButton,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof IconButton>

export const Default: Story = {
  name: 'IconButton',
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <IconButton
          key={size}
          size={size}
          label={`Close (${size})`}
          icon={
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M1 1l12 12M13 1L1 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          }
        />
      ))}
      <IconButton
        label="Close (disabled)"
        disabled
        icon={
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M1 1l12 12M13 1L1 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        }
      />
    </div>
  ),
}
