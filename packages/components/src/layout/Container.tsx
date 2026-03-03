import type { HTMLAttributes } from 'react'
import { sp, cleanStyle } from './layoutUtils.js'
import type { SpaceValue } from './layoutUtils.js'

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Max-width constraint.
   * - Token alias: 'prose' (65ch) | 'sm' (384px) | 'md' (512px) | 'lg' (768px)
   * - Raw CSS: '1200px', '90rem', etc.
   * Default: none (full width)
   */
  size?: string
  /** Horizontal padding. Default: space-4 (16px) */
  px?: SpaceValue
  /** Remove max-width and padding constraints */
  fluid?: boolean
}

const SIZE_MAP: Record<string, string> = {
  prose: 'var(--forge-max-w-prose)',
  sm: 'var(--forge-max-w-sm)',
  md: 'var(--forge-max-w-md)',
  lg: 'var(--forge-max-w-lg)',
}

export function Container({ size, px = 4, fluid = false, style, ...props }: ContainerProps) {
  const maxWidth = fluid ? undefined : size !== undefined ? (SIZE_MAP[size] ?? size) : undefined

  const computedStyle = {
    ...cleanStyle({
      width: '100%',
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth,
      paddingLeft: fluid ? undefined : sp(px),
      paddingRight: fluid ? undefined : sp(px),
    }),
    ...style,
  }

  return <div style={computedStyle} {...props} />
}
