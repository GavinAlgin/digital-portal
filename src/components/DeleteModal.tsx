import { useEffect, useRef } from "react";
import type { Student } from "../hooks/types";

interface DeleteModalProps {
  student: Student;
  onClose: () => void;
  onDelete: () => void;
}

export default function DeleteModal({ student, onClose, onDelete }: DeleteModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div ref={modalRef} className="bg-white rounded-lg w-96 p-6">
        <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
        <p className="mb-4">
          Are you sure you want to delete <strong>{student.first_name} {student.last_name}</strong>?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
