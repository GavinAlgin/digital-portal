import Header from "../components/Header";
import ActiveClasses from "../components/ListAction";
import StudentCard from "../components/StudentCard";
import type { User } from "../hooks/types";

const loggedInUser: User = {
  id: "1",
  fullName: "Gavin Algin",
  studentNumber: "S1234567",
  course: "Computer Science",
  campus: "Polokwane Campus",
};

function index() {
  const handleLogout = () => {
    console.log("Logging out...");
    // your logout logic here
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />

      {/* Main content scrollable area */}
      <main className="px-4 sm:px-6 md:px-8 flex-1 pb-24">
        <div className="p-4">
          <StudentCard user={loggedInUser} />
          <ActiveClasses />
        </div>
      </main>

      {/* Bottom fixed logout button */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-100 p-4 backdrop-blur-md">
        <button
          onClick={handleLogout}
          className="
            w-full bg-red-500 text-white font-semibold 
            py-3 rounded-xl text-center 
            active:bg-red-600 transition">
          Log Out
        </button>
      </div>
    </div>
  );
}

export default index;
