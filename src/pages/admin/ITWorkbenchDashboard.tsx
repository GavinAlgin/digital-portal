// import { useState, useRef, useEffect, useMemo } from "react";
// import { LucideArrowDown01, Search as LucideSearch } from "lucide-react";
// import AppSidebar from "../../components/Side-bar";
// import TicketCard from "./components/TicketCard";
// import { sendCommand } from "../../hooks/api";
// import { useDashboardSocket } from "../../hooks/api/useSocket";

// const ITWorkbenchDashboard = () => {
//   const [search, setSearch] = useState("");
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [filterType, setFilterType] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [actionOpen, setActionOpen] = useState(null);
//   const { agents } = useDashboardSocket();
//   const [loadingCmd, setLoadingCmd] = useState(null);

//   const selectAllRef = useRef(null);

//   // ✅ Updated data (matches table columns)
//   // const [data, setData] = useState([
//   //   {
//   //     id: 1,
//   //     name: "Lenovo ThinkCentre SFF",
//   //     status: "Online",
//   //     freeSize: 120,
//   //     ram: "8GB",
//   //     temperature: "45°C",
//   //     type: "Desktop",
//   //   },
//   //   {
//   //     id: 2,
//   //     name: "Microsoft Surface Pro",
//   //     status: "Offline",
//   //     freeSize: 60,
//   //     ram: "16GB",
//   //     temperature: "—",
//   //     type: "Laptop",
//   //   },
//   //   {
//   //     id: 3,
//   //     name: "Dell OptiPlex",
//   //     status: "Online",
//   //     freeSize: 300,
//   //     ram: "32GB",
//   //     temperature: "50°C",
//   //     type: "Desktop",
//   //   },
//   // ]);
//   const handleCommand = async (agentId, command) => {

//   setLoadingCmd(agentId + command);

//       try {
//         await sendCommand(agentId, command);
//       } catch (err) {
//         console.error(err);
//       }

//       setLoadingCmd(null);
//   };

//   const refreshDevice = async (agentId) => {
//     try {
//       await fetch(`http://localhost:8000/api/refresh/${agentId}`, {
//         method: "POST"
//       });
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // 🔥 STABLE MAP (prevents flicker/disappear)
//   const stableAgents = useMemo(() => {
//     const map = new Map();

//     agents.forEach((a) => {
//       map.set(a.agent_id, {
//         id: a.agent_id,
//         name: a.hostname,
//         lastSeen: a.last_seen,
//         disk: a.metrics?.disk || 0,
//         ram: a.metrics?.ram || 0,
//         cpu: a.metrics?.cpu || 0,
//       });
//   });

//     return Array.from(map.values());
//   }, [agents]);

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
//             count={stableAgents.length}
//             description="Connected Computers Submissions"
//             percentage="+12%"
//           />

//           <TicketCard
//             title="Online"
//             count={stableAgents.filter(a => isOnline(a.lastSeen)).length}
//             description="No read tracking yet"
//             percentage="+5%"
//           />

//           <TicketCard
//             title="Offline"
//             count={stableAgents.filter(a => !isOnline(a.lastSeen)).length}
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
//                   <th className="px-6 py-3 text-left font-semibold">Computer Name</th>
//                   <th className="px-6 py-3 text-left font-semibold">Status</th>
//                   <th className="px-6 py-3 text-left font-semibold">Free Size Left</th>
//                   <th className="px-6 py-3 text-left font-semibold">Ram</th>
//                   <th className="px-6 py-3 text-left font-semibold">Wi-Fi</th>
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
//                       {device.name}
//                     </td>

//                     <td className="px-6 py-4">
//                     <span className={online ? "text-green-600" : "text-red-500"}>
//                          {online ? "Online" : "Offline"}
//                     </span>
//                     </td>
//                     <td className="px-6 py-4">{device.disk} GB</td>
//                     <td className="px-6 py-4">{device.ram}%</td>
//                     <td className="px-6 py-4">{device.temperature}%</td>

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
//                           <button onClick={() => refreshDevice(device.id)} className="block w-full text-left px-3 py-2 text-red-500 hover:bg-gray-100">
//                             Refresh 
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

// const isOnline = (lastSeen) => {
//   if (!lastSeen) return false;
//   const diff = (Date.now() - new Date(lastSeen).getTime()) / 1000;
//   return diff < 15;
// };

// export default ITWorkbenchDashboard;

// import { useState, useMemo } from "react";
// import AppSidebar from "../../components/Side-bar";
// import TicketCard from "./components/TicketCard";
// import { sendCommand } from "../../hooks/api";
// import { useDashboardSocket } from "../../hooks/api/useSocket";

// const Dashboard = () => {
//   const { agents } = useDashboardSocket();
//   const [loadingCmd, setLoadingCmd] = useState(null);

