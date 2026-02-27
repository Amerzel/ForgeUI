import * as RadixTooltip from '@radix-ui/react-tooltip'


type TooltipSide = 'top' | 'right' | 'bottom' | 'left'

interface TooltipProps {
  /** The element that triggers the tooltip */
  children: React.ReactNode
  /** Tooltip text content */
  content: React.ReactNode
  side?: TooltipSide
  sideOffset?: number
  /** Delay before showing tooltip in ms. Default: 400 */
  delayDuration?: number
  /** When true, tooltip won't appear */
  disabled?: boolean
}

/**
 * Wrap TooltipProvider once near app root.
 * Tooltip adds a tooltip to any element — the trigger must be focusable.
 */
export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <RadixTooltip.Provider>{children}</RadixTooltip.Provider>
}

export function Tooltip({
  children,
  content,
  side = 'top',
  sideOffset = 6,
  delayDuration = 400,
  disabled = false,
}: TooltipProps) {
  if (disabled) return <>{children}</>

  return (
    <RadixTooltip.Root delayDuration={delayDuration}>
      <RadixTooltip.Trigger asChild>
        {children}
      </RadixTooltip.Trigger>

      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side={side}
          sideOffset={sideOffset}
          className="forge-tooltip"
          style={{
            padding: `var(--forge-space-1) var(--forge-space-2)`,
            backgroundColor: 'var(--forge-text)',
            color: 'var(--forge-bg)',
            borderRadius: 'var(--forge-radius-sm)',
            fontSize: 'var(--forge-font-size-xs)',
            fontFamily: 'var(--forge-font-sans)',
            lineHeight: 'var(--forge-line-height-xs)',
            maxWidth: '240px',
            zIndex: 'var(--forge-z-tooltip)',
            animation: `forge-tooltip-in var(--forge-duration-fast) var(--forge-easing-default)`,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          {content}
          <RadixTooltip.Arrow
            style={{
              fill: 'var(--forge-text)',
            }}
          />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>

      <style>{`
        @keyframes forge-tooltip-in {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </RadixTooltip.Root>
  )
}
