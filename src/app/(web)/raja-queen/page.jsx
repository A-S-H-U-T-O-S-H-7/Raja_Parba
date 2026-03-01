"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Crown, User, Mail, Phone, MapPin, Calendar, Cake, Camera } from "lucide-react";
import { createRajaQueenApplication } from "@/services/rajaQueenService";

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

export default function RajaQueenPage() {
  const router = useRouter();
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

    setCandidatePhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
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
      ageGroup: "15-30",
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
      });
      return;
    }

    if (payload.age < 15 || payload.age > 30) {
      await Swal.fire({
        icon: "warning",
        title: "Age Not Eligible",
        text: "Raja Queen age group is 15 to 30 years only.",
      });
      return;
    }

    try {
      setSubmitting(true);

      const result = await createRajaQueenApplication(payload, candidatePhoto);

      try {
        const { sendRajaQueenConfirmationEmail } = await import("@/services/emailService");
        await sendRajaQueenConfirmationEmail({
          ...payload,
          id: result.id,
          registrationId: result.id,
        });
      } catch (emailError) {
        console.error("Failed to send Raja Queen email:", emailError);
      }

      await Swal.fire({
        icon: "success",
        title: "Registration Submitted",
        text: "Raja Queen registration submitted successfully. Redirecting to home...",
        timer: 2300,
        showConfirmButton: false,
      });

      router.push("/");
    } catch (error) {
      console.error("Error submitting Raja Queen registration:", error);
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-fuchsia-50 px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <section className="rounded-3xl border border-pink-200 bg-white/90 shadow-lg p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-pink-500 to-fuchsia-600 flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Raja Queen Registration</h1>
              <p className="text-sm text-slate-600">Age Group: 15 to 30 years</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {competitionItems.map((item) => (
              <div
                key={item}
                className="rounded-xl border border-pink-200 bg-pink-50 px-3 py-2 text-sm font-semibold text-pink-700 text-center"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-pink-200 bg-white/95 shadow-xl p-6 sm:p-8">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Candidate Photo</label>
              <label className="relative flex items-center justify-center w-full h-40 border-2 border-dashed border-pink-300 rounded-2xl bg-pink-50 cursor-pointer hover:bg-pink-100 transition">
                {photoPreview ? (
                  <img src={photoPreview} alt="Candidate preview" className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <div className="text-center text-slate-600">
                    <Camera className="w-6 h-6 mx-auto mb-2 text-pink-500" />
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
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-500" />
                <input
                  type="text"
                  placeholder="Candidate Name"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-pink-200 text-slate-800 focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                  required
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-500" />
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-pink-200 text-slate-800 focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                  required
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-500" />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-pink-200 text-slate-800 focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <select
                  value={form.gender}
                  onChange={(e) => updateField("gender", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 text-slate-800 focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-500" />
                <input
                  type="text"
                  placeholder="Location"
                  value={form.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-pink-200 text-slate-800 focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Pincode"
                  value={form.pincode}
                  onChange={(e) => updateField("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 text-slate-800 focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                  required
                />
              </div>

              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-500" />
                <input
                  type="date"
                  value={form.dob}
                  onChange={(e) => handleDobChange(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-pink-200 text-slate-800 focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                  required
                />
              </div>

              <div className="relative">
                <Cake className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-500" />
                <input
                  type="text"
                  placeholder="Age (auto calculated)"
                  value={form.age}
                  disabled
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-pink-200 bg-slate-100 text-slate-600 cursor-not-allowed"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white py-3 font-semibold hover:shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit Registration"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
