import type { CSSProperties, HTMLAttributes } from 'react'
import { cleanStyle } from './layoutUtils.js'

export interface CenterProps extends HTMLAttributes<HTMLDivElement> {
  /** Use inline-flex instead of flex (for inline contexts) */
  inline?: boolean
}

export function Center({ inline = false, style, ...props }: CenterProps) {
  const computedStyle: CSSProperties = {
    ...cleanStyle({
      display:         inline ? 'inline-flex' : 'flex',
      alignItems:      'center',
      justifyContent:  'center',
    }),
    ...style,
  }

  return <div style={computedStyle} {...props} />
}
