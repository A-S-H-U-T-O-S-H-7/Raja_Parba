"use client";
import { useState } from 'react';
import { ChevronDown, Info, ZoomIn, ZoomOut } from 'lucide-react';
import useUserShowBookingStore from '@/lib/stores/useUserShowBooking';

const DEFAULT_PREMIUM_BLOCKS = [
  { id: 'A', name: 'Block A', maxRows: 8, maxPairsPerRow: 7, isActive: true },
  { id: 'B', name: 'Block B', maxRows: 8, maxPairsPerRow: 7, isActive: true }
];

const DEFAULT_REGULAR_BLOCKS = [
  { id: 'C', name: 'Block C', maxRows: 25, maxSeatsPerRow: 15, isActive: true },
  { id: 'D', name: 'Block D', maxRows: 25, maxSeatsPerRow: 15, isActive: true }
];

export default function ShowAuditorium() {
  const {
    selectedSeats,
    toggleSeat,
    getSeatColor,
    getSeatStatus,
    getSeatPrice,
    showSettings
  } = useUserShowBookingStore();

  const [zoomLevel, setZoomLevel] = useState(1);

  const premiumBlocks = (showSettings?.seatLayout?.premiumBlocks || DEFAULT_PREMIUM_BLOCKS)
    .filter((block) => block?.isActive !== false);
  const regularBlocks = (showSettings?.seatLayout?.regularBlocks || DEFAULT_REGULAR_BLOCKS)
    .filter((block) => block?.isActive !== false);

  const generateSeats = () => {
    const seats = {};

    premiumBlocks.forEach((block) => {
      const rows = Number(block.maxRows) || 0;
      const pairs = Number(block.maxPairsPerRow) || 0;
      for (let row = 1; row <= rows; row++) {
        for (let pair = 0; pair < pairs; pair++) {
          const letter = String.fromCharCode(65 + pair);
          [1, 2].forEach((pos) => {
            const seatId = `${block.id}-R${row}-${letter}${pos}`;
            seats[seatId] = { id: seatId };
          });
        }
      }
    });

    regularBlocks.forEach((block) => {
      const rows = Number(block.maxRows) || 0;
      const seatsPerRow = Number(block.maxSeatsPerRow) || 0;
      for (let row = 1; row <= rows; row++) {
        for (let seat = 1; seat <= seatsPerRow; seat++) {
          const seatId = `${block.id}-R${row}-S${seat}`;
          seats[seatId] = { id: seatId };
        }
      }
    });

    return seats;
  };

  const allSeats = generateSeats();

  const getFreeSeatsCount = () => {
    const counts = {};
    Object.keys(allSeats).forEach((seatId) => {
      if (getSeatStatus(seatId) === 'available') {
        const section = seatId.charAt(0);
        counts[section] = (counts[section] || 0) + 1;
      }
    });
    return counts;
  };

  const freeSeats = getFreeSeatsCount();
  const totalFree = Object.values(freeSeats).reduce((a, b) => a + b, 0);

  const renderVIPSection = () => {
    if (premiumBlocks.length === 0) return null;
    const hasTwoColumns = premiumBlocks.length === 2;
    const maxRows = Math.max(...premiumBlocks.map((block) => Number(block.maxRows) || 0));
    const rows = Array.from({ length: maxRows }, (_, i) => i + 1);

    return (
      <div className="mb-8">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-amber-700">Premium Seating</h3>
          <p className="text-sm text-gray-600">
            From Rs {getSeatPrice(`${premiumBlocks[0].id}-R1-A1`).toLocaleString()} per seat
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
          {premiumBlocks.map((block) => (
            <div key={block.id} className="px-6 py-2 bg-amber-50 border-2 border-amber-300 rounded-lg font-bold text-amber-800">
              {block.name || `Block ${block.id}`}
            </div>
          ))}
        </div>

        <div className="space-y-2">
          {rows.map((row) => (
            <div key={row} className="flex items-center justify-center gap-4 flex-wrap">
              {premiumBlocks.map((block, index) => {
                const blockRows = Number(block.maxRows) || 0;
                const pairCount = Number(block.maxPairsPerRow) || 0;
                const blockContent = row > blockRows
                  ? <div key={`${block.id}-${row}`} className="min-w-[140px] h-6" />
                  : (
                    <div key={`${block.id}-${row}`} className="flex gap-1">
                      {Array.from({ length: pairCount }, (_, i) => String.fromCharCode(65 + i)).map((letter) => (
                        <div key={`${block.id}-${letter}`} className="flex gap-0.5">
                          {[1, 2].map((pos) => {
                            const seatId = `${block.id}-R${row}-${letter}${pos}`;
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
                  );

                if (hasTwoColumns && index === 0) {
                  return (
                    <div key={`vip-left-${row}`} className="flex items-center gap-4">
                      {blockContent}
                      <div className="w-12 text-center font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded">
                        R{row}
                      </div>
                    </div>
                  );
                }

                return blockContent;
              })}
              {!hasTwoColumns && (
                <div className="w-12 text-center font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded">
                  R{row}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderRegularSection = () => {
    if (regularBlocks.length === 0) return null;
    const hasTwoColumns = regularBlocks.length === 2;
    const maxRows = Math.max(...regularBlocks.map((block) => Number(block.maxRows) || 0));
    const rows = Array.from({ length: maxRows }, (_, i) => i + 1);

    return (
      <div>
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-emerald-700">Regular Seating</h3>
          <p className="text-sm text-gray-600">
            {regularBlocks.map((block) => `${block.name || `Block ${block.id}`}: Rs ${getSeatPrice(`${block.id}-R1-S1`).toLocaleString()}`).join(' | ')}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
          {regularBlocks.map((block, index) => (
            <div
              key={block.id}
              className={`px-6 py-2 border-2 rounded-lg font-bold ${
                index % 2 === 0
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-teal-50 border-teal-300 text-teal-800'
              }`}
            >
              {block.name || `Block ${block.id}`}
            </div>
          ))}
        </div>

        <div className="space-y-2">
          {rows.map((row) => (
            <div key={row} className="flex items-center justify-center gap-4 flex-wrap">
              {regularBlocks.map((block, index) => {
                const blockRows = Number(block.maxRows) || 0;
                const seatsCount = Number(block.maxSeatsPerRow) || 0;
                const blockContent = row > blockRows
                  ? <div key={`${block.id}-${row}`} className="min-w-[140px] h-5" />
                  : (
                    <div key={`${block.id}-${row}`} className="flex gap-1">
                      {Array.from({ length: seatsCount }, (_, i) => i + 1).map((seat) => {
                        const seatId = `${block.id}-R${row}-S${seat}`;
                        if (!allSeats[seatId]) return null;
                        const isSelected = selectedSeats.includes(seatId);
                        const status = getSeatStatus(seatId);
                        const borderClass = index % 2 === 0 ? 'border-emerald-200' : 'border-teal-200';
                        return (
                          <button
                            key={seatId}
                            onClick={() => toggleSeat(seatId)}
                            disabled={status !== 'available' && !isSelected}
                            className={`
                              w-5 h-5 rounded text-xs font-bold transition-all
                              ${getSeatColor(seatId)}
                              ${status === 'available' || isSelected ? 'hover:scale-110 cursor-pointer' : 'cursor-not-allowed opacity-50'}
                              ${borderClass} border shadow-sm
                            `}
                          >
                            {seat}
                          </button>
                        );
                      })}
                    </div>
                  );

                if (hasTwoColumns && index === 0) {
                  return (
                    <div key={`regular-left-${row}`} className="flex items-center gap-4">
                      {blockContent}
                      <div className="w-10 text-center text-xs font-bold text-gray-600 bg-gray-100 px-1 py-0.5 rounded">
                        R{row}
                      </div>
                    </div>
                  );
                }

                return blockContent;
              })}
              {!hasTwoColumns && (
                <div className="w-10 text-center text-xs font-bold text-gray-600 bg-gray-100 px-1 py-0.5 rounded">
                  R{row}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 bg-white rounded-xl border border-gray-200">
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

      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
        <div className="flex flex-wrap items-center justify-center gap-4">
          {Object.entries(freeSeats).map(([section, count]) => (
            <div key={section} className="flex items-center gap-2 px-3 py-2 bg-amber-100 rounded-lg">
              <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
              <span className="font-semibold text-amber-800">{section}: {count}</span>
            </div>
          ))}
          <div className="px-4 py-2 bg-blue-500 text-white rounded-lg font-bold">
            Total: {totalFree}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-br from-amber-300 to-yellow-400 rounded"></div>
          <span>Premium Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-emerald-400 rounded"></div>
          <span>Regular Available</span>
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

      <div
        className="overflow-auto"
        style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
      >
        <div className="min-w-max pb-4">
          <div className="text-center mb-6">
            <div className="inline-block px-12 py-3 bg-gradient-to-r from-yellow-100 to-amber-100 border-2 border-dashed border-yellow-400 rounded-lg">
              <span className="text-lg font-bold text-yellow-700">STAGE</span>
            </div>
          </div>

          {renderVIPSection()}
          <div className="flex justify-center my-4">
            <div className="w-3/4 h-px bg-gray-300"></div>
          </div>
          {renderRegularSection()}
        </div>
      </div>

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
