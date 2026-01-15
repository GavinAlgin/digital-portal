import { useState } from "react";

type ViewType = "Calendar" | "Table";

interface CalendarHeaderProps {
  onViewChange?: (view: ViewType) => void;
}

export default function CalendarHeader({
  onViewChange,
}: CalendarHeaderProps) {
  const [activeView, setActiveView] = useState<ViewType>("Calendar");

  const handleChange = (view: ViewType) => {
    setActiveView(view);
    onViewChange?.(view);
  };

  return (
    <header className="flex items-center justify-between bg-white border-b px-6 py-4">
      <div>
        <h2 className="text-xl font-semibold">Beyond UI</h2>

        <div className="flex gap-6 mt-2 text-sm">
          {(["Calendar", "Table"] as ViewType[]).map((view) => (
            <button
              key={view}
              onClick={() => handleChange(view)}
              className={`pb-2 transition-colors ${
                activeView === view
                  ? "text-blue-600 border-b-2 border-blue-600 font-medium"
                  : "text-gray-500 hover:text-gray-900"
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
  );
}
