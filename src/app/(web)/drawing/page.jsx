"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { PencilRuler, User, Mail, Phone, MapPin, Calendar, Cake, Camera } from "lucide-react";
import { createDrawingApplication } from "@/services/drawingService";
import useAuthStore from "@/lib/stores/useAuthStore";

const competitionItems = [
  "Self-introduction",
  "Quiz",
  "Drawing in the Given Topic",
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
  category: "",
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

const detectCategoryByAge = (ageNum) => {
  if (!Number.isFinite(ageNum) || ageNum <= 0) return "";
  if (ageNum < 16) return "Junior";
  return "Senior";
};

export default function DrawingPage() {
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
    const ageNum = Number(age || 0);
    const autoCategory = detectCategoryByAge(ageNum);
    setForm((prev) => ({ ...prev, dob: value, age, category: autoCategory || prev.category }));
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
      category: form.category || "",
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
      payload.category &&
      candidatePhoto;

    if (!hasAllRequired) {
      await Swal.fire({
        icon: "warning",
        title: "Missing Details",
        text: "Please complete all required fields, category, and upload candidate photo.",
      });
      return;
    }

    if (payload.category === "Junior" && payload.age >= 16) {
      await Swal.fire({
        icon: "warning",
        title: "Category Mismatch",
        text: "Junior category is only for candidates below 16.",
      });
      return;
    }

    if (payload.category === "Senior" && payload.age < 16) {
      await Swal.fire({
        icon: "warning",
        title: "Category Mismatch",
        text: "Senior category is only for candidates aged 16 and above.",
      });
      return;
    }

    try {
      setSubmitting(true);

      const result = await createDrawingApplication(payload, candidatePhoto);

      try {
        const { sendDrawingConfirmationEmail } = await import("@/services/emailService");
        await sendDrawingConfirmationEmail({
          ...payload,
          id: result.id,
          registrationId: result.id,
        });
      } catch (emailError) {
        console.error("Failed to send Drawing email:", emailError);
      }

      await Swal.fire({
        icon: "success",
        title: "Registration Submitted",
        text: "Drawing registration submitted successfully. Redirecting to your profile...",
        timer: 2300,
        showConfirmButton: false,
      });

      router.push("/profile");
    } catch (error) {
      console.error("Error submitting Drawing registration:", error);
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <section className="rounded-3xl border border-emerald-200 bg-white/90 shadow-lg p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <PencilRuler className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Drawing Competition Registration</h1>
              <p className="text-sm text-slate-600">Categories: Junior (&lt;16) and Senior (16+)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {competitionItems.map((item) => (
              <div
                key={item}
                className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 text-center"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-emerald-200 bg-white/95 shadow-xl p-6 sm:p-8">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Candidate Photo</label>
              <label className="relative flex items-center justify-center w-full h-40 border-2 border-dashed border-emerald-300 rounded-2xl bg-emerald-50 cursor-pointer hover:bg-emerald-100 transition">
                {photoPreview ? (
                  <img src={photoPreview} alt="Candidate preview" className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <div className="text-center text-slate-600">
                    <Camera className="w-6 h-6 mx-auto mb-2 text-emerald-500" />
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

            <div>
              <p className="block text-sm font-medium text-slate-700 mb-2">Category</p>
              <div className="grid grid-cols-2 gap-3">
                <label className={`rounded-xl border px-4 py-3 cursor-pointer transition ${form.category === "Junior" ? "border-emerald-500 bg-emerald-100 text-emerald-800" : "border-emerald-200 bg-white text-slate-700"}`}>
                  <input
                    type="radio"
                    name="category"
                    className="sr-only"
                    value="Junior"
                    checked={form.category === "Junior"}
                    onChange={(e) => updateField("category", e.target.value)}
                    required
                  />
                  Junior (till 16)
                </label>
                <label className={`rounded-xl border px-4 py-3 cursor-pointer transition ${form.category === "Senior" ? "border-emerald-500 bg-emerald-100 text-emerald-800" : "border-emerald-200 bg-white text-slate-700"}`}>
                  <input
                    type="radio"
                    name="category"
                    className="sr-only"
                    value="Senior"
                    checked={form.category === "Senior"}
                    onChange={(e) => updateField("category", e.target.value)}
                    required
                  />
                  Senior (16+)
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                <input
                  type="text"
                  placeholder="Candidate Name"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-emerald-200 text-slate-800 focus:ring-2 focus:ring-emerald-300 focus:border-transparent"
                  required
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-emerald-200 text-slate-800 focus:ring-2 focus:ring-emerald-300 focus:border-transparent"
                  required
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-emerald-200 text-slate-800 focus:ring-2 focus:ring-emerald-300 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <select
                  value={form.gender}
                  onChange={(e) => updateField("gender", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-emerald-200 text-slate-800 focus:ring-2 focus:ring-emerald-300 focus:border-transparent"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                <input
                  type="text"
                  placeholder="Location"
                  value={form.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-emerald-200 text-slate-800 focus:ring-2 focus:ring-emerald-300 focus:border-transparent"
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
                  className="w-full px-4 py-3 rounded-xl border border-emerald-200 text-slate-800 focus:ring-2 focus:ring-emerald-300 focus:border-transparent"
                  required
                />
              </div>

              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                <input
                  type="date"
                  value={form.dob}
                  onChange={(e) => handleDobChange(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-emerald-200 text-slate-800 focus:ring-2 focus:ring-emerald-300 focus:border-transparent"
                  required
                />
              </div>

              <div className="relative">
                <Cake className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                <input
                  type="text"
                  placeholder="Age (auto calculated)"
                  value={form.age}
                  disabled
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-emerald-200 bg-slate-100 text-slate-600 cursor-not-allowed"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 font-semibold hover:shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit Registration"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
