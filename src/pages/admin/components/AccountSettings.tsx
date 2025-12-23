import { useState } from "react";
import { supabase } from "../../../hooks/supabase/supabaseClient";

export default function Settings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const user = supabase.auth.getUser();

  const handlePasswordChange = async () => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = confirm(
      "This will permanently delete your account. Continue?"
    );
    if (!confirmed) return;

    const { error } = await supabase.rpc("delete_user");

    if (error) alert(error.message);
    else alert("Account deleted");
  };

  return (
    <div className="mx-4 min-h-screen max-w-screen-xl sm:mx-8 xl:mx-auto">
      <h1 className="border-b py-6 text-4xl font-semibold">Settings</h1>

      <div className="grid grid-cols-8 pt-3 sm:grid-cols-10">
        {/* Sidebar */}
        <div className="col-span-2 hidden sm:block">
          <ul>
            {[
              "Teams",
              "Accounts",
              "Users",
              "Profile",
              "Billing",
              "Notifications",
              "Integrations",
            ].map((item) => (
              <li
                key={item}
                className={`mt-5 cursor-pointer border-l-2 px-2 py-2 font-semibold transition ${
                  item === "Accounts"
                    ? "border-l-blue-700 text-blue-700"
                    : "border-transparent hover:border-l-blue-700 hover:text-blue-700"
                }`}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Content */}
        <div className="col-span-8 rounded-xl sm:bg-gray-50 sm:px-8 sm:shadow">
          <h2 className="py-4 text-2xl font-semibold">Account settings</h2>
          <hr className="mb-8" />

          {/* Email */}
          <p className="py-2 text-xl font-semibold">Email Address</p>
          <p className="text-gray-600">
            Your email address is{" "}
            <strong>{(await user).data.user?.email}</strong>
          </p>

          <hr className="my-8" />

          {/* Password */}
          <p className="py-2 text-xl font-semibold">Password</p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="rounded-md border px-4 py-2"
            />
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="rounded-md border px-4 py-2"
            />
          </div>

          <button
            onClick={handlePasswordChange}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Save Password
          </button>

          <hr className="my-8" />

          {/* Delete */}
          <p className="py-2 text-xl font-semibold">Delete Account</p>

          <p className="rounded-full bg-rose-100 px-4 py-1 text-rose-600 inline-flex items-center">
            Proceed with caution
          </p>

          <p className="mt-2 text-gray-700">
            This action permanently deletes your account and data.
          </p>

          <button
            onClick={handleDeleteAccount}
            className="mt-4 text-sm font-semibold text-rose-600 underline"
          >
            Continue with deletion
          </button>
        </div>
      </div>
    </div>
  );
}
