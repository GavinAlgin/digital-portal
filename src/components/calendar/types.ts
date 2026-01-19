// types.ts
export type CalendarTask = {
  id: string
  title: string
  date: string
  color?: string
}

export type CalendarDay = {
  date: string
  day: number
  isCurrentMonth: boolean
  tasks: CalendarTask[]
}

// types/event.ts
export type EventRecord = {
  id: string
  title: string
  date: string
  time: string
  location: string | null
  description: string | null
  color: string | null
  created_at: string
}
