/**
 * Shared menu item types and styles used by DropdownMenu and ContextMenu.
 */

export type MenuItemVariant = 'default' | 'danger'

export interface MenuItem {
  type?: 'item'
  label: string
  icon?: React.ReactNode
  shortcut?: string
  disabled?: boolean
  variant?: MenuItemVariant
  onSelect?: () => void
}

export interface MenuSeparatorItem {
  type: 'separator'
}

export interface MenuSubItem {
  type: 'sub'
  label: string
  icon?: React.ReactNode
  disabled?: boolean
  items: MenuItem[]
}

export type MenuEntry = MenuItem | MenuSeparatorItem | MenuSubItem

export const MENU_CONTENT_STYLE: React.CSSProperties = {
  overflow: 'hidden',
  backgroundColor: 'var(--forge-surface-popover)',
  color: 'var(--forge-text)',
  border: '1px solid var(--forge-border)',
  borderRadius: 'var(--forge-radius-md)',
  boxShadow: 'var(--forge-shadow-md)',
  padding: 'var(--forge-space-1)',
  minWidth: '180px',
  animation: `forge-dropdown-in var(--forge-duration-fast) var(--forge-easing-default)`,
}

export const MENU_ITEM_BASE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--forge-space-2)',
  padding: `var(--forge-space-1-5) var(--forge-space-3)`,
  borderRadius: 'var(--forge-radius-sm)',
  fontSize: 'var(--forge-font-size-sm)',
  fontFamily: 'var(--forge-font-sans)',
  cursor: 'pointer',
  outline: 'none',
  userSelect: 'none',
  lineHeight: 'var(--forge-line-height-sm)',
}
