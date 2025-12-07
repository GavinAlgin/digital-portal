import React, { useState, useEffect, useMemo } from "react";
import ListecLogo from "../../assets/cropped-flyer-02102024-133x133.png";
import ActionDropdown from "../../components/ActionDropdown";
import StudentModal from "../../components/StudentModal";
import DeleteModal from "../../components/DeleteModal";
import Header from "./components/Header";
import type { Student } from "../../hooks/types";

const initialStudents: Student[] = [
  { id: "STU-001", name: "John Doe", email: "john@example.com", status: "Active", createdAt: "2025-12-01" },
  { id: "STU-002", name: "Jane Smith", email: "jane@example.com", status: "Suspended", createdAt: "2025-12-02" },
];

export default function StudentDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | "Active" | "Suspended">("All");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setStudents(initialStudents);
      setLoading(false);
    }, 1000);
  }, []);

  const openEditModal = (student: Student) => { setSelectedStudent(student); setShowStudentModal(true); };
  const openAddModal = () => { setSelectedStudent(null); setShowStudentModal(true); };

  const saveStudent = (student: Student) => {
    if (student.id && students.some((s) => s.id === student.id)) {
      setStudents((prev) => prev.map((s) => (s.id === student.id ? student : s)));
    } else {
      const newStudent: Student = {
        ...student,
        id: `STU-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`,
        status: "Active",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setStudents((prev) => [...prev, newStudent]);
    }
    setShowStudentModal(false);
  };

  const openDeleteModalFn = (student: Student) => { setSelectedStudent(student); setShowDeleteModal(true); };
  const deleteStudent = (studentId: string) => { 
    setStudents((prev) => prev.filter((s) => s.id !== studentId)); 
    setShowDeleteModal(false); 
  };

  const toggleSuspend = (student: Student) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === student.id
          ? { ...s, status: s.status === "Active" ? "Suspended" : "Active" }
          : s
      )
    );
  };

  const sendInvitation = (student: Student) => alert(`Invitation email sent to ${student.email}`);
  const sendChangePassword = (student: Student) => alert(`Password reset email sent to ${student.email}`);

  // Real-time search + filter using useMemo
  const filteredStudents = useMemo(() => {
    return students.filter((s) =>
      (filterStatus === "All" || s.status === filterStatus) &&
      (s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase()) ||
        s.id.toLowerCase().includes(search.toLowerCase()))
    );
  }, [students, search, filterStatus]);

  return (
    <div className="min-h-screen bg-gray-50">
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
        userName="Gavin Algin"
        userProfileUrl="#"
      />

      <div className="p-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold">Students</h2>
          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add Student
          </button>
        </div>

        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by name, email or ID..."
            className="border p-2 rounded flex-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as "All" | "Active" | "Suspended")}
            className="border p-2 rounded"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading...</div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No students found.</div>
        ) : (
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Student ID</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Created At</th>
                  <th className="px-4 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td className="px-4 py-2">{student.id}</td>
                    <td className="px-4 py-2">{student.name}</td>
                    <td className="px-4 py-2">{student.email}</td>
                    <td className="px-4 py-2">{student.status}</td>
                    <td className="px-4 py-2">{student.createdAt}</td>
                    <td className="px-4 py-2 text-right">
                      <ActionDropdown
                        student={student}
                        openEditModal={openEditModal}
                        toggleSuspend={toggleSuspend}
                        sendInvitation={sendInvitation}
                        sendChangePassword={sendChangePassword}
                        openDeleteModal={openDeleteModalFn}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showStudentModal && (
        <StudentModal
          student={selectedStudent}
          onClose={() => setShowStudentModal(false)}
          onSave={saveStudent}
        />
      )}

      {showDeleteModal && selectedStudent && (
        <DeleteModal
          student={selectedStudent}
          onClose={() => setShowDeleteModal(false)}
          onDelete={() => deleteStudent(selectedStudent.id)}
        />
      )}
    </div>
  );
}





// import { useState } from "react";
// import ListecLogo from "../../assets/cropped-flyer-02102024-133x133.png";
// import Header from "./components/Header";

// export default function UserDashboard() {
//   const [loading, setLoading] = useState(true);
//   const [students, setStudents] = useState([]);
//   const [showAddModal, setShowAddModal] = useState(false);

//   const [formData, setFormData] = useState({
//     studentId: "",
//     fullName: "",
//     email: "",
//     program: "",
//   });

//   // Simulate loading
//   setTimeout(() => setLoading(false), 800);

//   const handleAddStudent = (e) => {
//     e.preventDefault();

//     const newStudent = {
//       id: Date.now(),
//       ...formData,
//     };

//     setStudents([...students, newStudent]);

//     setFormData({
//       studentId: "",
//       fullName: "",
//       email: "",
//       program: "",
//     });

