"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Trophy, User, Mail, Phone, MapPin, GraduationCap, Cake, Camera } from "lucide-react";
import { createAwardApplication } from "@/services/awardService";
import useAuthStore from "@/lib/stores/useAuthStore";

const awardFieldOptions = [
  "Best Cultural Performer",
  "Community Excellence",
  "Art & Creativity",
  "Young Talent",
  "Social Impact",
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

    setCandidatePhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
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
      });
      return;
    }

    if (getWordCount(payload.aboutSelf) > 100) {
      await Swal.fire({
        icon: "warning",
        title: "Word Limit Exceeded",
        text: "Describe about yourself must be maximum 100 words.",
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
          registrationId: result.id,
        });
      } catch (emailError) {
        console.error("Failed to send Award email:", emailError);
      }

      await Swal.fire({
        icon: "success",
        title: "Application Submitted",
        text: "Award application submitted successfully. Redirecting to your profile...",
        timer: 2300,
        showConfirmButton: false,
      });

      router.push("/profile");
    } catch (error) {
      console.error("Error submitting Award application:", error);
      await Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: error?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50 px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <section className="rounded-3xl border border-amber-200 bg-white/90 shadow-lg p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Awards Application</h1>
              <p className="text-sm text-slate-600">Apply and share your achievement profile</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-amber-200 bg-white/95 shadow-xl p-6 sm:p-8">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Award Field</label>
              <select
                value={form.awardField}
                onChange={(e) => updateField("awardField", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-amber-200 text-slate-800 focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                required
              >
                <option value="">Select Award Field</option>
                {awardFieldOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Photo</label>
              <label className="relative flex items-center justify-center w-full h-40 border-2 border-dashed border-amber-300 rounded-2xl bg-amber-50 cursor-pointer hover:bg-amber-100 transition">
                {photoPreview ? (
                  <img src={photoPreview} alt="Candidate preview" className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <div className="text-center text-slate-600">
                    <Camera className="w-6 h-6 mx-auto mb-2 text-amber-500" />
                    <p className="text-sm">Upload candidate photo</p>
                    <p className="text-xs">JPEG, PNG, WebP (max 5MB)</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  className="hidden"
                  onChange={(e) => handlePhotoChange(e.target.files?.[0] || null)}
                  required
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                <input
                  type="text"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-amber-200 text-slate-800 focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                  required
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-amber-200 text-slate-800 focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                  required
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-amber-200 text-slate-800 focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <select
                  value={form.gender}
                  onChange={(e) => updateField("gender", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-amber-200 text-slate-800 focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="relative md:col-span-2">
                <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-amber-500" />
                <textarea
                  placeholder="Address"
                  value={form.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  rows={3}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-amber-200 text-slate-800 focus:ring-2 focus:ring-amber-300 focus:border-transparent resize-none"
                  required
                />
              </div>

              <div>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Pin"
                  value={form.pin}
                  onChange={(e) => updateField("pin", e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="w-full px-4 py-3 rounded-xl border border-amber-200 text-slate-800 focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                  required
                />
              </div>

              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                <input
                  type="text"
                  placeholder="Education Qualification"
                  value={form.educationQualification}
                  onChange={(e) => updateField("educationQualification", e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-amber-200 text-slate-800 focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                  required
                />
              </div>

              <div className="relative">
                <Cake className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                <input
                  type="number"
                  min="1"
                  placeholder="Age"
                  value={form.age}
                  onChange={(e) => updateField("age", e.target.value.replace(/\D/g, ""))}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-amber-200 text-slate-800 focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Describe About Yourself (max 100 words)
              </label>
              <textarea
                value={form.aboutSelf}
                onChange={(e) => handleAboutChange(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-amber-200 text-slate-800 focus:ring-2 focus:ring-amber-300 focus:border-transparent resize-none"
                placeholder="Write about yourself..."
                required
              />
              <p className={`mt-1 text-xs ${aboutWordCount >= 100 ? "text-red-600" : "text-slate-500"}`}>
                {aboutWordCount}/100 words
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-white py-3 font-semibold hover:shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
