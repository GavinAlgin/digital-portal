import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../../hooks/supabase/supabaseClient";

const formContainer =
  "max-w-[400px] bg-white p-8 text-[14px] text-[#212121] flex flex-col gap-5 rounded-[10px] shadow-md";

const formGroup = "flex flex-col gap-1";
const inputStyles =
  "w-full p-3 rounded-md border border-[#ccc] focus:outline-none focus:border-blue-600 placeholder:opacity-50";
const submitBtn =
  "flex justify-center items-center text-white bg-[#212121] py-3 rounded-md cursor-pointer hover:bg-[#313131] shadow-md";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error: updateErr } = await supabase.auth.updateUser({
      password,
    });

    if (updateErr) {
      setError(updateErr.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className={formContainer}>
        <div className="text-center font-semibold text-[18px]">
          Reset Password
        </div>

        <form className="flex flex-col" onSubmit={handleReset}>
          <div className={formGroup}>
            <label>Email</label>
            <input disabled value={email} className={inputStyles} />
          </div>

          <div className={formGroup}>
            <label>New Password</label>
            <input
              type="password"
              className={inputStyles}
              placeholder="Enter new password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className={formGroup}>
            <label>Confirm Password</label>
            <input
              type="password"
              className={inputStyles}
              placeholder="Confirm your password"
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

          <button className={submitBtn} type="submit" disabled={loading}>
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
