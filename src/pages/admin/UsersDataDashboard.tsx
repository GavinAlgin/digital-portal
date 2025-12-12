import { useEffect, useState } from "react";
import ListecLogo from "../../assets/cropped-flyer-02102024-133x133.png";
import Header from "./components/Header";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, type User } from "../../hooks/context/AdminLogged";
import { supabase } from "../../hooks/supabase/supabaseClient";


type Student = {
  id: string;
  studentId: string;
  fullName: string;
  email: string;
  program: string;
};

export default function UserDashboard() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  // FETCH LOGGED-IN USER
  useEffect(() => {
    const fetchUser = async () => {
      const loggedUser = await getCurrentUser();
      setUser(loggedUser);
    };
    fetchUser();
  }, []);

  // FETCH USERS FROM SUPABASE
  useEffect(() => {
    const fetchStudents = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, id_number, first_name, last_name, email, course");

      if (error) {
        console.error("Error fetching students:", error);
        setLoading(false);
        return;
      }

      // Format data for your table
      const formatted = data.map((s) => ({
        id: s.id,
        studentId: s.id_number,
        fullName: `${s.first_name} ${s.last_name}`,
        email: s.email,
        program: s.course,
      }));

      setStudents(formatted);
      setLoading(false);
    };

    fetchStudents();
  }, []);

  if (!user) return <p>Loading or not logged in...</p>;

  return (
    <>
      {/* HEADER */}
      <Header
        logo={ListecLogo}
        logoText="LISTEC"
        navItems={[
          { label: "Dashboard", href: "/admin" },
          { label: "Tickets", href: "/admin/tickets" },
          { label: "Reports", href: "#" },
          { label: "Users", href: "/admin/users" },
        ]}
        notificationsCount={3}
        userName={user.first_name ?? user.email ?? "User"}
        userProfileUrl="https://avatar.iran.liara.run/username?username=[firstname+lastname]"
      />

      {/* BODY */}
      <main id="page-content" className="flex max-w-full flex-auto flex-col pt-24">
        <div className="container mx-auto p-4 lg:p-8 xl:max-w-7xl">

          {/* Page Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Manage Students</h1>
              <p className="text-neutral-500 text-sm">
                Add, view, and manage registered students.
              </p>
            </div>

            <button
              onClick={() => navigate('/admin/register')}
              className="rounded-lg bg-neutral-800 px-4 py-2 font-semibold text-white hover:bg-neutral-700">
              + Add Student
            </button>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-neutral-800"></div>
            </div>
          ) : (
            <div className="rounded-lg border border-neutral-200 bg-white shadow-sm">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    <th className="px-4 py-3 text-left font-semibold text-neutral-700 uppercase">
                      Student ID
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-neutral-700 uppercase">
                      Full Name
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-neutral-700 uppercase">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-neutral-700 uppercase">
                      Program
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-neutral-700 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-6 text-center text-neutral-500">
                        No students found.
                      </td>
                    </tr>
                  ) : (
                    students.map((student) => (
                      <tr
                        key={student.id}
                        className="border-b border-neutral-100 hover:bg-neutral-50">
                        <td className="px-4 py-3 font-medium">{student.studentId}</td>
                        <td className="px-4 py-3">{student.fullName}</td>
                        <td className="px-4 py-3">{student.email}</td>
                        <td className="px-4 py-3">{student.program}</td>

                        <td className="px-4 py-3 text-right">
                          <button className="rounded-md px-3 py-1 text-sm border hover:bg-neutral-100">
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </>
  );
}



// import React, { useState, useEffect, useMemo } from "react";
// import ListecLogo from "../../assets/cropped-flyer-02102024-133x133.png";
// import ActionDropdown from "../../components/ActionDropdown";
// import StudentModal from "../../components/StudentModal";
// import DeleteModal from "../../components/DeleteModal";
// import Header from "./components/Header";
// import type { Student } from "../../hooks/types";
// import { getCurrentUser, type User } from "../../hooks/context/AdminLogged";
// import {
//   addStudent,
//   fetchStudents,
//   removeStudent,
//   toggleStudentStatus,
//   updateStudent,
// } from "../../hooks/supabase/supabaseActions";

// export default function StudentDashboard() {
//   const [students, setStudents] = useState<Student[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [filterStatus, setFilterStatus] =
//     useState<"All" | "Active" | "Suspended">("All");

//   const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
//   const [showStudentModal, setShowStudentModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [user, setUser] = useState<User | null>(null);

//   /* ----------------------- LOAD CURRENT USER ----------------------- */
//   useEffect(() => {
//     const fetchUser = async () => {
//       const loggedUser = await getCurrentUser();
//       setUser(loggedUser);
//     };
//     fetchUser();
//   }, []);

//   /* ----------------------- LOAD STUDENTS ----------------------- */
//   useEffect(() => {
//     const loadStudents = async () => {
//       const { data, error } = await fetchStudents();
//       if (error) {
//         console.error("Failed to load students:", error);
//       } else if (data) {
//         setStudents(data);
//       }
//       setLoading(false);
//     };
//     loadStudents();
//   }, []);

//   /* ----------------------- MODAL CONTROLS ----------------------- */
//   const openEditModal = (student: Student) => {
//     setSelectedStudent(student);
//     setShowStudentModal(true);
//   };

//   const openAddModal = () => {
//     setSelectedStudent(null);
//     setShowStudentModal(true);
//   };

//   const openDeleteModalFn = (student: Student) => {
//     setSelectedStudent(student);
//     setShowDeleteModal(true);
//   };

//   /* ----------------------- SAVE STUDENT ----------------------- */
//   const saveStudent = async (student: Student) => {
//     if (student.id) {
//       // UPDATE
//       const { error } = await updateStudent(student);
//       if (!error) {
//         setStudents((prev) =>
//           prev.map((s) => (s.id === student.id ? student : s))
//         );
//       }
//     } else {
//       // CREATE
//       const { data, error } = await addStudent(student);
//       if (!error && data) {
//         setStudents((prev) => [...prev, data[0]]);
//       }
//     }
//     setShowStudentModal(false);
//   };

//   /* ----------------------- DELETE STUDENT ----------------------- */
//   const deleteStudent = async (id: string) => {
//     const { error } = await removeStudent(id);
//     if (!error) {
//       setStudents((prev) => prev.filter((s) => s.id !== id));
//     }
//     setShowDeleteModal(false);
//   };

//   /* ----------------------- SUSPEND / ACTIVATE ----------------------- */
//   const toggleSuspend = async (student: Student) => {
//     const { error } = await toggleStudentStatus(student);
//     if (!error) {
//       setStudents((prev) =>
//         prev.map((s) =>
//           s.id === student.id
//             ? { ...s, status: s.status === "Active" ? "Suspended" : "Active" }
//             : s
//         )
//       );
//     }
//   };

//   /* ----------------------- EMAIL ACTIONS ----------------------- */
//   const sendInvitation = (student: Student) =>
//     alert(`Invitation email sent to ${student.email}`);

//   const sendChangePassword = (student: Student) =>
//     alert(`Password reset email sent to ${student.email}`);

//   /* ----------------------- SEARCH + FILTER ----------------------- */
//   const filteredStudents = useMemo(() => {
//     return students.filter((s) => {
//       const fullName =
//         `${s.first_name ?? ""} ${s.last_name ?? ""}`.trim().toLowerCase();

//       return (
//         (filterStatus === "All" || s.status === filterStatus) &&
//         (fullName.includes(search.toLowerCase()) ||
//           (s.email ?? "").toLowerCase().includes(search.toLowerCase()) ||
//           (s.id ?? "").toLowerCase().includes(search.toLowerCase()))
//       );
//     });
//   }, [students, search, filterStatus]);

//   /* ----------------------- AUTH HANDLING ----------------------- */
//   if (!user)
//     return <div className="p-10 text-center text-red-600">Not logged in.</div>;

//   /* ----------------------- UI ----------------------- */
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header
//         logo={ListecLogo}
//         logoText="LISTEC"
//         navItems={[
//           { label: "Dashboard", href: "/admin" },
//           { label: "Tickets", href: "/admin/tickets" },
//           { label: "Reports", href: "#" },
//           { label: "Users", href: "/admin/users" },
//         ]}
//         notificationsCount={3}
//         userName={user.email}
//         userProfileUrl="#"
//       />

//       <div className="p-6 mt-18">
//         <div className="flex justify-between mb-4">
//           <h2 className="text-2xl font-bold">Students</h2>
//           <button
//             onClick={openAddModal}
//             className="bg-black text-white px-4 py-2 rounded hover:bg-blue-700">
//             + Add Student
//           </button>
//         </div>

//         {/* Search & Filter */}
//         <div className="flex gap-4 mb-4">
//           <input
//             type="text"
//             placeholder="Search by name, email or ID..."
//             className="border p-2 rounded flex-1"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//           <select
//             value={filterStatus}
//             onChange={(e) =>
//               setFilterStatus(e.target.value as "All" | "Active" | "Suspended")
//             }
//             className="border p-2 rounded"
//           >
//             <option value="All">All Status</option>
//             <option value="Active">Active</option>
//             <option value="Suspended">Suspended</option>
//           </select>
//         </div>

//         {/* Table */}
//         {loading ? (
//           <div className="text-center py-10 text-gray-500">Loading...</div>
//         ) : filteredStudents.length === 0 ? (
//           <div className="text-center py-10 text-gray-500">
//             No students found.
//           </div>
//         ) : (
//           <div className="overflow-x-auto bg-white shadow rounded-lg">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="px-4 py-2 text-left">Student ID</th>
//                   <th className="px-4 py-2 text-left">Name</th>
//                   <th className="px-4 py-2 text-left">Email</th>
//                   <th className="px-4 py-2 text-left">Status</th>
//                   <th className="px-4 py-2 text-left">Created At</th>
//                   <th className="px-4 py-2 text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {filteredStudents.map((s) => (
//                   <tr key={s.id}>
//                     <td className="px-4 py-2">{s.id}</td>
//                     <td className="px-4 py-2">
//                       {s.first_name} {s.last_name}
//                     </td>
//                     <td className="px-4 py-2">{s.email}</td>
//                     <td className="px-4 py-2">{s.status}</td>
//                     <td className="px-4 py-2">
//                       {s.created_at
//                         ? new Date(s.created_at).toLocaleDateString()
//                         : ""}
//                     </td>
//                     <td className="px-4 py-2 text-right">
//                       <ActionDropdown
//                         student={s} // PASS FULL STUDENT OBJECT
//                         openEditModal={openEditModal}
//                         toggleSuspend={toggleSuspend}
//                         sendInvitation={sendInvitation}
//                         sendChangePassword={sendChangePassword}
//                         openDeleteModal={openDeleteModalFn}
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {showStudentModal && (
//         <StudentModal
//           student={selectedStudent}
//           onClose={() => setShowStudentModal(false)}
//           onSave={saveStudent}
//         />
//       )}

//       {showDeleteModal && selectedStudent && (
//         <DeleteModal
//           student={selectedStudent} 
//           onClose={() => setShowDeleteModal(false)}
//           onDelete={() => deleteStudent(selectedStudent.id)}
//         />
//       )}
//     </div>
//   );
// }