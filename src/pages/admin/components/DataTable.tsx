import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { userColumns, type AppUser } from "./types/Column"
import { useState } from "react"
import EditStudentModal from "../../../components/EditModal"
import DeleteStudentModal from "../../../components/DeleteModal"

interface Props {
  data: AppUser[]
  loading: boolean
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

export default function UserTable({
  data,
  loading,
  page,
  pageSize,
  total,
  onPageChange,
}: Props) {
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const table = useReactTable({
    data,
    columns: userColumns(
      user => {
        console.log("View", user)
      },
      user => {
        setSelectedUser(user)
        setEditOpen(true)
      },
      user => {
        setSelectedUser(user)
        setDeleteOpen(true)
      }
    ),
    manualPagination: true,
    pageCount: Math.ceil(total / pageSize),
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="relative overflow-x-auto rounded-lg bg-white">
      {/* Search */}
      <div className="p-4">
        <div className="relative max-w-sm">
          <input
            type="text"
            placeholder="Search users"
            className="block w-full bg-gray-100/35 rounded py-2 pl-9 pr-3 text-sm focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <table className="w-full text-left text-sm text-black">
        <thead className="bg-gray-100/35">
          {table.getHeaderGroups().map(hg => (
            <tr key={hg.id}>
              {hg.headers.map(header => (
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
          {loading && (
            <tr>
              <td colSpan={6} className="py-10 text-center">
                Loading users...
              </td>
            </tr>
          )}

          {!loading &&
            table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-100">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4">
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}

          {!loading && table.getRowModel().rows.length === 0 && (
            <tr>
              <td colSpan={6} className="py-10 text-center">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 text-sm">
        <span>
          Page {page} of {Math.ceil(total / pageSize)}
        </span>

        <div className="space-x-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="rounded px-3 py-1 disabled:opacity-40"
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page * pageSize >= total}
            className="rounded px-3 py-1 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      <EditStudentModal
        isOpen={editOpen}
        student={selectedUser || undefined}
        onClose={() => setEditOpen(false)}
        onSave={(data) => {
          console.log("Save changes:", data)
          // 👉 Supabase update here
        }}
      />

      {/* Delete Modal */}
      <DeleteStudentModal
        isOpen={deleteOpen}
        student={selectedUser || undefined}
        onClose={() => setDeleteOpen(false)}
        onDelete={() => {
          console.log("Deleted user")
          // 👉 refetch users here
        }}
      />
    </div>
  )
}
