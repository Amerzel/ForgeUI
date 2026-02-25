import { useState, useCallback } from 'react'
import { Collapsible } from '../composites/Collapsible.js'
import { cn } from '../lib/cn.js'

export type PropertyType = 'text' | 'number' | 'color' | 'boolean' | 'select' | 'vec2' | 'vec3'

export interface SelectOption {
  label: string
  value: string
}

export interface PropertyItem {
  key: string
  label: string
  type: PropertyType
  disabled?: boolean
  /** For select type */
  options?: SelectOption[]
  min?: number
  max?: number
  step?: number
}

export interface PropertySection {
  label: string
  items: PropertyItem[]
  defaultOpen?: boolean
}

interface PropertyGridProps {
  sections: PropertySection[]
  values: Record<string, unknown>
  onChange: (key: string, value: unknown) => void
  className?: string
}

// ---------------------------------------------------------------------------
// Property editors
// ---------------------------------------------------------------------------

function TextEditor({ item, value, onChange }: { item: PropertyItem; value: unknown; onChange: (v: string) => void }) {
  return (
    <input
      type="text"
      value={String(value ?? '')}
      disabled={item.disabled}
      aria-label={item.label}
      style={{
        width: '100%',
        height: '24px',
        padding: `0 var(--forge-space-2)`,
        border: '1px solid var(--forge-border)',
        borderRadius: 'var(--forge-radius-sm)',
        backgroundColor: 'var(--forge-bg)',
        color: 'var(--forge-text)',
        fontSize: 'var(--forge-font-size-sm)',
        fontFamily: 'var(--forge-font-sans)',
        outline: 'none',
      }}
      onChange={(e) => onChange(e.target.value)}
      onFocus={(e) => { e.currentTarget.style.outline = 'var(--forge-focus-ring-width) solid var(--forge-focus-ring-color)' }}
      onBlur={(e) => { e.currentTarget.style.outline = 'none' }}
    />
  )
}

function NumberEditor({ item, value, onChange }: { item: PropertyItem; value: unknown; onChange: (v: number) => void }) {
  return (
    <input
      type="number"
      value={String(value ?? 0)}
      disabled={item.disabled}
      min={item.min}
      max={item.max}
      step={item.step ?? 0.1}
      aria-label={item.label}
      style={{
        width: '100%',
        height: '24px',
        padding: `0 var(--forge-space-2)`,
        border: '1px solid var(--forge-border)',
        borderRadius: 'var(--forge-radius-sm)',
        backgroundColor: 'var(--forge-bg)',
        color: 'var(--forge-text)',
        fontSize: 'var(--forge-font-size-sm)',
        fontFamily: 'var(--forge-font-mono)',
        outline: 'none',
      }}
      onChange={(e) => onChange(Number(e.target.value))}
      onFocus={(e) => { e.currentTarget.style.outline = 'var(--forge-focus-ring-width) solid var(--forge-focus-ring-color)' }}
      onBlur={(e) => { e.currentTarget.style.outline = 'none' }}
    />
  )
}

function ColorEditor({ item, value, onChange }: { item: PropertyItem; value: unknown; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--forge-space-2)' }}>
      <input
        type="color"
        value={String(value ?? '#000000')}
        disabled={item.disabled}
        aria-label={item.label}
        style={{
          width: '28px',
          height: '24px',
          border: '1px solid var(--forge-border)',
          borderRadius: 'var(--forge-radius-sm)',
          cursor: 'pointer',
          padding: '2px',
          backgroundColor: 'var(--forge-bg)',
        }}
        onChange={(e) => onChange(e.target.value)}
      />
      <span style={{ fontFamily: 'var(--forge-font-mono)', fontSize: 'var(--forge-font-size-xs)', color: 'var(--forge-text-muted)' }}>
        {String(value ?? '#000000')}
      </span>
    </div>
  )
}

function BooleanEditor({ item, value, onChange }: { item: PropertyItem; value: unknown; onChange: (v: boolean) => void }) {
  const checked = Boolean(value)
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--forge-space-2)', cursor: item.disabled ? 'not-allowed' : 'pointer' }}>
      <input
        type="checkbox"
        checked={checked}
        disabled={item.disabled}
        aria-label={item.label}
        onChange={(e) => onChange(e.target.checked)}
        style={{ width: '14px', height: '14px', cursor: 'inherit' }}
      />
      <span style={{ fontSize: 'var(--forge-font-size-sm)', color: checked ? 'var(--forge-text)' : 'var(--forge-text-muted)' }}>
        {checked ? 'true' : 'false'}
      </span>
    </label>
  )
}

