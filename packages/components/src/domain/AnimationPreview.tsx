import { useState, useRef, useCallback, useEffect, useId } from 'react'
import { cn } from '../lib/cn.js'
import { Button } from '../primitives/Button.js'
import { Select } from '../forms/Select.js'

export interface AnimationFrame {
  /** Image source — URL or data URI */
  src: string
  /** Frame duration in milliseconds */
  duration: number
}

export interface AnimationPreviewProps {
  /** Ordered list of animation frames */
  frames: AnimationFrame[]
  /** Whether the animation loops (default: true) */
  loop?: boolean
  /** Auto-play on mount (default: true) */
  autoPlay?: boolean
  /** Initial playback speed multiplier (default: 1) */
  speed?: number
  /** Available speed options (default: [0.25, 0.5, 1, 2, 4]) */
  speedOptions?: number[]
  /** Preview area dimensions in pixels */
  previewSize?: number | { width: number; height: number }
  /** Show filmstrip below preview (default: true) */
  showFilmstrip?: boolean
  /** Show total duration and effective FPS (default: false) */
  showMetadata?: boolean
  /** Called on every frame change regardless of source */
  onFrameChange?: (index: number) => void
  /** Called when play/pause state changes */
  onPlayStateChange?: (playing: boolean) => void
  className?: string
  style?: React.CSSProperties
}

const DEFAULT_SPEED_OPTIONS = [0.25, 0.5, 1, 2, 4]

