import { useState } from 'react'
import { cn } from '../lib/cn.js'

type InputSize = 'sm' | 'md' | 'lg'
type InputVariant = 'default' | 'filled'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Size preset. Default: 'md' */
  size?: InputSize
  /** Visual variant. Default: 'default' */
  variant?: InputVariant
  /** When true, shows error styling */
  error?: boolean
  /** Icon/element rendered before the input value */
  startAdornment?: React.ReactNode
  /** Icon/element rendered after the input value */
  endAdornment?: React.ReactNode
  /** When true, shows a × button to clear the value (controlled) */
  clearable?: boolean
  /** Called when the clear button is clicked */
  onClear?: () => void
}

const SIZE_STYLE: Record<InputSize, React.CSSProperties> = {
  sm: { height: '28px', fontSize: 'var(--forge-font-size-sm)',   paddingInline: 'var(--forge-space-2)' },
  md: { height: '34px', fontSize: 'var(--forge-font-size-base)', paddingInline: 'var(--forge-space-3)' },
  lg: { height: '42px', fontSize: 'var(--forge-font-size-md)',   paddingInline: 'var(--forge-space-4)' },
}

/**
 * Text input with validation styling, adornment slots, and optional clear button.
 * Error state always shows both a colored border AND error text (via FormField) —
 * never color alone.
 */
export function Input({
  size = 'md',
  variant = 'default',
  error = false,
  startAdornment,
  endAdornment,
  clearable = false,
  onClear,
  disabled,
  className,
  style,
  value,
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false)
  const hasValue = value !== undefined && value !== ''
  const showClear = clearable && hasValue && !disabled

  const borderColor = error
    ? 'var(--forge-danger)'
    : focused
      ? 'var(--forge-accent)'
      : 'var(--forge-border)'

  const bg = variant === 'filled' ? 'var(--forge-surface-raised)' : 'var(--forge-surface)'

  return (
    <div
      className={cn('forge-input-wrapper', className)}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        ...SIZE_STYLE[size],
        backgroundColor: disabled ? 'var(--forge-bg-disabled)' : bg,
        border: `1px solid ${borderColor}`,
        borderRadius: 'var(--forge-radius-md)',
        transition: `border-color var(--forge-duration-fast) var(--forge-easing-default)`,
        boxShadow: focused ? `0 0 0 2px color-mix(in srgb, ${borderColor} 25%, transparent)` : undefined,
        ...style,
      }}
    >
      {startAdornment && (
        <span style={{ paddingLeft: 'var(--forge-space-2)', color: 'var(--forge-text-muted)', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          {startAdornment}
        </span>
      )}
      <input
        value={value}
        disabled={disabled}
        aria-invalid={error || undefined}
        style={{
          flex: '1 1 auto',
          width: '100%',
          height: '100%',
          paddingInline: startAdornment
            ? 'var(--forge-space-2)'
            : endAdornment || showClear
              ? `var(--forge-space-3) var(--forge-space-2)`
              : 'var(--forge-space-3)',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          fontFamily: 'var(--forge-font-sans)',
          fontSize: 'inherit',
          color: disabled ? 'var(--forge-text-disabled)' : 'var(--forge-text)',
          cursor: disabled ? 'not-allowed' : 'text',
        }}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e) }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e) }}
        {...props}
      />
      {showClear && (
        <button
          type="button"
          aria-label="Clear"
          onClick={onClear}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '20px',
            height: '20px',
            flexShrink: 0,
            marginRight: 'var(--forge-space-1)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--forge-text-muted)',
            borderRadius: 'var(--forge-radius-sm)',
            padding: '0',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      )}
      {endAdornment && !showClear && (
        <span style={{ paddingRight: 'var(--forge-space-2)', color: 'var(--forge-text-muted)', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          {endAdornment}
        </span>
      )}
    </div>
  )
}
