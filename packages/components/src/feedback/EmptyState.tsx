import { cn } from '../lib/cn.js'

export interface EmptyStateAction {
  label: string
  onClick: () => void
}

export interface EmptyStateProps {
  /** Large icon/emoji displayed at the top */
  icon?: React.ReactNode
  /** Main title */
  title: string
  /** Supporting description text */
  description?: string
  /** Primary call-to-action button */
  action?: EmptyStateAction
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn('forge-empty-state', className)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'var(--forge-space-12) var(--forge-space-6)',
        gap: 'var(--forge-space-3)',
      }}
    >
      {icon && (
        <div
          style={{ fontSize: '2rem', color: 'var(--forge-text-muted)', lineHeight: 1 }}
          aria-hidden="true"
        >
          {icon}
        </div>
      )}
      <span
        style={{
          fontSize: 'var(--forge-font-size-base)',
          fontWeight: 'var(--forge-font-semibold)',
          color: 'var(--forge-text)',
        }}
      >
        {title}
      </span>
      {description && (
        <span
          style={{
            fontSize: 'var(--forge-font-size-sm)',
            color: 'var(--forge-text-muted)',
            maxWidth: '36ch',
          }}
        >
          {description}
        </span>
      )}
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="forge-empty-state-action"
          style={{
            marginTop: 'var(--forge-space-2)',
            padding: 'var(--forge-space-2) var(--forge-space-4)',
            fontSize: 'var(--forge-font-size-sm)',
            fontWeight: 'var(--forge-font-medium)',
            color: 'var(--forge-text-on-accent)',
            backgroundColor: 'var(--forge-accent)',
            border: 'none',
            borderRadius: 'var(--forge-radius-md)',
            cursor: 'pointer',
            fontFamily: 'var(--forge-font-sans)',
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
