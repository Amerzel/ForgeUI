import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { HeatMapOverlay } from '@forgeui/components'
import type { HeatMapColorMap } from '@forgeui/components'

const meta: Meta<typeof HeatMapOverlay> = {
  title: 'Domain/HeatMapOverlay',
  component: HeatMapOverlay,
}
export default meta

type Story = StoryObj<typeof HeatMapOverlay>

/* ---------- helpers ---------- */
function generateScalarGrid(
  w: number,
  h: number,
  fn: (x: number, y: number) => number,
): number[][] {
  return Array.from({ length: h }, (_, y) =>
    Array.from({ length: w }, (_, x) => fn(x / (w - 1), y / (h - 1))),
  )
}

// Radial gradient — high at edges (seam regions), low at center
const seamData = generateScalarGrid(64, 64, (x, y) => {
  const dx = x - 0.5
  const dy = y - 0.5
  return Math.sqrt(dx * dx + dy * dy) * 2
})

// Diagonal gradient
const diagonalData = generateScalarGrid(64, 64, (x, y) => (x + y) / 2)

/* ---------- stories ---------- */
export const Viridis: Story = {
  args: {
    scalarData: seamData,
    width: 64,
    height: 64,
    colorMap: 'viridis',
    opacity: 0.8,
    style: { width: 256, height: 256, imageRendering: 'pixelated' },
  },
}

export const RedGreen: Story = {
  args: {
    scalarData: seamData,
    width: 64,
    height: 64,
    colorMap: 'red-green',
    opacity: 0.8,
    style: { width: 256, height: 256, imageRendering: 'pixelated' },
  },
}

export const WithThreshold: Story = {
  args: {
    scalarData: seamData,
    width: 64,
    height: 64,
    colorMap: 'red-green',
    opacity: 0.8,
    threshold: 0.4,
    style: { width: 256, height: 256, imageRendering: 'pixelated' },
  },
}

export const ColorMapComparison: Story = {
  render: function ColorMapDemo() {
    const [opacity, setOpacity] = useState(0.8)
    const maps: HeatMapColorMap[] = ['viridis', 'red-green', 'hot', 'cool']
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--forge-space-3)' }}>
        <label style={{ color: 'var(--forge-text)', fontSize: 'var(--forge-font-size-sm)' }}>
          Opacity: {opacity.toFixed(1)}
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            style={{ marginLeft: 'var(--forge-space-2)' }}
          />
        </label>
        <div style={{ display: 'flex', gap: 'var(--forge-space-4)' }}>
          {maps.map((cm) => (
            <div key={cm} style={{ textAlign: 'center' }}>
              <HeatMapOverlay
                scalarData={diagonalData}
                width={64}
                height={64}
                colorMap={cm}
                opacity={opacity}
                style={{ width: 128, height: 128, imageRendering: 'pixelated' }}
              />
              <div
                style={{
                  color: 'var(--forge-text-muted)',
                  fontSize: 'var(--forge-font-size-xs)',
                  marginTop: 'var(--forge-space-1)',
                }}
              >
                {cm}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
}

export const OverlayOnTile: Story = {
  render: function OverlayDemo() {
    return (
      <div
        style={{
          position: 'relative',
          width: 256,
          height: 256,
          backgroundColor: 'var(--forge-surface-raised)',
          border: '1px solid var(--forge-border)',
          borderRadius: 'var(--forge-radius-md)',
        }}
      >
        {/* Simulated tile background */}
        <div
          style={{
            width: '100%',
            height: '100%',
            background:
              'repeating-conic-gradient(var(--forge-surface) 0% 25%, var(--forge-surface-raised) 0% 50%) 0 0 / 32px 32px',
          }}
        />
        {/* Heat map overlay */}
        <HeatMapOverlay
          scalarData={seamData}
          width={64}
          height={64}
          colorMap="red-green"
          opacity={0.5}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            imageRendering: 'pixelated',
          }}
        />
      </div>
    )
  },
}
