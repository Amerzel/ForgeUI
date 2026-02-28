import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Slider, FormField } from '@forgeui/components'

const meta: Meta<typeof Slider> = {
  title: 'Forms/Slider',
  component: Slider,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Slider>

export const Default: Story = {
  name: 'Slider',
  render: function SliderDemo() {
    const [value, setValue] = useState([50])
    const [range, setRange] = useState([20, 80])
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '320px' }}>
        <FormField label={`Volume: ${value[0]}`} htmlFor="sl-volume">
          <Slider value={value} onValueChange={setValue} min={0} max={100} aria-label="Volume" />
        </FormField>
        <FormField label={`Range: ${range[0]}–${range[1]}`} htmlFor="sl-range">
          <Slider value={range} onValueChange={setRange} min={0} max={100} aria-label="Range" />
        </FormField>
        <FormField label="Disabled" htmlFor="sl-disabled">
          <Slider defaultValue={[30]} disabled aria-label="Disabled slider" />
        </FormField>
      </div>
    )
  },
}
