import { useState, useRef, useCallback, useEffect } from 'react'
import { cn } from '../lib/cn.js'

export interface CanvasViewport {
  x: number
  y: number
  zoom: number
}

export interface CanvasItem {
  id: string
  x: number
  y: number
  width: number
  height: number
  children?: React.ReactNode
}

interface VirtualCanvasProps {
  items: CanvasItem[]
  viewport?: CanvasViewport
  onViewportChange?: (viewport: CanvasViewport) => void
  onItemChange?: (item: CanvasItem) => void
  /** Show dot grid. Default: true */
  grid?: boolean
  /** Grid cell size in canvas units. Default: 32 */
  gridSize?: number
  /** Min zoom level. Default: 0.1 */
  minZoom?: number
  /** Max zoom level. Default: 4 */
  maxZoom?: number
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

const MIN_ZOOM_DEFAULT = 0.1
const MAX_ZOOM_DEFAULT = 4

export function VirtualCanvas({
  items,
  viewport: controlledViewport,
  onViewportChange,
  onItemChange,
  grid = true,
  gridSize = 32,
  minZoom = MIN_ZOOM_DEFAULT,
  maxZoom = MAX_ZOOM_DEFAULT,
  className,
  style,
  children,
}: VirtualCanvasProps) {
  const [internalViewport, setInternalViewport] = useState<CanvasViewport>({ x: 0, y: 0, zoom: 1 })
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [dragState, setDragState] = useState<{ id: string; startX: number; startY: number; originalX: number; originalY: number } | null>(null)
  const [panState, setPanState] = useState<{ startX: number; startY: number; originalPanX: number; originalPanY: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const viewport = controlledViewport ?? internalViewport
  const setViewport = useCallback((next: CanvasViewport) => {
    if (controlledViewport === undefined) setInternalViewport(next)
    onViewportChange?.(next)
  }, [controlledViewport, onViewportChange])

  // Pan with middle-mouse or space+drag
  const handleCanvasPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      e.preventDefault()
      e.currentTarget.setPointerCapture(e.pointerId)
      setPanState({ startX: e.clientX, startY: e.clientY, originalPanX: viewport.x, originalPanY: viewport.y })
      setSelectedId(null)
    }
  }, [viewport])

  const handleCanvasPointerMove = useCallback((e: React.PointerEvent) => {
    if (panState) {
      const dx = e.clientX - panState.startX
      const dy = e.clientY - panState.startY
      setViewport({ ...viewport, x: panState.originalPanX + dx, y: panState.originalPanY + dy })
    }
  }, [panState, viewport, setViewport])

  const handleCanvasPointerUp = useCallback(() => {
    setPanState(null)
  }, [])

  // Zoom with wheel
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!containerRef.current) return
    e.preventDefault()
    const rect = containerRef.current.getBoundingClientRect()
    const cursorX = e.clientX - rect.left
    const cursorY = e.clientY - rect.top

    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89
    const newZoom = Math.max(minZoom, Math.min(maxZoom, viewport.zoom * zoomFactor))
    const scale = newZoom / viewport.zoom

    // Zoom towards cursor
    const newX = cursorX - scale * (cursorX - viewport.x)
    const newY = cursorY - scale * (cursorY - viewport.y)
    setViewport({ x: newX, y: newY, zoom: newZoom })
  }, [viewport, minZoom, maxZoom, setViewport])

  // Item drag
  const handleItemPointerDown = useCallback((e: React.PointerEvent, item: CanvasItem) => {
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    setSelectedId(item.id)
    setDragState({ id: item.id, startX: e.clientX, startY: e.clientY, originalX: item.x, originalY: item.y })
  }, [])

  const handleItemPointerMove = useCallback((e: React.PointerEvent, item: CanvasItem) => {
    if (!dragState || dragState.id !== item.id) return
    const dx = (e.clientX - dragState.startX) / viewport.zoom
    const dy = (e.clientY - dragState.startY) / viewport.zoom
    onItemChange?.({ ...item, x: dragState.originalX + dx, y: dragState.originalY + dy })
  }, [dragState, viewport.zoom, onItemChange])

  const handleItemPointerUp = useCallback(() => {
    setDragState(null)
  }, [])

  // Grid dots rendered via CSS background-image
  const gridDotSize = 1.5
  const gridSpacing = gridSize * viewport.zoom
  const dotX = (viewport.x % gridSpacing + gridSpacing) % gridSpacing
  const dotY = (viewport.y % gridSpacing + gridSpacing) % gridSpacing

  return (
    <div
      ref={containerRef}
      role="application"
      aria-label="Pannable canvas"
      className={cn('forge-virtual-canvas', className)}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '400px',
        overflow: 'hidden',
        backgroundColor: 'var(--forge-bg)',
        cursor: panState ? 'grabbing' : 'default',
        borderRadius: 'var(--forge-radius-lg)',
        border: '1px solid var(--forge-border)',
        touchAction: 'none',
        ...style,
      }}
      onPointerDown={handleCanvasPointerDown}
      onPointerMove={handleCanvasPointerMove}
      onPointerUp={handleCanvasPointerUp}
      onWheel={handleWheel}
    >
      {/* Grid background */}
      {grid && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            backgroundImage: `radial-gradient(circle, var(--forge-border) ${gridDotSize}px, transparent ${gridDotSize}px)`,
            backgroundSize: `${gridSpacing}px ${gridSpacing}px`,
            backgroundPosition: `${dotX}px ${dotY}px`,
          }}
        />
      )}

      {/* Canvas transform layer */}
      <div
        style={{
          position: 'absolute',
          left: viewport.x,
          top: viewport.y,
          transformOrigin: '0 0',
          transform: `scale(${viewport.zoom})`,
          willChange: 'transform',
        }}
      >
        {/* Render items */}
        {items.map(item => (
          <div
            key={item.id}
            data-canvas-item-id={item.id}
            data-selected={selectedId === item.id ? 'true' : undefined}
            style={{
              position: 'absolute',
              left: item.x,
              top: item.y,
              width: item.width,
              height: item.height,
              cursor: dragState?.id === item.id ? 'grabbing' : 'grab',
              outline: selectedId === item.id ? `2px solid var(--forge-accent)` : undefined,
              outlineOffset: '1px',
              borderRadius: 'var(--forge-radius-sm)',
              userSelect: 'none',
              touchAction: 'none',
            }}
            onPointerDown={(e) => handleItemPointerDown(e, item)}
            onPointerMove={(e) => handleItemPointerMove(e, item)}
            onPointerUp={handleItemPointerUp}
          >
            {item.children}
          </div>
        ))}

        {/* Slot for additional canvas content */}
        {children}
      </div>

      {/* Zoom level indicator */}
      <div
        aria-label={`Zoom: ${Math.round(viewport.zoom * 100)}%`}
        style={{
          position: 'absolute',
          bottom: 'var(--forge-space-3)',
          right: 'var(--forge-space-3)',
          backgroundColor: 'var(--forge-surface)',
          border: '1px solid var(--forge-border)',
          borderRadius: 'var(--forge-radius-sm)',
          padding: `var(--forge-space-1) var(--forge-space-2)`,
          fontSize: 'var(--forge-font-size-xs)',
          fontFamily: 'var(--forge-font-mono)',
          color: 'var(--forge-text-muted)',
          pointerEvents: 'none',
        }}
      >
        {Math.round(viewport.zoom * 100)}%
      </div>

      {/* Reset viewport button */}
      <button
        type="button"
        aria-label="Reset viewport"
        onClick={() => setViewport({ x: 0, y: 0, zoom: 1 })}
        style={{
          position: 'absolute',
          bottom: 'var(--forge-space-3)',
          left: 'var(--forge-space-3)',
          backgroundColor: 'var(--forge-surface)',
          border: '1px solid var(--forge-border)',
          borderRadius: 'var(--forge-radius-sm)',
          padding: `var(--forge-space-1) var(--forge-space-2)`,
          fontSize: 'var(--forge-font-size-xs)',
          fontFamily: 'var(--forge-font-sans)',
          color: 'var(--forge-text-muted)',
          cursor: 'pointer',
          outline: 'none',
        }}
        onFocus={(e) => { e.currentTarget.style.outline = 'var(--forge-focus-ring-width) solid var(--forge-focus-ring-color)'; e.currentTarget.style.outlineOffset = 'var(--forge-focus-ring-offset)' }}
        onBlur={(e) => { e.currentTarget.style.outline = 'none' }}
      >
        Reset
      </button>
    </div>
  )
}
