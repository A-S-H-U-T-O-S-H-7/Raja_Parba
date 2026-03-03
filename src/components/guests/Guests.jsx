"use client";

import React, { useState, useEffect } from "react";
import GuestCard from "@/components/guests/GuestCard";
import GuestBanner from "@/components/guests/GuestBanner";
import useGuestStore from "@/lib/stores/useGuestStore";
import { Flower2, Music, Star, Users } from "lucide-react";

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
    <section>
      <div className="text-center mb-6">
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

  useEffect(() => { fetchPublicGuests(); }, [fetchPublicGuests]);

  const guests = publicGuests || [];
  const spiritual = guests.filter((g) => g.category === "spiritual");
  const artist    = guests.filter((g) => g.category === "artist");
  const special   = guests.filter((g) => g.category === "special");

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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-cyan-50 to-blue-100">
      <GuestBanner />
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {pills.map(({ id, label, Icon, count }) => {
            const active = selected === id;
            return (
              <button
                key={id}
                onClick={() => setSelected(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  active
                    ? "bg-amber-500 text-white shadow"
                    : "bg-white text-amber-800 border border-amber-200 hover:bg-amber-50"
                }`}
              >
                <Icon size={14} />
                {label}
                {count !== null && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${active ? "bg-amber-400 text-white" : "bg-amber-100 text-amber-600"}`}>
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
          <div className="text-center py-16 bg-white rounded-2xl border border-amber-100">
            <p className="text-amber-600">No guests available for this category.</p>
          </div>
        )}

        <div className="text-center mt-10 pt-6 border-t border-amber-200">
          <p className="text-sm text-amber-600 italic">Celebrating the souls shaping the spirit of Raja Parba</p>
        </div>
      </div>
    </div>
  );
}