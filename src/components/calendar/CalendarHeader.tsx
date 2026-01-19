import { LucideArrowLeft, LucideArrowRight } from "lucide-react"
import React, { useState } from "react"

interface Props {
  month: number
  year: number
  search: string
  onSearchChange: React.Dispatch<React.SetStateAction<string>>
  onChangeDate: (month: number, year: number) => void
  onAddTask?: () => void
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

export default function CalendarHeader({
  month,
  year,
  search,
  onSearchChange,
  onChangeDate,
  onAddTask,
}: Props) {
  const [open, setOpen] = useState(false)

  const handlePrev = () => {
    if (month === 0) {
      onChangeDate(11, year - 1)
    } else {
      onChangeDate(month - 1, year)
    }
  }

  const handleNext = () => {
    if (month === 11) {
      onChangeDate(0, year + 1)
    } else {
      onChangeDate(month + 1, year)
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 p-3 border-b bg-background">
      {/* LEFT */}
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrev}
          className="h-8 w-8 rounded-md border border-gray-500/55 hover:bg-muted flex items-center justify-center cursor-pointer">
          <LucideArrowLeft size={14} />
        </button>

        {/* Month / Year Picker */}
        <div className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="h-8 px-3 text-sm font-medium rounded-md border hover:bg-muted"
          >
            {MONTHS[month]} {year}
          </button>

          {open && (
            <div className="absolute z-50 mt-2 w-60 rounded-md border bg-popover p-3 shadow-md">
              <div className="grid grid-cols-3 gap-1 mb-3">
                {MONTHS.map((m, i) => (
                  <button
                    key={m}
                    onClick={() => onChangeDate(i, year)}
                    className={`text-xs rounded px-2 py-1 hover:bg-muted ${
                      i === month ? "bg-muted font-medium" : ""
                    }`}
                  >
                    {m.slice(0, 3)}
                  </button>
                ))}
              </div>

              <input
                type="number"
                value={year}
                onChange={(e) =>
                  onChangeDate(month, Number(e.target.value))
                }
                className="w-full h-8 rounded border border-gray-500/55 px-2 text-sm"
              />
            </div>
          )}
        </div>

        <button
          onClick={handleNext}
          className="h-8 w-8 rounded-md border border-gray-500/55 cursor-pointer hover:bg-muted items-center flex justify-center">
          <LucideArrowRight size={14} />
        </button>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          className="h-8 w-48 rounded-md border border-gray-500 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500/55"
        />

        <button
          onClick={() => onAddTask?.()}
          className="h-8 px-3 rounded-md bg-black text-sm text-white cursor-pointer font-medium hover:opacity-60"
        >
          + Add Task
        </button>
      </div>
    </div>
  )
}
