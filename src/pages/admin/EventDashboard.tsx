import { useState } from "react";
import Header from "./components/Header";
import ListecLogo from '../../assets/cropped-flyer-02102024-133x133.png';

export default function TicketsPage() {
  const [search, setSearch] = useState("");

  const [tickets, setTickets] = useState([
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

  const statusColors = {
    New: "bg-purple-100 text-purple-800",
    "Awaiting Response": "bg-blue-100 text-blue-800",
    "Under Investigation": "bg-orange-100 text-orange-800",
    Closed: "bg-emerald-100 text-emerald-800",
  };

  const filteredTickets = tickets.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.user.toLowerCase().includes(search.toLowerCase()) ||
    t.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    setTickets(tickets.filter((t) => t.id !== id));
  };

  const handleView = (ticket) => {
    alert("Viewing ticket:\n" + JSON.stringify(ticket, null, 2));
  };

  const handleEdit = (ticket) => {
    alert("Editing ticket:\n" + JSON.stringify(ticket, null, 2));
  };

  return (
    <main id="page-content" className="flex max-w-full flex-auto flex-col">
      {/* Header Section */}
      <div className="container mx-auto px-4 pt-6 lg:px-8 lg:pt-8 xl:max-w-7xl">
        <div className="flex flex-col gap-2 text-center sm:flex-row sm:items-center sm:justify-between sm:text-start">
            <Header
                logo={ListecLogo}
                logoText="LISTEC"
                navItems={[
                { label: "Dashboard", href: "/admin" },
                { label: "Tickets", href: "/admin/tickets" },
                { label: "Reports", href: "#" },
                { label: "Users", href: "/admin/users" },
                ]}
                notificationsCount={3}
                userName="Gavin Algin"
                userProfileUrl={`https://avatar.iran.liara.run/username?username=${user.first_name}+${user.last_name}`}
            />
          <div className="grow">
            <h1 className="mb-1 text-xl font-bold">Tickets</h1>
            <h2 className="text-sm font-medium text-neutral-500">
              View, manage and respond to all support tickets.
            </h2>
          </div>

          {/* Search */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 start-0 my-px ms-px flex w-10 items-center justify-center rounded-l-lg text-neutral-500">
              <svg
                className="hi-mini hi-magnifying-glass inline-block size-5"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <input
              type="text"
              placeholder="Search tickets.."
              className="block w-full rounded-lg border border-neutral-200 py-2 ps-10 pe-3 leading-6 focus:border-neutral-500 focus:ring-3 focus:ring-neutral-500/25"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="container mx-auto p-4 lg:p-8 xl:max-w-7xl">
        <div className="rounded-lg border border-neutral-200 bg-white">
          <div className="border-b border-neutral-100 p-5">
            <h2 className="text-lg font-semibold">Recent Tickets</h2>
            <p className="text-sm text-neutral-500">
              View or manage incoming support requests.
            </p>
          </div>

          <div className="p-5">
            <div className="min-w-full overflow-x-auto rounded-sm">
              <table className="min-w-full align-middle text-sm">
                <thead>
                  <tr className="border-b-2 border-neutral-100">
                    <th className="px-3 py-2 text-start font-semibold uppercase text-neutral-700">
                      ID
                    </th>
                    <th className="px-3 py-2 text-start font-semibold uppercase text-neutral-700">
                      Date
                    </th>
                    <th className="px-3 py-2 text-start font-semibold uppercase text-neutral-700">
                      User
                    </th>
                    <th className="px-3 py-2 text-start font-semibold uppercase text-neutral-700">
                      Title
                    </th>
                    <th className="px-3 py-2 text-start font-semibold uppercase text-neutral-700">
                      Status
                    </th>
                    <th className="px-3 py-2 text-end font-semibold uppercase text-neutral-700">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className="border-b border-neutral-100 hover:bg-neutral-50"
                    >
                      <td className="p-3 font-semibold text-neutral-600">
                        {ticket.id}
                      </td>

                      <td className="p-3 text-neutral-600">{ticket.date}</td>

                      <td className="p-3 font-medium text-neutral-600">
                        {ticket.user}
                      </td>

                      <td className="p-3">{ticket.title}</td>

                      <td className="p-3">
                        <div
                          className={`inline-block rounded-full px-2 py-1 text-xs font-semibold whitespace-nowrap ${statusColors[ticket.status]
                            }`}
                        >
                          {ticket.status}
                        </div>
                      </td>

                      <td className="p-3 text-end flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleView(ticket)}
                          className="px-3 py-1 text-sm border rounded-lg hover:bg-neutral-100"
                        >
                          View
                        </button>

                        <button
                          onClick={() => handleEdit(ticket)}
                          className="px-3 py-1 text-sm border rounded-lg hover:bg-neutral-100"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(ticket.id)}
                          className="px-3 py-1 text-sm border rounded-lg text-red-500 hover:bg-red-50"
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
        </div>
      </div>
    </main>
  );
}
