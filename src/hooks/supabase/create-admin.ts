import { serve } from "https://deno.land/std/http/server.ts"; // correct here
import { createClient } from "@supabase/supabase-js";

serve(async (req) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { first_name, last_name, email, password } = await req.json();

  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: "admin" }
  });

  if (authError) return new Response(JSON.stringify({ error: authError.message }), { status: 400 });

  const { error: profileError } = await supabase
    .from("profiles")
    .insert({
      id: authUser.user.id,
      role: "admin",
      email,
      first_name,
      last_name
    });

  if (profileError) return new Response(JSON.stringify({ error: profileError.message }), { status: 400 });

  return new Response(JSON.stringify({ message: "Admin created successfully" }));
});


// import { supabase } from "./supabaseClient";

// const { data: adminUser } = await supabase.auth.admin.createUser({
//   email: "admin@example.com",
//   password: "SuperSecure123!",
//   email_confirm: true,
//   user_metadata: { role: "admin" },
// });

// await supabase.from("profiles").insert({
//   id: adminUser.user.id,
//   role: "admin",
//   email: "admin@example.com",
//   first_name: "Admin",
//   last_name: "User",
// });
