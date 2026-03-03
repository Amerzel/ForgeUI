import * as RadixDropdown from '@radix-ui/react-dropdown-menu'
import { usePortalContainer } from '@forgeui/hooks'
import { cn } from '../lib/cn.js'
import { MENU_CONTENT_STYLE, MENU_ITEM_BASE } from './Menu.js'
import type { MenuEntry } from './Menu.js'

interface DropdownMenuProps {
  trigger: React.ReactNode
  items: MenuEntry[]
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

function renderItems(items: MenuEntry[], portalContainer: HTMLElement | undefined) {
  return items.map((entry, i) => {
    if (entry.type === 'separator') {
      return (
        <RadixDropdown.Separator
          key={i}
          style={{
            height: '1px',
            backgroundColor: 'var(--forge-border)',
            margin: `var(--forge-space-1) 0`,
          }}
        />
      )
    }

    if (entry.type === 'sub') {
      const sub = entry
      return (
        <RadixDropdown.Sub key={i}>
          <RadixDropdown.SubTrigger
            disabled={sub.disabled}
            style={{
              ...MENU_ITEM_BASE,
              color: sub.disabled ? 'var(--forge-text-disabled)' : 'var(--forge-text)',
              justifyContent: 'space-between',
            }}
            onFocus={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--forge-surface-hover)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.backgroundColor = ''
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--forge-space-2)' }}>
              {sub.icon && (
                <span
                  aria-hidden="true"
                  style={{ color: 'var(--forge-text-muted)', width: '16px' }}
                >
                  {sub.icon}
                </span>
              )}
              {sub.label}
            </span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
              style={{ color: 'var(--forge-text-muted)', flexShrink: 0 }}
            >
              <path
                d="M4 2l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </RadixDropdown.SubTrigger>
          <RadixDropdown.Portal container={portalContainer}>
            <RadixDropdown.SubContent style={MENU_CONTENT_STYLE} sideOffset={2} alignOffset={-4}>
              {renderItems(sub.items, portalContainer)}
            </RadixDropdown.SubContent>
          </RadixDropdown.Portal>
        </RadixDropdown.Sub>
      )
    }

    const item = entry
    const isDanger = item.variant === 'danger'
    return (
      <RadixDropdown.Item
        key={i}
        disabled={item.disabled}
        onSelect={item.onSelect}
        style={{
          ...MENU_ITEM_BASE,
          color: item.disabled
            ? 'var(--forge-text-disabled)'
            : isDanger
              ? 'var(--forge-danger)'
              : 'var(--forge-text)',
        }}
        onFocus={(e) => {
          e.currentTarget.style.backgroundColor = isDanger
            ? 'color-mix(in srgb, var(--forge-danger) 10%, transparent)'
            : 'var(--forge-surface-hover)'
        }}
        onBlur={(e) => {
          e.currentTarget.style.backgroundColor = ''
        }}
      >
        {item.icon && (
          <span
            aria-hidden="true"
            style={{ color: 'var(--forge-text-muted)', width: '16px', flexShrink: 0 }}
          >
            {item.icon}
          </span>
        )}
        <span style={{ flex: '1 1 auto' }}>{item.label}</span>
        {item.shortcut && (
          <span
            style={{
              fontSize: 'var(--forge-font-size-xs)',
              color: 'var(--forge-text-muted)',
              fontFamily: 'var(--forge-font-mono)',
              flexShrink: 0,
            }}
          >
            {item.shortcut}
          </span>
        )}
      </RadixDropdown.Item>
    )
  })
}

export function DropdownMenu({
  trigger,
  items,
  align = 'start',
  sideOffset = 4,
  open,
  onOpenChange,
  className,
}: DropdownMenuProps) {
  const portalContainer = usePortalContainer()
  return (
    <RadixDropdown.Root open={open} onOpenChange={onOpenChange}>
      <RadixDropdown.Trigger asChild>{trigger}</RadixDropdown.Trigger>

      <RadixDropdown.Portal container={portalContainer}>
        <RadixDropdown.Content
          align={align}
          sideOffset={sideOffset}
          className={cn('forge-dropdown-menu', className)}
          style={MENU_CONTENT_STYLE}
        >
          {renderItems(items, portalContainer)}
          <style>{`
            @keyframes forge-dropdown-in {
              from { opacity: 0; }
              to   { opacity: 1; }
            }
          `}</style>
        </RadixDropdown.Content>
      </RadixDropdown.Portal>
    </RadixDropdown.Root>
  )
}
