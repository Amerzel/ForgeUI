import * as RadixTabs from '@radix-ui/react-tabs'
import { cn } from '../lib/cn.js'

type TabsVariant = 'line' | 'solid'
type TabsOrientation = 'horizontal' | 'vertical'

interface TabItem {
  value: string
  label: React.ReactNode
  content: React.ReactNode
  disabled?: boolean
}

interface TabsProps {
  items: TabItem[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  variant?: TabsVariant
  orientation?: TabsOrientation
  className?: string
}

export function Tabs({
  items,
  value,
  defaultValue,
  onValueChange,
  variant = 'line',
  orientation = 'horizontal',
  className,
}: TabsProps) {
  const isVertical = orientation === 'vertical'

  return (
    <RadixTabs.Root
      value={value}
      defaultValue={defaultValue ?? items[0]?.value}
      onValueChange={onValueChange}
      orientation={orientation}
      className={cn('forge-tabs', className)}
      style={{
        display: 'flex',
        flexDirection: isVertical ? 'row' : 'column',
        gap: 0,
      }}
    >
      <RadixTabs.List
        className="forge-tabs-list"
        style={{
          display: 'flex',
          flexDirection: isVertical ? 'column' : 'row',
          gap: variant === 'solid' ? 'var(--forge-space-1)' : 0,
          flexShrink: 0,
          borderBottom: !isVertical && variant === 'line' ? '1px solid var(--forge-border)' : undefined,
          borderRight: isVertical && variant === 'line' ? '1px solid var(--forge-border)' : undefined,
          padding: variant === 'solid' ? 'var(--forge-space-1)' : undefined,
          backgroundColor: variant === 'solid' ? 'var(--forge-surface)' : undefined,
          borderRadius: variant === 'solid' ? 'var(--forge-radius-md)' : undefined,
        }}
      >
        {items.map((item) => (
          <RadixTabs.Trigger
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            className="forge-tabs-trigger"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: `var(--forge-space-2) var(--forge-space-3)`,
              background: 'transparent',
              border: 'none',
              borderBottom: !isVertical && variant === 'line' ? '2px solid transparent' : undefined,
              marginBottom: !isVertical && variant === 'line' ? '-1px' : undefined,
              color: 'var(--forge-text-muted)',
              fontFamily: 'var(--forge-font-sans)',
              fontSize: 'var(--forge-font-size-sm)',
              fontWeight: 'var(--forge-font-medium)',
              cursor: item.disabled ? 'not-allowed' : 'pointer',
              opacity: item.disabled ? 0.5 : 1,
              outline: 'none',
              borderRadius: variant === 'solid' ? 'var(--forge-radius-sm)' : undefined,
              whiteSpace: 'nowrap',
              transition: `color var(--forge-duration-fast) var(--forge-easing-default),
                           background-color var(--forge-duration-fast) var(--forge-easing-default)`,
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = 'var(--forge-focus-ring-width) solid var(--forge-focus-ring-color)'
              e.currentTarget.style.outlineOffset = '-2px'
            }}
            onBlur={(e) => { e.currentTarget.style.outline = 'none' }}
          >
            {item.label}
          </RadixTabs.Trigger>
        ))}
        <style>{`
          .forge-tabs-trigger[data-state="active"] {
            color: var(--forge-accent);
          }
          .forge-tabs[data-orientation="horizontal"] .forge-tabs-trigger[data-state="active"].forge-tabs-line {
            border-bottom-color: var(--forge-accent);
          }
          .forge-tabs-solid .forge-tabs-trigger[data-state="active"] {
            background-color: color-mix(in srgb, var(--forge-accent) 15%, transparent);
          }
        `}</style>
      </RadixTabs.List>

      {items.map((item) => (
        <RadixTabs.Content
          key={item.value}
          value={item.value}
          style={{
            padding: 'var(--forge-space-4)',
            flex: '1 1 auto',
            outline: 'none',
          }}
          onFocus={(e) => {
            // Only show ring when focused via keyboard, not when content is clicked
            if (e.target === e.currentTarget) {
              e.currentTarget.style.outline = 'var(--forge-focus-ring-width) solid var(--forge-focus-ring-color)'
              e.currentTarget.style.outlineOffset = '-2px'
            }
          }}
          onBlur={(e) => { e.currentTarget.style.outline = 'none' }}
        >
          {item.content}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  )
}
