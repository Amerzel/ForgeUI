import { cn } from '../lib/cn.js'

interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Keyboard shortcut keys. Pass an array for multi-key combos,
   * or a string for a single key. Renders with '+' separators.
   * @example keys={['⌘', 'S']} or keys="Escape"
   */
  keys: string | string[]
}

/**
 * Keyboard shortcut display. Renders styled keycap elements with separators.
 * Uses monospace font and surface-raised styling.
 */
export function Kbd({ keys, className, ...props }: KbdProps) {
  const keyArray = Array.isArray(keys) ? keys : [keys]

  return (
    <span
      className={cn('forge-kbd', className)}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}
      {...props}
    >
      {keyArray.map((key, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
          {i > 0 && (
            <span
              aria-hidden="true"
              style={{ color: 'var(--forge-text-muted)', fontSize: 'var(--forge-font-size-xs)', userSelect: 'none' }}
            >
              +
            </span>
          )}
          <kbd
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '20px',
              height: '20px',
              paddingInline: '4px',
              fontFamily: 'var(--forge-font-mono)',
              fontSize: 'var(--forge-font-size-xs)',
              fontWeight: 'var(--forge-font-medium)',
              lineHeight: '1',
              color: 'var(--forge-text)',
              backgroundColor: 'var(--forge-surface-raised)',
              border: '1px solid var(--forge-border)',
              borderBottomWidth: '2px',
              borderRadius: 'var(--forge-radius-sm)',
              boxShadow: 'var(--forge-shadow-sm)',
              userSelect: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {key}
          </kbd>
        </span>
      ))}
    </span>
  )
}
