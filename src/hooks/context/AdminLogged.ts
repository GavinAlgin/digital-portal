import { supabase } from "../supabase/supabaseClient";


export interface User {
  id: string;
  email: string | null;
  name: string | null;
  username: string | null;
  role: string | null;
}

/**
 * Fetch the currently logged-in user and profile info
 */
export const getCurrentUser = async (): Promise<User | null> => {
  const { data: sessionData } = await supabase.auth.getSession();
  const currentUser = sessionData?.session?.user;

  if (!currentUser) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("username, name, role")
    .eq("id", currentUser.id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error.message);
    return {
      id: currentUser.id,
      email: currentUser.email ?? null,
      username: null,
      name: null,
      role: null,
    };
  }

  return {
    id: currentUser.id,
    email: currentUser.email ?? null,
    username: profile.username ?? null,
    name: profile.name ?? null,
    role: profile.role ?? null,
  };
};

/**
 * Wrap any admin action and ensure the user is an authenticated admin
 */
export const withAdminAuth = async <T>(action: () => Promise<T>): Promise<T> => {
  const user = await getCurrentUser();

  if (!user) throw new Error("User not logged in.");
  if (user.role !== "admin") throw new Error("Access denied. Admins only.");

  return await action();
};
