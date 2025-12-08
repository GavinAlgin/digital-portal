// supabase/functions/create-lis-user/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

interface CreateLISUserBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: string;
  status: "Active" | "Suspended";
  course: string;
  faculty: string;
  coursePrefix: string;
}

serve(async (req: Request) => {
  // 1️⃣ Handle preflight (CORS)
  if (req.method === "OPTIONS") {
    return corsResponse({}, 204);
  }

  try {
    if (req.method !== "POST") {
      return corsResponse({ error: "Method not allowed" }, 405);
    }

    const body: CreateLISUserBody = await req.json();

    const {
      firstName,
      lastName,
      email,
      password,
      dateOfBirth,
      status,
      course,
      faculty,
      coursePrefix,
    } = body;

    // 2️⃣ Supabase Service Role client
    const supabase: SupabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 3️⃣ Create Auth user
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError || !authUser?.user) {
      return corsResponse({ error: authError?.message || "Failed to create user" }, 400);
    }

    const userId = authUser.user.id;

    // 4️⃣ Generate unique student ID
    const year = new Date().getFullYear().toString().slice(-2);
    const pattern = `LIS-${coursePrefix}${year}%`;

    const { data: lastIdRow } = await supabase
      .from("users")
      .select("id_number")
      .ilike("id_number", pattern)
      .order("id_number", { ascending: false })
      .limit(1);

    let nextNum = 1;
    if (lastIdRow?.[0]?.id_number) {
      const lastId = lastIdRow[0].id_number;
      const lastNum = parseInt(lastId.split("-").pop() || "0");
      nextNum = lastNum + 1;
    }

    const id_number = `LIS-${coursePrefix}${year}-${String(nextNum).padStart(3, "0")}`;

    // 5️⃣ Insert into users table
    const { error: insertError } = await supabase.from("users").insert({
      id: userId,
      id_number,
      first_name: firstName,
      last_name: lastName,
      email,
      date_of_birth: dateOfBirth,
      status,
      course,
      faculty,
      role: "student",
    });

    if (insertError) return corsResponse({ error: insertError.message }, 400);

    // 6️⃣ Success response
    return corsResponse({
      success: true,
      id: userId,
      id_number,
    });
  } catch (error: any) {
    console.error("Edge Function Error:", error);
    return corsResponse({ error: error.message || "Internal Server Error" }, 500);
  }
});

// ----------------- Helper: CORS Response -----------------
function corsResponse(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Access-Control-Allow-Origin": "*", // adjust for production domains
      "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Content-Type": "application/json",
    },
  });
}




// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
// import "jsr:@supabase/functions-js/edge-runtime.d.ts"

// console.log("Hello from Functions!")

// Deno.serve(async (req) => {
//   const { name } = await req.json()
//   const data = {
//     message: `Hello ${name}!`,
//   }

//   return new Response(
//     JSON.stringify(data),
//     { headers: { "Content-Type": "application/json" } },
//   )
// })

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/create-lis-user' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
