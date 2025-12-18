import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLISUser } from "../hooks/supabase/createLisUser";
import { getCurrentUser, type User } from "../hooks/context/AdminLogged";

interface Student {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string;
  status: "Active" | "Suspended";
  course: string;
  faculty: string;
}

interface StudentModalProps {
  student?: Student | null;
  onClose: () => void;
  onSave: (student: Student) => Promise<void>;
}

/* ---------------- ZOD SCHEMA ---------------- */
const StudentSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  date_of_birth: z.string().min(1, "Date of birth is required"),
  status: z.enum(["Active", "Suspended"]),
  course: z.string().min(1, "Course is required"),
  faculty: z.string().min(1, "Faculty is required"),
});

type StudentFormData = z.infer<typeof StudentSchema>;

export default function StudentModal({ student, onClose, onSave }: StudentModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const loggedUser = await getCurrentUser();
      setUser(loggedUser);
    };
    fetchUser();
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(StudentSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      date_of_birth: "",
      status: "Active",
      course: "BSIT",
      faculty: "Technology",
    },
  });

  /* -------- Populate data when editing -------- */
  useEffect(() => {
    if (student) {
      setValue("first_name", student.first_name);
      setValue("last_name", student.last_name);
      setValue("email", student.email);
      setValue("date_of_birth", student.date_of_birth);
      setValue("status", student.status);
      setValue("course", student.course);
      setValue("faculty", student.faculty);
    }
  }, [student, setValue]);

  /* -------- Close modal click outside -------- */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  /* ---------------- SUBMIT ---------------- */
  async function onSubmit(data: StudentFormData) {
    setIsSubmitting(true);
    try {
      await createLISUser({
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        dateOfBirth: data.date_of_birth,
        status: data.status,
        course: data.course,
        faculty: data.faculty,
        facultyPrefix: data.faculty.slice(0, 4).toUpperCase(), // ✅ ADD THIS
        coursePrefix: data.course.slice(0, 4).toUpperCase(),
        password: "TempPass123!",
      });

      await onSave({
        ...(student ?? {}),
        ...data,
      });

      alert("Student successfully saved.");
      onClose();
    } catch (err) {
      console.error(err);
      alert((err as Error).message || "Failed to save student.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // async function onSubmit(data: StudentFormData) {
  //   setIsSubmitting(true);
  //   try {
  //     // 1️⃣ Call Edge Function to create user
  //     await createLISUser({
  //       firstName: data.first_name,
  //       lastName: data.last_name,
  //       email: data.email,
  //       dateOfBirth: data.date_of_birth,
  //       status: data.status,
  //       course: data.course,
  //       faculty: data.faculty,
  //       password: "TempPass123!",
  //       coursePrefix: data.course.slice(0, 4).toUpperCase(),
  //     });

  //     // 2️⃣ Call parent onSave to update local state / database
  //     await onSave({
  //       ...student,
  //       ...data,
  //     });

  //     alert("Student successfully saved.");
  //     onClose();
  //   } catch (err) {
  //     console.error(err);
  //     alert((err as Error).message || "Failed to save student.");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // }

  if (!user)
    return <div className="p-10 text-center text-red-600">You are not logged in to add users.</div>;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl w-[420px] p-6 animate-fadeIn"
      >
        <h3 className="text-2xl font-semibold mb-4">
          {student ? "Edit Student" : "Add Student"}
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              {...register("first_name")}
              className={`w-full border rounded-lg p-2 ${
                errors.first_name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter first name"
            />
            {errors.first_name && (
              <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              {...register("last_name")}
              className={`w-full border rounded-lg p-2 ${
                errors.last_name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter last name"
            />
            {errors.last_name && (
              <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              {...register("email")}
              className={`w-full border rounded-lg p-2 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium mb-1">Date of Birth</label>
            <input
              type="date"
              {...register("date_of_birth")}
              className={`w-full border rounded-lg p-2 ${
                errors.date_of_birth ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.date_of_birth && (
              <p className="text-red-500 text-sm mt-1">{errors.date_of_birth.message}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              {...register("status")}
              className="w-full border rounded-lg p-2 border-gray-300"
            >
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          {/* Course */}
          <div>
            <label className="block text-sm font-medium mb-1">Course</label>
            <input
              {...register("course")}
              className={`w-full border rounded-lg p-2 ${
                errors.course ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter course"
            />
            {errors.course && (
              <p className="text-red-500 text-sm mt-1">{errors.course.message}</p>
            )}
          </div>

          {/* Faculty */}
          <div>
            <label className="block text-sm font-medium mb-1">Faculty</label>
            <input
              {...register("faculty")}
              className={`w-full border rounded-lg p-2 ${
                errors.faculty ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter faculty"
            />
            {errors.faculty && (
              <p className="text-red-500 text-sm mt-1">{errors.faculty.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border hover:bg-gray-100"
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 shadow"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
