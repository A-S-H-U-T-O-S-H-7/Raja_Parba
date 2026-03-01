"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Mic, User, Mail, Phone, MapPin, Music2, Users, UserCircle2, Clock3 } from "lucide-react";
import { createPerformerApplication } from "@/services/sponsorPerformerService";

const performanceOptions = ["Song", "Dance", "Others"];
const participationOptions = ["Solo", "Group"];

const initialForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
  gender: "",
  performanceCategory: "",
  customPerformanceType: "",
  performanceType: "",
  participationType: "",
  groupName: "",
  memberCount: "",
  memberNames: [],
  trackMusicName: "",
  trackDuration: "",
};

export default function PerformerPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const setPerformanceType = (type) => {
    if (type === "Others") {
      setForm((prev) => ({
        ...prev,
        performanceCategory: type,
        performanceType: prev.customPerformanceType || "",
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      performanceCategory: type,
      performanceType: type,
      customPerformanceType: "",
    }));
  };

  const setParticipationType = (type) => {
    if (type === "Solo") {
      setForm((prev) => ({
        ...prev,
        participationType: type,
        groupName: "",
        memberCount: "",
        memberNames: [],
      }));
      return;
    }

    setForm((prev) => ({ ...prev, participationType: type }));
  };

  const onMemberCountChange = (rawValue) => {
    const cleanValue = rawValue.replace(/\D/g, "");
    const count = cleanValue ? Math.min(parseInt(cleanValue, 10), 20) : 0;

    setForm((prev) => {
      const currentMembers = Array.isArray(prev.memberNames) ? prev.memberNames : [];
      const nextMembers = Array.from({ length: count }, (_, index) => currentMembers[index] || "");

      return {
        ...prev,
        memberCount: cleanValue ? String(count) : "",
        memberNames: nextMembers,
      };
    });
  };

  const onMemberNameChange = (index, value) => {
    setForm((prev) => {
      const nextMembers = Array.isArray(prev.memberNames) ? [...prev.memberNames] : [];
      nextMembers[index] = value;
      return {
        ...prev,
        memberNames: nextMembers,
      };
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const resolvedPerformanceType =
      form.performanceCategory === "Others"
        ? (form.customPerformanceType || "").trim()
        : (form.performanceCategory || "").trim();

    const isGroup = form.participationType === "Group";
    const memberCount = Number(form.memberCount || 0);

    const isFormValid =
      (form.name || "").trim() &&
      (form.email || "").trim() &&
      (form.phone || "").trim() &&
      (form.address || "").trim() &&
      (form.gender || "").trim() &&
      (form.participationType || "").trim() &&
      (form.trackMusicName || "").trim() &&
      (form.trackDuration || "").trim() &&
      resolvedPerformanceType &&
      (!isGroup || ((form.groupName || "").trim() && memberCount > 0));

    if (!isFormValid) {
      await Swal.fire({
        icon: "warning",
        title: "Missing Details",
        text: "Please complete all required fields before submitting.",
      });
      return;
    }

    const performerPayload = {
      ...form,
      performanceType: resolvedPerformanceType,
      groupName: isGroup ? form.groupName.trim() : "",
      memberCount: isGroup ? String(memberCount) : "",
      memberNames: isGroup ? (form.memberNames || []) : [],
      trackMusicName: form.trackMusicName.trim(),
      trackDuration: form.trackDuration.trim(),
    };

    try {
      setSubmitting(true);
      await createPerformerApplication(performerPayload);

      try {
        const { sendPerformerConfirmationEmail } = await import("@/services/emailService");
        await sendPerformerConfirmationEmail(performerPayload);
      } catch (emailError) {
        console.error("Failed to send performer email:", emailError);
      }

      await Swal.fire({
        icon: "success",
        title: "Application Submitted",
        text: "Thank you for applying as a performer. Redirecting to home page...",
        timer: 2200,
        showConfirmButton: false,
      });

      router.push("/");
    } catch (error) {
      console.error("Error submitting performer application:", error);
      await Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Sorry, there was an error submitting your application. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const groupMemberCount = parseInt(form.memberCount || "0", 10) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-indigo-50 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="relative w-full rounded-3xl border border-cyan-200 bg-white/90 shadow-2xl overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600" />

          <div className="p-5 sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 shadow-md">
                <Mic className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Performer Application</h1>
                <p className="text-xs sm:text-sm text-slate-600">Fill your details and talent profile.</p>
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-4 max-h-[78vh] overflow-y-auto pr-1">
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-600" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full rounded-xl border border-cyan-200 bg-white/90 py-3 pl-11 pr-4 text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                  required
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-600" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full rounded-xl border border-cyan-200 bg-white/90 py-3 pl-11 pr-4 text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                  required
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-600" />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="w-full rounded-xl border border-cyan-200 bg-white/90 py-3 pl-11 pr-4 text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                  required
                />
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-4 h-5 w-5 text-cyan-600" />
                <textarea
                  placeholder="Address"
                  value={form.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  className="w-full resize-none rounded-xl border border-cyan-200 bg-white/90 py-3 pl-11 pr-4 text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                  rows={3}
                  required
                />
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-slate-700">Gender</p>
                <div className="grid grid-cols-3 gap-2">
                  {["Male", "Female", "Other"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => updateField("gender", option)}
                      className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                        form.gender === option
                          ? "border-cyan-500 bg-cyan-500 text-white"
                          : "border-cyan-200 bg-white text-slate-700 hover:border-cyan-400"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-slate-700">Performance Type</p>
                <div className="grid grid-cols-3 gap-2">
                  {performanceOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setPerformanceType(option)}
                      className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                        form.performanceCategory === option
                          ? "border-indigo-500 bg-indigo-500 text-white"
                          : "border-cyan-200 bg-white text-slate-700 hover:border-indigo-300"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {form.performanceCategory === "Others" && (
                <div className="relative">
                  <Music2 className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-600" />
                  <input
                    type="text"
                    placeholder="Write your performance type"
                    value={form.customPerformanceType}
                    onChange={(e) => {
                      const value = e.target.value;
                      setForm((prev) => ({
                        ...prev,
                        customPerformanceType: value,
                        performanceType: value,
                      }));
                    }}
                    className="w-full rounded-xl border border-cyan-200 bg-white/90 py-3 pl-11 pr-4 text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                    required
                  />
                </div>
              )}

              <div>
                <p className="mb-2 text-sm font-semibold text-slate-700">Solo or Group</p>
                <div className="grid grid-cols-2 gap-2">
                  {participationOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setParticipationType(option)}
                      className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                        form.participationType === option
                          ? "border-cyan-600 bg-cyan-600 text-white"
                          : "border-cyan-200 bg-white text-slate-700 hover:border-cyan-400"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {form.participationType === "Group" && (
                <div className="rounded-2xl border border-cyan-200 bg-white/80 p-3 sm:p-4 space-y-3">
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-600" />
                    <input
                      type="text"
                      placeholder="Group Name"
                      value={form.groupName}
                      onChange={(e) => updateField("groupName", e.target.value)}
                      className="w-full rounded-xl border border-cyan-200 bg-white py-3 pl-11 pr-4 text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                      required
                    />
                  </div>

                  <div className="relative">
                    <UserCircle2 className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-600" />
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="How many members?"
                      value={form.memberCount}
                      onChange={(e) => onMemberCountChange(e.target.value)}
                      className="w-full rounded-xl border border-cyan-200 bg-white py-3 pl-11 pr-4 text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                      required
                    />
                  </div>

                  {groupMemberCount > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs text-slate-500">Member names (optional)</p>
                      {Array.from({ length: groupMemberCount }).map((_, index) => (
                        <input
                          key={`member-${index}`}
                          type="text"
                          placeholder={`Member ${index + 1} Name`}
                          value={form.memberNames[index] || ""}
                          onChange={(e) => onMemberNameChange(index, e.target.value)}
                          className="w-full rounded-xl border border-cyan-200 bg-white py-2.5 px-3 text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="relative">
                <Music2 className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-600" />
                <input
                  type="text"
                  placeholder="Track / Music Name"
                  value={form.trackMusicName}
                  onChange={(e) => updateField("trackMusicName", e.target.value)}
                  className="w-full rounded-xl border border-cyan-200 bg-white/90 py-3 pl-11 pr-4 text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                  required
                />
              </div>

              <div className="relative">
                <Clock3 className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-600" />
                <input
                  type="text"
                  placeholder="Track Duration (e.g. 3:45)"
                  value={form.trackDuration}
                  onChange={(e) => updateField("trackDuration", e.target.value)}
                  className="w-full rounded-xl border border-cyan-200 bg-white/90 py-3 pl-11 pr-4 text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 w-full rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 px-4 py-3 font-semibold text-white shadow-md transition hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit Performer Request"}
              </button>

              <p className="pb-1 text-center text-xs text-slate-600">
                Our team will contact you within 24 hours.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
