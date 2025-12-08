import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/context/AuthContext";

interface HeaderProps {
  logo: string;
  logoText: string;
  navItems: { label: string; href: string }[];
  notificationsCount: number;
  userName: string;
  userProfileUrl: string;
}

const Header: React.FC<HeaderProps> = ({
  logo,
  logoText,
  navItems,
  notificationsCount,
  userName,
  userProfileUrl,
}) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notificationsDropdownOpen, setNotificationsDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header
      id="page-header"
      className="z-50 flex flex-none items-center border-b border-neutral-200/75 bg-white/90 backdrop-blur-xs lg:fixed lg:start-0 lg:end-0 lg:top-0 lg:h-20">
      <div className="container mx-auto px-4 lg:px-8 xl:max-w-7xl">
        <div className="flex justify-between py-5 lg:py-0">

          {/* Left Section: Logo */}
          <div className="flex items-center gap-2 lg:gap-6">
            <Link
              to={role === "admin" ? "/admin" : "/user"}
              className="inline-flex items-center gap-2 text-lg font-bold text-neutral-900 hover:text-neutral-600">
              <img src={logo} className="h-8 w-8 rounded-full" alt={logoText} />
              <span>{logoText}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) => (
              <Link
                to={item.href}
                key={item.label}
                className="group flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-800 hover:bg-neutral-100 hover:text-neutral-950">
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            
            {/* Notifications */}
            <div className="relative inline-block">
              <button
                onClick={() =>
                  setNotificationsDropdownOpen(!notificationsDropdownOpen)
                }
                className="inline-flex items-center justify-center gap-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-800 hover:border-neutral-300">
                {notificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 rounded-full bg-neutral-800 px-1.5 py-0.5 text-xs text-white">
                    {notificationsCount}
                  </span>
                )}

                {/* Bell Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022A23.85 23.85 0 009.143 17.082m5.714 0A3 3 0 019.143 17.082"
                  />
                </svg>
              </button>

              {/* Notifications Dropdown */}
              {notificationsDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-lg bg-white shadow-xl ring-1 ring-black/5">
                  <div className="p-3">
                    <div className="text-xs text-neutral-600">Just now</div>
                    <h5 className="font-semibold">New Ticket Assigned: #4567</h5>
                    <p className="text-xs text-neutral-500">
                      You have been assigned a new ticket regarding a software installation issue.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* User Dropdown */}
            <div className="relative inline-block">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-800 hover:border-neutral-300">
                <img
                  src={userProfileUrl}
                  alt={userName}
                  className="h-6 w-6 rounded-full hidden sm:block"
                />
                <span className="hidden sm:inline">{userName}</span>

                <svg
                  className="hidden sm:inline-block h-5 w-5 opacity-40"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-lg bg-white shadow-xl ring-1 ring-black/5">
                  <div className="py-2">
                    <Link
                      to="/account"
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                    >
                      Account
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                    >
                      Settings
                    </Link>

                    <hr className="my-2 border-neutral-100" />

                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileNavOpen && (
        <div className="lg:hidden fixed inset-0 bg-white z-40 p-4">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="py-2 text-lg text-neutral-800 border-b"
                onClick={() => setMobileNavOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className="mt-4 py-2 text-lg text-red-600"
            >
              Logout
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;


// import React, { useState } from "react";
// import ListecLogo from "../../../assets/cropped-flyer-02102024-133x133.png";

// interface HeaderProps {
//   logo: string; // URL for the logo
//   logoText: string; // Logo text (e.g., "TailDesk")
//   navItems: { label: string, href: string }[]; // List of navigation items
//   notificationsCount: number; // Notifications count for the bell icon
//   userName: string; // User's name
//   userProfileUrl: string; // User's profile URL
// }

// const Header: React.FC<HeaderProps> = ({
//   logo,
//   logoText,
//   navItems,
//   notificationsCount,
//   userName,
//   userProfileUrl,
// }) => {
//   const [mobileNavOpen, setMobileNavOpen] = useState(false);
//   const [notificationsDropdownOpen, setNotificationsDropdownOpen] = useState(false);
//   const [userDropdownOpen, setUserDropdownOpen] = useState(false);

//   return (
//     <header
//       id="page-header"
//       className="z-50 flex flex-none items-center border-b border-neutral-200/75 bg-white/90 backdrop-blur-xs lg:fixed lg:start-0 lg:end-0 lg:top-0 lg:h-20"
//     >
//       <div className="container mx-auto px-4 lg:px-8 xl:max-w-7xl">
//         <div className="flex justify-between py-5 lg:py-0">
//           {/* Left Section: Logo */}
//           <div className="flex items-center gap-2 lg:gap-6">
//             <a
//               href="#"
//               className="group inline-flex items-center gap-1.5 text-lg font-bold tracking-wide text-neutral-900 hover:text-neutral-600"
//             >
//               <svg
//                 className="hi-mini hi-lifebuoy inline-block size-5 text-neutral-950 transition group-hover:scale-110 group-active:scale-100"
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//                 aria-hidden="true"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M7.171 4.146l1.947 2.466a3.514 3.514 0 011.764 0l1.947-2.466a6.52 6.52 0 00-5.658 0zm8.683 3.025l-2.466 1.947c.15.578.15 1.186 0 1.764l2.466 1.947a6.52 6.52 0 000-5.658zm-3.025 8.683l-1.947-2.466c-.578.15-1.186.15-1.764 0l-1.947 2.466a6.52 6.52 0 005.658 0zM4.146 12.83l2.466-1.947a3.514 3.514 0 010-1.764L4.146 7.171a6.52 6.52 0 000 5.658zM5.63 3.297a8.01 8.01 0 018.738 0 8.031 8.031 0 012.334 2.334 8.01 8.01 0 010 8.738 8.033 8.033 0 01-2.334 2.334 8.01 8.01 0 01-8.738 0 8.032 8.032 0 01-2.334-2.334 8.01 8.01 0 010-8.738A8.03 8.03 0 015.63 3.297zm5.198 4.882a2.008 2.008 0 00-2.243.407 1.994 1.994 0 00-.407 2.243 1.993 1.993 0 00.992.992 2.008 2.008 0 002.243-.407c.176-.175.31-.374.407-.585a2.008 2.008 0 00-.407-2.243 1.993 1.993 0 00-.585-.407z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//               <span>{logoText}</span>
//             </a>
//           </div>

//           {/* Desktop Navigation */}
//           <nav className="hidden items-center gap-2 lg:flex">
//             {navItems.map((item) => (
//               <a
//                 href={item.href}
//                 key={item.label}
//                 className="group flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-800 hover:bg-neutral-100 hover:text-neutral-950 active:bg-neutral-50"
//               >
//                 <span>{item.label}</span>
//               </a>
//             ))}
//           </nav>

//           {/* Right Section */}
//           <div className="flex items-center gap-2">
//             {/* Notifications */}
//             <div className="relative inline-block">
//               <button
//                 onClick={() => setNotificationsDropdownOpen(!notificationsDropdownOpen)}
//                 aria-expanded={notificationsDropdownOpen ? "true" : "false"}
//                 className="inline-flex items-center justify-center gap-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm leading-5 font-semibold text-neutral-800 hover:border-neutral-300 hover:text-neutral-950"
//                 aria-haspopup="true"
//               >
//                 <div className="absolute -end-2 -top-2">
//                   {notificationsCount > 0 && (
//                     <span className="rounded-full bg-neutral-800 px-1.5 py-0.5 text-xs font-semibold text-white">{notificationsCount}</span>
//                   )}
//                 </div>
//                 <svg
//                   className="hi-outline hi-bell-alert inline-block size-5"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth="1.5"
//                   stroke="currentColor"
//                   aria-hidden="true"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5"
//                   />
//                 </svg>
//               </button>

//               {/* Dropdown */}
//               {notificationsDropdownOpen && (
//                 <div
//                   className="absolute -end-20 z-10 mt-2 w-64 rounded-lg shadow-xl lg:w-80 ltr:origin-top-right rtl:origin-top-left"
//                   role="menu"
//                   aria-labelledby="dropdown-notifications"
//                 >
//                   <div className="rounded-lg bg-white py-2.5 ring-1 ring-black/5">
//                     {/* Example Notifications */}
//                     <a
//                       href="#"
//                       className="group block gap-1.5 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950"
//                     >
//                       <div className="text-xs text-neutral-600">Just now</div>
//                       <h5 className="mb-0.5 font-semibold">New Ticket Assigned: #4567</h5>
//                       <p className="text-xs text-neutral-500">
//                         You have been assigned a new ticket regarding a software installation issue. Please review and respond promptly.
//                       </p>
//                     </a>
//                     {/* Add more notifications here */}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* User Dropdown */}
//             <div className="relative inline-block">
//               <button
//                 onClick={() => setUserDropdownOpen(!userDropdownOpen)}
//                 aria-expanded={userDropdownOpen ? "true" : "false"}
//                 className="inline-flex items-center justify-center gap-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm leading-5 font-semibold text-neutral-800 hover:border-neutral-300 hover:text-neutral-950"
//                 aria-haspopup="true"
//               >
//                 <svg
//                   className="hi-mini hi-user-circle inline-block size-5 sm:hidden"
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                   aria-hidden="true"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 <span className="hidden sm:inline">{userName}</span>
//                 <svg
//                   className="hi-mini hi-chevron-down hidden size-5 opacity-40 sm:inline-block"
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                   aria-hidden="true"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </button>

//               {userDropdownOpen && (
//                 <div
//                   className="absolute end-0 z-10 mt-2 w-40 rounded-lg shadow-xl ltr:origin-top-right rtl:origin-top-left"
//                   role="menu"
//                   aria-labelledby="dropdown-user"
//                 >
//                   <div className="rounded-lg bg-white py-2.5 ring-1 ring-black/5">
//                     <a
//                       href="#"
//                       className="group flex items-center justify-between gap-1.5 px-4 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950"
//                     >
//                       <span className="grow">Account</span>
//                     </a>
//                     <a
//                       href="#"
//                       className="group flex items-center justify-between gap-1.5 px-4 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950"
//                     >
//                       <span className="grow">Settings</span>
//                     </a>
//                     <hr className="my-2.5 border-neutral-100" />
//                     <form onSubmit={() => {}}>
//                       <button
//                         type="submit"
//                         className="group flex w-full items-center justify-between gap-1.5 px-4 py-1.5 text-start text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950"
//                       >
//                         <span className="grow">Sign out</span>
//                       </button>
//                     </form>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// // Example usage of Header Component
// const App = () => {
//   return (
//     <div>
      // <Header
      //   logo={ListecLogo}
      //   logoText="LISTEC"
      //   navItems={[
      //     { label: "Dashboard", href: "#" },
      //     { label: "Tickets", href: "#" },
      //     { label: "Reports", href: "#" },
      //     { label: "Customers", href: "#" },
      //   ]}
      //   notificationsCount={3}
      //   userName="John Doe"
      //   userProfileUrl="#"
      // />
//     </div>
//   );
// };

// export default App;
