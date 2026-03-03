"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { 
  Mic, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Music2, 
  Users, 
  UserCircle2, 
  Clock3,
  Sparkles,
  Flower2,
  Drama,
  ChevronDown
} from "lucide-react";
import { createPerformerApplication } from "@/services/sponsorPerformerService";
import useAuthStore from "@/lib/stores/useAuthStore";

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
  const { user } = useAuthStore();
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
        confirmButtonColor: "#2563eb",
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
      userId: user?.uid || null,
    };

    try {
      setSubmitting(true);
      const submission = await createPerformerApplication(performerPayload);

      try {
        const { sendPerformerConfirmationEmail } = await import("@/services/emailService");
        await sendPerformerConfirmationEmail(performerPayload);
      } catch (emailError) {
        console.error("Failed to send performer email:", emailError);
      }

      await Swal.fire({
        html: `
          <div style="display:flex;flex-direction:column;align-items:center;gap:10px;padding:8px 4px;">
            <div style="width:56px;height:56px;border-radius:9999px;background:linear-gradient(135deg,#2563eb,#06b6d4);display:flex;align-items:center;justify-content:center;color:white;font-size:28px;font-weight:700;">✓</div>
            <h2 style="margin:0;font-size:1.25rem;color:#111827;">Performer Application Submitted</h2>
            <p style="margin:0;font-size:0.95rem;color:#4b5563;text-align:center;line-height:1.45;">
              Your request has been received successfully.
            </p>
            <p style="margin:0;font-size:0.85rem;font-weight:600;color:#1d4ed8;">ID: ${submission?.registrationId || "Generating..."}</p>
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

      router.push("/profile?tab=performer");
    } catch (error) {
      console.error("Error submitting performer application:", error);
      await Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Sorry, there was an error submitting your application. Please try again.",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const groupMemberCount = parseInt(form.memberCount || "0", 10) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-cyan-50 py-6 px-3 md:py-8 md:px-4">
      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-48 h-48 bg-blue-200/30 rounded-full blur-3xl -z-10"></div>
      <div className="fixed bottom-0 right-0 w-64 h-64 bg-cyan-200/30 rounded-full blur-3xl -z-10"></div>
      
      <div className="max-w-4xl mx-auto">
        {/* Header with Festival Theme */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm border border-blue-200 mb-3">
            <Flower2 className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-xs font-medium text-blue-600">Raja Parba 2026</span>
            <Flower2 className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
            Performer Application
          </h1>
          <p className="text-sm text-gray-600 mt-1 max-w-2xl mx-auto">
            Showcase your talent at the biggest cultural festival of Odisha
          </p>
        </div>

        {/* Main Form Card */}
        <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-200 overflow-hidden">
          {/* Decorative Top Border */}
          <div className="h-1.5 bg-gradient-to-r from-blue-400 via-indigo-500 to-cyan-600"></div>
          
          {/* Title Section with Background */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-5 py-3 border-b border-blue-200">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg shadow-md">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Performance Details</h2>
                <p className="text-xs text-gray-600">Fill in your information to apply as a performer</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="p-5 md:p-6">
            {/* Personal Information Section */}
            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-500" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Name */}
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="w-full rounded-lg border border-blue-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all"
                    required
                  />
                </div>

                {/* Email */}
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="w-full rounded-lg border border-blue-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all"
                    required
                  />
                </div>

                {/* Phone */}
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="w-full rounded-lg border border-blue-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all"
                    required
                  />
                </div>

                {/* Gender Dropdown */}
                <div className="relative">
                  <UserCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400 z-10" />
                  <select
                    value={form.gender}
                    onChange={(e) => updateField("gender", e.target.value)}
                    className="w-full rounded-lg border border-blue-200 bg-white py-2.5 pl-9 pr-8 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all appearance-none"
                    required
                  >
                    <option value="" disabled>Select Gender *</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400 pointer-events-none" />
                </div>

                {/* Address - Full Width */}
                <div className="relative md:col-span-2">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-blue-400" />
                  <textarea
                    placeholder="Address *"
                    value={form.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    className="w-full rounded-lg border border-blue-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all resize-none"
                    rows={2}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Performance Information Section */}
            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Drama className="w-4 h-4 text-indigo-500" />
                Performance Information
              </h3>

              <div className="space-y-3">
                {/* Performance Type */}
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-1.5">Performance Type *</p>
                  <div className="flex flex-wrap gap-1.5">
                    {performanceOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setPerformanceType(option)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                          form.performanceCategory === option
                            ? "border-indigo-500 bg-indigo-500 text-white shadow-sm"
                            : "border-blue-200 bg-white text-gray-600 hover:border-indigo-300 hover:bg-indigo-50"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Performance Type */}
                {form.performanceCategory === "Others" && (
                  <div className="relative">
                    <Music2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
                    <input
                      type="text"
                      placeholder="Specify your performance type *"
                      value={form.customPerformanceType}
                      onChange={(e) => {
                        const value = e.target.value;
                        setForm((prev) => ({
                          ...prev,
                          customPerformanceType: value,
                          performanceType: value,
                        }));
                      }}
                      className="w-full rounded-lg border border-blue-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all"
                      required
                    />
                  </div>
                )}

                {/* Solo/Group Selection */}
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-1.5">Participation Type *</p>
                  <div className="flex flex-wrap gap-1.5">
                    {participationOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setParticipationType(option)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                          form.participationType === option
                            ? "border-cyan-500 bg-cyan-500 text-white shadow-sm"
                            : "border-blue-200 bg-white text-gray-600 hover:border-cyan-300 hover:bg-cyan-50"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Group Details */}
                {form.participationType === "Group" && (
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-lg border border-cyan-200 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
                        <input
                          type="text"
                          placeholder="Group Name *"
                          value={form.groupName}
                          onChange={(e) => updateField("groupName", e.target.value)}
                          className="w-full rounded-lg border border-cyan-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-100 transition-all"
                          required
                        />
                      </div>

                      <div className="relative">
                        <UserCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="Number of Members *"
                          value={form.memberCount}
                          onChange={(e) => onMemberCountChange(e.target.value)}
                          className="w-full rounded-lg border border-cyan-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-100 transition-all"
                          required
                        />
                      </div>
                    </div>

                    {/* Member Names */}
                    {groupMemberCount > 0 && (
                      <div>
                        <p className="text-xs text-gray-600 mb-1.5">Member Names (Optional)</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {Array.from({ length: groupMemberCount }).map((_, index) => (
                            <input
                              key={`member-${index}`}
                              type="text"
                              placeholder={`Member ${index + 1} Name`}
                              value={form.memberNames[index] || ""}
                              onChange={(e) => onMemberNameChange(index, e.target.value)}
                              className="w-full rounded-lg border border-cyan-200 bg-white py-2 px-3 text-sm text-gray-700 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-100 transition-all"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Track Details - Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="relative">
                    <Music2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
                    <input
                      type="text"
                      placeholder="Track / Music Name *"
                      value={form.trackMusicName}
                      onChange={(e) => updateField("trackMusicName", e.target.value)}
                      className="w-full rounded-lg border border-blue-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all"
                      required
                    />
                  </div>

                  <div className="relative">
                    <Clock3 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
                    <input
                      type="text"
                      placeholder="Duration (e.g. 3:45) *"
                      value={form.trackDuration}
                      onChange={(e) => updateField("trackDuration", e.target.value)}
                      className="w-full rounded-lg border border-blue-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button - Centered */}
            <div className="flex  justify-center pt-4 border-t border-blue-200">
              <button
                type="submit"
                disabled={submitting}
                className="group cursor-pointer relative px-8 py-2.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 text-white font-medium text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
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
                      <span>Submit Application</span>
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-gray-500 mt-4">
          ✨ Our team will review your application and contact you within 24-48 hours
        </p>
      </div>
    </div>
  );
}

