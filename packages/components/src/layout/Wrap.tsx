import type { CSSProperties, HTMLAttributes } from 'react'
import { sp, cleanStyle } from './layoutUtils.js'
import type { SpaceValue } from './layoutUtils.js'

export interface WrapProps extends HTMLAttributes<HTMLDivElement> {
  /** Gap between items (horizontal and vertical). Default: space-2 */
  gap?: SpaceValue
  /** Alias for gap */
  spacing?: SpaceValue
  align?: CSSProperties['alignItems']
  justify?: CSSProperties['justifyContent']
  direction?: 'row' | 'row-reverse'
}

/**
 * Flex-wrap container. Items flow left-to-right and wrap to new lines.
 * Ideal for tag lists, badge groups, and toolbar overflow.
 *
 * @example
 * <Wrap gap={2}>
 *   {tags.map(t => <Badge key={t}>{t}</Badge>)}
 * </Wrap>
 */
export function Wrap({
  gap,
  spacing,
  align,
  justify,
  direction = 'row',
  style,
  ...props
}: WrapProps) {
  const computedStyle: CSSProperties = {
    ...cleanStyle({
      display: 'flex',
      flexWrap: 'wrap',
      flexDirection: direction,
      gap: sp(gap ?? spacing ?? 2),
      alignItems: align,
      justifyContent: justify,
    }),
    ...style,
  }

  return <div style={computedStyle} {...props} />
}
