import type { Student } from "../types";
import { supabase } from "./supabaseClient";

// Fetch all students
export async function fetchStudents() {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("role", "student")
    .order("created_at", { ascending: true });

  return { data, error };
}

// Add a new student (table only)
export async function addStudent(student: Student) {
  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        id_number: student.id_number,
        first_name: student.first_name,
        last_name: student.last_name,
        email: student.email,
        status: student.status,
        course: student.course,
        faculty: student.faculty,
        role: "student",
      },
    ])
    .select();

  return { data, error };
}

// --------------------------------------------------
// NEW: Calls SQL Function generate_lis_id()
// --------------------------------------------------
export async function generateStudentId(
  facultyPrefix: string,
  coursePrefix: string
) {
  const { data, error } = await supabase.rpc("generate_lis_id", {
    faculty_prefix: facultyPrefix,
    course_prefix: coursePrefix,
  });

  if (error) throw error;
  return data; // This is the generated ID string
}

// --------------------------------------------------
// NEW: Create LIS User with auto-generated ID
// --------------------------------------------------
export async function createLISUser(student: {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  status: string;
  course: string;
  faculty: string;
  facultyPrefix: string; // must be provided
  coursePrefix: string;  // must be provided
  password: string;
}) {

  // 1️⃣ Generate ID using SQL function
  const idNumber = await generateStudentId(
    student.facultyPrefix,
    student.coursePrefix
  );

  // 2️⃣ Create Supabase Auth user
  const { data: authUser, error: authError } =
    await supabase.auth.admin.createUser({
      email: student.email,
      password: student.password,
    });

  if (authError) throw authError;

  const userId = authUser.user?.id;
  if (!userId) throw new Error("Failed to create auth user");

  // 3️⃣ Insert into users table WITH generated ID
  const { error: insertError } = await supabase
    .from("users")
    .insert([
      {
        id: userId,
        id_number: idNumber, // ⬅️ new generated ID
        first_name: student.firstName,
        last_name: student.lastName,
        email: student.email,
        status: student.status,
        course: student.course,
        faculty: student.faculty,
        role: "student",
      },
    ]);

  if (insertError) throw insertError;

  return authUser.user;
}

// Update student
export async function updateStudent(student: Student) {
  const { data, error } = await supabase
    .from("users")
    .update({
      first_name: student.first_name,
      last_name: student.last_name,
      email: student.email,
      status: student.status,
      course: student.course,
      faculty: student.faculty,
    })
    .eq("id_number", student.id_number)
    .select();

  return { data, error };
}

// Remove student
export async function removeStudent(id_number: string) {
  const { data, error } = await supabase
    .from("users")
    .delete()
    .eq("id_number", id_number);

  return { data, error };
}

// Toggle student status
export async function toggleStudentStatus(student: Student) {
  const newStatus = student.status === "Active" ? "Suspended" : "Active";
  const { data, error } = await supabase
    .from("users")
    .update({ status: newStatus })
    .eq("id_number", student.id_number)
    .select();

  return { data, error };
}




// import { supabase } from "./supabaseClient";

// // helper
// function code(str: string) {
//   return str.replace(/\s+/g, "").substring(0, 3).toUpperCase();
// }

// async function generateCustomId(course: string, faculty: string) {
//   const courseCode = code(course);
//   const facultyCode = code(faculty);
//   const year = new Date().getFullYear().toString().slice(-2);
//   const prefix = `LIS-${courseCode}${facultyCode}${year}`;

//   const { data, error } = await supabase
//     .from("users")
//     .select("id")
//     .like("id", `${prefix}%`)
//     .order("id", { ascending: false })
//     .limit(1);

//   if (error) throw error;

//   if (!data || data.length === 0) return `${prefix}01`;

//   const lastSeq = parseInt(data[0].id.slice(-2)) + 1;
//   return `${prefix}${String(lastSeq).padStart(2, "0")}`;
// }

// export async function createLISUser({
//   firstName,
//   lastName,
//   dateOfBirth,
//   email,
//   password,
//   status,
//   course,
//   faculty,
// }: {
//   firstName: string;
//   lastName: string;
//   dateOfBirth: string;
//   email: string;
//   password: string;       // ⭐ FIXED — now required
//   status: "Active" | "Suspended";
//   course: string;
//   faculty: string;
// }) {
//   // 1️⃣ generate custom LIS ID
//   const customId = await generateCustomId(course, faculty);

//   // 2️⃣ create Supabase Auth user
//   const authRes = await supabase.auth.admin.createUser({
//     email,
//     password,
//     email_confirm: true,
//   });

//   if (authRes.error) throw authRes.error;

//   const authUser = authRes.data.user;

//   // 3️⃣ insert into your custom "users" table
//   const { data, error } = await supabase
//     .from("users")
//     .insert([
//       {
//         id: customId,              
//         auth_id: authUser.id,       
//         first_name: firstName,
//         last_name: lastName,
//         email,
//         date_of_birth: dateOfBirth,
//         status,
//         course,
//         faculty,
//         created_at: new Date().toISOString(),
//       },
//     ])
//     .select()
//     .single();

//   if (error) throw error;

//   return data;
// }


// // src/hooks/supabase/createLisUser.ts

// interface LISUserPayload {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   dateOfBirth: string;
//   status: "Active" | "Suspended";
//   course: string;
//   faculty: string;
//   coursePrefix: string; // Example: "BSIT"
// }

// interface LISUserResponse {
//   success: boolean;
//   id: string;
//   id_number: string;
//   error?: string;
// }

// /**
//  * Calls the Supabase Edge Function to create a LIS student.
//  */
// export async function createLISUser(student: LISUserPayload): Promise<LISUserResponse> {
//   try {
//     const res = await fetch(
//       `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-lis-user`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`, // ✅ Add this
//         },
//         body: JSON.stringify(student),
//       }
//     );

//     const data: LISUserResponse = await res.json();

//     if (!res.ok) {
//       throw new Error(data.error || "Failed to create LIS user");
//     }

//     return data;
//   } catch (err: any) {
//     console.error("createLISUser error:", err);
//     throw new Error(err.message || "Failed to create LIS user");
//   }
// }

