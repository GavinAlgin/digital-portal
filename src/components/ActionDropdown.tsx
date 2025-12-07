import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import React, { useState, useRef, useEffect } from "react";
import type { Student } from "../hooks/types";


interface ActionDropdownProps {
  student: Student;
  openEditModal: (student: Student) => void;
  toggleSuspend: (student: Student) => void;
  sendInvitation: (student: Student) => void;
  sendChangePassword: (student: Student) => void;
  openDeleteModal: (student: Student) => void;
}

export default function ActionDropdown({
  student,
  openEditModal,
  toggleSuspend,
  sendInvitation,
  sendChangePassword,
  openDeleteModal,
}: ActionDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded hover:bg-gray-100"
      >
        <EllipsisHorizontalIcon className="h-5 w-5" />
      </button>

      {open && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            <button
              onClick={() => { openEditModal(student); setOpen(false); }}
              className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
            >
              Edit
            </button>
            <button
              onClick={() => { toggleSuspend(student); setOpen(false); }}
              className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
            >
              {student.status === "Active" ? "Suspend" : "Activate"}
            </button>
            <button
              onClick={() => { sendInvitation(student); setOpen(false); }}
              className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
            >
              Send Invitation
            </button>
            <button
              onClick={() => { sendChangePassword(student); setOpen(false); }}
              className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
            >
              Reset Password
            </button>
            <button
              onClick={() => { openDeleteModal(student); setOpen(false); }}
              className="block px-4 py-2 text-sm w-full text-left text-red-600 hover:bg-gray-100"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
