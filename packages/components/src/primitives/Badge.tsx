import { cn } from '../lib/cn.js'

type BadgeVariant = 'solid' | 'subtle' | 'outline'
type BadgeColor = 'accent' | 'info' | 'success' | 'warning' | 'danger' | 'neutral'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Visual style. Default: 'subtle' */
  variant?: BadgeVariant
  /** Semantic color. Default: 'neutral' */
  color?: BadgeColor
}

const COLOR_VARS: Record<BadgeColor, { base: string; fg: string; border: string }> = {
  accent:  { base: 'var(--forge-accent)',  fg: 'var(--forge-text-on-accent)', border: 'var(--forge-accent)' },
  info:    { base: 'var(--forge-info)',     fg: 'var(--forge-info-foreground)', border: 'var(--forge-info-border)' },
  success: { base: 'var(--forge-success)', fg: 'var(--forge-success-foreground)', border: 'var(--forge-success-border)' },
  warning: { base: 'var(--forge-warning)', fg: 'var(--forge-warning-foreground)', border: 'var(--forge-warning-border)' },
  danger:  { base: 'var(--forge-danger)',  fg: 'var(--forge-danger-foreground)', border: 'var(--forge-danger-border)' },
  neutral: { base: 'var(--forge-border)',  fg: 'var(--forge-text)', border: 'var(--forge-border)' },
}

/**
 * Status indicator badge. Always includes text (never color alone) to be
 * accessible to users who cannot distinguish colors.
 */
export function Badge({ variant = 'subtle', color = 'neutral', className, children, style, ...props }: BadgeProps) {
  const { base, fg, border } = COLOR_VARS[color]

  const variantStyle: React.CSSProperties =
    variant === 'solid'
      ? { backgroundColor: base, color: fg, border: `1px solid transparent` }
      : variant === 'outline'
        ? { backgroundColor: 'transparent', color: base, border: `1px solid ${border}` }
        : { backgroundColor: `color-mix(in srgb, ${base} 15%, transparent)`, color: base, border: `1px solid color-mix(in srgb, ${base} 25%, transparent)` }

  return (
    <span
      className={cn('forge-badge', className)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        paddingInline: '6px',
        paddingBlock: '1px',
        borderRadius: 'var(--forge-radius-sm)',
        fontSize: 'var(--forge-font-size-xs)',
        fontWeight: 'var(--forge-font-medium)',
        lineHeight: 'var(--forge-line-height-xs)',
        letterSpacing: 'var(--forge-tracking-wide)',
        whiteSpace: 'nowrap',
        ...variantStyle,
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  )
}
