import { useState, useCallback, useMemo } from 'react'
import { cn } from '../lib/cn.js'

export interface JsonViewerProps {
  /** JSON data to display */
  data: unknown
  /** Initial expand depth (0 = collapsed, Infinity = fully expanded) */
  defaultExpandDepth?: number
  /** Enable search/filter input */
  searchable?: boolean
  /** Show copy-to-clipboard button */
  showCopy?: boolean
  className?: string
}

export function JsonViewer({
  data,
  defaultExpandDepth = 1,
  searchable = false,
  showCopy = true,
  className,
}: JsonViewerProps) {
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState(false)

  const json = useMemo((): unknown => {
    try {
      return typeof data === 'string' ? (JSON.parse(data) as unknown) : data
    } catch {
      return data
    }
  }, [data])

  const prettyJson = useMemo(() => JSON.stringify(json, null, 2), [json])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(prettyJson)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = prettyJson
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [prettyJson])

  return (
    <div
      className={cn('forge-json-viewer', className)}
      style={{
        borderRadius: 'var(--forge-radius-lg)',
        border: '1px solid var(--forge-border)',
        overflow: 'hidden',
        fontSize: 'var(--forge-font-size-sm)',
        lineHeight: 'var(--forge-line-height-sm)',
        fontFamily: 'var(--forge-font-mono)',
      }}
    >
      {/* Toolbar */}
      {(searchable || showCopy) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--forge-space-2)',
            padding: 'var(--forge-space-1) var(--forge-space-3)',
            backgroundColor: 'var(--forge-surface)',
            borderBottom: '1px solid var(--forge-border)',
          }}
        >
          <span
            style={{
              fontSize: 'var(--forge-font-size-xs)',
              color: 'var(--forge-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--forge-tracking-wide)',
            }}
          >
            JSON
          </span>
          <div style={{ flex: 1 }} />
          {searchable && (
            <input
              type="search"
              placeholder="Filter keys/values…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Filter JSON"
              style={{
                padding: '2px var(--forge-space-2)',
                border: '1px solid var(--forge-border)',
                borderRadius: 'var(--forge-radius-md)',
                backgroundColor: 'var(--forge-surface-sunken)',
                color: 'var(--forge-text)',
                fontSize: 'var(--forge-font-size-xs)',
                fontFamily: 'var(--forge-font-sans)',
                outline: 'none',
                width: 160,
              }}
            />
          )}
          {showCopy && (
            <button
              type="button"
              onClick={() => void handleCopy()}
              aria-label={copied ? 'Copied' : 'Copy JSON'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--forge-space-1)',
                padding: '2px var(--forge-space-2)',
                border: '1px solid var(--forge-border)',
                borderRadius: 'var(--forge-radius-md)',
                backgroundColor: 'transparent',
                color: copied ? 'var(--forge-success)' : 'var(--forge-text-muted)',
                fontSize: 'var(--forge-font-size-xs)',
                fontFamily: 'var(--forge-font-sans)',
                cursor: 'pointer',
                transition: `color var(--forge-duration-fast) var(--forge-easing-default)`,
              }}
            >
              {copied ? (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
              {copied ? 'Copied' : 'Copy'}
            </button>
          )}
        </div>
      )}

      {/* Tree */}
      <div
        style={{
          padding: 'var(--forge-space-3)',
          backgroundColor: 'var(--forge-surface-sunken)',
          overflowX: 'auto',
        }}
        role="tree"
        aria-label="JSON data"
      >
        <JsonNode
          value={json}
          depth={0}
          defaultExpandDepth={defaultExpandDepth}
          search={search}
          keyName={undefined}
          isLast={true}
        />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Internal recursive node
// ---------------------------------------------------------------------------

interface JsonNodeProps {
  keyName: string | undefined
  value: unknown
  depth: number
  defaultExpandDepth: number
  search: string
  isLast: boolean
}

