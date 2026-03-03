"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { 
  Crown, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Cake, 
  Camera,
  Flower2,
  Sparkles,
  ChevronDown,
  X
} from "lucide-react";
import { createRajaKumariApplication } from "@/services/rajaKumariService";
import useAuthStore from "@/lib/stores/useAuthStore";

const competitionItems = [
  "Self-introduction",
  "Rangoli",
  "Quiz",
  "Dress/Attire",
];

const initialForm = {
  name: "",
  email: "",
  phone: "",
  location: "",
  pincode: "",
  gender: "",
  dob: "",
  age: "",
};

const calculateAgeFromDob = (dobString) => {
  if (!dobString) return "";

  const dob = new Date(dobString);
  if (Number.isNaN(dob.getTime())) return "";

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age -= 1;
  }

  return age >= 0 ? String(age) : "";
};

export default function RajaKumariPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [form, setForm] = useState(initialForm);
  const [candidatePhoto, setCandidatePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleDobChange = (value) => {
    const age = calculateAgeFromDob(value);
    setForm((prev) => ({ ...prev, dob: value, age }));
  };

  const handlePhotoChange = (file) => {
    if (!file) {
      setCandidatePhoto(null);
      setPhotoPreview("");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: "warning",
        title: "File Too Large",
        text: "Please upload an image smaller than 5MB.",
        confirmButtonColor: "#e11d48",
      });
      return;
    }

    setCandidatePhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const removePhoto = () => {
    setCandidatePhoto(null);
    setPhotoPreview("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: (form.name || "").trim(),
      email: (form.email || "").trim(),
      phone: (form.phone || "").trim(),
      location: (form.location || "").trim(),
      pincode: (form.pincode || "").trim(),
      gender: (form.gender || "").trim(),
      dob: form.dob || "",
      age: Number(form.age || 0),
      ageGroup: "6-15",
      userId: user?.uid || null,
    };

    const hasAllRequired =
      payload.name &&
      payload.email &&
      payload.phone &&
      payload.location &&
      payload.pincode &&
      payload.gender &&
      payload.dob &&
      payload.age &&
      candidatePhoto;

    if (!hasAllRequired) {
      await Swal.fire({
        icon: "warning",
        title: "Missing Details",
        text: "Please complete all required fields and upload candidate photo.",
        confirmButtonColor: "#e11d48",
      });
      return;
    }

    if (payload.age < 6 || payload.age > 15) {
      await Swal.fire({
        icon: "warning",
        title: "Age Not Eligible",
        text: "Raja Kumari age group is 6 to 15 years only.",
        confirmButtonColor: "#e11d48",
      });
      return;
    }

    try {
      setSubmitting(true);

      const result = await createRajaKumariApplication(payload, candidatePhoto);

      try {
        const { sendRajaKumariConfirmationEmail } = await import("@/services/emailService");
        await sendRajaKumariConfirmationEmail({
          ...payload,
          id: result.id,
          registrationId: result.registrationId || result.id,
        });
      } catch (emailError) {
        console.error("Failed to send Raja Kumari email:", emailError);
      }

      await Swal.fire({
        html: `
          <div style="display:flex;flex-direction:column;align-items:center;gap:10px;padding:8px 4px;">
            <div style="width:56px;height:56px;border-radius:9999px;background:linear-gradient(135deg,#10b981,#059669);display:flex;align-items:center;justify-content:center;color:white;font-size:28px;font-weight:700;">&#10003;</div>
            <h2 style="margin:0;font-size:1.25rem;color:#111827;">Registration Submitted!</h2>
            <p style="margin:0;font-size:0.95rem;color:#4b5563;text-align:center;line-height:1.45;">
              Your Raja Kumari registration has been received successfully.
            </p>
            <p style="margin:0;font-size:0.85rem;font-weight:600;color:#059669;">ID: ${result?.registrationId || result?.id || "Generating..."}</p>
          </div>
        `,
        showConfirmButton: false,
        timer: 1700,
        timerProgressBar: true,
        background: "#ffffff",
        allowOutsideClick: false,
        customClass: {
          popup: "rounded-2xl shadow-2xl",
        },
      });

      router.push("/profile?tab=rajaKumari");
    } catch (error) {
      console.error("Error submitting Raja Kumari registration:", error);
      await Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: error?.message || "Something went wrong. Please try again.",
        confirmButtonColor: "#e11d48",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-pink-50 to-red-50 py-6 px-3 md:py-8 md:px-4">
      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-48 h-48 bg-rose-200/30 rounded-full blur-3xl -z-10"></div>
      <div className="fixed bottom-0 right-0 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl -z-10"></div>
      
      <div className="max-w-4xl mx-auto">
        {/* Header with Festival Theme */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm border border-rose-200 mb-3">
            <Flower2 className="w-3.5 h-3.5 text-rose-500" />
            <span className="text-xs font-medium text-rose-600">Raja Parba 2026</span>
            <Flower2 className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-600">
            Raja Kumari Registration
          </h1>
          <p className="text-sm text-gray-600 mt-1 max-w-2xl mx-auto">
            For talented young girls aged 6 to 15 years
          </p>
        </div>

        {/* Main Form Card */}
        <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-rose-200 overflow-hidden">
          {/* Decorative Top Border */}
          <div className="h-1.5 bg-gradient-to-r from-rose-400 via-pink-500 to-red-500"></div>
          
          {/* Title Section with Soft Gradient Background */}
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 px-5 py-4 border-b border-rose-200">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg shadow-md">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Registration Details</h2>
                <p className="text-xs text-gray-600">Fill in the candidate information below</p>
              </div>
            </div>
          </div>

          {/* Competition Steps */}
          <div className="px-5 pt-5">
            <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-4 rounded-xl border border-rose-200">
              <p className="text-xs font-medium text-rose-600 mb-3 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Competition Rounds
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {competitionItems.map((item, index) => (
                  <div
                    key={item}
                    className="relative bg-white rounded-lg border border-rose-200 px-3 py-2 text-center group hover:border-rose-300 transition-all"
                  >
                    <span className="absolute -top-2 -left-2 w-5 h-5 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center">
                      <span className="text-[10px] font-bold text-white">{index + 1}</span>
                    </span>
                    <p className="text-xs font-medium text-gray-700 mt-1">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="p-5 md:p-6">
            {/* Photo Upload with Preview */}
            <div className="mb-6">
              <p className="text-xs font-medium text-gray-700 mb-2">Candidate Photo *</p>
              <div className="relative">
                {photoPreview ? (
                  <div className="relative w-full h-32 rounded-xl overflow-hidden border border-rose-200">
                    <img 
                      src={photoPreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition shadow-md"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="relative flex items-center justify-center w-full h-32 border-2 border-dashed border-rose-300 rounded-xl bg-rose-50 cursor-pointer hover:bg-rose-100 transition group">
                    <div className="text-center text-gray-600">
                      <Camera className="w-6 h-6 mx-auto mb-1 text-rose-400 group-hover:text-rose-600" />
                      <p className="text-xs">Click to upload photo</p>
                      <p className="text-[10px] text-gray-500">JPEG, PNG, WebP (max 5MB)</p>
                    </div>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      className="hidden"
                      onChange={(e) => handlePhotoChange(e.target.files?.[0] || null)}
                      required
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Name */}
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-400" />
                <input
                  type="text"
                  placeholder="Candidate Name *"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full rounded-lg border border-rose-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-100 transition-all"
                  required
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-400" />
                <input
                  type="email"
                  placeholder="Email Address *"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full rounded-lg border border-rose-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-100 transition-all"
                  required
                />
              </div>

              {/* Phone */}
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-400" />
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="w-full rounded-lg border border-rose-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-100 transition-all"
                  required
                />
              </div>

              {/* Gender Dropdown - Female Only */}
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-400 z-10" />
                <select
                  value={form.gender}
                  onChange={(e) => updateField("gender", e.target.value)}
                  className="w-full rounded-lg border border-rose-200 bg-white py-2.5 pl-9 pr-8 text-sm text-gray-700 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-100 transition-all appearance-none"
                  required
                >
                  <option value="" disabled>Select Gender *</option>
                  <option value="Female">Female</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-400 pointer-events-none" />
              </div>

              {/* Location */}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-400" />
                <input
                  type="text"
                  placeholder="Location/City *"
                  value={form.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  className="w-full rounded-lg border border-rose-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-100 transition-all"
                  required
                />
              </div>

              {/* Pincode */}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-400" />
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Pincode *"
                  value={form.pincode}
                  onChange={(e) => updateField("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="w-full rounded-lg border border-rose-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-100 transition-all"
                  required
                />
              </div>

              {/* Date of Birth */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-400" />
                <input
                  type="date"
                  value={form.dob}
                  onChange={(e) => handleDobChange(e.target.value)}
                  className="w-full rounded-lg border border-rose-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-100 transition-all"
                  required
                />
              </div>

              {/* Age (Auto-calculated) */}
              <div className="relative">
                <Cake className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-400" />
                <input
                  type="text"
                  placeholder="Age (auto calculated)"
                  value={form.age}
                  disabled
                  className="w-full rounded-lg border border-rose-200 bg-rose-50 py-2.5 pl-9 pr-3 text-sm text-gray-600 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Submit Button - Centered */}
            <div className="flex justify-center pt-6 mt-2 border-t border-rose-200">
              <button
                type="submit"
                disabled={submitting}
                className="group cursor-pointer relative px-8 py-2.5 bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 text-white font-medium text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Crown className="w-4 h-4" />
                      <span>Register for Raja Kumari</span>
                      <Sparkles className="w-3.5 h-3.5 opacity-70" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
          <Flower2 className="w-3 h-3 text-rose-400" />
          Our team will contact you with further instructions
          <Flower2 className="w-3 h-3 text-rose-400" />
        </p>
      </div>
    </div>
  );
}
