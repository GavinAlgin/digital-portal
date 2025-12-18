import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { supabase } from "../../hooks/supabase/supabaseClient";
import { passwordSchema } from "./profileSchema";
import { Link } from "react-router-dom";

type UserProfile = {
  first_name: string;
  last_name: string;
  email: string;
};

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        toast.error("Failed to fetch user");
        return;
      }

      setUser({
        first_name: user.user_metadata?.first_name ?? "",
        last_name: user.user_metadata?.last_name ?? "",
        email: user.email ?? "",
      });
    };

    fetchUser();
  }, []);

  const handlePasswordChange = async () => {
    const validation = passwordSchema.safeParse({
      password,
      confirmPassword,
    });

    if (!validation.success) {
      toast.error(validation.error.issues[0].message);
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated successfully");
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 px-4 py-6 max-w-md mx-auto w-full">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Link className="p-1" to="/user">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">
            Profile
          </h1>
        </div>

        <div className="space-y-4">
          <input
            disabled
            placeholder={user?.first_name || "Name"}
            className="w-full rounded-xl border px-4 py-3 bg-gray-100 text-gray-700"
          />

          <input
            disabled
            placeholder={user?.last_name || "Surname"}
            className="w-full rounded-xl border px-4 py-3 bg-gray-100 text-gray-700"
          />

          <input
            disabled
            placeholder={user?.email || "Email"}
            className="w-full rounded-xl border px-4 py-3 bg-gray-100 text-gray-700"
          />

          <div className="pt-6">
            <h2 className="text-lg font-medium mb-3">Change Password</h2>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              className="w-full rounded-xl border px-4 py-3 mb-3"
            />

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>
        </div>
      </div>

      {/* Sticky submit button */}
      <div className="sticky bottom-0 bg-white border-t p-4">
        <button
          onClick={handlePasswordChange}
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-xl font-medium disabled:opacity-50">
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
