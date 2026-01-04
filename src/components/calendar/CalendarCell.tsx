import type { CalendarDay } from "./types";

type Props = {
  day: CalendarDay;
  onSelect: () => void;
  onDropEvent: (taskId: string, date: string) => void;
};

export default function CalendarCell({ day, onSelect, onDropEvent }: Props) {
  return (
    <div
      onClick={onSelect}
      onDragOver={e => e.preventDefault()}
      onDrop={e => {
        const taskId = e.dataTransfer.getData("text/plain");
        onDropEvent(taskId, day.date);
      }}
      className={`border border-gray-300 h-32 p-2 text-sm cursor-pointer
        hover:bg-gray-50 transition
        ${day.isCurrentMonth ? "bg-white" : "bg-gray-100"}
      `}
    >
      <div className="text-xs text-gray-500 mb-1">{day.day}</div>

      <div className="space-y-1">
        {day.tasks.map(task => (
          <div
            key={task.id}
            draggable
            onDragStart={e =>
              e.dataTransfer.setData("text/plain", task.id)
            }
            className={`${task.color ?? "bg-gray-200"}
              text-white rounded px-2 py-1 text-xs truncate cursor-move`}
          >
            {task.title}
          </div>
        ))}
      </div>
    </div>
  );
}
