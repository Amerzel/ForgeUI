import { Slot } from '@radix-ui/react-slot'
import { cn } from '../lib/cn.js'
import { Spinner } from './Spinner.js'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. Default: 'secondary' */
  variant?: ButtonVariant
  /** Size. Default: 'md' */
  size?: ButtonSize
  /** Stretch to fill container width */
  fullWidth?: boolean
  /** Icon rendered before the label */
  startIcon?: React.ReactNode
  /** Icon rendered after the label */
  endIcon?: React.ReactNode
  /** Shows a spinner and disables interaction */
  loading?: boolean
  /** When true, merges onto child element instead of rendering a <button> */
  asChild?: boolean
}

const SIZE_STYLE: Record<ButtonSize, React.CSSProperties> = {
  sm: {
    height: '28px',
    paddingInline: 'var(--forge-space-3)',
    fontSize: 'var(--forge-font-size-sm)',
    gap: 'var(--forge-space-1)',
  },
  md: {
    height: '34px',
    paddingInline: 'var(--forge-space-4)',
    fontSize: 'var(--forge-font-size-base)',
    gap: 'var(--forge-space-2)',
  },
  lg: {
    height: '42px',
    paddingInline: 'var(--forge-space-5)',
    fontSize: 'var(--forge-font-size-md)',
    gap: 'var(--forge-space-2)',
  },
}

const VARIANT_STYLE: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: 'var(--forge-accent)',
    color: 'var(--forge-text-on-accent)',
    border: '1px solid transparent',
  },
  secondary: {
    backgroundColor: 'var(--forge-surface-raised)',
    color: 'var(--forge-text)',
    border: '1px solid var(--forge-border)',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: 'var(--forge-text)',
    border: '1px solid transparent',
  },
  // Danger uses a darkened fill to pass WCAG AA for white foreground text
  danger: {
    backgroundColor: 'var(--forge-danger-hover)',
    color: 'var(--forge-danger-foreground)',
    border: '1px solid transparent',
  },
}

const HOVER_STYLE: Record<ButtonVariant, React.CSSProperties> = {
  primary: { filter: 'brightness(0.9)' },
  secondary: { backgroundColor: 'var(--forge-surface-active)' },
  ghost: { backgroundColor: 'var(--forge-surface-hover)' },
  danger: { filter: 'brightness(0.9)' },
}

/**
 * Primary interactive control. Supports primary/secondary/ghost/danger variants,
 * three sizes, loading state with spinner, start/end icons, and asChild for
 * rendering as a link or any other element.
 */
export function Button({
  variant = 'secondary',
  size = 'md',
  fullWidth = false,
  startIcon,
  endIcon,
  loading = false,
  asChild = false,
  disabled,
  className,
  style,
  children,
  onMouseEnter,
  onMouseLeave,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  const isDisabled = disabled || loading

  const [hovered, setHovered] = React.useState(false)

  return (
    <Comp
      className={cn('forge-button', `forge-button--${variant}`, `forge-button--${size}`, className)}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      style={{
        // Base layout
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: fullWidth ? '100%' : undefined,
        // Size
        ...SIZE_STYLE[size],
        // Variant
        ...VARIANT_STYLE[variant],
        // Hover
        ...(hovered && !isDisabled ? HOVER_STYLE[variant] : {}),
        // Shape
        borderRadius: 'var(--forge-radius-md)',
        fontFamily: 'var(--forge-font-sans)',
        fontWeight: 'var(--forge-font-medium)',
        lineHeight: '1',
        // Interaction
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        userSelect: 'none',
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        // Disabled
        opacity: isDisabled ? 0.5 : 1,
        // Transition
        transition: `background-color var(--forge-duration-fast) var(--forge-easing-default),
                     opacity var(--forge-duration-fast) var(--forge-easing-default),
                     filter var(--forge-duration-fast) var(--forge-easing-default)`,
        // Focus
        outline: 'none',
        ...style,
      }}
      onMouseEnter={(e) => {
        setHovered(true)
        onMouseEnter?.(e)
      }}
      onMouseLeave={(e) => {
        setHovered(false)
        onMouseLeave?.(e)
      }}
      onFocus={(e) => {
        if (e.target === e.currentTarget) {
          e.currentTarget.style.outline =
            'var(--forge-focus-ring-width) solid var(--forge-focus-ring-color)'
          e.currentTarget.style.outlineOffset = 'var(--forge-focus-ring-offset)'
        }
      }}
      onBlur={(e) => {
        if (e.target === e.currentTarget) {
          e.currentTarget.style.outline = 'none'
        }
      }}
      {...props}
    >
      {loading ? <Spinner size={size === 'sm' ? 'sm' : 'md'} /> : startIcon}
      {children && <span style={{ display: 'contents' }}>{children}</span>}
      {!loading && endIcon}
    </Comp>
  )
}

// React import needed for useState
import React from 'react'
