import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Course {
  id: number;
  title: string;
  location: string;
  date: string;
  moodleUrl: string;
}

const courses: Course[] = [
  {
    id: 1,
    title: "Digital Literacy Fundamental",
    location: "Moodle Student Portal",
    date: "Self Pace Course",
    moodleUrl: "https://listec.moodlecloud.com/",
  },
];

const Courses: React.FC = () => {
  const [showSheet, setShowSheet] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [status, setStatus] = useState<string>("");

  const handleOpenSheet = (course: Course) => {
    setSelectedCourse(course);
    setStatus("Opening Moodle course…");
    setShowSheet(true);

    // Simulate NFC / confirmation delay
    setTimeout(() => {
      window.open(course.moodleUrl, "_blank", "noopener,noreferrer");
    }, 1200);
  };

  return (
    <div className="px-4 sm:px-6 max-w-2xl mx-auto mt-6">
      <h2 className="font-semibold text-lg mb-4">Enrolled Courses</h2>

      {courses.length === 0 && (
        <div className="text-gray-500 text-sm">
          No timetable entries available.
        </div>
      )}

      <div className="space-y-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-gray-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex gap-3">
              {/* <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-semibold">
                {course.title.charAt(0)}
              </div> */}

              <div>
                <div className="font-semibold text-gray-900">
                  {course.title}
                </div>
                <div className="text-sm text-gray-500 mt-0.5">
                  {course.location} · {course.date}
                </div>
              </div>
            </div>

            <button
              onClick={() => handleOpenSheet(course)}
              className="px-4 py-2 text-sm rounded-full bg-blue-600 text-white hover:bg-blue-500 transition">
              Attend
            </button>
          </div>
        ))}
      </div>

      {/* Bottom Sheet */}
      <AnimatePresence>
        {showSheet && selectedCourse && (
          <motion.div
            className="fixed inset-0 bg-black/40 z-40 flex justify-center items-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSheet(false)}
          >
            <motion.div
              className="w-full sm:max-w-md bg-white rounded-t-2xl p-6 pb-10 shadow-xl"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 130, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />

              <h3 className="text-lg font-semibold text-gray-900">
                {selectedCourse.title}
              </h3>

              <p className="text-gray-600 mt-2 text-sm">{status}</p>

              <motion.div
                className="w-20 h-20 bg-blue-500/20 rounded-full mx-auto mt-6 flex items-center justify-center"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 1.6 }}
              >
                <div className="w-10 h-10 bg-blue-500 rounded-full" />
              </motion.div>

              <button
                onClick={() => setShowSheet(false)}
                className="w-full mt-8 py-3 rounded-xl bg-gray-200 text-gray-700 font-medium"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Courses;
