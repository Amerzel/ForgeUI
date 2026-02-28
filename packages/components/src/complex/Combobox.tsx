import { useState, useRef, useEffect, useId } from 'react'
import { Command } from 'cmdk'
import { cn } from '../lib/cn.js'

export interface ComboboxOption {
  value: string
  label: string
  disabled?: boolean
}

interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  /** Controlled search string */
  search?: string
  onSearchChange?: (value: string) => void
  loading?: boolean
  empty?: React.ReactNode
  disabled?: boolean
  className?: string
}

const CONTENT_STYLE = {
  position: 'absolute' as const,
  top: '100%',
  left: 0,
  right: 0,
  zIndex: 'var(--forge-z-dropdown)',
  marginTop: 'var(--forge-space-1)',
  backgroundColor: 'var(--forge-surface-popover)',
  border: '1px solid var(--forge-border)',
  borderRadius: 'var(--forge-radius-md)',
  boxShadow: 'var(--forge-shadow-md)',
  overflow: 'hidden' as const,
  maxHeight: '260px',
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = 'Search…',
  search: controlledSearch,
  onSearchChange,
  loading = false,
  empty = 'No results',
  disabled = false,
  className,
}: ComboboxProps) {
  const [open, setOpen] = useState(false)
  const [internalSearch, setInternalSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const listboxId = useId()

  const search = controlledSearch ?? internalSearch
  const setSearch = (v: string) => {
    onSearchChange?.(v)
    if (controlledSearch === undefined) setInternalSearch(v)
  }

  const selectedOption = options.find(o => o.value === value)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const handleSelect = (val: string) => {
    onChange?.(val)
    setOpen(false)
    setSearch('')
  }

  return (
    <div
      ref={containerRef}
      className={cn('forge-combobox', className)}
      style={{ position: 'relative', opacity: disabled ? 0.6 : 1 }}
    >
      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-haspopup="listbox"
        aria-label={selectedOption?.label ?? placeholder}
        aria-disabled={disabled}
        disabled={disabled}
        onClick={() => setOpen(prev => !prev)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          height: '36px',
          padding: `0 var(--forge-space-3)`,
          border: `1px solid ${open ? 'var(--forge-accent)' : 'var(--forge-border)'}`,
          borderRadius: 'var(--forge-radius-md)',
          backgroundColor: 'var(--forge-bg)',
          color: selectedOption ? 'var(--forge-text)' : 'var(--forge-text-muted)',
          fontSize: 'var(--forge-font-size-sm)',
          fontFamily: 'var(--forge-font-sans)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          outline: 'none',
          boxShadow: open ? '0 0 0 var(--forge-focus-ring-width) color-mix(in srgb, var(--forge-accent) 30%, transparent)' : undefined,
          transition: `border-color var(--forge-duration-fast) var(--forge-easing-default)`,
        }}
        onFocus={(e) => { e.currentTarget.style.outline = 'var(--forge-focus-ring-width) solid var(--forge-focus-ring-color)'; e.currentTarget.style.outlineOffset = 'var(--forge-focus-ring-offset)' }}
        onBlur={(e) => { e.currentTarget.style.outline = 'none' }}
      >
        <span>{selectedOption?.label ?? placeholder}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ color: 'var(--forge-text-muted)', flexShrink: 0, transform: open ? 'rotate(180deg)' : undefined, transition: `transform var(--forge-duration-fast) var(--forge-easing-default)` }}>
          <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div style={CONTENT_STYLE}>
          <Command label="Combobox search" shouldFilter={true}>
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder={placeholder}
              style={{
                width: '100%',
                border: 'none',
                borderBottom: '1px solid var(--forge-border)',
                padding: `var(--forge-space-2) var(--forge-space-3)`,
                background: 'transparent',
                color: 'var(--forge-text)',
                fontSize: 'var(--forge-font-size-sm)',
                fontFamily: 'var(--forge-font-sans)',
                outline: 'none',
              }}
            />
            <Command.List id={listboxId} style={{ maxHeight: '200px', overflowY: 'auto', padding: 'var(--forge-space-1)' }}>
              {loading && (
                <Command.Loading>
                  <div style={{ padding: 'var(--forge-space-3)', textAlign: 'center', color: 'var(--forge-text-muted)', fontSize: 'var(--forge-font-size-sm)' }}>
                    Loading…
                  </div>
                </Command.Loading>
              )}
              <Command.Empty>
                <div style={{ padding: 'var(--forge-space-3)', textAlign: 'center', color: 'var(--forge-text-muted)', fontSize: 'var(--forge-font-size-sm)' }}>
                  {empty}
                </div>
              </Command.Empty>
              {options.map(opt => (
                <Command.Item
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.disabled}
                  onSelect={() => !opt.disabled && handleSelect(opt.value)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--forge-space-2)',
                    padding: `var(--forge-space-1-5) var(--forge-space-3)`,
                    borderRadius: 'var(--forge-radius-sm)',
                    cursor: opt.disabled ? 'not-allowed' : 'pointer',
                    fontSize: 'var(--forge-font-size-sm)',
                    color: opt.disabled ? 'var(--forge-text-disabled)' : opt.value === value ? 'var(--forge-accent)' : 'var(--forge-text)',
                    backgroundColor: opt.value === value ? 'color-mix(in srgb, var(--forge-accent) 10%, transparent)' : undefined,
                    listStyle: 'none',
                  }}
                  className="forge-combobox-item"
                >
                  {opt.label}
                  {opt.value === value && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ marginLeft: 'auto', color: 'var(--forge-accent)' }}>
                      <path d="M1 6l3 3 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </Command.Item>
              ))}
            </Command.List>
          </Command>
        </div>
      )}

      <style>{`
        .forge-combobox-item[data-selected="true"] {
          background-color: var(--forge-surface-hover);
        }
      `}</style>
    </div>
  )
}
