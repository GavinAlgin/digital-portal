import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import {
  UserCircleIcon,
  DocumentTextIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

type MenuOption = {
  label: string;
  navigate: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const menuOptions: MenuOption[] = [
  {
    label: "My Profile",
    navigate: "/user/profile",
    Icon: UserCircleIcon,
  },
  {
    label: "Report",
    navigate: "/user/report",
    Icon: DocumentTextIcon,
  },
  {
    label: "Calendar",
    navigate: "/user/calendar",
    Icon: CalendarIcon,
  },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-[#000049] text-white flex items-center justify-between px-4 py-3 shadow-md sticky top-0 z-50">
      <div className="text-xl font-bold">My Portal</div>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className={`flex items-center justify-center p-2 rounded-full transition ${
            menuOpen ? "bg-white/20" : "hover:bg-[#1C244B]"
          }`}
        >
          <EllipsisHorizontalIcon className="w-6 h-6 text-white" />
        </button>

        {/* Dropdown */}
        <div
          className={`absolute right-0 mt-3 w-56 rounded-2xl shadow-2xl backdrop-blur-2xl bg-white/75 dark:bg-black/60 border border-white/40 dark:border-white/10 transition-all duration-200 ease-out origin-top-right ${
            menuOpen
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
          }`}
        >
          {menuOptions.map(({ label, navigate, Icon }, index) => (
            <div key={label}>
              <Link
                to={navigate}
                className="flex items-center gap-3 px-4 py-3 text-[15px] text-black dark:text-white font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                <Icon className="w-5 h-5 text-gray-500" />
                <span>{label}</span>
              </Link>

              {index < menuOptions.length - 1 && (
                <div className="border-b border-black/10 dark:border-white/10 mx-3" />
              )}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
