"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Heart, User, Mail, Phone, Building2, MapPin } from "lucide-react";
import { createSponsorApplication } from "@/services/sponsorPerformerService";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  organization: "",
  address: "",
  city: "",
};

export default function SponsorPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      organization: form.organization.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
    };

    const hasAllFields = Object.values(payload).every(Boolean);
    if (!hasAllFields) {
      await Swal.fire({
        icon: "warning",
        title: "Missing Details",
        text: "Please fill all sponsor form fields before submitting.",
      });
      return;
    }

    try {
      setSubmitting(true);
      await createSponsorApplication(payload);

      try {
        const { sendSponsorConfirmationEmail } = await import("@/services/emailService");
        await sendSponsorConfirmationEmail(payload);
      } catch (emailError) {
        console.error("Failed to send sponsor email:", emailError);
      }

      await Swal.fire({
        icon: "success",
        title: "Request Submitted",
        text: "Thank you for your sponsorship interest. Redirecting to home page...",
        timer: 2200,
        showConfirmButton: false,
      });

      router.push("/");
    } catch (error) {
      console.error("Error submitting sponsor application:", error);
      await Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Sorry, there was an error submitting your application. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-amber-50 px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="relative bg-white/90 rounded-3xl shadow-2xl border border-amber-200 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600" />

          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 bg-gradient-to-br from-amber-500 to-red-600 rounded-xl flex items-center justify-center shadow-md">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-red-800">Sponsor Raja Parba</h1>
                <p className="text-sm text-gray-600">
                  Become a patron of tradition and celebrate Raja Parba 2026.
                </p>
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-4 mt-6">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => onChange("name", e.target.value)}
                  className="w-full text-gray-800 pl-11 pr-4 py-3 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                  required
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={(e) => onChange("email", e.target.value)}
                  className="w-full text-gray-800 pl-11 pr-4 py-3 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                  required
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={(e) => onChange("phone", e.target.value)}
                  className="w-full text-gray-800 pl-11 pr-4 py-3 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                  required
                />
              </div>

              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                <input
                  type="text"
                  placeholder="Organization Name"
                  value={form.organization}
                  onChange={(e) => onChange("organization", e.target.value)}
                  className="w-full text-gray-800 pl-11 pr-4 py-3 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                  required
                />
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                <input
                  type="text"
                  placeholder="Address"
                  value={form.address}
                  onChange={(e) => onChange("address", e.target.value)}
                  className="w-full text-gray-800 pl-11 pr-4 py-3 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                  required
                />
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                <input
                  type="text"
                  placeholder="City"
                  value={form.city}
                  onChange={(e) => onChange("city", e.target.value)}
                  className="w-full text-gray-800 pl-11 pr-4 py-3 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit Sponsorship Request"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