function JsonNode({ keyName, value, depth, defaultExpandDepth, search, isLast }: JsonNodeProps) {
  const [expanded, setExpanded] = useState(depth < defaultExpandDepth)

  const isObject = value !== null && typeof value === 'object' && !Array.isArray(value)
  const isArray = Array.isArray(value)
  const isExpandable = isObject || isArray

  const toggle = useCallback(() => setExpanded((v) => !v), [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        toggle()
      } else if (e.key === 'ArrowRight' && !expanded) {
        e.preventDefault()
        setExpanded(true)
      } else if (e.key === 'ArrowLeft' && expanded) {
        e.preventDefault()
        setExpanded(false)
      }
    },
    [expanded, toggle],
  )

  const matchesSearch =
    search.length > 0 &&
    ((keyName != null && keyName.toLowerCase().includes(search.toLowerCase())) ||
      (!isExpandable && String(value).toLowerCase().includes(search.toLowerCase())))

  const highlightStyle: React.CSSProperties | undefined = matchesSearch
    ? { backgroundColor: 'var(--forge-highlight-bg)', borderRadius: 'var(--forge-radius-sm)' }
    : undefined

  const indent = depth * 16

  if (isExpandable) {
    const bracket = isArray ? ['[', ']'] : ['{', '}']
    const arrayItems = isArray ? (value as unknown[]) : []
    const objectEntries = isObject ? Object.entries(value as Record<string, unknown>) : []
    const count = isArray ? arrayItems.length : objectEntries.length

    return (
      <div
        role="treeitem"
        aria-expanded={expanded}
        aria-selected={false}
        style={{ paddingLeft: indent }}
      >
        <span
          role="button"
          tabIndex={0}
          onClick={toggle}
          onKeyDown={handleKeyDown}
          aria-label={`${expanded ? 'Collapse' : 'Expand'} ${keyName ?? (isArray ? 'array' : 'object')}`}
          style={{
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--forge-space-1)',
            outline: 'none',
          }}
        >
          <span
            aria-hidden="true"
            style={{
              display: 'inline-block',
              width: 12,
              textAlign: 'center',
              color: 'var(--forge-text-muted)',
              transition: `transform var(--forge-duration-fast) var(--forge-easing-default)`,
              transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
              fontSize: 10,
            }}
          >
            ▶
          </span>
          {keyName != null && (
            <span style={{ color: 'var(--forge-accent)', ...highlightStyle }}>
              &quot;{keyName}&quot;
            </span>
          )}
          {keyName != null && <span style={{ color: 'var(--forge-text-muted)' }}>: </span>}
          <span style={{ color: 'var(--forge-text-muted)' }}>{bracket[0]}</span>
          {!expanded && (
            <span
              style={{ color: 'var(--forge-text-disabled)', fontSize: 'var(--forge-font-size-xs)' }}
            >
              {' '}
              {count} {count === 1 ? 'item' : 'items'}{' '}
            </span>
          )}
          {!expanded && (
            <span style={{ color: 'var(--forge-text-muted)' }}>
              {bracket[1]}
              {isLast ? '' : ','}
            </span>
          )}
        </span>

        {expanded && (
          <div role="group">
            {isArray
              ? arrayItems.map((item, i) => (
                  <JsonNode
                    key={i}
                    keyName={undefined}
                    value={item}
                    depth={depth + 1}
                    defaultExpandDepth={defaultExpandDepth}
                    search={search}
                    isLast={i === arrayItems.length - 1}
                  />
                ))
              : objectEntries.map(([k, v], i) => (
                  <JsonNode
                    key={k}
                    keyName={k}
                    value={v}
                    depth={depth + 1}
                    defaultExpandDepth={defaultExpandDepth}
                    search={search}
                    isLast={i === objectEntries.length - 1}
                  />
                ))}
            <div style={{ paddingLeft: indent }}>
              <span style={{ color: 'var(--forge-text-muted)' }}>
                {bracket[1]}
                {isLast ? '' : ','}
              </span>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Primitive value
  return (
    <div role="treeitem" aria-selected={false} style={{ paddingLeft: indent }}>
      <span style={{ display: 'inline-block', width: 12, flexShrink: 0 }} />
      {keyName != null && (
        <>
          <span style={{ color: 'var(--forge-accent)', ...highlightStyle }}>
            &quot;{keyName}&quot;
          </span>
          <span style={{ color: 'var(--forge-text-muted)' }}>: </span>
        </>
      )}
      <PrimitiveValue
        value={value}
        highlight={matchesSearch && keyName == null ? highlightStyle : undefined}
      />
      {!isLast && <span style={{ color: 'var(--forge-text-muted)' }}>,</span>}
    </div>
  )
}

function PrimitiveValue({ value, highlight }: { value: unknown; highlight?: React.CSSProperties }) {
  if (value === null)
    return <span style={{ color: 'var(--forge-text-disabled)', ...highlight }}>null</span>
  if (typeof value === 'boolean')
    return <span style={{ color: 'var(--forge-info)', ...highlight }}>{String(value)}</span>
  if (typeof value === 'number')
    return <span style={{ color: 'var(--forge-info)', ...highlight }}>{String(value)}</span>
  const str = typeof value === 'string' ? value : JSON.stringify(value)
  return <span style={{ color: 'var(--forge-success)', ...highlight }}>&quot;{str}&quot;</span>
}
