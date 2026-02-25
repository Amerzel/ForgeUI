import type { CSSProperties, HTMLAttributes } from 'react'
import { sp, cleanStyle } from './layoutUtils.js'
import type { SpaceValue } from './layoutUtils.js'

// ---------------------------------------------------------------------------
// Grid.Col
// ---------------------------------------------------------------------------

export interface GridColProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Number of columns to span (1–12), or 'auto', or a raw CSS grid-column value.
   * e.g. span={4} → 'span 4 / span 4'
   */
  span?: number | 'auto' | string
  /** Column offset (number of columns to skip before this one) */
  offset?: number
  /** Row span */
  rowSpan?: number
  /** CSS grid-area name */
  area?: string
}

function GridCol({
  span,
  offset,
  rowSpan,
  area,
  style,
  ...props
}: GridColProps) {
  let gridColumn: string | undefined
  if (span !== undefined) {
    if (typeof span === 'number') gridColumn = `span ${span} / span ${span}`
    else if (span === 'auto') gridColumn = 'auto'
    else gridColumn = span
  }

  const computedStyle: CSSProperties = {
    ...cleanStyle({
      gridColumn,
      gridRow:    rowSpan !== undefined ? `span ${rowSpan} / span ${rowSpan}` : undefined,
      gridArea:   area,
      marginLeft: offset !== undefined ? `calc(${offset} / var(--grid-cols, 12) * 100%)` : undefined,
    }),
    ...style,
  }

  return <div style={computedStyle} {...props} />
}

// ---------------------------------------------------------------------------
// Grid root
// ---------------------------------------------------------------------------

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Grid columns definition.
   * - number → `repeat(N, 1fr)`
   * - string → passed directly as `grid-template-columns`
   *   e.g. "300px 1fr 360px" or "repeat(auto-fit, minmax(200px, 1fr))"
   */
  columns?: number | string
  /**
   * Grid rows definition. String passed directly as `grid-template-rows`.
   */
  rows?: string
  /** Named template areas string */
  areas?: string
  gap?: SpaceValue
  columnGap?: SpaceValue
  rowGap?: SpaceValue
  align?: CSSProperties['alignItems']
  justify?: CSSProperties['justifyContent']
  autoFlow?: CSSProperties['gridAutoFlow']
  autoColumns?: string
  autoRows?: string
}

function GridRoot({
  columns,
  rows,
  areas,
  gap,
  columnGap,
  rowGap,
  align,
  justify,
  autoFlow,
  autoColumns,
  autoRows,
  style,
  ...props
}: GridProps) {
  let templateColumns: string | undefined
  if (columns !== undefined) {
    templateColumns = typeof columns === 'number'
      ? `repeat(${columns}, 1fr)`
      : columns
  }

  const computedStyle: CSSProperties = {
    ...cleanStyle({
      display:             'grid',
      gridTemplateColumns: templateColumns,
      gridTemplateRows:    rows,
      gridTemplateAreas:   areas,
      gap:                 sp(gap),
      columnGap:           sp(columnGap),
      rowGap:              sp(rowGap),
      alignItems:          align,
      justifyContent:      justify,
      gridAutoFlow:        autoFlow,
      gridAutoColumns:     autoColumns,
      gridAutoRows:        autoRows,
    }),
    ...style,
  }

  return <div style={computedStyle} {...props} />
}

export const Grid = Object.assign(GridRoot, { Col: GridCol })
