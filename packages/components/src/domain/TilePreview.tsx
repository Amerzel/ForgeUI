import { useRef, useEffect, useState, useCallback } from 'react'
import { cn } from '../lib/cn.js'

export type TileSource = ImageData | HTMLCanvasElement | ImageBitmap | string | null

export interface TilePreviewProps {
  /** ImageData, HTMLCanvasElement, ImageBitmap, URL string, or null */
  source: TileSource
  /** Display size in CSS pixels (tile is scaled to fit) */
  size: number
  /** Optional label overlay (e.g., "MS-3") */
  label?: string
  /** Show pixel grid at high zoom levels */
  showGrid?: boolean
  /** Border style */
  border?: 'none' | 'default' | 'selected' | 'error'
  /** Background for transparent areas */
  background?: 'checkerboard' | 'black' | 'white' | 'none'
  /** Click handler */
  onClick?: () => void
  /** Hover handler */
  onHover?: (hovering: boolean) => void
  className?: string
  style?: React.CSSProperties
}

const CHECKER_SIZE = 8

function drawCheckerboard(ctx: CanvasRenderingContext2D, w: number, h: number, cellSize: number) {
  ctx.fillStyle = '#2a2a2a'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#3a3a3a'
  for (let y = 0; y < h; y += cellSize) {
    for (let x = 0; x < w; x += cellSize) {
      if (((x / cellSize + y / cellSize) | 0) % 2 === 0) {
        ctx.fillRect(x, y, cellSize, cellSize)
      }
    }
  }
}

function drawPixelGrid(ctx: CanvasRenderingContext2D, w: number, h: number, scale: number) {
  if (scale < 4) return // only show grid at 4x+ zoom
  const srcW = Math.round(w / scale)
  const srcH = Math.round(h / scale)

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
  ctx.lineWidth = 0.5
  ctx.beginPath()
  for (let x = 0; x <= srcW; x++) {
    const px = x * scale
    ctx.moveTo(px, 0)
    ctx.lineTo(px, h)
  }
  for (let y = 0; y <= srcH; y++) {
    const py = y * scale
    ctx.moveTo(0, py)
    ctx.lineTo(w, py)
  }
  ctx.stroke()
}

function getSourceDimensions(source: Exclude<TileSource, string | null>): {
  width: number
  height: number
} {
  if (source instanceof ImageData) {
    return { width: source.width, height: source.height }
  }
  if (source instanceof HTMLCanvasElement) {
    return { width: source.width, height: source.height }
  }
  // ImageBitmap
  return { width: source.width, height: source.height }
}

const BORDER_COLORS: Record<string, string> = {
  none: 'transparent',
  default: 'var(--forge-border)',
  selected: 'var(--forge-accent)',
  error: 'var(--forge-danger)',
}

export function TilePreview({
  source,
  size,
  label,
  showGrid = false,
  border = 'default',
  background = 'checkerboard',
  onClick,
  onHover,
  className,
  style,
}: TilePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loadedBitmap, setLoadedBitmap] = useState<ImageBitmap | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  // Load string source (URL) → ImageBitmap
  useEffect(() => {
    if (typeof source !== 'string') {
      setLoadedBitmap(null)
      setLoading(false)
      setError(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(false)

    fetch(source)
      .then((res) => res.blob())
      .then((blob) => createImageBitmap(blob))
      .then((bmp) => {
        if (!cancelled) {
          setLoadedBitmap(bmp)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true)
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [source])

  // Resolve the actual renderable source
  const renderSource: Exclude<TileSource, string | null> | null =
    typeof source === 'string' ? loadedBitmap : source

  // Draw the canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const canvasSize = size * dpr
    canvas.width = canvasSize
    canvas.height = canvasSize

    ctx.clearRect(0, 0, canvasSize, canvasSize)

    // Background
    if (background === 'checkerboard') {
      drawCheckerboard(ctx, canvasSize, canvasSize, CHECKER_SIZE * dpr)
    } else if (background === 'black') {
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, canvasSize, canvasSize)
    } else if (background === 'white') {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvasSize, canvasSize)
    }

    if (!renderSource) {
      // Placeholder for null source
      ctx.fillStyle = 'var(--forge-text-muted)'
      ctx.font = `${12 * dpr}px sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = '#666666'
      ctx.fillText('No tile', canvasSize / 2, canvasSize / 2)
      return
    }

    const { width: srcW, height: srcH } = getSourceDimensions(renderSource)

    // Nearest-neighbor scaling
    ctx.imageSmoothingEnabled = false

    if (renderSource instanceof ImageData) {
      // ImageData → temporary canvas → draw scaled
      const tmp = new OffscreenCanvas(srcW, srcH)
      const tmpCtx = tmp.getContext('2d')
      if (tmpCtx) {
        tmpCtx.putImageData(renderSource, 0, 0)
        ctx.drawImage(tmp, 0, 0, canvasSize, canvasSize)
      }
    } else {
      ctx.drawImage(renderSource, 0, 0, canvasSize, canvasSize)
    }

    // Pixel grid overlay
    if (showGrid) {
      const scale = canvasSize / srcW
      drawPixelGrid(ctx, canvasSize, canvasSize, scale)
    }
  }, [renderSource, size, showGrid, background])

  const interactive = !!onClick
  const borderColor = BORDER_COLORS[border] ?? BORDER_COLORS['default']

  const handleMouseEnter = useCallback(() => onHover?.(true), [onHover])
  const handleMouseLeave = useCallback(() => onHover?.(false), [onHover])

  return (
    <div
      className={cn('forge-tile-preview', className)}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick?.()
              }
            }
          : undefined
      }
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: 'var(--forge-radius-sm)',
        border: border !== 'none' ? `2px solid ${borderColor}` : undefined,
        overflow: 'hidden',
        cursor: interactive ? 'pointer' : 'default',
        flexShrink: 0,
        outline: 'none',
        boxShadow:
          border === 'selected'
            ? '0 0 0 2px color-mix(in srgb, var(--forge-accent) 30%, transparent)'
            : undefined,
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: size,
          height: size,
          imageRendering: 'pixelated',
        }}
      />

      {/* Loading indicator */}
      {loading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--forge-surface)',
            color: 'var(--forge-text-muted)',
            fontSize: 'var(--forge-font-size-xs)',
          }}
        >
          Loading…
        </div>
      )}

      {/* Error state */}
      {error && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--forge-surface)',
            color: 'var(--forge-danger)',
            fontSize: 'var(--forge-font-size-xs)',
          }}
        >
          Error
        </div>
      )}

      {/* Label overlay */}
      {label && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            textAlign: 'center',
            padding: '2px var(--forge-space-1)',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: '#ffffff',
            fontSize: size <= 48 ? '9px' : 'var(--forge-font-size-xs)',
            fontFamily: 'var(--forge-font-mono)',
            lineHeight: 1.3,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            pointerEvents: 'none',
          }}
        >
          {label}
        </div>
      )}
    </div>
  )
}
