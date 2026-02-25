import { cn } from '../lib/cn.js'

type ProgressVariant = 'default' | 'success' | 'warning' | 'danger'
type ProgressSize = 'sm' | 'md' | 'lg'

interface ProgressProps {
  /** 0–100. Undefined = indeterminate */
  value?: number
  max?: number
  variant?: ProgressVariant
  size?: ProgressSize
  /** Visible label above the bar */
  label?: string
  /** Show percentage text next to label */
  showValue?: boolean
  className?: string
}

const HEIGHT: Record<ProgressSize, string> = {
  sm: '4px',
  md: '8px',
  lg: '12px',
}

const TRACK_COLOR: Record<ProgressVariant, string> = {
  default: 'var(--forge-accent)',
  success: 'var(--forge-success)',
  warning: 'var(--forge-warning)',
  danger: 'var(--forge-danger)',
}

export function Progress({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  label,
  showValue = false,
  className,
}: ProgressProps) {
  const percentage = value !== undefined ? Math.min(100, Math.max(0, (value / max) * 100)) : undefined
  const isIndeterminate = value === undefined

  return (
    <div className={cn('forge-progress', className)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--forge-space-1)' }}>
      {(label || showValue) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {label && (
            <span style={{ fontSize: 'var(--forge-font-size-sm)', color: 'var(--forge-text-muted)' }}>
              {label}
            </span>
          )}
          {showValue && percentage !== undefined && (
            <span style={{ fontSize: 'var(--forge-font-size-xs)', color: 'var(--forge-text-muted)', fontFamily: 'var(--forge-font-mono)' }}>
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      <div
        role="progressbar"
        aria-valuenow={percentage !== undefined ? Math.round(percentage) : undefined}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? (isIndeterminate ? 'Loading' : undefined)}
        style={{
          position: 'relative',
          width: '100%',
          height: HEIGHT[size],
          backgroundColor: 'var(--forge-border)',
          borderRadius: 'var(--forge-radius-full)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: isIndeterminate ? '40%' : `${percentage}%`,
            backgroundColor: TRACK_COLOR[variant],
            borderRadius: 'var(--forge-radius-full)',
            transition: isIndeterminate ? undefined : `width var(--forge-duration-normal) var(--forge-easing-default)`,
            animation: isIndeterminate ? 'forge-progress-indeterminate 1.5s ease-in-out infinite' : undefined,
          }}
        />
        <style>{`
          @keyframes forge-progress-indeterminate {
            0%   { left: -40%; }
            100% { left: 100%; }
          }
        `}</style>
      </div>
    </div>
  )
}
