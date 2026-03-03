import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { ColorPicker, Text } from '@forgeui/components'

const meta: Meta = {
  title: 'Complex/ColorPicker',
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj

export const ColorPickerStory: Story = {
  name: 'ColorPicker',
  render: function ColorPickerDemo() {
    const [color, setColor] = useState('#e94560')
    const [colorAlpha, setColorAlpha] = useState('#4ade8080')
    return (
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div>
          <Text
            size="sm"
            style={{ color: 'var(--forge-text-muted)', marginBottom: '8px', display: 'block' }}
          >
            Faction color (no alpha)
          </Text>
          <ColorPicker
            value={color}
            onChange={setColor}
            swatches={[
              '#e94560',
              '#4ade80',
              '#818cf8',
              '#f9a8d4',
              '#fb923c',
              '#38bdf8',
              '#a78bfa',
              '#34d399',
            ]}
          />
          <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '20px',
                height: '20px',
                borderRadius: 'var(--forge-radius-sm)',
                backgroundColor: color,
                border: '1px solid var(--forge-border)',
              }}
            />
            <Text size="xs" style={{ fontFamily: 'var(--forge-font-mono)' }}>
              {color}
            </Text>
          </div>
        </div>
        <div>
          <Text
            size="sm"
            style={{ color: 'var(--forge-text-muted)', marginBottom: '8px', display: 'block' }}
          >
            Fog color (with alpha)
          </Text>
          <ColorPicker value={colorAlpha} onChange={setColorAlpha} alpha />
        </div>
      </div>
    )
  },
}
