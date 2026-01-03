import type { ColumnDef } from "@tanstack/react-table"
import { MoreVertical, Pencil, Trash2 } from "lucide-react"
import { useState } from "react"

export type AppUser = {
  id: string
  role: string
  IDNumber: string
  firstName: string
  lastName: string
  course?: string
  faculty?: string
  createdAt: string
}

export const userColumns = (
  onView: (row: AppUser) => void,
  onEdit: (row: AppUser) => void,
  onDelete: (row: AppUser) => void
): ColumnDef<AppUser>[] => [

  {
    accessorKey: "IDNumber",
    header: "ID Number",
  },
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "course",
    header: "Course",
  },
  {
    accessorKey: "faculty",
    header: "Faculty",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ getValue }) =>
      new Date(getValue<string>()).toLocaleDateString(),
  },

  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const [open, setOpen] = useState(false)

      return (
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="rounded p-1 hover:bg-neutral-100"
          >
            <MoreVertical size={18} />
          </button>

          {open && (
            <div className="absolute right-0 z-20 mt-1 w-36 rounded-md border bg-white shadow-md">
              <button
                onClick={() => onView(row.original)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-neutral-100"
              >
                View
              </button>

              <button
                onClick={() => onEdit(row.original)}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-neutral-100"
              >
                <Pencil size={14} /> Edit
              </button>

              <button
                onClick={() => onDelete(row.original)}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      )
    },
  },
]
