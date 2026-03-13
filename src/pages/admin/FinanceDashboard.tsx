import { useEffect, useState } from "react";
import Header from "./components/Header";
import ListecLogo from "../../assets/cropped-flyer-02102024-133x133.png";
import { getCurrentUser, type User } from "../../hooks/context/AdminLogged";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

type Proposal = {
  id: number;
  name: string;
  address: string;
  range: string;
  sent: string;
  status: "Signed" | "Waiting for Signature";
};

const proposals: Proposal[] = [
  {
    id: 39582,
    name: "Scott Smith",
    address: "1125 S Dorothy Ln, Kent, WA",
    range: "$12,000 - 14,000",
    sent: "Jun 21, 2023",
    status: "Signed",
  },
  {
    id: 84729,
    name: "Miley Lind",
    address: "360 Bayberry Dr, Daly City, CA",
    range: "$9,000 - 11,000",
    sent: "Jun 21, 2023",
    status: "Waiting for Signature",
  },
];

export default function FinanceDashboard() {
  const [month, setMonth] = useState("This Month");
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex justify-between items-center">
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
            <div className="mt-12">
                <h1 className="text-2xl font-semibold">
                    Welcome back, Joshua!
                </h1>

                <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="bg-white border rounded-lg px-4 py-2 text-sm shadow-sm"
                >
                    <option>This Month</option>
                    <option>Last Month</option>
                    <option>This Year</option>
                </select>
          </div>
        </div>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="Total Volume" value="$110,100.00" change="+8%" />
          <StatCard title="Expired Proposals" value="4 Failed" change="+2" />
          <StatCard title="Completed Proposals" value="24 Completed" change="+7" />
          <StatCard title="Avg. Proposal Value" value="$11,540" change="-0.4%" negative />
        </div>

        {/* Chart Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              <button className="bg-gray-100 px-3 py-1 rounded-md text-sm">
                Total Volume
              </button>
              <button className="px-3 py-1 text-sm text-gray-500">
                Avg. Value
              </button>
            </div>
            <div className="text-lg font-semibold">$110,100.00 USD</div>
          </div>

          {/* Fake Bar Chart */}
          <div className="flex items-end gap-4 h-48">
            {[20, 35, 50, 80, 60, 90, 45].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-blue-500 rounded-t-md"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        {/* Proposals Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Proposals</h2>

            <div className="flex gap-3">
              <input
                placeholder="Search..."
                className="border rounded-lg px-3 py-2 text-sm"
              />
              <button className="border rounded-lg px-4 py-2 text-sm">
                Filter
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                + New Proposal
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-500 border-b">
                <tr>
                  <th className="text-left py-3">ID</th>
                  <th className="text-left py-3">Name</th>
                  <th className="text-left py-3">Address</th>
                  <th className="text-left py-3">Proposal Range</th>
                  <th className="text-left py-3">Sent</th>
                  <th className="text-left py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {proposals.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="py-3">{p.id}</td>
                    <td>{p.name}</td>
                    <td>{p.address}</td>
                    <td>{p.range}</td>
                    <td>{p.sent}</td>
                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          p.status === "Signed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-xs text-gray-400">
            Showing 1-10 of 100
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  change,
  negative,
}: {
  title: string;
  value: string;
  change: string;
  negative?: boolean;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <div className="flex items-center justify-between mt-3">
        <p className="text-xl font-semibold">{value}</p>
        <span
          className={`text-sm font-medium ${
            negative ? "text-red-500" : "text-green-500"
          }`}
        >
          {change}
        </span>
      </div>
    </div>
  );
}
