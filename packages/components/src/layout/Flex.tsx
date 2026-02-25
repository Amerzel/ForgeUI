import type { CSSProperties, HTMLAttributes } from 'react'
import { sp, cleanStyle, resolveSpacing } from './layoutUtils.js'
import type { SpaceValue, SpacingShorthandProps } from './layoutUtils.js'

export interface FlexProps extends HTMLAttributes<HTMLDivElement>, SpacingShorthandProps {
  direction?: CSSProperties['flexDirection']
  wrap?: CSSProperties['flexWrap']
  align?: CSSProperties['alignItems']
  justify?: CSSProperties['justifyContent']
  gap?: SpaceValue
  rowGap?: SpaceValue
  columnGap?: SpaceValue
  /** Shorthand: flex='1' makes this flex item fill available space */
  flex?: CSSProperties['flex']
  inline?: boolean
}

export function Flex({
  direction,
  wrap,
  align,
  justify,
  gap,
  rowGap,
  columnGap,
  flex,
  inline = false,
  p, px, py, pt, pb, pl, pr,
  m, mx, my, mt, mb, ml, mr,
  style,
  ...props
}: FlexProps) {
  const computedStyle: CSSProperties = {
    ...cleanStyle({
      display:        inline ? 'inline-flex' : 'flex',
      flexDirection:  direction,
      flexWrap:       wrap,
      alignItems:     align,
      justifyContent: justify,
      gap:            sp(gap),
      rowGap:         sp(rowGap),
      columnGap:      sp(columnGap),
      flex,
    }),
    ...resolveSpacing({ p, px, py, pt, pb, pl, pr, m, mx, my, mt, mb, ml, mr }),
    ...style,
  }

  return <div style={computedStyle} {...props} />
}
