import { useMemo, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";

/**
 * TYPES
 */
type Event = {
  id: string;
  title: string;
  attendees: string;
  date: Date;
  time: string;
  location: string;
  description: string;
  color: string;
};

type Props = {
  initialDate: Date;
  onClose: () => void;
  onSave: (event: Event) => void;
};

/**
 * MAIN MODAL
 */
export default function EventModal({
  initialDate,
  onClose,
  onSave,
}: Props) {
  const [title, setTitle] = useState("");
  const [attendees, setAttendees] = useState("");
  const [date, setDate] = useState<Date>(initialDate);
  const [time, setTime] = useState("09:00");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("bg-blue-500");
  const [showCalendar, setShowCalendar] = useState(false);

  /**
   * TIME OPTIONS (30min interval)
   */
  const timeOptions = useMemo(() => {
    const options: { value: string; label: string }[] = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const value = `${String(h).padStart(2, "0")}:${String(m).padStart(
          2,
          "0"
        )}`;
        const temp = new Date(2000, 0, 1, h, m);
        options.push({ value, label: format(temp, "h:mm a") });
      }
    }
    return options;
  }, []);

  const COLORS = [
    "bg-blue-500",
    "bg-green-500",
    "bg-red-500",
    "bg-purple-500",
    "bg-yellow-500",
    "bg-pink-500",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSave({
      id: crypto.randomUUID(),
      title,
      attendees,
      date,
      time,
      location,
      description,
      color,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-gray-300/55 px-6 py-4">
          <h2 className="text-lg font-semibold">Schedule a Lesson</h2>
          <button onClick={onClose}>
            <X className="h-5 w-5 text-gray-500/55 cursor-pointer" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 p-6">
            {/* TITLE */}
            <div className="space-y-1">
              <label className="text-medium font-medium mb-4">Lesson Title</label>
              <input
                className="w-full border border-gray-300/55 rounded-md px-3 py-2 text-sm"
                placeholder="e.g. Algebra Lesson"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>

            {/* ATTENDEES */}
            <div className="space-y-1">
              <label className="text-medium font-medium mb-4">Attendees</label>
              <input
                className="w-full border border-gray-300/55 rounded-md px-3 py-2 text-sm"
                placeholder="student@email.com"
                value={attendees}
                onChange={e => setAttendees(e.target.value)}
              />
              <p className="text-xs text-gray-600/65">
                Separate multiple emails with commas
              </p>
            </div>

            {/* DATE & TIME */}
            <div className="grid grid-cols-3 gap-4">
              {/* DATE */}
              <div className="col-span-2 space-y-1 relative">
                <label className="text-medium font-medium mb-4">Date</label>
                <button
                  type="button"
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="w-full flex items-center gap-2 border border-gray-300/55 rounded-md px-3 py-2 text-sm text-left"
                >
                  <CalendarIcon className="h-4 w-4" />
                  {format(date, "PPP")}
                </button>

                {showCalendar && (
                  <input
                    type="date"
                    className="absolute top-full mt-2 border border-gray-300/55 rounded-md px-2 py-1 text-sm bg-white"
                    value={format(date, "yyyy-MM-dd")}
                    onChange={e => {
                      setDate(new Date(e.target.value));
                      setShowCalendar(false);
                    }}
                  />
                )}
              </div>

              {/* TIME */}
              <div className="space-y-1">
                <label className="text-medium font-medium mb-4">Time</label>
                <select
                  className="w-full border border-gray-300/55 rounded-md px-2 py-2 text-sm"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                >
                  {timeOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* LOCATION */}
            <div className="space-y-1">
              <label className="text-medium font-medium mb-4">
                Location / Meeting Link
              </label>
              <input
                className="w-full border border-gray-300/55 rounded-md px-3 py-2 text-sm"
                placeholder="Room 4 or Zoom link"
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-1">
              <label className="text-medium font-medium mb-4">Description</label>
              <textarea
                className="w-full border border-gray-300/55 rounded-md px-3 py-2 text-sm min-h-[100px]"
                placeholder="Lesson notes or agenda"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            {/* COLOR PICKER */}
            <div className="space-y-2">
              <label className="text-medium font-medium mb-4">Lesson Color</label>
              <div className="flex gap-3">
                {COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`h-6 w-6 rounded-full ${c} ring-offset-2 ${
                      color === c ? "ring-2 ring-gray-300/55" : ""
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-2 border-t border-gray-300/55 px-4 py-3">
            <button
              type="button"
              onClick={onClose}
              className="text-sm px-3 py-1 text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-black hover:bg-gray-800/55 text-white text-sm px-4 py-1.5 rounded-md cursor-pointer"
            >
              Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
