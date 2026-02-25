import type { CSSProperties, ElementType, HTMLAttributes } from 'react'
import { sp, col, rad, cleanStyle } from './layoutUtils.js'
import type { SpaceValue } from './layoutUtils.js'

export interface BoxProps extends HTMLAttributes<HTMLElement> {
  /** HTML element or component to render as. Default: 'div' */
  as?: ElementType
  // Padding
  p?: SpaceValue;  px?: SpaceValue; py?: SpaceValue
  pt?: SpaceValue; pb?: SpaceValue; pl?: SpaceValue; pr?: SpaceValue
  // Margin
  m?: SpaceValue;  mx?: SpaceValue; my?: SpaceValue
  mt?: SpaceValue; mb?: SpaceValue; ml?: SpaceValue; mr?: SpaceValue
  // Sizing
  w?: SpaceValue; h?: SpaceValue
  minW?: string;  maxW?: string
  minH?: string;  maxH?: string
  // Visual
  /** Semantic color alias (e.g. 'surface', 'accent') or raw CSS color */
  bg?: string
  /** Semantic color alias (e.g. 'text', 'text-muted') or raw CSS color */
  c?: string
  /** Radius token ('sm' | 'md' | 'lg' | 'xl' | 'full') or raw CSS value */
  radius?: string
  // Layout
  display?: CSSProperties['display']
  pos?: CSSProperties['position']
  overflow?: CSSProperties['overflow']
  overflowX?: CSSProperties['overflowX']
  overflowY?: CSSProperties['overflowY']
  // Flex child props (for when Box is inside a flex container)
  flex?: CSSProperties['flex']
  grow?: number
  shrink?: number
  basis?: CSSProperties['flexBasis']
  // Gap (for when Box is a flex/grid container itself)
  gap?: SpaceValue
  rowGap?: SpaceValue
  columnGap?: SpaceValue
  // Misc
  zIndex?: number
  opacity?: number
}

export function Box({
  as: Tag = 'div',
  p, px, py, pt, pb, pl, pr,
  m, mx, my, mt, mb, ml, mr,
  w, h, minW, maxW, minH, maxH,
  bg, c, radius,
  display, pos, overflow, overflowX, overflowY,
  flex, grow, shrink, basis,
  gap, rowGap, columnGap,
  zIndex, opacity,
  style,
  ...props
}: BoxProps) {
  const computedStyle: CSSProperties = {
    ...cleanStyle({
      paddingLeft:    sp(pl) ?? sp(px) ?? sp(p),
      paddingRight:   sp(pr) ?? sp(px) ?? sp(p),
      paddingTop:     sp(pt) ?? sp(py) ?? sp(p),
      paddingBottom:  sp(pb) ?? sp(py) ?? sp(p),
      marginLeft:     sp(ml) ?? sp(mx) ?? sp(m),
      marginRight:    sp(mr) ?? sp(mx) ?? sp(m),
      marginTop:      sp(mt) ?? sp(my) ?? sp(m),
      marginBottom:   sp(mb) ?? sp(my) ?? sp(m),
      width:          sp(w),
      height:         sp(h),
      minWidth:       minW,
      maxWidth:       maxW,
      minHeight:      minH,
      maxHeight:      maxH,
      backgroundColor: col(bg),
      color:           col(c),
      borderRadius:    rad(radius),
      display,
      position:       pos,
      overflow,
      overflowX,
      overflowY,
      flex,
      flexGrow:       grow,
      flexShrink:     shrink,
      flexBasis:      basis,
      gap:            sp(gap),
      rowGap:         sp(rowGap),
      columnGap:      sp(columnGap),
      zIndex,
      opacity,
    }),
    ...style,
  }

  return <Tag style={computedStyle} {...props} />
}
