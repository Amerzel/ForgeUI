import { useState, useRef, useCallback } from 'react'
import { cn } from '../lib/cn.js'

interface TagsInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  /** Suggestion list for autocomplete */
  suggestions?: string[]
  max?: number
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function TagsInput({
  value,
  onChange,
  suggestions = [],
  max,
  placeholder = 'Add tag…',
  disabled = false,
  className,
}: TagsInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [focused, setFocused] = useState(false)
  const [focusedTagIndex, setFocusedTagIndex] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredSuggestions = suggestions.filter(
    s => s.toLowerCase().includes(inputValue.toLowerCase()) && !value.includes(s)
  )
  const showSuggestions = focused && inputValue.length > 0 && filteredSuggestions.length > 0

  const addTag = useCallback((tag: string) => {
    const trimmed = tag.trim()
    if (!trimmed || value.includes(trimmed)) return
    if (max && value.length >= max) return
    onChange([...value, trimmed])
    setInputValue('')
  }, [value, onChange, max])

  const removeTag = useCallback((index: number) => {
    const next = value.filter((_, i) => i !== index)
    onChange(next)
    setFocusedTagIndex(null)
    inputRef.current?.focus()
  }, [value, onChange])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',' || e.key === 'Tab') && inputValue.trim()) {
      e.preventDefault()
      addTag(inputValue)
    }
    if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value.length - 1)
    }
    if (e.key === 'ArrowLeft' && !inputValue && value.length > 0) {
      setFocusedTagIndex(focusedTagIndex === null ? value.length - 1 : Math.max(0, focusedTagIndex - 1))
    }
    if (e.key === 'ArrowRight' && focusedTagIndex !== null) {
      if (focusedTagIndex >= value.length - 1) {
        setFocusedTagIndex(null)
      } else {
        setFocusedTagIndex(focusedTagIndex + 1)
      }
    }
    if (e.key === 'Delete' && focusedTagIndex !== null) {
      removeTag(focusedTagIndex)
    }
  }

  const atMax = max !== undefined && value.length >= max

  return (
    <div
      className={cn('forge-tags-input', className)}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 'var(--forge-space-1)',
        padding: 'var(--forge-space-1-5)',
        border: `1px solid ${focused ? 'var(--forge-accent)' : 'var(--forge-border)'}`,
        borderRadius: 'var(--forge-radius-md)',
        backgroundColor: disabled ? 'var(--forge-surface)' : 'var(--forge-bg)',
        cursor: disabled ? 'not-allowed' : 'text',
        opacity: disabled ? 0.6 : 1,
        boxShadow: focused ? '0 0 0 var(--forge-focus-ring-width) color-mix(in srgb, var(--forge-accent) 30%, transparent)' : undefined,
        transition: `border-color var(--forge-duration-fast) var(--forge-easing-default)`,
        position: 'relative',
      }}
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((tag, i) => (
        <span
          key={i}
          className="forge-tag"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--forge-space-1)',
            padding: `var(--forge-space-0-5) var(--forge-space-2)`,
            backgroundColor: focusedTagIndex === i
              ? 'var(--forge-accent)'
              : 'color-mix(in srgb, var(--forge-accent) 15%, transparent)',
            color: focusedTagIndex === i ? 'var(--forge-accent-text)' : 'var(--forge-accent)',
            borderRadius: 'var(--forge-radius-full)',
            fontSize: 'var(--forge-font-size-sm)',
            fontFamily: 'var(--forge-font-sans)',
            userSelect: 'none',
          }}
        >
          <span>{tag}</span>
          {!disabled && (
            <button
              type="button"
              aria-label={`Remove ${tag}`}
              tabIndex={-1}
              onClick={(e) => { e.stopPropagation(); removeTag(i) }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit', borderRadius: '50%', lineHeight: 1 }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </span>
      ))}

      {!atMax && (
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          placeholder={value.length === 0 ? placeholder : ''}
          disabled={disabled}
          aria-label={placeholder}
          style={{
            flex: '1 1 80px',
            minWidth: '80px',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: 'var(--forge-font-size-sm)',
            fontFamily: 'var(--forge-font-sans)',
            color: 'var(--forge-text)',
            padding: 'var(--forge-space-0-5)',
          }}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); setInputValue('') }}
        />
      )}

      {showSuggestions && (
        <ul
          role="listbox"
          aria-label="Suggestions"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: 'var(--forge-space-1)',
            backgroundColor: 'var(--forge-surface-popover)',
            border: '1px solid var(--forge-border)',
            borderRadius: 'var(--forge-radius-md)',
            boxShadow: 'var(--forge-shadow-md)',
            zIndex: 'var(--forge-z-dropdown)',
            listStyle: 'none',
            padding: 'var(--forge-space-1)',
            margin: 0,
            maxHeight: '200px',
            overflowY: 'auto',
          } as React.CSSProperties}
        >
          {filteredSuggestions.slice(0, 8).map(s => (
            <li
              key={s}
              role="option"
              aria-selected={false}
              onMouseDown={(e) => { e.preventDefault(); addTag(s) }}
              style={{
                padding: `var(--forge-space-1-5) var(--forge-space-3)`,
                borderRadius: 'var(--forge-radius-sm)',
                fontSize: 'var(--forge-font-size-sm)',
                color: 'var(--forge-text)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--forge-surface-hover)' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '' }}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
