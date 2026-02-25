import { cn } from '../lib/cn.js'

type AlertVariant = 'info' | 'success' | 'warning' | 'danger'

interface AlertProps {
  variant?: AlertVariant
  title?: string
  children: React.ReactNode
  /** When true, renders with role="alert" and aria-live="assertive" */
  live?: boolean
  onDismiss?: () => void
  className?: string
}

const VARIANT_TOKENS: Record<AlertVariant, { bg: string; border: string; icon: string; iconPath: string }> = {
  info: {
    bg: 'color-mix(in srgb, var(--forge-info) 10%, transparent)',
    border: 'color-mix(in srgb, var(--forge-info) 40%, transparent)',
    icon: 'var(--forge-info)',
    iconPath: 'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 5v6m0 4h.01',
  },
  success: {
    bg: 'color-mix(in srgb, var(--forge-success) 10%, transparent)',
    border: 'color-mix(in srgb, var(--forge-success) 40%, transparent)',
    icon: 'var(--forge-success)',
    iconPath: 'M9 12l2 2 4-4m6 2a10 10 0 1 1-20 0 10 10 0 0 1 20 0z',
  },
  warning: {
    bg: 'color-mix(in srgb, var(--forge-warning) 10%, transparent)',
    border: 'color-mix(in srgb, var(--forge-warning) 40%, transparent)',
    icon: 'var(--forge-warning)',
    iconPath: 'M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z',
  },
  danger: {
    bg: 'color-mix(in srgb, var(--forge-danger) 10%, transparent)',
    border: 'color-mix(in srgb, var(--forge-danger) 40%, transparent)',
    icon: 'var(--forge-danger)',
    iconPath: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
  },
}

export function Alert({
  variant = 'info',
  title,
  children,
  live = false,
  onDismiss,
  className,
}: AlertProps) {
  const tokens = VARIANT_TOKENS[variant]

  return (
    <div
      role={live ? 'alert' : 'region'}
      aria-live={live ? 'assertive' : undefined}
      aria-label={live ? undefined : title}
      className={cn('forge-alert', className)}
      style={{
        display: 'flex',
        gap: 'var(--forge-space-3)',
        padding: 'var(--forge-space-3) var(--forge-space-4)',
        backgroundColor: tokens.bg,
        border: `1px solid ${tokens.border}`,
        borderRadius: 'var(--forge-radius-md)',
        lineHeight: 'var(--forge-line-height-base)',
      }}
    >
      {/* Icon */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        style={{ flexShrink: 0, marginTop: '2px', color: tokens.icon }}
      >
        <path
          d={tokens.iconPath}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Body */}
      <div style={{ flex: '1 1 auto', minWidth: 0 }}>
        {title && (
          <div
            style={{
              fontWeight: 'var(--forge-font-semibold)',
              fontSize: 'var(--forge-font-size-base)',
              color: 'var(--forge-text)',
              marginBottom: children ? 'var(--forge-space-1)' : undefined,
            }}
          >
            {title}
          </div>
        )}
        <div style={{ fontSize: 'var(--forge-font-size-sm)', color: 'var(--forge-text-muted)' }}>
          {children}
        </div>
      </div>

      {/* Dismiss */}
      {onDismiss && (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onDismiss}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            width: '20px',
            height: '20px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--forge-text-muted)',
            borderRadius: 'var(--forge-radius-sm)',
            padding: 0,
            outline: 'none',
            alignSelf: 'flex-start',
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline = 'var(--forge-focus-ring-width) solid var(--forge-focus-ring-color)'
          }}
          onBlur={(e) => { e.currentTarget.style.outline = 'none' }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      )}
    </div>
  )
}
