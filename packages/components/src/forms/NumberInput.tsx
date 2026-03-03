import { useState, useRef, useCallback, useEffect } from 'react'
import { cn } from '../lib/cn.js'

interface NumberInputProps {
  value?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  /** Decimal places to display and round to. Default: 0 */
  precision?: number
  disabled?: boolean
  placeholder?: string
  className?: string
  /** Accessible label — required for standalone use */
  'aria-label'?: string
  id?: string
}

function clamp(val: number, min?: number, max?: number) {
  let v = val
  if (min !== undefined) v = Math.max(min, v)
  if (max !== undefined) v = Math.min(max, v)
  return v
}

function round(val: number, precision: number) {
  const factor = Math.pow(10, precision)
  return Math.round(val * factor) / factor
}

/**
 * Numeric input with stepper +/- buttons and drag-to-adjust interaction.
 * Hold and drag vertically to scrub values. Min/max clamping applied.
 * Uses monospace font for value display.
 */
export function NumberInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  precision = 0,
  disabled,
  placeholder,
  className,
  id,
  'aria-label': ariaLabel,
}: NumberInputProps) {
  const [focused, setFocused] = useState(false)
  const [displayValue, setDisplayValue] = useState(
    value !== undefined ? String(round(value, precision)) : '',
  )
  const dragRef = useRef<{ startY: number; startValue: number } | null>(null)

  useEffect(() => {
    if (!focused) {
      setDisplayValue(value !== undefined ? String(round(value, precision)) : '')
    }
  }, [value, precision, focused])

  const commit = useCallback(
    (raw: string) => {
      const parsed = parseFloat(raw)
      if (!isNaN(parsed)) {
        const clamped = clamp(round(parsed, precision), min, max)
        onChange?.(clamped)
        setDisplayValue(String(clamped))
      } else {
        setDisplayValue(value !== undefined ? String(round(value, precision)) : '')
      }
    },
    [onChange, value, min, max, precision],
  )

  const increment = () => {
    const current = value ?? 0
    onChange?.(clamp(round(current + step, precision), min, max))
  }

  const decrement = () => {
    const current = value ?? 0
    onChange?.(clamp(round(current - step, precision), min, max))
  }

  // Drag-to-adjust: vertical drag on the input scrubs the value
  const handlePointerDown = (e: React.PointerEvent<HTMLInputElement>) => {
    if (disabled || focused) return
    dragRef.current = { startY: e.clientY, startValue: value ?? 0 }
    e.currentTarget.setPointerCapture(e.pointerId)
    e.currentTarget.style.cursor = 'ns-resize'
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLInputElement>) => {
    if (!dragRef.current) return
    const delta = dragRef.current.startY - e.clientY // up = increase
    const newVal = clamp(round(dragRef.current.startValue + delta * step, precision), min, max)
    onChange?.(newVal)
    setDisplayValue(String(newVal))
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLInputElement>) => {
    dragRef.current = null
    e.currentTarget.style.cursor = ''
  }

  const borderColor = focused ? 'var(--forge-accent)' : 'var(--forge-border)'

  return (
    <div
      className={cn('forge-number-input', className)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: '34px',
        backgroundColor: disabled ? 'var(--forge-bg-disabled)' : 'var(--forge-surface)',
        border: `1px solid ${borderColor}`,
        borderRadius: 'var(--forge-radius-md)',
        overflow: 'hidden',
        transition: `border-color var(--forge-duration-fast) var(--forge-easing-default)`,
        boxShadow: focused
          ? `0 0 0 2px color-mix(in srgb, var(--forge-accent) 25%, transparent)`
          : undefined,
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {/* Decrement */}
      <button
        type="button"
        aria-label="Decrease"
        disabled={disabled || (min !== undefined && (value ?? 0) <= min)}
        tabIndex={-1}
        onClick={decrement}
        style={stepButtonStyle}
      >
        −
      </button>

      {/* Input */}
      <input
        id={id}
        type="text"
        inputMode="decimal"
        value={displayValue}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={ariaLabel}
        style={{
          flex: '1 1 auto',
          width: '60px',
          height: '100%',
          textAlign: 'center',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          fontFamily: 'var(--forge-font-mono)',
          fontSize: 'var(--forge-font-size-sm)',
          color: 'var(--forge-text)',
          cursor: disabled ? 'not-allowed' : 'ns-resize',
          userSelect: 'none',
        }}
        onChange={(e) => setDisplayValue(e.target.value)}
        onFocus={(e) => {
          setFocused(true)
          e.currentTarget.style.cursor = 'text'
          e.currentTarget.style.userSelect = 'auto'
        }}
        onBlur={(e) => {
          setFocused(false)
          e.currentTarget.style.cursor = disabled ? 'not-allowed' : 'ns-resize'
          e.currentTarget.style.userSelect = 'none'
          commit(e.currentTarget.value)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.currentTarget.blur()
          }
          if (e.key === 'ArrowUp') {
            e.preventDefault()
            increment()
          }
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            decrement()
          }
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />

      {/* Increment */}
      <button
        type="button"
        aria-label="Increase"
        disabled={disabled || (max !== undefined && (value ?? 0) >= max)}
        tabIndex={-1}
        onClick={increment}
        style={stepButtonStyle}
      >
        +
      </button>
    </div>
  )
}

const stepButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '28px',
  height: '100%',
  flexShrink: 0,
  background: 'transparent',
  border: 'none',
  borderLeft: '1px solid var(--forge-border-subtle)',
  borderRight: '1px solid var(--forge-border-subtle)',
  color: 'var(--forge-text-muted)',
  cursor: 'pointer',
  fontSize: '16px',
  lineHeight: 1,
  userSelect: 'none',
  fontFamily: 'var(--forge-font-mono)',
}
