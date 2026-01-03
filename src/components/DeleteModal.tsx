import { useEffect, useRef, useState } from "react";
import type { Student } from "../hooks/types";
import { supabase } from "../hooks/supabase/supabaseClient";

interface DeleteStudentModalProps {
  student?: Student; // optional
  isOpen: boolean;
  onClose: () => void;
  onDelete?: () => void; // optional callback after deletion
}

type ButtonState = "idle" | "loading" | "success" | "error";

export default function DeleteStudentModal({
  student,
  isOpen,
  onClose,
  onDelete,
}: DeleteStudentModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [btnState, setBtnState] = useState<ButtonState>("idle");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!isOpen || !student) return null;

  const handleDelete = async () => {
    setBtnState("loading");

    const { error } = await supabase
      .from("students")
      .delete()
      .eq("id", student.id);

    if (error) {
      setBtnState("error");
      console.error("Delete error:", error.message);
      setTimeout(() => setBtnState("idle"), 1500); // reset to idle after short delay
      return;
    }

    setBtnState("success");
    if (onDelete) onDelete();

    setTimeout(() => {
      setBtnState("idle");
      onClose();
    }, 1200);
  };

  // Button content based on state
  const renderButtonContent = () => {
    switch (btnState) {
      case "idle":
        return "Delete";
      case "loading":
        return (
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            Processing
          </div>
        );
      case "success":
        return (
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Deleted!
          </div>
        );
      case "error":
        return (
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Failed!
          </div>
        );
    }
  };

  // Button colors based on state
  const btnClasses = () => {
    switch (btnState) {
      case "idle":
        return "bg-red-600 hover:bg-red-700 text-white";
      case "loading":
        return "bg-blue-500 text-white cursor-not-allowed animate-pulse";
      case "success":
        return "bg-green-600 text-white";
      case "error":
        return "bg-red-600 text-white";
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500/30 z-50">
      <div ref={modalRef} className="bg-white rounded-lg w-96 p-6">
        <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
        <p className="mb-6">
          Are you sure you want to delete{" "}
          <strong>
            {student.first_name} {student.last_name}
          </strong>
          ?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border hover:bg-gray-100 disabled:opacity-50"
            disabled={btnState === "loading"}
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className={`px-4 py-2 rounded flex items-center justify-center gap-2 ${btnClasses()}`}
            disabled={btnState === "loading"}
          >
            {renderButtonContent()}
          </button>
        </div>
      </div>
    </div>
  );
}
