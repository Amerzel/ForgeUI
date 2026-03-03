import { useState, useRef, useCallback, useEffect } from 'react'
import { cn } from '../lib/cn.js'

type ColorFormat = 'hex' | 'rgb' | 'hsl'

interface RGB {
  r: number
  g: number
  b: number
  a: number
}
interface HSV {
  h: number
  s: number
  v: number
  a: number
}

interface ColorPickerProps {
  value?: string
  onChange?: (value: string) => void
  format?: ColorFormat
  /** Preset swatch colors */
  swatches?: string[]
  /** Show alpha channel */
  alpha?: boolean
  disabled?: boolean
  className?: string
}

// ---------------------------------------------------------------------------
// Color conversion utilities
// ---------------------------------------------------------------------------

function hexToRgb(hex: string): RGB {
  const clean = hex.replace('#', '')
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean.length === 8
        ? clean
        : clean.padEnd(8, 'ff')
  const n = parseInt(full, 16)
  return {
    r: (n >>> 24) & 0xff,
    g: (n >>> 16) & 0xff,
    b: (n >>> 8) & 0xff,
    a: (n & 0xff) / 255,
  }
}

function rgbToHex({ r, g, b, a }: RGB, showAlpha: boolean): string {
  const toHex = (n: number) =>
    Math.round(Math.max(0, Math.min(255, n)))
      .toString(16)
      .padStart(2, '0')
  const alphaHex = showAlpha ? toHex(Math.round(a * 255)) : ''
  return `#${toHex(r)}${toHex(g)}${toHex(b)}${alphaHex}`
}

function rgbToHsv({ r, g, b, a }: RGB): HSV {
  const rr = r / 255,
    gg = g / 255,
    bb = b / 255
  const max = Math.max(rr, gg, bb),
    min = Math.min(rr, gg, bb)
  const d = max - min
  let h = 0
  const s = max === 0 ? 0 : d / max
  const v = max
  if (d !== 0) {
    if (max === rr) h = ((gg - bb) / d + (gg < bb ? 6 : 0)) / 6
    else if (max === gg) h = ((bb - rr) / d + 2) / 6
    else h = ((rr - gg) / d + 4) / 6
  }
  return { h: h * 360, s, v, a }
}

function hsvToRgb({ h, s, v, a }: HSV): RGB {
  const hh = h / 60
  const i = Math.floor(hh)
  const f = hh - i
  const p = v * (1 - s)
  const q = v * (1 - f * s)
  const t = v * (1 - (1 - f) * s)
  let r = 0,
    g = 0,
    b = 0
  switch (i % 6) {
    case 0:
      r = v
      g = t
      b = p
      break
    case 1:
      r = q
      g = v
      b = p
      break
    case 2:
      r = p
      g = v
      b = t
      break
    case 3:
      r = p
      g = q
      b = v
      break
    case 4:
      r = t
      g = p
      b = v
      break
    case 5:
      r = v
      g = p
      b = q
      break
  }
  return { r: r * 255, g: g * 255, b: b * 255, a }
}

function rgbToHsl({ r, g, b, a: _a }: RGB): string {
  const rr = r / 255,
    gg = g / 255,
    bb = b / 255
  const max = Math.max(rr, gg, bb),
    min = Math.min(rr, gg, bb)
  const l = (max + min) / 2
  let h = 0,
    s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === rr) h = ((gg - bb) / d + (gg < bb ? 6 : 0)) / 6
    else if (max === gg) h = ((bb - rr) / d + 2) / 6
    else h = ((rr - gg) / d + 4) / 6
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
}

function parseColor(value?: string): HSV {
  if (!value) return { h: 210, s: 0.8, v: 0.9, a: 1 }
  try {
    if (value.startsWith('#')) {
      return rgbToHsv(hexToRgb(value))
    }
    // fallback
    return { h: 210, s: 0.8, v: 0.9, a: 1 }
  } catch {
    return { h: 210, s: 0.8, v: 0.9, a: 1 }
  }
}

function formatOutput(hsv: HSV, format: ColorFormat, alpha: boolean): string {
  const rgb = hsvToRgb(hsv)
  if (format === 'hsl') return rgbToHsl(rgb)
  if (format === 'rgb') {
    const { r, g, b, a } = rgb
    return alpha
      ? `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a.toFixed(2)})`
      : `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`
  }
  return rgbToHex(rgb, alpha)
}

