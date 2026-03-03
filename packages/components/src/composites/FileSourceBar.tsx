import { cn } from '../lib/cn.js'

export interface FileSourceBarFile {
  /** File name */
  name: string
  /** File size in bytes */
  size: number
  /** MIME type */
  type?: string
}

export interface FileSourceBarProps {
  /** Currently loaded file (null = empty state) */
  file?: FileSourceBarFile | null
  /** Error message to display */
  error?: string | null
  /** Handler for the Load / browse button */
  onLoad: () => void
  /** Handler for the Clear button */
  onClear?: () => void
  /** File type hint shown in the empty state (e.g. ".json") */
  accept?: string
  /** Describes what kind of file is expected */
  label?: string
  className?: string
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function FileSourceBar({
  file,
  error,
  onLoad,
  onClear,
  accept,
  label,
  className,
}: FileSourceBarProps) {
  const hasFile = file != null
  const hasError = error != null && error.length > 0

  return (
    <div
      className={cn('forge-file-source-bar', className)}
      role="toolbar"
      aria-label={label ?? 'File source'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--forge-space-2)',
        padding: 'var(--forge-space-2) var(--forge-space-3)',
        borderRadius: 'var(--forge-radius-lg)',
        border: `1px solid ${hasError ? 'var(--forge-danger)' : 'var(--forge-border)'}`,
        backgroundColor: 'var(--forge-surface)',
        minHeight: 44,
        fontFamily: 'var(--forge-font-sans)',
        fontSize: 'var(--forge-font-size-sm)',
        lineHeight: 'var(--forge-line-height-sm)',
      }}
    >
      {/* Icon */}
      {hasError ? (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--forge-warning)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          style={{ flexShrink: 0 }}
        >
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ) : (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--forge-text-muted)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          style={{ flexShrink: 0 }}
        >
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        </svg>
      )}

      {/* Content area */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--forge-space-2)',
        }}
      >
        {hasError ? (
          <span
            role="alert"
            style={{
              color: 'var(--forge-danger)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {error}
          </span>
        ) : hasFile ? (
          <>
            <span
              style={{
                color: 'var(--forge-text)',
                fontFamily: 'var(--forge-font-mono)',
                fontSize: 'var(--forge-font-size-xs)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {file.name}
            </span>
            <span
              style={{
                color: 'var(--forge-text-muted)',
                fontSize: 'var(--forge-font-size-xs)',
                flexShrink: 0,
              }}
            >
              ({formatFileSize(file.size)})
            </span>
          </>
        ) : (
          <>
            {label && (
              <span
                style={{ color: 'var(--forge-text-muted)', fontWeight: 'var(--forge-font-medium)' }}
              >
                {label}
              </span>
            )}
            <span style={{ color: 'var(--forge-text-disabled)' }}>
              No file loaded{accept ? ` (${accept})` : ''}
            </span>
          </>
        )}
      </div>

      {/* Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--forge-space-1)',
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={onLoad}
          style={{
            padding: 'var(--forge-space-1) var(--forge-space-3)',
            border: '1px solid var(--forge-border)',
            borderRadius: 'var(--forge-radius-md)',
            backgroundColor: 'var(--forge-surface-raised)',
            color: 'var(--forge-text)',
            fontSize: 'var(--forge-font-size-xs)',
            fontFamily: 'var(--forge-font-sans)',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Load…
        </button>
        {(hasFile || hasError) && onClear && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear file"
            style={{
              padding: 'var(--forge-space-1) var(--forge-space-3)',
              border: '1px solid var(--forge-border)',
              borderRadius: 'var(--forge-radius-md)',
              backgroundColor: 'transparent',
              color: 'var(--forge-text-muted)',
              fontSize: 'var(--forge-font-size-xs)',
              fontFamily: 'var(--forge-font-sans)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  )
}
