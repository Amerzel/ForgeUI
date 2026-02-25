/**
 * Shared helpers for layout primitive components.
 * Converts shorthand prop values into CSS custom property references.
 */

export type SpaceValue = number | 'px' | string

const SPACE_SCALE = new Set([0, 0.5, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64])

/** Converts a space scale value to a CSS var or passes through raw CSS strings. */
export function sp(val: SpaceValue | undefined): string | undefined {
  if (val === undefined) return undefined
  if (val === 'px') return 'var(--forge-space-px)'
  if (typeof val === 'number' && SPACE_SCALE.has(val)) return `var(--forge-space-${val})`
  return String(val)
}

const SEMANTIC_COLORS = new Set([
  'bg', 'surface', 'surface-raised', 'surface-hover', 'surface-active',
  'surface-sunken', 'surface-overlay', 'surface-popover', 'bg-overlay', 'bg-disabled',
  'border', 'border-subtle', 'border-strong',
  'text', 'text-muted', 'text-disabled',
  'text-on-accent', 'text-on-info', 'text-on-success', 'text-on-warning', 'text-on-danger',
  'accent',
  'info',    'info-hover',    'info-bg',    'info-border',    'info-foreground',
  'success', 'success-hover', 'success-bg', 'success-border', 'success-foreground',
  'warning', 'warning-hover', 'warning-bg', 'warning-border', 'warning-foreground',
  'danger',  'danger-hover',  'danger-bg',  'danger-border',  'danger-foreground',
])

/** Converts a semantic color alias or passes through raw CSS color strings. */
export function col(val: string | undefined): string | undefined {
  if (!val) return undefined
  if (SEMANTIC_COLORS.has(val)) return `var(--forge-${val})`
  return val
}

const RADIUS_KEYS = new Set(['none', 'sm', 'md', 'lg', 'xl', 'full'])

/** Converts a radius token name or passes through raw CSS values. */
export function rad(val: string | undefined): string | undefined {
  if (!val) return undefined
  if (RADIUS_KEYS.has(val)) return `var(--forge-radius-${val})`
  return val
}

/** Removes undefined keys from a style object. */
export function cleanStyle(obj: Record<string, string | number | undefined>): Record<string, string | number> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined),
  ) as Record<string, string | number>
}

/**
 * Shorthand padding/margin props shared across all layout primitives.
 * Mirrors the Box API so that Stack, Flex, etc. don't require wrapping in Box for spacing.
 */
export interface SpacingShorthandProps {
  /** Padding on all sides */
  p?: SpaceValue
  /** Horizontal padding */
  px?: SpaceValue
  /** Vertical padding */
  py?: SpaceValue
  pt?: SpaceValue
  pb?: SpaceValue
  pl?: SpaceValue
  pr?: SpaceValue
  /** Margin on all sides */
  m?: SpaceValue
  /** Horizontal margin */
  mx?: SpaceValue
  /** Vertical margin */
  my?: SpaceValue
  mt?: SpaceValue
  mb?: SpaceValue
  ml?: SpaceValue
  mr?: SpaceValue
}

/** Resolve SpacingShorthandProps to a CSSProperties object (most-specific wins). */
export function resolveSpacing(props: SpacingShorthandProps): Record<string, string | number> {
  const { p, px, py, pt, pb, pl, pr, m, mx, my, mt, mb, ml, mr } = props
  return cleanStyle({
    paddingTop:    sp(pt ?? py ?? p),
    paddingBottom: sp(pb ?? py ?? p),
    paddingLeft:   sp(pl ?? px ?? p),
    paddingRight:  sp(pr ?? px ?? p),
    marginTop:     sp(mt ?? my ?? m),
    marginBottom:  sp(mb ?? my ?? m),
    marginLeft:    sp(ml ?? mx ?? m),
    marginRight:   sp(mr ?? mx ?? m),
  })
}
