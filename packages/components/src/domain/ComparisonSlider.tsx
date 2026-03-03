import { useState, useRef, useCallback } from 'react'
import { cn } from '../lib/cn.js'

export interface ComparisonSliderProps {
  /** "Before" image URL (left side) */
  before: string
  /** "After" image URL (right side) */
  after: string
  /** Label shown above the before side */
  beforeLabel?: string
  /** Label shown above the after side */
  afterLabel?: string
  /** Initial divider position (0–100). Default: 50 */
  initialPosition?: number
  /** Controlled divider position (0–100) */
  position?: number
  /** Position change callback for controlled mode */
  onPositionChange?: (position: number) => void
  /** Rendering mode — 'pixelated' for pixel art */
  renderMode?: 'pixelated' | 'smooth'
  /** Orientation. Default: 'horizontal' (divider moves left/right) */
  orientation?: 'horizontal' | 'vertical'
  className?: string
  style?: React.CSSProperties
}

export function ComparisonSlider({
  before,
  after,
  beforeLabel,
  afterLabel,
  initialPosition = 50,
  position: controlledPosition,
  onPositionChange,
  renderMode = 'smooth',
  orientation = 'horizontal',
  className,
  style,
}: ComparisonSliderProps) {
  const [internalPos, setInternalPos] = useState(initialPosition)
  const containerRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)

  const pos = controlledPosition ?? internalPos
  const setPos = useCallback(
    (v: number) => {
      const clamped = Math.max(0, Math.min(100, v))
      if (controlledPosition === undefined) setInternalPos(clamped)
      onPositionChange?.(clamped)
    },
    [controlledPosition, onPositionChange],
  )

  const isHorizontal = orientation === 'horizontal'

  const getPositionFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return pos
      if (isHorizontal) {
        return ((clientX - rect.left) / rect.width) * 100
      }
      return ((clientY - rect.top) / rect.height) * 100
    },
    [isHorizontal, pos],
  )

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.currentTarget.setPointerCapture(e.pointerId)
      draggingRef.current = true
      setPos(getPositionFromPointer(e.clientX, e.clientY))
    },
    [getPositionFromPointer, setPos],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!draggingRef.current) return
      setPos(getPositionFromPointer(e.clientX, e.clientY))
    },
    [getPositionFromPointer, setPos],
  )

  const handlePointerUp = useCallback(() => {
    draggingRef.current = false
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const step = 5
      if (isHorizontal) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          setPos(pos - step)
        } else if (e.key === 'ArrowRight') {
          e.preventDefault()
          setPos(pos + step)
        }
      } else {
        if (e.key === 'ArrowUp') {
          e.preventDefault()
          setPos(pos - step)
        } else if (e.key === 'ArrowDown') {
          e.preventDefault()
          setPos(pos + step)
        }
      }
    },
    [pos, setPos, isHorizontal],
  )

  const imageRendering = renderMode === 'pixelated' ? 'pixelated' : 'auto'
  const clipBefore = isHorizontal ? `inset(0 ${100 - pos}% 0 0)` : `inset(0 0 ${100 - pos}% 0)`

  const dividerStyle: React.CSSProperties = isHorizontal
    ? {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: `${pos}%`,
        width: '3px',
        transform: 'translateX(-50%)',
      }
    : {
        position: 'absolute',
        left: 0,
        right: 0,
        top: `${pos}%`,
        height: '3px',
        transform: 'translateY(-50%)',
      }

  const handleStyle: React.CSSProperties = isHorizontal
    ? {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: 'var(--forge-surface)',
        border: '2px solid var(--forge-accent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 'var(--forge-font-size-xs)',
        color: 'var(--forge-accent)',
        boxShadow: 'var(--forge-shadow-md)',
        pointerEvents: 'none',
      }
    : {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: 'var(--forge-surface)',
        border: '2px solid var(--forge-accent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 'var(--forge-font-size-xs)',
        color: 'var(--forge-accent)',
        boxShadow: 'var(--forge-shadow-md)',
        pointerEvents: 'none',
      }

  return (
    <div
      ref={containerRef}
      className={cn('forge-comparison-slider', className)}
      role="slider"
      aria-label="Image comparison slider"
      aria-valuenow={Math.round(pos)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        backgroundColor: 'var(--forge-bg)',
        borderRadius: 'var(--forge-radius-lg)',
        border: '1px solid var(--forge-border)',
        cursor: isHorizontal ? 'col-resize' : 'row-resize',
        touchAction: 'none',
        userSelect: 'none',
        outline: 'none',
        ...style,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onKeyDown={handleKeyDown}
    >
      {/* After image (full, behind) */}
      <img
        src={after}
        alt={afterLabel ?? 'After'}
        draggable={false}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          imageRendering,
          pointerEvents: 'none',
        }}
      />

      {/* Before image (clipped) */}
      <img
        src={before}
        alt={beforeLabel ?? 'Before'}
        draggable={false}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          imageRendering,
          clipPath: clipBefore,
          pointerEvents: 'none',
        }}
      />

      {/* Divider line */}
      <div
        aria-hidden="true"
        style={{
          ...dividerStyle,
          backgroundColor: 'var(--forge-accent)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      >
        {/* Drag handle */}
        <div style={handleStyle}>{isHorizontal ? '⟷' : '⟡'}</div>
      </div>

      {/* Labels */}
      {beforeLabel && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 'var(--forge-space-2)',
            left: 'var(--forge-space-2)',
            backgroundColor: 'var(--forge-surface)',
            border: '1px solid var(--forge-border)',
            borderRadius: 'var(--forge-radius-sm)',
            padding: `var(--forge-space-0-5) var(--forge-space-2)`,
            fontSize: 'var(--forge-font-size-xs)',
            fontFamily: 'var(--forge-font-mono)',
            color: 'var(--forge-text-muted)',
            pointerEvents: 'none',
            zIndex: 3,
          }}
        >
          {beforeLabel}
        </div>
      )}
      {afterLabel && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 'var(--forge-space-2)',
            right: 'var(--forge-space-2)',
            backgroundColor: 'var(--forge-surface)',
            border: '1px solid var(--forge-border)',
            borderRadius: 'var(--forge-radius-sm)',
            padding: `var(--forge-space-0-5) var(--forge-space-2)`,
            fontSize: 'var(--forge-font-size-xs)',
            fontFamily: 'var(--forge-font-mono)',
            color: 'var(--forge-text-muted)',
            pointerEvents: 'none',
            zIndex: 3,
          }}
        >
          {afterLabel}
        </div>
      )}
    </div>
  )
}
