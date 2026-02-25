import type { SVGProps } from 'react'

export interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size in px. Applied to both width and height. Default: 20 */
  size?: number
  /** Icon color. Default: 'currentColor' */
  color?: string
}
