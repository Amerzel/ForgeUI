import { cn } from '../lib/cn.js'

export interface GenerationJob {
  /** Job identifier */
  id: string
  /** Display label */
  label: string
  /** Job status */
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled'
  /** Progress 0-100 for multi-step jobs */
  progress?: number
  /** Unix timestamp when job started */
  startedAt?: number
  /** Unix timestamp when job completed */
  completedAt?: number
  /** Error message for failed jobs */
  error?: string
  /** Number of API calls used by this job */
  apiCalls?: number
  /** Estimated cost in cents */
  estimatedCost?: number
}

export interface GenerationQueueProps {
  /** Current jobs */
  jobs: GenerationJob[]
  /** Total API calls this session */
  totalApiCalls?: number
  /** Total cost in cents this session */
  totalCost?: number
  /** Budget ceiling in cents (warning at 80%, red at 100%) */
  budgetCeiling?: number
  /** Cancel a queued job */
  onCancel?: (jobId: string) => void
  /** Retry a failed job */
  onRetry?: (jobId: string) => void
  /** Compact (status bar) vs expanded (full list). Default: 'compact' */
  variant?: 'compact' | 'expanded'
  /** Custom cost display formatter. Default: cents → "$X.XX" */
  costFormat?: (cents: number) => string
  className?: string
  style?: React.CSSProperties
}

const STATUS_COLORS: Record<GenerationJob['status'], string> = {
  queued: 'var(--forge-text-muted)',
  running: 'var(--forge-accent)',
  completed: 'var(--forge-success)',
  failed: 'var(--forge-danger)',
  cancelled: 'var(--forge-text-disabled)',
}

const STATUS_ICONS: Record<GenerationJob['status'], string> = {
  queued: '◌',
  running: '⟳',
  completed: '✓',
  failed: '✕',
  cancelled: '—',
}

function defaultCostFormat(cents: number): string {
  return '$' + (cents / 100).toFixed(2)
}