//   const handleCommand = async (agentId, command) => {
//     setLoadingCmd(agentId + command);

//     try {
//       await sendCommand(agentId, command);
//     } catch (err) {
//       console.error(err);
//     }

//     setLoadingCmd(null);
//   };

//   const refreshDevice = async (agentId) => {
//     try {
//       await fetch(`http://localhost:8000/api/refresh/${agentId}`, {
//         method: "POST"
//       });
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // 🔥 STABLE MAP (prevents flicker/disappear)
//   const stableAgents = useMemo(() => {
//     const map = new Map();

//     agents.forEach((a) => {
//       map.set(a.agent_id, {
//         id: a.agent_id,
//         name: a.hostname,
//         lastSeen: a.last_seen,
//         disk: a.metrics?.disk || 0,
//         ram: a.metrics?.ram || 0,
//         cpu: a.metrics?.cpu || 0,
//       });
//     });

//     return Array.from(map.values());
//   }, [agents]);

//   return (
//     <div className="flex">
//       <AppSidebar />

//       <main className="container mx-auto p-6">
//         <h1 className="text-xl font-bold mb-4">
//           Workbench Dashboard (Live)
//         </h1>

//         {/* Stats */}
//         <div className="grid grid-cols-4 gap-4 mb-6">
//           <TicketCard title="Total Devices" count={stableAgents.length} description="" />
//           <TicketCard
//             title="Online"
//             count={stableAgents.filter(a => isOnline(a.lastSeen)).length}
//             description=""
//           />
//           <TicketCard
//             title="Offline"
//             count={stableAgents.filter(a => !isOnline(a.lastSeen)).length}
//             description=""
//           />
//           <TicketCard
//             title="Commands Running"
//             count={loadingCmd ? 1 : 0}
//             description=""
//           />
//         </div>

//         {/* Table */}
//         <div className="bg-white rounded-xl border">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-3 text-left">Device</th>
//                 <th>Status</th>
//                 <th>Disk</th>
//                 <th>RAM</th>
//                 <th>CPU</th>
//                 <th>Actions</th>
//                 <th>
//                   <button
//   onClick={() => refreshDevice(device.id)}
//   className="px-2 py-1 bg-blue-500 text-white rounded"
// >
//   Refresh
// </button>
//                 </th>
//               </tr>
//             </thead>

//             <tbody>
//               {stableAgents.map((device) => {
//                 const online = isOnline(device.lastSeen);

//                 return (
//                   <tr key={device.id} className="border-t">
//                     <td className="p-3">{device.name}</td>

//                     <td>
//                       <span className={online ? "text-green-600" : "text-red-500"}>
//                         {online ? "Online" : "Offline"}
//                       </span>
//                     </td>

//                     <td>{device.disk} GB</td>
//                     <td>{device.ram}%</td>
//                     <td>{device.cpu}%</td>

//                     <td>
//                       <div className="flex gap-2">

//                         <button
//                           disabled={!online}
//                           onClick={() => handleCommand(device.id, "ping")}
//                           className="px-2 py-1 bg-gray-200 rounded"
//                         >
//                           Ping
//                         </button>

//                         <button
//                           disabled={!online}
//                           onClick={() => handleCommand(device.id, "restart")}
//                           className="px-2 py-1 bg-yellow-500 text-white rounded"
//                         >
//                           Restart
//                         </button>

//                         <button
//                           disabled={!online}
//                           onClick={() => handleCommand(device.id, "shutdown")}
//                           className="px-2 py-1 bg-red-600 text-white rounded"
//                         >
//                           Shutdown
//                         </button>

//                         {loadingCmd === device.id + "shutdown" && (
//                           <span className="text-xs">Sending...</span>
//                         )}

//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </main>
//     </div>
//   );
// };

// // -----------------------
// const isOnline = (lastSeen) => {
//   if (!lastSeen) return false;
//   const diff = (Date.now() - new Date(lastSeen).getTime()) / 1000;
//   return diff < 15;
// };

// export default Dashboard;

import { useState, useRef, useEffect, useMemo } from "react";
import { LucideArrowDown01, Search as LucideSearch } from "lucide-react";
import AppSidebar from "../../components/Side-bar";
import TicketCard from "./components/TicketCard";
import { sendCommand } from "../../hooks/api";
import { useDashboardSocket } from "../../hooks/api/useSocket";

type Device = {
  id: string;
  name: string;
  lastSeen?: string;
  disk: number;
  ram: number;
  cpu: number;
};

