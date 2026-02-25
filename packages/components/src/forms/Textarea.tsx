import { useState, useRef, useEffect } from 'react'
import { cn } from '../lib/cn.js'

type TextareaSize = 'sm' | 'md' | 'lg'
type TextareaResize = 'none' | 'vertical' | 'both'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: TextareaSize
  /** Resize behavior. Default: 'vertical' (auto-grows) */
  resize?: TextareaResize
  /** Auto-grow height to fit content. Shorthand for resize="vertical". */
  autoGrow?: boolean
  error?: boolean
}

const SIZE_STYLE: Record<TextareaSize, React.CSSProperties> = {
  sm: { fontSize: 'var(--forge-font-size-sm)',   padding: 'var(--forge-space-1) var(--forge-space-2)' },
  md: { fontSize: 'var(--forge-font-size-base)', padding: 'var(--forge-space-2) var(--forge-space-3)' },
  lg: { fontSize: 'var(--forge-font-size-md)',   padding: 'var(--forge-space-3) var(--forge-space-4)' },
}

export function Textarea({
  size = 'md',
  resize = 'vertical',
  autoGrow = false,
  error = false,
  disabled,
  className,
  style,
  value,
  onChange,
  rows = 3,
  ...props
}: TextareaProps) {
  const [focused, setFocused] = useState(false)
  const ref = useRef<HTMLTextAreaElement>(null)

  const effectiveResize = autoGrow ? 'vertical' : resize

  // Auto-grow when resize is 'vertical' or autoGrow is true
  useEffect(() => {
    if (effectiveResize === 'vertical' && ref.current) {
      ref.current.style.height = 'auto'
      ref.current.style.height = `${ref.current.scrollHeight}px`
    }
  }, [value, effectiveResize])

  const borderColor = error
    ? 'var(--forge-danger)'
    : focused
      ? 'var(--forge-accent)'
      : 'var(--forge-border)'

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={onChange}
      disabled={disabled}
      rows={rows}
      aria-invalid={error || undefined}
      className={cn('forge-textarea', className)}
      style={{
        display: 'block',
        width: '100%',
        minHeight: '80px',
        backgroundColor: disabled ? 'var(--forge-bg-disabled)' : 'var(--forge-surface)',
        border: `1px solid ${borderColor}`,
        borderRadius: 'var(--forge-radius-md)',
        fontFamily: 'var(--forge-font-sans)',
        color: disabled ? 'var(--forge-text-disabled)' : 'var(--forge-text)',
        resize: effectiveResize === 'vertical' ? 'none' : effectiveResize, // 'none' for auto-grow, manual for others
        cursor: disabled ? 'not-allowed' : 'text',
        outline: 'none',
        transition: `border-color var(--forge-duration-fast) var(--forge-easing-default)`,
        boxShadow: focused ? `0 0 0 2px color-mix(in srgb, ${borderColor} 25%, transparent)` : undefined,
        ...SIZE_STYLE[size],
        ...style,
      }}
      onFocus={(e) => { setFocused(true); props.onFocus?.(e) }}
      onBlur={(e) => { setFocused(false); props.onBlur?.(e) }}
      {...props}
    />
  )
}
