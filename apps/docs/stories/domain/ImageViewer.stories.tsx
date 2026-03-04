import type { Meta, StoryObj } from '@storybook/react'
import { ImageViewer, Text, Badge } from '@forgeui/components'

const meta: Meta = {
  title: 'Domain/ImageViewer',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Zoom/pan image viewer with pixel-perfect rendering, checkerboard transparency, and keyboard shortcuts.',
      },
    },
    layout: 'fullscreen',
  },
}
export default meta
type Story = StoryObj

// 1×1 red pixel as a data URL for demo
const DEMO_IMAGE =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#6366f1"/>
        <stop offset="50%" stop-color="#06b6d4"/>
        <stop offset="100%" stop-color="#10b981"/>
      </linearGradient>
    </defs>
    <rect width="256" height="256" fill="url(#g)"/>
    <text x="128" y="128" font-size="48" fill="white" text-anchor="middle" dominant-baseline="central">🖼</text>
  </svg>`,
  )

export const BasicViewer: Story = {
  name: 'Basic Viewer',
  render: () => (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Text size="sm" style={{ fontWeight: 500 }}>
          Texture Preview
        </Text>
        <Badge>256 × 256</Badge>
      </div>
      <ImageViewer
        src={DEMO_IMAGE}
        alt="Demo texture"
        checkerboard
        style={{
          height: '400px',
          border: '1px solid var(--forge-border)',
          borderRadius: 'var(--forge-radius-md)',
        }}
      />
      <Text size="xs" style={{ color: 'var(--forge-text-muted)' }}>
        Scroll to zoom · Click and drag to pan · Double-click to fit/1:1 · +/−/0 keys
      </Text>
    </div>
  ),
}

export const PixelArt: Story = {
  name: 'Pixel Art Mode',
  render: () => {
    // 8×8 pixel art sprite as data URL
    const pixelArt =
      'data:image/svg+xml,' +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" shape-rendering="crispEdges">
        <rect x="2" y="0" width="4" height="1" fill="#f97316"/>
        <rect x="1" y="1" width="6" height="1" fill="#f97316"/>
        <rect x="1" y="2" width="1" height="1" fill="#854d0e"/>
        <rect x="2" y="2" width="1" height="1" fill="#fbbf24"/>
        <rect x="3" y="2" width="1" height="1" fill="#854d0e"/>
        <rect x="4" y="2" width="1" height="1" fill="#fbbf24"/>
        <rect x="5" y="2" width="1" height="1" fill="#854d0e"/>
        <rect x="6" y="2" width="1" height="1" fill="#fbbf24"/>
        <rect x="1" y="3" width="6" height="1" fill="#fbbf24"/>
        <rect x="2" y="4" width="4" height="1" fill="#fbbf24"/>
        <rect x="1" y="5" width="2" height="1" fill="#3b82f6"/>
        <rect x="5" y="5" width="2" height="1" fill="#3b82f6"/>
        <rect x="1" y="6" width="2" height="1" fill="#1d4ed8"/>
        <rect x="5" y="6" width="2" height="1" fill="#1d4ed8"/>
        <rect x="1" y="7" width="2" height="1" fill="#854d0e"/>
        <rect x="5" y="7" width="2" height="1" fill="#854d0e"/>
      </svg>`,
      )
    return (
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Text size="sm" style={{ fontWeight: 500 }}>
            Pixel Art Sprite
          </Text>
          <Badge>8 × 8</Badge>
          <Text size="xs" style={{ color: 'var(--forge-text-muted)', marginLeft: 'auto' }}>
            Pixelated rendering preserves crisp edges
          </Text>
        </div>
        <ImageViewer
          src={pixelArt}
          alt="Pixel art character"
          renderMode="pixelated"
          checkerboard
          style={{
            height: '400px',
            border: '1px solid var(--forge-border)',
            borderRadius: 'var(--forge-radius-md)',
          }}
        />
      </div>
    )
  },
}
