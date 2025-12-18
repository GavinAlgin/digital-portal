// src/components/SupportForm.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { supabase } from "../hooks/supabase/supabaseClient";
import { Link } from "react-router-dom";

// Zod schema and form type combined
const contactSchema = z.object({
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

export const SupportForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const { error } = await supabase.from("contact_messages").insert([
        {
          email: data.email,
          subject: data.subject,
          message: data.message || null,
        },
      ]);

      if (error) throw error;

      toast.success("Message sent successfully!");
      reset();
    } catch (err: any) {
      toast.error(err.message || "Failed to send message");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
        <div className="flex items-center gap-3 mb-12">
          <Link className="p-1" to="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">
            Technical Support
          </h1>
        </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            {...register("email")}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Subject</label>
          <input
            type="text"
            {...register("subject")}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.subject && (
            <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Message</label>
          <textarea
            {...register("message")}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white font-medium py-2 rounded hover:bg-gray-700 transition"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
};
