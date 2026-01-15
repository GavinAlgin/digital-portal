import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import ListecLogo from "../../assets/cropped-flyer-02102024-133x133.png";
import Header from "./components/Header";
import { getCurrentUser, type User } from "../../hooks/context/AdminLogged";
import TopBar from "../../components/calendar/CalendarHeader";
import Calendar from "../../components/calendar/Calendar";
import { DataTable } from "../../components/Datatable";


const TimeTableDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState("Calendar");

  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let isMounted = true; // prevents state update on unmounted component

    const fetchUser = async () => {
      try {
        const loggedUser = await getCurrentUser();

        if (!loggedUser) {
          navigate("/admin/login", { replace: true });
          return;
        }

        if (isMounted) {
          setUser(loggedUser);
        }
      } catch (error) {
        console.error("Failed to fetch current user:", error);
        navigate("/admin/login", { replace: true });
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  // 🔄 Loading Spinner (Centered)
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-gray-600" />
      </div>
    );
  }

  // 🛑 Safety fallback (should never hit due to redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header
        logo={ListecLogo}
        logoText="LISTEC"
        navItems={[
          { label: "Dashboard", href: "/admin" },
          { label: "Tickets", href: "/admin/tickets" },
          { label: "Attendance", href: "/admin/attendance" },
          { label: "Reports", href: "/admin/reports" },
          { label: "Users", href: "/admin/users" },
        ]}
        notificationsCount={3}
        userName={user.first_name || user.email || "User"}
        userProfileUrl={`https://avatar.iran.liara.run/username?username=${encodeURIComponent(
          `${user.first_name ?? ""} ${user.last_name ?? ""}`
        )}`}
      />

      <main id="page-content" className="flex max-w-full flex-auto flex-col pt-24">
        <div className="container mx-auto p-4 lg:p-8 xl:max-w-7xl">
          <div className="mb-6">
            <TopBar onViewChange={setView} />
          </div>

          <main className="p-6">
            {view === "Calendar" && <Calendar />}
            {view === "Table" && <DataTable data={[]} page={0} 
            pageSize={0} total={0} 
            onPageChange={function (page: number): void {
              throw new Error("Function not implemented.");
            } } />}
          </main>
        </div>
      </main>
    </div>
  );
};

export default TimeTableDashboard;
