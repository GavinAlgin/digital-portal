import { useState, type ChangeEvent, type FormEvent } from 'react'
import { z } from 'zod'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Link } from 'react-router-dom'
import { supabase } from '../../hooks/supabase/supabaseClient'

/* -------------------- ZOD SCHEMA -------------------- */
const accommodationSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(7, 'Phone number required'),
  unit: z.string().optional(),
  consent: z.literal(true, {
    message: 'Consent is required',
  }),
})

/* -------------------- FORM STATE TYPE -------------------- */
type AccommodationFormState = {
  fullName: string
  email: string
  phone: string
  unit?: string
  consent: boolean
}

/* -------------------- MOCK DATA -------------------- */
const accommodationUnits = {
  'Studio A': {
    leaser: 'Green Living Ltd',
    email: 'leasing@greenliving.com',
    available: true,
  },
  'Apartment B': {
    leaser: 'Urban Homes',
    email: 'contact@urbanhomes.com',
    available: false,
  },
} as const

type UnitKey = keyof typeof accommodationUnits

/* -------------------- COMPONENT -------------------- */
const AccommodationForm = () => {
  const [formData, setFormData] = useState<AccommodationFormState>({
    fullName: '',
    email: '',
    phone: '',
    unit: undefined,
    consent: false,
  })

  const selectedUnit =
    formData.unit && accommodationUnits[formData.unit as UnitKey]

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, type, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : value,
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const validation = accommodationSchema.safeParse(formData)

    if (!validation.success) {
      toast.error(validation.error.issues[0].message)
      return
    }

    const { error } = await supabase
      .from('accommodations')
      .insert([validation.data])

    if (error) {
      toast.error('Submission failed. Try again.')
      return
    }

    toast.success('Form submitted successfully!')
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      unit: undefined,
      consent: false,
    })
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-4">
      <ToastContainer position="top-center" />

      <div className="w-full max-w-md mt-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <Link className="p-1" to="/user">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">
            Accommodation Form
          </h1>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 mb-6">
          This form allows students to express interest in available
          accommodation units. Your information will be shared securely with
          the relevant leaser.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3 text-sm"
          />

          <input
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3 text-sm"
          />

          <input
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3 text-sm"
          />

          <select
            name="unit"
            value={formData.unit ?? ''}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3 text-sm bg-white"
          >
            <option value="">Select Accommodation (Optional)</option>
            {Object.keys(accommodationUnits).map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>

          {selectedUnit && (
            <div className="rounded-xl bg-gray-50 p-4 text-sm">
              <p className="font-medium text-gray-900">
                Leaser: {selectedUnit.leaser}
              </p>
              <p className="text-gray-500">{selectedUnit.email}</p>

              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-xs ${
                  selectedUnit.available
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {selectedUnit.available ? 'Space Available' : 'Fully Occupied'}
              </span>
            </div>
          )}

          <label className="flex items-start gap-3 text-sm text-gray-600">
            <input
              type="checkbox"
              name="consent"
              checked={formData.consent}
              onChange={handleChange}
              className="mt-1"
            />
            I consent to my information being shared with the accommodation
            leaser.
          </label>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-xl text-sm font-medium"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  )
}

export default AccommodationForm



// import { useState } from 'react'
// import { z } from 'zod'
// import { toast, ToastContainer } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'
// import { Link } from 'react-router-dom'
// import { supabase } from '../../hooks/supabase/supabaseClient'

// /* -------------------- ZOD SCHEMA -------------------- */
// const accommodationSchema = z.object({
//   fullName: z.string().min(2, 'Full name is required'),
//   email: z.string().email('Invalid email'),
//   phone: z.string().min(7, 'Phone number required'),
//   unit: z.string().optional(),
//   consent: z.literal(true, {
//     errorMap: () => ({ message: 'Consent is required' }),
//   }),
// })

// /* -------------------- MOCK DATA -------------------- */
// const accommodationUnits = {
//   'Studio A': {
//     leaser: 'Green Living Ltd',
//     email: 'leasing@greenliving.com',
//     available: true,
//   },
//   'Apartment B': {
//     leaser: 'Urban Homes',
//     email: 'contact@urbanhomes.com',
//     available: false,
//   },
// }

// /* -------------------- COMPONENT -------------------- */
// const AccommodationForm = () => {
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     phone: '',
//     unit: '',
//     consent: false,
//   })

//   const selectedUnit = accommodationUnits[formData.unit]

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }))
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     const validation = accommodationSchema.safeParse(formData)