// ---------------------------------------------------------------------------
// Draggable 2D picker
// ---------------------------------------------------------------------------
function SaturationPicker({
  hsv,
  onChange,
}: {
  hsv: HSV
  onChange: (s: number, v: number) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const getCoords = (e: PointerEvent | React.PointerEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return { s: 0, v: 0 }
    const s = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const v = Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height))
    return { s, v }
  }

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
    const { s, v } = getCoords(e)
    onChange(s, v)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return
    const { s, v } = getCoords(e)
    onChange(s, v)
  }

  const onPointerUp = () => {
    dragging.current = false
  }

  const thumbX = `${hsv.s * 100}%`
  const thumbY = `${(1 - hsv.v) * 100}%`

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Color saturation and brightness"
      style={{
        position: 'relative',
        width: '100%',
        height: '160px',
        borderRadius: 'var(--forge-radius-sm)',
        background: `
          linear-gradient(to bottom, transparent, black),
          linear-gradient(to right, white, hsl(${hsv.h}, 100%, 50%))
        `,
        cursor: 'crosshair',
        userSelect: 'none',
        touchAction: 'none',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <div
        style={{
          position: 'absolute',
          left: thumbX,
          top: thumbY,
          transform: 'translate(-50%, -50%)',
          width: '14px',
          height: '14px',
          borderRadius: '50%',
          border: '2px solid white',
          boxShadow: '0 0 2px rgba(0,0,0,0.5)',
          pointerEvents: 'none',
          backgroundColor: `hsl(${hsv.h}, ${hsv.s * 100}%, ${hsv.v * (1 - hsv.s / 2) * 100}%)`,
        }}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// 1D slider
// ---------------------------------------------------------------------------
function Slider1D({
  value,
  onChange,
  gradient,
  ariaLabel,
}: {
  value: number
  onChange: (v: number) => void
  gradient: string
  ariaLabel: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const getVal = (e: PointerEvent | React.PointerEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return 0
    return Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  }

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
    onChange(getVal(e))
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return
    onChange(getVal(e))
  }
  const onPointerUp = () => {
    dragging.current = false
  }

  return (
    <div
      ref={ref}
      role="slider"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
      tabIndex={0}
      style={{
        position: 'relative',
        height: '12px',
        borderRadius: 'var(--forge-radius-full)',
        background: gradient,
        cursor: 'pointer',
        userSelect: 'none',
        touchAction: 'none',
        outline: 'none',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onFocus={(e) => {
        e.currentTarget.style.outline =
          'var(--forge-focus-ring-width) solid var(--forge-focus-ring-color)'
        e.currentTarget.style.outlineOffset = 'var(--forge-focus-ring-offset)'
      }}
      onBlur={(e) => {
        e.currentTarget.style.outline = 'none'
      }}
      onKeyDown={(e) => {
        const step = e.shiftKey ? 0.1 : 0.01
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          e.preventDefault()
          onChange(Math.min(1, value + step))
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          e.preventDefault()
          onChange(Math.max(0, value - step))
        }
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: `${value * 100}%`,
          transform: 'translate(-50%, -50%)',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          backgroundColor: 'white',
          border: '1px solid rgba(0,0,0,0.25)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// ColorPicker
// ---------------------------------------------------------------------------
export function ColorPicker({
  value,
  onChange,
  format = 'hex',
  swatches = [],
  alpha = false,
  disabled = false,
  className,
}: ColorPickerProps) {
  const [hsv, setHsv] = useState<HSV>(() => parseColor(value))
  const [hexInput, setHexInput] = useState(value ?? '#3b82f6')

  // Sync incoming value
  useEffect(() => {
    if (value) {
      const parsed = parseColor(value)
      setHsv(parsed)
      setHexInput(rgbToHex(hsvToRgb(parsed), alpha))
    }
  }, [value, alpha])

  const emitChange = useCallback(
    (newHsv: HSV) => {
      const output = formatOutput(newHsv, format, alpha)
      onChange?.(output)
      setHexInput(rgbToHex(hsvToRgb(newHsv), alpha))
    },
    [format, alpha, onChange],
  )

  const previewColor = `hsl(${hsv.h}, ${hsv.s * 100}%, ${hsv.v * (100 - hsv.s * 50)}%)`

  return (
    <div
      aria-label="Color picker"
      className={cn('forge-color-picker', className)}
      style={
        {
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--forge-space-3)',
          padding: 'var(--forge-space-3)',
          backgroundColor: 'var(--forge-surface)',
          border: '1px solid var(--forge-border)',
          borderRadius: 'var(--forge-radius-lg)',
          width: '240px',
          opacity: disabled ? 0.6 : 1,
          pointerEvents: disabled ? 'none' : undefined,
          userSelect: 'none',
        } as React.CSSProperties
      }
    >
      {/* Saturation/Value picker */}
      <SaturationPicker
        hsv={hsv}
        onChange={(s, v) => {
          const next = { ...hsv, s, v }
          setHsv(next)
          emitChange(next)
        }}
      />

      <div style={{ display: 'flex', gap: 'var(--forge-space-2)', alignItems: 'center' }}>
        {/* Preview swatch */}
        <div
          aria-hidden="true"
          style={{
            width: '28px',
            height: '28px',
            flexShrink: 0,
            borderRadius: 'var(--forge-radius-sm)',
            backgroundColor: previewColor,
            border: '1px solid var(--forge-border)',
          }}
        />

        {/* Sliders */}
        <div
          style={{
            flex: '1 1 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--forge-space-2)',
          }}
        >
          {/* Hue slider */}
          <Slider1D
            value={hsv.h / 360}
            onChange={(h) => {
              const next = { ...hsv, h: h * 360 }
              setHsv(next)
              emitChange(next)
            }}
            gradient="linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)"
            ariaLabel="Hue"
          />

          {/* Alpha slider */}
          {alpha && (
            <Slider1D
              value={hsv.a}
              onChange={(a) => {
                const next = { ...hsv, a }
                setHsv(next)
                emitChange(next)
              }}
              gradient={`linear-gradient(to right, transparent, ${previewColor})`}
              ariaLabel="Opacity"
            />
          )}
        </div>
      </div>

      {/* Hex/text input */}
      <input
        type="text"
        value={hexInput}
        aria-label="Color value"
        style={{
          width: '100%',
          padding: `var(--forge-space-1-5) var(--forge-space-2)`,
          border: '1px solid var(--forge-border)',
          borderRadius: 'var(--forge-radius-sm)',
          backgroundColor: 'var(--forge-bg)',
          color: 'var(--forge-text)',
          fontSize: 'var(--forge-font-size-sm)',
          fontFamily: 'var(--forge-font-mono)',
          outline: 'none',
          boxSizing: 'border-box',
        }}
        onChange={(e) => setHexInput(e.target.value)}
        onBlur={() => {
          try {
            const parsed = parseColor(hexInput)
            setHsv(parsed)
            emitChange(parsed)
          } catch {
            // ignore invalid input
          }
        }}
        onFocus={(e) => {
          e.currentTarget.style.outline =
            'var(--forge-focus-ring-width) solid var(--forge-focus-ring-color)'
          e.currentTarget.style.outlineOffset = 'var(--forge-focus-ring-offset)'
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
        }}
      />

      {/* Swatches */}
      {swatches.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--forge-space-1)' }}>
          {swatches.map((swatch) => (
            <button
              key={swatch}
              type="button"
              aria-label={`Select color ${swatch}`}
              onClick={() => {
                const parsed = parseColor(swatch)
                setHsv(parsed)
                emitChange(parsed)
              }}
              style={{
                width: '20px',
                height: '20px',
                borderRadius: 'var(--forge-radius-sm)',
                backgroundColor: swatch,
                border:
                  swatch === value
                    ? '2px solid var(--forge-accent)'
                    : '1px solid var(--forge-border)',
                cursor: 'pointer',
                padding: 0,
                outline: 'none',
              }}
              onFocus={(e) => {
                e.currentTarget.style.outline =
                  'var(--forge-focus-ring-width) solid var(--forge-focus-ring-color)'
                e.currentTarget.style.outlineOffset = 'var(--forge-focus-ring-offset)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.outline = 'none'
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