//     setShowAddModal(false);
//   };

//   return (
//     <>
//       {/* HEADER */}
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
//         userName="Gavin Algin"
//         userProfileUrl="#"
//       />

//       {/* BODY */}
//       <main id="page-content" className="flex max-w-full flex-auto flex-col pt-24">
//         <div className="container mx-auto p-4 lg:p-8 xl:max-w-7xl">

//           {/* Page Header */}
//           <div className="flex justify-between items-center mb-6">
//             <div>
//               <h1 className="text-2xl font-bold">Manage Students</h1>
//               <p className="text-neutral-500 text-sm">
//                 Add, view, and manage registered students.
//               </p>
//             </div>

//             <button
//               onClick={() => setShowAddModal(true)}
//               className="rounded-lg bg-neutral-800 px-4 py-2 font-semibold text-white hover:bg-neutral-700"
//             >
//               + Add Student
//             </button>
//           </div>

//           {/* Loading */}
//           {loading ? (
//             <div className="flex justify-center items-center py-20">
//               <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-neutral-800"></div>
//             </div>
//           ) : (
//             <div className="rounded-lg border border-neutral-200 bg-white shadow-sm">
//               <table className="min-w-full text-sm">
//                 <thead>
//                   <tr className="border-b border-neutral-200 bg-neutral-50">
//                     <th className="px-4 py-3 text-left font-semibold text-neutral-700 uppercase">
//                       Student ID
//                     </th>
//                     <th className="px-4 py-3 text-left font-semibold text-neutral-700 uppercase">
//                       Full Name
//                     </th>
//                     <th className="px-4 py-3 text-left font-semibold text-neutral-700 uppercase">
//                       Email
//                     </th>
//                     <th className="px-4 py-3 text-left font-semibold text-neutral-700 uppercase">
//                       Program
//                     </th>
//                     <th className="px-4 py-3 text-right font-semibold text-neutral-700 uppercase">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {students.length === 0 ? (
//                     <tr>
//                       <td colSpan="5" className="py-6 text-center text-neutral-500">
//                         No students added yet.
//                       </td>
//                     </tr>
//                   ) : (
//                     students.map((student) => (
//                       <tr
//                         key={student.id}
//                         className="border-b border-neutral-100 hover:bg-neutral-50"
//                       >
//                         <td className="px-4 py-3 font-medium">{student.studentId}</td>
//                         <td className="px-4 py-3">{student.fullName}</td>
//                         <td className="px-4 py-3">{student.email}</td>
//                         <td className="px-4 py-3">{student.program}</td>

//                         <td className="px-4 py-3 text-right">
//                           <button className="rounded-md px-3 py-1 text-sm border hover:bg-neutral-100">
//                             Edit
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </main>

//       {/* ADD STUDENT MODAL */}
//       {showAddModal && (
//         <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
//             <h2 className="text-lg font-semibold mb-4">Add Student</h2>

//             <form onSubmit={handleAddStudent} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium">Student ID</label>
//                 <input
//                   type="text"
//                   required
//                   value={formData.studentId}
//                   onChange={(e) =>
//                     setFormData({ ...formData, studentId: e.target.value })
//                   }
//                   className="w-full rounded-lg border border-neutral-300 px-3 py-2 mt-1"
//                   placeholder="e.g. STU-2025-001"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium">Full Name</label>
//                 <input
//                   type="text"
//                   required
//                   value={formData.fullName}
//                   onChange={(e) =>
//                     setFormData({ ...formData, fullName: e.target.value })
//                   }
//                   className="w-full rounded-lg border border-neutral-300 px-3 py-2 mt-1"
//                   placeholder="e.g. John Doe"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium">Email</label>
//                 <input
//                   type="email"
//                   required
//                   value={formData.email}
//                   onChange={(e) =>
//                     setFormData({ ...formData, email: e.target.value })
//                   }
//                   className="w-full rounded-lg border border-neutral-300 px-3 py-2 mt-1"
//                   placeholder="email@example.com"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium">Program</label>
//                 <input
//                   type="text"
//                   required
//                   value={formData.program}
//                   onChange={(e) =>
//                     setFormData({ ...formData, program: e.target.value })
//                   }
//                   className="w-full rounded-lg border border-neutral-300 px-3 py-2 mt-1"
//                   placeholder="e.g. Networking, Software Engineering"
//                 />
//               </div>

//               <div className="flex justify-end gap-2 mt-4">
//                 <button
//                   type="button"
//                   onClick={() => setShowAddModal(false)}
//                   className="px-4 py-2 rounded-lg border hover:bg-neutral-100"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   className="px-4 py-2 rounded-lg bg-neutral-800 text-white font-semibold hover:bg-neutral-700"
//                 >
//                   Add Student
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }
