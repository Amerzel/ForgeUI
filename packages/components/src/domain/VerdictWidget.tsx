import { cn } from '../lib/cn.js'

export type Verdict = 'up' | 'down' | null

export interface VerdictWidgetProps {
  /** Current verdict */
  value?: Verdict
  /** Verdict change callback */
  onChange?: (verdict: Verdict) => void
  /** Optional notes text */
  notes?: string
  /** Notes change callback */
  onNotesChange?: (notes: string) => void
  /** Show notes input (appears when a verdict is selected). Default: false */
  showNotes?: boolean
  /** Size variant. Default: 'md' */
  size?: 'sm' | 'md'
  /** Disabled state */
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
}

// Lucide-style thumbs-up path (24×24 viewBox)
const THUMB_UP_PATH =
  'M7 10v12m8-16.12L14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.68a2 2 0 0 0 1.7-.95l3.24-4.86a1.5 1.5 0 0 1 2.5.17L15 6'
const THUMB_DOWN_PATH =
  'M17 14V2M9 18.12L10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.68a2 2 0 0 0-1.7.95l-3.24 4.86a1.5 1.5 0 0 1-2.5-.17L9 18.12Z'

function ThumbIcon({ path, size }: { path: string; size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={path} />
    </svg>
  )
}

export function VerdictWidget({
  value,
  onChange,
  notes,
  onNotesChange,
  showNotes = false,
  size = 'md',
  disabled = false,
  className,
  style,
}: VerdictWidgetProps) {
  const iconSize = size === 'sm' ? 14 : 18
  const btnPadding = size === 'sm' ? 'var(--forge-space-1)' : 'var(--forge-space-2)'

  function handleClick(verdict: 'up' | 'down') {
    if (disabled) return
    onChange?.(value === verdict ? null : verdict)
  }

  const btnBase: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: btnPadding,
    border: '1px solid var(--forge-border)',
    borderRadius: 'var(--forge-radius-md)',
    backgroundColor: 'transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'background-color 0.15s, color 0.15s, border-color 0.15s',
    outline: 'none',
  }

  return (
    <div
      className={cn('forge-verdict-widget', className)}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        gap: 'var(--forge-space-2)',
        ...style,
      }}
    >
      <div style={{ display: 'flex', gap: 'var(--forge-space-1)' }}>
        {/* Thumbs up */}
        <button
          type="button"
          aria-label="Approve"
          aria-pressed={value === 'up'}
          disabled={disabled}
          onClick={() => handleClick('up')}
          style={{
            ...btnBase,
            color: value === 'up' ? 'var(--forge-success)' : 'var(--forge-text-muted)',
            borderColor: value === 'up' ? 'var(--forge-success)' : 'var(--forge-border)',
            backgroundColor:
              value === 'up'
                ? 'color-mix(in srgb, var(--forge-success) 12%, transparent)'
                : 'transparent',
          }}
        >
          <ThumbIcon path={THUMB_UP_PATH} size={iconSize} />
        </button>

        {/* Thumbs down */}
        <button
          type="button"
          aria-label="Reject"
          aria-pressed={value === 'down'}
          disabled={disabled}
          onClick={() => handleClick('down')}
          style={{
            ...btnBase,
            color: value === 'down' ? 'var(--forge-danger)' : 'var(--forge-text-muted)',
            borderColor: value === 'down' ? 'var(--forge-danger)' : 'var(--forge-border)',
            backgroundColor:
              value === 'down'
                ? 'color-mix(in srgb, var(--forge-danger) 12%, transparent)'
                : 'transparent',
          }}
        >
          <ThumbIcon path={THUMB_DOWN_PATH} size={iconSize} />
        </button>
      </div>

      {/* Notes textarea */}
      {showNotes && value != null && (
        <textarea
          aria-label="Verdict notes"
          placeholder="Add notes…"
          value={notes ?? ''}
          onChange={(e) => onNotesChange?.(e.target.value)}
          disabled={disabled}
          rows={2}
          style={{
            width: '100%',
            padding: 'var(--forge-space-2)',
            border: '1px solid var(--forge-border)',
            borderRadius: 'var(--forge-radius-md)',
            backgroundColor: 'var(--forge-surface)',
            color: 'var(--forge-text)',
            fontSize: size === 'sm' ? 'var(--forge-font-size-xs)' : 'var(--forge-font-size-sm)',
            fontFamily: 'inherit',
            resize: 'vertical',
            outline: 'none',
          }}
        />
      )}
    </div>
  )
}
