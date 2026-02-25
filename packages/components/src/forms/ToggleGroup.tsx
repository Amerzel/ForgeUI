import * as RadixToggleGroup from '@radix-ui/react-toggle-group'
import { cn } from '../lib/cn.js'

type ToggleGroupType = 'single' | 'multiple'
type ToggleGroupOrientation = 'horizontal' | 'vertical'

interface ToggleGroupItem {
  value: string
  label: React.ReactNode
  disabled?: boolean
  'aria-label'?: string
}

interface ToggleGroupProps {
  type: ToggleGroupType
  items: ToggleGroupItem[]
  value?: string | string[]
  onValueChange?: (value: string & string[]) => void
  orientation?: ToggleGroupOrientation
  disabled?: boolean
  className?: string
}

const ITEM_STYLE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '34px',
  paddingInline: 'var(--forge-space-3)',
  fontSize: 'var(--forge-font-size-base)',
  fontFamily: 'var(--forge-font-sans)',
  fontWeight: 'var(--forge-font-medium)',
  color: 'var(--forge-text)',
  backgroundColor: 'transparent',
  border: '1px solid var(--forge-border)',
  cursor: 'pointer',
  outline: 'none',
  userSelect: 'none',
  transition: `background-color var(--forge-duration-fast) var(--forge-easing-default),
               color var(--forge-duration-fast) var(--forge-easing-default)`,
}

export function ToggleGroup({ type, items, value, onValueChange, orientation = 'horizontal', disabled, className }: ToggleGroupProps) {
  // Cast to satisfy Radix's discriminated union types
  const rootProps = type === 'single'
    ? { type: 'single' as const, value: value as string, onValueChange: onValueChange as (v: string) => void }
    : { type: 'multiple' as const, value: value as string[], onValueChange: onValueChange as (v: string[]) => void }

  return (
    <RadixToggleGroup.Root
      {...rootProps}
      orientation={orientation}
      disabled={disabled}
      className={cn('forge-toggle-group', className)}
      style={{
        display: 'inline-flex',
        flexDirection: orientation === 'vertical' ? 'column' : 'row',
        borderRadius: 'var(--forge-radius-md)',
        overflow: 'hidden',
        border: '1px solid var(--forge-border)',
      }}
    >
      {items.map((item, i) => (
        <RadixToggleGroup.Item
          key={item.value}
          value={item.value}
          disabled={item.disabled}
          aria-label={item['aria-label']}
          style={{
            ...ITEM_STYLE,
            // Remove double-border between items
            borderRadius: 0,
            borderWidth: 0,
            borderLeftWidth: orientation === 'horizontal' && i > 0 ? '1px' : 0,
            borderTopWidth: orientation === 'vertical' && i > 0 ? '1px' : 0,
            opacity: item.disabled ? 0.5 : 1,
            cursor: item.disabled ? 'not-allowed' : 'pointer',
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline = 'var(--forge-focus-ring-width) solid var(--forge-focus-ring-color)'
            e.currentTarget.style.outlineOffset = '-2px'
          }}
          onBlur={(e) => { e.currentTarget.style.outline = 'none' }}
          // data-state="on" is set by Radix — we style pressed state via CSS data attribute
        >
          {item.label}
        </RadixToggleGroup.Item>
      ))}
      <style>{`
        .forge-toggle-group [data-state="on"] {
          background-color: color-mix(in srgb, var(--forge-accent) 15%, transparent);
          color: var(--forge-accent);
        }
      `}</style>
    </RadixToggleGroup.Root>
  )
}
