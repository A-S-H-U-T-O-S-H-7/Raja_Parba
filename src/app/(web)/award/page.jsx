"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { 
  Trophy, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Cake, 
  Camera,
  Sparkles,
  Flower2,
  Medal,
  ChevronDown,
  Hash,
  BookOpen,
  X
} from "lucide-react";
import { createAwardApplication } from "@/services/awardService";
import useAuthStore from "@/lib/stores/useAuthStore";

const awardFieldOptions = [
  "Best Cultural Performer",
  "Community Excellence",
  "Art & Creativity",
  "Young Talent",
  "Social Impact",
];

const educationOptions = [
  "10th Pass",
  "12th Pass",
  "Graduate (Degree)",
  "Post Graduate (Masters)",
  "PhD",
  "Diploma",
  "Others"
];

const initialForm = {
  awardField: "",
  name: "",
  phone: "",
  email: "",
  address: "",
  pin: "",
  educationQualification: "",
  age: "",
  gender: "",
  aboutSelf: "",
};

const getWordCount = (text) => {
  const words = (text || "").trim().split(/\s+/).filter(Boolean);
  return words.length;
};

const truncateToWordLimit = (text, limit) => {
  const words = (text || "").trim().split(/\s+/).filter(Boolean);
  if (words.length <= limit) return text;
  return words.slice(0, limit).join(" ");
};

