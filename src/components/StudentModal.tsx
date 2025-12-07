import React, { useState, useEffect, useRef } from "react";

interface Student {
  id?: string; // optional for new students
  name: string;
  email: string;
  status?: "Active" | "Suspended"; // optional
}

interface StudentModalProps {
  student?: Student | null; // could be undefined or null for adding new student
  onClose: () => void;
  onSave: (student: Student) => void;
}

export default function StudentModal({ student, onClose, onSave }: StudentModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (student) {
      setName(student.name);
      setEmail(student.email);
    } else {
      setName("");
      setEmail("");
    }
  }, [student]);

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleSave = () => {
    if (!name || !email) {
      return alert("Name and Email are required");
    }
    onSave({ ...student, name, email });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div ref={modalRef} className="bg-white rounded-lg w-96 p-6">
        <h3 className="text-xl font-bold mb-4">
          {student ? "Edit Student" : "Add Student"}
        </h3>
        <input
          type="text"
          placeholder="Name"
          className="border p-2 rounded w-full mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded w-full mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
