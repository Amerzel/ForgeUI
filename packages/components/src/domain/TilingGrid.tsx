import { useRef, useEffect, useCallback } from 'react'
import { cn } from '../lib/cn.js'

type TileSource = ImageData | HTMLCanvasElement | ImageBitmap | null

export interface TilingGridProps {
  /** Single tile to repeat in every cell */
  source?: TileSource
  /** Per-cell tile callback — overrides source when provided */
  getCellSource?: (col: number, row: number) => ImageBitmap | ImageData | null
  /** Number of columns. Default: 3 */
  cols?: number
  /** Number of rows. Default: 3 */
  rows?: number
  /** Total display size in CSS pixels */
  size: number
  /** Show tile boundary grid lines */
  showBoundaries?: boolean
  /** Optional overlay renderer (e.g., seam heat map) */
  overlay?: (ctx: CanvasRenderingContext2D, tileSize: number, cols: number, rows: number) => void
  /** Nearest-neighbor scaling. Default: true */
  pixelated?: boolean
  className?: string
  style?: React.CSSProperties
}

function drawTileSource(
  ctx: CanvasRenderingContext2D,
  source: TileSource,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
) {
  if (!source) return

  if (source instanceof ImageData) {
    const tmp = new OffscreenCanvas(source.width, source.height)
    const tmpCtx = tmp.getContext('2d')
    if (tmpCtx) {
      tmpCtx.putImageData(source, 0, 0)
      ctx.drawImage(tmp, dx, dy, dw, dh)
    }
  } else {
    ctx.drawImage(source, dx, dy, dw, dh)
  }
}

export function TilingGrid({
  source,
  getCellSource,
  cols = 3,
  rows = 3,
  size,
  showBoundaries = false,
  overlay,
  pixelated = true,
  className,
  style,
}: TilingGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const canvasSize = size * dpr
    canvas.width = canvasSize
    canvas.height = canvasSize

    ctx.clearRect(0, 0, canvasSize, canvasSize)
    ctx.imageSmoothingEnabled = !pixelated

    const tileW = canvasSize / cols
    const tileH = canvasSize / rows

    // Draw tiles
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cellSource = getCellSource ? getCellSource(col, row) : source
        const dx = col * tileW
        const dy = row * tileH
        drawTileSource(ctx, cellSource ?? null, dx, dy, tileW, tileH)
      }
    }

    // Overlay callback
    if (overlay) {
      ctx.save()
      overlay(ctx, tileW / dpr, cols, rows)
      ctx.restore()
    }

    // Boundary lines
    if (showBoundaries) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)'
      ctx.lineWidth = 1
      ctx.setLineDash([4 * dpr, 4 * dpr])
      ctx.beginPath()

      for (let col = 1; col < cols; col++) {
        const x = col * tileW
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvasSize)
      }
      for (let row = 1; row < rows; row++) {
        const y = row * tileH
        ctx.moveTo(0, y)
        ctx.lineTo(canvasSize, y)
      }

      ctx.stroke()
      ctx.setLineDash([])
    }
  }, [source, getCellSource, cols, rows, size, showBoundaries, overlay, pixelated])

  useEffect(() => {
    draw()
  }, [draw])

  return (
    <div
      className={cn('forge-tiling-grid', className)}
      aria-label={`${cols}×${rows} tiling grid`}
      style={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: 'var(--forge-radius-lg)',
        border: '1px solid var(--forge-border)',
        overflow: 'hidden',
        flexShrink: 0,
        backgroundColor: 'var(--forge-bg)',
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: size,
          height: size,
          imageRendering: pixelated ? 'pixelated' : 'auto',
        }}
      />
    </div>
  )
}
