import { cn } from '../lib/cn.js'

export interface EntityCardProps {
  /** Entity display name */
  name: string
  /** Entity type label (e.g. "Character", "Location") */
  type: string
  /** Icon or emoji for the entity type */
  typeIcon?: React.ReactNode
  /** Short description excerpt */
  description?: string
  /** Status label (e.g. "Canon", "Draft") */
  status?: string
  /** CSS color for the status badge */
  statusColor?: string
  /** Tags displayed as small badges */
  tags?: string[]
  /** Key-value metadata pairs */
  meta?: { label: string; value: string }[]
  /** Whether the card is selected */
  selected?: boolean
  /** Click handler — makes card interactive */
  onClick?: () => void
  /** Action slot (top-right) for buttons or context menu */
  actions?: React.ReactNode
  className?: string
}

export function EntityCard({
  name,
  type,
  typeIcon,
  description,
  status,
  statusColor,
  tags,
  meta,
  selected = false,
  onClick,
  actions,
  className,
}: EntityCardProps) {
  const interactive = !!onClick

  const rootStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--forge-space-2)',
    padding: 'var(--forge-space-3)',
    borderRadius: 'var(--forge-radius-md)',
    border: `1px solid ${selected ? 'var(--forge-accent)' : 'var(--forge-border)'}`,
    backgroundColor: selected ? 'color-mix(in srgb, var(--forge-accent) 8%, var(--forge-surface))' : 'var(--forge-surface)',
    cursor: interactive ? 'pointer' : 'default',
    transition: 'border-color var(--forge-duration-fast) var(--forge-easing-default), background-color var(--forge-duration-fast) var(--forge-easing-default)',
    position: 'relative',
  }

  const content = (
    <>
      {/* Header: type icon + name + status + actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--forge-space-2)', minWidth: 0 }}>
        {typeIcon && (
          <span style={{ fontSize: 'var(--forge-font-size-base)', flexShrink: 0 }}>{typeIcon}</span>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontWeight: 600,
            fontSize: 'var(--forge-font-size-sm)',
            color: 'var(--forge-text)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {name}
          </div>
          <div style={{
            fontSize: 'var(--forge-font-size-xs)',
            color: 'var(--forge-text-muted)',
            fontFamily: 'var(--forge-font-mono)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}>
            {type}
          </div>
        </div>
        {status && (
          <span style={{
            fontSize: 'var(--forge-font-size-xs)',
            fontWeight: 500,
            padding: '1px var(--forge-space-2)',
            borderRadius: 'var(--forge-radius-sm)',
            backgroundColor: statusColor ? `color-mix(in srgb, ${statusColor} 15%, transparent)` : 'color-mix(in srgb, var(--forge-text-muted) 15%, transparent)',
            color: statusColor ?? 'var(--forge-text-muted)',
            flexShrink: 0,
          }}>
            {status}
          </span>
        )}
        {actions && (
          <div
            style={{ flexShrink: 0, marginLeft: 'var(--forge-space-1)' }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {actions}
          </div>
        )}
      </div>

      {/* Description */}
      {description && (
        <div style={{
          fontSize: 'var(--forge-font-size-xs)',
          color: 'var(--forge-text-muted)',
          lineHeight: 'var(--forge-line-height-sm)',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {description}
        </div>
      )}

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--forge-space-1)' }}>
          {tags.map((tag) => (
            <span key={tag} style={{
              fontSize: '10px',
              padding: '0 var(--forge-space-1)',
              borderRadius: 'var(--forge-radius-sm)',
              backgroundColor: 'color-mix(in srgb, var(--forge-text-muted) 12%, transparent)',
              color: 'var(--forge-text-muted)',
            }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Metadata */}
      {meta && meta.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: '0 var(--forge-space-2)',
          fontSize: 'var(--forge-font-size-xs)',
        }}>
          {meta.map((m) => (
            <React.Fragment key={m.label}>
              <span style={{ color: 'var(--forge-text-muted)' }}>{m.label}</span>
              <span style={{ color: 'var(--forge-text)', fontFamily: 'var(--forge-font-mono)' }}>{m.value}</span>
            </React.Fragment>
          ))}
        </div>
      )}
    </>
  )

  if (interactive) {
    return (
      <button
        type="button"
        className={cn('forge-entity-card', className)}
        style={{ ...rootStyle, textAlign: 'left', font: 'inherit' }}
        onClick={onClick}
        data-selected={selected || undefined}
        aria-pressed={selected}
      >
        {content}
      </button>
    )
  }

  return (
    <article className={cn('forge-entity-card', className)} style={rootStyle} data-selected={selected || undefined}>
      {content}
    </article>
  )
}

// React import needed for React.Fragment in meta rendering
import React from 'react'
