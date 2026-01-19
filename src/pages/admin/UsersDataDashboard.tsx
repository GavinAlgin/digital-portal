import { useEffect, useState } from "react";
import ListecLogo from "../../assets/cropped-flyer-02102024-133x133.png";
import Header from "./components/Header";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, type User } from "../../hooks/context/AdminLogged";
import { supabase } from "../../hooks/supabase/supabaseClient";
import UserTable from "./components/DataTable";
import { Download, Loader2, LucidePlus } from "lucide-react";
import { fetchStudents } from "../../hooks/supabase/supabaseActions";
import { exportToCSV, exportToExcel } from "../../hooks/util/exportUsers";

export interface AppUser {
  id: string
  role: "student" | "staff"

  idNumber: string
  firstName: string
  lastName: string
  email: string

  course?: string
  faculty?: string
  createdAt: string
}

export default function UserDashboard() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<AppUser[]>([]);
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10
  const total = users.length

  // FETCH LOGGED-IN USER
  useEffect(() => {
    const fetchUser = async () => {
      const loggedUser = await getCurrentUser();
      setUser(loggedUser);
    };
    fetchUser();
  }, []);

  // FETCH USERS FROM SUPABASE
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const { data, error } = await supabase
      .from("users")
      .select(`
        id,
        id_number,
        first_name,
        last_name,
        email,
        course,
        faculty,
        role,
        created_at
      `)
      .in("role", ["student", "staff"]);

      if (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
        return;
      }

      const formatted = data.map((u) => ({
        id: u.id,
        role: u.role,
        idNumber: u.id_number,
        firstName: u.first_name,
        lastName: u.last_name,
        email: u.email,
        course: u.course ?? "",
        faculty: u.faculty ?? "",
        createdAt: u.created_at,
      }));

      setUsers(formatted);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  if (!user) return       <div className="flex items-center justify-center h-screen text-lg font-semibold">
        <Loader2 className="h-10 w-10 animate-spin text-gray-600" />
      </div>;

  return (
    <>
      {/* HEADER */}
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
        userName={user.first_name ?? user.email ?? "User"}
        userProfileUrl={`https://avatar.iran.liara.run/username?username=${user.first_name}+${user.last_name}`}
      />

      {/* BODY */}
      <main id="page-content" className="flex max-w-full flex-auto flex-col pt-24">
        <div className="container mx-auto p-4 lg:p-8 xl:max-w-7xl">

          {/* Page Header */}
          <div className="flex justify-between items-center mb-6">
            {/* LEFT: Title */}
            <div>
              <h1 className="text-2xl font-bold">Manage Users</h1>
              <p className="text-neutral-500 text-sm">
                View and manage all students and staff.
              </p>
            </div>

            {/* RIGHT: Actions */}
            <div className="flex items-center gap-3">
              {/* Export Buttons */}
              <button
                onClick={() => exportToCSV(users)}
                className="flex items-center gap-2 rounded-lg border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-100"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </button>

              <button
                onClick={() => exportToExcel(users)}
                className="flex items-center gap-2 rounded-lg border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-100"
              >
                <Download className="h-4 w-4" />
                Export Excel
              </button>

              {/* Enrol Button */}
              <button
                onClick={() => navigate("/admin/register")}
                className="flex items-center gap-2 rounded-lg bg-neutral-800 px-4 py-2 font-semibold text-white hover:bg-neutral-700"
              >
                <LucidePlus className="h-4 w-4" />
                Enrol Student
              </button>
            </div>
          </div>


          {/* Loading Spinner */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-neutral-800"></div>
            </div>
          ) : (
            <div className="rounded-lg border border-neutral-200 bg-white shadow-sm">
              <UserTable
                data={users}
                loading={loading}
                page={page}
                pageSize={pageSize}
                total={total}
                onPageChange={setPage}
                refreshData={() => fetchStudents()}
              />
            </div>
          )}
        </div>
      </main>
    </>
  );
}
