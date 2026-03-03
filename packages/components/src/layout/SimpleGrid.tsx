import type { CSSProperties, HTMLAttributes } from 'react'
import { sp, cleanStyle } from './layoutUtils.js'
import type { SpaceValue } from './layoutUtils.js'

export interface SimpleGridProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Number of equal-width columns.
   * Produces `grid-template-columns: repeat(N, 1fr)`.
   */
  cols?: number
  /**
   * Minimum child width for auto-fit layout.
   * Produces `grid-template-columns: repeat(auto-fit, minmax(W, 1fr))`.
   * Takes precedence over `cols` when both are provided.
   */
  minChildWidth?: string
  /** Gap between all cells */
  spacing?: SpaceValue
  /** Horizontal gap (overrides spacing) */
  spacingX?: SpaceValue
  /** Vertical gap (overrides spacing) */
  spacingY?: SpaceValue
}

export function SimpleGrid({
  cols = 1,
  minChildWidth,
  spacing,
  spacingX,
  spacingY,
  style,
  ...props
}: SimpleGridProps) {
  const templateColumns = minChildWidth
    ? `repeat(auto-fit, minmax(${minChildWidth}, 1fr))`
    : `repeat(${cols}, 1fr)`

  const computedStyle: CSSProperties = {
    ...cleanStyle({
      display: 'grid',
      gridTemplateColumns: templateColumns,
      gap: sp(spacing),
      columnGap: sp(spacingX),
      rowGap: sp(spacingY),
    }),
    ...style,
  }

  return <div style={computedStyle} {...props} />
}
