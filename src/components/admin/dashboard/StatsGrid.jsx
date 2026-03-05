// components/admin/dashboard/StatsGrid.jsx
"use client";

import { 
  Sparkles, Mic2, Crown, Gem, Trophy, Medal, 
  Store, CalendarDays, Ticket, Users 
} from "lucide-react";
import useThemeStore from "@/lib/stores/useThemeStore";

const cardAccent = {
  sponsor: "from-rose-500 to-red-600",
  performer: "from-fuchsia-500 to-pink-600",
  queen: "from-purple-500 to-violet-600",
  kumari: "from-orange-500 to-amber-600",
  award: "from-yellow-500 to-orange-600",
  drawing: "from-cyan-500 to-sky-600",
  stall: "from-emerald-500 to-teal-600",
  show: "from-indigo-500 to-blue-600",
  entry: "from-lime-500 to-green-600",
  users: "from-slate-600 to-gray-700",
};

const cardGradient = {
  sponsor: "from-rose-50 to-rose-100/50",
  performer: "from-fuchsia-50 to-fuchsia-100/50",
  queen: "from-purple-50 to-purple-100/50",
  kumari: "from-orange-50 to-orange-100/50",
  award: "from-yellow-50 to-yellow-100/50",
  drawing: "from-cyan-50 to-cyan-100/50",
  stall: "from-emerald-50 to-emerald-100/50",
  show: "from-indigo-50 to-indigo-100/50",
  entry: "from-lime-50 to-lime-100/50",
  users: "from-gray-50 to-gray-100/50",
};

const registrationCards = [
  { key: "sponsor", title: "Sponsors", icon: Sparkles },
  { key: "performer", title: "Performers", icon: Mic2 },
  { key: "queen", title: "Raja Queen", icon: Crown },
  { key: "kumari", title: "Raja Kumari", icon: Gem },
  { key: "award", title: "Award", icon: Trophy },
  { key: "drawing", title: "Drawing", icon: Medal },
  { key: "stall", title: "Stall Bookings", icon: Store },
  { key: "show", title: "Show Bookings", icon: CalendarDays },
  { key: "entry", title: "Entry Pass", icon: Ticket },
  { key: "users", title: "Users", icon: Users },
];

export default function StatsGrid({ metrics }) {
  const { isDarkMode } = useThemeStore();

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {registrationCards.map((card) => {
        const Icon = card.icon;
        const value = metrics[card.key] || 0;
        
        return (
          <div
            key={card.key}
            className={`rounded-xl border p-4 shadow-sm transition-all duration-200 hover:shadow-md ${
              isDarkMode 
                ? "border-gray-700 bg-gray-800" 
                : `border-gray-200 bg-gradient-to-br ${cardGradient[card.key]}`
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`inline-flex rounded-lg bg-gradient-to-r p-2.5 text-white shadow-sm ${cardAccent[card.key]}`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <p className={`text-2xl font-extrabold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                {value}
              </p>
            </div>
            <p className={`mt-3 text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              {card.title}
            </p>
          </div>
        );
      })}
    </section>
  );
}