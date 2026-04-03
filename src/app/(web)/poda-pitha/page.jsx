"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  Cake,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Camera,
  Flower2,
  Sparkles,
  ChevronDown,
  X,
  Trophy
} from "lucide-react";
import { createPodaPithaApplication } from "@/services/podaPithaService";
import useAuthStore from "@/lib/stores/useAuthStore";
import { showEntryPassAlert } from "@/utils/showEntryPassAlert";
import { DuplicateRegistrationError, hasExistingSingleRegistration } from "@/utils/registrationGuards";
import DonationSupportCard from "@/components/donation/DonationSupportCard";

const competitionItems = [
  "One physical round",
  "Traditional Poda Pitha presentation",
  "Taste and judging by panel",
  "Open to all age groups",
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

export default function PodaPithaPage() {
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

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: "warning",
        title: "File Too Large",
        text: "Please upload an image smaller than 5MB.",
        confirmButtonColor: "#d97706",
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
      category: "Open to all ages",
      roundType: "Single physical round",
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
        confirmButtonColor: "#d97706",
      });
      return;
    }

    const alreadyRegistered = await hasExistingSingleRegistration({
      collectionName: "poda_pitha_applications",
      userId: payload.userId,
      email: payload.email,
      phone: payload.phone,
    });

    if (alreadyRegistered) {
      const result = await Swal.fire({
        html: `
          <div style="display:flex;flex-direction:column;align-items:center;gap:10px;padding:8px 4px;">
            <div style="width:56px;height:56px;border-radius:9999px;background:linear-gradient(135deg,#f59e0b,#ea580c);display:flex;align-items:center;justify-content:center;color:white;font-size:26px;font-weight:700;">!</div>
            <h2 style="margin:0;font-size:1.2rem;color:#111827;">Already Registered</h2>
            <p style="margin:0;font-size:0.95rem;color:#4b5563;text-align:center;line-height:1.45;">
              You have already registered for Poda Pitha.<br/>
              Please go to your profile to view details.
            </p>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: "Go to Profile",
        cancelButtonText: "Close",
        confirmButtonColor: "#ea580c",
        cancelButtonColor: "#6b7280",
        background: "#ffffff",
        customClass: {
          popup: "rounded-2xl shadow-2xl",
        },
      });

      if (result.isConfirmed) {
        router.push("/profile?tab=podaPitha");
      }
      return;
    }

    try {
      setSubmitting(true);

      const result = await createPodaPithaApplication(payload, candidatePhoto);

      try {
        const { sendPodaPithaConfirmationEmail } = await import("@/services/emailService");
        const emailResult = await sendPodaPithaConfirmationEmail({
          ...payload,
          id: result.id,
          registrationId: result.registrationId || result.id,
        });
        if (emailResult && emailResult.success === false) {
          console.warn("Poda Pitha email response:", emailResult);
        }
      } catch (emailError) {
        console.error("Failed to send Poda Pitha email:", emailError);
      }

      await Swal.fire({
        html: `
          <div style="display:flex;flex-direction:column;align-items:center;gap:10px;padding:8px 4px;">
            <div style="width:56px;height:56px;border-radius:9999px;background:linear-gradient(135deg,#10b981,#059669);display:flex;align-items:center;justify-content:center;color:white;font-size:28px;font-weight:700;">&#10003;</div>
            <h2 style="margin:0;font-size:1.25rem;color:#111827;">Registration Submitted!</h2>
            <p style="margin:0;font-size:0.95rem;color:#4b5563;text-align:center;line-height:1.45;">
              Your Poda Pitha registration has been received successfully.
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
      await showEntryPassAlert({
        registrationId: result?.registrationId || result?.id,
        name: payload?.name,
        theme: "amber",
      });
      router.push("/profile?tab=podaPitha");
    } catch (error) {
      console.error("Error submitting Poda Pitha registration:", error);
      if (error instanceof DuplicateRegistrationError) {
        await Swal.fire({
          icon: "info",
          title: "Already Registered",
          text: "A Poda Pitha registration already exists for this email, phone, or account.",
          confirmButtonColor: "#d97706",
        });
        router.push("/profile?tab=podaPitha");
        return;
      }
      await Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: error?.message || "Something went wrong. Please try again.",
        confirmButtonColor: "#d97706",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-slate-100 py-6 px-3 md:py-8 md:px-4">
      <div className="fixed top-0 left-0 w-48 h-48 bg-blue-200/30 rounded-full blur-3xl -z-10"></div>
      <div className="fixed bottom-0 right-0 w-64 h-64 bg-indigo-200/30 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm border border-blue-200 mb-3">
            <Flower2 className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-medium text-blue-700">Raja Parba 2026</span>
            <Flower2 className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-900">
            Poda Pitha Competition
          </h1>
          <p className="text-sm text-gray-600 mt-1 max-w-2xl mx-auto">
            Traditional Odisha baked pitha competition open to all ages with one physical round
          </p>
          <DonationSupportCard className="mx-auto mt-4 max-w-4xl text-left" />
        </div>

        <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-200 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900"></div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-4 border-b border-blue-200">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-gradient-to-br from-blue-700 to-indigo-900 rounded-lg shadow-md">
                <Cake className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Registration Details</h2>
                <p className="text-xs text-gray-600">Fill in the participant information below</p>
              </div>
            </div>
          </div>

          <div className="flex mx-5 mt-1 justify-center items-center border border-blue-300 bg-linear-to-br from-blue-100 via-white to-indigo-100 py-1 px-2 rounded-lg">
            <p className="text-sm text-gray-600 mt-1 max-w-2xl mx-auto">
              Participation is open for <span className="text-blue-700 font-bold text-base">any age group</span>
            </p>
          </div>

          <div className="px-5 pt-5">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
              <p className="text-xs font-medium text-blue-700 mb-3 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Competition Format
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {competitionItems.map((item, index) => (
                  <div
                    key={item}
                    className="relative bg-white rounded-lg border border-blue-200 px-3 py-2 text-center group hover:border-blue-300 transition-all"
                  >
                    <span className="absolute -top-2 -left-2 w-5 h-5 bg-gradient-to-br from-blue-700 to-indigo-900 rounded-full flex items-center justify-center">
                      <span className="text-[10px] font-bold text-white">{index + 1}</span>
                    </span>
                    <p className="text-xs font-medium text-gray-700 mt-1">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <form onSubmit={onSubmit} className="p-5 md:p-6">
            <div className="mb-6">
              <p className="text-xs font-medium text-gray-700 mb-2">Participant Photo *</p>
              <div className="relative">
                {photoPreview ? (
                  <div className="relative w-full h-32 rounded-xl overflow-hidden border border-blue-200">
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
                  <label className="relative flex items-center justify-center w-full h-32 border-2 border-dashed border-blue-300 rounded-xl bg-blue-50 cursor-pointer hover:bg-blue-100 transition group">
                    <div className="text-center text-gray-600">
                      <Camera className="w-6 h-6 mx-auto mb-1 text-blue-500 group-hover:text-blue-700" />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
                <input
                  type="text"
                  placeholder="Participant Name *"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full rounded-lg border border-blue-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all"
                  required
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
                <input
                  type="email"
                  placeholder="Email Address *"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full rounded-lg border border-blue-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all"
                  required
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="w-full rounded-lg border border-blue-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all"
                  required
                />
              </div>

              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 z-10" />
                <select
                  value={form.gender}
                  onChange={(e) => updateField("gender", e.target.value)}
                  className="w-full rounded-lg border border-blue-200 bg-white py-2.5 pl-9 pr-8 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all appearance-none"
                  required
                >
                  <option value="" disabled>Select Gender *</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 pointer-events-none" />
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
                <input
                  type="text"
                  placeholder="Location/City *"
                  value={form.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  className="w-full rounded-lg border border-blue-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all"
                  required
                />
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Pincode *"
                  value={form.pincode}
                  onChange={(e) => updateField("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="w-full rounded-lg border border-blue-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all"
                  required
                />
              </div>

              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
                <input
                  type="date"
                  value={form.dob}
                  onChange={(e) => handleDobChange(e.target.value)}
                  className="w-full rounded-lg border border-blue-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all"
                  required
                />
              </div>

              <div className="relative">
                <Cake className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
                <input
                  type="text"
                  placeholder="Age (auto calculated)"
                  value={form.age}
                  disabled
                  className="w-full rounded-lg border border-blue-200 bg-blue-50 py-2.5 pl-9 pr-3 text-sm text-gray-600 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex justify-center pt-6 mt-2 border-t border-blue-200">
              <button
                type="submit"
                disabled={submitting}
                className="group cursor-pointer relative px-8 py-2.5 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white font-medium text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Trophy className="w-4 h-4" />
                      <span>Register for Poda Pitha</span>
                      <Sparkles className="w-3.5 h-3.5 opacity-70" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-800 via-indigo-800 to-slate-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
          <Flower2 className="w-3 h-3 text-blue-500" />
          Our team will contact you with further instructions for the physical round
          <Flower2 className="w-3 h-3 text-blue-500" />
        </p>
      </div>
    </div>
  );
}
