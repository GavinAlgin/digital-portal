import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import ListecLogo from "../../assets/cropped-flyer-02102024-133x133.png";
import { getCurrentUser, type User } from "../../hooks/context/AdminLogged";
import TicketCard from "./components/TicketCard";
import DataTable, { type TableColumn, type TableRow } from "./components/DataTable";
import { supabase } from "../../hooks/supabase/supabaseClient";

interface ContactMessage {
  id: string;
  email: string;
  subject: string;
  message: string | null;
  created_at: string;
}

const AdminDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const loggedUser = await getCurrentUser();
      setUser(loggedUser);
      setUserLoading(false);
    };

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) console.error("Error fetching messages:", error);
      else setMessages(data || []);

      setLoading(false);
    };

    fetchUser();
    fetchMessages();
  }, []);

  if (userLoading || !user) return <p className="p-8">Loading...</p>;

  const rows: TableRow[] = messages.map((m) => ({
    id: m.id,
    date: new Date(m.created_at).toLocaleDateString(),
    user: m.email,
    title: m.subject,
    status: "received",
    statusColor: "bg-blue-100 text-blue-800",
  }));

  const columns: TableColumn[] = [
    { key: "id", label: "ID" },
    { key: "date", label: "Date" },
    { key: "user", label: "Email" },
    { key: "title", label: "Subject" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions", className: "text-end" },
  ];

  const handleView = (row: TableRow) => {
    console.log("Viewing message:", row);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        logo={ListecLogo}
        logoText="LISTEC"
        navItems={[
          { label: "Dashboard", href: "/admin" },
          { label: "Tickets", href: "/admin/tickets" },
          { label: "Attendance", href: "#" },
          { label: "Users", href: "/admin/users" },
        ]}
        notificationsCount={3}
        userName={user.first_name ?? user.email ?? "User"}
        userProfileUrl={`https://avatar.iran.liara.run/username?username=${user.first_name}+${user.last_name}`}
      />

      <main className="container mt-18 mx-auto p-4 lg:p-8 xl:max-w-7xl">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <p className="text-sm text-neutral-500">
            Welcome, you have <strong>{messages.length}</strong> new messages.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-2 lg:grid-cols-4">
          <TicketCard
            title="Total Messages"
            count={messages.length}
            description="Contact form submissions"
            percentage=""
          />
          <TicketCard
            title="Unread Messages"
            count={messages.length}
            description="No read tracking yet"
            percentage=""
          />
          <TicketCard title="Users" count={1} description="You" percentage="" />
          <TicketCard title="System Status" count={1} description="OK" percentage="" />
        </div>

        {/* Table */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Recent Contact Messages</h2>
          <DataTable columns={columns} rows={rows} loading={loading} onViewClick={handleView} />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