function SelectEditor({ item, value, onChange }: { item: PropertyItem; value: unknown; onChange: (v: string) => void }) {
  return (
    <select
      value={String(value ?? '')}
      disabled={item.disabled}
      aria-label={item.label}
      style={{
        width: '100%',
        height: '24px',
        padding: `0 var(--forge-space-2)`,
        border: '1px solid var(--forge-border)',
        borderRadius: 'var(--forge-radius-sm)',
        backgroundColor: 'var(--forge-bg)',
        color: 'var(--forge-text)',
        fontSize: 'var(--forge-font-size-sm)',
        fontFamily: 'var(--forge-font-sans)',
        outline: 'none',
        cursor: 'pointer',
      }}
      onChange={(e) => onChange(e.target.value)}
    >
      {item.options?.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  )
}

function Vec2Editor({ item, value, onChange }: { item: PropertyItem; value: unknown; onChange: (v: [number, number]) => void }) {
  const arr = Array.isArray(value) ? value as number[] : [0, 0]
  const inputStyle: React.CSSProperties = {
    width: '60px',
    height: '24px',
    padding: `0 var(--forge-space-1-5)`,
    border: '1px solid var(--forge-border)',
    borderRadius: 'var(--forge-radius-sm)',
    backgroundColor: 'var(--forge-bg)',
    color: 'var(--forge-text)',
    fontSize: 'var(--forge-font-size-sm)',
    fontFamily: 'var(--forge-font-mono)',
    outline: 'none',
  }
  return (
    <div style={{ display: 'flex', gap: 'var(--forge-space-1)', alignItems: 'center' }}>
      {['X', 'Y'].map((axis, i) => (
        <label key={axis} style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: 'var(--forge-font-size-xs)', color: 'var(--forge-text-muted)' }}>
          {axis}
          <input
            type="number"
            value={arr[i] ?? 0}
            disabled={item.disabled}
            aria-label={`${item.label} ${axis}`}
            step={item.step ?? 0.01}
            style={inputStyle}
            onChange={(e) => {
              const next: [number, number] = [arr[0] ?? 0, arr[1] ?? 0]
              next[i] = Number(e.target.value)
              onChange(next)
            }}
          />
        </label>
      ))}
    </div>
  )
}

function Vec3Editor({ item, value, onChange }: { item: PropertyItem; value: unknown; onChange: (v: [number, number, number]) => void }) {
  const arr = Array.isArray(value) ? value as number[] : [0, 0, 0]
  const inputStyle: React.CSSProperties = {
    width: '50px',
    height: '24px',
    padding: `0 var(--forge-space-1-5)`,
    border: '1px solid var(--forge-border)',
    borderRadius: 'var(--forge-radius-sm)',
    backgroundColor: 'var(--forge-bg)',
    color: 'var(--forge-text)',
    fontSize: 'var(--forge-font-size-sm)',
    fontFamily: 'var(--forge-font-mono)',
    outline: 'none',
  }
  return (
    <div style={{ display: 'flex', gap: 'var(--forge-space-1)', alignItems: 'center' }}>
      {['X', 'Y', 'Z'].map((axis, i) => (
        <label key={axis} style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: 'var(--forge-font-size-xs)', color: 'var(--forge-text-muted)' }}>
          {axis}
          <input
            type="number"
            value={arr[i] ?? 0}
            disabled={item.disabled}
            aria-label={`${item.label} ${axis}`}
            step={item.step ?? 0.01}
            style={inputStyle}
            onChange={(e) => {
              const next: [number, number, number] = [arr[0] ?? 0, arr[1] ?? 0, arr[2] ?? 0]
              next[i] = Number(e.target.value)
              onChange(next)
            }}
          />
        </label>
      ))}
    </div>
  )
}

function PropertyEditor({ item, value, onChange }: { item: PropertyItem; value: unknown; onChange: (v: unknown) => void }) {
  switch (item.type) {
    case 'text':    return <TextEditor item={item} value={value} onChange={onChange} />
    case 'number':  return <NumberEditor item={item} value={value} onChange={onChange} />
    case 'color':   return <ColorEditor item={item} value={value} onChange={onChange} />
    case 'boolean': return <BooleanEditor item={item} value={value} onChange={onChange} />
    case 'select':  return <SelectEditor item={item} value={value} onChange={onChange} />
    case 'vec2':    return <Vec2Editor item={item} value={value} onChange={onChange} />
    case 'vec3':    return <Vec3Editor item={item} value={value} onChange={onChange} />
    default:        return null
  }
}

// ---------------------------------------------------------------------------
// PropertyGrid
// ---------------------------------------------------------------------------
export function PropertyGrid({ sections, values, onChange, className }: PropertyGridProps) {
  const handleChange = useCallback((key: string, value: unknown) => {
    onChange(key, value)
  }, [onChange])

  return (
    <div
      className={cn('forge-property-grid', className)}
      style={{ display: 'flex', flexDirection: 'column', gap: 0 }}
    >
      {sections.map(section => (
        <Collapsible
          key={section.label}
          trigger={
            <span style={{ fontSize: 'var(--forge-font-size-xs)', fontWeight: 'var(--forge-font-semibold)', textTransform: 'uppercase', letterSpacing: 'var(--forge-tracking-wide)', color: 'var(--forge-text-muted)' }}>
              {section.label}
            </span>
          }
          defaultOpen={section.defaultOpen ?? true}
          className="forge-property-section"
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {section.items.map(item => (
              <div
                key={item.key}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '40% 1fr',
                  alignItems: 'center',
                  gap: 'var(--forge-space-2)',
                  padding: `var(--forge-space-1) var(--forge-space-3)`,
                  borderBottom: '1px solid var(--forge-border-subtle)',
                }}
              >
                <label
                  style={{
                    fontSize: 'var(--forge-font-size-sm)',
                    color: item.disabled ? 'var(--forge-text-disabled)' : 'var(--forge-text-muted)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  htmlFor={undefined}
                >
                  {item.label}
                </label>
                <PropertyEditor
                  item={item}
                  value={values[item.key]}
                  onChange={(v) => handleChange(item.key, v)}
                />
              </div>
            ))}
          </div>
        </Collapsible>
      ))}
    </div>
  )
}
