import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ─────────────────────────────────────────────
// CORS
// ─────────────────────────────────────────────
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// ─────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────
function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

// ─────────────────────────────────────────────
// Function
// ─────────────────────────────────────────────
serve(async (req) => {
  // Preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    // ─────────────────────────────────────────
    // Extract JWT
    // ─────────────────────────────────────────
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return jsonResponse({ error: "Missing Authorization header" }, 401);
    }

    const token = authHeader.replace("Bearer ", "");

    // ─────────────────────────────────────────
    // Verify caller (ANON KEY)
    // ─────────────────────────────────────────
    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    const { data: userData, error: userError } =
      await supabaseAuth.auth.getUser();

    if (userError || !userData.user) {
      return jsonResponse({ error: "Invalid or expired token" }, 401);
    }

    // ─────────────────────────────────────────
    // Authorize admin role (RLS enforced)
    // ─────────────────────────────────────────
    const { data: profile, error: roleError } = await supabaseAuth
      .from("users")
      .select("role")
      .eq("id", userData.user.id)
      .single();

    if (roleError || profile?.role !== "admin") {
      return jsonResponse({ error: "Forbidden: admins only" }, 403);
    }

    // ─────────────────────────────────────────
    // Parse body
    // ─────────────────────────────────────────
    const {
      firstName,
      lastName,
      email,
      password,
      course,
      faculty,
      role = "student",
    } = await req.json();

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !course ||
      !faculty
    ) {
      return jsonResponse({ error: "Missing required fields" }, 400);
    }

    // ─────────────────────────────────────────
    // Admin client (SERVICE ROLE)
    // ─────────────────────────────────────────
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // ─────────────────────────────────────────
    // Create auth user
    // ─────────────────────────────────────────
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError || !authData.user) {
      return jsonResponse({ error: authError?.message }, 400);
    }

    const userId = authData.user.id;

    // ─────────────────────────────────────────
    // Generate LIS ID
    // ─────────────────────────────────────────
    const year = new Date().getFullYear().toString().slice(-2);
    const coursePrefix = course.replace(/\s+/g, "").toUpperCase().slice(0, 3);
    const facultyPrefix = faculty.replace(/\s+/g, "").toUpperCase().slice(0, 3);
    const pattern = `LIS-${year}${coursePrefix}${facultyPrefix}-%`;

    const { data: lastRow } = await supabaseAdmin
      .from("users")
      .select("id_number")
      .ilike("id_number", pattern)
      .order("id_number", { ascending: false })
      .limit(1);

    const nextSeq =
      lastRow?.[0]?.id_number
        ? parseInt(lastRow[0].id_number.split("-").pop()!) + 1
        : 1;

    const idNumber = `LIS-${year}${coursePrefix}${facultyPrefix}-${String(
      nextSeq
    ).padStart(3, "0")}`;

    // ─────────────────────────────────────────
    // Insert profile
    // ─────────────────────────────────────────
    const { error: insertError } = await supabaseAdmin.from("users").insert({
      id: userId,
      id_number: idNumber,
      email,
      first_name: firstName,
      last_name: lastName,
      course,
      faculty,
      role,
    });

    if (insertError) {
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return jsonResponse({ error: insertError.message }, 400);
    }

    // ─────────────────────────────────────────
    // Success
    // ─────────────────────────────────────────
    return jsonResponse({
      success: true,
      user_id: userId,
      id_number: idNumber,
    });
  } catch (err) {
    console.error("Edge function error:", err);
    return jsonResponse({ error: "Internal server error" }, 500);
  }
});





// supabase/functions/create-lis-user/index.ts
// import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
// import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// serve(async (req: Request) => {
//   // Handle preflight CORS
//   if (req.method === "OPTIONS") {
//     return corsResponse("ok");
//   }

//   try {
//     const body = await req.json();
//     const { firstName, lastName, email, password, dateOfBirth, course, faculty } = body;

//     // ✅ Validate required fields
//     if (!firstName || !lastName || !email || !password || !course || !faculty || !dateOfBirth) {
//       return corsResponse({ error: "Missing required fields" }, 400);
//     }

//     const supabase = createClient(
//       Deno.env.get("SUPABASE_URL")!,
//       Deno.env.get("SERVICE_ROLE_KEY")!
//     );

//     // -------------------- 1️⃣ Create Auth user --------------------
//     const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
//       email,
//       password,
//       email_confirm: true,
//     });

//     if (authError) return corsResponse({ error: authError.message }, 400);
//     const userId = authUser.user.id;

//     console.log(`Auth user created with ID: ${userId}`);

//     // -------------------- 2️⃣ Generate student ID --------------------
//     const year = new Date().getFullYear().toString().slice(-2);
//     const coursePrefix = course.replace(/\s+/g, "").toUpperCase().slice(0, 3); 
//     const facultyPrefix = faculty.replace(/\s+/g, "").toUpperCase().slice(0, 3);

//     const pattern = `LIS-${year}${coursePrefix}${facultyPrefix}-%`;

//     // Fetch last inserted student to increment sequence
//     const { data: lastRow, error: fetchError } = await supabase
//       .from("users")
//       .select("id_number")
//       .ilike("id_number", pattern)
//       .order("id_number", { ascending: false })
//       .limit(1);

//     if (fetchError) console.warn("Error fetching last student ID:", fetchError.message);