export function AnimationPreview({
  frames,
  loop = true,
  autoPlay = true,
  speed: initialSpeed = 1,
  speedOptions = DEFAULT_SPEED_OPTIONS,
  previewSize,
  showFilmstrip = true,
  showMetadata = false,
  onFrameChange,
  onPlayStateChange,
  className,
  style,
}: AnimationPreviewProps) {
  const isSingleFrame = frames.length <= 1
  const [currentFrame, setCurrentFrame] = useState(0)
  const [playing, setPlaying] = useState(autoPlay && !isSingleFrame)
  const [speed, setSpeed] = useState(initialSpeed)

  const speedSelectId = useId()

  // Refs for the rAF loop — avoids effect restarts on every state change
  const rafRef = useRef(0)
  const currentFrameRef = useRef(currentFrame)
  const speedRef = useRef(speed)
  const framesRef = useRef(frames)
  const loopRef = useRef(loop)
  const onFrameChangeRef = useRef(onFrameChange)
  const onPlayStateChangeRef = useRef(onPlayStateChange)

  currentFrameRef.current = currentFrame
  speedRef.current = speed
  framesRef.current = frames
  loopRef.current = loop
  onFrameChangeRef.current = onFrameChange
  onPlayStateChangeRef.current = onPlayStateChange

  // Reset to frame 0 when frames array identity changes
  const prevFramesRef = useRef(frames)
  useEffect(() => {
    if (prevFramesRef.current !== frames) {
      prevFramesRef.current = frames
      setCurrentFrame(0)
    }
  }, [frames])

  // ---- rAF playback loop ----
  useEffect(() => {
    if (!playing || isSingleFrame) return

    let lastTime = 0
    let accumulator = 0

    const tick = (timestamp: number) => {
      if (lastTime === 0) {
        lastTime = timestamp
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      const delta = timestamp - lastTime
      lastTime = timestamp
      accumulator += delta

      const fr = framesRef.current
      const idx = Math.min(currentFrameRef.current, fr.length - 1)
      const frame = fr[idx]
      if (!frame) return
      const frameDuration = frame.duration / speedRef.current

      if (accumulator >= frameDuration) {
        accumulator %= frameDuration
        const next = idx + 1
        let newIdx: number
        if (next >= fr.length) {
          if (loopRef.current) {
            newIdx = 0
          } else {
            setPlaying(false)
            onPlayStateChangeRef.current?.(false)
            return
          }
        } else {
          newIdx = next
        }
        setCurrentFrame(newIdx)
        onFrameChangeRef.current?.(newIdx)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [playing, isSingleFrame])

  // ---- Callbacks ----
  const togglePlay = useCallback(() => {
    const next = !playing
    setPlaying(next)
    onPlayStateChange?.(next)
  }, [playing, onPlayStateChange])

  const stepFrame = useCallback(
    (direction: 1 | -1) => {
      if (playing) {
        setPlaying(false)
        onPlayStateChange?.(false)
      }
      setCurrentFrame((prev) => {
        const next = loop
          ? (prev + direction + frames.length) % frames.length
          : Math.max(0, Math.min(frames.length - 1, prev + direction))
        onFrameChange?.(next)
        return next
      })
    },
    [playing, loop, frames.length, onFrameChange, onPlayStateChange],
  )

  const jumpToFrame = useCallback(
    (index: number) => {
      if (playing) {
        setPlaying(false)
        onPlayStateChange?.(false)
      }
      setCurrentFrame(index)
      onFrameChange?.(index)
    },
    [playing, onFrameChange, onPlayStateChange],
  )

  const handleSpeedChange = useCallback((value: string) => {
    setSpeed(parseFloat(value))
  }, [])

  // ---- Derived values ----
  const previewWidth = typeof previewSize === 'number' ? previewSize : (previewSize?.width ?? 128)
  const previewHeight = typeof previewSize === 'number' ? previewSize : (previewSize?.height ?? 128)

  const totalDuration = frames.reduce((sum, f) => sum + f.duration, 0)
  const avgFrameDuration = totalDuration / frames.length
  const effectiveFps = avgFrameDuration > 0 ? (1000 / avgFrameDuration) * speed : 0

  const speedSelectOptions = speedOptions.map((s) => ({
    value: String(s),
    label: `${s}×`,
  }))

  const currentSrc = frames[currentFrame]?.src ?? ''

  return (
    <div
      className={cn('forge-animation-preview', className)}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        backgroundColor: 'var(--forge-surface)',
        border: '1px solid var(--forge-border)',
        borderRadius: 'var(--forge-radius-lg)',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Preview area */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: `${previewWidth}px`,
          height: `${previewHeight}px`,
          backgroundColor: 'var(--forge-surface-sunken)',
        }}
      >
        <img
          src={currentSrc}
          alt={`Animation frame ${currentFrame + 1} of ${frames.length}`}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            imageRendering: 'pixelated',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Controls — hidden for single-frame */}
      {!isSingleFrame && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--forge-space-2)',
            padding: `var(--forge-space-2) var(--forge-space-3)`,
            borderTop: '1px solid var(--forge-border)',
            backgroundColor: 'var(--forge-surface)',
          }}
        >
          <Button
            variant="ghost"
            size="sm"
            aria-label={playing ? 'Pause' : 'Play'}
            onClick={togglePlay}
          >
            {playing ? '⏸' : '▶'}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            aria-label="Previous frame"
            onClick={() => stepFrame(-1)}
          >
            ◀
          </Button>

          <span
            aria-live="polite"
            style={{
              fontSize: 'var(--forge-font-size-sm)',
              fontFamily: 'var(--forge-font-mono)',
              color: 'var(--forge-text)',
              minWidth: '40px',
              textAlign: 'center',
            }}
          >
            {currentFrame + 1} / {frames.length}
          </span>

          <Button variant="ghost" size="sm" aria-label="Next frame" onClick={() => stepFrame(1)}>
            ▶
          </Button>

          <label
            htmlFor={speedSelectId}
            style={{
              fontSize: 'var(--forge-font-size-xs)',
              color: 'var(--forge-text-muted)',
              marginLeft: 'auto',
            }}
          >
            Speed
          </label>
          <div style={{ width: '72px' }}>
            <Select
              id={speedSelectId}
              options={speedSelectOptions}
              value={String(speed)}
              onValueChange={handleSpeedChange}
              size="sm"
            />
          </div>
        </div>
      )}

      {/* Metadata */}
      {!isSingleFrame && showMetadata && (
        <div
          style={{
            display: 'flex',
            gap: 'var(--forge-space-3)',
            padding: `var(--forge-space-1) var(--forge-space-3) var(--forge-space-2)`,
            fontSize: 'var(--forge-font-size-xs)',
            color: 'var(--forge-text-muted)',
            fontFamily: 'var(--forge-font-mono)',
          }}
        >
          <span>{totalDuration}ms total</span>
          <span>{effectiveFps.toFixed(1)} fps</span>
        </div>
      )}

      {/* Filmstrip */}
      {!isSingleFrame && showFilmstrip && (
        <div
          role="group"
          aria-label="Animation frames"
          style={{
            display: 'flex',
            gap: 'var(--forge-space-1)',
            padding: 'var(--forge-space-2)',
            borderTop: '1px solid var(--forge-border)',
            backgroundColor: 'var(--forge-surface-sunken)',
            overflowX: 'auto',
          }}
        >
          {frames.map((frame, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Jump to frame ${i + 1}`}
              aria-current={i === currentFrame ? 'true' : undefined}
              onClick={() => jumpToFrame(i)}
              style={{
                flex: '0 0 auto',
                width: '40px',
                height: '40px',
                padding: '2px',
                border: `2px solid ${i === currentFrame ? 'var(--forge-accent)' : 'transparent'}`,
                borderRadius: 'var(--forge-radius-sm)',
                backgroundColor: 'var(--forge-surface)',
                cursor: 'pointer',
                outline: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onFocus={(e) => {
                e.currentTarget.style.outline =
                  'var(--forge-focus-ring-width) solid var(--forge-focus-ring-color)'
                e.currentTarget.style.outlineOffset = 'var(--forge-focus-ring-offset)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.outline = 'none'
              }}
            >
              <img
                src={frame.src}
                alt=""
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  imageRendering: 'pixelated',
                  pointerEvents: 'none',
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
