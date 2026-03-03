import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type RowSelectionState,
  type ColumnSizingState,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useState, useRef } from 'react'
import { Pagination } from '../layout/Pagination.js'
import { Spinner } from '../primitives/Spinner.js'
import { cn } from '../lib/cn.js'

export type { ColumnDef }

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  /** Enable sorting */
  sorting?: boolean
  /** Enable per-column text filter */
  filtering?: boolean
  /** Enable column resize */
  columnResizing?: boolean
  /** Enable row selection (checkbox column added automatically) */
  rowSelection?: boolean
  onRowSelectionChange?: (rows: TData[]) => void
  /** Enable pagination */
  pagination?: boolean
  pageSize?: number
  /** Enable row virtualization for large datasets */
  virtualized?: boolean
  /** Loading state — shows spinner overlay */
  loading?: boolean
  /** Empty state content */
  empty?: React.ReactNode
  className?: string
}

function CheckboxCell({
  checked,
  indeterminate,
  onChange,
  ariaLabel,
}: {
  checked: boolean
  indeterminate?: boolean
  onChange: (v: boolean) => void
  ariaLabel?: string
}) {
  return (
    <input
      type="checkbox"
      checked={checked}
      ref={(el) => {
        if (el) el.indeterminate = indeterminate ?? false
      }}
      aria-label={ariaLabel ?? 'Select row'}
      onChange={(e) => onChange(e.target.checked)}
      style={{
        width: '14px',
        height: '14px',
        cursor: 'pointer',
        accentColor: 'var(--forge-accent)',
      }}
    />
  )
}

