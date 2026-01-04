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
