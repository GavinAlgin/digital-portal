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
  first_name: string;
  last_name: string;
  date_of_birth: Date;
  id_number: string;
  course: string;
  faculty:string;
  email: string;
  status: "Active" | "Suspended";
  createdAt?: string;
}

