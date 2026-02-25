import { useState, useRef, useCallback, useEffect } from 'react'
import { cn } from '../lib/cn.js'

export interface TimelineClip {
  id: string
  start: number
  duration: number
  label?: string
  color?: string
}

export interface TimelineTrack {
  id: string
  label: string
  clips: TimelineClip[]
}

interface TimelineProps {
  tracks: TimelineTrack[]
  currentTime: number
  duration: number
  onSeek?: (time: number) => void
  onClipChange?: (trackId: string, clip: TimelineClip) => void
  /** Pixels per second. Default: 80 */
  zoom?: number
  onZoomChange?: (zoom: number) => void
  className?: string
}

const TRACK_HEIGHT = 40
const HEADER_WIDTH = 120
const RULER_HEIGHT = 28
const MIN_ZOOM = 10
const MAX_ZOOM = 400

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  const f = Math.floor((seconds % 1) * 10)
  return `${m}:${String(s).padStart(2, '0')}.${f}`
}

function Ruler({ duration, zoom, scrollLeft }: { duration: number; zoom: number; scrollLeft: number }) {
  const totalWidth = duration * zoom
  // Tick interval: aim for ~60-80px between ticks
  const rawInterval = 80 / zoom
  const intervals = [0.1, 0.2, 0.5, 1, 2, 5, 10, 30, 60]
  const interval = intervals.find(i => i >= rawInterval) ?? 60

  const ticks: number[] = []
  for (let t = 0; t <= duration + interval; t += interval) {
    ticks.push(Math.round(t * 100) / 100)
  }

  return (
    <svg
      width={totalWidth}
      height={RULER_HEIGHT}
      style={{ display: 'block', overflow: 'visible' }}
      aria-hidden="true"
    >
      {ticks.map(t => {
        const x = t * zoom
        const isMajor = (t % (interval * 5)) < 0.001
        return (
          <g key={t} transform={`translate(${x}, 0)`}>
            <line x1={0} y1={RULER_HEIGHT - (isMajor ? 12 : 6)} x2={0} y2={RULER_HEIGHT} stroke="var(--forge-border)" strokeWidth={1} />
            {isMajor && (
              <text x={3} y={RULER_HEIGHT - 14} fontSize="10" fill="var(--forge-text-muted)" fontFamily="var(--forge-font-mono)">
                {formatTime(t)}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

interface ClipBlockProps {
  clip: TimelineClip
  zoom: number
  trackHeight: number
  onDragEnd: (start: number) => void
  onResizeEnd: (duration: number) => void
}

function ClipBlock({ clip, zoom, trackHeight, onDragEnd, onResizeEnd }: ClipBlockProps) {
  const dragRef = useRef<{ startX: number; originalStart: number } | null>(null)
  const resizeRef = useRef<{ startX: number; originalDuration: number } | null>(null)

  const handleDragPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = { startX: e.clientX, originalStart: clip.start }
  }

  const handleDragPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return
    const delta = (e.clientX - dragRef.current.startX) / zoom
    const newStart = Math.max(0, dragRef.current.originalStart + delta)
    // Visual feedback only — committed on pointer up
    ;(e.currentTarget as HTMLDivElement).style.transform = `translateX(${(newStart - clip.start) * zoom}px)`
  }

  const handleDragPointerUp = (e: React.PointerEvent) => {
    if (!dragRef.current) return
    const delta = (e.clientX - dragRef.current.startX) / zoom
    const newStart = Math.max(0, dragRef.current.originalStart + delta)
    ;(e.currentTarget as HTMLDivElement).style.transform = ''
    onDragEnd(newStart)
    dragRef.current = null
  }

  const handleResizePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    resizeRef.current = { startX: e.clientX, originalDuration: clip.duration }
  }

  const handleResizePointerMove = (e: React.PointerEvent) => {
    if (!resizeRef.current) return
    // propagation handled on wrapper
  }

  const handleResizePointerUp = (e: React.PointerEvent) => {
    if (!resizeRef.current) return
    const delta = (e.clientX - resizeRef.current.startX) / zoom
    const newDur = Math.max(0.1, resizeRef.current.originalDuration + delta)
    onResizeEnd(newDur)
    resizeRef.current = null
  }

  const clipColor = clip.color ?? 'var(--forge-accent)'

  return (
    <div
      aria-label={`Clip: ${clip.label ?? clip.id}`}
      style={{
        position: 'absolute',
        left: `${clip.start * zoom}px`,
        width: `${clip.duration * zoom}px`,
        top: '4px',
        bottom: '4px',
        backgroundColor: `color-mix(in srgb, ${clipColor} 25%, transparent)`,
        border: `1px solid ${clipColor}`,
        borderRadius: 'var(--forge-radius-sm)',
        overflow: 'hidden',
        cursor: 'grab',
        userSelect: 'none',
        touchAction: 'none',
      }}
      onPointerDown={handleDragPointerDown}
      onPointerMove={handleDragPointerMove}
      onPointerUp={handleDragPointerUp}
    >
      {/* Label */}
      {clip.label && (
        <span style={{
          display: 'block',
          padding: '2px var(--forge-space-1-5)',
          fontSize: 'var(--forge-font-size-xs)',
          color: clipColor,
          fontFamily: 'var(--forge-font-sans)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          pointerEvents: 'none',
        }}>
          {clip.label}
        </span>
      )}

      {/* Resize handle — visual only, pointer events only */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '6px',
          cursor: 'col-resize',
          backgroundColor: clipColor,
          opacity: 0.4,
        }}
        onPointerDown={handleResizePointerDown}
        onPointerMove={handleResizePointerMove}
        onPointerUp={handleResizePointerUp}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.8' }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.4' }}
      />
    </div>
  )
}

export function Timeline({
  tracks,
  currentTime,
  duration,
  onSeek,
  onClipChange,
  zoom: initialZoom = 80,
  onZoomChange,
  className,
}: TimelineProps) {
  const [zoom, setZoom] = useState(initialZoom)
  const scrollRef = useRef<HTMLDivElement>(null)
  const playheadRef = useRef<HTMLDivElement>(null)

  const totalWidth = duration * zoom

  const handleZoom = useCallback((newZoom: number) => {
    const clamped = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom))
    setZoom(clamped)
    onZoomChange?.(clamped)
  }, [onZoomChange])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      handleZoom(zoom * (e.deltaY < 0 ? 1.15 : 0.87))
    }
  }, [zoom, handleZoom])

  const handleRulerClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
    const clickX = e.clientX - rect.left + (scrollRef.current.scrollLeft)
    const time = Math.max(0, Math.min(duration, clickX / zoom))
    onSeek?.(time)
  }, [zoom, duration, onSeek])

  // Keep playhead visible
  useEffect(() => {
    if (playheadRef.current && scrollRef.current) {
      const x = currentTime * zoom
      const { scrollLeft, clientWidth } = scrollRef.current
      if (x < scrollLeft || x > scrollLeft + clientWidth - 20) {
        scrollRef.current.scrollLeft = x - clientWidth / 2
      }
    }
  }, [currentTime, zoom])

  return (
    <div
      className={cn('forge-timeline', className)}
      aria-label="Timeline editor"
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--forge-bg)',
        border: '1px solid var(--forge-border)',
        borderRadius: 'var(--forge-radius-lg)',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--forge-space-3)',
        padding: `var(--forge-space-2) var(--forge-space-3)`,
        borderBottom: '1px solid var(--forge-border)',
        backgroundColor: 'var(--forge-surface)',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 'var(--forge-font-size-sm)', fontFamily: 'var(--forge-font-mono)', color: 'var(--forge-text)', minWidth: '60px' }}>
          {formatTime(currentTime)}
        </span>
        <span style={{ fontSize: 'var(--forge-font-size-xs)', color: 'var(--forge-text-muted)', marginLeft: 'auto' }}>
          Zoom:
        </span>
        <button
          type="button"
          aria-label="Zoom out"
          onClick={() => handleZoom(zoom * 0.75)}
          style={{ background: 'none', border: '1px solid var(--forge-border)', borderRadius: 'var(--forge-radius-sm)', cursor: 'pointer', color: 'var(--forge-text-muted)', padding: '2px 6px', fontSize: 'var(--forge-font-size-sm)' }}
        >−</button>
        <span style={{ fontSize: 'var(--forge-font-size-xs)', fontFamily: 'var(--forge-font-mono)', color: 'var(--forge-text-muted)', minWidth: '40px', textAlign: 'center' }}>
          {Math.round(zoom)}
        </span>
        <button
          type="button"
          aria-label="Zoom in"
          onClick={() => handleZoom(zoom * 1.33)}
          style={{ background: 'none', border: '1px solid var(--forge-border)', borderRadius: 'var(--forge-radius-sm)', cursor: 'pointer', color: 'var(--forge-text-muted)', padding: '2px 6px', fontSize: 'var(--forge-font-size-sm)' }}
        >+</button>
      </div>

      {/* Main area */}
      <div style={{ display: 'flex', flex: '1 1 auto', minHeight: 0, overflow: 'hidden' }}>
        {/* Track labels */}
        <div style={{
          flexShrink: 0,
          width: `${HEADER_WIDTH}px`,
          borderRight: '1px solid var(--forge-border)',
          backgroundColor: 'var(--forge-surface)',
        }}>
          {/* Ruler placeholder */}
          <div style={{ height: `${RULER_HEIGHT}px`, borderBottom: '1px solid var(--forge-border)' }} />
          {tracks.map(track => (
            <div
              key={track.id}
              style={{
                height: `${TRACK_HEIGHT}px`,
                display: 'flex',
                alignItems: 'center',
                padding: `0 var(--forge-space-3)`,
                borderBottom: '1px solid var(--forge-border)',
                fontSize: 'var(--forge-font-size-sm)',
                color: 'var(--forge-text)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {track.label}
            </div>
          ))}
        </div>

        {/* Scrollable track area */}
        <div
          ref={scrollRef}
          style={{ flex: '1 1 auto', overflow: 'auto', position: 'relative' }}
          onWheel={handleWheel}
        >
          <div style={{ width: `${totalWidth}px`, position: 'relative' }}>
            {/* Ruler */}
            <div
              style={{ height: `${RULER_HEIGHT}px`, borderBottom: '1px solid var(--forge-border)', position: 'sticky', top: 0, zIndex: 2, backgroundColor: 'var(--forge-surface)', cursor: 'pointer' }}
              onClick={handleRulerClick}
            >
              <Ruler duration={duration} zoom={zoom} scrollLeft={scrollRef.current?.scrollLeft ?? 0} />
            </div>

            {/* Tracks */}
            {tracks.map(track => (
              <div
                key={track.id}
                style={{
                  height: `${TRACK_HEIGHT}px`,
                  borderBottom: '1px solid var(--forge-border)',
                  position: 'relative',
                  backgroundColor: 'var(--forge-bg)',
                }}
              >
                {track.clips.map(clip => (
                  <ClipBlock
                    key={clip.id}
                    clip={clip}
                    zoom={zoom}
                    trackHeight={TRACK_HEIGHT}
                    onDragEnd={(start) => onClipChange?.(track.id, { ...clip, start })}
                    onResizeEnd={(duration) => onClipChange?.(track.id, { ...clip, duration })}
                  />
                ))}
              </div>
            ))}

            {/* Playhead */}
            <div
              ref={playheadRef}
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: `${currentTime * zoom}px`,
                width: '2px',
                backgroundColor: 'var(--forge-danger)',
                zIndex: 3,
                pointerEvents: 'none',
              }}
            >
              <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--forge-danger)', borderRadius: '50%', transform: 'translate(-3px, 0)' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
