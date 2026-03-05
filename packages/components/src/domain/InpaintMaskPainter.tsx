import { useRef, useEffect, useCallback, useState } from 'react'
import { cn } from '../lib/cn.js'

type MaskSource = ImageData | HTMLCanvasElement | ImageBitmap

export interface InpaintMaskPainterProps {
  /** Source tile image to paint over */
  source: MaskSource | null
  /** Display size in CSS pixels */
  size: number
  /** Brush size in source pixels. Default: 4 */
  brushSize?: number
  /** Tool mode. Default: 'paint' */
  tool?: 'paint' | 'erase'
  /** Mask overlay color. Default: 'rgba(255, 0, 0, 0.4)' */
  maskColor?: string
  /** Show source image underneath mask. Default: true */
  showSource?: boolean
  /** Nearest-neighbor scaling. Default: true */
  pixelated?: boolean
  /** Called when the mask changes after a stroke */
  onMaskChange?: (mask: ImageData) => void
  /** Called to clear mask externally */
  onClear?: () => void
  className?: string
  style?: React.CSSProperties
}

function getSourceDimensions(source: MaskSource): { w: number; h: number } {
  if (source instanceof HTMLCanvasElement) return { w: source.width, h: source.height }
  if (typeof ImageBitmap !== 'undefined' && source instanceof ImageBitmap)
    return { w: source.width, h: source.height }
  // ImageData (or duck-type with width/height)
  return { w: (source as ImageData).width, h: (source as ImageData).height }
}

