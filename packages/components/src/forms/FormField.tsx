import { Label } from '../primitives/Label.js'
import { cn } from '../lib/cn.js'

interface FormFieldProps {
  /** Field label text */
  label?: string
  /** id passed to the label's htmlFor — should match the input's id */
  htmlFor?: string
  /** Error message — shown below input when present */
  error?: string
  /** Helper text — shown below input */
  hint?: string
  /** Marks the field as required (adds asterisk) */
  required?: boolean
  disabled?: boolean
  className?: string
  children: React.ReactNode
}

/**
 * Wrapper that composes Label + input slot + error message + hint text.
 * Error is shown as visible text, never color alone.
 */
export function FormField({
  label,
  htmlFor,
  error,
  hint,
  required,
  disabled,
  className,
  children,
}: FormFieldProps) {
  return (
    <div
      className={cn('forge-form-field', className)}
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--forge-space-1)' }}
    >
      {label && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--forge-space-1)' }}>
          <Label htmlFor={htmlFor} disabled={disabled}>
            {label}
          </Label>
          {required && (
            <span
              aria-hidden="true"
              style={{
                color: 'var(--forge-danger)',
                fontSize: 'var(--forge-font-size-sm)',
                lineHeight: 1,
              }}
            >
              *
            </span>
          )}
        </div>
      )}

      {children}

      {error && (
        <span
          role="alert"
          aria-live="polite"
          style={{
            fontSize: 'var(--forge-font-size-xs)',
            lineHeight: 'var(--forge-line-height-xs)',
            color: 'var(--forge-danger)',
          }}
        >
          {error}
        </span>
      )}

      {hint && !error && (
        <span
          style={{
            fontSize: 'var(--forge-font-size-xs)',
            lineHeight: 'var(--forge-line-height-xs)',
            color: 'var(--forge-text-muted)',
          }}
        >
          {hint}
        </span>
      )}
    </div>
  )
}
