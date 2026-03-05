"use client";

import React, { useState, useEffect } from "react";
import GuestCard from "@/components/guests/GuestCard";
import GuestBanner from "@/components/guests/GuestBanner";
import useGuestStore from "@/lib/stores/useGuestStore";
import { Flower2, Music, Star, Users, Sparkles, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const META = {
  spiritual: "Revered voices guiding devotion and wisdom",
  artist: "Celebrating heritage through music, dance and expression",
  special: "Honoured personalities elevating Raja Parba",
};

function Divider() {
  return (
    <div className="flex items-center justify-center gap-2 mt-3">
      <div className="h-px w-16 bg-amber-300" />
      <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
      <div className="h-px w-16 bg-amber-300" />
    </div>
  );
}

function GuestSection({ title, guests, category }) {
  if (!guests?.length) return null;
  return (
    <section
      className="rounded-3xl border border-white/70 bg-white/70 backdrop-blur-sm p-5 sm:p-7 shadow-[0_8px_30px_rgba(180,130,40,0.08)]"
    >
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-100/90 px-4 py-1.5 text-xs font-semibold text-amber-700 border border-amber-200 mb-3">
          <Sparkles size={14} />
          Featured Category
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold text-amber-900 mb-1">{title}</h2>
        <p className="text-sm text-amber-600 opacity-80">{META[category]}</p>
        <Divider />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {guests.map((g) => <GuestCard key={g.id} guest={g} />)}
      </div>
    </section>
  );
}

export default function GuestsPage() {
  const { publicGuests, loading, fetchPublicGuests } = useGuestStore();
  const [selected, setSelected] = useState("all");
  const router = useRouter();

  useEffect(() => { fetchPublicGuests(); }, [fetchPublicGuests]);

  const guests = publicGuests || [];
  const spiritual = guests.filter((g) => g.category === "spiritual");
  const artist    = guests.filter((g) => g.category === "artist");
  const special   = guests.filter((g) => g.category === "special");
  const totalGuests = guests.length;

  const pills = [
    { id: "all",       label: "All Guests",     Icon: Users,   count: null },
    { id: "spiritual", label: "Spiritual Gurus", Icon: Flower2, count: spiritual.length },
    { id: "artist",    label: "Artists",         Icon: Music,   count: artist.length },
    { id: "special",   label: "Special Guests",  Icon: Star,    count: special.length },
  ].filter((p) => p.count === null || p.count > 0);

  const sections =
    selected === "spiritual" ? { spiritual } :
    selected === "artist"    ? { artist }    :
    selected === "special"   ? { special }   :
    { spiritual, artist, special };

  const isEmpty = Object.values(sections).every((s) => !s?.length);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-2 border-amber-300 border-t-amber-500 animate-spin mx-auto mb-3" />
          <p className="text-sm text-amber-600">Loading guests</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fbff] via-[#eef7ff] to-[#e6f2ff] relative">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_1px_1px,rgba(30,64,175,0.09)_1px,transparent_1px)] [background-size:18px_18px]" />
      <GuestBanner />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-5">
          <button
            onClick={() => {
              if (typeof window !== "undefined" && window.history.length > 1) {
                router.back();
                return;
              }
              router.push("/");
            }}
            className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm transition-all hover:bg-indigo-50 hover:border-indigo-300"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7">
          {[
            { label: "Total Guests", value: totalGuests, color: "text-indigo-700 bg-indigo-50 border-indigo-200" },
            { label: "Spiritual", value: spiritual.length, color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
            { label: "Artists", value: artist.length, color: "text-rose-700 bg-rose-50 border-rose-200" },
            { label: "Special", value: special.length, color: "text-blue-700 bg-blue-50 border-blue-200" },
          ].map((item) => (
            <div
              key={item.label}
              className={`rounded-2xl border px-4 py-3 shadow-sm ${item.color}`}
            >
              <p className="text-xs font-semibold uppercase tracking-wide opacity-80">{item.label}</p>
              <p className="text-2xl font-bold mt-1">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8 rounded-2xl border border-blue-100 bg-white/80 backdrop-blur-sm p-3 shadow-sm">
          {pills.map(({ id, label, Icon, count }) => {
            const active = selected === id;
            return (
              <button
                key={id}
                onClick={() => setSelected(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  active
                    ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-blue-50"
                }`}
              >
                <Icon size={14} />
                {label}
                {count !== null && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${active ? "bg-white/25 text-white" : "bg-blue-100 text-blue-700"}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="space-y-12">
          {sections.spiritual?.length > 0 && <GuestSection title="Spiritual Gurus" guests={sections.spiritual} category="spiritual" />}
          {sections.artist?.length    > 0 && <GuestSection title="Artists"         guests={sections.artist}    category="artist"    />}
          {sections.special?.length   > 0 && <GuestSection title="Special Guests"  guests={sections.special}  category="special"   />}
        </div>

        {isEmpty && (
          <div className="text-center py-16 bg-white rounded-2xl border border-blue-100 shadow-sm">
            <p className="text-gray-700 font-medium">No guests available for this category.</p>
          </div>
        )}

        <div className="text-center mt-10 pt-6 border-t border-blue-200">
          <p className="text-sm text-gray-700 italic">Celebrating the souls shaping the spirit of Raja Parba</p>
        </div>
      </div>
    </div>
  );
}
