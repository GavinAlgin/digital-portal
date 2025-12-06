import React, { useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
}

const UserDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
    { id: 2, name: "Sarah Connor", email: "sarah@example.com", role: "User", status: "Inactive" },
    { id: 3, name: "Michael Smith", email: "mike@example.com", role: "User", status: "Active" },
  ]);

  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // New user form
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "User",
    status: "Active" as "Active" | "Inactive",
  });

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setEditingUser(null);
    setForm({ name: "", email: "", role: "User", status: "Active" });
    setIsOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setIsOpen(true);
  };

  const saveUser = () => {
    if (editingUser) {
      // UPDATE
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id ? { ...u, ...form } : u
        )
      );
    } else {
      // CREATE
      setUsers((prev) => [
        ...prev,
        { id: Date.now(), ...form },
      ]);
    }
    setIsOpen(false);
  };

  const deleteUser = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  

  return (
    <main id="page-content" className="flex max-w-full flex-auto flex-col">
      {/* HEADER SECTION */}
      <div className="container mx-auto px-4 pt-6 lg:px-8 lg:pt-8 xl:max-w-7xl">
        <div className="flex flex-col gap-2 text-center sm:flex-row sm:items-center sm:justify-between sm:text-start">
          <div className="grow">
            <h1 className="mb-1 text-xl font-bold">Users</h1>
            <h2 className="text-sm font-medium text-neutral-500">
              Manage platform users — Create, update and delete accounts.
            </h2>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 start-0 my-px ms-px flex w-10 items-center justify-center rounded-l-lg text-neutral-500">
                <svg
                  className="hi-mini hi-magnifying-glass inline-block size-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
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
                placeholder="Search users..."
                className="block w-full rounded-lg border border-neutral-200 py-2 ps-10 pe-3 leading-6 placeholder-neutral-500 
                focus:border-neutral-500 focus:ring-3 focus:ring-neutral-500/25"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* ADD USER */}
            <button
              onClick={openAddModal}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 
              text-sm font-semibold text-neutral-800 hover:border-neutral-300 hover:text-neutral-950"
            >
              Add User
            </button>
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="container mx-auto p-4 lg:p-8 xl:max-w-7xl">
        <div className="rounded-lg border border-neutral-200 bg-white">
          <div className="p-5 overflow-x-auto">
            <table className="min-w-full text-sm align-middle">
              <thead>
                <tr className="border-b-2 border-neutral-100">
                  <th className="px-3 py-2 text-start font-semibold text-neutral-700 uppercase">Name</th>
                  <th className="px-3 py-2 text-start font-semibold text-neutral-700 uppercase">Email</th>
                  <th className="px-3 py-2 text-start font-semibold text-neutral-700 uppercase">Role</th>
                  <th className="px-3 py-2 text-start font-semibold text-neutral-700 uppercase">Status</th>
                  <th className="px-3 py-2 text-end font-semibold text-neutral-700 uppercase">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="p-3 font-medium">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.role}</td>
                    <td className="p-3">
                      <div
                        className={`inline-block rounded-full px-2 py-1 text-xs font-semibold
                          ${user.status === "Active" ? "bg-emerald-100 text-emerald-800" : "bg-orange-100 text-orange-800"}`}
                      >
                        {user.status}
                      </div>
                    </td>

                    <td className="p-3 text-end flex justify-end gap-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="px-3 py-1 rounded-lg border border-neutral-200 text-sm hover:border-neutral-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="px-3 py-1 rounded-lg border border-rose-300 text-sm text-rose-600 hover:bg-rose-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-neutral-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ADD/EDIT MODAL */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[999]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl border border-neutral-200">
            <h2 className="text-lg font-bold mb-4">
              {editingUser ? "Edit User" : "Add User"}
            </h2>

            <div className="grid gap-3">
              <input
                className="border rounded-lg p-2 w-full"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                className="border rounded-lg p-2 w-full"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <select
                className="border rounded-lg p-2 w-full"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option>User</option>
                <option>Admin</option>
              </select>

              <select
                className="border rounded-lg p-2 w-full"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as "Active" | "Inactive" })}
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-lg bg-neutral-200 hover:bg-neutral-300"
              >
                Cancel
              </button>
              <button
                onClick={saveUser}
                className="px-4 py-2 rounded-lg bg-neutral-900 text-white hover:bg-neutral-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
};

export default UserDashboard;
