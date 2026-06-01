// types/EnquireColumns.tsx

import { type ColumnDef } from "@tanstack/react-table"
import type { Enquiry } from "./Enquire"

export const createEnquiryColumns = (
  onViewMessage: (message: string) => void
): ColumnDef<Enquiry, any>[] => [
  {
    accessorKey: "full_name",
    header: "Full Name",
    cell: ({ getValue }) => (
      <div className="font-medium text-gray-900">
        {getValue<string>()}
      </div>
    ),
  },

  {
    accessorKey: "email",
    header: "Email",
    cell: ({ getValue }) => {
      const email = getValue<string>()

      return (
        <a
          href={`mailto:${email}`}
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {email}
        </a>
      )
    },
  },

  {
    accessorKey: "phone",
    header: "Phone",
  },

  {
    accessorKey: "programme",
    header: "Programme",
  },

  {
    accessorKey: "study_mode",
    header: "Study Mode",
    cell: ({ getValue }) => {
      const value = getValue<string>()

      const badgeStyles: Record<string, string> = {
        Online:
          "bg-green-100 text-green-700 border-green-200",

        "Part-time":
          "bg-yellow-100 text-yellow-700 border-yellow-200",

        FullTime:
          "bg-blue-100 text-blue-700 border-blue-200",

        "Full-time":
          "bg-blue-100 text-blue-700 border-blue-200",
      }

      return (
        <span
          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
            badgeStyles[value] ??
            "bg-gray-100 text-gray-700 border-gray-200"
          }`}
        >
          {value}
        </span>
      )
    },
  },

  {
    accessorKey: "message",
    header: "Message",
    cell: ({ getValue }) => {
      const message = getValue<string>() ?? ""

      const preview =
        message.length > 40
          ? `${message.substring(0, 40)}...`
          : message

      return (
        <div className="flex items-center gap-2">
          <span
            className="max-w-[220px] truncate text-gray-600"
            title={message}
          >
            {preview}
          </span>

          <button
            type="button"
            onClick={() => onViewMessage(message)}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
          >
            View
          </button>
        </div>
      )
    },
  },

  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ getValue }) => {
      const value = getValue<string>()

      if (!value) {
        return (
          <span className="text-gray-400">
            —
          </span>
        )
      }

      const date = new Date(value)

      return (
        <span className="text-gray-700">
          {date.toLocaleString("en-ZA", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      )
    },
  },
]