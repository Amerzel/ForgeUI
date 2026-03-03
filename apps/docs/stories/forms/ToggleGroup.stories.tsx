import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { ToggleGroup } from '@forgeui/components'

const meta: Meta<typeof ToggleGroup> = {
  title: 'Forms/ToggleGroup',
  component: ToggleGroup,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof ToggleGroup>

export const Default: Story = {
  name: 'ToggleGroup',
  render: function ToggleGroupDemo() {
    const [align, setAlign] = useState('left')
    const [fmt, setFmt] = useState<string[]>(['bold'])

    const ALIGN_ITEMS = [
      { value: 'left', label: '⬅', 'aria-label': 'Align left' },
      { value: 'center', label: '↔', 'aria-label': 'Align center' },
      { value: 'right', label: '➡', 'aria-label': 'Align right' },
    ]
    const FMT_ITEMS = [
      { value: 'bold', label: 'B', 'aria-label': 'Bold' },
      { value: 'italic', label: 'I', 'aria-label': 'Italic' },
      { value: 'underline', label: 'U', 'aria-label': 'Underline' },
    ]
    return (
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <ToggleGroup
          type="single"
          items={ALIGN_ITEMS}
          value={align}
          onValueChange={(v) => {
            if (v) setAlign(v)
          }}
          aria-label="Text alignment"
        />
        <ToggleGroup
          type="multiple"
          items={FMT_ITEMS}
          value={fmt}
          onValueChange={setFmt}
          aria-label="Text formatting"
        />
      </div>
    )
  },
}
