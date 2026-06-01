import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type FilterFn,
  type RowSelectionState,
} from "@tanstack/react-table"
import { useState } from "react"
import { Loader2, RefreshCw } from "lucide-react"

import { createEnquiryColumns } from "./types/EnquireColumns"
import { supabase } from "../../../hooks/supabase/supabaseClient"


interface Enquiry {
  id: string
  fullname: string
  email: string
  phone: string
  programme: string
  studyMode: string
  message: string
  created: string
}

interface Props {
  data: Enquiry[]
  loading: boolean
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  refreshData: () => Promise<void>
}

const enquiryFilter: FilterFn<Enquiry> = (
  row,
  _columnId,
  filterValue
) => {
  const search = String(filterValue).toLowerCase()

  return (
    row.original.fullname?.toLowerCase().includes(search) ||
    row.original.email?.toLowerCase().includes(search)
  )
}

export default function EnquiryTable({
  data,
  loading,
  page,
  pageSize,
  total,
  onPageChange,
  refreshData,
}: Props) {
  const [globalFilter, setGlobalFilter] = useState("")
  const [fetching, setFetching] = useState(false)
  const [rowSelection, setRowSelection] =
    useState<RowSelectionState>({})

  const handleRefresh = async () => {
    try {
      setFetching(true)
      await refreshData()
    } finally {
      setFetching(false)
    }
  }

  const handleBulkDelete = async () => {
    const selectedIds = Object.keys(rowSelection)

    if (!selectedIds.length) return

    const confirmed = window.confirm(
      `Delete ${selectedIds.length} enquiries?`
    )

    if (!confirmed) return

    const { error } = await supabase
      .from("interest_form")
      .delete()
      .in("id", selectedIds)

    if (error) {
      alert(error.message)
      return
    }

    setRowSelection({})
    await refreshData()
  }

  const exportExcel = () => {
    // TODO:
    // Add xlsx export implementation here
    console.log("Export Excel")
  }

  const table = useReactTable<Enquiry>({
    data,

    columns: createEnquiryColumns((message: string) => {
      alert(message)
    }),

    state: {
      globalFilter,
      rowSelection,
    },

    enableRowSelection: true,

    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,

    globalFilterFn: enquiryFilter,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    manualPagination: true,
    pageCount: Math.ceil(total / pageSize),
  })

  const selectedCount = Object.keys(rowSelection).length

  return (
    <div className="overflow-x-auto rounded-lg bg-white">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
        <div className="w-full md:max-w-sm">
          <input
            type="text"
            value={globalFilter}
            onChange={e => setGlobalFilter(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full rounded bg-gray-100 px-3 py-2 text-sm focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <button
            onClick={exportExcel}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
          >
            Export Excel
          </button>

          <button
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
          >
            Filter By Date
          </button>

          <button
            disabled={!selectedCount}
            onClick={handleBulkDelete}
            className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            Bulk Delete ({selectedCount})
          </button>

          <button
            onClick={handleRefresh}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
          >
            {fetching ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <RefreshCw className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={table.getIsAllRowsSelected()}
                  onChange={table.getToggleAllRowsSelectedHandler()}
                />
              </th>

              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="px-6 py-3 font-semibold uppercase"
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
          {loading ? (
            <tr>
              <td
                colSpan={table.getAllColumns().length + 1}
                className="py-10 text-center"
              >
                Loading enquiries...
              </td>
            </tr>
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                className="border-b hover:bg-gray-50"
              >
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={row.getIsSelected()}
                    onChange={row.getToggleSelectedHandler()}
                  />
                </td>

                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className="px-6 py-4"
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={table.getAllColumns().length + 1}
                className="py-10 text-center"
              >
                No enquiries found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-4">
        <span className="text-sm">
          Page {page} of{" "}
          {Math.max(
            1,
            Math.ceil(total / pageSize)
          )}
        </span>

        <div className="space-x-2">
          <button
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            className="rounded border px-3 py-1 disabled:opacity-50"
          >
            Previous
          </button>

          <button
            disabled={page * pageSize >= total}
            onClick={() => onPageChange(page + 1)}
            className="rounded border px-3 py-1 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}