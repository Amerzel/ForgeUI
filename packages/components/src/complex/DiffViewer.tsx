import { cn } from '../lib/cn.js'
import React, { useMemo } from 'react'

export interface DiffLine {
  type: 'add' | 'remove' | 'context'
  content: string
  oldLine?: number
  newLine?: number
}

export interface DiffViewerProps {
  /** Original text */
  before: string
  /** Modified text */
  after: string
  /** Display mode */
  mode?: 'unified' | 'split'
  /** Label for the before side */
  beforeLabel?: string
  /** Label for the after side */
  afterLabel?: string
  className?: string
}

// Simple LCS-based line diff
function computeDiff(before: string, after: string): DiffLine[] {
  const oldLines = before.split('\n')
  const newLines = after.split('\n')
  const m = oldLines.length
  const n = newLines.length

  // Build LCS table
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0) as number[])
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const prev = dp[i - 1]
      const curr = dp[i]
      if (!prev || !curr) continue
      if (oldLines[i - 1] === newLines[j - 1]) {
        curr[j] = (prev[j - 1] ?? 0) + 1
      } else {
        curr[j] = Math.max(prev[j] ?? 0, curr[j - 1] ?? 0)
      }
    }
  }

  // Backtrack to produce diff
  const result: DiffLine[] = []
  let i = m
  let j = n
  while (i > 0 || j > 0) {
    const curr = dp[i]
    const prev = dp[i - 1]
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      result.push({ type: 'context', content: oldLines[i - 1] ?? '', oldLine: i, newLine: j })
      i--
      j--
    } else if (j > 0 && (i === 0 || (curr && prev && (curr[j - 1] ?? 0) >= (prev[j] ?? 0)))) {
      result.push({ type: 'add', content: newLines[j - 1] ?? '', newLine: j })
      j--
    } else {
      result.push({ type: 'remove', content: oldLines[i - 1] ?? '', oldLine: i })
      i--
    }
  }

  return result.reverse()
}

const LINE_COLORS: Record<DiffLine['type'], string> = {
  add: 'color-mix(in srgb, var(--forge-success) 12%, transparent)',
  remove: 'color-mix(in srgb, var(--forge-danger) 12%, transparent)',
  context: 'transparent',
}

const LINE_PREFIX: Record<DiffLine['type'], string> = {
  add: '+',
  remove: '-',
  context: ' ',
}

function LineNumber({ value }: { value?: number }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: '3ch',
        textAlign: 'right',
        color: 'var(--forge-text-muted)',
        opacity: 0.6,
        userSelect: 'none',
        flexShrink: 0,
      }}
      aria-hidden
    >
      {value ?? ''}
    </span>
  )
}

function UnifiedView({ lines }: { lines: DiffLine[] }) {
  return (
    <div role="table" aria-label="Unified diff">
      {lines.map((line, idx) => (
        <div
          key={idx}
          role="row"
          style={{
            display: 'flex',
            gap: 'var(--forge-space-2)',
            padding: '0 var(--forge-space-2)',
            backgroundColor: LINE_COLORS[line.type],
            fontFamily: 'var(--forge-font-mono)',
            fontSize: 'var(--forge-font-size-xs)',
            lineHeight: '1.6',
            whiteSpace: 'pre',
          }}
        >
          <LineNumber value={line.oldLine} />
          <LineNumber value={line.newLine} />
          <span role="cell" style={{
            color: line.type === 'add' ? 'var(--forge-success)' : line.type === 'remove' ? 'var(--forge-danger)' : 'var(--forge-text)',
          }}>
            {LINE_PREFIX[line.type]} {line.content}
          </span>
        </div>
      ))}
    </div>
  )
}

