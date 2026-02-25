import { cn } from '../lib/cn.js'

// ---------------------------------------------------------------------------
// Table — semantic HTML table with forge styling
// ---------------------------------------------------------------------------

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  className?: string
}

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}
interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}
interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}
interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  /** Sort direction for sortable headers */
  sortDirection?: 'asc' | 'desc' | false
  onSort?: () => void
}
interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

function TableRoot({ className, children, ...props }: TableProps) {
  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <table
        className={cn('forge-table', className)}
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: 'var(--forge-font-size-sm)',
          fontFamily: 'var(--forge-font-sans)',
        }}
        {...props}
      >
        {children}
      </table>
    </div>
  )
}

function TableHeader({ className, children, ...props }: TableHeaderProps) {
  return (
    <thead
      className={cn('forge-table-header', className)}
      style={{ borderBottom: '1px solid var(--forge-border)' }}
      {...props}
    >
      {children}
    </thead>
  )
}

function TableBody({ className, children, ...props }: TableBodyProps) {
  return <tbody className={cn('forge-table-body', className)} {...props}>{children}</tbody>
}

function TableRow({ className, children, ...props }: TableRowProps) {
  return (
    <tr
      className={cn('forge-table-row', className)}
      style={{ borderBottom: '1px solid var(--forge-border-subtle)', transition: `background-color var(--forge-duration-fast) var(--forge-easing-default)` }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--forge-surface-hover)' }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
      {...props}
    >
      {children}
    </tr>
  )
}

function TableHead({ className, children, sortDirection, onSort, ...props }: TableHeadProps) {
  const isSortable = onSort !== undefined
  return (
    <th
      className={cn('forge-table-head', className)}
      aria-sort={sortDirection === 'asc' ? 'ascending' : sortDirection === 'desc' ? 'descending' : isSortable ? 'none' : undefined}
      style={{
        padding: `var(--forge-space-2) var(--forge-space-3)`,
        textAlign: 'left',
        fontWeight: 'var(--forge-font-semibold)',
        color: 'var(--forge-text-muted)',
        letterSpacing: 'var(--forge-tracking-wide)',
        textTransform: 'uppercase',
        fontSize: 'var(--forge-font-size-xs)',
        whiteSpace: 'nowrap',
        cursor: isSortable ? 'pointer' : undefined,
        userSelect: isSortable ? 'none' : undefined,
      }}
      onClick={onSort}
      {...props}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--forge-space-1)' }}>
        {children}
        {isSortable && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ opacity: sortDirection ? 1 : 0.4 }}>
            {sortDirection === 'asc'
              ? <path d="M6 9V3M3 6l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              : sortDirection === 'desc'
                ? <path d="M6 3v6M3 6l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                : <path d="M3 4l3-2 3 2M3 8l3 2 3-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            }
          </svg>
        )}
      </span>
    </th>
  )
}

function TableCell({ className, children, ...props }: TableCellProps) {
  return (
    <td
      className={cn('forge-table-cell', className)}
      style={{ padding: `var(--forge-space-2-5) var(--forge-space-3)`, color: 'var(--forge-text)', verticalAlign: 'middle' }}
      {...props}
    >
      {children}
    </td>
  )
}

export const Table = Object.assign(TableRoot, {
  Header: TableHeader,
  Body: TableBody,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
})
