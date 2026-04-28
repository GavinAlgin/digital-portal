// import { useState, useRef, useEffect } from "react";
// import { LucideAArrowDown, LucideArrowBigDown, LucideArrowDown, LucideArrowDown01, Search as LucideSearch } from "lucide-react";
// import AppSidebar from "../../components/Side-bar";
// import TicketCard from "./components/TicketCard";

// const ITWorkbenchDashboard = () => {
//   const [search, setSearch] = useState("");
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [filterType, setFilterType] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [actionOpen, setActionOpen] = useState(null);

//   const selectAllRef = useRef(null);

//   // ✅ Updated data (matches table columns)
//   const [data, setData] = useState([
//     {
//       id: 1,
//       name: "Lenovo ThinkCentre SFF",
//       status: "Online",
//       freeSize: 120,
//       ram: "8GB",
//       temperature: "45°C",
//       type: "Desktop",
//     },
//     {
//       id: 2,
//       name: "Microsoft Surface Pro",
//       status: "Offline",
//       freeSize: 60,
//       ram: "16GB",
//       temperature: "—",
//       type: "Laptop",
//     },
//     {
//       id: 3,
//       name: "Dell OptiPlex",
//       status: "Online",
//       freeSize: 300,
//       ram: "32GB",
//       temperature: "50°C",
//       type: "Desktop",
//     },
//   ]);

//   // ✅ Real filtering
//   const filteredData = data.filter((item) =>
//     item.name.toLowerCase().includes(search.toLowerCase()) &&
//     (!filterType ||
//       (filterType === "RAM" && item.ram === "16GB") ||
//       (filterType === "TYPE" && item.type === "Desktop") ||
//       (filterType === "STORAGE" && item.freeSize > 100))
//   );

//   const toggleRow = (id) => {
//     setSelectedRows((prev) =>
//       prev.includes(id)
//         ? prev.filter((row) => row !== id)
//         : [...prev, id]
//     );
//   };

//   const toggleAll = () => {
//     if (selectedRows.length === filteredData.length) {
//       setSelectedRows([]);
//     } else {
//       setSelectedRows(filteredData.map((item) => item.id));
//     }
//   };

//   useEffect(() => {
//     if (selectAllRef.current) {
//       selectAllRef.current.indeterminate =
//         selectedRows.length > 0 &&
//         selectedRows.length < filteredData.length;
//     }
//   }, [selectedRows, filteredData]);

//   return (
//     <div className="flex">
//       <AppSidebar />

//       <main className="container mx-auto mt-2 p-4 lg:p-8 xl:max-w-7xl">
        
//         {/* Header */}
//         <div className="flex flex-col gap-2">
//           <h1 className="text-xl font-bold">Workbench Dashboard</h1>
//           <p className="text-sm text-neutral-500">
//             Workbench dashboard that manages and monitors computers connected
//           </p>
//         </div>

        
//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-2 lg:grid-cols-4">
//           <TicketCard
//             title="Total Connected Computers"
//             count="22"
//             description="Connected Computers Submissions"
//             percentage="+12%"
//           />

//           <TicketCard
//             title="Troubleshooting"
//             count="4"
//             description="No read tracking yet"
//             percentage="+5%"
//           />

//           <TicketCard
//             title="Users"
//             count="22"
//             description="Registered Users"
//             percentage="+20%"
//           />

//           <TicketCard
//             title="System Status"
//             count="1"
//             description="Admin Login"
//             percentage="Online"
//           />
//         </div>

//         <div className="bg-white rounded-xl border border-gray-200 mt-4">
          
//           {/* Top Controls */}
//           <div className="p-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200">
            
//             {/* Search */}
//             <div className="relative w-full max-w-sm">
//               <span className="absolute left-3 top-2.5 text-gray-400">
//                 <LucideSearch size={20} />
//               </span>
//               <input
//                 type="text"
//                 className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 outline-none"
//                 placeholder="Search computers..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//             </div>

//             {/* Filter + Add */}
//             <div className="flex gap-2 relative">
//               <button
//                 onClick={() => setDropdownOpen((prev) => !prev)}
//                 className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg flex items-center gap-3.5">
//                 Filter <LucideArrowDown01 size={20} color="lightgray" />
//               </button>

//               <button
//                 onClick={() => setShowModal(true)}
//                 className="px-4 py-2 text-sm bg-black text-white rounded-lg">
//                 + Add Computer
//               </button>

//               {dropdownOpen && (
//                 <div className="absolute right-26 mt-12 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
//                   {[
//                     { label: "Reset filter", value: "ALL" },
//                     { label: "RAM (16GB)", value: "RAM" },
//                     { label: "Desktop Only", value: "TYPE" },
//                     { label: "Storage > 100GB", value: "STORAGE" },
//                   ].map((item) => (
//                     <button
//                       key={item.value}
//                       onClick={() => {
//                         setFilterType(item.value);
//                         setDropdownOpen(false);
//                       }}
//                       className="block w-full text-left px-4 py-2 text-s justify-between gap-3.5 hover:bg-gray-100">
//                       <input type="checkbox" name="" id="" className="gap-3.5" />
//                       {item.label}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Table */}
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm text-gray-700">
              
