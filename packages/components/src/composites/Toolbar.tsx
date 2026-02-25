import * as RadixToolbar from '@radix-ui/react-toolbar'
import { cn } from '../lib/cn.js'

interface ToolbarProps {
  children: React.ReactNode
  orientation?: 'horizontal' | 'vertical'
  /** Accessible label for the toolbar landmark */
  'aria-label': string
  className?: string
}

interface ToolbarButtonProps extends React.ComponentPropsWithoutRef<typeof RadixToolbar.Button> {
  className?: string
}

type ToolbarToggleGroupProps = React.ComponentPropsWithoutRef<typeof RadixToolbar.ToggleGroup> & {
  type: 'single' | 'multiple'
}

type ToolbarToggleItemProps = React.ComponentPropsWithoutRef<typeof RadixToolbar.ToggleItem> & {
  className?: string
}

interface ToolbarSeparatorProps {
  className?: string
}

function ToolbarRoot({ children, orientation = 'horizontal', 'aria-label': ariaLabel, className }: ToolbarProps) {
  return (
    <RadixToolbar.Root
      orientation={orientation}
      aria-label={ariaLabel}
      className={cn('forge-toolbar', className)}
      style={{
        display: 'flex',
        flexDirection: orientation === 'vertical' ? 'column' : 'row',
        alignItems: 'center',
        gap: 'var(--forge-space-1)',
        padding: 'var(--forge-space-1)',
        backgroundColor: 'var(--forge-surface)',
        border: '1px solid var(--forge-border)',
        borderRadius: 'var(--forge-radius-md)',
      }}
    >
      {children}
    </RadixToolbar.Root>
  )
}

const TOOL_BTN: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: `var(--forge-space-1-5) var(--forge-space-2)`,
  height: '30px',
  minWidth: '30px',
  backgroundColor: 'transparent',
  border: 'none',
  borderRadius: 'var(--forge-radius-sm)',
  color: 'var(--forge-text-muted)',
  fontSize: 'var(--forge-font-size-sm)',
  fontFamily: 'var(--forge-font-sans)',
  cursor: 'pointer',
  outline: 'none',
  userSelect: 'none',
  transition: `background-color var(--forge-duration-fast) var(--forge-easing-default), color var(--forge-duration-fast) var(--forge-easing-default)`,
}

function ToolbarButton({ children, disabled, className, ...props }: ToolbarButtonProps) {
  return (
    <RadixToolbar.Button
      disabled={disabled}
      className={cn('forge-toolbar-button', className)}
      style={{ ...TOOL_BTN, opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
      onMouseEnter={(e) => { if (!disabled) { e.currentTarget.style.backgroundColor = 'var(--forge-surface-hover)'; e.currentTarget.style.color = 'var(--forge-text)' } }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--forge-text-muted)' }}
      onFocus={(e) => { e.currentTarget.style.outline = 'var(--forge-focus-ring-width) solid var(--forge-focus-ring-color)'; e.currentTarget.style.outlineOffset = '-1px' }}
      onBlur={(e) => { e.currentTarget.style.outline = 'none' }}
      {...props}
    >
      {children}
    </RadixToolbar.Button>
  )
}

function ToolbarSeparator({ className }: ToolbarSeparatorProps) {
  return (
    <RadixToolbar.Separator
      className={cn('forge-toolbar-separator', className)}
      style={{ width: '1px', height: '20px', backgroundColor: 'var(--forge-border)', flexShrink: 0, margin: '0 var(--forge-space-1)' }}
    />
  )
}

function ToolbarToggleGroup(props: ToolbarToggleGroupProps) {
  return (
    <RadixToolbar.ToggleGroup
      {...props}
      style={{ display: 'contents' }}
    />
  )
}

function ToolbarToggleItem({ children, className, ...props }: ToolbarToggleItemProps) {
  return (
    <RadixToolbar.ToggleItem
      className={cn('forge-toolbar-toggle-item', className)}
      style={TOOL_BTN}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--forge-surface-hover)'; e.currentTarget.style.color = 'var(--forge-text)' }}
      onMouseLeave={(e) => {
        const isOn = e.currentTarget.getAttribute('data-state') === 'on'
        e.currentTarget.style.backgroundColor = isOn ? 'color-mix(in srgb, var(--forge-accent) 15%, transparent)' : 'transparent'
        e.currentTarget.style.color = isOn ? 'var(--forge-accent)' : 'var(--forge-text-muted)'
      }}
      onFocus={(e) => { e.currentTarget.style.outline = 'var(--forge-focus-ring-width) solid var(--forge-focus-ring-color)'; e.currentTarget.style.outlineOffset = '-1px' }}
      onBlur={(e) => { e.currentTarget.style.outline = 'none' }}
      {...props}
    >
      {children}
      <style>{`
        .forge-toolbar-toggle-item[data-state="on"] {
          background-color: color-mix(in srgb, var(--forge-accent) 15%, transparent);
          color: var(--forge-accent);
        }
      `}</style>
    </RadixToolbar.ToggleItem>
  )
}

export const Toolbar = Object.assign(ToolbarRoot, {
  Button: ToolbarButton,
  Separator: ToolbarSeparator,
  ToggleGroup: ToolbarToggleGroup,
  ToggleItem: ToolbarToggleItem,
})
