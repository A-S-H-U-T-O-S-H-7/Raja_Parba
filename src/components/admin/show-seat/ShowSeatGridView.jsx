"use client";
import useThemeStore from "@/lib/stores/useThemeStore";
import { getAllShowBlocks } from "@/utils/showSeatUtils";

export default function ShowSeatGridView({ seats, showSettings, onSeatClick, getSeatColor }) {
  const { isDarkMode } = useThemeStore();
  const blocks = getAllShowBlocks(showSettings, { includeInactive: false });

  const getMaxRows = (section) => {
    const sectionSeats = seats.filter((seat) => seat.section === section);
    return Math.max(...sectionSeats.map((seat) => seat.row), 0);
  };

  const renderBlock = (block, index) => {
    const sectionSeats = seats.filter((seat) => seat.section === block.id);
    const maxRows = getMaxRows(block.id);
    const rows = Array.from({ length: maxRows }, (_, rowIndex) => rowIndex + 1);
    const isPremium = block.type === "premium";
    const toneClass = isPremium
      ? isDarkMode ? "text-yellow-400" : "text-amber-700"
      : index % 2 === 0
        ? isDarkMode ? "text-emerald-400" : "text-emerald-700"
        : isDarkMode ? "text-teal-400" : "text-teal-700";

    return (
      <div
        key={block.id}
        className={`rounded-xl border p-3 md:p-4 ${
          isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <h3 className={`text-base md:text-lg font-bold mb-3 md:mb-4 text-center ${toneClass}`}>
          {block.name} ({block.id}) (₹{Number(block.price || sectionSeats[0]?.price || 0).toLocaleString("en-IN")} per seat)
        </h3>

        <div className="space-y-1 md:space-y-2">
          {rows.map((row) => (
            <div key={`${block.id}-row-${row}`} className="flex flex-wrap justify-center gap-1">
              {sectionSeats
                .filter((seat) => seat.row === row)
                .sort((a, b) => String(a.displayName).localeCompare(String(b.displayName), undefined, { numeric: true }))
                .map((seat) => (
                  <button
                    key={seat.id}
                    onClick={() => onSeatClick(seat)}
                    disabled={seat.status === "booked"}
                    className={`flex items-center justify-center rounded text-xs font-bold transition-all ${
                      isPremium ? "w-6 h-6 md:w-8 md:h-8" : "w-4 h-4 md:w-6 md:h-6"
                    } ${seat.status === "booked" ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:scale-110"} ${getSeatColor(seat)}`}
                    title={`${seat.id} - ${seat.status}`}
                  >
                    {seat.displayName}
                  </button>
                ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="text-center mb-3 md:mb-4">
        <div
          className={`inline-flex items-center px-4 md:px-6 py-2 md:py-3 rounded-xl text-sm md:text-base border ${
            isDarkMode ? "bg-amber-900/30 text-amber-300 border-amber-700" : "bg-amber-100 text-amber-800 border-amber-300"
          }`}
        >
          STAGE
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {blocks.map((block, index) => renderBlock(block, index))}
      </div>
    </div>
  );
}