export default function AwardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [form, setForm] = useState(initialForm);
  const [candidatePhoto, setCandidatePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const aboutWordCount = useMemo(() => getWordCount(form.aboutSelf), [form.aboutSelf]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAboutChange = (value) => {
    const normalized = value.replace(/\s+/g, " ");
    const limited = truncateToWordLimit(normalized, 100);
    updateField("aboutSelf", limited);
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
        confirmButtonColor: "#f59e0b",
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
      awardField: (form.awardField || "").trim(),
      name: (form.name || "").trim(),
      phone: (form.phone || "").trim(),
      email: (form.email || "").trim(),
      address: (form.address || "").trim(),
      pin: (form.pin || "").trim(),
      educationQualification: (form.educationQualification || "").trim(),
      age: Number(form.age || 0),
      gender: (form.gender || "").trim(),
      aboutSelf: (form.aboutSelf || "").trim(),
      userId: user?.uid || null,
    };

    const hasAllRequired =
      payload.awardField &&
      payload.name &&
      payload.phone &&
      payload.email &&
      payload.address &&
      payload.pin &&
      payload.educationQualification &&
      payload.age &&
      payload.gender &&
      payload.aboutSelf &&
      candidatePhoto;

    if (!hasAllRequired) {
      await Swal.fire({
        icon: "warning",
        title: "Missing Details",
        text: "Please complete all required fields and upload photo.",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    if (getWordCount(payload.aboutSelf) > 100) {
      await Swal.fire({
        icon: "warning",
        title: "Word Limit Exceeded",
        text: "Describe about yourself must be maximum 100 words.",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    try {
      setSubmitting(true);

      const result = await createAwardApplication(payload, candidatePhoto);

      try {
        const { sendAwardConfirmationEmail } = await import("@/services/emailService");
        await sendAwardConfirmationEmail({
          ...payload,
          id: result.id,
          registrationId: result.registrationId || result.id,
          category: payload.awardField,
        });
      } catch (emailError) {
        console.error("Failed to send Award email:", emailError);
      }

      await Swal.fire({
        html: `
          <div style="display:flex;flex-direction:column;align-items:center;gap:10px;padding:8px 4px;">
            <div style="width:56px;height:56px;border-radius:9999px;background:linear-gradient(135deg,#10b981,#059669);display:flex;align-items:center;justify-content:center;color:white;font-size:28px;font-weight:700;">&#10003;</div>
            <h2 style="margin:0;font-size:1.25rem;color:#111827;">Successfully Submitted</h2>
            <p style="margin:0;font-size:0.95rem;color:#4b5563;text-align:center;line-height:1.45;">
              Your award nomination has been received successfully.
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

      router.push("/profile?tab=award");
    } catch (error) {
      console.error("Error submitting Award application:", error);
      await Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: error?.message || "Something went wrong. Please try again.",
        confirmButtonColor: "#f59e0b",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50 py-6 px-3 md:py-8 md:px-4">
      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-48 h-48 bg-amber-200/30 rounded-full blur-3xl -z-10"></div>
      <div className="fixed bottom-0 right-0 w-64 h-64 bg-yellow-200/30 rounded-full blur-3xl -z-10"></div>
      
      <div className="max-w-4xl mx-auto">
        {/* Header with Festival Theme */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm border border-amber-200 mb-3">
            <Flower2 className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-medium text-amber-600">Raja Parba 2026</span>
            <Flower2 className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
            Awards Application
          </h1>
          <p className="text-sm text-gray-600 mt-1 max-w-2xl mx-auto">
            Nominate yourself for prestigious awards at Raja Parba 2026
          </p>
        </div>

        {/* Main Form Card */}
        <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-200 overflow-hidden">
          {/* Decorative Top Border */}
          <div className="h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-600"></div>
          
          {/* Title Section with Background */}
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-5 py-3 border-b border-amber-200">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg shadow-md">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Nomination Details</h2>
                <p className="text-xs text-gray-600">Fill in your information to apply for awards</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="p-5 md:p-6">
            {/* Award Field & Photo in one row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {/* Award Field Dropdown */}
              <div className="self-start">
                <div className="relative">
                  <Medal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-400 z-10" />
                  <select
                    value={form.awardField}
                    onChange={(e) => updateField("awardField", e.target.value)}
                    className="h-11 w-full rounded-lg border border-amber-200 bg-white pl-9 pr-8 text-sm leading-none text-gray-700 outline-none transition-all appearance-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100"
                    required
                  >
                    <option value="" disabled>Select Award Field *</option>
                    {awardFieldOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-400" />
                </div>
              </div>

              {/* Photo Upload with Preview */}
              <div className="relative">
                {photoPreview ? (
                  <div className="relative mx-auto h-24 w-24 rounded-xl overflow-hidden border border-amber-300 bg-amber-50">
                    <img 
                      src={photoPreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition shadow-md"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="relative mx-auto flex h-24 w-24 flex-col items-center justify-center border border-dashed border-amber-300 rounded-xl bg-amber-50 cursor-pointer hover:bg-amber-100 transition group">
                    <Camera className="w-5 h-5 text-amber-500 group-hover:text-amber-700" />
                    <span className="mt-1 text-[10px] text-center text-amber-700 font-medium px-1">Upload photo</span>
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

            {/* Personal Information Section */}
            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-amber-500" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Name */}
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="w-full rounded-lg border border-amber-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100 transition-all"
                    required
                  />
                </div>

                {/* Phone */}
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="w-full rounded-lg border border-amber-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100 transition-all"
                    required
                  />
                </div>

                {/* Email */}
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="w-full rounded-lg border border-amber-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100 transition-all"
                    required
                  />
                </div>

                {/* Gender Dropdown */}
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-400 z-10" />
                  <select
                    value={form.gender}
                    onChange={(e) => updateField("gender", e.target.value)}
                    className="h-11 w-full rounded-lg border border-amber-200 bg-white pl-9 pr-8 text-sm leading-none text-gray-700 outline-none transition-all appearance-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100"
                    required
                  >
                    <option value="" disabled>Select Gender *</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-400" />
                </div>

                {/* Address - Full Width */}
                <div className="relative md:col-span-2">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-amber-400" />
                  <textarea
                    placeholder="Address *"
                    value={form.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    className="w-full rounded-lg border border-amber-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100 transition-all resize-none"
                    rows={2}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Pin, Education, Age in one row - No section title */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              {/* Pin Code */}
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400" />
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Pin Code *"
                  value={form.pin}
                  onChange={(e) => updateField("pin", e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="w-full rounded-lg border border-orange-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100 transition-all"
                  required
                />
              </div>

              {/* Education Qualification Dropdown */}
              <div className="relative">
                <GraduationCap className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-400 z-10" />
                <select
                  value={form.educationQualification}
                  onChange={(e) => updateField("educationQualification", e.target.value)}
                  className="h-11 w-full rounded-lg border border-orange-200 bg-white pl-9 pr-8 text-sm leading-none text-gray-700 outline-none transition-all appearance-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100"
                  required
                >
                  <option value="" disabled>Select Education *</option>
                  {educationOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-400" />
              </div>

              {/* Age */}
              <div className="relative">
                <Cake className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400" />
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Age *"
                  value={form.age}
                  onChange={(e) => updateField("age", e.target.value.replace(/\D/g, ""))}
                  className="w-full rounded-lg border border-orange-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100 transition-all"
                  required
                />
              </div>
            </div>

            {/* About Self Section */}
            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-yellow-500" />
                About Yourself
              </h3>
              
              <div>
                <textarea
                  value={form.aboutSelf}
                  onChange={(e) => handleAboutChange(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-yellow-200 bg-white py-2.5 px-3 text-sm text-gray-700 outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-100 transition-all resize-none"
                  placeholder="Tell us about yourself, your achievements, and why you deserve this award... *"
                  required
                />
                <p className={`mt-1 text-xs ${aboutWordCount >= 100 ? "text-red-600" : "text-yellow-600"}`}>
                  {aboutWordCount}/100 words
                </p>
              </div>
            </div>

            {/* Submit Button - Centered */}
            <div className="flex justify-center pt-4 border-t border-amber-200">
              <button
                type="submit"
                disabled={submitting}
                className="group cursor-pointer relative px-8 py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-white font-medium text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Submit Nomination</span>
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-gray-500 mt-4">
          ✨ Our team will review your nomination and contact you within 24-48 hours
        </p>
      </div>
    </div>
  );
}
