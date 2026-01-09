// types.ts
export interface User {
  id: string;
  fullName: string;
  studentNumber: string;
  course: string;
  faculty: string;
  campus: string;
  avatarUrl?: string; // optional
}

export type Status = "active" | "pending" | "suspended";

export interface Student {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: Date;
  id_number: string;
  course: string;
  faculty: string;
  email: string;
  status: Status; // use the Status type
  role?: "student" | "admin"; // optional role
  created_at?: string;
}

// Updated initial students with proper status and optional fields
export const initialStudents: Student[] = [
  {
    id: "1",
    id_number: "S101",
    first_name: "John",
    last_name: "Doe",
    date_of_birth: new Date("2000-01-01"),
    course: "CS",
    faculty: "Science",
    email: "john@example.com",
    role: "student",
    status: "active",
  },
  {
    id: "2",
    id_number: "S102",
    first_name: "Jane",
    last_name: "Smith",
    date_of_birth: new Date("2001-05-15"),
    course: "IT",
    faculty: "Engineering",
    email: "jane@example.com",
    role: "student",
    status: "pending",
  },
  {
    id: "3",
    id_number: "S103",
    first_name: "Mike",
    last_name: "Brown",
    date_of_birth: new Date("2000-09-20"),
    course: "Math",
    faculty: "Science",
    email: "mike@example.com",
    role: "student",
    status: "suspended",
  },
];

export function getStatusBadge(status: Status) {
  const config: Record<Status, string> = {
    active: "bg-green-100 text-green-700",
    pending: "bg-amber-100 text-amber-700",
    suspended: "bg-red-100 text-red-700",
  };
  return {
    text: status.charAt(0).toUpperCase() + status.slice(1),
    className: config[status],
  };
}
