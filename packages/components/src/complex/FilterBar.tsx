import { cn } from '../lib/cn.js'
import React, { useState, useCallback, useId } from 'react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FilterOption {
  value: string
  label: string
  count?: number
}

export interface FilterDefinition {
  id: string
  label: string
  type: 'multi-select' | 'single-select' | 'boolean'
  options?: FilterOption[]
}

export type FilterState = Record<string, string | string[] | boolean>

export interface FilterBarProps {
  /** Available filter definitions */
  filters: FilterDefinition[]
  /** Current filter state */
  value: FilterState
  /** Called when any filter changes */
  onChange: (state: FilterState) => void
  className?: string
}

// ---------------------------------------------------------------------------
// FilterChip — individual chip with popover
// ---------------------------------------------------------------------------

function FilterChip({
  filter,
  filterValue,
  onChangeValue,
}: {
  filter: FilterDefinition
  filterValue: string | string[] | boolean | undefined
  onChangeValue: (value: string | string[] | boolean | undefined) => void
}) {
  const [open, setOpen] = useState(false)
  const popoverId = useId()

  const isActive =
    filterValue !== undefined &&
    filterValue !== false &&
    !(Array.isArray(filterValue) && filterValue.length === 0)

  const chipLabel = (() => {
    if (filter.type === 'boolean') return filter.label
    if (filter.type === 'single-select' && typeof filterValue === 'string') {
      const opt = filter.options?.find((o) => o.value === filterValue)
      return opt ? `${filter.label}: ${opt.label}` : filter.label
    }
    if (filter.type === 'multi-select' && Array.isArray(filterValue) && filterValue.length > 0) {
      return `${filter.label} (${filterValue.length})`
    }
    return filter.label
  })()

  const handleToggle = useCallback(() => {
    if (filter.type === 'boolean') {
      onChangeValue(filterValue ? undefined : true)
    } else {
      setOpen((o) => !o)
    }
  }, [filter.type, filterValue, onChangeValue])

  const handleMultiToggle = useCallback(
    (optValue: string) => {
      const current = Array.isArray(filterValue) ? filterValue : []
      const next = current.includes(optValue)
        ? current.filter((v) => v !== optValue)
        : [...current, optValue]
      onChangeValue(next.length > 0 ? next : undefined)
    },
    [filterValue, onChangeValue],
  )

  const handleSingleSelect = useCallback(
    (optValue: string) => {
      onChangeValue(filterValue === optValue ? undefined : optValue)
      setOpen(false)
    },
    [filterValue, onChangeValue],
  )

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={open}
        aria-controls={open ? popoverId : undefined}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--forge-space-1)',
          padding: 'var(--forge-space-1) var(--forge-space-2)',
          fontSize: 'var(--forge-font-size-xs)',
          fontFamily: 'var(--forge-font-sans)',
          fontWeight: 500,
          color: isActive ? 'var(--forge-accent)' : 'var(--forge-text-muted)',
          backgroundColor: isActive
            ? 'color-mix(in srgb, var(--forge-accent) 10%, transparent)'
            : 'transparent',
          border: `1px solid ${isActive ? 'var(--forge-accent)' : 'var(--forge-border)'}`,
          borderRadius: 'var(--forge-radius-full)',
          cursor: 'pointer',
          transition: 'all var(--forge-duration-fast) var(--forge-easing-default)',
        }}
      >
        {chipLabel}
        {filter.type !== 'boolean' && (
          <span aria-hidden style={{ fontSize: '8px' }}>
            {open ? '▲' : '▼'}
          </span>
        )}
      </button>

      {open && filter.type !== 'boolean' && (
        <div
          id={popoverId}
          role="listbox"
          aria-label={filter.label}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: 'var(--forge-space-1)',
            minWidth: '160px',
            padding: 'var(--forge-space-1)',
            backgroundColor: 'var(--forge-surface-raised)',
            border: '1px solid var(--forge-border)',
            borderRadius: 'var(--forge-radius-md)',
            zIndex: 10,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          {filter.options?.map((opt) => {
            const selected =
              filter.type === 'multi-select'
                ? Array.isArray(filterValue) && filterValue.includes(opt.value)
                : filterValue === opt.value

            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() =>
                  filter.type === 'multi-select'
                    ? handleMultiToggle(opt.value)
                    : handleSingleSelect(opt.value)
                }
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--forge-space-2)',
                  width: '100%',
                  padding: 'var(--forge-space-1) var(--forge-space-2)',
                  fontSize: 'var(--forge-font-size-xs)',
                  fontFamily: 'var(--forge-font-sans)',
                  color: 'var(--forge-text)',
                  backgroundColor: selected
                    ? 'color-mix(in srgb, var(--forge-accent) 10%, transparent)'
                    : 'transparent',
                  border: 'none',
                  borderRadius: 'var(--forge-radius-sm)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                {filter.type === 'multi-select' && (
                  <span
                    style={{
                      width: '14px',
                      height: '14px',
                      border: `1px solid ${selected ? 'var(--forge-accent)' : 'var(--forge-border)'}`,
                      borderRadius: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      flexShrink: 0,
                      backgroundColor: selected ? 'var(--forge-accent)' : 'transparent',
                      color: selected ? 'var(--forge-bg)' : 'transparent',
                    }}
                  >
                    ✓
                  </span>
                )}
                <span style={{ flex: 1 }}>{opt.label}</span>
                {opt.count !== undefined && (
                  <span style={{ color: 'var(--forge-text-muted)', fontSize: '10px' }}>
                    {opt.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// FilterBar
// ---------------------------------------------------------------------------

export function FilterBar({ filters, value, onChange, className }: FilterBarProps) {
  const hasActive = filters.some((f) => {
    const v = value[f.id]
    return v !== undefined && v !== false && !(Array.isArray(v) && v.length === 0)
  })

  const handleChangeValue = useCallback(
    (filterId: string, filterValue: string | string[] | boolean | undefined) => {
      const next = { ...value }
      if (filterValue === undefined) {
        delete next[filterId]
      } else {
        next[filterId] = filterValue
      }
      onChange(next)
    },
    [value, onChange],
  )

  const handleClearAll = useCallback(() => {
    onChange({})
  }, [onChange])

  return (
    <div
      className={cn('forge-filter-bar', className)}
      role="toolbar"
      aria-label="Filters"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 'var(--forge-space-2)',
      }}
    >
      {filters.map((filter) => (
        <FilterChip
          key={filter.id}
          filter={filter}
          filterValue={value[filter.id]}
          onChangeValue={(v) => handleChangeValue(filter.id, v)}
        />
      ))}

      {hasActive && (
        <button
          type="button"
          onClick={handleClearAll}
          style={{
            padding: 'var(--forge-space-1) var(--forge-space-2)',
            fontSize: 'var(--forge-font-size-xs)',
            fontFamily: 'var(--forge-font-sans)',
            color: 'var(--forge-text-muted)',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          Clear all
        </button>
      )}
    </div>
  )
}
