// types.ts
export interface User {
  id: string;
  fullName: string;
  studentNumber: string;
  course: string;
  campus: string;
  avatarUrl?: string; // optional
}

export interface Student {
  id: string;
  name: string;
  email: string;
  status: "Active" | "Suspended";
  createdAt?: string;
}

