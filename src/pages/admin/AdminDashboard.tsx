import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"

import { getCurrentUser, type User } from "../../hooks/context/AdminLogged"
import Header from "./components/Header"
import ListecLogo from "../../assets/cropped-flyer-02102024-133x133.png"
import TicketCard from "./components/TicketCard"
import { DataTable } from "../../components/Datatable"
import { supabase } from "../../hooks/supabase/supabaseClient"

/* ---------------------------------------------
   TYPES
---------------------------------------------- */
type ContactMessage = {
  id: string
  email: string
  subject: string
  message: string | null
  created_at: string
}

const PAGE_SIZE = 10

const AdminDashboard = () => {
  const navigate = useNavigate()

  /* ---------------------------------------------
     AUTH STATE
  ---------------------------------------------- */
  const [authLoading, setAuthLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  /* ---------------------------------------------
     TABLE STATE
  ---------------------------------------------- */
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [tableLoading, setTableLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  /* ---------------------------------------------
     DATA STATE
  ---------------------------------------------- */
  const [usersCount, setUsersCount] = useState(0)
  useEffect(() => {
    if (!user) return

    const fetchUsersCount = async () => {
      const { count, error } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })

      if (error) {
        console.error("Error fetching users count:", error)
      } else {
        setUsersCount(count ?? 0)
      }
    }

    fetchUsersCount()
  }, [user])



  /* ---------------------------------------------
     AUTH CHECK
  ---------------------------------------------- */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const loggedUser = await getCurrentUser()
        if (!loggedUser) {
          navigate("/admin/login", { replace: true })
          return
        }
        setUser(loggedUser)
      } catch {
        navigate("/admin/login", { replace: true })
      } finally {
        setAuthLoading(false)
      }
    }

    fetchUser()
  }, [navigate])

  /* ---------------------------------------------
     FETCH DASHBOARD TABLE DATA
  ---------------------------------------------- */
  useEffect(() => {
    if (!user) return

    const fetchMessages = async () => {
      setTableLoading(true)

      const from = (page - 1) * PAGE_SIZE
      const to = from + PAGE_SIZE - 1

      const { data, error, count } = await supabase
        .from("contact_messages")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to)

      if (error) {
        console.error("Error fetching messages:", error)
      } else {
        setMessages(data ?? [])
        setTotal(count ?? 0)
      }

      setTableLoading(false)
    }

    fetchMessages()
  }, [page, user])

  /* ---------------------------------------------
     LOADING STATE
  ---------------------------------------------- */
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-gray-600" />
      </div>
    )
  }

  if (!user) return null

  /* ---------------------------------------------
     RENDER
  ---------------------------------------------- */
  return (
    <div>
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

      <main className="container mx-auto mt-18 p-4 lg:p-8 xl:max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <p className="text-sm text-neutral-500">
            Welcome, you have <strong>{total}</strong> messages.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-2 lg:grid-cols-4">
          <TicketCard
            title="Total Messages"
            count={total}
            description="Contact form submissions"
            percentage=""
          />
          <TicketCard
            title="Unread Messages"
            count={total}
            description="No read tracking yet"
            percentage=""
          />
          <TicketCard title="Users" count={usersCount} description="Registered Students" percentage="" />
          <TicketCard title="System Status" count={1} description="Admin Login" percentage="" />
        </div>

        {/* Data Table */}
        <div className="mt-8">
          <DataTable
            title="Contact Messages"
            data={messages}
            loading={tableLoading}
            page={page}
            pageSize={PAGE_SIZE}
            total={total}
            onPageChange={setPage}
            autoGenerateColumns
            hiddenColumns={["id"]}
          />
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
