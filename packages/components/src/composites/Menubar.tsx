import * as RadixMenubar from '@radix-ui/react-menubar'
import { usePortalContainer } from '@forgeui/hooks'
import { cn } from '../lib/cn.js'
import { MENU_CONTENT_STYLE, MENU_ITEM_BASE } from '../overlays/Menu.js'
import type { MenuEntry } from '../overlays/Menu.js'

export interface MenubarMenu {
  label: string
  items: MenuEntry[]
}

interface MenubarProps {
  menus: MenubarMenu[]
  className?: string
}

function renderItems(items: MenuEntry[], portalContainer: HTMLElement | undefined) {
  return items.map((entry, i) => {
    if (entry.type === 'separator') {
      return (
        <RadixMenubar.Separator
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
        <RadixMenubar.Sub key={i}>
          <RadixMenubar.SubTrigger
            style={{
              ...MENU_ITEM_BASE,
              color: sub.disabled ? 'var(--forge-text-disabled)' : 'var(--forge-text)',
              justifyContent: 'space-between',
            }}
            disabled={sub.disabled}
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
              style={{ color: 'var(--forge-text-muted)' }}
            >
              <path
                d="M4 2l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </RadixMenubar.SubTrigger>
          <RadixMenubar.Portal container={portalContainer}>
            <RadixMenubar.SubContent style={MENU_CONTENT_STYLE} sideOffset={2} alignOffset={-4}>
              {renderItems(sub.items, portalContainer)}
            </RadixMenubar.SubContent>
          </RadixMenubar.Portal>
        </RadixMenubar.Sub>
      )
    }

    const item = entry
    const isDanger = item.variant === 'danger'
    return (
      <RadixMenubar.Item
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
      </RadixMenubar.Item>
    )
  })
}

export function Menubar({ menus, className }: MenubarProps) {
  const portalContainer = usePortalContainer()
  return (
    <RadixMenubar.Root
      className={cn('forge-menubar', className)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        backgroundColor: 'var(--forge-surface)',
        border: '1px solid var(--forge-border)',
        borderRadius: 'var(--forge-radius-md)',
        padding: 'var(--forge-space-0-5)',
        height: '36px',
      }}
    >
      {menus.map((menu, i) => (
        <RadixMenubar.Menu key={i}>
          <RadixMenubar.Trigger
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              height: '28px',
              padding: `0 var(--forge-space-3)`,
              background: 'transparent',
              border: 'none',
              borderRadius: 'var(--forge-radius-sm)',
              color: 'var(--forge-text)',
              fontSize: 'var(--forge-font-size-sm)',
              fontFamily: 'var(--forge-font-sans)',
              cursor: 'pointer',
              outline: 'none',
              userSelect: 'none',
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline =
                'var(--forge-focus-ring-width) solid var(--forge-focus-ring-color)'
              e.currentTarget.style.outlineOffset = '-1px'
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = 'none'
            }}
            className="forge-menubar-trigger"
          >
            {menu.label}
          </RadixMenubar.Trigger>
          <RadixMenubar.Portal container={portalContainer}>
            <RadixMenubar.Content style={MENU_CONTENT_STYLE} align="start" sideOffset={4}>
              {renderItems(menu.items, portalContainer)}
            </RadixMenubar.Content>
          </RadixMenubar.Portal>
        </RadixMenubar.Menu>
      ))}
      <style>{`
        .forge-menubar-trigger[data-state="open"],
        .forge-menubar-trigger:hover {
          background-color: var(--forge-surface-hover);
        }
      `}</style>
    </RadixMenubar.Root>
  )
}
