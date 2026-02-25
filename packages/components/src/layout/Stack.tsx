import type { CSSProperties, HTMLAttributes } from 'react'
import { sp, cleanStyle, resolveSpacing } from './layoutUtils.js'
import type { SpaceValue, SpacingShorthandProps } from './layoutUtils.js'

export interface StackProps extends HTMLAttributes<HTMLDivElement>, SpacingShorthandProps {
  /** Gap between children. Accepts spacing scale value or raw CSS. */
  gap?: SpaceValue
  /** Alias for gap */
  spacing?: SpaceValue
  align?: CSSProperties['alignItems']
  justify?: CSSProperties['justifyContent']
  /** Reverse the stack direction */
  reverse?: boolean
}

export function Stack({
  gap,
  spacing,
  align,
  justify,
  reverse = false,
  p, px, py, pt, pb, pl, pr,
  m, mx, my, mt, mb, ml, mr,
  style,
  ...props
}: StackProps) {
  const computedStyle: CSSProperties = {
    ...cleanStyle({
      display:       'flex',
      flexDirection: reverse ? 'column-reverse' : 'column',
      gap:           sp(gap ?? spacing),
      alignItems:    align,
      justifyContent: justify,
    }),
    ...resolveSpacing({ p, px, py, pt, pb, pl, pr, m, mx, my, mt, mb, ml, mr }),
    ...style,
  }

  return <div style={computedStyle} {...props} />
}
