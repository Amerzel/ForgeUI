import * as RadixDialog from '@radix-ui/react-dialog'
import { usePortalContainer } from '@forgeui/hooks'
import { cn } from '../lib/cn.js'

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Trigger element — rendered inline, opens dialog on click */
  trigger?: React.ReactNode
  title: string
  description?: string
  children: React.ReactNode
  /** Width of the dialog panel. Default: '480px' */
  width?: string
  /** When true, dialog fills most of the viewport height */
  fullHeight?: boolean
  className?: string
}

export function Dialog({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  width = '480px',
  fullHeight = false,
  className,
}: DialogProps) {
  const portalContainer = usePortalContainer()
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>}

      <RadixDialog.Portal container={portalContainer}>
        {/* Overlay */}
        <RadixDialog.Overlay
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 'var(--forge-z-overlay)',
            animation: `forge-overlay-in var(--forge-duration-normal) var(--forge-easing-default)`,
          }}
        />

        {/* Content */}
        <RadixDialog.Content
          className={cn('forge-dialog', className)}
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width,
            maxWidth: 'calc(100vw - 2rem)',
            maxHeight: fullHeight ? 'calc(100vh - 4rem)' : '85vh',
            backgroundColor: 'var(--forge-surface-popover)',
            border: '1px solid var(--forge-border)',
            borderRadius: 'var(--forge-radius-lg)',
            boxShadow: 'var(--forge-shadow-xl)',
            zIndex: 'var(--forge-z-modal)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: `forge-dialog-in var(--forge-duration-normal) var(--forge-easing-default)`,
            outline: 'none',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 'var(--forge-space-3)',
              padding: `var(--forge-space-5) var(--forge-space-6) var(--forge-space-4)`,
              borderBottom: '1px solid var(--forge-border)',
              flexShrink: 0,
            }}
          >
            <div>
              <RadixDialog.Title
                style={{
                  fontSize: 'var(--forge-font-size-lg)',
                  fontWeight: 'var(--forge-font-semibold)',
                  color: 'var(--forge-text)',
                  lineHeight: 'var(--forge-line-height-sm)',
                  margin: 0,
                }}
              >
                {title}
              </RadixDialog.Title>
              {description && (
                <RadixDialog.Description
                  style={{
                    marginTop: 'var(--forge-space-1)',
                    fontSize: 'var(--forge-font-size-sm)',
                    color: 'var(--forge-text-muted)',
                    lineHeight: 'var(--forge-line-height-base)',
                    margin: 0,
                  }}
                >
                  {description}
                </RadixDialog.Description>
              )}
              {/* Hidden description required by Radix to prevent a11y warning */}
              {!description && (
                <RadixDialog.Description style={{ display: 'none' }}>
                  {title}
                </RadixDialog.Description>
              )}
            </div>

            <RadixDialog.Close
              aria-label="Close dialog"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                width: '28px',
                height: '28px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--forge-text-muted)',
                borderRadius: 'var(--forge-radius-sm)',
                outline: 'none',
              }}
              onFocus={(e) => {
                e.currentTarget.style.outline =
                  'var(--forge-focus-ring-width) solid var(--forge-focus-ring-color)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.outline = 'none'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M1 1l12 12M13 1L1 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </RadixDialog.Close>
          </div>

          {/* Body */}
          <div
            style={{
              flex: '1 1 auto',
              overflowY: 'auto',
              padding: 'var(--forge-space-6)',
            }}
          >
            {children}
          </div>
        </RadixDialog.Content>
      </RadixDialog.Portal>

      <style>{`
        @keyframes forge-overlay-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes forge-dialog-in {
          from { opacity: 0; transform: translate(-50%, -48%) scale(0.97); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </RadixDialog.Root>
  )
}
