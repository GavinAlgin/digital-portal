import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  IconDashboard,
  IconFolder,
  IconUsers,
  IconSettings,
  IconDatabase,
  IconReport,
  IconSearch,
  IconHelp,
  IconChevronDown,
  IconCash,
  IconListDetails,
  IconUser,
} from "@tabler/icons-react"

import ListecLogo from "../assets/cropped-flyer-02102024-133x133.png"
import { Loader2 } from "lucide-react"
import { getCurrentUser, type User } from "../hooks/context/AdminLogged"
import { NavUser } from "./Nav-user"

type NavItem = {
  title: string
  url: string
  icon?: React.ElementType
}

type NavGroup = {
  title: string
  icon: React.ElementType
  items: { title: string; url: string }[]
}

export default function AppSidebar() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  /* ---------------------------- Auth Handling ---------------------------- */

  useEffect(() => {
    let isMounted = true

    const fetchUser = async () => {
      try {
        const loggedUser = await getCurrentUser()

        if (!loggedUser) {
          navigate("/admin/login", { replace: true })
          return
        }

        if (isMounted) setUser(loggedUser)
      } catch (err) {
        console.error("Failed to fetch current user:", err)
        navigate("/admin/login", { replace: true })
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchUser()

    return () => {
      isMounted = false
    }
  }, [navigate])

  /* ---------------------------- Sidebar Data ---------------------------- */

  const mainLinks: NavItem[] = [
    { title: "Dashboard", url: "/admin", icon: IconDashboard },
    { title: "Reports", url: "/admin/reports", icon: IconListDetails },
    { title: "Workbench", url: "/admin/config", icon: IconFolder },
  ]

  const groups: NavGroup[] = [
    {
      title: "Students",
      icon: IconUsers,
      items: [
        { title: "All Students", url: "/admin/students" },
        { title: "Register Student", url: "/admin/students/create" },
        { title: "Attendance", url: "/admin/attendance" },
      ],
    },
    {
      title: "Team",
      icon: IconUser,
      items: [
        { title: "All Members", url: "/admin/team" },
        { title: "Register Member", url: "/admin/students/create" },
        { title: "Attendance", url: "/admin/attendance" },
      ],
    },
    {
      title: "Finance",
      icon: IconCash,
      items: [
        { title: "Student Payments", url: "/admin/finance/payments" },
        { title: "Invoices", url: "/admin/finance/invoices" },
        { title: "Financial Reports", url: "/admin/finance/reports" },
      ],
    },
  ]

  const documents: NavItem[] = [
    { title: "Data Library", url: "#", icon: IconDatabase },
    { title: "Reports", url: "#", icon: IconReport },
  ]

  const secondary: NavItem[] = [
    { title: "Settings", url: "/admin/settings", icon: IconSettings },
    { title: "Help", url: "#", icon: IconHelp },
    { title: "Search", url: "#", icon: IconSearch },
  ]

  /* ------------------------------ Render ------------------------------ */

  return (
    <aside className="flex h-screen w-72 flex-col bg-slate-50">

      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <img src={ListecLogo} className="h-8 w-8" />
        <span className="font-semibold">Listec Portal</span>
      </div>

      <div className="flex flex-1 flex-col px-4 space-y-6 overflow-y-auto">

        <NavSection items={mainLinks} />

        <CollapsibleSection groups={groups} />

        <NavSection title="Documents" items={documents} />

        <div className="mt-auto">
          <NavSection items={secondary} />
        </div>

      </div>

      {/* User */}
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          </div>
        ) : user ? (
          <NavUser
            user={{
              name: `${user.first_name} ${user.last_name}`,
              email: user.email,
              avatar: ListecLogo,
            }}
          />
        ) : null}
      </div>

    </aside>
  )
}

/* ---------------- NavSection ---------------- */

function NavSection({
  title,
  items,
}: {
  title?: string
  items: NavItem[]
}) {
  return (
    <div className="space-y-1">
      {title && (
        <p className="px-2 text-xs font-semibold text-gray-500 uppercase">
          {title}
        </p>
      )}

      {items.map((item) => {
        const Icon = item.icon

        return (
          <Link
            key={item.title}
            to={item.url}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
          >
            {Icon && <Icon size={18} />}
            {item.title}
          </Link>
        )
      })}
    </div>
  )
}

/* ---------------- CollapsibleSection ---------------- */

function CollapsibleSection({ groups }: { groups: NavGroup[] }) {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div className="space-y-2">
      {groups.map((group) => {
        const Icon = group.icon
        const isOpen = open === group.title

        return (
          <div key={group.title}>
            <button
              onClick={() => setOpen(isOpen ? null : group.title)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100"
            >
              <div className="flex items-center gap-3">
                <Icon size={18} />
                {group.title}
              </div>

              <IconChevronDown
                size={16}
                className={`transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isOpen && (
              <div className="ml-8 mt-1 space-y-1">
                {group.items.map((item) => (
                  <Link
                    key={item.title}
                    to={item.url}
                    className="block rounded-md px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}