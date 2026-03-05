import { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import { cn } from '../lib/cn.js'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface GridTemplate {
  id: string
  label: string
  cols: number
  rows: number
  /** Expected tile classification per cell (optional) */
  cellMap?: Record<string, string>
}

export interface SlicedTile {
  col: number
  row: number
  imageData: ImageData | null
  /** Auto-detected classification */
  autoClass?: string
  /** Confidence score 0-1 */
  confidence?: number
  /** User override */
  manualClass?: string
}

export interface SpritesheetSlicerProps {
  /** Source spritesheet image */
  source: HTMLImageElement | HTMLCanvasElement | ImageBitmap | null
  /** Available grid templates */
  templates: GridTemplate[]
  /** Selected template id */
  selectedTemplate?: string
  /** Tile size in source pixels. Auto-detected if omitted. */
  tileSize?: number
  /** Grid offset from top-left */
  offset?: { x: number; y: number }
  /** Spacing between tiles in source pixels */
  spacing?: number
  /** Template selection callback */
  onTemplateChange?: (templateId: string) => void
  /** Called when slicing is triggered */
  onSlice?: (tiles: SlicedTile[]) => void
  /** Optional classification function */
  classify?: (
    imageData: ImageData,
    col: number,
    row: number,
  ) => { class: string; confidence: number }
  /** Display width in CSS pixels */
  width?: number
  /** Display height in CSS pixels */
  height?: number
  className?: string
  style?: React.CSSProperties
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getSourceSize(source: HTMLImageElement | HTMLCanvasElement | ImageBitmap | null): {
  w: number
  h: number
} {
  if (!source) return { w: 0, h: 0 }
  if (source instanceof HTMLImageElement) return { w: source.naturalWidth, h: source.naturalHeight }
  return { w: source.width, h: source.height }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function SpritesheetSlicer({
  source,
  templates,
  selectedTemplate,
  tileSize: tileSizeProp,
  offset = { x: 0, y: 0 },
  spacing = 0,
  onTemplateChange,
  onSlice,
  classify,
  width = 600,
  height = 400,
  className,
  style,
}: SpritesheetSlicerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredCell, setHoveredCell] = useState<{ col: number; row: number } | null>(null)

  const activeTemplate = useMemo(
    () => templates.find((t) => t.id === selectedTemplate) ?? templates[0],
    [templates, selectedTemplate],
  )

  const srcSize = useMemo(() => getSourceSize(source), [source])

  // Compute tile size from source dimensions and template
  const tileSize = useMemo(() => {
    if (tileSizeProp) return tileSizeProp
    if (!activeTemplate || srcSize.w === 0) return 32
    return Math.floor(
      (srcSize.w - offset.x - (activeTemplate.cols - 1) * spacing) / activeTemplate.cols,
    )
  }, [tileSizeProp, activeTemplate, srcSize.w, offset.x, spacing])

  // Scale factor for display
  const scale = useMemo(() => {
    if (srcSize.w === 0 || srcSize.h === 0) return 1
    return Math.min(width / srcSize.w, height / srcSize.h, 1)
  }, [srcSize.w, srcSize.h, width, height])

  // Draw source + grid overlay
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !source) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const cw = Math.floor(srcSize.w * scale)
    const ch = Math.floor(srcSize.h * scale)
    canvas.width = cw
    canvas.height = ch

    ctx.imageSmoothingEnabled = false
    ctx.clearRect(0, 0, cw, ch)
    ctx.drawImage(source, 0, 0, cw, ch)

    // Draw grid overlay
    if (activeTemplate) {
      ctx.strokeStyle = 'rgba(0, 200, 255, 0.6)'
      ctx.lineWidth = 1
      for (let r = 0; r < activeTemplate.rows; r++) {
        for (let c = 0; c < activeTemplate.cols; c++) {
          const sx = (offset.x + c * (tileSize + spacing)) * scale
          const sy = (offset.y + r * (tileSize + spacing)) * scale
          const sw = tileSize * scale
          const sh = tileSize * scale
          ctx.strokeRect(sx + 0.5, sy + 0.5, sw, sh)

          // Highlight hovered cell
          if (hoveredCell && hoveredCell.col === c && hoveredCell.row === r) {
            ctx.fillStyle = 'rgba(0, 200, 255, 0.2)'
            ctx.fillRect(sx, sy, sw, sh)
          }
        }
      }
    }
  }, [source, activeTemplate, tileSize, offset, spacing, scale, hoveredCell, srcSize])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!activeTemplate) return
      const rect = e.currentTarget.getBoundingClientRect()
      const mx = (e.clientX - rect.left) / scale
      const my = (e.clientY - rect.top) / scale

      for (let r = 0; r < activeTemplate.rows; r++) {
        for (let c = 0; c < activeTemplate.cols; c++) {
          const sx = offset.x + c * (tileSize + spacing)
          const sy = offset.y + r * (tileSize + spacing)
          if (mx >= sx && mx < sx + tileSize && my >= sy && my < sy + tileSize) {
            setHoveredCell({ col: c, row: r })
            return
          }
        }
      }
      setHoveredCell(null)
    },
    [activeTemplate, tileSize, offset, spacing, scale],
  )

  const handleSlice = useCallback(() => {
    if (!source || !activeTemplate || !onSlice) return

    // Draw source to a temp canvas to extract ImageData
    const tmp = document.createElement('canvas')
    tmp.width = srcSize.w
    tmp.height = srcSize.h
    const tmpCtx = tmp.getContext('2d')
    if (!tmpCtx) return

    tmpCtx.drawImage(source, 0, 0)

    const tiles: SlicedTile[] = []
    for (let r = 0; r < activeTemplate.rows; r++) {
      for (let c = 0; c < activeTemplate.cols; c++) {
        const sx = offset.x + c * (tileSize + spacing)
        const sy = offset.y + r * (tileSize + spacing)

        let imageData: ImageData | null = null
        try {
          imageData = tmpCtx.getImageData(sx, sy, tileSize, tileSize)
        } catch {
          // Out of bounds
        }

        const tile: SlicedTile = { col: c, row: r, imageData }

        if (imageData && classify) {
          const result = classify(imageData, c, r)
          tile.autoClass = result.class
          tile.confidence = result.confidence
        }

        // Check cellMap for expected classification
        if (activeTemplate.cellMap) {
          const key = `${c},${r}`
          const expected = activeTemplate.cellMap[key]
          if (expected) {
            tile.manualClass = expected
          }
        }

        tiles.push(tile)
      }
    }

    onSlice(tiles)
  }, [source, activeTemplate, tileSize, offset, spacing, onSlice, classify, srcSize])

  const totalCells = activeTemplate ? activeTemplate.cols * activeTemplate.rows : 0

  return (
    <div
      className={cn('forge-spritesheet-slicer', className)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--forge-space-3)',
        ...style,
      }}
      data-testid="spritesheet-slicer"
    >
      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--forge-space-3)',
          flexWrap: 'wrap',
        }}
      >
        {/* Template selector */}
        <select
          value={activeTemplate?.id ?? ''}
          onChange={(e) => onTemplateChange?.(e.target.value)}
          style={{
            padding: '4px 8px',
            backgroundColor: 'var(--forge-surface-2)',
            color: 'var(--forge-color-text)',
            border: '1px solid var(--forge-border)',
            borderRadius: 'var(--forge-radius-sm)',
            fontSize: 'var(--forge-text-sm)',
          }}
          aria-label="Grid template"
        >
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>

        {/* Info */}
        <span
          style={{
            fontSize: 'var(--forge-text-sm)',
            color: 'var(--forge-color-text-muted)',
          }}
        >
          {tileSize}×{tileSize}px • {totalCells} tiles
        </span>

        {/* Slice button */}
        <button
          onClick={handleSlice}
          disabled={!source}
          style={{
            padding: '4px 12px',
            backgroundColor: source ? 'var(--forge-color-primary)' : 'var(--forge-surface-2)',
            color: 'var(--forge-color-text)',
            border: '1px solid var(--forge-border)',
            borderRadius: 'var(--forge-radius-sm)',
            cursor: source ? 'pointer' : 'not-allowed',
            fontSize: 'var(--forge-text-sm)',
            opacity: source ? 1 : 0.5,
          }}
        >
          Slice
        </button>
      </div>

      {/* Canvas area */}
      <div
        style={{
          position: 'relative',
          backgroundColor: 'var(--forge-surface)',
          border: '1px solid var(--forge-border)',
          borderRadius: 'var(--forge-radius-md)',
          overflow: 'hidden',
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {source ? (
          <canvas
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredCell(null)}
            style={{ imageRendering: 'pixelated', cursor: 'crosshair' }}
          />
        ) : (
          <span
            style={{
              color: 'var(--forge-color-text-muted)',
              fontSize: 'var(--forge-text-sm)',
            }}
          >
            Load a spritesheet to begin
          </span>
        )}
      </div>

      {/* Hover info */}
      {hoveredCell && (
        <div
          style={{
            fontSize: 'var(--forge-text-sm)',
            color: 'var(--forge-color-text-muted)',
          }}
          data-testid="hover-info"
        >
          Cell ({hoveredCell.col}, {hoveredCell.row})
          {activeTemplate?.cellMap?.[`${hoveredCell.col},${hoveredCell.row}`] && (
            <> — {activeTemplate.cellMap[`${hoveredCell.col},${hoveredCell.row}`]}</>
          )}
        </div>
      )}
    </div>
  )
}
