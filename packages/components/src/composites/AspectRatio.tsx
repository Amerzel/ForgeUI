import * as RadixAspectRatio from '@radix-ui/react-aspect-ratio'
import { cn } from '../lib/cn.js'

interface AspectRatioProps {
  /** The desired aspect ratio, e.g. 16/9, 4/3, 1 */
  ratio?: number
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function AspectRatio({ ratio = 16 / 9, children, className, style }: AspectRatioProps) {
  return (
    <RadixAspectRatio.Root
      ratio={ratio}
      className={cn('forge-aspect-ratio', className)}
      style={style}
    >
      {children}
    </RadixAspectRatio.Root>
  )
}
