import { useState, useRef, useEffect } from 'react'
import { cn } from '../lib/cn.js'

interface EditableTextProps {
  value: string
  onChange?: (value: string) => void
  /** Called when edit is committed (blur or Enter) */
  onCommit?: (value: string) => void
  /** Called when edit is cancelled (Escape) */
  onCancel?: () => void
  placeholder?: string
  disabled?: boolean
  className?: string
  /** Input type — defaults to text */
  inputType?: 'text' | 'number'
}

export function EditableText({
  value,
  onChange,
  onCommit,
  onCancel,
  placeholder = 'Click to edit',
  disabled = false,
  className,
  inputType = 'text',
}: EditableTextProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) {
      setDraft(value)
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [editing, value])

  const commit = () => {
    setEditing(false)
    onCommit?.(draft)
    onChange?.(draft)
  }

  const cancel = () => {
    setEditing(false)
    setDraft(value)
    onCancel?.()
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        type={inputType}
        value={draft}
        placeholder={placeholder}
        className={cn('forge-editable-text-input', className)}
        style={{
          background: 'transparent',
          border: '1px solid var(--forge-accent)',
          borderRadius: 'var(--forge-radius-sm)',
          padding: '1px var(--forge-space-1)',
          color: 'var(--forge-text)',
          fontSize: 'inherit',
          fontFamily: 'inherit',
          fontWeight: 'inherit',
          width: '100%',
          outline: 'none',
          boxShadow:
            '0 0 0 var(--forge-focus-ring-width) color-mix(in srgb, var(--forge-accent) 30%, transparent)',
        }}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            commit()
          }
          if (e.key === 'Escape') {
            e.preventDefault()
            cancel()
          }
        }}
      />
    )
  }

  return (
    <span
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={`Edit: ${value || placeholder}`}
      aria-disabled={disabled}
      className={cn('forge-editable-text', className)}
      style={{
        display: 'inline-block',
        cursor: disabled ? 'not-allowed' : 'text',
        color: value ? 'var(--forge-text)' : 'var(--forge-text-muted)',
        borderRadius: 'var(--forge-radius-sm)',
        padding: '1px var(--forge-space-1)',
        outline: 'none',
        opacity: disabled ? 0.5 : 1,
        minWidth: '2em',
        transition: `background-color var(--forge-duration-fast) var(--forge-easing-default)`,
      }}
      onClick={() => !disabled && setEditing(true)}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
          e.preventDefault()
          setEditing(true)
        }
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.backgroundColor = 'var(--forge-surface-hover)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent'
      }}
      onFocus={(e) => {
        e.currentTarget.style.outline =
          'var(--forge-focus-ring-width) solid var(--forge-focus-ring-color)'
        e.currentTarget.style.outlineOffset = 'var(--forge-focus-ring-offset)'
      }}
      onBlur={(e) => {
        e.currentTarget.style.outline = 'none'
      }}
    >
      {value || <span style={{ fontStyle: 'italic' }}>{placeholder}</span>}
    </span>
  )
}
