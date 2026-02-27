import { cn } from '../lib/cn.js'

export interface NavItemProps {
  /** Display label */
  label: string
  /** Emoji or icon element shown before the label */
  icon?: React.ReactNode
  /** Whether this item is currently selected */
  active?: boolean
  /** Optional count badge rendered to the right */
  count?: number
  /** Disables interaction */
  disabled?: boolean
  onClick?: () => void
  className?: string
}

export function NavItem({
  label,
  icon,
  active = false,
  count,
  disabled = false,
  onClick,
  className,
}: NavItemProps) {
  return (
    <button
      type="button"
      aria-current={active ? 'page' : undefined}
      disabled={disabled}
      onClick={onClick}
      className={cn('forge-nav-item', className)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--forge-space-2)',
        width: '100%',
        padding: 'var(--forge-space-2)',
        border: 'none',
        borderRadius: 'var(--forge-radius-sm)',
        backgroundColor: active ? 'var(--forge-accent)' : 'transparent',
        color: active ? 'var(--forge-text-on-accent)' : 'var(--forge-text)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        fontSize: 'var(--forge-font-size-sm)',
        fontFamily: 'var(--forge-font-sans)',
        fontWeight: active ? 'var(--forge-font-medium)' : 'var(--forge-font-normal)',
        textAlign: 'left',
        transition: 'background-color 0.1s, color 0.1s',
      }}
    >
      {icon && (
        <span style={{ width: 20, textAlign: 'center', flexShrink: 0, opacity: active ? 1 : 0.55, fontSize: 'var(--forge-font-size-sm)' }} aria-hidden="true">
          {icon}
        </span>
      )}
      <span style={{ flex: 1 }}>{label}</span>
      {count !== undefined && (
        <span style={{
          fontSize: '10px',
          fontWeight: 'var(--forge-font-medium)',
          minWidth: 20,
          textAlign: 'center',
          padding: '1px 6px',
          borderRadius: 'var(--forge-radius-full)',
          backgroundColor: active
            ? 'color-mix(in srgb, var(--forge-text-on-accent) 20%, transparent)'
            : 'color-mix(in srgb, var(--forge-text-muted) 15%, transparent)',
          color: active ? 'var(--forge-text-on-accent)' : 'var(--forge-text-muted)',
        }} aria-label={`${count} items`}>{count}</span>
      )}
    </button>
  )
}
