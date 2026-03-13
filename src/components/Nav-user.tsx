import { useEffect, useRef, useState } from "react"
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

type NavUserProps = {
  user: {
    name: string
    email: string
    avatar?: string
  }
}

export function NavUser({ user }: NavUserProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  /* ---------------- Close on outside click ---------------- */

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  /* ---------------- Logout ---------------- */

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/admin/login")
  }

  /* ---------------- Initials ---------------- */

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="relative w-full" ref={menuRef}>
      {/* Trigger */}

      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-gray-100 transition"
      >
        {/* Avatar */}

        <div className="h-9 w-9 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center text-xs font-semibold">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-full w-full object-cover"
            />
          ) : (
            initials
          )}
        </div>

        {/* User info */}

        <div className="flex flex-col flex-1 text-left leading-tight">
          <span className="font-medium truncate">{user.name}</span>

          <span className="text-xs text-gray-500 truncate">
            {user.email}
          </span>
        </div>

        <ChevronsUpDown
          className={`h-4 w-4 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}

      <div
        className={`absolute bottom-full mb-2 right-0 w-56 rounded-lg border border-gray-200 bg-white shadow-lg transition-all duration-200 origin-bottom ${
          open
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-1 pointer-events-none"
        }`}
      >
        {/* User label */}

        <div className="flex items-center gap-3 p-3 border-b border-gray-200">
          <div className="h-9 w-9 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center text-xs font-semibold">
            {user.avatar ? (
              <img
                src={user.avatar}
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-medium">{user.name}</span>
            <span className="text-xs text-gray-500">{user.email}</span>
          </div>
        </div>

        {/* Menu items */}

        <div className="p-1">

          <MenuItem icon={<Sparkles size={16} />}>
            Upgrade to Pro
          </MenuItem>

          <div className="my-1 h-px bg-gray-200" />

          <MenuItem icon={<BadgeCheck size={16} />}>
            Account
          </MenuItem>

          <MenuItem icon={<CreditCard size={16} />}>
            Billing
          </MenuItem>

          <MenuItem icon={<Bell size={16} />}>
            Notifications
          </MenuItem>

          <div className="my-1 h-px bg-gray-200" />

          <MenuItem
            icon={<LogOut size={16} />}
            onClick={handleLogout}
            danger
          >
            Log out
          </MenuItem>

        </div>
      </div>
    </div>
  )
}

/* ---------------- Menu Item ---------------- */

function MenuItem({
  children,
  icon,
  onClick,
  danger,
}: {
  children: React.ReactNode
  icon: React.ReactNode
  onClick?: () => void
  danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm transition hover:bg-gray-100 ${
        danger ? "text-red-600 hover:bg-red-50" : ""
      }`}
    >
      {icon}
      {children}
    </button>
  )
}