import { Slot } from '@radix-ui/react-slot'
import { cn } from '../lib/cn.js'

type TextSize = 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold'
type TextColor = 'default' | 'muted' | 'disabled' | 'accent' | 'inherit'

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  /** When true, merges onto child element instead of rendering a <p> */
  asChild?: boolean
  /** Font size preset. Default: 'base' (14px) */
  size?: TextSize
  /** Font weight. Default: 'normal' */
  weight?: TextWeight
  /** Text color. Default: 'default' */
  color?: TextColor
  /** Truncate with ellipsis when overflowing */
  truncate?: boolean
}

const SIZE_VARS: Record<TextSize, { fontSize: string; lineHeight: string }> = {
  'xs':   { fontSize: 'var(--forge-font-size-xs)',   lineHeight: 'var(--forge-line-height-xs)' },
  'sm':   { fontSize: 'var(--forge-font-size-sm)',   lineHeight: 'var(--forge-line-height-sm)' },
  'base': { fontSize: 'var(--forge-font-size-base)', lineHeight: 'var(--forge-line-height-base)' },
  'md':   { fontSize: 'var(--forge-font-size-md)',   lineHeight: 'var(--forge-line-height-md)' },
  'lg':   { fontSize: 'var(--forge-font-size-lg)',   lineHeight: 'var(--forge-line-height-lg)' },
  'xl':   { fontSize: 'var(--forge-font-size-xl)',   lineHeight: 'var(--forge-line-height-xl)' },
  '2xl':  { fontSize: 'var(--forge-font-size-2xl)',  lineHeight: 'var(--forge-line-height-2xl)' },
  '3xl':  { fontSize: 'var(--forge-font-size-3xl)',  lineHeight: 'var(--forge-line-height-3xl)' },
}

const WEIGHT_VARS: Record<TextWeight, string> = {
  normal:   'var(--forge-font-normal)',
  medium:   'var(--forge-font-medium)',
  semibold: 'var(--forge-font-semibold)',
  bold:     'var(--forge-font-bold)',
}

const COLOR_VARS: Record<TextColor, string> = {
  default:  'var(--forge-text)',
  muted:    'var(--forge-text-muted)',
  disabled: 'var(--forge-text-disabled)',
  accent:   'var(--forge-accent)',
  inherit:  'inherit',
}

/**
 * Inline or block text element. Renders <p> by default.
 * Use `asChild` to merge onto a semantic child (span, div, label, etc.).
 * Does NOT render headings — use <Heading> for h1–h6.
 */
export function Text({
  asChild = false,
  size = 'base',
  weight = 'normal',
  color = 'default',
  truncate = false,
  className,
  style,
  ...props
}: TextProps) {
  const Comp = asChild ? Slot : 'p'
  return (
    <Comp
      className={cn('forge-text', className)}
      style={{
        margin: '0',
        fontFamily: 'var(--forge-font-sans)',
        ...SIZE_VARS[size],
        fontWeight: WEIGHT_VARS[weight],
        color: COLOR_VARS[color],
        ...(truncate && {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }),
        ...style,
      }}
      {...props}
    />
  )
}
