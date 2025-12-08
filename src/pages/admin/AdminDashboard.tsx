import Header from './components/Header'
import ListecLogo from '../../assets/cropped-flyer-02102024-133x133.png'
import { useEffect, useState } from 'react'
import { getCurrentUser, type User } from '../../hooks/context/AdminLogged';

const AdminDashboard = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const loggedUser = await getCurrentUser();
            setUser(loggedUser);
        };
        fetchUser();
    }, []);

    if (!user) return <p>Loading or not logged in...</p>
  return (
    <div x-data="{ userDropdownOpen: false, notificationsDropdownOpen: false, mobileNavOpen: false }">
        <div id="page-container" className="mx-auto flex min-h-screen w-full min-w-[320px] flex-col bg-white lg:pt-20">
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
                userProfileUrl="#"
            />

            <main id="page-content" className="flex max-w-full flex-auto flex-col">
            <div className="container mx-auto px-4 pt-6 lg:px-8 lg:pt-8 xl:max-w-7xl">
                <div
                className="flex flex-col gap-2 text-center sm:flex-row sm:items-center sm:justify-between sm:text-start"
                >
                <div className="grow">
                    <h1 className="mb-1 text-xl font-bold">Dashboard</h1>
                    <h2 className="text-sm font-medium text-neutral-500">
                    Welcome, you have <strong>5 open tickets</strong> and
                    <strong> 3 notifications</strong>.
                    </h2>
                </div>
                <div
                    className="flex flex-none items-center justify-center gap-2 rounded-sm sm:justify-end"
                >
                    <div className="relative">
                    <div
                        className="pointer-events-none absolute inset-y-0 start-0 my-px ms-px flex w-10 items-center justify-center rounded-l-lg text-neutral-500"
                    >
                        <svg
                        className="hi-mini hi-magnifying-glass inline-block size-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        >
                        <path
                            fill-rule="evenodd"
                            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                            clip-rule="evenodd"
                        />
                        </svg>
                    </div>
                    <input
                        type="text"
                        id="search"
                        name="search"
                        placeholder="Search everything.."
                        className="block w-full rounded-lg border border-neutral-200 py-2 ps-10 pe-3 leading-6 placeholder-neutral-500 focus:border-neutral-500 focus:ring-3 focus:ring-neutral-500/25"
                    />
                    </div>
                </div>
                </div>
            </div>

            <div className="container mx-auto p-4 lg:p-8 xl:max-w-7xl">
                <div
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8"
                >
                <a
                    href="javascript:void(0)"
                    className="flex flex-col rounded-lg border border-neutral-200 bg-white hover:border-neutral-300 active:border-neutral-200"
                >
                    <div className="flex grow items-center justify-between p-5">
                    <dl>
                        <dt className="text-2xl font-bold">5</dt>
                        <dd className="text-sm font-medium text-neutral-500">
                        Open Tickets
                        </dd>
                    </dl>
                    <div
                        className="flex items-center text-sm font-medium text-emerald-500"
                    >
                        <svg
                        className="hi-mini hi-arrow-down inline-block size-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        >
                        <path
                            fill-rule="evenodd"
                            d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
                            clip-rule="evenodd"
                        />
                        </svg>
                        <span>5%</span>
                    </div>
                    </div>
                    <div
                    className="border-t border-neutral-100 px-5 py-3 text-xs font-medium text-orange-500"
                    >
                    Assigned to you
                    </div>
                </a>
                <a
                    href="javascript:void(0)"
                    className="flex flex-col rounded-lg border border-neutral-200 bg-white hover:border-neutral-300 active:border-neutral-200"
                >
                    <div className="flex grow items-center justify-between p-5">
                    <dl>
                        <dt className="text-2xl font-bold">28</dt>
                        <dd className="text-sm font-medium text-neutral-500">
                        Open Tickets
                        </dd>
                    </dl>
                    <div
                        className="flex items-center text-sm font-medium text-emerald-500"
                    >
                        <svg
                        className="hi-mini hi-arrow-down inline-block size-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        >
                        <path
                            fill-rule="evenodd"
                            d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
                            clip-rule="evenodd"
                        />
                        </svg>
                        <span>12%</span>
                    </div>
                    </div>
                    <div
                    className="border-t border-neutral-100 px-5 py-3 text-xs font-medium text-neutral-500"
                    >
                    In total
                    </div>
                </a>
                <a
                    href="javascript:void(0)"
                    className="flex flex-col rounded-lg border border-neutral-200 bg-white hover:border-neutral-300 active:border-neutral-200"
                >
                    <div className="flex grow items-center justify-between p-5">
                    <dl>
                        <dt className="text-2xl font-bold">792</dt>
                        <dd className="text-sm font-medium text-neutral-500">
                        Closed Tickets
                        </dd>
                    </dl>
                    <div
                        className="flex items-center text-sm font-medium text-rose-500"
                    >
                        <svg
                        className="hi-mini hi-arrow-down inline-block size-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        >
                        <path
                            fill-rule="evenodd"
                            d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
                            clip-rule="evenodd"
                        />
                        </svg>
                        <span>7,5%</span>
                    </div>
                    </div>
                    <div
                    className="border-t border-neutral-100 px-5 py-3 text-xs font-medium text-neutral-500"
                    >
                    Last 30 days
                    </div>
                </a>
                <a
                    href="javascript:void(0)"
                    className="flex flex-col rounded-lg border border-neutral-200 bg-white hover:border-neutral-300 active:border-neutral-200"
                >
                    <div className="flex grow items-center justify-between p-5">
                    <dl>
                        <dt className="text-2xl font-bold">2,580</dt>
                        <dd className="text-sm font-medium text-neutral-500">
                        All Customers
                        </dd>
                    </dl>
                    <div
                        className="flex items-center text-sm font-medium text-emerald-500"
                    >
                        <svg
                        className="hi-mini hi-arrow-small-up inline-block size-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        >
                        <path
                            fill-rule="evenodd"
                            d="M10 15a.75.75 0 01-.75-.75V7.612L7.29 9.77a.75.75 0 01-1.08-1.04l3.25-3.5a.75.75 0 011.08 0l3.25 3.5a.75.75 0 11-1.08 1.04l-1.96-2.158v6.638A.75.75 0 0110 15z"
                            clip-rule="evenodd"
                        />
                        </svg>
                        <span>25%</span>
                    </div>
                    </div>
                    <div
                    className="border-t border-neutral-100 px-5 py-3 text-xs font-medium text-neutral-500"
                    >
                    Last 30 days
                    </div>
                </a>
                <div
                    className="flex flex-col rounded-lg border border-neutral-200 bg-white sm:col-span-2 lg:col-span-4"
                >
                    <div
                    className="flex flex-col items-center justify-between gap-4 border-b border-neutral-100 p-5 text-center sm:flex-row sm:text-start"
                    >
                    <div>
                        <h2 className="mb-0.5 font-semibold">Recent tickets</h2>
                        <h3 className="text-sm font-medium text-neutral-600">
                        It seems that we are receiving less tickets the last 30
                        days
                        </h3>
                    </div>
                    <div>
                        <a
                        href="javascript:void(0)"
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm leading-5 font-semibold text-neutral-800 hover:border-neutral-300 hover:text-neutral-950 active:border-neutral-200"
                        >
                        View all tickets
                        </a>
                    </div>
                    </div>
                    <div className="p-5">

                    <div className="min-w-full overflow-x-auto rounded-sm">

                        <table className="min-w-full align-middle text-sm">
                        <thead>
                            <tr className="border-b-2 border-neutral-100">
                            <th
                                className="min-w-[140px] px-3 py-2 text-start text-sm font-semibold tracking-wider text-neutral-700 uppercase"
                            >
                                ID
                            </th>
                            <th
                                className="min-w-[180px] px-3 py-2 text-start text-sm font-semibold tracking-wider text-neutral-700 uppercase"
                            >
                                Date
                            </th>
                            <th
                                className="min-w-[180px] px-3 py-2 text-start text-sm font-semibold tracking-wider text-neutral-700 uppercase"
                            >
                                User
                            </th>
                            <th
                                className="min-w-[180px] px-3 py-2 text-start text-sm font-semibold tracking-wider text-neutral-700 uppercase"
                            >
                                Title
                            </th>
                            <th
                                className="px-3 py-2 text-start text-sm font-semibold tracking-wider text-neutral-700 uppercase"
                            >
                                Status
                            </th>
                            <th
                                className="min-w-[100px] p-3 py-2 text-end text-sm font-semibold tracking-wider text-neutral-700 uppercase"
                            ></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                            className="border-b border-neutral-100 hover:bg-neutral-50"
                            >
                            <td
                                className="p-3 text-start font-semibold text-neutral-600"
                            >
                                RN#4585
                            </td>
                            <td className="p-3 text-start text-neutral-600">
                                2023-11-15 09:30
                            </td>
                            <td className="p-3 font-medium text-neutral-600">
                                <a
                                href="javascript:void(0)"
                                className="underline decoration-neutral-200 decoration-2 underline-offset-4 hover:text-neutral-950 hover:decoration-neutral-300"
                                >Alex Johnson</a>
                            </td>
                            <td className="p-3 text-start">
                                Unable to Connect to Wi-Fi on Laptop
                            </td>
                            <td className="p-3 font-medium">
                                <div
                                className="inline-block rounded-full bg-purple-100 px-2 py-1 text-xs leading-4 font-semibold whitespace-nowrap text-purple-800"
                                >
                                New
                                </div>
                            </td>
                            <td className="p-3 text-end font-medium">
                                <a
                                href="javascript:void(0)"
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm leading-5 font-semibold text-neutral-800 hover:border-neutral-300 hover:text-neutral-950 active:border-neutral-200"
                                >
                                <span>View</span>
                                <svg
                                    className="hi-mini hi-arrow-right inline-block size-5 text-neutral-400 group-hover:text-blue-600 group-active:translate-x-0.5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                    fill-rule="evenodd"
                                    d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                                    clip-rule="evenodd"
                                    ></path>
                                </svg>
                                </a>
                            </td>
                            </tr>
                            <tr
                            className="border-b border-neutral-100 hover:bg-neutral-50"
                            >
                            <td
                                className="p-3 text-start font-semibold text-neutral-600"
                            >
                                RN#4584
                            </td>
                            <td className="p-3 text-start text-neutral-600">
                                2023-11-10 14:15
                            </td>
                            <td className="p-3 font-medium text-neutral-600">
                                <a
                                href="javascript:void(0)"
                                className="underline decoration-neutral-200 decoration-2 underline-offset-4 hover:text-neutral-950 hover:decoration-neutral-300"
                                >Jordan Smith</a>
                            </td>
                            <td className="p-3 text-start">
                                Email Campaign Software Crashing Frequently
                            </td>
                            <td className="p-3 font-medium">
                                <div
                                className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs leading-4 font-semibold whitespace-nowrap text-blue-800"
                                >
                                Awaiting Response
                                </div>
                            </td>
                            <td className="p-3 text-end font-medium">
                                <a
                                href="javascript:void(0)"
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm leading-5 font-semibold text-neutral-800 hover:border-neutral-300 hover:text-neutral-950 active:border-neutral-200"
                                >
                                <span>View</span>
                                <svg
                                    className="hi-mini hi-arrow-right inline-block size-5 text-neutral-400 group-hover:text-blue-600 group-active:translate-x-0.5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                    fill-rule="evenodd"
                                    d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                                    clip-rule="evenodd"
                                    ></path>
                                </svg>
                                </a>
                            </td>
                            </tr>
                            <tr
                            className="border-b border-neutral-100 hover:bg-neutral-50"
                            >
                            <td
                                className="p-3 text-start font-semibold text-neutral-600"
                            >
                                RN#4583
                            </td>
                            <td className="p-3 text-start text-neutral-600">
                                2023-11-05 17:45
                            </td>
                            <td className="p-3 font-medium text-neutral-600">
                                <a
                                href="javascript:void(0)"
                                className="underline decoration-neutral-200 decoration-2 underline-offset-4 hover:text-neutral-950 hover:decoration-neutral-300"
                                >Samantha Davis</a>
                            </td>
                            <td className="p-3 text-start">
                                Issues Syncing Calendar Across Devices
                            </td>
                            <td className="p-3 font-medium">
                                <div
                                className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs leading-4 font-semibold whitespace-nowrap text-blue-800"
                                >
                                Awaiting Response
                                </div>
                            </td>
                            <td className="p-3 text-end font-medium">
                                <a
                                href="javascript:void(0)"
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm leading-5 font-semibold text-neutral-800 hover:border-neutral-300 hover:text-neutral-950 active:border-neutral-200"
                                >
                                <span>View</span>
                                <svg
                                    className="hi-mini hi-arrow-right inline-block size-5 text-neutral-400 group-hover:text-blue-600 group-active:translate-x-0.5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                    fill-rule="evenodd"
                                    d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                                    clip-rule="evenodd"
                                    ></path>
                                </svg>
                                </a>
                            </td>
                            </tr>
                            <tr
                            className="border-b border-neutral-100 hover:bg-neutral-50"
                            >
                            <td
                                className="p-3 text-start font-semibold text-neutral-600"
                            >
                                RN#4582
                            </td>
                            <td className="p-3 text-start text-neutral-600">
                                2023-10-30 08:00
                            </td>
                            <td className="p-3 font-medium text-neutral-600">
                                <a
                                href="javascript:void(0)"
                                className="underline decoration-neutral-200 decoration-2 underline-offset-4 hover:text-neutral-950 hover:decoration-neutral-300"
                                >Mindy O'Connell</a>
                            </td>
                            <td className="p-3 text-start">
                                Graphics Tablet Not Responding in Design Software
                            </td>
                            <td className="p-3 font-medium">
                                <div
                                className="inline-block rounded-full bg-purple-100 px-2 py-1 text-xs leading-4 font-semibold whitespace-nowrap text-purple-800"
                                >
                                New
                                </div>
                            </td>
                            <td className="p-3 text-end font-medium">
                                <a
                                href="javascript:void(0)"
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm leading-5 font-semibold text-neutral-800 hover:border-neutral-300 hover:text-neutral-950 active:border-neutral-200"
                                >
                                <span>View</span>
                                <svg
                                    className="hi-mini hi-arrow-right inline-block size-5 text-neutral-400 group-hover:text-blue-600 group-active:translate-x-0.5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                    fill-rule="evenodd"
                                    d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                                    clip-rule="evenodd"
                                    ></path>
                                </svg>
                                </a>
                            </td>
                            </tr>
                            <tr
                            className="border-b border-neutral-100 hover:bg-neutral-50"
                            >
                            <td
                                className="p-3 text-start font-semibold text-neutral-600"
                            >
                                RN#4581
                            </td>
                            <td className="p-3 text-start text-neutral-600">
                                2023-10-25 20:20
                            </td>
                            <td className="p-3 font-medium text-neutral-600">
                                <a
                                href="javascript:void(0)"
                                className="underline decoration-neutral-200 decoration-2 underline-offset-4 hover:text-neutral-950 hover:decoration-neutral-300"
                                >Dave Rodriguez</a>
                            </td>
                            <td className="p-3 text-start">
                                Server Timeout Errors During Development
                            </td>
                            <td className="p-3 font-medium">
                                <div
                                className="inline-block rounded-full bg-orange-100 px-2 py-1 text-xs leading-4 font-semibold whitespace-nowrap text-orange-800"
                                >
                                Under Investigation
                                </div>
                            </td>
                            <td className="p-3 text-end font-medium">
                                <a
                                href="javascript:void(0)"
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm leading-5 font-semibold text-neutral-800 hover:border-neutral-300 hover:text-neutral-950 active:border-neutral-200"
                                >
                                <span>View</span>
                                <svg
                                    className="hi-mini hi-arrow-right inline-block size-5 text-neutral-400 group-hover:text-blue-600 group-active:translate-x-0.5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                    fill-rule="evenodd"
                                    d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                                    clip-rule="evenodd"
                                    ></path>
                                </svg>
                                </a>
                            </td>
                            </tr>
                            <tr
                            className="border-b border-neutral-100 hover:bg-neutral-50"
                            >
                            <td
                                className="p-3 text-start font-semibold text-neutral-600"
                            >
                                RN#4580
                            </td>
                            <td className="p-3 text-start text-neutral-600">
                                2023-11-10 14:15
                            </td>
                            <td className="p-3 font-medium text-neutral-600">
                                <a
                                href="javascript:void(0)"
                                className="underline decoration-neutral-200 decoration-2 underline-offset-4 hover:text-neutral-950 hover:decoration-neutral-300"
                                >Helen Thompson</a>
                            </td>
                            <td className="p-3 text-start">
                                Payroll System Access Denied Error
                            </td>
                            <td className="p-3 font-medium">
                                <div
                                className="inline-block rounded-full bg-orange-100 px-2 py-1 text-xs leading-4 font-semibold whitespace-nowrap text-orange-800"
                                >
                                Under Investigation
                                </div>
                            </td>
                            <td className="p-3 text-end font-medium">
                                <a
                                href="javascript:void(0)"
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm leading-5 font-semibold text-neutral-800 hover:border-neutral-300 hover:text-neutral-950 active:border-neutral-200"
                                >
                                <span>View</span>
                                <svg
                                    className="hi-mini hi-arrow-right inline-block size-5 text-neutral-400 group-hover:text-blue-600 group-active:translate-x-0.5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                    fill-rule="evenodd"
                                    d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                                    clip-rule="evenodd"
                                    ></path>
                                </svg>
                                </a>
                            </td>
                            </tr>
                            <tr
                            className="border-b border-neutral-100 hover:bg-neutral-50"
                            >
                            <td
                                className="p-3 text-start font-semibold text-neutral-600"
                            >
                                RN#4579
                            </td>
                            <td className="p-3 text-start text-neutral-600">
                                2023-10-15 09:15
                            </td>
                            <td className="p-3 font-medium text-neutral-600">
                                <a
                                href="javascript:void(0)"
                                className="underline decoration-neutral-200 decoration-2 underline-offset-4 hover:text-neutral-950 hover:decoration-neutral-300"
                                >Peter Williams</a>
                            </td>
                            <td className="p-3 text-start">
                                CRM Tool Lagging and Freezing
                            </td>
                            <td className="p-3 font-medium">
                                <div
                                className="inline-block rounded-full bg-emerald-100 px-2 py-1 text-xs leading-4 font-semibold whitespace-nowrap text-emerald-800"
                                >
                                Closed
                                </div>
                            </td>
                            <td className="p-3 text-end font-medium">
                                <a
                                href="javascript:void(0)"
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm leading-5 font-semibold text-neutral-800 hover:border-neutral-300 hover:text-neutral-950 active:border-neutral-200"
                                >
                                <span>View</span>
                                <svg
                                    className="hi-mini hi-arrow-right inline-block size-5 text-neutral-400 group-hover:text-blue-600 group-active:translate-x-0.5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                    fill-rule="evenodd"
                                    d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                                    clip-rule="evenodd"
                                    ></path>
                                </svg>
                                </a>
                            </td>
                            </tr>
                            <tr
                            className="border-b border-neutral-100 hover:bg-neutral-50"
                            >
                            <td
                                className="p-3 text-start font-semibold text-neutral-600"
                            >
                                RN#4578
                            </td>
                            <td className="p-3 text-start text-neutral-600">
                                2023-10-10 16:30
                            </td>
                            <td className="p-3 font-medium text-neutral-600">
                                <a
                                href="javascript:void(0)"
                                className="underline decoration-neutral-200 decoration-2 underline-offset-4 hover:text-neutral-950 hover:decoration-neutral-300"
                                >Fiona Martinez</a>
                            </td>
                            <td className="p-3 text-start">
                                VPN Disconnections When Working Remotely
                            </td>
                            <td className="p-3 font-medium">
                                <div
                                className="inline-block rounded-full bg-emerald-100 px-2 py-1 text-xs leading-4 font-semibold whitespace-nowrap text-emerald-800"
                                >
                                Closed
                                </div>
                            </td>
                            <td className="p-3 text-end font-medium">
                                <a
                                href="javascript:void(0)"
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm leading-5 font-semibold text-neutral-800 hover:border-neutral-300 hover:text-neutral-950 active:border-neutral-200"
                                >
                                <span>View</span>
                                <svg
                                    className="hi-mini hi-arrow-right inline-block size-5 text-neutral-400 group-hover:text-blue-600 group-active:translate-x-0.5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                    fill-rule="evenodd"
                                    d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                                    clip-rule="evenodd"
                                    ></path>
                                </svg>
                                </a>
                            </td>
                            </tr>
                            <tr
                            className="border-b border-neutral-100 hover:bg-neutral-50"
                            >
                            <td
                                className="p-3 text-start font-semibold text-neutral-600"
                            >
                                RN#4577
                            </td>
                            <td className="p-3 text-start text-neutral-600">
                                2023-10-05 14:00
                            </td>
                            <td className="p-3 font-medium text-neutral-600">
                                <a
                                href="javascript:void(0)"
                                className="underline decoration-neutral-200 decoration-2 underline-offset-4 hover:text-neutral-950 hover:decoration-neutral-300"
                                >Danny Kim</a>
                            </td>
                            <td className="p-3 text-start">
                                Database Query Execution Taking Too Long
                            </td>
                            <td className="p-3 font-medium">
                                <div
                                className="inline-block rounded-full bg-emerald-100 px-2 py-1 text-xs leading-4 font-semibold whitespace-nowrap text-emerald-800"
                                >
                                Closed
                                </div>
                            </td>
                            <td className="p-3 text-end font-medium">
                                <a
                                href="javascript:void(0)"
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm leading-5 font-semibold text-neutral-800 hover:border-neutral-300 hover:text-neutral-950 active:border-neutral-200"
                                >
                                <span>View</span>
                                <svg
                                    className="hi-mini hi-arrow-right inline-block size-5 text-neutral-400 group-hover:text-blue-600 group-active:translate-x-0.5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                    fill-rule="evenodd"
                                    d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                                    clip-rule="evenodd"
                                    ></path>
                                </svg>
                                </a>
                            </td>
                            </tr>
                            <tr
                            className="border-b border-neutral-100 hover:bg-neutral-50"
                            >
                            <td
                                className="p-3 text-start font-semibold text-neutral-600"
                            >
                                RN#4576
                            </td>
                            <td className="p-3 text-start text-neutral-600">
                                2023-10-01 11:45
                            </td>
                            <td className="p-3 font-medium text-neutral-600">
                                <a
                                href="javascript:void(0)"
                                className="underline decoration-neutral-200 decoration-2 underline-offset-4 hover:text-neutral-950 hover:decoration-neutral-300"
                                >Mike Brown</a>
                            </td>
                            <td className="p-3 text-start">
                                Video Conferencing Tool Audio Issues
                            </td>
                            <td className="p-3 font-medium">
                                <div
                                className="inline-block rounded-full bg-emerald-100 px-2 py-1 text-xs leading-4 font-semibold whitespace-nowrap text-emerald-800"
                                >
                                Closed
                                </div>
                            </td>
                            <td className="p-3 text-end font-medium">
                                <a
                                href="javascript:void(0)"
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm leading-5 font-semibold text-neutral-800 hover:border-neutral-300 hover:text-neutral-950 active:border-neutral-200"
                                >
                                <span>View</span>
                                <svg
                                    className="hi-mini hi-arrow-right inline-block size-5 text-neutral-400 group-hover:text-blue-600 group-active:translate-x-0.5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                    fill-rule="evenodd"
                                    d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                                    clip-rule="evenodd"
                                    ></path>
                                </svg>
                                </a>
                            </td>
                            </tr>
                        </tbody>
                        </table>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </main>

        </div>
    </div>
  )
}

export default AdminDashboard