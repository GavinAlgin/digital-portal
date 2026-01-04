export default function CalendarHeader() {
  return (
    <header className="flex items-center justify-between bg-white border-b px-6 py-4">
      <div>
        <h2 className="text-xl font-semibold">Beyond UI</h2>

        <div className="flex gap-4 mt-2 text-sm text-gray-500">
          {["Summary", "Board", "List", "Gantt", "Calendar", "Table"].map(view => (
            <button
              key={view}
              className={`pb-1 ${
                view === "Calendar"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "hover:text-gray-900"
              }`}
            >
              {view}
            </button>
          ))}
        </div>
      </div>

      <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
        Add Task
      </button>
    </header>
  )
}
