import * as RadixToast from '@radix-ui/react-toast'
import { cn } from '../lib/cn.js'

export type ToastVariant = 'default' | 'success' | 'warning' | 'danger'

export interface ToastItem {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastProviderProps {
  children: React.ReactNode
  /** Maximum number of toasts visible at once */
  maxToasts?: number
}

interface ToastListProps {
  toasts: ToastItem[]
  onDismiss: (id: string) => void
  className?: string
}

const VARIANT_STYLE: Record<ToastVariant, { border: string; icon: string }> = {
  default: { border: 'var(--forge-border)', icon: 'var(--forge-text-muted)' },
  success: {
    border: 'color-mix(in srgb, var(--forge-success) 50%, transparent)',
    icon: 'var(--forge-success)',
  },
  warning: {
    border: 'color-mix(in srgb, var(--forge-warning) 50%, transparent)',
    icon: 'var(--forge-warning)',
  },
  danger: {
    border: 'color-mix(in srgb, var(--forge-danger) 50%, transparent)',
    icon: 'var(--forge-danger)',
  },
}

/**
 * Wrap your app (or relevant subtree) with ToastProvider.
 * Render <ToastList> somewhere near the root to display toasts.
 */
export function ToastProvider({ children, maxToasts: _maxToasts = 5 }: ToastProviderProps) {
  return (
    <RadixToast.Provider swipeDirection="right" duration={4000}>
      {children}
    </RadixToast.Provider>
  )
}

/**
 * Renders the active toast list. Place once per ToastProvider subtree,
 * typically at the bottom of the layout.
 */
export function ToastList({ toasts, onDismiss, className }: ToastListProps) {
  return (
    <>
      {toasts.map((toast) => {
        const variant = toast.variant ?? 'default'
        const variantStyle = VARIANT_STYLE[variant]

        return (
          <RadixToast.Root
            key={toast.id}
            open={true}
            onOpenChange={(open) => {
              if (!open) onDismiss(toast.id)
            }}
            duration={toast.duration}
            className={cn('forge-toast', className)}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--forge-space-3)',
              padding: 'var(--forge-space-3) var(--forge-space-4)',
              backgroundColor: 'var(--forge-surface-popover)',
              border: `1px solid ${variantStyle.border}`,
              borderRadius: 'var(--forge-radius-md)',
              boxShadow: 'var(--forge-shadow-lg)',
              minWidth: '280px',
              maxWidth: '420px',
            }}
          >
            <div style={{ flex: '1 1 auto', minWidth: 0 }}>
              <RadixToast.Title
                style={{
                  fontWeight: 'var(--forge-font-semibold)',
                  fontSize: 'var(--forge-font-size-base)',
                  color: 'var(--forge-text)',
                  marginBottom: toast.description ? 'var(--forge-space-1)' : undefined,
                }}
              >
                {toast.title}
              </RadixToast.Title>
              {toast.description && (
                <RadixToast.Description
                  style={{
                    fontSize: 'var(--forge-font-size-sm)',
                    color: 'var(--forge-text-muted)',
                    lineHeight: 'var(--forge-line-height-base)',
                  }}
                >
                  {toast.description}
                </RadixToast.Description>
              )}
              {toast.action && (
                <RadixToast.Action altText={toast.action.label} asChild>
                  <button
                    type="button"
                    onClick={toast.action.onClick}
                    style={{
                      marginTop: 'var(--forge-space-2)',
                      padding: `var(--forge-space-1) var(--forge-space-2)`,
                      background: 'transparent',
                      border: `1px solid var(--forge-border)`,
                      borderRadius: 'var(--forge-radius-sm)',
                      fontSize: 'var(--forge-font-size-xs)',
                      color: 'var(--forge-accent)',
                      cursor: 'pointer',
                      fontFamily: 'var(--forge-font-sans)',
                      fontWeight: 'var(--forge-font-medium)',
                      outline: 'none',
                    }}
                  >
                    {toast.action.label}
                  </button>
                </RadixToast.Action>
              )}
            </div>

            <RadixToast.Close
              aria-label="Dismiss"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20px',
                height: '20px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--forge-text-muted)',
                borderRadius: 'var(--forge-radius-sm)',
                padding: 0,
                flexShrink: 0,
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
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path
                  d="M1 1l10 10M11 1L1 11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </RadixToast.Close>
          </RadixToast.Root>
        )
      })}

      <RadixToast.Viewport
        style={{
          position: 'fixed',
          bottom: 'var(--forge-space-6)',
          right: 'var(--forge-space-6)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--forge-space-2)',
          zIndex: 'var(--forge-z-toast)',
          outline: 'none',
          maxHeight: '100vh',
        }}
      />
    </>
  )
}
