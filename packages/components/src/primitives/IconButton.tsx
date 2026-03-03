import { Slot } from '@radix-ui/react-slot'
import { cn } from '../lib/cn.js'
import { VisuallyHidden } from './VisuallyHidden.js'

type IconButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type IconButtonSize = 'sm' | 'md' | 'lg'

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The icon to render. Required. */
  icon: React.ReactNode
  /**
   * Accessible label for screen readers. Required — icon-only buttons must
   * have a text alternative. Rendered via VisuallyHidden.
   */
  label: string
  /** Visual size. Default: 'md' */
  size?: IconButtonSize
  /** Visual variant. Default: 'ghost' */
  variant?: IconButtonVariant
  /** When true, merges onto child element */
  asChild?: boolean
}

const SIZE_STYLE: Record<IconButtonSize, React.CSSProperties> = {
  sm: { width: '28px', height: '28px' },
  md: { width: '34px', height: '34px' },
  lg: { width: '42px', height: '42px' },
}

const VARIANT_STYLE: Record<IconButtonVariant, React.CSSProperties> = {
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
  danger: {
    backgroundColor: 'var(--forge-danger-hover)',
    color: 'var(--forge-danger-foreground)',
    border: '1px solid transparent',
  },
}

const HOVER_STYLE: Record<IconButtonVariant, React.CSSProperties> = {
  primary: { filter: 'brightness(0.9)' },
  secondary: { backgroundColor: 'var(--forge-surface-active)' },
  ghost: { backgroundColor: 'var(--forge-surface-hover)' },
  danger: { filter: 'brightness(0.9)' },
}

/**
 * Accessible icon-only button. The `label` prop is required and rendered
 * visually hidden for screen readers. Use `icon` for the visual content.
 */
export function IconButton({
  icon,
  label,
  size = 'md',
  variant = 'ghost',
  asChild = false,
  disabled,
  className,
  style,
  onMouseEnter,
  onMouseLeave,
  ...props
}: IconButtonProps) {
  const Comp = asChild ? Slot : 'button'
  const [hovered, setHovered] = React.useState(false)

  return (
    <Comp
      aria-label={label}
      className={cn('forge-icon-button', className)}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        ...SIZE_STYLE[size],
        ...VARIANT_STYLE[variant],
        ...(hovered && !disabled ? HOVER_STYLE[variant] : {}),
        borderRadius: 'var(--forge-radius-md)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        userSelect: 'none',
        transition: `background-color var(--forge-duration-fast) var(--forge-easing-default),
                     filter var(--forge-duration-fast) var(--forge-easing-default)`,
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
        e.currentTarget.style.outline =
          'var(--forge-focus-ring-width) solid var(--forge-focus-ring-color)'
        e.currentTarget.style.outlineOffset = 'var(--forge-focus-ring-offset)'
      }}
      onBlur={(e) => {
        e.currentTarget.style.outline = 'none'
      }}
      {...props}
    >
      {icon}
      <VisuallyHidden>{label}</VisuallyHidden>
    </Comp>
  )
}

import React from 'react'
