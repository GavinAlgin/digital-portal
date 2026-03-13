import { useMemo, useState } from "react";
import { format } from "date-fns";
import {
  CalendarIcon,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { supabase } from "../../hooks/supabase/supabaseClient";

/**
 * TYPES
 */
type Props = {
  initialDate: Date;
  onClose: () => void;
};

type SubmitState = "idle" | "loading" | "success" | "error";

/**
 * MAIN MODAL
 */
export default function EventModal({ initialDate, onClose }: Props) {
  const [title, setTitle] = useState("");
  const [attendees, setAttendees] = useState("");
  const [date, setDate] = useState<Date>(initialDate);
  const [time, setTime] = useState("09:00");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("bg-blue-500");
  const [course, setCourse] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  /**
   * COURSE OPTIONS
   */
  const courses = [
    "Algebra I",
    "Geometry",
    "Calculus",
    "Physics",
    "Chemistry",
  ];

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

  /**
   * SUBMIT HANDLER (SUPABASE)
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitState === "loading") return;

    try {
      setSubmitState("loading");

      // Combine date + time into one timestamp
      const [hours, minutes] = time.split(":").map(Number);
      const startDateTime = new Date(date);
      startDateTime.setHours(hours, minutes, 0, 0);

      const { error } = await supabase.from("events").insert({
        title,
        attendees,
        course,
        start_time: startDateTime.toISOString(),
        location,
        description,
        color,
      });

      if (error) throw error;

      setSubmitState("success");
      setTimeout(onClose, 1000);
    } catch (err) {
      console.error("Error inserting event:", err);
      setSubmitState("error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-gray-300/55 px-6 py-4">
          <h2 className="text-lg font-semibold">Schedule a Lesson</h2>
          <button onClick={onClose}>
            <X className="h-5 w-5 text-gray-500/55" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 p-6">
            {/* COURSE */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Course</label>
              <select
                className="w-full border border-gray-300/55 rounded-md px-3 py-2 text-sm"
                value={course}
                onChange={e => setCourse(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select a course
                </option>
                {courses.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* TITLE */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Lesson Title</label>
              <input
                className="w-full border border-gray-300/55 rounded-md px-3 py-2 text-sm"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>

            {/* ATTENDEES */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Attendees</label>
              <input
                className="w-full border border-gray-300/55 rounded-md px-3 py-2 text-sm"
                value={attendees}
                onChange={e => setAttendees(e.target.value)}
              />
            </div>

            {/* DATE & TIME */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-1 relative">
                <label className="text-sm font-medium">Date</label>
                <button
                  type="button"
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="w-full flex items-center gap-2 border border-gray-300/55 rounded-md px-3 py-2 text-sm"
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

              <div className="space-y-1">
                <label className="text-sm font-medium">Time</label>
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
              <label className="text-sm font-medium">Location / Link</label>
              <input
                className="w-full border border-gray-300/55 rounded-md px-3 py-2 text-sm"
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Description</label>
              <textarea
                className="w-full border border-gray-300/55 rounded-md px-3 py-2 text-sm min-h-[100px]"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            {/* COLOR */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Lesson Color</label>
              <div className="flex gap-3">
                {COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`h-6 w-6 rounded-full ${c} ${
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
              disabled={submitState === "loading"}
              className="text-sm px-3 py-1 rounded hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitState === "loading"}
              className={`flex items-center gap-2 text-sm px-4 py-1.5 rounded-md text-white
                ${
                  submitState === "idle" && "bg-black hover:bg-gray-800"
                }
                ${submitState === "loading" && "bg-gray-400"}
                ${submitState === "success" && "bg-green-600"}
                ${submitState === "error" && "bg-red-600"}
              `}
            >
              {submitState === "idle" && "Schedule"}
              {submitState === "loading" && (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving
                </>
              )}
              {submitState === "success" && (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Saved
                </>
              )}
              {submitState === "error" && (
                <>
                  <AlertCircle className="h-4 w-4" />
                  Retry
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