function SplitView({ lines, beforeLabel, afterLabel }: { lines: DiffLine[]; beforeLabel: string; afterLabel: string }) {
  const leftLines: (DiffLine | null)[] = []
  const rightLines: (DiffLine | null)[] = []

  for (const line of lines) {
    if (line.type === 'context') {
      leftLines.push(line)
      rightLines.push(line)
    } else if (line.type === 'remove') {
      leftLines.push(line)
      rightLines.push(null)
    } else {
      leftLines.push(null)
      rightLines.push(line)
    }
  }

  // Collapse consecutive null entries to align sides
  const maxLen = Math.max(leftLines.length, rightLines.length)
  const paired: { left: DiffLine | null; right: DiffLine | null }[] = []
  for (let i = 0; i < maxLen; i++) {
    paired.push({ left: leftLines[i] ?? null, right: rightLines[i] ?? null })
  }

  const halfStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
  }

  const headerStyle: React.CSSProperties = {
    padding: 'var(--forge-space-1) var(--forge-space-2)',
    fontFamily: 'var(--forge-font-mono)',
    fontSize: 'var(--forge-font-size-xs)',
    fontWeight: 600,
    color: 'var(--forge-text-muted)',
    borderBottom: '1px solid var(--forge-border)',
  }

  return (
    <div role="table" aria-label="Split diff" style={{ display: 'flex' }}>
      <div style={halfStyle}>
        <div style={headerStyle}>{beforeLabel}</div>
        {paired.map((p, idx) => (
          <div
            key={idx}
            role="row"
            style={{
              display: 'flex',
              gap: 'var(--forge-space-2)',
              padding: '0 var(--forge-space-2)',
              backgroundColor: p.left ? LINE_COLORS[p.left.type] : 'transparent',
              fontFamily: 'var(--forge-font-mono)',
              fontSize: 'var(--forge-font-size-xs)',
              lineHeight: '1.6',
              whiteSpace: 'pre',
              minHeight: '1.6em',
            }}
          >
            <LineNumber value={p.left?.oldLine} />
            <span role="cell" style={{
              color: p.left?.type === 'remove' ? 'var(--forge-danger)' : 'var(--forge-text)',
            }}>
              {p.left ? `${LINE_PREFIX[p.left.type]} ${p.left.content}` : ''}
            </span>
          </div>
        ))}
      </div>
      <div style={{ width: '1px', backgroundColor: 'var(--forge-border)', flexShrink: 0 }} />
      <div style={halfStyle}>
        <div style={headerStyle}>{afterLabel}</div>
        {paired.map((p, idx) => (
          <div
            key={idx}
            role="row"
            style={{
              display: 'flex',
              gap: 'var(--forge-space-2)',
              padding: '0 var(--forge-space-2)',
              backgroundColor: p.right ? LINE_COLORS[p.right.type] : 'transparent',
              fontFamily: 'var(--forge-font-mono)',
              fontSize: 'var(--forge-font-size-xs)',
              lineHeight: '1.6',
              whiteSpace: 'pre',
              minHeight: '1.6em',
            }}
          >
            <LineNumber value={p.right?.newLine} />
            <span role="cell" style={{
              color: p.right?.type === 'add' ? 'var(--forge-success)' : 'var(--forge-text)',
            }}>
              {p.right ? `${LINE_PREFIX[p.right.type]} ${p.right.content}` : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function DiffViewer({
  before,
  after,
  mode = 'unified',
  beforeLabel = 'Before',
  afterLabel = 'After',
  className,
}: DiffViewerProps) {
  const lines = useMemo(() => computeDiff(before, after), [before, after])

  return (
    <div
      className={cn('forge-diff-viewer', className)}
      style={{
        border: '1px solid var(--forge-border)',
        borderRadius: 'var(--forge-radius-md)',
        backgroundColor: 'var(--forge-surface)',
        overflow: 'auto',
      }}
    >
      {mode === 'unified' ? (
        <UnifiedView lines={lines} />
      ) : (
        <SplitView lines={lines} beforeLabel={beforeLabel} afterLabel={afterLabel} />
      )}
    </div>
  )
}
