// accountActions.ts
import { supabase } from "../supabase/supabaseClient";
import { withAdminAuth } from "./AdminLogged";

// Delete a user (admin only)
export const deleteUser = async (userId: string) => {
  return withAdminAuth(async () => {
    const { error } = await supabase.from("profiles").delete().eq("id", userId);
    if (error) throw new Error(error.message);
    return `User ${userId} deleted successfully.`;
  });
};