export function InpaintMaskPainter({
  source,
  size,
  brushSize = 4,
  tool = 'paint',
  maskColor = 'rgba(255, 0, 0, 0.4)',
  showSource = true,
  pixelated = true,
  onMaskChange,
  className,
  style,
}: InpaintMaskPainterProps) {
  const sourceCanvasRef = useRef<HTMLCanvasElement>(null)
  const maskCanvasRef = useRef<HTMLCanvasElement>(null)
  const maskDataRef = useRef<HTMLCanvasElement | null>(null)
  const [painting, setPainting] = useState(false)
  const lastPosRef = useRef<{ x: number; y: number } | null>(null)

  // Source dimensions
  const srcDims = source ? getSourceDimensions(source) : { w: 64, h: 64 }

  // Draw source image
  useEffect(() => {
    const canvas = sourceCanvasRef.current
    if (!canvas || !source) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, srcDims.w, srcDims.h)
    if (typeof ImageData !== 'undefined' && source instanceof ImageData) {
      ctx.putImageData(source, 0, 0)
    } else {
      ctx.drawImage(source as HTMLCanvasElement | ImageBitmap, 0, 0)
    }
  }, [source, srcDims.w, srcDims.h])

  // Initialize internal mask canvas
  useEffect(() => {
    if (!maskDataRef.current) {
      const c = document.createElement('canvas')
      c.width = srcDims.w
      c.height = srcDims.h
      maskDataRef.current = c
    } else if (
      maskDataRef.current.width !== srcDims.w ||
      maskDataRef.current.height !== srcDims.h
    ) {
      maskDataRef.current.width = srcDims.w
      maskDataRef.current.height = srcDims.h
    }
  }, [srcDims.w, srcDims.h])

  const renderMaskOverlay = useCallback(() => {
    const canvas = maskCanvasRef.current
    const maskCanvas = maskDataRef.current
    if (!canvas || !maskCanvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, srcDims.w, srcDims.h)
    ctx.globalAlpha = 1
    ctx.drawImage(maskCanvas, 0, 0)
  }, [srcDims.w, srcDims.h])

  const toSourceCoords = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const scaleX = srcDims.w / rect.width
      const scaleY = srcDims.h / rect.height
      return {
        x: Math.floor((e.clientX - rect.left) * scaleX),
        y: Math.floor((e.clientY - rect.top) * scaleY),
      }
    },
    [srcDims.w, srcDims.h],
  )

  const paintAt = useCallback(
    (x: number, y: number) => {
      const maskCanvas = maskDataRef.current
      if (!maskCanvas) return
      const ctx = maskCanvas.getContext('2d')
      if (!ctx) return

      const half = Math.floor(brushSize / 2)
      if (tool === 'paint') {
        ctx.fillStyle = maskColor
        ctx.fillRect(x - half, y - half, brushSize, brushSize)
      } else {
        ctx.clearRect(x - half, y - half, brushSize, brushSize)
      }
      renderMaskOverlay()
    },
    [brushSize, tool, maskColor, renderMaskOverlay],
  )

  const paintLine = useCallback(
    (x0: number, y0: number, x1: number, y1: number) => {
      const dx = Math.abs(x1 - x0)
      const dy = Math.abs(y1 - y0)
      const sx = x0 < x1 ? 1 : -1
      const sy = y0 < y1 ? 1 : -1
      let err = dx - dy
      let cx = x0
      let cy = y0

      while (true) {
        paintAt(cx, cy)
        if (cx === x1 && cy === y1) break
        const e2 = 2 * err
        if (e2 > -dy) {
          err -= dy
          cx += sx
        }
        if (e2 < dx) {
          err += dx
          cy += sy
        }
      }
    },
    [paintAt],
  )

  const handlePointerDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      setPainting(true)
      const pos = toSourceCoords(e)
      lastPosRef.current = pos
      paintAt(pos.x, pos.y)
    },
    [toSourceCoords, paintAt],
  )

  const handlePointerMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!painting) return
      const pos = toSourceCoords(e)
      const last = lastPosRef.current
      if (last) {
        paintLine(last.x, last.y, pos.x, pos.y)
      } else {
        paintAt(pos.x, pos.y)
      }
      lastPosRef.current = pos
    },
    [painting, toSourceCoords, paintAt, paintLine],
  )

  const handlePointerUp = useCallback(() => {
    if (!painting) return
    setPainting(false)
    lastPosRef.current = null

    // Export mask
    const maskCanvas = maskDataRef.current
    if (maskCanvas && onMaskChange) {
      const ctx = maskCanvas.getContext('2d')
      if (ctx) {
        const data = ctx.getImageData(0, 0, srcDims.w, srcDims.h)
        // Convert to binary: any non-zero alpha → white, else black
        const binary = new ImageData(srcDims.w, srcDims.h)
        for (let i = 0; i < data.data.length; i += 4) {
          const painted = (data.data[i + 3] as number) > 0 ? 255 : 0
          binary.data[i] = painted
          binary.data[i + 1] = painted
          binary.data[i + 2] = painted
          binary.data[i + 3] = 255
        }
        onMaskChange(binary)
      }
    }
  }, [painting, onMaskChange, srcDims.w, srcDims.h])

  const canvasStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    imageRendering: pixelated ? 'pixelated' : 'auto',
  }

  return (
    <div
      className={cn('forge-inpaint-mask-painter', className)}
      style={{
        position: 'relative',
        width: size,
        height: size,
        backgroundColor: 'var(--forge-surface)',
        border: '1px solid var(--forge-border)',
        borderRadius: 'var(--forge-radius-md)',
        overflow: 'hidden',
        cursor: tool === 'paint' ? 'crosshair' : 'cell',
        userSelect: 'none',
        ...style,
      }}
      role="img"
      aria-label="Inpaint mask painter"
    >
      {/* Source image layer */}
      {showSource && (
        <canvas
          ref={sourceCanvasRef}
          width={srcDims.w}
          height={srcDims.h}
          style={{ ...canvasStyle, opacity: 1 }}
          aria-hidden="true"
        />
      )}

      {/* Mask overlay + interaction layer */}
      <canvas
        ref={maskCanvasRef}
        width={srcDims.w}
        height={srcDims.h}
        style={{ ...canvasStyle, zIndex: 1 }}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        aria-hidden="true"
      />
    </div>
  )
}
