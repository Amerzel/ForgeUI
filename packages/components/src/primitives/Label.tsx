import * as RadixLabel from '@radix-ui/react-label'
import { cn } from '../lib/cn.js'

interface LabelProps extends React.ComponentPropsWithoutRef<typeof RadixLabel.Root> {
  /** When true, renders with disabled appearance */
  disabled?: boolean
}

/**
 * Accessible form label. Associates with an input via `htmlFor`.
 * Pairs with all ForgeUI form controls.
 */
export function Label({ className, disabled, ...props }: LabelProps) {
  return (
    <RadixLabel.Root
      className={cn('forge-label', disabled && 'forge-label--disabled', className)}
      style={{
        display: 'inline-block',
        fontSize: 'var(--forge-font-size-sm)',
        fontWeight: 'var(--forge-font-medium)',
        lineHeight: 'var(--forge-line-height-sm)',
        color: disabled ? 'var(--forge-text-disabled)' : 'var(--forge-text)',
        cursor: disabled ? 'not-allowed' : 'default',
        userSelect: 'none',
      }}
      {...props}
    />
  )
}
