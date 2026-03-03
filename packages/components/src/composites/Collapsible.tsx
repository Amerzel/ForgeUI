import * as RadixCollapsible from '@radix-ui/react-collapsible'
import { cn } from '../lib/cn.js'

interface CollapsibleProps {
  trigger: React.ReactNode
  children: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
  className?: string
}

export function Collapsible({
  trigger,
  children,
  open,
  defaultOpen,
  onOpenChange,
  disabled,
  className,
}: CollapsibleProps) {
  return (
    <RadixCollapsible.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      disabled={disabled}
      className={cn('forge-collapsible', className)}
    >
      <RadixCollapsible.Trigger
        className="forge-collapsible-trigger"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          gap: 'var(--forge-space-2)',
          background: 'transparent',
          border: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          outline: 'none',
          color: 'var(--forge-text)',
          fontFamily: 'var(--forge-font-sans)',
          fontSize: 'var(--forge-font-size-base)',
        }}
        onFocus={(e) => {
          e.currentTarget.style.outline =
            'var(--forge-focus-ring-width) solid var(--forge-focus-ring-color)'
          e.currentTarget.style.outlineOffset = 'var(--forge-focus-ring-offset)'
        }}
        onBlur={(e) => {
          e.currentTarget.style.outline = 'none'
        }}
      >
        <span style={{ flex: '1 1 auto', textAlign: 'left' }}>{trigger}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden="true"
          className="forge-collapsible-chevron"
          style={{
            flexShrink: 0,
            color: 'var(--forge-text-muted)',
            transition: `transform var(--forge-duration-fast) var(--forge-easing-default)`,
          }}
        >
          <path
            d="M3 5l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </RadixCollapsible.Trigger>

      <RadixCollapsible.Content style={{ overflow: 'hidden' }}>{children}</RadixCollapsible.Content>

      <style>{`
        .forge-collapsible-trigger[data-state="open"] .forge-collapsible-chevron {
          transform: rotate(180deg);
        }
      `}</style>
    </RadixCollapsible.Root>
  )
}
