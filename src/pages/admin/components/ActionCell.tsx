import { useState } from "react"
import { MoreVertical, Pencil, SettingsIcon, Trash2 } from "lucide-react"

export interface AppUser {
  id: string
  role: "student" | "staff"

  idNumber: string
  firstName: string
  lastName: string
  email: string

  course?: string
  faculty?: string
  createdAt: string
}

interface ActionsCellProps {
  row: AppUser
  onView: (row: AppUser) => void
  onEdit: (row: AppUser) => void
  onDelete: (row: AppUser) => void
}

export function ActionsCell({ row, onView, onEdit, onDelete }: ActionsCellProps) {
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
            onClick={() => onView(row)}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-neutral-100"
          >
            <SettingsIcon size={14} /> Status
          </button>

          <button
            onClick={() => onEdit(row)}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-neutral-100"
          >
            <Pencil size={14} /> Edit
          </button>

          <button
            onClick={() => onDelete(row)}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      )}
    </div>
  )
}
