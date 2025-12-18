import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../hooks/supabase/supabaseClient";

const formContainer =
  "max-w-[400px] bg-white p-8 text-[14px] text-[#212121] flex flex-col gap-5 rounded-[10px] shadow-md";

const formGroup = "flex flex-col gap-1";
const inputStyles =
  "w-full p-3 rounded-md border border-[#ccc] focus:outline-none focus:border-blue-600 placeholder:opacity-50 mb-4";
const submitBtn =
  "flex justify-center items-center text-white bg-[#212121] py-3 rounded-md cursor-pointer hover:bg-[#313131] shadow-md";
const signupLink = "self-center font-medium";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }

    setLoading(true);

    // Check if email exists in custom "users" view (or client-accessible table)
    const { data, error: checkErr } = await supabase
      .from("users")
      .select("email")
      .eq("email", email)
      .single();

    if (checkErr || !data) {
      setError("No account found with this email.");
      setLoading(false);
      return;
    }

    setLoading(false);
    navigate(`/reset-password?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className={formContainer}>
        <div className="text-center font-semibold text-[18px]">
          Forgot Password
        </div>

        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className={formGroup}>
            <label htmlFor="email">Email</label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className={inputStyles}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

          <button className={submitBtn} type="submit" disabled={loading}>
            {loading ? "Checking..." : "Send Email"}
          </button>
        </form>

        <p className={signupLink}>
          Go back to login
          <a href="/" className="text-blue-600 hover:underline ml-1">
            Login Now
          </a>
        </p>
      </div>
    </div>
  );
}
