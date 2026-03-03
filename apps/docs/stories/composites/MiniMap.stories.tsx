import type { Meta, StoryObj } from '@storybook/react'
import { MiniMap, Text } from '@forgeui/components'

const meta: Meta<typeof MiniMap> = {
  title: 'Composites/MiniMap',
  component: MiniMap,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Scaled-down viewport navigation widget for large canvases and graphs.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof MiniMap>

export const Default: Story = {
  args: {
    contentWidth: 2000,
    contentHeight: 1500,
    viewport: { x: 200, y: 300, width: 800, height: 600 },
    width: 200,
    height: 140,
  },
}

export const WithContent: Story = {
  name: 'With Node Dots',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Text size="sm" style={{ fontWeight: 500 }}>
        Graph Navigation
      </Text>
      <MiniMap
        contentWidth={1000}
        contentHeight={800}
        viewport={{ x: 100, y: 100, width: 400, height: 300 }}
        width={200}
        height={160}
      >
        {/* Simulated graph nodes */}
        <div
          style={{
            position: 'absolute',
            left: 200,
            top: 150,
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: 'var(--forge-accent)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 400,
            top: 300,
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: 'var(--forge-success)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 600,
            top: 200,
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: 'var(--forge-warning)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 300,
            top: 500,
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: 'var(--forge-danger)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 700,
            top: 450,
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: 'var(--forge-accent)',
          }}
        />
      </MiniMap>
    </div>
  ),
}
