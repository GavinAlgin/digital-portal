import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase (replace with your keys)
const supabaseUrl = 'https://YOUR_PROJECT.supabase.co';
const supabaseKey = 'YOUR_PUBLIC_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

type Transaction = {
  id: number;
  merchant: string;
  location: string;
  date: string;
  amount: string;
};

const transactions: Transaction[] = [
  { id: 1, merchant: "Computer Science", location: "LAB-01", date: "28 NOV 2025", amount: "$54.99" },
  { id: 2, merchant: "HPO", location: "ROOM-01", date: "01 DEC 2025", amount: "$6.75" },
  { id: 3, merchant: "Digital Literacy", location: "ROOM-02", date: "05 DEC 2025", amount: "$1,299.00" },
];

const ActiveClasses = () => {
  const [showSheet, setShowSheet] = useState(false);
  const [status, setStatus] = useState("");

  // ------------------ NFC Attendance Submission ------------------
  const submitAttendance = async (classId: number) => {
    if (!("NDEFReader" in window)) {
      setStatus("NFC not supported on this device ❌");
      return;
    }

    try {
      setStatus("Approach NFC reader…");
      const ndef = new (window as any).NDEFReader();
      await ndef.scan();

      ndef.onreading = async (event: any) => {
        const decoder = new TextDecoder();
        const nfcMessage = event.message.records[0];
        const nfcId = decoder.decode(nfcMessage.data);

        setStatus("Submitting attendance…");

        // Send attendance to Supabase
        const { data, error } = await supabase
          .from('attendance')
          .insert([{ student_id: nfcId, class_id: classId, timestamp: new Date() }]);

        if (error) {
          console.error(error);
          setStatus("Failed to submit ❌");
        } else {
          setStatus("Attendance submitted ✔️");
          setTimeout(() => setShowSheet(false), 1200);
        }
      };

      ndef.onreadingerror = () => {
        setStatus("Failed to read NFC. Try again.");
      };
    } catch (err) {
      console.error(err);
      setStatus("Error accessing NFC reader ❌");
    }
  };

  const handleOpenSheet = (classId: number) => {
    setStatus("Be near the reader (2-3 cm)…");
    setShowSheet(true);

    setTimeout(() => submitAttendance(classId), 1200);
  };

  return (
    <div className="mt-6">
      <h2 className="font-semibold text-lg mb-4">Timetable</h2>

      {(transactions ?? []).length === 0 && (
        <div className="text-gray-500 text-sm">No timetable entries available.</div>
      )}

      {(transactions ?? []).map(({ id, merchant, location, date }) => (
        <div
          key={id}
          className="mb-4 last:mb-0 bg-gray-200 rounded-lg p-4 flex items-center justify-between"
        >
          <div className="flex gap-3">
            <div className="w-11 h-11 rounded-2xl bg-black text-white flex items-center justify-center">
              {/* Icon omitted for brevity */}
            </div>

            <div>
              <div className="font-semibold text-gray-900">{merchant}</div>
              <div className="text-sm text-gray-500 mt-0.5">
                {location} · {date}
              </div>
            </div>
          </div>

          <button
            onClick={() => handleOpenSheet(id)}
            className="p-2.5 bg-gray-300 hover:bg-gray-200/50 rounded-full">
            {/* Icon omitted for brevity */}
            Tap
          </button>
        </div>
      ))}

      <AnimatePresence>
        {showSheet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40 flex justify-center items-end"
            onClick={() => setShowSheet(false)}>
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 130, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-white rounded-t-2xl p-6 pb-10 shadow-xl">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900">Tap Reader</h3>
              <p className="text-gray-600 mt-3 text-sm">{status}</p>
              <motion.div
                className="w-20 h-20 bg-blue-500/20 rounded-full mx-auto mt-6 flex items-center justify-center"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 1.6 }}>
                <div className="w-10 h-10 bg-blue-500 rounded-full"></div>
              </motion.div>
              <button
                onClick={() => setShowSheet(false)}
                className="w-full mt-8 py-2 rounded-xl bg-gray-200 text-gray-700">
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActiveClasses;


// import { useState } from 'react';
// import { motion, AnimatePresence } from "framer-motion";

// type Transaction = {
//   id: number;
//   merchant: string;
//   location: string;
//   date: string;
//   amount: string;
// };

// const transactions: Transaction[] = [
//   { id: 1, merchant: "Computer Science", location: "LAB-01", date: "28 NOV 2025", amount: "$54.99" },
//   { id: 2, merchant: "HPO", location: "ROOM-01", date: "01 DEC 2025", amount: "$6.75" },
//   { id: 3, merchant: "Digital Literacy", location: "ROOM-02", date: "05 DEC 2025", amount: "$1,299.00" },
// ];

// const ActiveClasses = () => {
//   const [showSheet, setShowSheet] = useState(false);
//   const [status, setStatus] = useState("");

//   // Fake BLE interaction placeholder
//   const startBLEProcess = async () => {
//     setStatus("Connecting…");

//     // Simulating BLE handshake
//     await new Promise((res) => setTimeout(res, 2000));

//     setStatus("Reader detected. Submitting attendance…");

//     await new Promise((res) => setTimeout(res, 1500));

//     setStatus("Attendance submitted ✔️");

//     setTimeout(() => setShowSheet(false), 1200);
//   };

//   const handleOpenSheet = () => {
//     setStatus("Be near 2 to 3 cm near the reader to submit");
//     setShowSheet(true);

//     // Auto-start BLE once sheet opens
//     setTimeout(() => startBLEProcess(), 1200);
//   };

//   return (
//     <div className="mt-6">
//       <h2 className="font-semibold text-lg mb-4">Timetable</h2>

//       {(transactions ?? []).length === 0 && (
//         <div className="text-gray-500 text-sm">No timetable entries available.</div>
//       )}

//       {(transactions ?? []).map(({ id, merchant, location, date }) => (
//         <div
//           key={id}
//           className="mb-4 last:mb-0 bg-gray-200 rounded-lg p-4 flex items-center justify-between"
//         >
//           {/* LEFT */}
//           <div className="flex gap-3">
//             <div className="w-11 h-11 rounded-2xl bg-black text-white flex items-center justify-center">
//               {/* Icon */}
//               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
//                 strokeWidth={1.5} stroke="currentColor" className="size-6">
//                 <path strokeLinecap="round" strokeLinejoin="round"
//                   d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717..."
//                 />
//               </svg>
//             </div>

//             <div>
//               <div className="font-semibold text-gray-900">{merchant}</div>
//               <div className="text-sm text-gray-500 mt-0.5">
//                 {location} · {date}
//               </div>
//             </div>
//           </div>

//           {/* RIGHT BUTTON */}
//           <button
//             onClick={handleOpenSheet}
//             className="p-2.5 bg-gray-300 hover:bg-gray-200/50 rounded-full">
//             <svg xmlns="http://www.w3.org/2000/svg" fill="none"
//               viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
//               className="size-6">
//               <path strokeLinecap="round" strokeLinejoin="round"
//                 d="M9.348 14.652a3.75 3.75 0 0 1 0-5.304m5.304 0..."
//               />
//             </svg>
//           </button>
//         </div>
//       ))}

//       {/* ---------------- BOTTOM SHEET ---------------- */}
//       <AnimatePresence>
//         {showSheet && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/40 z-40 flex justify-center items-end"
//             onClick={() => setShowSheet(false)}>
//             <motion.div
//               initial={{ y: "100%" }}
//               animate={{ y: 0 }}
//               exit={{ y: "100%" }}
//               transition={{ type: "spring", stiffness: 130, damping: 20 }}
//               onClick={(e) => e.stopPropagation()}
//               className="w-full bg-white rounded-t-2xl p-6 pb-10 shadow-xl">
//               {/* Drag handle */}
//               <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4"></div>

//               <h3 className="text-lg font-semibold text-gray-900">Tap Reader</h3>

//               {/* Status text */}
//               <p className="text-gray-600 mt-3 text-sm">{status}</p>

//               {/* Pulsing animation */}
//               <motion.div
//                 className="w-20 h-20 bg-blue-500/20 rounded-full mx-auto mt-6 flex items-center justify-center"
//                 animate={{ scale: [1, 1.15, 1] }}
//                 transition={{ repeat: Infinity, duration: 1.6 }}>
//                 <div className="w-10 h-10 bg-blue-500 rounded-full"></div>
//               </motion.div>

//               {/* Cancel button */}
//               <button
//                 onClick={() => setShowSheet(false)}
//                 className="w-full mt-8 py-2 rounded-xl bg-gray-200 text-gray-700">
//                 Cancel
//               </button>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default ActiveClasses;
