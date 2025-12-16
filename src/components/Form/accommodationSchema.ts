// import { z } from "zod"

// export const accommodationRequestSchema = z.object({
//   studentName: z.string().min(3),
//   studentEmail: z.string().email(),
//   studentPhone: z.string().min(7),
//   accommodationId: z.string().uuid(),
//   agreedToShare: z.literal(true, {
//     errorMap: () => ({
//       message: "You must agree to share your information with the leaser",
//     }),
//   }),
// })

// export type AccommodationRequestData =
//   z.infer<typeof accommodationRequestSchema>
