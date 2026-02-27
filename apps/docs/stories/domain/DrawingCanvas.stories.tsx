import type { Meta, StoryObj } from '@storybook/react'
import { useState, useRef } from 'react'
import { DrawingCanvas, Button, Text, Badge } from '@forgeui/components'
import type { DrawingCanvasHandle } from '@forgeui/components'

const meta: Meta = {
  title: 'Domain/DrawingCanvas',
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Freehand brush/eraser overlay for inpainting masks. Supports smooth stroke interpolation, multiple brush sizes, and mask export.' } },
    layout: 'fullscreen',
  },
}
export default meta
type Story = StoryObj

export const InpaintingMask: Story = {
  name: 'Inpainting Mask',
  render: function DrawingCanvasDemo() {
    const canvasRef = useRef<DrawingCanvasHandle>(null)
    const [tool, setTool] = useState<'brush' | 'eraser'>('brush')
    const [brushSize, setBrushSize] = useState(24)

    return (
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Text size="sm" style={{ fontWeight: 500 }}>Inpainting Mask Editor</Text>
          <Badge>{tool === 'brush' ? 'Brush' : 'Eraser'} · {brushSize}px</Badge>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
            <Button variant={tool === 'brush' ? 'primary' : 'ghost'} size="sm" onClick={() => setTool('brush')}>🖌 Brush</Button>
            <Button variant={tool === 'eraser' ? 'primary' : 'ghost'} size="sm" onClick={() => setTool('eraser')}>◻ Eraser</Button>
            <Button variant="ghost" size="sm" onClick={() => canvasRef.current?.clear()}>🗑 Clear</Button>
            <Button variant="ghost" size="sm" onClick={() => canvasRef.current?.invert()}>◐ Invert</Button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Text size="xs" style={{ color: 'var(--forge-text-muted)' }}>Size:</Text>
          {[8, 16, 24, 48].map(size => (
            <Button key={size} variant={brushSize === size ? 'secondary' : 'ghost'} size="sm" onClick={() => setBrushSize(size)}>
              {size}px
            </Button>
          ))}
        </div>
        <DrawingCanvas
          ref={canvasRef}
          width={640}
          height={400}
          tool={tool}
          brushSize={brushSize}
          brushColor="rgba(255, 0, 0, 0.5)"
          style={{ border: '1px solid var(--forge-border)', borderRadius: 'var(--forge-radius-md)' }}
        />
        <Text size="xs" style={{ color: 'var(--forge-text-muted)' }}>
          Click and drag to paint · Switch between brush and eraser · Use Clear/Invert controls
        </Text>
      </div>
    )
  },
}
