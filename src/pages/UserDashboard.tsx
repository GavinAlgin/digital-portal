import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ActiveClasses from "../components/ListAction";
import StudentCard from "../components/StudentCard";
import type { User } from "../hooks/types";
import { useAuth } from "../hooks/context/AuthContext";
import moodlelogo from "../assets/moodlelogo.jpeg";

const loggedInUser: User = {
  id: "1",
  fullName: "Gavin Algin",
  studentNumber: "S1234567",
  course: "Computer Science",
  campus: "Polokwane Campus",
};

export default function Index() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />

      <main className="px-4 sm:px-6 md:px-8 flex-1 pb-24">
        <div className="p-4">
          <StudentCard user={loggedInUser} />
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
          style={{ backgroundColor: "#FFFFFF20", color: "white" }}>
          <img src={moodlelogo} className="h-5 rounded-md" />
          Continue To Moodle
        </button>
      </div>
    </div>
  );
}