//     if (!validation.success) {
//       toast.error(validation.error.errors[0].message)
//       return
//     }

//     const { error } = await supabase.from('accommodation_requests').insert([
//       formData,
//     ])

//     if (error) {
//       toast.error('Submission failed. Try again.')
//     } else {
//       toast.success('Form submitted successfully!')
//       setFormData({
//         fullName: '',
//         email: '',
//         phone: '',
//         unit: '',
//         consent: false,
//       })
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 flex justify-center px-4">
//       <ToastContainer position="top-center" />

//       <div className="w-full max-w-md mt-6">
//         {/* Header */}
//         <div className="flex items-center gap-3 mb-2">
//           <Link className="p-1" to="/user">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="w-6 h-6 text-gray-700"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               strokeWidth={1.5}>
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M15.75 19.5 8.25 12l7.5-7.5"
//               />
//             </svg>
//           </Link>
//           <h1 className="text-lg font-semibold text-gray-900">
//             Accommodation Form
//           </h1>
//         </div>

//         {/* Description */}
//         <p className="text-sm text-gray-500 mb-6">
//           This form allows students to express interest in available
//           accommodation units. Your information will be shared securely with
//           the relevant leaser.
//         </p>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             name="fullName"
//             placeholder="Full Name"
//             value={formData.fullName}
//             onChange={handleChange}
//             className="w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
//           />

//           <input
//             name="email"
//             placeholder="Email Address"
//             value={formData.email}
//             onChange={handleChange}
//             className="w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
//           />

//           <input
//             name="phone"
//             placeholder="Phone Number"
//             value={formData.phone}
//             onChange={handleChange}
//             className="w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
//           />

//           {/* Optional Unit Selection */}
//           <select
//             name="unit"
//             value={formData.unit}
//             onChange={handleChange}
//             className="w-full rounded-xl border px-4 py-3 text-sm bg-white"
//           >
//             <option value="">Select Accommodation (Optional)</option>
//             {Object.keys(accommodationUnits).map((unit) => (
//               <option key={unit} value={unit}>
//                 {unit}
//               </option>
//             ))}
//           </select>

//           {/* Leaser Info */}
//           {selectedUnit && (
//             <div className="rounded-xl bg-gray-50 p-4 text-sm">
//               <p className="font-medium text-gray-900">
//                 Leaser: {selectedUnit.leaser}
//               </p>
//               <p className="text-gray-500">{selectedUnit.email}</p>

//               <span
//                 className={`inline-block mt-2 px-3 py-1 rounded-full text-xs ${
//                   selectedUnit.available
//                     ? 'bg-green-100 text-green-700'
//                     : 'bg-red-100 text-red-700'
//                 }`}
//               >
//                 {selectedUnit.available ? 'Space Available' : 'Fully Occupied'}
//               </span>
//             </div>
//           )}

//           {/* Consent */}
//           <label className="flex items-start gap-3 text-sm text-gray-600">
//             <input
//               type="checkbox"
//               name="consent"
//               checked={formData.consent}
//               onChange={handleChange}
//               className="mt-1"
//             />
//             I consent to my information being shared with the accommodation
//             leaser.
//           </label>

//           <button
//             type="submit"
//             className="w-full bg-black text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-900 transition"
//           >
//             Submit Request
//           </button>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default AccommodationForm
