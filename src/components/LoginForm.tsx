import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moodlelogo from "../assets/moodlelogo.jpeg";
import ListecLogo from "../assets/cropped-flyer-02102024-133x133.png";
import { useAuth } from "../hooks/context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();


  const notifyError = (msg: string) =>
    toast.error(msg, {
      position: "top-right",
      autoClose: 2500,
      theme: "colored",
    });

//   const notifySuccess = (msg: string) =>
//     toast.success(msg, {
//       position: "top-right",
//       theme: "colored",
//     });

  const handleLogin = () => {
    if (!email.includes("@")) return notifyError("Invalid email address.");
    if (password.length < 6)
      return notifyError("Password must be at least 6 characters.");

    if (email === "admin@example.com") {
      login("admin");
      navigate("/admin");
    } else {
      login("user");
      navigate("/user");
    }
  };


  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: "#1C244B" }}>
      <ToastContainer transition={Slide} newestOnTop={true} limit={3} />

      <div className="w-full max-w-sm space-y-6 p-8 rounded-2xl bg-transparent">
        <div className="flex justify-center">
          <img
            src={ListecLogo}
            alt="Logo"
            className="h-20 w-20 object-cover rounded-xl shadow-lg"
          />
        </div>

        <div className="text-center space-y-1">
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="text-sm" style={{ color: "#BFD1FF" }}>
            Login to continue to the Listec Team
          </p>
        </div>

        <div className="space-y-4">
          <input
            className="w-full text-white px-4 py-3 rounded-xl bg-[#1C244B90] 
                       border-2 border-[#BFD1FF80] outline-none 
                       focus:border-[#BFD1FF] transition"
            placeholder="Student Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full text-white px-4 py-3 rounded-xl bg-[#1C244B90] 
                       border-2 border-[#BFD1FF80] outline-none 
                       focus:border-[#BFD1FF] transition"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Link to="" className="text-sm text-[#BFD1FF] hover:underline text-right">
            Forgot Password?
          </Link>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition disabled:opacity-60"
          style={{
            backgroundColor: "#BFD1FF",
            color: "#1C244B",
          }}>
          {loading ? (
            <div className="w-5 h-5 border-4 border-[#1C244B] border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Login"
          )}
        </button>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1" style={{ backgroundColor: "#BFD1FF50" }} />
          <span className="text-sm text-white">or</span>
          <div className="h-px flex-1" style={{ backgroundColor: "#BFD1FF50" }} />
        </div>

        <button
          className="w-full py-3 rounded-xl flex justify-center items-center gap-2 transition"
          style={{ backgroundColor: "#FFFFFF20", color: "white" }}>
          <img src={moodlelogo} className="h-5 rounded-md" />
          Continue To Moodle
        </button>

        <p className="text-center text-sm" style={{ color: "#BFD1FF" }}>
          Trouble logging into your account?{" "}
          <Link to="/form" className="text-white underline">
            Request Support
          </Link>
        </p>
      </div>
    </div>
  );
}
