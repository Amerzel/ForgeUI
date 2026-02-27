import { useState, useRef, useCallback, useEffect } from 'react'
import { cn } from '../lib/cn.js'

export interface ImageViewerProps {
  /** Image source URL */
  src: string
  /** Alt text for accessibility */
  alt: string
  /** Rendering mode — 'pixelated' for pixel art, 'smooth' for photographs */
  renderMode?: 'pixelated' | 'smooth'
  /** Minimum zoom level. Default: 0.1 */
  minZoom?: number
  /** Maximum zoom level. Default: 32 */
  maxZoom?: number
  /** Initial zoom level. Default: 'fit' (auto-fit to container) */
  initialZoom?: number | 'fit'
  /** Show zoom controls overlay. Default: true */
  showControls?: boolean
  /** Show checkerboard background for transparency. Default: true */
  checkerboard?: boolean
  /** Toolbar content rendered in top-right corner */
  toolbar?: React.ReactNode
  /** Called when zoom changes */
  onZoomChange?: (zoom: number) => void
  className?: string
  style?: React.CSSProperties
}

const ZOOM_STEP = 1.25

export function ImageViewer({
  src,
  alt,
  renderMode = 'smooth',
  minZoom = 0.1,
  maxZoom = 32,
  initialZoom = 'fit',
  showControls = true,
  checkerboard = true,
  toolbar,
  onZoomChange,
  className,
  style,
}: ImageViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [zoom, setZoomState] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 })
  const [panState, setPanState] = useState<{ startX: number; startY: number; origX: number; origY: number } | null>(null)
  const fitZoomRef = useRef(1)

  const setZoom = useCallback((z: number) => {
    const clamped = Math.max(minZoom, Math.min(maxZoom, z))
    setZoomState(clamped)
    onZoomChange?.(clamped)
  }, [minZoom, maxZoom, onZoomChange])

  // Fit image to container
  const fitToContainer = useCallback(() => {
    const container = containerRef.current
    if (!container || imgSize.w === 0) return
    const cw = container.clientWidth
    const ch = container.clientHeight
    const scale = Math.min(cw / imgSize.w, ch / imgSize.h, 1)
    fitZoomRef.current = scale
    setZoom(scale)
    setPan({
      x: (cw - imgSize.w * scale) / 2,
      y: (ch - imgSize.h * scale) / 2,
    })
  }, [imgSize, setZoom])

  // Load image dimensions
  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      setImgSize({ w: img.naturalWidth, h: img.naturalHeight })
    }
    img.src = src
  }, [src])

  // Initial fit
  useEffect(() => {
    if (imgSize.w === 0) return
    if (initialZoom === 'fit') {
      fitToContainer()
    } else {
      const container = containerRef.current
      if (!container) return
      setZoom(initialZoom)
      setPan({
        x: (container.clientWidth - imgSize.w * initialZoom) / 2,
        y: (container.clientHeight - imgSize.h * initialZoom) / 2,
      })
    }
  }, [imgSize, initialZoom, fitToContainer, setZoom])

  // Scroll to zoom
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const rect = el.getBoundingClientRect()
      const cursorX = e.clientX - rect.left
      const cursorY = e.clientY - rect.top
      const factor = e.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP
      const newZoom = Math.max(minZoom, Math.min(maxZoom, zoom * factor))
      const scale = newZoom / zoom
      setPan(prev => ({
        x: cursorX - scale * (cursorX - prev.x),
        y: cursorY - scale * (cursorY - prev.y),
      }))
      setZoom(newZoom)
    }
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [zoom, minZoom, maxZoom, setZoom])

  // Double-click to toggle fit/1:1
  const handleDoubleClick = useCallback(() => {
    if (Math.abs(zoom - fitZoomRef.current) < 0.01) {
      // Currently at fit → go to 1:1
      const container = containerRef.current
      if (!container) return
      setZoom(1)
      setPan({
        x: (container.clientWidth - imgSize.w) / 2,
        y: (container.clientHeight - imgSize.h) / 2,
      })
    } else {
      fitToContainer()
    }
  }, [zoom, imgSize, fitToContainer, setZoom])

  // Pan with drag
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    setPanState({ startX: e.clientX, startY: e.clientY, origX: pan.x, origY: pan.y })
  }, [pan])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!panState) return
    setPan({
      x: panState.origX + (e.clientX - panState.startX),
      y: panState.origY + (e.clientY - panState.startY),
    })
  }, [panState])

  const handlePointerUp = useCallback(() => {
    setPanState(null)
  }, [])

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const container = containerRef.current
    if (!container) return
    if (e.key === '+' || e.key === '=') {
      e.preventDefault()
      const newZoom = Math.min(maxZoom, zoom * ZOOM_STEP)
      const cw = container.clientWidth / 2
      const ch = container.clientHeight / 2
      const scale = newZoom / zoom
      setPan(prev => ({ x: cw - scale * (cw - prev.x), y: ch - scale * (ch - prev.y) }))
      setZoom(newZoom)
    } else if (e.key === '-') {
      e.preventDefault()
      const newZoom = Math.max(minZoom, zoom / ZOOM_STEP)
      const cw = container.clientWidth / 2
      const ch = container.clientHeight / 2
      const scale = newZoom / zoom
      setPan(prev => ({ x: cw - scale * (cw - prev.x), y: ch - scale * (ch - prev.y) }))
      setZoom(newZoom)
    } else if (e.key === '0') {
      e.preventDefault()
      fitToContainer()
    }
  }, [zoom, minZoom, maxZoom, setZoom, fitToContainer])

  const imageRendering = renderMode === 'pixelated' ? 'pixelated' : 'auto'
  const checkerSize = 12

  return (
    <div
      ref={containerRef}
      className={cn('forge-image-viewer', className)}
      role="application"
      aria-label={`Image viewer: ${alt}`}
      tabIndex={0}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '200px',
        overflow: 'hidden',
        backgroundColor: 'var(--forge-bg)',
        borderRadius: 'var(--forge-radius-lg)',
        border: '1px solid var(--forge-border)',
        cursor: panState ? 'grabbing' : 'grab',
        touchAction: 'none',
        outline: 'none',
        ...style,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
    >
      {/* Checkerboard transparency pattern */}
      {checkerboard && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: pan.x,
            top: pan.y,
            width: imgSize.w * zoom,
            height: imgSize.h * zoom,
            backgroundImage: `
              linear-gradient(45deg, var(--forge-surface) 25%, transparent 25%),
              linear-gradient(-45deg, var(--forge-surface) 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, var(--forge-surface) 75%),
              linear-gradient(-45deg, transparent 75%, var(--forge-surface) 75%)
            `,
            backgroundSize: `${checkerSize}px ${checkerSize}px`,
            backgroundPosition: `0 0, 0 ${checkerSize / 2}px, ${checkerSize / 2}px -${checkerSize / 2}px, -${checkerSize / 2}px 0`,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Image */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        draggable={false}
        style={{
          position: 'absolute',
          left: pan.x,
          top: pan.y,
          width: imgSize.w * zoom,
          height: imgSize.h * zoom,
          imageRendering,
          pointerEvents: 'none',
          willChange: 'transform',
        }}
      />

      {/* Zoom controls */}
      {showControls && (
        <div
          style={{
            position: 'absolute',
            bottom: 'var(--forge-space-3)',
            right: 'var(--forge-space-3)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--forge-space-1)',
            backgroundColor: 'var(--forge-surface)',
            border: '1px solid var(--forge-border)',
            borderRadius: 'var(--forge-radius-sm)',
            padding: `var(--forge-space-1)`,
          }}
        >
          <button
            type="button"
            aria-label="Zoom out"
            onClick={(e) => { e.stopPropagation(); setZoom(zoom / ZOOM_STEP) }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--forge-text-muted)',
              fontSize: 'var(--forge-font-size-sm)',
              padding: '2px 6px',
              borderRadius: 'var(--forge-radius-sm)',
            }}
          >−</button>
          <span
            aria-label={`Zoom: ${Math.round(zoom * 100)}%`}
            style={{
              fontSize: 'var(--forge-font-size-xs)',
              fontFamily: 'var(--forge-font-mono)',
              color: 'var(--forge-text-muted)',
              minWidth: '44px',
              textAlign: 'center',
              userSelect: 'none',
            }}
          >{Math.round(zoom * 100)}%</span>
          <button
            type="button"
            aria-label="Zoom in"
            onClick={(e) => { e.stopPropagation(); setZoom(zoom * ZOOM_STEP) }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--forge-text-muted)',
              fontSize: 'var(--forge-font-size-sm)',
              padding: '2px 6px',
              borderRadius: 'var(--forge-radius-sm)',
            }}
          >+</button>
          <button
            type="button"
            aria-label="Fit to view"
            onClick={(e) => { e.stopPropagation(); fitToContainer() }}
            style={{
              background: 'none',
              border: '1px solid var(--forge-border)',
              cursor: 'pointer',
              color: 'var(--forge-text-muted)',
              fontSize: 'var(--forge-font-size-xs)',
              padding: '2px 6px',
              borderRadius: 'var(--forge-radius-sm)',
              marginLeft: 'var(--forge-space-1)',
            }}
          >Fit</button>
        </div>
      )}

      {/* Toolbar slot */}
      {toolbar && (
        <div
          style={{
            position: 'absolute',
            top: 'var(--forge-space-3)',
            right: 'var(--forge-space-3)',
            display: 'flex',
            gap: 'var(--forge-space-1)',
          }}
        >
          {toolbar}
        </div>
      )}
    </div>
  )
}
