// components/admin/show-seats/ShowSeatGridView.jsx
"use client";
import useThemeStore from "@/lib/stores/useThemeStore";

export default function ShowSeatGridView({ seats, onSeatClick, selectedSeats, getSeatColor }) {
  const { isDarkMode } = useThemeStore();

  // Get unique sections
  const vipSections = ['A', 'B'];
  const regularSections = ['C', 'D'];

  // Get max rows for each section
  const getMaxRows = (section) => {
    const sectionSeats = seats.filter(seat => seat.section === section);
    return Math.max(...sectionSeats.map(seat => seat.row), 0);
  };

  const renderVIPSection = (section) => {
    const sectionSeats = seats.filter(seat => seat.section === section);
    const maxRows = getMaxRows(section);
    const rows = Array.from({ length: maxRows }, (_, i) => i + 1);

    return (
      <div key={`vip-section-${section}`} className={`rounded-xl border p-3 md:p-4 ${
        isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-base md:text-lg font-bold mb-3 md:mb-4 text-center ${
          isDarkMode ? 'text-yellow-400' : 'text-amber-700'
        }`}>
          🎭 Block {section} (₹1000 per seat)
        </h3>
        
        <div className="space-y-1 md:space-y-2">
          {rows.map(row => (
            <div key={`${section}-row-${row}`} className="flex flex-wrap justify-center gap-1">
              {sectionSeats
                .filter(seat => seat.row === row)
                .sort((a, b) => {
                  const letterA = a.displayName.match(/[A-G]/)?.[0] || '';
                  const letterB = b.displayName.match(/[A-G]/)?.[0] || '';
                  return letterA.localeCompare(letterB);
                })
                .map(seat => (
                  <button
                    key={seat.id}
                    onClick={() => onSeatClick(seat)}
                    disabled={seat.status === 'booked'}
                    className={`w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded text-xs font-bold transition-all ${
                      seat.status === 'booked' ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:scale-110'
                    } ${getSeatColor(seat)}`}
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

  const renderRegularSection = (section) => {
    const sectionSeats = seats.filter(seat => seat.section === section);
    const maxRows = getMaxRows(section);
    const rows = Array.from({ length: maxRows }, (_, i) => i + 1);

    return (
      <div key={`regular-section-${section}`} className={`rounded-xl border p-3 md:p-4 ${
        isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-base md:text-lg font-bold mb-3 md:mb-4 text-center ${
          section === 'C' 
            ? isDarkMode ? 'text-emerald-400' : 'text-emerald-700'
            : isDarkMode ? 'text-teal-400' : 'text-teal-700'
        }`}>
          🪑 Block {section} (₹{section === 'C' ? '1000' : '500'} per seat)
        </h3>
        
        <div className="space-y-1">
          {rows.map(row => (
            <div key={`${section}-row-${row}`} className="flex flex-wrap justify-center gap-1">
              {sectionSeats
                .filter(seat => seat.row === row)
                .map(seat => (
                  <button
                    key={seat.id}
                    onClick={() => onSeatClick(seat)}
                    disabled={seat.status === 'booked'}
                    className={`w-4 h-4 md:w-6 md:h-6 flex items-center justify-center rounded text-xs font-bold transition-all ${
                      seat.status === 'booked' ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:scale-110'
                    } ${getSeatColor(seat)}`}
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
      <div key="stage-label" className="text-center mb-3 md:mb-4">
        <div className={`inline-flex items-center px-4 md:px-6 py-2 md:py-3 rounded-xl text-sm md:text-base ${
          isDarkMode ? 'bg-amber-900/30 text-amber-300 border-amber-700' : 'bg-amber-100 text-amber-800 border-amber-300'
        } border`}>
          🎭 STAGE 🎭
        </div>
      </div>

      <div key="vip-sections" className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {vipSections.map(section => renderVIPSection(section))}
      </div>

      <div key="regular-sections" className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {regularSections.map(section => renderRegularSection(section))}
      </div>
    </div>
  );
}