//     let nextSeq = 1;
//     if (lastRow?.[0]?.id_number) {
//       const lastNumStr = lastRow[0].id_number.split("-").pop()!;
//       const lastNum = parseInt(lastNumStr, 10);
//       nextSeq = lastNum + 1;
//     }

//     const idNumber = `LIS-${year}${coursePrefix}${facultyPrefix}-${String(nextSeq).padStart(3, "0")}`;
//     console.log(`Generated student ID: ${idNumber}`);

//     // -------------------- 3️⃣ Insert user record --------------------
//     const { error: insertError } = await supabase.from("users").insert({
//       id: userId,
//       id_number: idNumber,
//       first_name: firstName,
//       last_name: lastName,
//       email,
//       date_of_birth: dateOfBirth,
//       course,
//       faculty,
//       role: "student",
//     });

//     if (insertError) return corsResponse({ error: insertError.message }, 400);

//     console.log(`Student inserted into users table: ${userId}`);

//     return corsResponse({ success: true, id: userId, id_number: idNumber });

//   } catch (error: any) {
//     console.error("Function error:", error.message);
//     return corsResponse({ error: error.message }, 500);
//   }
// });

// // -------------------- CORS helper --------------------
// function corsResponse(body: any, status = 200) {
//   return new Response(JSON.stringify(body), {
//     status,
//     headers: {
//       "Access-Control-Allow-Origin": "*",
//       "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
//       "Access-Control-Allow-Methods": "POST, OPTIONS",
//       "Content-Type": "application/json",
//     },
//   });
// }
// supabase/functions/create-lis-user/index.ts
// import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
// import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// const corsHeaders = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Headers":
//     "authorization, x-client-info, apikey, content-type",
//   "Access-Control-Allow-Methods": "POST, OPTIONS",
// };

// serve(async (req) => {
//   // check if admin is the user
//   const authHeader = req.headers.get("authorization");
//   if (!authHeader) {
//     return jsonResponse({ error: "Missing Authorization header" }, 401);
//   }

//   const token = authHeader.replace("Bearer ", "");

  
//   // ✅ Preflight
//   if (req.method === "OPTIONS") {
//     return new Response("ok", { headers: corsHeaders });
//   }

//   try {
//     const body = await req.json();
//     console.log("Received body:", body);

//     const {
//       firstName,
//       lastName,
//       email,
//       password,
//       course,
//       faculty,
//       role = "student",
//     } = body;

//     // ✅ Validation
//     if (!firstName || !lastName || !email || !password || !course || !faculty) {
//       return jsonResponse(
//         { error: "Missing required fields" },
//         400
//       );
//     }

//     // ✅ Service role client (ADMIN POWER)
//     const supabaseAdmin = createClient(
//       Deno.env.get("SUPABASE_URL")!,
//       Deno.env.get("SERVICE_ROLE_KEY")!
//     );

//     // ✅ Create auth user
//     const { data: authData, error: authError } =
//       await supabaseAdmin.auth.admin.createUser({
//         email,
//         password,
//         email_confirm: true,
//       });

//     if (authError) {
//       return jsonResponse({ error: authError.message }, 400);
//     }

//     const userId = authData.user.id;

//     // ✅ Generate student ID
//     const year = new Date().getFullYear().toString().slice(-2);
//     const coursePrefix = course.replace(/\s+/g, "").toUpperCase().slice(0, 3);
//     const facultyPrefix = faculty.replace(/\s+/g, "").toUpperCase().slice(0, 3);

//     const pattern = `LIS-${year}${coursePrefix}${facultyPrefix}-%`;

//     const { data: lastRow } = await supabaseAdmin
//       .from("users")
//       .select("id_number")
//       .ilike("id_number", pattern)
//       .order("id_number", { ascending: false })
//       .limit(1);

//     let nextSeq = 1;
//     if (lastRow?.[0]?.id_number) {
//       const lastNum = parseInt(lastRow[0].id_number.split("-").pop()!);
//       nextSeq = lastNum + 1;
//     }

//     const idNumber = `LIS-${year}${coursePrefix}${facultyPrefix}-${String(
//       nextSeq
//     ).padStart(3, "0")}`;

//     // ✅ Insert profile (NO email, NO DOB)
//     // const { error: insertError } = await supabaseAdmin.from("users").insert({
//     //   id: userId,
//     //   id_number: idNumber,
//     //   first_name: firstName,
//     //   last_name: lastName,
//     //   course,
//     //   faculty,
//     //   role,
//     // });

//     // ✅ Insert profile with email
//     const { error: insertError } = await supabaseAdmin.from("users").insert({
//       id: userId,
//       id_number: idNumber,
//       email,              
//       first_name: firstName,
//       last_name: lastName,
//       course,
//       faculty,
//       role,
//     });

//     if (insertError) {
//       return jsonResponse({ error: insertError.message }, 400);
//     }

//     return jsonResponse({
//       success: true,
//       user_id: userId,
//       id_number: idNumber,
//     });
//   } catch (err: any) {
//     console.error("Function crash:", err);
//     return jsonResponse({ error: "Internal server error" }, 500);
//   }
// });

// // ✅ ALWAYS returns CORS headers
// function jsonResponse(body: any, status = 200) {
//   return new Response(JSON.stringify(body), {
//     status,
//     headers: {
//       ...corsHeaders,
//       "Content-Type": "application/json",
//     },
//   });
// }







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
