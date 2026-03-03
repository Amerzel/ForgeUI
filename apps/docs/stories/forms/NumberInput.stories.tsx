import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { NumberInput, FormField } from '@forgeui/components'

const meta: Meta<typeof NumberInput> = {
  title: 'Forms/NumberInput',
  component: NumberInput,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof NumberInput>

export const Default: Story = {
  name: 'NumberInput',
  render: function NumberDemo() {
    const [count, setCount] = useState(5)
    const [angle, setAngle] = useState(45.5)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <FormField label="Count" htmlFor="num-count">
          <NumberInput
            id="num-count"
            value={count}
            onChange={setCount}
            min={0}
            max={100}
            step={1}
          />
        </FormField>
        <FormField label="Angle" htmlFor="num-angle">
          <NumberInput
            id="num-angle"
            value={angle}
            onChange={setAngle}
            min={-360}
            max={360}
            step={0.5}
            precision={1}
          />
        </FormField>
        <FormField label="Disabled" htmlFor="num-disabled">
          <NumberInput id="num-disabled" value={10} disabled />
        </FormField>
      </div>
    )
  },
}
