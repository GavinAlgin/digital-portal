import { supabase } from "./supabaseClient";

// Define the input type
interface CreateLISUserInput {
  firstName: string;
  lastName: string;
  course: string;
  faculty: string;
  password: string;
  dateOfBirth: string;
  status?: "Active" | "Suspended";
}

export async function createLISUser({
  firstName,
  lastName,
  course,
  faculty,
  password,
  dateOfBirth,
  status = "Active",
}: CreateLISUserInput) {
  // Generate LIS ID
  const { data: idRes, error: idErr } = await supabase.rpc("generate_lis_id", {
    course_name: course,
    faculty,
  });

  if (idErr) throw idErr;

  const idNumber = idRes as string;
  const fakeEmail = `${idNumber}@lis.local`;

  // Create Auth user
  const { data: authUser, error: authErr } = await supabase.auth.admin.createUser({
    email: fakeEmail,
    password,
    email_confirm: true,
    user_metadata: { role: "student" },
  });

  if (authErr) throw authErr;

  // Insert profile in "users" table
  const { error: profileErr } = await supabase.from("users").insert({
    id: authUser.user.id,
    id_number: idNumber,
    first_name: firstName,
    last_name: lastName,
    email: fakeEmail,
    date_of_birth: dateOfBirth,
    status,
    course,
    faculty,
  });

  if (profileErr) throw profileErr;

  return { idNumber };
}
