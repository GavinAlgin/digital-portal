import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import Header from "./components/Header";
import ListecLogo from "../../assets/cropped-flyer-02102024-133x133.png";
import { getCurrentUser, type User } from "../../hooks/context/AdminLogged";

/* ---------------------------------- Types --------------------------------- */

type TicketStatus =
  | "New"
  | "Awaiting Response"
  | "Under Investigation"
  | "Closed";

type Ticket = {
  id: string;
  date: string;
  user: string;
  title: string;
  status: TicketStatus;
};

/* ----------------------------- Status Colors ------------------------------- */

const statusColors: Record<TicketStatus, string> = {
  New: "bg-purple-100 text-purple-800",
  "Awaiting Response": "bg-blue-100 text-blue-800",
  "Under Investigation": "bg-orange-100 text-orange-800",
  Closed: "bg-emerald-100 text-emerald-800",
};

/* ------------------------------- Component -------------------------------- */

export default function TicketsPage() {
  const navigate = useNavigate();

  /* ------------------------------- State ---------------------------------- */

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: "RN#4585",
      date: "2025-11-15 09:30",
      user: "Gavin Algin",
      title: "Unable to Access digital card",
      status: "New",
    },
    {
      id: "RN#4584",
      date: "2025-11-10 14:15",
      user: "Jordan Smith",
      title: "Email Campaign Software Crashing Frequently",
      status: "Awaiting Response",
    },
    {
      id: "RN#4583",
      date: "2025-11-05 17:45",
      user: "Samantha Davis",
      title: "Issues Syncing Calendar Across Devices",
      status: "Awaiting Response",
    },
    {
      id: "RN#4582",
      date: "2025-10-30 08:00",
      user: "Mindy O'Connell",
      title: "Graphics Tablet Not Responding in Design Software",
      status: "New",
    },
  ]);

  /* ---------------------------- Auth Handling ------------------------------ */

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
      } catch (err) {
        console.error("Failed to fetch current user:", err);
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

  /* ------------------------------ Rendering -------------------------------- */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-gray-600" />
      </div>
    );
  }

  if (!user) return null;

  /* ------------------------------ Helpers ---------------------------------- */

  const filteredTickets = tickets.filter((t) =>
    [t.id, t.user, t.title].some((field) =>
      field.toLowerCase().includes(search.toLowerCase())
    )
  );

  const handleDelete = (id: string) => {
    setTickets((prev) => prev.filter((t) => t.id !== id));
  };

  const handleView = (ticket: Ticket) => {
    alert("Viewing ticket:\n" + JSON.stringify(ticket, null, 2));
  };

  const handleEdit = (ticket: Ticket) => {
    alert("Editing ticket:\n" + JSON.stringify(ticket, null, 2));
  };

  /* -------------------------------- JSX ----------------------------------- */

  return (
    <main id="page-content" className="flex max-w-full flex-auto flex-col">
      {/* Header */}
      <div className="container mx-auto px-4 pt-6 lg:px-8 lg:pt-8 xl:max-w-7xl">
        <Header
          logo={ListecLogo}
          logoText="LISTEC"
          navItems={[
            { label: "Dashboard", href: "/admin" },
            { label: "Tickets", href: "/admin/tickets" },
            { label: "Attendance", href: "/admin/attendance" },
            { label: "Reports", href: "#" },
            { label: "Users", href: "/admin/users" },
          ]}
          notificationsCount={3}
          userName={`${user.first_name} ${user.last_name}`}
          userProfileUrl={`https://avatar.iran.liara.run/username?username=${user.first_name}+${user.last_name}`}
        />

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold">Tickets</h1>
            <p className="text-sm text-neutral-500">
              View, manage and respond to all support tickets.
            </p>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Search tickets..."
            className="w-full sm:w-72 rounded-lg border border-neutral-200 py-2 px-3 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/25"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="container mx-auto p-4 lg:p-8 xl:max-w-7xl">
        <div className="rounded-lg border border-neutral-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="border-b">
              <tr>
                <th className="px-3 py-2 text-left">ID</th>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-left">User</th>
                <th className="px-3 py-2 text-left">Title</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="border-b hover:bg-neutral-50">
                  <td className="p-3 font-semibold">{ticket.id}</td>
                  <td className="p-3">{ticket.date}</td>
                  <td className="p-3">{ticket.user}</td>
                  <td className="p-3">{ticket.title}</td>
                  <td className="p-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${statusColors[ticket.status]}`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => handleView(ticket)}
                      className="px-3 py-1 border rounded hover:bg-neutral-100"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(ticket)}
                      className="px-3 py-1 border rounded hover:bg-neutral-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ticket.id)}
                      className="px-3 py-1 border rounded text-red-500 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredTickets.length === 0 && (
            <div className="p-6 text-center text-neutral-500">
              No tickets found.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}


//!Yp6v3ASe! - 003
//hCPLJQASJM - 002