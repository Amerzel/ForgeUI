import * as RadixDialog from '@radix-ui/react-dialog'
import { usePortalContainer } from '@forgeui/hooks'
import { cn } from '../lib/cn.js'

type DrawerSide = 'left' | 'right' | 'top' | 'bottom'

interface DrawerProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
  title: string
  description?: string
  side?: DrawerSide
  /** Width (left/right) or height (top/bottom). Default: 320px */
  size?: string
  children: React.ReactNode
  className?: string
}

const SIDE_STYLE: Record<DrawerSide, React.CSSProperties> = {
  left: {
    top: 0,
    left: 0,
    bottom: 0,
    width: 'var(--forge-drawer-size)',
    maxWidth: '90vw',
    height: '100%',
    borderRight: '1px solid var(--forge-border)',
    borderRadius: '0 var(--forge-radius-lg) var(--forge-radius-lg) 0',
  },
  right: {
    top: 0,
    right: 0,
    bottom: 0,
    width: 'var(--forge-drawer-size)',
    maxWidth: '90vw',
    height: '100%',
    borderLeft: '1px solid var(--forge-border)',
    borderRadius: 'var(--forge-radius-lg) 0 0 var(--forge-radius-lg)',
  },
  top: {
    top: 0,
    left: 0,
    right: 0,
    height: 'var(--forge-drawer-size)',
    maxHeight: '90vh',
    width: '100%',
    borderBottom: '1px solid var(--forge-border)',
    borderRadius: '0 0 var(--forge-radius-lg) var(--forge-radius-lg)',
  },
  bottom: {
    bottom: 0,
    left: 0,
    right: 0,
    height: 'var(--forge-drawer-size)',
    maxHeight: '90vh',
    width: '100%',
    borderTop: '1px solid var(--forge-border)',
    borderRadius: 'var(--forge-radius-lg) var(--forge-radius-lg) 0 0',
  },
}

const ANIMATION: Record<DrawerSide, string> = {
  left: 'forge-drawer-slide-left',
  right: 'forge-drawer-slide-right',
  top: 'forge-drawer-slide-top',
  bottom: 'forge-drawer-slide-bottom',
}

export function Drawer({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  side = 'right',
  size = '320px',
  children,
  className,
}: DrawerProps) {
  const portalContainer = usePortalContainer()
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>}

      <RadixDialog.Portal container={portalContainer}>
        <RadixDialog.Overlay
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 'var(--forge-z-overlay)',
            animation: `forge-overlay-in var(--forge-duration-normal) var(--forge-easing-default)`,
          }}
        />

        <RadixDialog.Content
          className={cn('forge-drawer', className)}
          style={
            {
              position: 'fixed',
              zIndex: 'var(--forge-z-modal)',
              backgroundColor: 'var(--forge-surface-popover)',
              boxShadow: 'var(--forge-shadow-xl)',
              display: 'flex',
              flexDirection: 'column',
              outline: 'none',
              '--forge-drawer-size': size,
              animation: `${ANIMATION[side]} var(--forge-duration-normal) var(--forge-easing-default)`,
              ...SIDE_STYLE[side],
            } as React.CSSProperties
          }
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              padding: 'var(--forge-space-5) var(--forge-space-6) var(--forge-space-4)',
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
                  margin: 0,
                }}
              >
                {title}
              </RadixDialog.Title>
              {description ? (
                <RadixDialog.Description
                  style={{
                    marginTop: 'var(--forge-space-1)',
                    fontSize: 'var(--forge-font-size-sm)',
                    color: 'var(--forge-text-muted)',
                    margin: 0,
                  }}
                >
                  {description}
                </RadixDialog.Description>
              ) : (
                <RadixDialog.Description style={{ display: 'none' }}>
                  {title}
                </RadixDialog.Description>
              )}
            </div>
            <RadixDialog.Close
              aria-label="Close drawer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
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
          <div style={{ flex: '1 1 auto', overflowY: 'auto', padding: 'var(--forge-space-6)' }}>
            {children}
          </div>
        </RadixDialog.Content>
      </RadixDialog.Portal>

      <style>{`
        @keyframes forge-overlay-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes forge-drawer-slide-right  { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes forge-drawer-slide-left   { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        @keyframes forge-drawer-slide-bottom { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes forge-drawer-slide-top    { from { transform: translateY(-100%); } to { transform: translateY(0); } }
      `}</style>
    </RadixDialog.Root>
  )
}
