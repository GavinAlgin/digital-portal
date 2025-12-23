// import { useState } from "react";

// export default function UserModal({ user, onClose, onUpdated }) {
//   const [form, setForm] = useState(user);
//   const [loading, setLoading] = useState(false);

//   const sendConfirmation = async () => {
//     setLoading(true);
//     await fetch(`/api/admin/users/${user.id}/send-confirmation`, {
//       method: "POST",
//     });
//     setLoading(false);
//     alert("Confirmation email sent");
//   };

//   const saveUser = async () => {
//     await fetch(`/api/admin/users/${user.id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(form),
//     });
//     onUpdated();
//     onClose();
//   };

//   const deleteUser = async () => {
//     if (!confirm("Delete user?")) return;
//     await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
//     onUpdated();
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg w-full max-w-lg p-6">
//         <h2 className="text-xl font-bold mb-4">Manage User</h2>

//         <input
//           className="w-full mb-3 border px-3 py-2 rounded"
//           value={form.fullName}
//           onChange={(e) => setForm({ ...form, fullName: e.target.value })}
//         />

//         <input
//           className="w-full mb-3 border px-3 py-2 rounded"
//           value={form.email}
//           onChange={(e) => setForm({ ...form, email: e.target.value })}
//         />

//         <div className="flex justify-between mt-6">
//           <button
//             onClick={deleteUser}
//             className="text-red-600 font-semibold"
//           >
//             Delete
//           </button>

//           <div className="space-x-2">
//             <button
//               onClick={sendConfirmation}
//               disabled={loading}
//               className="px-4 py-2 border rounded"
//             >
//               Send Confirmation Email
//             </button>

//             <button
//               onClick={saveUser}
//               className="px-4 py-2 bg-neutral-800 text-white rounded"
//             >
//               Save
//             </button>
//           </div>
//         </div>

//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-neutral-500"
//         >
//           ✕
//         </button>
//       </div>
//     </div>
//   );
// }
