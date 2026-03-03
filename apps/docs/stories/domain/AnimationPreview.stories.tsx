import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { AnimationPreview, Text, Badge } from '@forgeui/components'

const meta: Meta = {
  title: 'Domain/AnimationPreview',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Frame-stepping animation player for previewing multi-frame tile animations. Supports play/pause, frame stepping, speed control, and a clickable filmstrip.',
      },
    },
    layout: 'centered',
  },
}
export default meta
type Story = StoryObj

// Generate colored frame SVGs for demo purposes
function makeFrame(color: string, label: string, size = 32): string {
  return (
    'data:image/svg+xml,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" shape-rendering="crispEdges">
        <rect width="${size}" height="${size}" fill="${color}"/>
        <text x="${size / 2}" y="${size / 2}" font-size="${size * 0.4}" fill="white" text-anchor="middle" dominant-baseline="central" font-family="monospace">${label}</text>
      </svg>`,
    )
  )
}

const WALK_FRAMES = [
  { src: makeFrame('#3b82f6', '1'), duration: 120 },
  { src: makeFrame('#6366f1', '2'), duration: 120 },
  { src: makeFrame('#8b5cf6', '3'), duration: 120 },
  { src: makeFrame('#a855f7', '4'), duration: 120 },
  { src: makeFrame('#8b5cf6', '5'), duration: 120 },
  { src: makeFrame('#6366f1', '6'), duration: 120 },
]

export const Default: Story = {
  name: 'Walk Cycle',
  render: function WalkCycleDemo() {
    const [frame, setFrame] = useState(0)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Text size="sm" style={{ fontWeight: 500 }}>
            Walk Cycle Animation
          </Text>
          <Badge>6 frames</Badge>
        </div>
        <AnimationPreview
          frames={WALK_FRAMES}
          previewSize={128}
          showMetadata
          onFrameChange={setFrame}
        />
        <Text size="xs" style={{ color: 'var(--forge-text-muted)' }}>
          Current frame: {frame + 1} · Click filmstrip thumbnails to jump
        </Text>
      </div>
    )
  },
}

export const SingleFrame: Story = {
  name: 'Single Frame (Static)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Text size="sm" style={{ fontWeight: 500 }}>
          Static Tile
        </Text>
        <Badge>1 frame</Badge>
      </div>
      <AnimationPreview
        frames={[{ src: makeFrame('#10b981', '🌲', 64), duration: 100 }]}
        previewSize={128}
      />
      <Text size="xs" style={{ color: 'var(--forge-text-muted)' }}>
        Single-frame input hides all playback controls and filmstrip
      </Text>
    </div>
  ),
}

export const CustomSpeed: Story = {
  name: 'Custom Speed Options',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Text size="sm" style={{ fontWeight: 500 }}>
        Slow Animation (custom speeds)
      </Text>
      <AnimationPreview
        frames={[
          { src: makeFrame('#ef4444', 'A'), duration: 500 },
          { src: makeFrame('#f97316', 'B'), duration: 500 },
          { src: makeFrame('#eab308', 'C'), duration: 500 },
        ]}
        previewSize={96}
        speedOptions={[0.1, 0.25, 0.5, 1]}
        speed={0.5}
        showMetadata
      />
    </div>
  ),
}

export const NoFilmstrip: Story = {
  name: 'Without Filmstrip',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Text size="sm" style={{ fontWeight: 500 }}>
        Compact Preview
      </Text>
      <AnimationPreview
        frames={WALK_FRAMES}
        previewSize={{ width: 96, height: 96 }}
        showFilmstrip={false}
      />
      <Text size="xs" style={{ color: 'var(--forge-text-muted)' }}>
        Filmstrip hidden — use step buttons or play/pause only
      </Text>
    </div>
  ),
}

export const RectangularPreview: Story = {
  name: 'Rectangular Preview',
  render: () => {
    const wideFrames = [
      { src: makeFrame('#06b6d4', '1', 64), duration: 200 },
      { src: makeFrame('#0891b2', '2', 64), duration: 200 },
      { src: makeFrame('#0e7490', '3', 64), duration: 200 },
    ]
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Text size="sm" style={{ fontWeight: 500 }}>
          Wide Preview Area
        </Text>
        <AnimationPreview
          frames={wideFrames}
          previewSize={{ width: 256, height: 96 }}
          showMetadata
        />
      </div>
    )
  },
}
