// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useState } from "react"
// import { accommodationRequestSchema } from "./accommodationSchema"
// import { usePartneredAccommodations } from "./usePartneredAccommodations"
// import { supabase } from "../../hooks/supabase/supabaseClient"

// export default function AccommodationRequestForm() {
//   const accommodations = usePartneredAccommodations()
//   const [selected, setSelected] = useState<unknown>(null)

//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(accommodationRequestSchema),
//   })

//   const accommodationId = watch("accommodationId")

//   const selectedAccommodation = accommodations.find(
//     (a) => a.id === accommodationId
//   )

//   const onSubmit = async (data: any) => {
//     await supabase.from("accommodation_requests").insert({
//       student_name: data.studentName,
//       student_email: data.studentEmail,
//       student_phone: data.studentPhone,
//       accommodation_id: data.accommodationId,
//       agreed_to_share: data.agreedToShare,
//     })
//   }

//   return (
//     <div className="max-w-xl mx-auto p-6">
//       <div className="bg-white rounded-xl shadow-apple p-6 space-y-6">
//         <h1 className="text-2xl font-semibold text-center">
//           Choose Your Accommodation
//         </h1>

//         {/* Student Info */}
//         <section className="space-y-3">
//           <input {...register("studentName")} placeholder="Full Name" className="input" />
//           <input {...register("studentEmail")} placeholder="Email" className="input" />
//           <input {...register("studentPhone")} placeholder="Phone Number" className="input" />
//         </section>

//         {/* Accommodation Selector */}
//         <select
//           {...register("accommodationId")}
//           className="input"
//         >
//           <option value="">Select Accommodation</option>
//           {accommodations.map((a) => (
//             <option key={a.id} value={a.id}>
//               {a.name}
//             </option>
//           ))}
//         </select>

//         {/* Auto Location */}
//         {selectedAccommodation && (
//           <div className="text-sm text-gray-600">
//             📍 {selectedAccommodation.location}
//           </div>
//         )}

//         {/* Leaser Info Card */}
//         {selectedAccommodation && (
//           <div className="bg-appleGray rounded-xl p-4 space-y-1 text-sm">
//             <p className="font-medium">Leaser Information</p>
//             <p>Name: {selectedAccommodation.leaser_name}</p>
//             <p>Email: {selectedAccommodation.leaser_email}</p>
//             <p>Phone: {selectedAccommodation.leaser_phone}</p>
//             <p>Deposit: {selectedAccommodation.deposit_account}</p>
//           </div>
//         )}

//         {/* Consent */}
//         <label className="flex items-start gap-3 text-sm">
//           <input
//             type="checkbox"
//             {...register("agreedToShare")}
//             className="mt-1"
//           />
//           <span>
//             I agree that my personal information will be shared with the
//             accommodation leaser for booking purposes.
//           </span>
//         </label>

//         {errors.agreedToShare && (
//           <p className="text-red-500 text-sm">
//             {errors.agreedToShare.message}
//           </p>
//         )}

//         <button className="w-full bg-appleBlue text-white py-3 rounded-xl">
//           Submit Request
//         </button>
//       </div>
//     </div>
//   )
// }
