import { cn } from '../lib/cn.js'

export type StatCardColor = 'accent' | 'info' | 'success' | 'warning' | 'danger'

export interface StatCardProps {
  /** Short uppercase label above the value */
  label: string
  /** The main value to display (number or string) */
  value: string | number
  /** Trend indicator, e.g. "+3" or "-12%" */
  delta?: string
  /** Emoji or icon string shown beside the label */
  icon?: string
  /** Semantic color applied to the value */
  color?: StatCardColor
  /** Makes the card clickable */
  onClick?: () => void
  className?: string
}

const DELTA_COLOR: Record<string, string> = {
  '+': 'var(--forge-success)',
  '-': 'var(--forge-danger)',
}

export function StatCard({ label, value, delta, icon, color, onClick, className }: StatCardProps) {
  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick()
              }
            }
          : undefined
      }
      className={cn('forge-stat-card', className)}
      style={{
        padding: 'var(--forge-space-4)',
        borderRadius: 'var(--forge-radius-md)',
        border: '1px solid var(--forge-border)',
        backgroundColor: 'var(--forge-surface)',
        cursor: onClick ? 'pointer' : undefined,
        transition: 'border-color 0.15s, background-color 0.15s',
      }}
    >
      {/* Label row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--forge-space-2)',
          marginBottom: 'var(--forge-space-2)',
        }}
      >
        {icon && (
          <span style={{ fontSize: 'var(--forge-font-size-sm)', opacity: 0.6 }} aria-hidden="true">
            {icon}
          </span>
        )}
        <span
          style={{
            fontSize: 'var(--forge-font-size-xs)',
            color: 'var(--forge-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 'var(--forge-font-medium)',
          }}
        >
          {label}
        </span>
      </div>

      {/* Value row */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--forge-space-2)' }}>
        <span
          style={{
            fontSize: 'var(--forge-font-size-2xl)',
            fontWeight: 'var(--forge-font-bold)',
            color: color ? `var(--forge-${color})` : 'var(--forge-text)',
            lineHeight: 1,
          }}
        >
          {value}
        </span>
        {delta && (
          <span
            style={{
              fontSize: 'var(--forge-font-size-xs)',
              fontWeight: 'var(--forge-font-medium)',
              color: DELTA_COLOR[delta.charAt(0)] ?? 'var(--forge-text-muted)',
              padding: '1px 6px',
              borderRadius: 'var(--forge-radius-sm)',
              backgroundColor: `color-mix(in srgb, ${DELTA_COLOR[delta.charAt(0)] ?? 'var(--forge-text-muted)'} 12%, transparent)`,
            }}
          >
            {delta}
          </span>
        )}
      </div>
    </div>
  )
}
