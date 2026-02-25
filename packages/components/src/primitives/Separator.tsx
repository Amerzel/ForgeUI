import * as RadixSeparator from '@radix-ui/react-separator'
import { cn } from '../lib/cn.js'

interface SeparatorProps extends React.ComponentPropsWithoutRef<typeof RadixSeparator.Root> {
  className?: string
}

/**
 * Horizontal or vertical visual divider.
 * Set `decorative` to remove from the accessibility tree.
 */
export function Separator({ orientation = 'horizontal', decorative = true, className, ...props }: SeparatorProps) {
  return (
    <RadixSeparator.Root
      orientation={orientation}
      decorative={decorative}
      className={cn('forge-separator', className)}
      style={{
        backgroundColor: 'var(--forge-border)',
        ...(orientation === 'horizontal'
          ? { height: '1px', width: '100%', margin: '0' }
          : { width: '1px', height: '100%', margin: '0' }),
      }}
      {...props}
    />
  )
}
