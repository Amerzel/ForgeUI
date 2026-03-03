import * as RadixDialog from '@radix-ui/react-dialog'
import { usePortalContainer } from '@forgeui/hooks'
import { Command } from 'cmdk'
import { cn } from '../lib/cn.js'

export interface CommandItem {
  id: string
  label: string
  icon?: React.ReactNode
  /** Keywords for fuzzy search (in addition to label) */
  keywords?: string[]
  shortcut?: string
  disabled?: boolean
  onSelect: () => void
}

export interface CommandGroup {
  label: string
  items: CommandItem[]
}

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  groups: CommandGroup[]
  placeholder?: string
  /** Custom empty state content */
  empty?: React.ReactNode
  className?: string
}

export function CommandPalette({
  open,
  onOpenChange,
  groups,
  placeholder = 'Type a command or search…',
  empty = 'No results found.',
  className,
}: CommandPaletteProps) {
  const portalContainer = usePortalContainer()
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal container={portalContainer}>
        <RadixDialog.Overlay
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 'var(--forge-z-overlay)',
            backdropFilter: 'blur(2px)',
          }}
        />
        <RadixDialog.Content
          aria-label="Command palette"
          className={cn('forge-command-palette', className)}
          style={{
            position: 'fixed',
            top: '20vh',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '560px',
            zIndex: 'var(--forge-z-modal)',
            outline: 'none',
          }}
        >
          <RadixDialog.Title
            style={{
              position: 'absolute',
              width: '1px',
              height: '1px',
              overflow: 'hidden',
              clip: 'rect(0,0,0,0)',
              whiteSpace: 'nowrap',
            }}
          >
            Command Palette
          </RadixDialog.Title>
          <RadixDialog.Description style={{ display: 'none' }}>
            Search for commands
          </RadixDialog.Description>

          <Command
            style={{
              backgroundColor: 'var(--forge-surface-popover)',
              border: '1px solid var(--forge-border)',
              borderRadius: 'var(--forge-radius-lg)',
              boxShadow: 'var(--forge-shadow-xl)',
              overflow: 'hidden',
            }}
            shouldFilter={true}
          >
            {/* Search input */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--forge-space-2)',
                padding: `var(--forge-space-3) var(--forge-space-4)`,
                borderBottom: '1px solid var(--forge-border)',
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                style={{ color: 'var(--forge-text-muted)', flexShrink: 0 }}
              >
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M12 12l2.5 2.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <Command.Input
                placeholder={placeholder}
                style={{
                  flex: '1 1 auto',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: 'var(--forge-font-size-base)',
                  fontFamily: 'var(--forge-font-sans)',
                  color: 'var(--forge-text)',
                }}
              />
              <kbd
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '2px 6px',
                  backgroundColor: 'var(--forge-surface)',
                  border: '1px solid var(--forge-border)',
                  borderRadius: 'var(--forge-radius-sm)',
                  fontSize: 'var(--forge-font-size-xs)',
                  fontFamily: 'var(--forge-font-mono)',
                  color: 'var(--forge-text-muted)',
                }}
              >
                Esc
              </kbd>
            </div>

            {/* Results */}
            <Command.List
              style={{ maxHeight: '360px', overflowY: 'auto', padding: 'var(--forge-space-1)' }}
            >
              <Command.Empty
                style={{
                  padding: 'var(--forge-space-8)',
                  textAlign: 'center',
                  color: 'var(--forge-text-muted)',
                  fontSize: 'var(--forge-font-size-sm)',
                }}
              >
                {empty}
              </Command.Empty>

              {groups.map((group) => (
                <Command.Group key={group.label} style={{ marginBottom: 'var(--forge-space-1)' }}>
                  <div
                    style={{
                      padding: `var(--forge-space-1) var(--forge-space-2)`,
                      fontSize: 'var(--forge-font-size-xs)',
                      fontWeight: 'var(--forge-font-semibold)',
                      color: 'var(--forge-text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: 'var(--forge-tracking-wide)',
                    }}
                  >
                    {group.label}
                  </div>
                  {group.items.map((item) => (
                    <Command.Item
                      key={item.id}
                      value={`${item.label} ${item.keywords?.join(' ') ?? ''}`}
                      disabled={item.disabled}
                      onSelect={() => {
                        if (!item.disabled) {
                          item.onSelect()
                          onOpenChange(false)
                        }
                      }}
                      className="forge-cmd-item"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--forge-space-3)',
                        padding: `var(--forge-space-2) var(--forge-space-3)`,
                        borderRadius: 'var(--forge-radius-sm)',
                        cursor: item.disabled ? 'not-allowed' : 'pointer',
                        fontSize: 'var(--forge-font-size-sm)',
                        color: item.disabled ? 'var(--forge-text-disabled)' : 'var(--forge-text)',
                        opacity: item.disabled ? 0.5 : 1,
                        listStyle: 'none',
                      }}
                    >
                      {item.icon && (
                        <span
                          aria-hidden="true"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            flexShrink: 0,
                            color: 'var(--forge-text-muted)',
                            width: '16px',
                          }}
                        >
                          {item.icon}
                        </span>
                      )}
                      <span style={{ flex: '1 1 auto' }}>{item.label}</span>
                      {item.shortcut && (
                        <kbd
                          style={{
                            fontSize: 'var(--forge-font-size-xs)',
                            fontFamily: 'var(--forge-font-mono)',
                            color: 'var(--forge-text-muted)',
                          }}
                        >
                          {item.shortcut}
                        </kbd>
                      )}
                    </Command.Item>
                  ))}
                </Command.Group>
              ))}
            </Command.List>
          </Command>
        </RadixDialog.Content>
      </RadixDialog.Portal>

      <style>{`
        .forge-cmd-item[data-selected="true"] {
          background-color: var(--forge-surface-hover);
          color: var(--forge-text);
        }
        .forge-cmd-item[data-selected="true"] svg {
          color: var(--forge-accent);
        }
      `}</style>
    </RadixDialog.Root>
  )
}
