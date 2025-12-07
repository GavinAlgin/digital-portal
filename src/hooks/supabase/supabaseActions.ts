// lib/supabaseStudents.ts
import type { Student } from "../types";
import { supabase } from "./supabaseClient";

/* -----------------------------------------------------------
   FETCH ALL STUDENTS
----------------------------------------------------------- */
export async function fetchStudents() {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("role", "Student")
    .order("created_at", { ascending: false });

  return { data, error };
}

/* -----------------------------------------------------------
   ADD STUDENT (DB ONLY — NOT AUTH!)
   (Your StudentModal already calls createLISUser for Auth)
----------------------------------------------------------- */
export async function addStudent(student: Student) {
  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        first_name: student.first_name,
        last_name: student.last_name,
        email: student.email,
        date_of_birth: student.date_of_birth,
        status: student.status,
        course: student.course,
        faculty: student.faculty,
        role: "Student",
      },
    ])
    .select();

  return { data, error };
}

/* -----------------------------------------------------------
   UPDATE STUDENT
----------------------------------------------------------- */
export async function updateStudent(student: Student) {
  const { error } = await supabase
    .from("users")
    .update({
      first_name: student.first_name,
      last_name: student.last_name,
      email: student.email,
      date_of_birth: student.date_of_birth,
      status: student.status,
      course: student.course,
      faculty: student.faculty,
    })
    .eq("id", student.id);

  return { error };
}

/* -----------------------------------------------------------
   DELETE STUDENT
----------------------------------------------------------- */
export async function removeStudent(id: string) {
  const { error } = await supabase.from("users").delete().eq("id", id);
  return { error };
}

/* -----------------------------------------------------------
   TOGGLE STUDENT ACTIVE/SUSPENDED STATUS
----------------------------------------------------------- */
export async function toggleStudentStatus(student: Student) {
  const newStatus = student.status === "Active" ? "Suspended" : "Active";

  const { error } = await supabase
    .from("users")
    .update({ status: newStatus })
    .eq("id", student.id);

  return { error };
}
