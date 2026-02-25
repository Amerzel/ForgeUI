import * as RadixCheckbox from '@radix-ui/react-checkbox'
import { cn } from '../lib/cn.js'

interface CheckboxProps extends Omit<React.ComponentPropsWithoutRef<typeof RadixCheckbox.Root>, 'id'> {
  /** Visible label text */
  label?: string
  /** id for label association — auto-generated if not provided */
  id?: string
  /** Indeterminate state (partially checked) */
  indeterminate?: boolean
}

let _idCounter = 0

export function Checkbox({ label, id, indeterminate, disabled, className, ...props }: CheckboxProps) {
  const checkboxId = id ?? `forge-checkbox-${++_idCounter}`
  const checked = indeterminate ? 'indeterminate' : props.checked

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--forge-space-2)' }}>
      <RadixCheckbox.Root
        id={checkboxId}
        checked={checked}
        disabled={disabled}
        className={cn('forge-checkbox', className)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '16px',
          height: '16px',
          flexShrink: 0,
          backgroundColor: checked && !disabled
            ? 'var(--forge-accent)'
            : 'var(--forge-surface)',
          border: `1px solid ${checked ? 'var(--forge-accent)' : 'var(--forge-border)'}`,
          borderRadius: 'var(--forge-radius-sm)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          outline: 'none',
          transition: `background-color var(--forge-duration-fast) var(--forge-easing-default),
                       border-color var(--forge-duration-fast) var(--forge-easing-default)`,
        }}
        onFocus={(e) => {
          e.currentTarget.style.outline = 'var(--forge-focus-ring-width) solid var(--forge-focus-ring-color)'
          e.currentTarget.style.outlineOffset = 'var(--forge-focus-ring-offset)'
        }}
        onBlur={(e) => {
          e.currentTarget.style.outline = 'none'
        }}
        {...props}
      >
        <RadixCheckbox.Indicator style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--forge-text-on-accent)' }}>
          {indeterminate ? (
            <svg width="8" height="2" viewBox="0 0 8 2" fill="none" aria-hidden="true">
              <path d="M1 1h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
              <path d="M1 4l2.5 2.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>

      {label && (
        <label
          htmlFor={checkboxId}
          style={{
            fontSize: 'var(--forge-font-size-base)',
            color: disabled ? 'var(--forge-text-disabled)' : 'var(--forge-text)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            userSelect: 'none',
          }}
        >
          {label}
        </label>
      )}
    </div>
  )
}