const ITWorkbenchDashboard = () => {
  const [search, setSearch] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [actionOpen, setActionOpen] = useState<string | null>(null);
  const [loadingCmd, setLoadingCmd] = useState<string | null>(null);

  const { agents } = useDashboardSocket();

  const selectAllRef = useRef<HTMLInputElement | null>(null);

  const handleCommand = async (agentId: string, command: string) => {
    setLoadingCmd(agentId + command);

    try {
      await sendCommand(agentId, command);
    } catch (err) {
      console.error(err);
    }

    setLoadingCmd(null);
  };

  const refreshDevice = async (agentId: string) => {
    try {
      await fetch(`http://localhost:8000/api/refresh/${agentId}`, {
        method: "POST",
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Normalize backend data
  const stableAgents: Device[] = useMemo(() => {
    const map = new Map<string, Device>();

    agents.forEach((a: any) => {
      map.set(a.agent_id, {
        id: a.agent_id,
        name: a.hostname,
        lastSeen: a.last_seen,
        disk: a.metrics?.disk || 0,
        ram: a.metrics?.ram || 0,
        cpu: a.metrics?.cpu || 0,
      });
    });

    return Array.from(map.values());
  }, [agents]);

  const filteredData = stableAgents.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      !filterType ||
      (filterType === "RAM" && item.ram >= 16) ||
      (filterType === "STORAGE" && item.disk > 100);

    return matchesSearch && matchesFilter;
  });

  const toggleRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedRows.length === filteredData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredData.map((i) => i.id));
    }
  };

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate =
        selectedRows.length > 0 &&
        selectedRows.length < filteredData.length;
    }
  }, [selectedRows, filteredData]);

  return (
    <div className="flex">
      <AppSidebar />

      <main className="container mx-auto mt-2 p-4 lg:p-8 xl:max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-bold">Workbench Dashboard</h1>
          <p className="text-sm text-neutral-500">
            Workbench dashboard that manages and monitors computers connected
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-2 lg:grid-cols-4">
          <TicketCard
            title="Total Connected Computers"
            count={stableAgents.length}
            description="Connected Computers Submissions"
            percentage="+12%"
          />

          <TicketCard
            title="Online"
            count={
              stableAgents.filter((a) => isOnline(a.lastSeen)).length
            }
            description="Active devices"
            percentage="+5%"
          />

          <TicketCard
            title="Offline"
            count={
              stableAgents.filter((a) => !isOnline(a.lastSeen)).length
            }
            description="Inactive devices"
            percentage="+20%"
          />

          <TicketCard
            title="System Status"
            count="1"
            description="Admin Login"
            percentage="Online"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 mt-4">
          {/* Controls */}
          <div className="p-4 flex flex-wrap items-center justify-between gap-3 border-b">
            <div className="relative w-full max-w-sm">
              <span className="absolute left-3 top-2.5 text-gray-400">
                <LucideSearch size={20} />
              </span>
              <input
                className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg"
                placeholder="Search computers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button
              onClick={() => setDropdownOpen((p) => !p)}
              className="px-4 py-2 bg-gray-100 rounded-lg"
            >
              Filter <LucideArrowDown01 size={16} />
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4">
                    <input
                      ref={selectAllRef}
                      type="checkbox"
                      checked={
                        filteredData.length > 0 &&
                        selectedRows.length === filteredData.length
                      }
                      onChange={toggleAll}
                    />
                  </th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Disk</th>
                  <th>RAM</th>
                  <th>CPU</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.map((device) => {
                  const online = isOnline(device.lastSeen);

                  return (
                    <tr key={device.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(device.id)}
                          onChange={() => toggleRow(device.id)}
                        />
                      </td>

                      <td className="px-6 py-4">{device.name}</td>

                      <td className="px-6 py-4">
                        <span
                          className={
                            online ? "text-green-600" : "text-red-500"
                          }
                        >
                          {online ? "Online" : "Offline"}
                        </span>
                      </td>

                      <td className="px-6 py-4">{device.disk} GB</td>
                      <td className="px-6 py-4">{device.ram} GB</td>
                      <td className="px-6 py-4">{device.cpu}%</td>

                      <td className="px-6 py-4 relative">
                        <button
                          onClick={() =>
                            setActionOpen(
                              actionOpen === device.id ? null : device.id
                            )
                          }
                        >
                          ⋮
                        </button>

                        {actionOpen === device.id && (
                          <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow">
                            <button className="block w-full px-3 py-2 hover:bg-gray-100">
                              View Logs
                            </button>
                            <button
                              onClick={() => refreshDevice(device.id)}
                              className="block w-full px-3 py-2 text-red-500 hover:bg-gray-100"
                            >
                              Refresh
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-400">
                      No results found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal (placeholder kept) */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="font-bold mb-4">Scan Network</h2>
              <button onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const isOnline = (lastSeen?: string): boolean => {
  if (!lastSeen) return false;
  const diff = (Date.now() - new Date(lastSeen).getTime()) / 1000;
  return diff < 15;
};

export default ITWorkbenchDashboard;