import { cn } from '../lib/cn.js'

export type StepStatus = 'pending' | 'active' | 'completed' | 'error'

export interface Step {
  label: string
  description?: string
  status: StepStatus
}

interface StepsProps {
  steps: Step[]
  className?: string
}

const STATUS_ICON: Record<StepStatus, React.ReactNode> = {
  pending: null,
  active: null,
  completed: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M1 6l3 3 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  error: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
}

const STATUS_COLOR: Record<StepStatus, string> = {
  pending:   'var(--forge-border)',
  active:    'var(--forge-accent)',
  completed: 'var(--forge-success)',
  error:     'var(--forge-danger)',
}

const STATUS_TEXT: Record<StepStatus, string> = {
  pending:   'var(--forge-text-muted)',
  active:    'var(--forge-text)',
  completed: 'var(--forge-text-muted)',
  error:     'var(--forge-danger)',
}

export function Steps({ steps, className }: StepsProps) {
  return (
    <ol
      className={cn('forge-steps', className)}
      aria-label="Progress steps"
      style={{ display: 'flex', alignItems: 'flex-start', gap: 0, listStyle: 'none', padding: 0, margin: 0 }}
    >
      {steps.map((step, i) => {
        const color = STATUS_COLOR[step.status]
        const isLast = i === steps.length - 1
        return (
          <li
            key={i}
            aria-current={step.status === 'active' ? 'step' : undefined}
            style={{ display: 'flex', flex: isLast ? '0 0 auto' : '1 1 0', flexDirection: 'column', alignItems: 'center' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              {/* Circle */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  flexShrink: 0,
                  borderRadius: 'var(--forge-radius-full)',
                  backgroundColor: step.status === 'pending' ? 'transparent' : color,
                  border: `2px solid ${color}`,
                  color: step.status === 'pending' ? 'var(--forge-text-muted)' : '#fff',
                  fontSize: 'var(--forge-font-size-xs)',
                  fontWeight: 'var(--forge-font-semibold)',
                  fontFamily: 'var(--forge-font-mono)',
                }}
              >
                {STATUS_ICON[step.status] ?? String(i + 1)}
              </div>
              {/* Connector */}
              {!isLast && (
                <div style={{
                  flex: '1 1 auto',
                  height: '2px',
                  backgroundColor: (step.status === 'completed' || step.status === 'error') ? color : 'var(--forge-border)',
                  transition: `background-color var(--forge-duration-normal) var(--forge-easing-default)`,
                }} />
              )}
            </div>
            {/* Label */}
            <div style={{ marginTop: 'var(--forge-space-2)', textAlign: 'center', maxWidth: '100px' }}>
              <div style={{ fontSize: 'var(--forge-font-size-sm)', fontWeight: step.status === 'active' ? 'var(--forge-font-semibold)' : undefined, color: STATUS_TEXT[step.status] }}>
                {step.label}
              </div>
              {step.description && (
                <div style={{ fontSize: 'var(--forge-font-size-xs)', color: 'var(--forge-text-muted)', marginTop: 'var(--forge-space-0-5)' }}>
                  {step.description}
                </div>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
