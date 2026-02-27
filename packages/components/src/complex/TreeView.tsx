import { useCallback } from 'react'
import { cn } from '../lib/cn.js'

export interface TreeNode {
  id: string
  label: string
  icon?: React.ReactNode
  children?: TreeNode[]
  /** Prevents expanding this node */
  disabled?: boolean
}

interface TreeViewProps {
  nodes: TreeNode[]
  selected?: string | string[]
  expanded?: string[]
  onSelect?: (id: string) => void
  onExpand?: (id: string, open: boolean) => void
  /** Allow multiple selection */
  multiSelect?: boolean
  className?: string
}

interface TreeNodeItemProps {
  node: TreeNode
  depth: number
  selected: Set<string>
  expanded: Set<string>
  onSelect: (id: string) => void
  onExpand: (id: string, open: boolean) => void
  multiSelect: boolean
}

function TreeNodeItem({ node, depth, selected, expanded, onSelect, onExpand, multiSelect }: TreeNodeItemProps) {
  const hasChildren = node.children && node.children.length > 0
  const isExpanded = expanded.has(node.id)
  const isSelected = selected.has(node.id)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (node.disabled) return
    if (e.key === 'Enter' || (e.key === ' ' && !hasChildren)) {
      e.preventDefault()
      onSelect(node.id)
    }
    if (e.key === ' ' && hasChildren) {
      e.preventDefault()
      onExpand(node.id, !isExpanded)
    }
    if (e.key === 'ArrowRight' && hasChildren && !isExpanded) {
      e.preventDefault()
      onExpand(node.id, true)
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      if (isExpanded && hasChildren) {
        onExpand(node.id, false)
      }
    }
  }

  return (
    <li role="treeitem" aria-selected={multiSelect ? isSelected : undefined} aria-expanded={hasChildren ? isExpanded : undefined} aria-disabled={node.disabled}>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        tabIndex={node.disabled ? -1 : 0}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--forge-space-1-5)',
          padding: `var(--forge-space-1) var(--forge-space-2)`,
          paddingLeft: `calc(var(--forge-space-2) + ${depth * 16}px)`,
          borderRadius: 'var(--forge-radius-sm)',
          cursor: node.disabled ? 'not-allowed' : 'pointer',
          backgroundColor: isSelected ? 'color-mix(in srgb, var(--forge-accent) 15%, transparent)' : 'transparent',
          color: node.disabled ? 'var(--forge-text-disabled)' : isSelected ? 'var(--forge-accent)' : 'var(--forge-text)',
          fontSize: 'var(--forge-font-size-sm)',
          fontFamily: 'var(--forge-font-sans)',
          userSelect: 'none',
          outline: 'none',
          opacity: node.disabled ? 0.5 : 1,
        }}
        onClick={() => {
          if (node.disabled) return
          if (hasChildren) onExpand(node.id, !isExpanded)
          onSelect(node.id)
        }}
        onKeyDown={handleKeyDown}
        onMouseEnter={(e) => { if (!isSelected && !node.disabled) e.currentTarget.style.backgroundColor = 'var(--forge-surface-hover)' }}
        onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent' }}
        onFocus={(e) => { e.currentTarget.style.outline = 'var(--forge-focus-ring-width) solid var(--forge-focus-ring-color)'; e.currentTarget.style.outlineOffset = 'var(--forge-focus-ring-offset)' }}
        onBlur={(e) => { e.currentTarget.style.outline = 'none' }}
      >
        {/* Expand chevron or spacer */}
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '16px',
            height: '16px',
            flexShrink: 0,
            color: 'var(--forge-text-muted)',
            transition: `transform var(--forge-duration-fast) var(--forge-easing-default)`,
            transform: hasChildren && isExpanded ? 'rotate(90deg)' : undefined,
          }}
        >
          {hasChildren && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </span>

        {node.icon && (
          <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0, color: 'var(--forge-text-muted)', width: '16px' }} aria-hidden="true">
            {node.icon}
          </span>
        )}

        <span style={{ flex: '1 1 auto', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {node.label}
        </span>
      </div>

      {hasChildren && isExpanded && (
        <ul role="group" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {node.children?.map(child => (
            <TreeNodeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              selected={selected}
              expanded={expanded}
              onSelect={onSelect}
              onExpand={onExpand}
              multiSelect={multiSelect}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

export function TreeView({
  nodes,
  selected,
  expanded = [],
  onSelect,
  onExpand,
  multiSelect = false,
  className,
}: TreeViewProps) {
  const selectedSet = new Set(
    Array.isArray(selected) ? selected : selected ? [selected] : []
  )
  const expandedSet = new Set(expanded)

  const handleSelect = useCallback((id: string) => {
    onSelect?.(id)
  }, [onSelect])

  const handleExpand = useCallback((id: string, open: boolean) => {
    onExpand?.(id, open)
  }, [onExpand])

  return (
    <ul
      role="tree"
      aria-multiselectable={multiSelect}
      className={cn('forge-tree-view', className)}
      style={{ listStyle: 'none', padding: 0, margin: 0 }}
    >
      {nodes.map(node => (
        <TreeNodeItem
          key={node.id}
          node={node}
          depth={0}
          selected={selectedSet}
          expanded={expandedSet}
          onSelect={handleSelect}
          onExpand={handleExpand}
          multiSelect={multiSelect}
        />
      ))}
    </ul>
  )
}
