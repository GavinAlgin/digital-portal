import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import StudentCard from "../components/StudentCard";
import type { User } from "../hooks/types";
import { useAuth } from "../hooks/context/AuthContext";
import { supabase } from "../hooks/supabase/supabaseClient";
import moodlelogo from "../assets/moodlelogo.jpeg";
import { Loader2 } from "lucide-react";
import Courses from "./users/components/Courses";

export default function Index() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudent = async () => {
      // Get the Supabase Auth session
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      // Fetch user profile from `users` table
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error || !data) {
        console.error("User fetch error:", error);
        logout();
        navigate("/login");
        return;
      }

      // Map DB structure into your User interface
      const convertedUser: User = {
        id: data.id,
        fullName: `${data.first_name} ${data.last_name}`,
        studentNumber: data.id_number,
        course: data.course,
        faculty: data.faculty,
        campus: data.campus || "Main Campus",
      };

      setUserData(convertedUser);
      setLoading(false);
    };

    loadStudent();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-semibold">
        <Loader2 className="h-10 w-10 animate-spin text-gray-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />

      <main className="px-4 sm:px-6 md:px-8 flex-1 pb-24">
        <div className="p-4">
          {/* REAL Supabase User Data */}
          <StudentCard user={userData!} />

          <div className="p-4 bg-gray-200 rounded-lg mt-6 flex items-center gap-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10 text-gray-700">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
              />
            </svg>

            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Student card expiration date
              </h3>
              <p className="text-sm text-gray-600">
                01-01-2026 | 01-01-2028
              </p>
            </div>
          </div>

          <Link to="/user/accommodation" className="flex justify-center align-middle text-blue-600 underline mt-4">Accommodation Request</Link>

          <div className="mt-6">
            <Courses />
          </div>

        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-gray-100 p-4 backdrop-blur-md">
        <button
          onClick={handleLogout}
          className="
            w-full bg-red-500 text-white font-semibold 
            py-3 rounded-xl text-center 
            active:bg-red-600 transition">
          Log Out
        </button>

        <Link to="https://listec.moodlecloud.com/login/index.php" 
          className="w-full py-3 rounded-xl flex justify-center items-center gap-2 transition"
          style={{ backgroundColor: "#FFFFFF20", color: "black" }}>
          <img src={moodlelogo} className="h-5 rounded-md" />
          Continue To Moodle
        </Link>
      </div>
    </div>
  );
}

