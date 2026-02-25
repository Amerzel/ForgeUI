import * as RadixContextMenu from '@radix-ui/react-context-menu'
import { cn } from '../lib/cn.js'
import { MENU_CONTENT_STYLE, MENU_ITEM_BASE } from './Menu.js'
import type { MenuEntry, MenuItem, MenuSubItem } from './Menu.js'

interface ContextMenuProps {
  /** The area that triggers the context menu on right-click */
  children: React.ReactNode
  items: MenuEntry[]
  className?: string
}

function renderItems(items: MenuEntry[]) {
  return items.map((entry, i) => {
    if (entry.type === 'separator') {
      return (
        <RadixContextMenu.Separator
          key={i}
          style={{ height: '1px', backgroundColor: 'var(--forge-border)', margin: `var(--forge-space-1) 0` }}
        />
      )
    }

    if (entry.type === 'sub') {
      const sub = entry as MenuSubItem
      return (
        <RadixContextMenu.Sub key={i}>
          <RadixContextMenu.SubTrigger
            disabled={sub.disabled}
            style={{
              ...MENU_ITEM_BASE,
              color: sub.disabled ? 'var(--forge-text-disabled)' : 'var(--forge-text)',
              justifyContent: 'space-between',
            }}
            onFocus={(e) => { e.currentTarget.style.backgroundColor = 'var(--forge-surface-hover)' }}
            onBlur={(e) => { e.currentTarget.style.backgroundColor = '' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--forge-space-2)' }}>
              {sub.icon && <span aria-hidden="true" style={{ color: 'var(--forge-text-muted)', width: '16px' }}>{sub.icon}</span>}
              {sub.label}
            </span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ color: 'var(--forge-text-muted)' }}>
              <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </RadixContextMenu.SubTrigger>
          <RadixContextMenu.Portal>
            <RadixContextMenu.SubContent style={MENU_CONTENT_STYLE} sideOffset={2} alignOffset={-4}>
              {renderItems(sub.items)}
            </RadixContextMenu.SubContent>
          </RadixContextMenu.Portal>
        </RadixContextMenu.Sub>
      )
    }

    const item = entry as MenuItem
    const isDanger = item.variant === 'danger'
    return (
      <RadixContextMenu.Item
        key={i}
        disabled={item.disabled}
        onSelect={item.onSelect}
        style={{
          ...MENU_ITEM_BASE,
          color: item.disabled
            ? 'var(--forge-text-disabled)'
            : isDanger ? 'var(--forge-danger)' : 'var(--forge-text)',
        }}
        onFocus={(e) => {
          e.currentTarget.style.backgroundColor = isDanger
            ? 'color-mix(in srgb, var(--forge-danger) 10%, transparent)'
            : 'var(--forge-surface-hover)'
        }}
        onBlur={(e) => { e.currentTarget.style.backgroundColor = '' }}
      >
        {item.icon && (
          <span aria-hidden="true" style={{ color: 'var(--forge-text-muted)', width: '16px', flexShrink: 0 }}>
            {item.icon}
          </span>
        )}
        <span style={{ flex: '1 1 auto' }}>{item.label}</span>
        {item.shortcut && (
          <span style={{ fontSize: 'var(--forge-font-size-xs)', color: 'var(--forge-text-muted)', fontFamily: 'var(--forge-font-mono)', flexShrink: 0 }}>
            {item.shortcut}
          </span>
        )}
      </RadixContextMenu.Item>
    )
  })
}

export function ContextMenu({ children, items, className }: ContextMenuProps) {
  return (
    <RadixContextMenu.Root>
      <RadixContextMenu.Trigger asChild>
        {children}
      </RadixContextMenu.Trigger>

      <RadixContextMenu.Portal>
        <RadixContextMenu.Content
          className={cn('forge-context-menu', className)}
          style={MENU_CONTENT_STYLE}
        >
          {renderItems(items)}
        </RadixContextMenu.Content>
      </RadixContextMenu.Portal>
    </RadixContextMenu.Root>
  )
}
