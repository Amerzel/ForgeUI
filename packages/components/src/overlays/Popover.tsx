import * as RadixPopover from '@radix-ui/react-popover'
import { usePortalContainer } from '@forgeui/hooks'
import { cn } from '../lib/cn.js'

type PopoverSide = 'top' | 'right' | 'bottom' | 'left'
type PopoverAlign = 'start' | 'center' | 'end'

interface PopoverProps {
  trigger: React.ReactNode
  children: React.ReactNode
  side?: PopoverSide
  align?: PopoverAlign
  sideOffset?: number
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Width of the popover panel. Default: 'auto' */
  width?: string
  className?: string
}

export function Popover({
  trigger,
  children,
  side = 'bottom',
  align = 'start',
  sideOffset = 6,
  open,
  onOpenChange,
  width = 'auto',
  className,
}: PopoverProps) {
  const portalContainer = usePortalContainer()
  return (
    <RadixPopover.Root open={open} onOpenChange={onOpenChange}>
      <RadixPopover.Trigger asChild>{trigger}</RadixPopover.Trigger>

      <RadixPopover.Portal container={portalContainer}>
        <RadixPopover.Content
          side={side}
          align={align}
          sideOffset={sideOffset}
          className={cn('forge-popover', className)}
          style={{
            width,
            backgroundColor: 'var(--forge-surface-popover)',
            color: 'var(--forge-text)',
            border: '1px solid var(--forge-border)',
            borderRadius: 'var(--forge-radius-md)',
            boxShadow: 'var(--forge-shadow-md)',
            padding: 'var(--forge-space-4)',
            zIndex: 'var(--forge-z-dropdown)',
            outline: 'none',
            animation: `forge-popover-in var(--forge-duration-fast) var(--forge-easing-default)`,
          }}
          onFocus={(e) => {
            // Suppress focus ring on the panel itself
            if (e.target === e.currentTarget) {
              e.currentTarget.style.outline = 'none'
            }
          }}
        >
          {children}
          <RadixPopover.Arrow style={{ fill: 'var(--forge-surface-popover)' }} />
        </RadixPopover.Content>
      </RadixPopover.Portal>

      <style>{`
        @keyframes forge-popover-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </RadixPopover.Root>
  )
}
