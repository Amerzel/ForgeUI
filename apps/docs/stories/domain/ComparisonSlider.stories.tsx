import type { Meta, StoryObj } from '@storybook/react'
import { ComparisonSlider, Text } from '@forgeui/components'

const meta: Meta = {
  title: 'Domain/ComparisonSlider',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Before/after image comparison with a draggable divider. Keyboard-accessible with arrow keys.',
      },
    },
    layout: 'fullscreen',
  },
}
export default meta
type Story = StoryObj

const BEFORE_IMAGE =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="320">
    <rect width="512" height="320" fill="#1e293b"/>
    <text x="256" y="140" font-size="24" fill="#64748b" text-anchor="middle">Before</text>
    <text x="256" y="180" font-size="14" fill="#475569" text-anchor="middle">Low resolution · No filtering</text>
    <rect x="80" y="220" width="100" height="60" rx="4" fill="#334155"/>
    <rect x="200" y="220" width="100" height="60" rx="4" fill="#334155"/>
    <rect x="320" y="220" width="100" height="60" rx="4" fill="#334155"/>
  </svg>`,
  )

const AFTER_IMAGE =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="320">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#312e81"/>
        <stop offset="100%" stop-color="#1e1b4b"/>
      </linearGradient>
    </defs>
    <rect width="512" height="320" fill="url(#g)"/>
    <text x="256" y="140" font-size="24" fill="#a5b4fc" text-anchor="middle">After</text>
    <text x="256" y="180" font-size="14" fill="#818cf8" text-anchor="middle">Upscaled · Enhanced · Filtered</text>
    <rect x="80" y="220" width="100" height="60" rx="8" fill="#4338ca" opacity="0.8"/>
    <rect x="200" y="220" width="100" height="60" rx="8" fill="#4338ca" opacity="0.8"/>
    <rect x="320" y="220" width="100" height="60" rx="8" fill="#4338ca" opacity="0.8"/>
  </svg>`,
  )

export const BeforeAfter: Story = {
  name: 'Before / After',
  render: () => (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Text size="sm" style={{ fontWeight: 500 }}>
        Texture Upscale Comparison
      </Text>
      <ComparisonSlider
        before={BEFORE_IMAGE}
        after={AFTER_IMAGE}
        beforeLabel="Original low-res texture"
        afterLabel="AI upscaled texture"
        style={{ height: '320px', borderRadius: 'var(--forge-radius-md)', overflow: 'hidden' }}
      />
      <Text size="xs" style={{ color: 'var(--forge-text-muted)' }}>
        Drag the divider or use ← → arrow keys to compare
      </Text>
    </div>
  ),
}
