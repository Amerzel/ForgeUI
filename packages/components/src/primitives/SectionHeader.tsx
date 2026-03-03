import { cn } from '../lib/cn.js'

export interface SectionHeaderProps {
  /** The section label text */
  children: React.ReactNode
  /** Optional description below the label */
  description?: string
  /** Optional action element rendered to the right */
  action?: React.ReactNode
  className?: string
}

export function SectionHeader({ children, description, action, className }: SectionHeaderProps) {
  return (
    <div
      className={cn('forge-section-header', className)}
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--forge-space-1)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--forge-space-2)' }}>
        <span
          style={{
            fontSize: 'var(--forge-font-size-xs)',
            fontWeight: 'var(--forge-font-medium)',
            color: 'var(--forge-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontFamily: 'var(--forge-font-mono)',
          }}
        >
          {children}
        </span>
        {action && (
          <>
            <div style={{ flex: 1 }} />
            {action}
          </>
        )}
      </div>
      {description && (
        <span
          style={{
            fontSize: 'var(--forge-font-size-xs)',
            color: 'var(--forge-text-muted)',
          }}
        >
          {description}
        </span>
      )}
    </div>
  )
}
