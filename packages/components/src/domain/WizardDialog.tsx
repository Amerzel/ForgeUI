import { useState, useCallback } from 'react'
import { cn } from '../lib/cn.js'

export interface WizardStep {
  /** Step identifier */
  id: string
  /** Step label for the progress indicator */
  label: string
  /** Step content — rendered when this step is active */
  content: React.ReactNode
  /** Validation function — return error message or null/Promise */
  validate?: () => string | null | Promise<string | null>
  /** Optional description shown in progress indicator */
  description?: string
}

export interface WizardDialogProps {
  /** Dialog open state */
  open: boolean
  /** Open state change callback */
  onOpenChange: (open: boolean) => void
  /** Dialog title */
  title: string
  /** Ordered wizard steps */
  steps: WizardStep[]
  /** Called when wizard completes (Finish clicked on last step) */
  onComplete: () => void
  /** Custom finish button label. Default: 'Create' */
  finishLabel?: string
  className?: string
  style?: React.CSSProperties
}

export function WizardDialog({
  open,
  onOpenChange,
  title,
  steps,
  onComplete,
  finishLabel = 'Create',
  className,
  style,
}: WizardDialogProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [validating, setValidating] = useState(false)

  const isFirst = currentStep === 0
  const isLast = currentStep === steps.length - 1
  const step = steps[currentStep] as WizardStep

  const handleNext = useCallback(async () => {
    if (!step.validate) {
      if (isLast) {
        onComplete()
        onOpenChange(false)
        setCurrentStep(0)
      } else {
        setValidationError(null)
        setCurrentStep((s) => s + 1)
      }
      return
    }

    setValidating(true)
    try {
      const error = await step.validate()
      if (error) {
        setValidationError(error)
      } else {
        setValidationError(null)
        if (isLast) {
          onComplete()
          onOpenChange(false)
          setCurrentStep(0)
        } else {
          setCurrentStep((s) => s + 1)
        }
      }
    } finally {
      setValidating(false)
    }
  }, [step, isLast, onComplete, onOpenChange])

  const handleBack = useCallback(() => {
    setValidationError(null)
    setCurrentStep((s) => Math.max(0, s - 1))
  }, [])

  const handleCancel = useCallback(() => {
    onOpenChange(false)
    setCurrentStep(0)
    setValidationError(null)
  }, [onOpenChange])

  if (!open) return null

  const btnBase: React.CSSProperties = {
    padding: 'var(--forge-space-2) var(--forge-space-4)',
    borderRadius: 'var(--forge-radius-md)',
    fontSize: 'var(--forge-font-size-sm)',
    fontWeight: 500,
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
  }

  return (
    <div
      className={cn('forge-wizard-dialog', className)}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 'var(--forge-z-modal)',
        ...style,
      }}
    >
      {/* Backdrop */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
        }}
        onClick={handleCancel}
        aria-hidden="true"
      />

      {/* Dialog panel */}
      <div
        style={{
          position: 'relative',
          backgroundColor: 'var(--forge-surface)',
          border: '1px solid var(--forge-border)',
          borderRadius: 'var(--forge-radius-lg)',
          width: '100%',
          maxWidth: 560,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: 'var(--forge-space-4)',
            borderBottom: '1px solid var(--forge-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 'var(--forge-font-size-lg)',
              fontWeight: 600,
              color: 'var(--forge-text)',
            }}
          >
            {title}
          </h2>
          <button
            type="button"
            aria-label="Close wizard"
            onClick={handleCancel}
            style={{
              padding: 'var(--forge-space-1)',
              border: 'none',
              backgroundColor: 'transparent',
              color: 'var(--forge-text-muted)',
              cursor: 'pointer',
              fontSize: '18px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Step progress indicator */}
        <div
          style={{
            display: 'flex',
            padding: 'var(--forge-space-3) var(--forge-space-4)',
            borderBottom: '1px solid var(--forge-border)',
            gap: 0,
          }}
        >
          {steps.map((s, i) => {
            const status = i < currentStep ? 'completed' : i === currentStep ? 'active' : 'pending'
            const color =
              status === 'completed'
                ? 'var(--forge-success)'
                : status === 'active'
                  ? 'var(--forge-accent)'
                  : 'var(--forge-text-disabled)'

            return (
              <div
                key={s.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flex: i === steps.length - 1 ? '0 0 auto' : '1 1 0',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      border: `2px solid ${color}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      fontWeight: 600,
                      color,
                      backgroundColor:
                        status === 'completed'
                          ? 'color-mix(in srgb, var(--forge-success) 15%, transparent)'
                          : 'transparent',
                    }}
                  >
                    {status === 'completed' ? '✓' : i + 1}
                  </div>
                  <span
                    style={{
                      fontSize: '10px',
                      color: status === 'active' ? 'var(--forge-text)' : 'var(--forge-text-muted)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {s.label}
                  </span>
                </div>

                {/* Connector */}
                {i < steps.length - 1 && (
                  <div
                    aria-hidden="true"
                    style={{
                      flex: '1 1 0',
                      height: 2,
                      minWidth: 16,
                      backgroundColor:
                        i < currentStep ? 'var(--forge-success)' : 'var(--forge-border)',
                      alignSelf: 'flex-start',
                      marginTop: 9,
                    }}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Step content */}
        <div
          style={{
            padding: 'var(--forge-space-4)',
            flex: '1 1 auto',
            overflow: 'auto',
            minHeight: 200,
          }}
        >
          {step.content}
        </div>

        {/* Validation error */}
        {validationError && (
          <div
            role="alert"
            style={{
              padding: 'var(--forge-space-2) var(--forge-space-4)',
              color: 'var(--forge-danger)',
              fontSize: 'var(--forge-font-size-xs)',
              borderTop: '1px solid var(--forge-border)',
            }}
          >
            {validationError}
          </div>
        )}

        {/* Footer navigation */}
        <div
          style={{
            padding: 'var(--forge-space-3) var(--forge-space-4)',
            borderTop: '1px solid var(--forge-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <button
            type="button"
            onClick={handleCancel}
            style={{
              ...btnBase,
              backgroundColor: 'transparent',
              color: 'var(--forge-text-muted)',
              border: '1px solid var(--forge-border)',
            }}
          >
            Cancel
          </button>

          <div style={{ display: 'flex', gap: 'var(--forge-space-2)' }}>
            {!isFirst && (
              <button
                type="button"
                onClick={handleBack}
                style={{
                  ...btnBase,
                  backgroundColor: 'transparent',
                  color: 'var(--forge-text)',
                  border: '1px solid var(--forge-border)',
                }}
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={() => void handleNext()}
              disabled={validating}
              style={{
                ...btnBase,
                backgroundColor: 'var(--forge-accent)',
                color: 'var(--forge-accent-foreground, #fff)',
                opacity: validating ? 0.7 : 1,
              }}
            >
              {validating ? '…' : isLast ? finishLabel : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
