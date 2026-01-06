import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useMemo } from "react"

/* =========================================================
   TYPES
========================================================= */

export type DataTableAction<T extends Record<string, unknown>> = {
  label: string
  onClick: (row: T) => void
}

export interface DataTableProps<T extends Record<string, unknown>> {
  data: T[]
  loading?: boolean

  /* Pagination (Supabase compatible) */
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void

  /* Columns */
  columns?: ColumnDef<T, unknown>[]

  /* Auto-generate columns */
  autoGenerateColumns?: boolean
  hiddenColumns?: (keyof T)[]

  /* Row actions */
  actions?: DataTableAction<T>[]

  /* UI */
  emptyText?: string
  title?: string
}

/* =========================================================
   COMPONENT
========================================================= */

export function DataTable<T extends Record<string, unknown>>(
  props: DataTableProps<T>
) {
  const {
    data,
    loading = false,
    page,
    pageSize,
    total,
    onPageChange,
    columns,
    autoGenerateColumns = false,
    hiddenColumns = [],
    actions,
    emptyText = "No records found",
    title,
  } = props

  /* ---------------------------------------------
     Auto columns (safe for TS strict)
  ---------------------------------------------- */
  const autoColumns = useMemo<ColumnDef<T, unknown>[]>(() => {
    if (!autoGenerateColumns || data.length === 0) return []

    const firstRow = data[0]

    return Object.keys(firstRow)
      .filter(
        key => !hiddenColumns.includes(key as keyof T)
      )
      .map(key => ({
        accessorKey: key,
        header: key.replace(/_/g, " ").toUpperCase(),
        cell: info => {
          const value = info.getValue()

          if (value === null || value === undefined) return "-"
          if (typeof value === "boolean") return value ? "Yes" : "No"
          if (typeof value === "string" && value.length > 80)
            return value.slice(0, 80) + "…"

          return String(value)
        },
      }))
  }, [autoGenerateColumns, data, hiddenColumns])

  /* ---------------------------------------------
     Action column
  ---------------------------------------------- */
  const actionColumn = useMemo<ColumnDef<T, unknown> | null>(() => {
    if (!actions || actions.length === 0) return null

    return {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {actions.map(action => (
            <button
              key={action.label}
              onClick={() => action.onClick(row.original)}
              style={{
                color: "#2563eb",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                fontSize: "0.75rem",
              }}
              type="button"
            >
              {action.label}
            </button>
          ))}
        </div>
      ),
    }
  }, [actions])

  /* ---------------------------------------------
     Final columns
  ---------------------------------------------- */
  const finalColumns = useMemo<ColumnDef<T, unknown>[]>(() => {
    const baseColumns = columns ?? autoColumns
    return actionColumn ? [...baseColumns, actionColumn] : baseColumns
  }, [columns, autoColumns, actionColumn])

  /* ---------------------------------------------
     Table instance
  ---------------------------------------------- */
  const table = useReactTable({
    data,
    columns: finalColumns,
    manualPagination: true,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
    getCoreRowModel: getCoreRowModel(),
  })

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "0.5rem",
        background: "#ffffff",
      }}
    >
      {title && (
        <div
          style={{
            padding: "0.75rem 1rem",
            borderBottom: "1px solid #e5e7eb",
            fontWeight: 600,
            fontSize: "0.875rem",
          }}
        >
          {title}
        </div>
      )}

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f9fafb" }}>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    style={{
                      padding: "0.75rem",
                      textAlign: "left",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      textTransform: "uppercase",
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={finalColumns.length}
                  style={{ padding: "2rem", textAlign: "center" }}
                >
                  Loading…
                </td>
              </tr>
            )}

            {!loading &&
              table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      style={{
                        padding: "0.75rem",
                        borderTop: "1px solid #e5e7eb",
                        fontSize: "0.875rem",
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}

            {!loading && data.length === 0 && (
              <tr>
                <td
                  colSpan={finalColumns.length}
                  style={{ padding: "2rem", textAlign: "center" }}
                >
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0.75rem 1rem",
          borderTop: "1px solid #e5e7eb",
          fontSize: "0.75rem",
        }}
      >
        <span>
          Page {page} of {Math.ceil(total / pageSize) || 1}
        </span>

        <div>
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            style={{ marginRight: "0.5rem" }}
          >
            Previous
          </button>

          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page * pageSize >= total}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
