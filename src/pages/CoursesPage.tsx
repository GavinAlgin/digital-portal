import React, { useState } from "react";
import AppSidebar from "../components/Side-bar";

const initialCourses = [
  {
    id: "1",
    title: "React for Beginners",
    instructor: "John Doe",
    duration: "6 weeks",
  },
  {
    id: "2",
    title: "Advanced JavaScript",
    instructor: "Jane Smith",
    duration: "8 weeks",
  },
  {
    id: "3",
    title: "UI/UX Design Fundamentals",
    instructor: "Sarah Lee",
    duration: "4 weeks",
  },
];

const emptyForm = {
  title: "",
  instructor: "",
  duration: "",
};

const CoursesPage = () => {
  const [courses, setCourses] = useState(initialCourses);
  const [enrolled, setEnrolled] = useState([]); // course IDs
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Add or Edit Course
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title.trim()) return;

    if (editingId) {
      setCourses((prev) =>
        prev.map((c) => (c.id === editingId ? { ...c, ...form } : c))
      );
    } else {
      setCourses((prev) => [
        ...prev,
        { ...form, id: Date.now().toString() },
      ]);
    }

    resetForm();
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setIsModalOpen(false);
  };

  const handleEdit = (course) => {
    setForm(course);
    setEditingId(course.id);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    setEnrolled((prev) => prev.filter((cId) => cId !== id));
  };

  const toggleEnroll = (id) => {
    setEnrolled((prev) =>
      prev.includes(id)
        ? prev.filter((cId) => cId !== id)
        : [...prev, id]
    );
  };

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AppSidebar />

      <main className="flex-1 p-6 lg:p-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Course Management
          </h1>

          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 md:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
          >
            + Add Course
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search courses..."
          className="mb-6 w-full md:w-1/3 px-3 py-2 border rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Course Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const isEnrolled = enrolled.includes(course.id);

            return (
              <div
                key={course.id}
                className="bg-white p-5 rounded-xl shadow hover:shadow-md transition"
              >
                <h2 className="text-lg font-semibold">
                  {course.title}
                </h2>
                <p className="text-sm text-gray-500">
                  {course.instructor}
                </p>
                <p className="text-sm mt-1">{course.duration}</p>

                {/* Actions */}
                <div className="mt-4 flex gap-2 flex-wrap">
                  <button
                    onClick={() => toggleEnroll(course.id)}
                    className={`flex-1 py-2 rounded-lg text-sm ${
                      isEnrolled
                        ? "bg-green-500 text-white"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {isEnrolled ? "Enrolled" : "Enroll"}
                  </button>

                  <button
                    onClick={() => handleEdit(course)}
                    className="px-3 py-2 bg-yellow-400 rounded-lg text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(course.id)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredCourses.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No courses found.
          </p>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
              <h2 className="text-lg font-semibold mb-4">
                {editingId ? "Edit Course" : "Add Course"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  placeholder="Course Title"
                  className="w-full border p-2 rounded-lg"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                />

                <input
                  placeholder="Instructor"
                  className="w-full border p-2 rounded-lg"
                  value={form.instructor}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      instructor: e.target.value,
                    })
                  }
                />

                <input
                  placeholder="Duration"
                  className="w-full border p-2 rounded-lg"
                  value={form.duration}
                  onChange={(e) =>
                    setForm({ ...form, duration: e.target.value })
                  }
                />

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Cancel
                  </button>

                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CoursesPage;