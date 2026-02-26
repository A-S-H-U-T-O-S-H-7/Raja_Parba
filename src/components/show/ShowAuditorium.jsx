// components/show/ShowAuditorium.jsx
"use client";
import { useState, useEffect } from 'react';
import { ChevronDown, Info, ZoomIn, ZoomOut } from 'lucide-react';
import useUserShowBookingStore from '@/lib/stores/useUserShowBooking';

export default function ShowAuditorium() {
  const { 
    selectedSeats, 
    toggleSeat,
    getSeatColor,
    getSeatStatus,
    getSeatPrice,
    selectedDate,
    showSettings
  } = useUserShowBookingStore();

  const [zoomLevel, setZoomLevel] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Generate seat layout based on settings
  const generateSeats = () => {
    const seats = {};
    const premiumBlocks = showSettings?.seatLayout?.premiumBlocks || [
      { id: 'A', maxRows: 8, maxPairsPerRow: 7 },
      { id: 'B', maxRows: 8, maxPairsPerRow: 7 }
    ];
    const regularBlocks = showSettings?.seatLayout?.regularBlocks || [
      { id: 'C', maxRows: 25, maxSeatsPerRow: 15 },
      { id: 'D', maxRows: 25, maxSeatsPerRow: 15 }
    ];

    // Premium seats (A & B)
    premiumBlocks.forEach(block => {
      for (let row = 1; row <= block.maxRows; row++) {
        for (let pair = 0; pair < block.maxPairsPerRow; pair++) {
          const letter = String.fromCharCode(65 + pair);
          [1, 2].forEach(pos => {
            const seatId = `${block.id}-R${row}-${letter}${pos}`;
            seats[seatId] = { id: seatId };
          });
        }
      }
    });

    // Regular seats (C & D)
    regularBlocks.forEach(block => {
      for (let row = 1; row <= block.maxRows; row++) {
        for (let seat = 1; seat <= block.maxSeatsPerRow; seat++) {
          const seatId = `${block.id}-R${row}-S${seat}`;
          seats[seatId] = { id: seatId };
        }
      }
    });

    return seats;
  };

  const allSeats = generateSeats();

  const getFreeSeatsCount = () => {
    const counts = { A: 0, B: 0, C: 0, D: 0 };
    Object.keys(allSeats).forEach(seatId => {
      if (getSeatStatus(seatId) === 'available') {
        const section = seatId.charAt(0);
        counts[section]++;
      }
    });
    return counts;
  };

  const freeSeats = getFreeSeatsCount();
  const totalFree = Object.values(freeSeats).reduce((a, b) => a + b, 0);

  const renderVIPSection = () => {
    const rows = Array.from({ length: 8 }, (_, i) => i + 1);
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

    return (
      <div className="mb-8">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-amber-700">Premium Seating</h3>
          <p className="text-sm text-gray-600">₹{getSeatPrice('A-R1-A1').toLocaleString()} per seat</p>
        </div>

        <div className="flex items-center justify-center gap-8 mb-4">
          <div className="px-6 py-2 bg-amber-50 border-2 border-amber-300 rounded-lg font-bold text-amber-800">
            Block A
          </div>
          <div className="w-12"></div>
          <div className="px-6 py-2 bg-amber-50 border-2 border-amber-300 rounded-lg font-bold text-amber-800">
            Block B
          </div>
        </div>

        <div className="space-y-2">
          {rows.map(row => (
            <div key={row} className="flex items-center justify-center gap-8">
              {/* Block A */}
              <div className="flex gap-1">
                {letters.map(letter => (
                  <div key={letter} className="flex gap-0.5">
                    {[1, 2].map(pos => {
                      const seatId = `A-R${row}-${letter}${pos}`;
                      if (!allSeats[seatId]) return null;
                      const isSelected = selectedSeats.includes(seatId);
                      const status = getSeatStatus(seatId);
                      
                      return (
                        <button
                          key={seatId}
                          onClick={() => toggleSeat(seatId)}
                          disabled={status !== 'available' && !isSelected}
                          className={`
                            w-7 h-6 rounded-md text-xs font-bold transition-all
                            ${getSeatColor(seatId)}
                            ${status === 'available' || isSelected ? 'hover:scale-105 cursor-pointer' : 'cursor-not-allowed opacity-50'}
                            border border-amber-200 shadow-sm
                          `}
                        >
                          {letter}{pos}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="w-12 text-center font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded">
                R{row}
              </div>

              {/* Block B */}
              <div className="flex gap-1">
                {letters.map(letter => (
                  <div key={letter} className="flex gap-0.5">
                    {[1, 2].map(pos => {
                      const seatId = `B-R${row}-${letter}${pos}`;
                      if (!allSeats[seatId]) return null;
                      const isSelected = selectedSeats.includes(seatId);
                      const status = getSeatStatus(seatId);
                      
                      return (
                        <button
                          key={seatId}
                          onClick={() => toggleSeat(seatId)}
                          disabled={status !== 'available' && !isSelected}
                          className={`
                            w-7 h-6 rounded-md text-xs font-bold transition-all
                            ${getSeatColor(seatId)}
                            ${status === 'available' || isSelected ? 'hover:scale-105 cursor-pointer' : 'cursor-not-allowed opacity-50'}
                            border border-amber-200 shadow-sm
                          `}
                        >
                          {letter}{pos}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderRegularSection = () => {
    const rows = Array.from({ length: 25 }, (_, i) => i + 1);

    return (
      <div>
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-emerald-700">Regular Seating</h3>
          <p className="text-sm text-gray-600">
            Block C: ₹{getSeatPrice('C-R1-S1').toLocaleString()} | Block D: ₹{getSeatPrice('D-R1-S1').toLocaleString()}
          </p>
        </div>

        <div className="flex items-center justify-center gap-8 mb-4">
          <div className="px-6 py-2 bg-emerald-50 border-2 border-emerald-300 rounded-lg font-bold text-emerald-800">
            Block C
          </div>
          <div className="w-12"></div>
          <div className="px-6 py-2 bg-teal-50 border-2 border-teal-300 rounded-lg font-bold text-teal-800">
            Block D
          </div>
        </div>

        <div className="space-y-2">
          {rows.slice(0, 10).map(row => (
            <div key={row} className="flex items-center justify-center gap-8">
              {/* Block C */}
              <div className="flex gap-1">
                {Array.from({ length: 15 }, (_, i) => i + 1).map(seat => {
                  const seatId = `C-R${row}-S${seat}`;
                  if (!allSeats[seatId]) return null;
                  const isSelected = selectedSeats.includes(seatId);
                  const status = getSeatStatus(seatId);
                  
                  return (
                    <button
                      key={seatId}
                      onClick={() => toggleSeat(seatId)}
                      disabled={status !== 'available' && !isSelected}
                      className={`
                        w-5 h-5 rounded text-xs font-bold transition-all
                        ${getSeatColor(seatId)}
                        ${status === 'available' || isSelected ? 'hover:scale-110 cursor-pointer' : 'cursor-not-allowed opacity-50'}
                        border border-emerald-200 shadow-sm
                      `}
                    >
                      {seat}
                    </button>
                  );
                })}
              </div>

              <div className="w-10 text-center text-xs font-bold text-gray-600 bg-gray-100 px-1 py-0.5 rounded">
                R{row}
              </div>

              {/* Block D */}
              <div className="flex gap-1">
                {Array.from({ length: 15 }, (_, i) => i + 1).map(seat => {
                  const seatId = `D-R${row}-S${seat}`;
                  if (!allSeats[seatId]) return null;
                  const isSelected = selectedSeats.includes(seatId);
                  const status = getSeatStatus(seatId);
                  
                  return (
                    <button
                      key={seatId}
                      onClick={() => toggleSeat(seatId)}
                      disabled={status !== 'available' && !isSelected}
                      className={`
                        w-5 h-5 rounded text-xs font-bold transition-all
                        ${getSeatColor(seatId)}
                        ${status === 'available' || isSelected ? 'hover:scale-110 cursor-pointer' : 'cursor-not-allowed opacity-50'}
                        border border-teal-200 shadow-sm
                      `}
                    >
                      {seat}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 bg-white rounded-xl border border-gray-200">
      {/* Header with Zoom */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Auditorium Layout</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Zoom:</span>
          <button
            onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}
            className="p-1.5 bg-gray-100 rounded hover:bg-gray-200"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-600">{Math.round(zoomLevel * 100)}%</span>
          <button
            onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.1))}
            className="p-1.5 bg-gray-100 rounded hover:bg-gray-200"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Available Seats Summary */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-100 rounded-lg">
            <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
            <span className="font-semibold text-amber-800">A: {freeSeats.A}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-100 rounded-lg">
            <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
            <span className="font-semibold text-amber-800">B: {freeSeats.B}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-emerald-100 rounded-lg">
            <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
            <span className="font-semibold text-emerald-800">C: {freeSeats.C}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-teal-100 rounded-lg">
            <div className="w-3 h-3 bg-teal-400 rounded-full"></div>
            <span className="font-semibold text-teal-800">D: {freeSeats.D}</span>
          </div>
          <div className="px-4 py-2 bg-blue-500 text-white rounded-lg font-bold">
            Total: {totalFree}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-br from-amber-300 to-yellow-400 rounded"></div>
          <span>Premium Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-emerald-400 rounded"></div>
          <span>Block C Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-teal-300 rounded"></div>
          <span>Block D Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-600 rounded"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-400 rounded"></div>
          <span>Booked</span>
        </div>
      </div>

      {/* Layout */}
      <div 
        className="overflow-auto"
        style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
      >
        <div className="min-w-max pb-4">
          {/* Stage */}
          <div className="text-center mb-6">
            <div className="inline-block px-12 py-3 bg-gradient-to-r from-yellow-100 to-amber-100 border-2 border-dashed border-yellow-400 rounded-lg">
              <span className="text-lg font-bold text-yellow-700">🎭 STAGE 🎪</span>
            </div>
          </div>

          {renderVIPSection()}

          <div className="flex justify-center my-4">
            <div className="w-3/4 h-px bg-gray-300"></div>
          </div>

          {renderRegularSection()}
        </div>
      </div>

      {/* Scroll Down Button */}
      {selectedSeats.length > 0 && (
        <div className="mt-4 flex justify-end">
          <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-lg px-3 py-1">
            <Info className="w-4 h-4 text-rose-500" />
            <span className="text-rose-600 text-xs">Scroll down to continue</span>
            <button
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
              className="w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center hover:bg-rose-600 transition-colors"
            >
              <ChevronDown className="w-4 h-4 text-white animate-bounce" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}