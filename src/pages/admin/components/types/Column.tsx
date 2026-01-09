import type { ColumnDef } from "@tanstack/react-table"
import { ActionsCell } from "../ActionCell"

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

export const userColumns = (
  onView: (row: AppUser) => void,
  onEdit: (row: AppUser) => void,
  onDelete: (row: AppUser) => void
): ColumnDef<AppUser>[] => [
  {
    accessorKey: "idNumber", 
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
    accessorKey: "email",
    header: "Email",
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
    cell: ({ row }) => (
      <ActionsCell
        row={row.original}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ),
  },
]
