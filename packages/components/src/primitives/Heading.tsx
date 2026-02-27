import { Slot } from '@radix-ui/react-slot'
import { cn } from '../lib/cn.js'

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6
type HeadingSize = 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** When true, merges onto child element instead of rendering a heading tag */
  asChild?: boolean
  /** Semantic heading level — controls the HTML element (h1–h6). Default: 2 */
  level?: HeadingLevel
  /** Visual size, independent of semantic level. Default: 'lg' */
  size?: HeadingSize
}

const SIZE_VARS: Record<HeadingSize, { fontSize: string; lineHeight: string }> = {
  'xs':   { fontSize: 'var(--forge-font-size-xs)',   lineHeight: 'var(--forge-line-height-xs)' },
  'sm':   { fontSize: 'var(--forge-font-size-sm)',   lineHeight: 'var(--forge-line-height-sm)' },
  'base': { fontSize: 'var(--forge-font-size-base)', lineHeight: 'var(--forge-line-height-base)' },
  'md':   { fontSize: 'var(--forge-font-size-md)',   lineHeight: 'var(--forge-line-height-md)' },
  'lg':   { fontSize: 'var(--forge-font-size-lg)',   lineHeight: 'var(--forge-line-height-lg)' },
  'xl':   { fontSize: 'var(--forge-font-size-xl)',   lineHeight: 'var(--forge-line-height-xl)' },
  '2xl':  { fontSize: 'var(--forge-font-size-2xl)',  lineHeight: 'var(--forge-line-height-2xl)' },
  '3xl':  { fontSize: 'var(--forge-font-size-3xl)',  lineHeight: 'var(--forge-line-height-3xl)' },
}

/**
 * Semantic heading component. `level` controls the DOM element (h1–h6);
 * `size` controls the visual scale independently — use them separately for
 * correct document structure without visual constraints.
 */
export function Heading({
  asChild = false,
  level = 2,
  size = 'lg',
  className,
  style,
  ...props
}: HeadingProps) {
  const Tag = asChild ? Slot : `h${level}`
  return (
    <Tag
      className={cn('forge-heading', className)}
      style={{
        margin: '0',
        fontFamily: 'var(--forge-font-display)',
        fontWeight: 'var(--forge-font-semibold)',
        letterSpacing: 'var(--forge-tracking-tight)',
        color: 'var(--forge-text)',
        ...SIZE_VARS[size],
        ...style,
      }}
      {...props}
    />
  )
}