function formatElapsed(startedAt: number, completedAt?: number): string {
  const end = completedAt ?? Date.now()
  const ms = end - startedAt
  if (ms < 1000) return `${Math.round(ms)}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

function countByStatus(jobs: GenerationJob[]) {
  const counts = { queued: 0, running: 0, completed: 0, failed: 0, cancelled: 0 }
  for (const job of jobs) {
    counts[job.status]++
  }
  return counts
}

function BudgetIndicator({
  totalCost,
  budgetCeiling,
  costFormat,
}: {
  totalCost: number
  budgetCeiling: number
  costFormat: (cents: number) => string
}) {
  const pct = totalCost / budgetCeiling
  const color =
    pct >= 1
      ? 'var(--forge-danger)'
      : pct >= 0.8
        ? 'var(--forge-warning)'
        : 'var(--forge-text-muted)'

  return (
    <span style={{ color, fontSize: 'var(--forge-font-size-xs)', fontWeight: 500 }}>
      {costFormat(totalCost)} / {costFormat(budgetCeiling)}
      {pct >= 1 && ' ⚠ over budget'}
    </span>
  )
}

/* ===================================================================
 * Compact variant — single status bar
 * =================================================================== */
function CompactQueue({
  jobs,
  totalCost,
  budgetCeiling,
  costFormat,
}: {
  jobs: GenerationJob[]
  totalCost?: number
  budgetCeiling?: number
  costFormat: (cents: number) => string
}) {
  const counts = countByStatus(jobs)
  const parts: string[] = []
  if (counts.running > 0) parts.push(`${counts.running} running`)
  if (counts.queued > 0) parts.push(`${counts.queued} queued`)
  if (counts.completed > 0) parts.push(`${counts.completed} completed`)
  if (counts.failed > 0) parts.push(`${counts.failed} failed`)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--forge-space-3)',
        padding: 'var(--forge-space-2) var(--forge-space-3)',
        fontSize: 'var(--forge-font-size-xs)',
        color: 'var(--forge-text-muted)',
      }}
    >
      {/* Status summary */}
      <span>{parts.join(', ') || 'No jobs'}</span>

      {/* Cost */}
      {totalCost !== undefined && budgetCeiling !== undefined ? (
        <BudgetIndicator
          totalCost={totalCost}
          budgetCeiling={budgetCeiling}
          costFormat={costFormat}
        />
      ) : totalCost !== undefined ? (
        <span style={{ fontFamily: 'var(--forge-font-mono)' }}>{costFormat(totalCost)}</span>
      ) : null}

      {/* Running indicator */}
      {counts.running > 0 && (
        <span
          style={{
            display: 'inline-block',
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: 'var(--forge-accent)',
            animation: 'forge-queue-pulse 1.5s ease-in-out infinite',
          }}
        />
      )}
    </div>
  )
}

/* ===================================================================
 * Expanded variant — full job list
 * =================================================================== */
function ExpandedQueue({
  jobs,
  totalCost,
  totalApiCalls,
  budgetCeiling,
  costFormat,
  onCancel,
  onRetry,
}: {
  jobs: GenerationJob[]
  totalCost?: number
  totalApiCalls?: number
  budgetCeiling?: number
  costFormat: (cents: number) => string
  onCancel?: (jobId: string) => void
  onRetry?: (jobId: string) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--forge-space-2)' }}>
      {/* Summary header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--forge-space-2) var(--forge-space-3)',
          borderBottom: '1px solid var(--forge-border)',
          fontSize: 'var(--forge-font-size-xs)',
          color: 'var(--forge-text-muted)',
        }}
      >
        <span>{jobs.length} jobs</span>
        <div style={{ display: 'flex', gap: 'var(--forge-space-3)', alignItems: 'center' }}>
          {totalApiCalls !== undefined && <span>{totalApiCalls} API calls</span>}
          {totalCost !== undefined && budgetCeiling !== undefined ? (
            <BudgetIndicator
              totalCost={totalCost}
              budgetCeiling={budgetCeiling}
              costFormat={costFormat}
            />
          ) : totalCost !== undefined ? (
            <span style={{ fontFamily: 'var(--forge-font-mono)' }}>{costFormat(totalCost)}</span>
          ) : null}
        </div>
      </div>

      {/* Job list */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--forge-space-1)',
          padding: '0 var(--forge-space-2)',
          maxHeight: 300,
          overflowY: 'auto',
        }}
      >
        {jobs.map((job) => (
          <div
            key={job.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--forge-space-2)',
              padding: 'var(--forge-space-1) var(--forge-space-2)',
              borderRadius: 'var(--forge-radius-sm)',
              fontSize: 'var(--forge-font-size-xs)',
            }}
          >
            {/* Status icon */}
            <span
              style={{
                color: STATUS_COLORS[job.status],
                fontWeight: 600,
                width: 16,
                textAlign: 'center',
                flexShrink: 0,
              }}
            >
              {STATUS_ICONS[job.status]}
            </span>

            {/* Label */}
            <span
              style={{
                flex: '1 1 auto',
                color: 'var(--forge-text)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {job.label}
            </span>

            {/* Progress bar */}
            {job.status === 'running' && job.progress !== undefined && (
              <div
                role="progressbar"
                aria-valuenow={job.progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${job.label} progress`}
                style={{
                  width: 60,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: 'var(--forge-border)',
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: `${job.progress}%`,
                    height: '100%',
                    backgroundColor: 'var(--forge-accent)',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            )}

            {/* Elapsed time */}
            {job.startedAt !== undefined && (
              <span
                style={{
                  fontFamily: 'var(--forge-font-mono)',
                  color: 'var(--forge-text-muted)',
                  flexShrink: 0,
                }}
              >
                {formatElapsed(job.startedAt, job.completedAt)}
              </span>
            )}

            {/* Error */}
            {job.status === 'failed' && job.error && (
              <span
                style={{
                  color: 'var(--forge-danger)',
                  maxWidth: 120,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                title={job.error}
              >
                {job.error}
              </span>
            )}

            {/* Actions */}
            {job.status === 'queued' && onCancel && (
              <button
                type="button"
                aria-label={`Cancel ${job.label}`}
                onClick={() => onCancel(job.id)}
                style={{
                  padding: '1px var(--forge-space-1)',
                  border: '1px solid var(--forge-border)',
                  borderRadius: 'var(--forge-radius-sm)',
                  backgroundColor: 'transparent',
                  color: 'var(--forge-text-muted)',
                  cursor: 'pointer',
                  fontSize: '10px',
                  flexShrink: 0,
                }}
              >
                Cancel
              </button>
            )}
            {job.status === 'failed' && onRetry && (
              <button
                type="button"
                aria-label={`Retry ${job.label}`}
                onClick={() => onRetry(job.id)}
                style={{
                  padding: '1px var(--forge-space-1)',
                  border: '1px solid var(--forge-accent)',
                  borderRadius: 'var(--forge-radius-sm)',
                  backgroundColor: 'transparent',
                  color: 'var(--forge-accent)',
                  cursor: 'pointer',
                  fontSize: '10px',
                  flexShrink: 0,
                }}
              >
                Retry
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ===================================================================
 * GenerationQueue
 * =================================================================== */
export function GenerationQueue({
  jobs,
  totalApiCalls,
  totalCost,
  budgetCeiling,
  onCancel,
  onRetry,
  variant = 'compact',
  costFormat = defaultCostFormat,
  className,
  style,
}: GenerationQueueProps) {
  return (
    <div
      className={cn('forge-generation-queue', className)}
      style={{
        backgroundColor: 'var(--forge-surface)',
        border: '1px solid var(--forge-border)',
        borderRadius: 'var(--forge-radius-lg)',
        overflow: 'hidden',
        ...style,
      }}
    >
      <style>{`
        @keyframes forge-queue-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>

      {variant === 'compact' ? (
        <CompactQueue
          jobs={jobs}
          totalCost={totalCost}
          budgetCeiling={budgetCeiling}
          costFormat={costFormat}
        />
      ) : (
        <ExpandedQueue
          jobs={jobs}
          totalCost={totalCost}
          totalApiCalls={totalApiCalls}
          budgetCeiling={budgetCeiling}
          costFormat={costFormat}
          onCancel={onCancel}
          onRetry={onRetry}
        />
      )}
    </div>
  )
}
