import type { CSSProperties, HTMLAttributes } from 'react'
import { sp, cleanStyle } from './layoutUtils.js'
import type { SpaceValue } from './layoutUtils.js'

export interface GroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Gap between children. Default: space-2 (8px) */
  gap?: SpaceValue
  /** Alias for gap */
  spacing?: SpaceValue
  align?: CSSProperties['alignItems']
  justify?: CSSProperties['justifyContent']
  wrap?: CSSProperties['flexWrap']
  /**
   * Each child grows to fill equal width.
   * Useful for distributing toolbar buttons or form field rows.
   */
  grow?: boolean
  /** Prevent grown children from exceeding (1/n × 100%) width */
  preventGrowOverflow?: boolean
}

export function Group({
  gap,
  spacing,
  align = 'center',
  justify,
  wrap,
  grow = false,
  preventGrowOverflow = true,
  style,
  children,
  ...props
}: GroupProps) {
  const computedStyle: CSSProperties = {
    ...cleanStyle({
      display:        'flex',
      flexDirection:  'row',
      alignItems:     align,
      justifyContent: justify,
      flexWrap:       wrap,
      gap:            sp(gap ?? spacing ?? 2),
    }),
    ...style,
  }

  if (!grow) {
    return <div style={computedStyle} {...props}>{children}</div>
  }

  // When grow=true, wrap children so each fills equal space
  const childStyle: CSSProperties = {
    flex: 1,
    ...(preventGrowOverflow ? { overflow: 'hidden', minWidth: 0 } : {}),
  }

  return (
    <div style={computedStyle} {...props}>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <div key={i} style={childStyle}>{child}</div>
          ))
        : <div style={childStyle}>{children}</div>
      }
    </div>
  )
}