export function DataTable<TData>({
  columns,
  data,
  sorting: enableSorting = false,
  filtering: enableFiltering = false,
  columnResizing: enableColumnResizing = false,
  rowSelection: enableRowSelection = false,
  onRowSelectionChange,
  pagination: enablePagination = false,
  pageSize: initialPageSize = 25,
  virtualized: enableVirtualization = false,
  loading = false,
  empty = 'No data',
  className,
}: DataTableProps<TData>) {
  const [sortingState, setSortingState] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelectionState, setRowSelectionState] = useState<RowSelectionState>({})
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({})
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const selectionColumn: ColumnDef<TData> = {
    id: '__select__',
    header: ({ table }) => (
      <CheckboxCell
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onChange={(v) => table.toggleAllRowsSelected(v)}
        ariaLabel="Select all rows"
      />
    ),
    cell: ({ row }) => (
      <CheckboxCell checked={row.getIsSelected()} onChange={(v) => row.toggleSelected(v)} />
    ),
    size: 40,
    enableSorting: false,
    enableResizing: false,
  }

  const allColumns = enableRowSelection ? [selectionColumn, ...columns] : columns

  const table = useReactTable<TData>({
    data,
    columns: allColumns,
    state: {
      sorting: sortingState,
      columnFilters,
      columnVisibility,
      rowSelection: rowSelectionState,
      columnSizing,
    },
    enableRowSelection,
    enableSorting,
    enableColumnResizing,
    columnResizeMode: 'onChange',
    onSortingChange: setSortingState,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: (updater) => {
      setRowSelectionState((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater
        if (onRowSelectionChange) {
          const selectedRows = table
            .getRowModel()
            .rows.filter((row) => next[row.id])
            .map((row) => row.original)
          onRowSelectionChange(selectedRows)
        }
        return next
      })
    },
    onColumnSizingChange: setColumnSizing,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
  })

  const { rows } = table.getRowModel()

  // Pagination slice
  const paginatedRows = enablePagination ? rows.slice((page - 1) * pageSize, page * pageSize) : rows

  // Virtualization
  const containerRef = useRef<HTMLDivElement>(null)
  const virtualizer = useVirtualizer({
    count: enableVirtualization ? paginatedRows.length : 0,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 36,
    overscan: 5,
  })

  const displayRows = enableVirtualization ? virtualizer.getVirtualItems() : null

  const headerGroups = table.getHeaderGroups()

  return (
    <div
      className={cn('forge-data-table', className)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--forge-space-2)',
        position: 'relative',
        ...(enableVirtualization ? { flex: '1 1 auto', minHeight: 0, overflow: 'hidden' } : {}),
      }}
    >
      {/* Column filter inputs */}
      {enableFiltering && (
        <div
          className="forge-data-table-toolbar"
          style={{ display: 'flex', gap: 'var(--forge-space-2)', flexWrap: 'wrap' }}
        >
          {table
            .getAllLeafColumns()
            .filter((col) => col.id !== '__select__' && col.getCanFilter())
            .map((col) => (
              <input
                key={col.id}
                type="text"
                placeholder={`Filter ${String(col.columnDef.header ?? col.id)}…`}
                value={(col.getFilterValue() ?? '') as string}
                onChange={(e) => col.setFilterValue(e.target.value)}
                aria-label={`Filter ${String(col.columnDef.header ?? col.id)}`}
                style={{
                  height: '28px',
                  padding: `0 var(--forge-space-2)`,
                  border: '1px solid var(--forge-border)',
                  borderRadius: 'var(--forge-radius-sm)',
                  backgroundColor: 'var(--forge-bg)',
                  color: 'var(--forge-text)',
                  fontSize: 'var(--forge-font-size-sm)',
                  fontFamily: 'var(--forge-font-sans)',
                  outline: 'none',
                }}
              />
            ))}
        </div>
      )}

      {/* Table */}
      <div
        ref={containerRef}
        style={{
          overflowX: 'auto',
          overflowY: enableVirtualization ? 'auto' : undefined,
          position: 'relative',
          ...(enableVirtualization ? { flex: '1 1 auto', minHeight: 0 } : {}),
        }}
      >
        {/* Loading overlay */}
        {loading && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'color-mix(in srgb, var(--forge-bg) 70%, transparent)',
              zIndex: 1,
            }}
          >
            <Spinner label="Loading data" />
          </div>
        )}

        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: 'var(--forge-font-size-sm)',
            fontFamily: 'var(--forge-font-sans)',
            tableLayout: enableColumnResizing ? 'fixed' : 'auto',
          }}
        >
          <thead style={{ borderBottom: '1px solid var(--forge-border)' }}>
            {headerGroups.map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => {
                  const canSort = header.column.getCanSort()
                  const sorted = header.column.getIsSorted()
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{
                        position: 'relative',
                        padding: `var(--forge-space-2) var(--forge-space-3)`,
                        textAlign: 'left',
                        fontWeight: 'var(--forge-font-semibold)',
                        color: 'var(--forge-text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: 'var(--forge-tracking-wide)',
                        fontSize: 'var(--forge-font-size-xs)',
                        whiteSpace: 'nowrap',
                        cursor: canSort ? 'pointer' : undefined,
                        userSelect: canSort ? 'none' : undefined,
                        width: enableColumnResizing ? header.getSize() : undefined,
                      }}
                      aria-sort={
                        sorted === 'asc'
                          ? 'ascending'
                          : sorted === 'desc'
                            ? 'descending'
                            : canSort
                              ? 'none'
                              : undefined
                      }
                      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                    >
                      {header.isPlaceholder ? null : (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 'var(--forge-space-1)',
                          }}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {canSort && sorted && (
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 12 12"
                              fill="none"
                              aria-hidden="true"
                            >
                              {sorted === 'asc' ? (
                                <path
                                  d="M6 9V3M3 6l3-3 3 3"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              ) : (
                                <path
                                  d="M6 3v6M3 6l3 3 3-3"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              )}
                            </svg>
                          )}
                        </span>
                      )}

                      {/* Resize handle */}
                      {enableColumnResizing && header.column.getCanResize() && (
                        <div
                          onPointerDown={header.getResizeHandler()}
                          style={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            bottom: 0,
                            width: '4px',
                            cursor: 'col-resize',
                            userSelect: 'none',
                            backgroundColor: header.column.getIsResizing()
                              ? 'var(--forge-accent)'
                              : 'transparent',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--forge-accent)'
                          }}
                          onMouseLeave={(e) => {
                            if (!header.column.getIsResizing())
                              e.currentTarget.style.backgroundColor = 'transparent'
                          }}
                        />
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>

          <tbody>
            {rows.length === 0 && !loading ? (
              <tr>
                <td
                  colSpan={allColumns.length}
                  style={{
                    padding: 'var(--forge-space-8)',
                    textAlign: 'center',
                    color: 'var(--forge-text-muted)',
                    fontSize: 'var(--forge-font-size-sm)',
                  }}
                >
                  {empty}
                </td>
              </tr>
            ) : enableVirtualization && displayRows ? (
              <>
                {virtualizer.getTotalSize() > 0 && (
                  <tr style={{ height: `${virtualizer.getVirtualItems()[0]?.start ?? 0}px` }} />
                )}
                {displayRows.map((virtualRow) => {
                  const row = paginatedRows[virtualRow.index]
                  if (!row) return null
                  return (
                    <tr
                      key={row.id}
                      style={{
                        height: `${virtualRow.size}px`,
                        backgroundColor: row.getIsSelected()
                          ? 'color-mix(in srgb, var(--forge-accent) 8%, transparent)'
                          : undefined,
                      }}
                      onMouseEnter={(e) => {
                        if (!row.getIsSelected())
                          e.currentTarget.style.backgroundColor = 'var(--forge-surface-hover)'
                      }}
                      onMouseLeave={(e) => {
                        if (!row.getIsSelected())
                          e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          style={{
                            padding: `var(--forge-space-2) var(--forge-space-3)`,
                            color: 'var(--forge-text)',
                            verticalAlign: 'middle',
                            borderBottom: '1px solid var(--forge-border-subtle)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  )
                })}
                {virtualizer.getTotalSize() > 0 && (
                  <tr
                    style={{
                      height: `${virtualizer.getTotalSize() - (virtualizer.getVirtualItems().at(-1)?.end ?? 0)}px`,
                    }}
                  />
                )}
              </>
            ) : (
              paginatedRows.map((row) => (
                <tr
                  key={row.id}
                  style={{
                    backgroundColor: row.getIsSelected()
                      ? 'color-mix(in srgb, var(--forge-accent) 8%, transparent)'
                      : undefined,
                    borderBottom: '1px solid var(--forge-border-subtle)',
                    transition: `background-color var(--forge-duration-fast) var(--forge-easing-default)`,
                  }}
                  onMouseEnter={(e) => {
                    if (!row.getIsSelected())
                      e.currentTarget.style.backgroundColor = 'var(--forge-surface-hover)'
                  }}
                  onMouseLeave={(e) => {
                    if (!row.getIsSelected()) e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      style={{
                        padding: `var(--forge-space-2) var(--forge-space-3)`,
                        color: 'var(--forge-text)',
                        verticalAlign: 'middle',
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {enablePagination && (
        <Pagination
          page={page}
          pageSize={pageSize}
          total={rows.length}
          onPageChange={setPage}
          onPageSizeChange={(s) => {
            setPageSize(s)
            setPage(1)
          }}
          className="forge-data-table-pagination"
        />
      )}
    </div>
  )
}
