import type { Meta, StoryObj } from '@storybook/react'
import { InpaintMaskPainter, Stack, Text, Badge, Slider, Group } from '@forgeui/components'
import { useState, useRef } from 'react'

const meta: Meta = {
  title: 'Domain/InpaintMaskPainter',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Brush-based binary mask painting over a source tile image. Paint regions for AI inpainting, export mask as ImageData. Designed for pixel art tile editing workflows.',
      },
    },
  },
}
export default meta
type Story = StoryObj

/** Creates a simple checkerboard ImageData for demo purposes */
function makeCheckerboard(size: number, cellSize: number): ImageData {
  const data = new ImageData(size, size)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4
      const isLight = (Math.floor(x / cellSize) + Math.floor(y / cellSize)) % 2 === 0
      const v = isLight ? 100 : 60
      data.data[i] = v
      data.data[i + 1] = isLight ? v + 20 : v
      data.data[i + 2] = v
      data.data[i + 3] = 255
    }
  }
  return data
}

/**
 * Default painter with a 32×32 checkerboard source.
 * Click and drag to paint mask regions.
 */
export const Default: Story = {
  render: function DefaultStory() {
    const source = useRef(makeCheckerboard(32, 4)).current
    return <InpaintMaskPainter source={source} size={256} />
  },
}

/**
 * Interactive demo with tool switching, brush size control, and mask output preview.
 */
export const Interactive: Story = {
  render: function InteractiveStory() {
    const source = useRef(makeCheckerboard(64, 8)).current
    const [tool, setTool] = useState<'paint' | 'erase'>('paint')
    const [brushSize, setBrushSize] = useState(4)
    const [maskPixels, setMaskPixels] = useState(0)

    function handleMaskChange(mask: ImageData) {
      let count = 0
      for (let i = 0; i < mask.data.length; i += 4) {
        if ((mask.data[i] as number) > 0) count++
      }
      setMaskPixels(count)
    }

    return (
      <Stack gap="md">
        <Group gap="sm" align="center">
          <button
            onClick={() => setTool('paint')}
            style={{
              padding: '4px 12px',
              backgroundColor:
                tool === 'paint' ? 'var(--forge-color-primary)' : 'var(--forge-surface-2)',
              color: 'var(--forge-color-text)',
              border: '1px solid var(--forge-border)',
              borderRadius: 'var(--forge-radius-sm)',
              cursor: 'pointer',
            }}
          >
            🖌️ Paint
          </button>
          <button
            onClick={() => setTool('erase')}
            style={{
              padding: '4px 12px',
              backgroundColor:
                tool === 'erase' ? 'var(--forge-color-primary)' : 'var(--forge-surface-2)',
              color: 'var(--forge-color-text)',
              border: '1px solid var(--forge-border)',
              borderRadius: 'var(--forge-radius-sm)',
              cursor: 'pointer',
            }}
          >
            ⌫ Erase
          </button>
          <Badge variant="outline">{maskPixels} px masked</Badge>
        </Group>
        <Group gap="sm" align="center">
          <Text size="sm">Brush: {brushSize}px</Text>
          <Slider
            value={[brushSize]}
            onValueChange={(v) => setBrushSize(v[0] as number)}
            min={1}
            max={16}
            step={1}
            style={{ width: 120 }}
          />
        </Group>
        <InpaintMaskPainter
          source={source}
          size={320}
          tool={tool}
          brushSize={brushSize}
          onMaskChange={handleMaskChange}
        />
      </Stack>
    )
  },
}

/**
 * Custom mask color — blue overlay instead of default red.
 */
export const CustomColor: Story = {
  render: function CustomColorStory() {
    const source = useRef(makeCheckerboard(32, 4)).current
    return <InpaintMaskPainter source={source} size={256} maskColor="rgba(0, 100, 255, 0.5)" />
  },
}

/**
 * Large brush for quick masking.
 */
export const LargeBrush: Story = {
  render: function LargeBrushStory() {
    const source = useRef(makeCheckerboard(32, 4)).current
    return <InpaintMaskPainter source={source} size={256} brushSize={8} />
  },
}

/**
 * Mask-only view (source image hidden).
 */
export const MaskOnly: Story = {
  render: function MaskOnlyStory() {
    const source = useRef(makeCheckerboard(32, 4)).current
    return <InpaintMaskPainter source={source} size={256} showSource={false} />
  },
}
