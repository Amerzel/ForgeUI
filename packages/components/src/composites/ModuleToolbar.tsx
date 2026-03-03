import { cn } from '../lib/cn.js'

export interface ModuleToolbarProps {
  /** Short code badge (e.g. "EA", "QF") */
  badge?: string
  /** Module title */
  title: string
  /** Content rendered after the title (view switchers, filters, etc.) */
  children?: React.ReactNode
  /** Content rendered on the right side after the spacer (context bar, action buttons) */
  actions?: React.ReactNode
  className?: string
}

export function ModuleToolbar({ badge, title, children, actions, className }: ModuleToolbarProps) {
  return (
    <div
      className={cn('forge-module-toolbar', className)}
      role="toolbar"
      aria-label={title}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--forge-space-2)',
        padding: 'var(--forge-space-2) var(--forge-space-4)',
        borderBottom: '1px solid var(--forge-border)',
        backgroundColor: 'var(--forge-surface)',
        minHeight: 44,
      }}
    >
      {/* Badge + title */}
      {badge && (
        <span
          style={{
            fontSize: 'var(--forge-font-size-xs)',
            fontWeight: 'var(--forge-font-bold)',
            fontFamily: 'var(--forge-font-mono)',
            color: 'var(--forge-text-on-accent)',
            backgroundColor: 'var(--forge-accent)',
            padding: '2px 6px',
            borderRadius: 'var(--forge-radius-sm)',
            flexShrink: 0,
          }}
        >
          {badge}
        </span>
      )}
      <span
        style={{
          fontSize: 'var(--forge-font-size-sm)',
          fontWeight: 'var(--forge-font-semibold)',
          color: 'var(--forge-text)',
          flexShrink: 0,
        }}
      >
        {title}
      </span>

      {/* Middle content */}
      {children && (
        <>
          <div
            style={{ width: 1, height: 20, backgroundColor: 'var(--forge-border)', flexShrink: 0 }}
          />
          {children}
        </>
      )}

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Right actions */}
      {actions}
    </div>
  )
}
