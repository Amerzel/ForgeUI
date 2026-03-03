import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Toggle } from '@forgeui/components'

const meta: Meta<typeof Toggle> = {
  title: 'Forms/Toggle',
  component: Toggle,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Toggle>

export const Default: Story = {
  name: 'Toggle',
  render: function ToggleDemo() {
    const [bold, setBold] = useState(false)
    const [italic, setItalic] = useState(true)
    return (
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        <Toggle pressed={bold} onPressedChange={setBold} aria-label="Bold">
          B
        </Toggle>
        <Toggle pressed={italic} onPressedChange={setItalic} variant="outline" aria-label="Italic">
          I
        </Toggle>
        <Toggle pressed={false} size="sm" aria-label="Small toggle">
          S
        </Toggle>
        <Toggle pressed={false} size="lg" aria-label="Large toggle">
          L
        </Toggle>
        <Toggle disabled aria-label="Disabled toggle">
          D
        </Toggle>
      </div>
    )
  },
}
