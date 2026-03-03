import { useState, useRef, useCallback } from 'react'
import { cn } from '../lib/cn.js'

interface DropZoneProps {
  /** Accepted file types (MIME types or extensions like '.png') */
  accept?: string[]
  /** Allow multiple files */
  multiple?: boolean
  /** Max file size in bytes */
  maxSize?: number
  onDrop: (files: File[]) => void
  onError?: (error: string) => void
  /** Custom placeholder content */
  children?: React.ReactNode
  disabled?: boolean
  className?: string
}

function validateFiles(
  files: File[],
  accept?: string[],
  maxSize?: number,
  multiple?: boolean,
): { valid: File[]; error?: string } {
  if (!multiple && files.length > 1) {
    return { valid: [], error: 'Only one file is allowed.' }
  }

  const valid: File[] = []
  for (const file of files) {
    if (maxSize && file.size > maxSize) {
      return {
        valid: [],
        error: `"${file.name}" exceeds the ${(maxSize / 1024 / 1024).toFixed(1)} MB limit.`,
      }
    }
    if (accept && accept.length > 0) {
      const accepted = accept.some((a) =>
        a.startsWith('.')
          ? file.name.toLowerCase().endsWith(a.toLowerCase())
          : file.type.match(a.replace('*', '.*')),
      )
      if (!accepted) {
        return { valid: [], error: `"${file.name}" is not an accepted file type.` }
      }
    }
    valid.push(file)
  }
  return { valid }
}

export function DropZone({
  accept,
  multiple = false,
  maxSize,
  onDrop,
  onError,
  children,
  disabled = false,
  className,
}: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return
      setError(null)
      const { valid, error: err } = validateFiles(Array.from(files), accept, maxSize, multiple)
      if (err) {
        setError(err)
        onError?.(err)
      } else {
        onDrop(valid)
      }
    },
    [accept, maxSize, multiple, onDrop, onError],
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) setIsDragging(true)
  }
  const handleDragLeave = () => setIsDragging(false)
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (!disabled) handleFiles(e.dataTransfer.files)
  }

  const borderColor = error
    ? 'var(--forge-danger)'
    : isDragging
      ? 'var(--forge-accent)'
      : 'var(--forge-border)'

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={`Drop zone. ${accept ? `Accepts: ${accept.join(', ')}. ` : ''}Press Enter or Space to browse files.`}
      aria-disabled={disabled}
      className={cn('forge-dropzone', className)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--forge-space-3)',
        padding: 'var(--forge-space-8)',
        border: `2px dashed ${borderColor}`,
        borderRadius: 'var(--forge-radius-lg)',
        backgroundColor: isDragging
          ? 'color-mix(in srgb, var(--forge-accent) 8%, transparent)'
          : 'var(--forge-surface)',
        color: disabled ? 'var(--forge-text-disabled)' : 'var(--forge-text-muted)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        outline: 'none',
        transition: `border-color var(--forge-duration-fast) var(--forge-easing-default), background-color var(--forge-duration-fast) var(--forge-easing-default)`,
        textAlign: 'center',
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          if (!disabled) {
            inputRef.current?.click()
          }
        }
      }}
      onFocus={(e) => {
        e.currentTarget.style.outline =
          'var(--forge-focus-ring-width) solid var(--forge-focus-ring-color)'
        e.currentTarget.style.outlineOffset = 'var(--forge-focus-ring-offset)'
      }}
      onBlur={(e) => {
        e.currentTarget.style.outline = 'none'
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept?.join(',')}
        multiple={multiple}
        disabled={disabled}
        aria-hidden="true"
        tabIndex={-1}
        style={{ display: 'none' }}
        onChange={(e) => handleFiles(e.target.files)}
      />

      {children ?? (
        <>
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            aria-hidden="true"
            style={{ color: isDragging ? 'var(--forge-accent)' : 'var(--forge-text-muted)' }}
          >
            <path
              d="M16 4v16M10 10l6-6 6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 22v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <div>
            <div style={{ fontSize: 'var(--forge-font-size-base)', color: 'var(--forge-text)' }}>
              {isDragging ? 'Drop to upload' : 'Drop files here or click to browse'}
            </div>
            {accept && (
              <div
                style={{ fontSize: 'var(--forge-font-size-xs)', marginTop: 'var(--forge-space-1)' }}
              >
                Accepted: {accept.join(', ')}
              </div>
            )}
            {maxSize && (
              <div
                style={{
                  fontSize: 'var(--forge-font-size-xs)',
                  marginTop: 'var(--forge-space-0-5)',
                }}
              >
                Max size: {(maxSize / 1024 / 1024).toFixed(1)} MB
              </div>
            )}
          </div>
        </>
      )}

      {error && (
        <div
          role="alert"
          style={{ fontSize: 'var(--forge-font-size-sm)', color: 'var(--forge-danger)' }}
        >
          {error}
        </div>
      )}
    </div>
  )
}
