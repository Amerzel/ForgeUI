import { cn } from '../lib/cn.js'

interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  /** Available page sizes. Default: [10, 25, 50, 100] */
  pageSizeOptions?: number[]
  onPageSizeChange?: (pageSize: number) => void
  /** Max visible page buttons before ellipsis. Default: 7 */
  siblingCount?: number
  disabled?: boolean
  className?: string
}

function buildPages(page: number, totalPages: number, siblingCount: number): (number | '...')[] {
  if (totalPages <= siblingCount + 2) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const leftSibling = Math.max(page - Math.floor((siblingCount - 3) / 2), 2)
  const rightSibling = Math.min(page + Math.ceil((siblingCount - 3) / 2), totalPages - 1)

  const showLeftEllipsis = leftSibling > 2
  const showRightEllipsis = rightSibling < totalPages - 1

  const pages: (number | '...')[] = [1]

  if (showLeftEllipsis) {
    pages.push('...')
  } else {
    for (let i = 2; i < leftSibling; i++) pages.push(i)
  }

  for (let i = leftSibling; i <= rightSibling; i++) pages.push(i)

  if (showRightEllipsis) {
    pages.push('...')
  } else {
    for (let i = rightSibling + 1; i < totalPages; i++) pages.push(i)
  }

  pages.push(totalPages)
  return pages
}

const BTN_BASE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '32px',
  minWidth: '32px',
  padding: '0 var(--forge-space-2)',
  border: '1px solid var(--forge-border)',
  borderRadius: 'var(--forge-radius-sm)',
  backgroundColor: 'var(--forge-surface)',
  color: 'var(--forge-text)',
  fontSize: 'var(--forge-font-size-sm)',
  fontFamily: 'var(--forge-font-sans)',
  cursor: 'pointer',
  userSelect: 'none',
  outline: 'none',
  transition: `background-color var(--forge-duration-fast) var(--forge-easing-default), border-color var(--forge-duration-fast) var(--forge-easing-default)`,
}

interface PageButtonProps {
  onClick: () => void
  disabled?: boolean
  active?: boolean
  'aria-label'?: string
  children: React.ReactNode
}

function PageButton({ onClick, disabled, active, children, 'aria-label': ariaLabel }: PageButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-current={active ? 'page' : undefined}
      style={{
        ...BTN_BASE,
        backgroundColor: active ? 'var(--forge-accent)' : 'var(--forge-surface)',
        borderColor: active ? 'var(--forge-accent)' : 'var(--forge-border)',
        color: active ? 'var(--forge-accent-text)' : disabled ? 'var(--forge-text-disabled)' : 'var(--forge-text)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled && !active ? 0.5 : 1,
      }}
      onMouseEnter={(e) => { if (!disabled && !active) e.currentTarget.style.backgroundColor = 'var(--forge-surface-hover)' }}
      onMouseLeave={(e) => { if (!disabled && !active) e.currentTarget.style.backgroundColor = 'var(--forge-surface)' }}
      onFocus={(e) => { e.currentTarget.style.outline = 'var(--forge-focus-ring-width) solid var(--forge-focus-ring-color)'; e.currentTarget.style.outlineOffset = 'var(--forge-focus-ring-offset)' }}
      onBlur={(e) => { e.currentTarget.style.outline = 'none' }}
    >
      {children}
    </button>
  )
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  pageSizeOptions = [10, 25, 50, 100],
  onPageSizeChange,
  siblingCount = 7,
  disabled = false,
  className,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const pages = buildPages(page, totalPages, siblingCount)
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)

  return (
    <nav
      aria-label="Pagination"
      className={cn('forge-pagination', className)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--forge-space-2)',
        flexWrap: 'wrap',
        opacity: disabled ? 0.6 : 1,
        pointerEvents: disabled ? 'none' : undefined,
      }}
    >
      {/* Results summary */}
      <span style={{ fontSize: 'var(--forge-font-size-sm)', color: 'var(--forge-text-muted)', marginRight: 'var(--forge-space-2)' }}>
        {total === 0 ? 'No results' : `${start}–${end} of ${total}`}
      </span>

      {/* Prev */}
      <PageButton
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </PageButton>

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === '...' ? (
          <span
            key={`ellipsis-${i}`}
            aria-hidden="true"
            style={{ padding: '0 var(--forge-space-1)', color: 'var(--forge-text-muted)', fontSize: 'var(--forge-font-size-sm)' }}
          >
            …
          </span>
        ) : (
          <PageButton
            key={p}
            onClick={() => onPageChange(p)}
            active={p === page}
            aria-label={`Page ${p}`}
          >
            {p}
          </PageButton>
        )
      )}

      {/* Next */}
      <PageButton
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </PageButton>

      {/* Page size selector */}
      {onPageSizeChange && (
        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--forge-space-2)', marginLeft: 'var(--forge-space-2)', fontSize: 'var(--forge-font-size-sm)', color: 'var(--forge-text-muted)' }}>
          Per page:
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            style={{
              ...BTN_BASE,
              paddingRight: 'var(--forge-space-6)',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 4.5l3 3 3-3' stroke='%23888' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right var(--forge-space-2) center',
            }}
          >
            {pageSizeOptions.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
      )}
    </nav>
  )
}
