import { cn } from '../lib/cn.js'

export type HealthStatus = 'ok' | 'warn' | 'error' | 'running' | 'idle'

export interface HealthRowProps {
  /** Display name for this health item */
  name: string
  /** Current status — drives the indicator dot color */
  status: HealthStatus
  /** Detail text shown on the right */
  detail: string
  /** Optional icon/emoji shown before the name */
  icon?: string
  className?: string
}

const STATUS_COLOR: Record<HealthStatus, string> = {
  ok:      'var(--forge-success)',
  warn:    'var(--forge-warning)',
  error:   'var(--forge-danger)',
  running: 'var(--forge-info)',
  idle:    'var(--forge-border)',
}

const STATUS_LABEL: Record<HealthStatus, string> = {
  ok:      'Healthy',
  warn:    'Warning',
  error:   'Error',
  running: 'Running',
  idle:    'Idle',
}

export function HealthRow({ name, status, detail, icon, className }: HealthRowProps) {
  return (
    <div
      className={cn('forge-health-row', className)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--forge-space-3)',
        padding: 'var(--forge-space-1) 0',
        borderBottom: '1px solid color-mix(in srgb, var(--forge-border) 40%, transparent)',
      }}
    >
      {/* Status dot */}
      <div
        role="status"
        aria-label={`${name}: ${STATUS_LABEL[status]}`}
        style={{
          width: 8,
          height: 8,
          borderRadius: 'var(--forge-radius-full)',
          backgroundColor: STATUS_COLOR[status],
          flexShrink: 0,
          ...(status === 'running' ? { animation: 'forge-pulse 1.5s ease-in-out infinite' } : {}),
        }}
      />

      {/* Icon */}
      {icon && (
        <span style={{ fontSize: 'var(--forge-font-size-sm)', opacity: 0.6, width: 20, textAlign: 'center', flexShrink: 0 }} aria-hidden="true">
          {icon}
        </span>
      )}

      {/* Name */}
      <span style={{ flex: 1, fontSize: 'var(--forge-font-size-sm)', color: 'var(--forge-text)' }}>
        {name}
      </span>

      {/* Spinner for running */}
      {status === 'running' && (
        <svg width="14" height="14" viewBox="0 0 14 14" style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }} aria-hidden="true">
          <circle cx="7" cy="7" r="5.5" fill="none" stroke="var(--forge-border)" strokeWidth="2" />
          <path d="M7 1.5A5.5 5.5 0 0 1 12.5 7" fill="none" stroke="var(--forge-info)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}

      {/* Detail */}
      <span style={{
        fontSize: 'var(--forge-font-size-xs)',
        color: 'var(--forge-text-muted)',
        fontFamily: 'var(--forge-font-mono)',
        flexShrink: 0,
      }}>{detail}</span>
    </div>
  )
}
