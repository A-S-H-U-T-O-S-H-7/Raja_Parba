"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { 
  Heart, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  MapPin, 
  Sparkles 
} from "lucide-react";
import { createSponsorApplication } from "@/services/sponsorPerformerService";
import useAuthStore from "@/lib/stores/useAuthStore";

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
  const { user } = useAuthStore();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const showSuccessAlert = async () => {
    await Swal.fire({
      html: `
        <div style="display:flex;flex-direction:column;align-items:center;gap:10px;padding:8px 4px;">
          <div style="width:56px;height:56px;border-radius:9999px;background:linear-gradient(135deg,#f59e0b,#ef4444);display:flex;align-items:center;justify-content:center;color:white;font-size:28px;font-weight:700;">OK</div>
          <h2 style="margin:0;font-size:1.25rem;color:#111827;">Application Submitted</h2>
          <p style="margin:0;font-size:0.95rem;color:#4b5563;text-align:center;line-height:1.45;">
            Thank you for supporting Raja Parba 2026.<br/>Track status from your profile dashboard.
          </p>
        </div>
      `,
      showConfirmButton: false,
      timer: 1700,
      timerProgressBar: true,
      background: '#ffffff',
      allowOutsideClick: false,
      customClass: {
        popup: 'rounded-2xl shadow-2xl',
      }
    });

    router.push("/profile?tab=performer");
  };

  const showWarningAlert = async () => {
    await Swal.fire({
      title: 'Missing Details',
      text: 'Please fill all sponsor form fields before submitting.',
      icon: 'warning',
      confirmButtonText: 'Got it',
      confirmButtonColor: '#f59e0b',
      background: '#ffffff',
    });
  };

  const showErrorAlert = async () => {
    await Swal.fire({
      title: 'Submission Failed',
      text: 'Sorry, there was an error. Please try again.',
      icon: 'error',
      confirmButtonText: 'Try Again',
      confirmButtonColor: '#ef4444',
      background: '#ffffff',
    });
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
      userId: user?.uid || null,
    };

    const hasAllFields = Object.values(payload).every(Boolean);
    if (!hasAllFields) {
      await showWarningAlert();
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

      await showSuccessAlert();
      
    } catch (error) {
      console.error("Error submitting sponsor application:", error);
      await showErrorAlert();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className=" p-5 pb-10 md:p-10 bg-gradient-to-b from-amber-50 to-red-50 flex items-center justify-center">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-amber-400 to-red-500" />

          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-red-500 rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-800">Sponsor Raja Parba</h1>
                <p className="text-sm text-gray-500">Support tradition ✨</p>
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                <input
                  type="text"
                  placeholder="Full name"
                  value={form.name}
                  onChange={(e) => onChange("name", e.target.value)}
                  className="w-full text-sm text-gray-700 pl-9 pr-3 py-2.5 border border-amber-200 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                  required
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={(e) => onChange("email", e.target.value)}
                  className="w-full text-sm text-gray-700 pl-9 pr-3 py-2.5 border border-amber-200 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                  required
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={form.phone}
                  onChange={(e) => onChange("phone", e.target.value)}
                  className="w-full text-sm text-gray-700 pl-9 pr-3 py-2.5 border border-amber-200 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                  required
                />
              </div>

              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                <input
                  type="text"
                  placeholder="Organization"
                  value={form.organization}
                  onChange={(e) => onChange("organization", e.target.value)}
                  className="w-full text-sm text-gray-700 pl-9 pr-3 py-2.5 border border-amber-200 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                  required
                />
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                <input
                  type="text"
                  placeholder="Address"
                  value={form.address}
                  onChange={(e) => onChange("address", e.target.value)}
                  className="w-full text-sm text-gray-700 pl-9 pr-3 py-2.5 border border-amber-200 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                  required
                />
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                <input
                  type="text"
                  placeholder="City"
                  value={form.city}
                  onChange={(e) => onChange("city", e.target.value)}
                  className="w-full text-sm text-gray-700 pl-9 pr-3 py-2.5 border border-amber-200 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full cursor-pointer bg-gradient-to-r from-amber-500 to-red-500 text-white text-sm font-medium py-2.5 rounded-lg hover:shadow-md hover:shadow-amber-200 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 mt-1"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4" />
                    <span>Submit Request</span>
                    <Sparkles className="w-3 h-3 opacity-70" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-4">
              Join us in celebrating Raja Parba 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

