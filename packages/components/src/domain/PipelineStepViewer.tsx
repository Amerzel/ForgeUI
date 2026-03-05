import { cn } from '../lib/cn.js'

export interface PipelineStep {
  /** Step identifier */
  id: string
  /** Display label */
  label: string
  /** Step result — React content rendered in the result area */
  result?: React.ReactNode
  /** Step status */
  status: 'pending' | 'running' | 'complete' | 'error' | 'skipped'
  /** Optional timing in milliseconds */
  durationMs?: number
  /** Optional metadata key-value pairs */
  meta?: Record<string, string>
}

export interface PipelineStepViewerProps {
  /** Ordered list of pipeline steps */
  steps: PipelineStep[]
  /** Currently selected step (controlled) */
  selectedStep?: string
  /** Step selection callback */
  onSelectStep?: (stepId: string) => void
  /**
   * Layout mode. Default: 'horizontal'
   * - 'horizontal': step bar on top, single result panel below
   * - 'vertical': step bar on left, single result panel right
   * - 'filmstrip': step bar on top, all results in scrollable row
   * - 'all': all steps shown side-by-side with header + result per column
   */
  layout?: 'horizontal' | 'vertical' | 'filmstrip' | 'all'
  /** Show step connectors/arrows. Default: true */
  showConnectors?: boolean
  /** Custom render function for step results */
  renderResult?: (step: PipelineStep) => React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const STATUS_ICONS: Record<PipelineStep['status'], string> = {
  pending: '○',
  running: '◌',
  complete: '✓',
  error: '✕',
  skipped: '—',
}

const STATUS_COLORS: Record<PipelineStep['status'], string> = {
  pending: 'var(--forge-text-muted)',
  running: 'var(--forge-accent)',
  complete: 'var(--forge-success)',
  error: 'var(--forge-danger)',
  skipped: 'var(--forge-text-disabled)',
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

function StepIndicator({
  step,
  isSelected,
  onClick,
  showConnector,
  isLast,
  layout,
}: {
  step: PipelineStep
  isSelected: boolean
  onClick: () => void
  showConnector: boolean
  isLast: boolean
  layout: 'horizontal' | 'vertical' | 'filmstrip' | 'all'
}) {
  const color = STATUS_COLORS[step.status]
  const icon = STATUS_ICONS[step.status]
  const isHorizontal = layout === 'horizontal' || layout === 'filmstrip' || layout === 'all'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isHorizontal ? 'row' : 'column',
        alignItems: 'center',
        gap: 0,
        flex: isLast ? '0 0 auto' : '1 1 0',
        minWidth: 0,
      }}
    >
      {/* Step button */}
      <button
        type="button"
        onClick={onClick}
        aria-label={`${step.label} — ${step.status}${step.durationMs ? ` (${formatDuration(step.durationMs)})` : ''}`}
        aria-current={isSelected ? 'step' : undefined}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          padding: 'var(--forge-space-2)',
          border: `1px solid ${isSelected ? 'var(--forge-accent)' : 'transparent'}`,
          borderRadius: 'var(--forge-radius-md)',
          backgroundColor: isSelected
            ? 'color-mix(in srgb, var(--forge-accent) 8%, transparent)'
            : 'transparent',
          cursor: 'pointer',
          outline: 'none',
          minWidth: '60px',
          flexShrink: 0,
        }}
      >
        {/* Status icon */}
        <span
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            border: `2px solid ${color}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 600,
            color,
            backgroundColor:
              step.status === 'running'
                ? 'color-mix(in srgb, var(--forge-accent) 15%, transparent)'
                : 'transparent',
            animation: step.status === 'running' ? 'forge-pulse 1.5s ease-in-out infinite' : 'none',
          }}
        >
          {icon}
        </span>

        {/* Label */}
        <span
          style={{
            fontSize: 'var(--forge-font-size-xs)',
            color: isSelected ? 'var(--forge-text)' : 'var(--forge-text-muted)',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '80px',
          }}
        >
          {step.label}
        </span>

        {/* Duration */}
        {step.durationMs !== undefined && (
          <span
            style={{
              fontSize: '10px',
              fontFamily: 'var(--forge-font-mono)',
              color: 'var(--forge-text-muted)',
            }}
          >
            {formatDuration(step.durationMs)}
          </span>
        )}
      </button>

      {/* Connector */}
      {showConnector && !isLast && (
        <div
          aria-hidden="true"
          style={
            isHorizontal
              ? {
                  flex: '1 1 0',
                  height: '2px',
                  minWidth: '12px',
                  backgroundColor: 'var(--forge-border)',
                  alignSelf: 'center',
                  marginTop: '-20px',
                }
              : {
                  width: '2px',
                  flex: '1 1 0',
                  minHeight: '12px',
                  backgroundColor: 'var(--forge-border)',
                }
          }
        />
      )}
    </div>
  )
}

export function PipelineStepViewer({
  steps,
  selectedStep,
  onSelectStep,
  layout = 'horizontal',
  showConnectors = true,
  renderResult,
  className,
  style,
}: PipelineStepViewerProps) {
  const selected = selectedStep ?? steps.find((s) => s.status === 'running')?.id ?? steps[0]?.id
  const selectedStepData = steps.find((s) => s.id === selected)

  const isFilmstrip = layout === 'filmstrip'
  const isAll = layout === 'all'
  const isVertical = layout === 'vertical'

  return (
    <div
      className={cn('forge-pipeline-step-viewer', className)}
      style={{
        display: 'flex',
        flexDirection: isVertical ? 'row' : 'column',
        backgroundColor: 'var(--forge-surface)',
        border: '1px solid var(--forge-border)',
        borderRadius: 'var(--forge-radius-lg)',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Pulse animation for running steps */}
      <style>{`
        @keyframes forge-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      {/* Step indicators (hidden in 'all' layout — headers are inline) */}
      {!isAll && (
        <div
          role="tablist"
          aria-label="Pipeline steps"
          style={{
            display: 'flex',
            flexDirection: isVertical ? 'column' : 'row',
            alignItems: isVertical ? 'stretch' : 'center',
            padding: 'var(--forge-space-2)',
            borderBottom: isVertical ? undefined : '1px solid var(--forge-border)',
            borderRight: isVertical ? '1px solid var(--forge-border)' : undefined,
            gap: 0,
            overflowX: isVertical ? undefined : 'auto',
            overflowY: isVertical ? 'auto' : undefined,
            flexShrink: 0,
          }}
        >
          {steps.map((step, i) => (
            <StepIndicator
              key={step.id}
              step={step}
              isSelected={step.id === selected}
              onClick={() => onSelectStep?.(step.id)}
              showConnector={showConnectors}
              isLast={i === steps.length - 1}
              layout={layout}
            />
          ))}
        </div>
      )}

      {/* Single result panel (horizontal / vertical) */}
      {selectedStepData && !isFilmstrip && !isAll && (
        <div
          role="tabpanel"
          aria-label={`${selectedStepData.label} result`}
          style={{
            flex: '1 1 auto',
            padding: 'var(--forge-space-3)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--forge-space-2)',
            minHeight: 0,
            overflow: 'auto',
          }}
        >
          {/* Step header — fixed height to prevent layout shift */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--forge-space-2)',
            }}
          >
            <span
              style={{
                fontSize: 'var(--forge-font-size-sm)',
                fontWeight: 600,
                color: 'var(--forge-text)',
              }}
            >
              {selectedStepData.label}
            </span>
            <span
              style={{
                fontSize: 'var(--forge-font-size-xs)',
                fontWeight: 500,
                padding: '1px var(--forge-space-2)',
                borderRadius: 'var(--forge-radius-sm)',
                backgroundColor: `color-mix(in srgb, ${STATUS_COLORS[selectedStepData.status]} 15%, transparent)`,
                color: STATUS_COLORS[selectedStepData.status],
              }}
            >
              {selectedStepData.status}
            </span>
            {selectedStepData.durationMs !== undefined && (
              <span
                style={{
                  fontSize: 'var(--forge-font-size-xs)',
                  fontFamily: 'var(--forge-font-mono)',
                  color: 'var(--forge-text-muted)',
                  marginLeft: 'auto',
                }}
              >
                {formatDuration(selectedStepData.durationMs)}
              </span>
            )}
          </div>

          {/* Metadata — reserve line height even when empty to prevent shift */}
          <div
            style={{
              display: 'flex',
              gap: 'var(--forge-space-3)',
              fontSize: 'var(--forge-font-size-xs)',
              minHeight: '1.2em',
            }}
          >
            {selectedStepData.meta &&
              Object.entries(selectedStepData.meta).map(([key, value]) => (
                <span key={key} style={{ color: 'var(--forge-text-muted)' }}>
                  {key}:{' '}
                  <span
                    style={{ color: 'var(--forge-text)', fontFamily: 'var(--forge-font-mono)' }}
                  >
                    {value}
                  </span>
                </span>
              ))}
          </div>

          {/* Result content */}
          <div style={{ flex: '1 1 auto', minHeight: 0 }}>
            {renderResult ? renderResult(selectedStepData) : selectedStepData.result}
          </div>
        </div>
      )}

      {/* Filmstrip: all results in scrollable row */}
      {isFilmstrip && (
        <div
          style={{
            display: 'flex',
            gap: 'var(--forge-space-2)',
            padding: 'var(--forge-space-3)',
            overflowX: 'auto',
            flex: '1 1 auto',
          }}
        >
          {steps.map((step) => (
            <div
              key={step.id}
              style={{
                flexShrink: 0,
                border: `1px solid ${step.id === selected ? 'var(--forge-accent)' : 'var(--forge-border)'}`,
                borderRadius: 'var(--forge-radius-md)',
                padding: 'var(--forge-space-2)',
                backgroundColor:
                  step.id === selected
                    ? 'color-mix(in srgb, var(--forge-accent) 5%, transparent)'
                    : 'transparent',
                cursor: 'pointer',
              }}
              onClick={() => onSelectStep?.(step.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelectStep?.(step.id)
                }
              }}
              role="button"
              tabIndex={0}
            >
              {renderResult ? renderResult(step) : step.result}
            </div>
          ))}
        </div>
      )}

      {/* All: every step with header + result in a single row */}
      {isAll && (
        <div
          style={{
            display: 'flex',
            gap: 'var(--forge-space-3)',
            padding: 'var(--forge-space-3)',
            overflowX: 'auto',
            flex: '1 1 auto',
            alignItems: 'flex-start',
          }}
        >
          {steps.map((step) => {
            const color = STATUS_COLORS[step.status]
            const isSelected = step.id === selected
            return (
              <div
                key={step.id}
                style={{
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--forge-space-1)',
                  border: `1px solid ${isSelected ? 'var(--forge-accent)' : 'var(--forge-border)'}`,
                  borderRadius: 'var(--forge-radius-md)',
                  padding: 'var(--forge-space-2)',
                  backgroundColor: isSelected
                    ? 'color-mix(in srgb, var(--forge-accent) 5%, transparent)'
                    : 'transparent',
                  cursor: onSelectStep ? 'pointer' : 'default',
                }}
                onClick={() => onSelectStep?.(step.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onSelectStep?.(step.id)
                  }
                }}
                role="button"
                tabIndex={0}
              >
                {/* Compact header: label + status badge + duration */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--forge-space-1)',
                    fontSize: 'var(--forge-font-size-xs)',
                  }}
                >
                  <span style={{ color, fontWeight: 600, fontSize: '10px' }}>
                    {STATUS_ICONS[step.status]}
                  </span>
                  <span
                    style={{
                      fontWeight: 500,
                      color: 'var(--forge-text)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {step.label}
                  </span>
                  {step.durationMs !== undefined && (
                    <span
                      style={{
                        fontFamily: 'var(--forge-font-mono)',
                        color: 'var(--forge-text-muted)',
                        fontSize: '10px',
                      }}
                    >
                      {formatDuration(step.durationMs)}
                    </span>
                  )}
                </div>

                {/* Metadata — always reserve the row */}
                <div
                  style={{
                    fontSize: '10px',
                    color: 'var(--forge-text-muted)',
                    minHeight: '1em',
                    display: 'flex',
                    gap: 'var(--forge-space-2)',
                  }}
                >
                  {step.meta &&
                    Object.entries(step.meta).map(([key, value]) => (
                      <span key={key}>
                        {key}: <span style={{ color: 'var(--forge-text)' }}>{value}</span>
                      </span>
                    ))}
                </div>

                {/* Result */}
                <div>{renderResult ? renderResult(step) : step.result}</div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
