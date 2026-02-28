import { cn } from '../lib/cn.js'
import React, { useState } from 'react'

export interface ApprovalPanelProps {
  /** Title of the item being reviewed */
  title: string
  /** Description or context for the decision */
  description?: string
  /** Current approval status */
  status?: 'pending' | 'approved' | 'rejected'
  /** Called when user approves with optional rationale */
  onApprove?: (rationale: string) => void
  /** Called when user rejects with optional rationale */
  onReject?: (rationale: string) => void
  /** Content to review (displayed in the body) */
  children: React.ReactNode
  className?: string
}

const STATUS_CONFIG = {
  pending: { label: 'Pending Review', color: 'var(--forge-warning)' },
  approved: { label: 'Approved', color: 'var(--forge-success)' },
  rejected: { label: 'Rejected', color: 'var(--forge-danger)' },
} as const

export function ApprovalPanel({
  title,
  description,
  status = 'pending',
  onApprove,
  onReject,
  children,
  className,
}: ApprovalPanelProps) {
  const [rationale, setRationale] = useState('')
  const config = STATUS_CONFIG[status]
  const isPending = status === 'pending'

  const handleApprove = () => {
    onApprove?.(rationale)
    setRationale('')
  }

  const handleReject = () => {
    onReject?.(rationale)
    setRationale('')
  }

  return (
    <div
      className={cn('forge-approval-panel', className)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid var(--forge-border)',
        borderRadius: 'var(--forge-radius-md)',
        backgroundColor: 'var(--forge-surface)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--forge-space-2)',
        padding: 'var(--forge-space-3)',
        borderBottom: '1px solid var(--forge-border)',
      }}>
        {/* Status dot */}
        <span
          role="status"
          aria-label={config.label}
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: config.color,
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontWeight: 600,
            fontSize: 'var(--forge-font-size-sm)',
            color: 'var(--forge-text)',
          }}>
            {title}
          </div>
          {description && (
            <div style={{
              fontSize: 'var(--forge-font-size-xs)',
              color: 'var(--forge-text-muted)',
              marginTop: '2px',
            }}>
              {description}
            </div>
          )}
        </div>
        <span style={{
          fontSize: 'var(--forge-font-size-xs)',
          fontWeight: 500,
          padding: '1px var(--forge-space-2)',
          borderRadius: 'var(--forge-radius-sm)',
          backgroundColor: `color-mix(in srgb, ${config.color} 15%, transparent)`,
          color: config.color,
          flexShrink: 0,
        }}>
          {config.label}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: 'var(--forge-space-3)', flex: 1 }}>
        {children}
      </div>

      {/* Action footer */}
      {isPending && (onApprove || onReject) && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--forge-space-2)',
          padding: 'var(--forge-space-3)',
          borderTop: '1px solid var(--forge-border)',
          backgroundColor: 'var(--forge-bg)',
        }}>
          <textarea
            value={rationale}
            onChange={(e) => setRationale(e.target.value)}
            placeholder="Add rationale (optional)…"
            rows={2}
            style={{
              width: '100%',
              padding: 'var(--forge-space-2)',
              fontSize: 'var(--forge-font-size-xs)',
              fontFamily: 'var(--forge-font-sans)',
              color: 'var(--forge-text)',
              backgroundColor: 'var(--forge-surface)',
              border: '1px solid var(--forge-border)',
              borderRadius: 'var(--forge-radius-sm)',
              resize: 'vertical',
              boxSizing: 'border-box',
            }}
          />
          <div style={{ display: 'flex', gap: 'var(--forge-space-2)', justifyContent: 'flex-end' }}>
            {onReject && (
              <button
                type="button"
                onClick={handleReject}
                style={{
                  padding: 'var(--forge-space-1) var(--forge-space-3)',
                  fontSize: 'var(--forge-font-size-xs)',
                  fontWeight: 500,
                  fontFamily: 'var(--forge-font-sans)',
                  color: 'var(--forge-danger)',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--forge-danger)',
                  borderRadius: 'var(--forge-radius-sm)',
                  cursor: 'pointer',
                }}
              >
                Reject
              </button>
            )}
            {onApprove && (
              <button
                type="button"
                onClick={handleApprove}
                style={{
                  padding: 'var(--forge-space-1) var(--forge-space-3)',
                  fontSize: 'var(--forge-font-size-xs)',
                  fontWeight: 500,
                  fontFamily: 'var(--forge-font-sans)',
                  color: 'var(--forge-bg)',
                  backgroundColor: 'var(--forge-success)',
                  border: '1px solid var(--forge-success)',
                  borderRadius: 'var(--forge-radius-sm)',
                  cursor: 'pointer',
                }}
              >
                Approve
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
