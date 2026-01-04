import { useState } from "react";
import type { CalendarDay, CalendarTask } from "./types";
import CalendarCell from "./CalendarCell";
import EventModal from "./EventModal";

const initialDays: CalendarDay[] = Array.from({ length: 35 }).map((_, i) => ({
  date: `2024-03-${String(i + 1).padStart(2, "0")}`,
  day: i + 1,
  isCurrentMonth: i < 31,
  tasks: [],
}));

const Calendar: React.FC = () => {
  const [days, setDays] = useState<CalendarDay[]>(initialDays);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);

  /**
   * ADD LESSON EVENT
   */
  const addLesson = (lesson: {
    id: string;
    title: string;
    date: Date;
    color: string;
  }) => {
    const lessonDate = lesson.date.toISOString().split("T")[0];

    setDays(prev =>
      prev.map(day =>
        day.date === lessonDate
          ? {
              ...day,
              tasks: [
                ...day.tasks,
                {
                  id: lesson.id,
                  title: lesson.title,
                  date: lessonDate,
                  color: lesson.color,
                },
              ],
            }
          : day
      )
    );
  };

  /**
   * DRAG & DROP MOVE
   */
  const moveEvent = (taskId: string, toDate: string) => {
    let movedTask: CalendarTask | null = null;

    const cleared = days.map(day => {
      const found = day.tasks.find(t => t.id === taskId);
      if (found) {
        movedTask = found;
        return { ...day, tasks: day.tasks.filter(t => t.id !== taskId) };
      }
      return day;
    });

    setDays(
      cleared.map(day =>
        day.date === toDate && movedTask
          ? {
              ...day,
              tasks: [...day.tasks, { ...movedTask, date: toDate }],
            }
          : day
      )
    );
  };

  return (
    <>
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="grid grid-cols-7 border border-gray-300">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
            <div
              key={day}
              className="border border-gray-300 bg-white text-xs font-medium p-2"
            >
              {day}
            </div>
          ))}

          {days.map(day => (
            <CalendarCell
              key={day.date}
              day={day}
              onSelect={() => setSelectedDay(day)}
              onDropEvent={moveEvent}
            />
          ))}
        </div>
      </div>

      {/* LESSON MODAL */}
      {selectedDay && (
        <EventModal
          initialDate={new Date(selectedDay.date)}
          onClose={() => setSelectedDay(null)}
          onSave={addLesson}
        />
      )}
    </>
  );
};

export default Calendar;
