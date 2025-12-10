import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ActiveClasses from "../components/ListAction";
import StudentCard from "../components/StudentCard";
import type { User } from "../hooks/types";
import { useAuth } from "../hooks/context/AuthContext";
import { supabase } from "../hooks/supabase/supabaseClient";
import moodlelogo from "../assets/moodlelogo.jpeg";

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
        Loading your student profile...
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

          <ActiveClasses />
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

        <button
          className="w-full py-3 rounded-xl flex justify-center items-center gap-2 transition"
          style={{ backgroundColor: "#FFFFFF20", color: "black" }}>
          <img src={moodlelogo} className="h-5 rounded-md" />
          Continue To Moodle
        </button>
      </div>
    </div>
  );
}


// import React from "react";
// import { useNavigate } from "react-router-dom";
// import Header from "../components/Header";
// import ActiveClasses from "../components/ListAction";
// import StudentCard from "../components/StudentCard";
// import type { User } from "../hooks/types";
// import { useAuth } from "../hooks/context/AuthContext";
// import moodlelogo from "../assets/moodlelogo.jpeg";

// const loggedInUser: User = {
//   id: "1",
//   fullName: "Gavin Algin",
//   studentNumber: "S1234567",
//   course: "Computer Science",
//   campus: "Polokwane Campus",
// };

// export default function Index() {
//   const { logout } = useAuth();
//   const navigate = useNavigate();
  
//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col">
//       <Header />

//       <main className="px-4 sm:px-6 md:px-8 flex-1 pb-24">
//         <div className="p-4">
//           <StudentCard user={loggedInUser} />
//           <ActiveClasses />
//         </div>
//       </main>

//       <div className="fixed bottom-0 left-0 right-0 bg-gray-100 p-4 backdrop-blur-md">
//         <button
//           onClick={handleLogout}
//           className="
//             w-full bg-red-500 text-white font-semibold 
//             py-3 rounded-xl text-center 
//             active:bg-red-600 transition">
//           Log Out
//         </button>
//         <button
//           className="w-full py-3 rounded-xl flex justify-center items-center gap-2 transition"
//           style={{ backgroundColor: "#FFFFFF20", color: "white" }}>
//           <img src={moodlelogo} className="h-5 rounded-md" />
//           Continue To Moodle
//         </button>
//       </div>
//     </div>
//   );
// }
