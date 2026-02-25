import * as RadixSelect from '@radix-ui/react-select'
import { cn } from '../lib/cn.js'

type SelectSize = 'sm' | 'md' | 'lg'

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectGroup {
  label: string
  options: SelectOption[]
}

interface SelectProps {
  options: (SelectOption | SelectGroup)[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  error?: boolean
  size?: SelectSize
  /** id forwarded to the trigger — allows <label htmlFor> association */
  id?: string
  className?: string
}

function isGroup(item: SelectOption | SelectGroup): item is SelectGroup {
  return 'options' in item
}

const SIZE_STYLE: Record<SelectSize, React.CSSProperties> = {
  sm: { height: '28px', fontSize: 'var(--forge-font-size-sm)',   paddingInline: 'var(--forge-space-2)' },
  md: { height: '34px', fontSize: 'var(--forge-font-size-base)', paddingInline: 'var(--forge-space-3)' },
  lg: { height: '42px', fontSize: 'var(--forge-font-size-md)',   paddingInline: 'var(--forge-space-4)' },
}

const ITEM_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  height: '32px',
  paddingInline: 'var(--forge-space-3)',
  fontSize: 'var(--forge-font-size-base)',
  color: 'var(--forge-text)',
  cursor: 'pointer',
  outline: 'none',
  userSelect: 'none',
  borderRadius: 'var(--forge-radius-sm)',
}

export function Select({
  options,
  value,
  onValueChange,
  placeholder = 'Select…',
  disabled,
  error = false,
  size = 'md',
  id,
  className,
}: SelectProps) {
  return (
    <RadixSelect.Root value={value} onValueChange={onValueChange} disabled={disabled}>
      <RadixSelect.Trigger
        id={id}
        aria-invalid={error || undefined}
        className={cn('forge-select-trigger', className)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--forge-space-2)',
          width: '100%',
          backgroundColor: disabled ? 'var(--forge-bg-disabled)' : 'var(--forge-surface)',
          border: `1px solid ${error ? 'var(--forge-danger)' : 'var(--forge-border)'}`,
          borderRadius: 'var(--forge-radius-md)',
          color: 'var(--forge-text)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          outline: 'none',
          fontFamily: 'var(--forge-font-sans)',
          transition: `border-color var(--forge-duration-fast) var(--forge-easing-default)`,
          ...SIZE_STYLE[size],
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = error ? 'var(--forge-danger)' : 'var(--forge-accent)'
          e.currentTarget.style.boxShadow = `0 0 0 2px color-mix(in srgb, ${error ? 'var(--forge-danger)' : 'var(--forge-accent)'} 25%, transparent)`
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error ? 'var(--forge-danger)' : 'var(--forge-border)'
          e.currentTarget.style.boxShadow = ''
        }}
      >
        <RadixSelect.Value placeholder={<span style={{ color: 'var(--forge-text-muted)' }}>{placeholder}</span>} />
        <RadixSelect.Icon style={{ color: 'var(--forge-text-muted)', flexShrink: 0 }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </RadixSelect.Icon>
      </RadixSelect.Trigger>

      <RadixSelect.Portal>
        <RadixSelect.Content
          style={{
            overflow: 'hidden',
            backgroundColor: 'var(--forge-surface-popover)',
            border: '1px solid var(--forge-border)',
            borderRadius: 'var(--forge-radius-md)',
            boxShadow: 'var(--forge-shadow-md)',
            zIndex: 'var(--forge-z-dropdown)',
            minWidth: 'var(--radix-select-trigger-width)',
            padding: 'var(--forge-space-1)',
            animation: `forge-dropdown-in var(--forge-duration-normal) var(--forge-easing-default)`,
          }}
          position="popper"
          sideOffset={4}
        >
          <RadixSelect.Viewport>
            {options.map((item, i) =>
              isGroup(item) ? (
                <RadixSelect.Group key={i}>
                  <RadixSelect.Label style={{ padding: 'var(--forge-space-1) var(--forge-space-3)', fontSize: 'var(--forge-font-size-xs)', color: 'var(--forge-text-muted)', fontWeight: 'var(--forge-font-semibold)', letterSpacing: 'var(--forge-tracking-wide)', textTransform: 'uppercase' }}>
                    {item.label}
                  </RadixSelect.Label>
                  {item.options.map((opt) => (
                    <SelectItem key={opt.value} option={opt} />
                  ))}
                </RadixSelect.Group>
              ) : (
                <SelectItem key={item.value} option={item} />
              )
            )}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
      <style>{`
        @keyframes forge-dropdown-in {
          from { opacity: 0; transform: scaleY(0.95); }
          to   { opacity: 1; transform: scaleY(1); }
        }
      `}</style>
    </RadixSelect.Root>
  )
}

function SelectItem({ option }: { option: SelectOption }) {
  return (
    <RadixSelect.Item
      value={option.value}
      disabled={option.disabled}
      style={ITEM_STYLE}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--forge-surface-hover)' }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
      onFocus={(e) => { e.currentTarget.style.backgroundColor = 'var(--forge-surface-hover)' }}
      onBlur={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
    >
      <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
      <RadixSelect.ItemIndicator style={{ marginLeft: 'auto', color: 'var(--forge-accent)' }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M1 6l3.5 3.5L11 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </RadixSelect.ItemIndicator>
    </RadixSelect.Item>
  )
}