//               <thead className="bg-gray-50 border-b border-gray-400">
//                 <tr>
//                   <th className="p-4">
//                     <input
//                       type="checkbox"
//                       ref={selectAllRef}
//                       checked={
//                         filteredData.length > 0 &&
//                         selectedRows.length === filteredData.length
//                       }
//                       onChange={toggleAll}
//                     />
//                   </th>
//                   <th className="px-6 py-3 text-left font-semibold">Product</th>
//                   <th className="px-6 py-3 text-left font-semibold">Status</th>
//                   <th className="px-6 py-3 text-left font-semibold">Free Size Left</th>
//                   <th className="px-6 py-3 text-left font-semibold">Ram</th>
//                   <th className="px-6 py-3 text-left font-semibold">Tempurature</th>
//                   <th className="px-6 py-3 text-left font-semibold">Action</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {filteredData.map((item) => (
//                   <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                    
//                     <td className="p-4">
//                       <input
//                         type="checkbox"
//                         checked={selectedRows.includes(item.id)}
//                         onChange={() => toggleRow(item.id)}
//                       />
//                     </td>

//                     <td className="px-6 py-4 font-medium text-gray-900">
//                       {item.name}
//                     </td>

//                     <td className="px-6 py-4">{item.status}</td>
//                     <td className="px-6 py-4">{item.freeSize} GB</td>
//                     <td className="px-6 py-4">{item.ram}</td>
//                     <td className="px-6 py-4">{item.temperature}</td>

//                     {/* Action menu */}
//                     <td className="px-6 py-4 relative">
//                       <button onClick={() => setActionOpen(item.id)}>
//                         ⋮
//                       </button>

//                       {actionOpen === item.id && (
//                         <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow">
//                           <button className="block w-full text-left px-3 py-2 hover:bg-gray-100">
//                             View Logs
//                           </button>
//                           <button className="block w-full text-left px-3 py-2 text-red-500 hover:bg-gray-100">
//                             Disconnect
//                           </button>
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 ))}

//                 {filteredData.length === 0 && (
//                   <tr>
//                     <td colSpan="7" className="text-center py-6 text-gray-400">
//                       No results found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>

//             </table>
//           </div>
//         </div>

//         {/* Modal */}
//         {showModal && (
//           <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded-lg w-96">
//               <h2 className="font-bold mb-4">Scan Network</h2>

//               {[
//                 { name: "Office-PC-01", ram: "16GB", type: "Desktop" },
//                 { name: "Dev-Laptop-02", ram: "8GB", type: "Laptop" },
//               ].map((pc, i) => (
//                 <div key={i} className="flex justify-between mb-2">
//                   <span>{pc.name}</span>
//                   <button
//                     className="text-blue-500"
//                     onClick={() => {
//                       setData((prev) => [
//                         ...prev,
//                         {
//                           id: Date.now(),
//                           name: pc.name,
//                           status: "Online",
//                           freeSize: 200,
//                           ram: pc.ram,
//                           temperature: "40°C",
//                           type: pc.type,
//                         },
//                       ]);
//                       setShowModal(false);
//                     }}
//                   >
//                     Add
//                   </button>
//                 </div>
//               ))}

//               <button
//                 onClick={() => setShowModal(false)}
//                 className="mt-4 text-sm text-gray-500"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         )}

//       </main>
//     </div>
//   );
// };

// export default ITWorkbenchDashboard;
import { useState } from "react";
import { sendCommand } from "../../hooks/api";
import { useAgents } from "../../hooks/api/useAgents";
// import { useAgents } from "../hooks/useAgents";
// import { sendCommand } from "../api";

export default function Dashboard() {
  const { agents } = useAgents();
  const [search, setSearch] = useState("");

  const filtered = agents.filter((a: any) =>
    a.hostname?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      
      {/* Sidebar */}
      <div className="w-64 border-r border-zinc-800 p-4">
        <h1 className="text-lg font-semibold">Intune Lite</h1>
        <p className="text-xs text-zinc-400 mt-2">
          Device Management Console
        </p>
      </div>

      {/* Main */}
      <div className="flex-1 p-6">

        {/* Topbar */}
        <div className="flex justify-between items-center mb-6">
          <input
            placeholder="Search devices..."
            className="bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-md w-80"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="border border-zinc-800 rounded-lg overflow-hidden">

          <table className="w-full text-sm">
            <thead className="bg-zinc-900 text-zinc-400">
              <tr>
                <th className="text-left p-3">Device</th>
                <th>Status</th>
                <th>OS</th>
                <th>RAM</th>
                <th>Disk</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((a: any) => (
                <tr
                  key={a.agent_id}
                  className="border-t border-zinc-800 hover:bg-zinc-900"
                >
                  <td className="p-3 font-medium">
                    {a.hostname}
                  </td>

                  <td>
                    <span className="text-green-400">
                      {a.meta?.status || "online"}
                    </span>
                  </td>

                  <td>{a.os}</td>

                  <td>
                    {a.meta?.metrics?.total_ram_gb || "-"} GB
                  </td>

                  <td>
                    {a.meta?.metrics?.free_disk_gb || "-"} GB
                  </td>

                  <td className="flex gap-2 p-2">

                    <button
                      className="px-2 py-1 text-xs bg-blue-600 rounded"
                      onClick={() =>
                        sendCommand(a.agent_id, "ping")
                      }
                    >
                      Ping
                    </button>

                    <button
                      className="px-2 py-1 text-xs bg-red-600 rounded"
                      onClick={() =>
                        sendCommand(a.agent_id, "shutdown")
                      }
                    >
                      Shutdown
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>
    </div>
  );
}