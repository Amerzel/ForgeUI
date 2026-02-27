import { useRef, useCallback, useEffect, useState } from 'react'
import { cn } from '../lib/cn.js'

export interface DrawingCanvasProps {
  /** Background image URL to draw over */
  backgroundImage?: string
  /** Canvas width in pixels */
  width: number
  /** Canvas height in pixels */
  height: number
  /** Current brush tool */
  tool: 'brush' | 'eraser'
  /** Brush radius in pixels */
  brushSize: number
  /** Brush color (default: semi-transparent red for masks) */
  brushColor?: string
  /** Called on every stroke with the current mask as data URL */
  onStroke?: (maskDataUrl: string) => void
  /** Called when drawing completes (pointer up) */
  onDrawEnd?: (maskDataUrl: string) => void
  /** When set to true, clears the canvas (reset after reading) */
  clear?: boolean
  /** When set to true, inverts the mask (reset after reading) */
  invert?: boolean
  className?: string
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export function DrawingCanvas({
  backgroundImage,
  width,
  height,
  tool,
  brushSize,
  brushColor = 'rgba(255, 0, 0, 0.5)',
  onStroke,
  onDrawEnd,
  clear,
  invert,
  className,
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bgCanvasRef = useRef<HTMLCanvasElement>(null)
  const drawingRef = useRef(false)
  const lastPointRef = useRef<{ x: number; y: number } | null>(null)
  const [bgLoaded, setBgLoaded] = useState(false)

  // Load background image
  useEffect(() => {
    if (!backgroundImage || !bgCanvasRef.current) return
    const ctx = bgCanvasRef.current.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.drawImage(img, 0, 0, width, height)
      setBgLoaded(true)
    }
    img.src = backgroundImage
  }, [backgroundImage, width, height])

  // Clear operation
  useEffect(() => {
    if (!clear) return
    const ctx = canvasRef.current?.getContext('2d')
    if (ctx) ctx.clearRect(0, 0, width, height)
  }, [clear, width, height])

  // Invert operation
  useEffect(() => {
    if (!invert) return
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data
    for (let i = 3; i < data.length; i += 4) {
      const alpha = data[i] ?? 0
      data[i] = alpha > 0 ? 0 : 128
      if ((data[i] ?? 0) > 0) {
        data[i - 3] = 255
        data[i - 2] = 0
        data[i - 1] = 0
      }
    }
    ctx.putImageData(imageData, 0, 0)
  }, [invert, width, height])

  const getCanvasPoint = useCallback((e: React.PointerEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    return {
      x: ((e.clientX - rect.left) / rect.width) * width,
      y: ((e.clientY - rect.top) / rect.height) * height,
    }
  }, [width, height])

  const drawCircle = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.beginPath()
    ctx.arc(x, y, brushSize, 0, Math.PI * 2)
    ctx.fill()
  }, [brushSize])

  const drawStroke = useCallback((ctx: CanvasRenderingContext2D, from: { x: number; y: number }, to: { x: number; y: number }) => {
    const dx = to.x - from.x
    const dy = to.y - from.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    // Interpolate points for smooth strokes
    const steps = Math.max(1, Math.ceil(dist / (brushSize * 0.3)))
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      drawCircle(ctx, lerp(from.x, to.x, t), lerp(from.y, to.y, t))
    }
  }, [brushSize, drawCircle])

  const setupContext = useCallback((ctx: CanvasRenderingContext2D) => {
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = brushColor
    }
  }, [tool, brushColor])

  const getMaskDataUrl = useCallback(() => {
    return canvasRef.current?.toDataURL('image/png') ?? ''
  }, [])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const point = getCanvasPoint(e)
    if (!point) return

    e.currentTarget.setPointerCapture(e.pointerId)
    drawingRef.current = true
    lastPointRef.current = point

    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    setupContext(ctx)
    drawCircle(ctx, point.x, point.y)
    onStroke?.(getMaskDataUrl())
  }, [getCanvasPoint, setupContext, drawCircle, onStroke, getMaskDataUrl])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!drawingRef.current) return
    const point = getCanvasPoint(e)
    if (!point) return

    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    setupContext(ctx)

    if (lastPointRef.current) {
      drawStroke(ctx, lastPointRef.current, point)
    } else {
      drawCircle(ctx, point.x, point.y)
    }
    lastPointRef.current = point
    onStroke?.(getMaskDataUrl())
  }, [getCanvasPoint, setupContext, drawStroke, drawCircle, onStroke, getMaskDataUrl])

  const handlePointerUp = useCallback(() => {
    if (!drawingRef.current) return
    drawingRef.current = false
    lastPointRef.current = null
    onDrawEnd?.(getMaskDataUrl())
  }, [onDrawEnd, getMaskDataUrl])

  // Cursor size preview
  const cursorSize = brushSize * 2
  const cursorStyle = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${cursorSize}' height='${cursorSize}'%3E%3Ccircle cx='${brushSize}' cy='${brushSize}' r='${brushSize - 1}' fill='none' stroke='white' stroke-width='1'/%3E%3Ccircle cx='${brushSize}' cy='${brushSize}' r='${brushSize - 1}' fill='none' stroke='black' stroke-width='1' stroke-dasharray='3 3'/%3E%3C/svg%3E") ${brushSize} ${brushSize}, crosshair`

  return (
    <div
      className={cn('forge-drawing-canvas', className)}
      role="application"
      aria-label="Drawing canvas"
      style={{
        position: 'relative',
        width,
        height,
        backgroundColor: 'var(--forge-bg)',
        borderRadius: 'var(--forge-radius-lg)',
        border: '1px solid var(--forge-border)',
        overflow: 'hidden',
        touchAction: 'none',
        cursor: cursorStyle,
      }}
    >
      {/* Background image layer */}
      <canvas
        ref={bgCanvasRef}
        width={width}
        height={height}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />

      {/* Drawing layer */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        data-testid="drawing-layer"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />

      {/* Tool indicator */}
      <div
        aria-label={`Tool: ${tool}, Size: ${brushSize}px`}
        style={{
          position: 'absolute',
          bottom: 'var(--forge-space-2)',
          left: 'var(--forge-space-2)',
          backgroundColor: 'var(--forge-surface)',
          border: '1px solid var(--forge-border)',
          borderRadius: 'var(--forge-radius-sm)',
          padding: `var(--forge-space-1) var(--forge-space-2)`,
          fontSize: 'var(--forge-font-size-xs)',
          fontFamily: 'var(--forge-font-mono)',
          color: 'var(--forge-text-muted)',
          pointerEvents: 'none',
          display: 'flex',
          gap: 'var(--forge-space-2)',
          alignItems: 'center',
        }}
      >
        <span>{tool === 'brush' ? '🖌️' : '🧹'}</span>
        <span>{brushSize}px</span>
      </div>

      {/* Loading state */}
      {backgroundImage && !bgLoaded && (
        <div
          aria-label="Loading background image"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--forge-text-muted)',
            fontSize: 'var(--forge-font-size-sm)',
          }}
        >
          Loading…
        </div>
      )}
    </div>
  )
}
