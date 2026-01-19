import { useEffect, useMemo, useState } from "react"
import type { FormEvent } from "react"
import { X, Loader2, Check, AlertTriangle } from "lucide-react"
import { supabase } from "../hooks/supabase/supabaseClient"

type Student = {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  id_number: string | null
}

type Props = {
  isOpen: boolean
  student?: Student
  onClose: () => void
  onSave?: (student: Student) => void
  refreshData: () => void 
}

export default function EditStudentModal({
  isOpen,
  student,
  onClose,
  onSave,
}: Props) {
  const [name, setName] = useState("")
  const [surname, setSurname] = useState("")
  const [email, setEmail] = useState("")
  const [idNumber, setIdNumber] = useState("")
  const [password, setPassword] = useState("")

  const [buttonState, setButtonState] = useState<
    "idle" | "processing" | "success" | "failed"
  >("idle")
  const [error, setError] = useState<string | null>(null)

  // 🔁 Populate form when modal opens
  useEffect(() => {
    if (!isOpen || !student) return

    setName(student.first_name ?? "")
    setSurname(student.last_name ?? "")
    setEmail(student.email ?? "")
    setIdNumber(student.id_number ?? "")
    setPassword("")
    setButtonState("idle")
    setError(null)
  }, [isOpen, student])

  // ✅ Dirty check: always called
  const hasChanges = useMemo(() => {
    return (
      name.trim() !== (student?.first_name ?? "") ||
      surname.trim() !== (student?.last_name ?? "") ||
      email.trim() !== (student?.email ?? "") ||
      idNumber.trim() !== (student?.id_number ?? "") ||
      password.trim().length > 0
    )
  }, [name, surname, email, idNumber, password, student])

  // ✅ Early return for JSX only
  if (!isOpen || !student) return null

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!hasChanges) return;

    setError(null);
    setButtonState("processing");

    try {
      const updates: Partial<Student> = {};

      if (name.trim() !== (student.first_name ?? "")) {
        updates.first_name = name.trim() || null;
      }
      if (surname.trim() !== (student.last_name ?? "")) {
        updates.last_name = surname.trim() || null;
      }
      if (email.trim() !== (student.email ?? "")) {
        updates.email = email.trim();
      }
      if (idNumber.trim() !== (student.id_number ?? "")) {
        updates.id_number = idNumber.trim() || null;
      }

      // 🗄️ Update user profile only if something changed
      if (Object.keys(updates).length > 0) {
        const { error } = await supabase
          .from("users")
          .update(updates)
          .eq("id", student.id);
        if (error) throw error;
      }

      // 🔐 Update auth email if changed
      if (email.trim() !== student.email) {
        const { error } = await supabase.auth.updateUser({ email });
        if (error) throw error;
      }

      // 🔐 Update password if provided
      if (password.trim()) {
        const { error } = await supabase.auth.updateUser({
          password: password.trim(),
        });
        if (error) throw error;
      }

      setButtonState("success");
      onSave?.({ ...student, ...updates });
      setTimeout(onClose, 800);
    } catch (err: unknown) {
      console.error(err);

      // Narrow unknown error to Error type
      if (err instanceof Error) {
        // Supabase errors may have a `code` property, so we define a type for it
        const supaErr = err as Error & { code?: string };

        if (supaErr.code === "23505") {
          if (supaErr.message.includes("users_id_number_key")) {
            setError("This student ID number is already assigned to another student.");
          } else if (supaErr.message.includes("users_email_unique")) {
            setError("This email address is already in use.");
          } else {
            setError("Duplicate value detected.");
          }
        } else {
          setError(supaErr.message ?? "Something went wrong");
        }
      } else {
        // If err is not an Error instance
        setError("Something went wrong");
      }

      setButtonState("failed");
    }
  };


  const renderButtonContent = () => {
    switch (buttonState) {
      case "processing":
        return (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </span>
        )
      case "success":
        return (
          <span className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            Saved
          </span>
        )
      case "failed":
        return (
          <span className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Failed
          </span>
        )
      default:
        return "Save Changes"
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-500/55 px-6 py-4">
          <h2 className="text-lg font-semibold">Edit Student</h2>
          <button onClick={onClose}>
            <X className="h-5 w-5 text-gray-500/55" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 p-6">
            <Input label="First Name" value={name} onChange={setName} />
            <Input label="Surname" value={surname} onChange={setSurname} />
            <Input label="Student ID Number" value={idNumber} onChange={setIdNumber} />
            <Input label="Email" value={email} type="email" onChange={setEmail} />
            <Input
              label="New Password"
              type="password"
              value={password}
              placeholder="Leave empty to keep current password"
              onChange={setPassword}
            />

            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 border-t border-gray-500/55 px-4 py-3">
            <button
              type="button"
              onClick={onClose}
              disabled={buttonState === "processing"}
              className="text-sm px-3 py-1 text-gray-600 hover:bg-gray-100 rounded cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!hasChanges || buttonState === "processing"}
              className={`text-sm px-4 py-1.5 rounded-md text-white ${
                !hasChanges
                  ? "bg-gray-300 cursor-not-allowed"
                  : buttonState === "failed"
                  ? "bg-red-600"
                  : buttonState === "success"
                  ? "bg-green-600"
                  : "bg-black hover:bg-gray-800"
              }`}
            >
              {renderButtonContent()}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// 🔹 Reusable input
function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300/55 rounded-md px-3 py-2 text-sm"
      />
    </div>
  )
}
