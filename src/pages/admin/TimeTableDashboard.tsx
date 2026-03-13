import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import ListecLogo from "../../assets/cropped-flyer-02102024-133x133.png";
import Header from "./components/Header";
import { getCurrentUser, type User } from "../../hooks/context/AdminLogged";
import Calendar from "../../components/calendar/Calendar";
import { DataTable } from "../../components/Datatable";

const TimeTableDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [view, setView] = useState<"Calendar" | "Table">("Calendar");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      try {
        const loggedUser = await getCurrentUser();
        if (!loggedUser) {
          navigate("/admin/login", { replace: true });
          return;
        }
        if (isMounted) setUser(loggedUser);
      } catch {
        navigate("/admin/login", { replace: true });
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUser();
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-gray-600" />
      </div>
    );
  }

  if (!user) return null;

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
          { label: "Finance", href: "/admin/finance" },
          { label: "Users", href: "/admin/users" },
        ]}
        notificationsCount={3}
        userName={user.first_name || user.email || "User"}
        userProfileUrl={`https://avatar.iran.liara.run/username?username=${encodeURIComponent(
          `${user.first_name ?? ""} ${user.last_name ?? ""}`
        )}`}
      />

      <main className="pt-24">
        <div className="container mx-auto p-6 xl:max-w-7xl">
          {/* Example view switch */}
          <div className="mb-4 flex gap-2">
            <button onClick={() => setView("Calendar")}>Calendar</button>
            <button onClick={() => setView("Table")}>Table</button>
          </div>

          {view === "Calendar" && <Calendar />}

          {view === "Table" && (
            <DataTable
              data={[]}
              page={page}
              pageSize={pageSize}
              total={0}
              onPageChange={(newPage) => setPage(newPage)}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default TimeTableDashboard;
