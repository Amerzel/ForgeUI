import { cn } from '../lib/cn.js'
import React, { useRef, useCallback } from 'react'

export interface MiniMapViewport {
  x: number
  y: number
  width: number
  height: number
}

export interface MiniMapProps {
  /** Total content width in logical units */
  contentWidth: number
  /** Total content height in logical units */
  contentHeight: number
  /** Current visible viewport rectangle */
  viewport: MiniMapViewport
  /** Called when viewport is dragged */
  onViewportChange?: (viewport: MiniMapViewport) => void
  /** Content rendered inside the minimap (scaled down) */
  children?: React.ReactNode
  /** Width of the minimap element in pixels */
  width?: number
  /** Height of the minimap element in pixels */
  height?: number
  className?: string
}

export function MiniMap({
  contentWidth,
  contentHeight,
  viewport,
  onViewportChange,
  children,
  width = 200,
  height = 140,
  className,
}: MiniMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)

  const scaleX = width / contentWidth
  const scaleY = height / contentHeight

  // Viewport rect in minimap pixel coordinates
  const vpLeft = viewport.x * scaleX
  const vpTop = viewport.y * scaleY
  const vpWidth = viewport.width * scaleX
  const vpHeight = viewport.height * scaleY

  const positionFromEvent = useCallback(
    (e: React.PointerEvent | PointerEvent) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return null
      const px = e.clientX - rect.left
      const py = e.clientY - rect.top
      return {
        x: px / scaleX - viewport.width / 2,
        y: py / scaleY - viewport.height / 2,
        width: viewport.width,
        height: viewport.height,
      }
    },
    [scaleX, scaleY, viewport.width, viewport.height],
  )

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!onViewportChange) return
      e.preventDefault()
      draggingRef.current = true
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      const vp = positionFromEvent(e)
      if (vp) onViewportChange(vp)
    },
    [onViewportChange, positionFromEvent],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!draggingRef.current || !onViewportChange) return
      const vp = positionFromEvent(e)
      if (vp) onViewportChange(vp)
    },
    [onViewportChange, positionFromEvent],
  )

  const handlePointerUp = useCallback(() => {
    draggingRef.current = false
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn('forge-minimap', className)}
      role="img"
      aria-label="Minimap navigation"
      style={{
        position: 'relative',
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: 'var(--forge-surface)',
        border: '1px solid var(--forge-border)',
        borderRadius: 'var(--forge-radius-sm)',
        overflow: 'hidden',
        cursor: 'crosshair',
        userSelect: 'none',
        touchAction: 'none',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Scaled content */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${contentWidth}px`,
          height: `${contentHeight}px`,
          transform: `scale(${scaleX}, ${scaleY})`,
          transformOrigin: '0 0',
          pointerEvents: 'none',
        }}
      >
        {children}
      </div>

      {/* Viewport rectangle */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: `${vpLeft}px`,
          top: `${vpTop}px`,
          width: `${vpWidth}px`,
          height: `${vpHeight}px`,
          border: '1.5px solid var(--forge-accent)',
          backgroundColor: 'color-mix(in srgb, var(--forge-accent) 10%, transparent)',
          borderRadius: '1px',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
