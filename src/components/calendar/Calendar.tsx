// Calendar.tsx
import { useEffect, useState } from "react"
import CalendarHeader from "./CalendarHeader"
import CalendarCell from "./CalendarCell"
import EventModal from "./EventModal"

import type { CalendarDay, CalendarTask, EventRecord } from "./types"
import { supabase } from "../../hooks/supabase/supabaseClient"

/**
 * Generate calendar grid for a given month/year
 */
const generateMonth = (month: number, year: number): CalendarDay[] => {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const offset = firstDay.getDay()

  return Array.from({ length: 42 }).map((_, i) => {
    const dayNum = i - offset + 1
    const isCurrentMonth = dayNum > 0 && dayNum <= lastDay.getDate()

    const date = isCurrentMonth
      ? new Date(year, month, dayNum).toISOString().split("T")[0]
      : `empty-${i}`

    return {
      date,
      day: isCurrentMonth ? dayNum : 0,
      isCurrentMonth,
      tasks: [],
    }
  })
}

/**
 * Convert DB EventRecord → UI CalendarTask
 */
const toCalendarTask = (event: EventRecord): CalendarTask => ({
  id: event.id,
  title: event.title,
  date: event.date,
  color: event.color ?? undefined,
})

export default function Calendar() {
  const today = new Date()

  const [month, setMonth] = useState(today.getMonth())
  const [year, setYear] = useState(today.getFullYear())
  const [days, setDays] = useState<CalendarDay[]>([])
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null)
  const [search, setSearch] = useState("")

  /**
   * Load & filter events for current month
   */
  useEffect(() => {
    const load = async () => {
      const start = `${year}-${String(month + 1).padStart(2, "0")}-01`
      const end = `${year}-${String(month + 1).padStart(2, "0")}-31`

      const { data } = await supabase
        .from("events")
        .select("*")
        .gte("date", start)
        .lte("date", end)

      const filtered =
        search.trim().length === 0
          ? data
          : data?.filter(event =>
              event.title
                .toLowerCase()
                .includes(search.toLowerCase())
            )

      const grid = generateMonth(month, year)

      setDays(
        grid.map(day => ({
          ...day,
          tasks:
            filtered
              ?.filter(e => e.date === day.date)
              .map(toCalendarTask) ?? [],
        }))
      )
    }

    load()
  }, [month, year, search])

  /**
   * Drag / Drop event handler
   */
  const moveEvent = async (taskId: string, toDate: string) => {
    await supabase
      .from("events")
      .update({ date: toDate })
      .eq("id", taskId)

    setDays(prev =>
      prev.map(day => ({
        ...day,
        tasks: day.tasks.filter(task => task.id !== taskId),
      }))
    )
  }

  return (
    <>
      {/* Header */}
      <CalendarHeader
        month={month}
        year={year}
        search={search}
        onSearchChange={setSearch}
        onChangeDate={(m, y) => {
          setMonth(m)
          setYear(y)
        }}
      />

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 border">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
          <div
            key={d}
            className="text-xs p-2 border border-gray-500/55 bg-gray-50 font-medium"
          >
            {d}
          </div>
        ))}

        {days.map(day => (
          <CalendarCell
            key={day.date}
            day={day}
            onSelect={() => day.isCurrentMonth && setSelectedDay(day)}
            onDropEvent={moveEvent}
          />
        ))}
      </div>

      {/* Event Modal */}
      {selectedDay && (
        <EventModal
          initialDate={new Date(selectedDay.date)}
          onClose={() => setSelectedDay(null)}
          onSave={() => setSelectedDay(null)}
        />
      )}
    </>
  )
}
