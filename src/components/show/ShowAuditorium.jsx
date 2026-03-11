"use client";
import { useState } from "react";
import { ChevronDown, Info, ZoomIn, ZoomOut } from "lucide-react";
import useUserShowBookingStore from "@/lib/stores/useUserShowBooking";
import { getAllShowBlocks } from "@/utils/showSeatUtils";

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
  const blocks = getAllShowBlocks(showSettings, { includeInactive: false });
  const premiumBlocks = blocks.filter((block) => block.type === "premium");
  const regularBlocks = blocks.filter((block) => block.type === "regular");

  const getFreeSeatsCount = () =>
    blocks.reduce((acc, block) => {
      let count = 0;
      if (block.type === "premium") {
        for (let row = 1; row <= block.maxRows; row++) {
          for (let pair = 0; pair < block.maxPairsPerRow; pair++) {
            const letter = String.fromCharCode(65 + pair);
            [1, 2].forEach((position) => {
              const seatId = `${block.id}-R${row}-${letter}${position}`;
              if (getSeatStatus(seatId) === "available") count += 1;
            });
          }
        }
      } else {
        for (let row = 1; row <= block.maxRows; row++) {
          for (let seat = 1; seat <= block.maxSeatsPerRow; seat++) {
            const seatId = `${block.id}-R${row}-S${seat}`;
            if (getSeatStatus(seatId) === "available") count += 1;
          }
        }
      }
      acc[block.id] = count;
      return acc;
    }, {});

  const freeSeats = getFreeSeatsCount();
  const totalFree = Object.values(freeSeats).reduce((sum, count) => sum + count, 0);
  const getDisplayPrice = (amount) => amount <= 0 ? <span className="font-extrabold text-emerald-700">FREE</span> : `Rs ${amount.toLocaleString()}`;

  const renderPremiumBlock = (block) => {
    const rows = Array.from({ length: block.maxRows }, (_, index) => index + 1);

    return (
      <div key={block.id} className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-amber-700">{block.name}</h3>
          <p className="text-sm text-gray-600">From {getDisplayPrice(getSeatPrice(`${block.id}-R1-A1`))}</p>
        </div>

        <div className="space-y-2">
          {rows.map((row) => (
            <div key={`${block.id}-${row}`} className="flex items-center justify-center gap-3 flex-wrap">
              <div className="flex gap-1">
                {Array.from({ length: block.maxPairsPerRow }, (_, pairIndex) => String.fromCharCode(65 + pairIndex)).map((letter) => (
                  <div key={`${block.id}-${letter}`} className="flex gap-0.5">
                    {[1, 2].map((position) => {
                      const seatId = `${block.id}-R${row}-${letter}${position}`;
                      const isSelected = selectedSeats.includes(seatId);
                      const status = getSeatStatus(seatId);

                      return (
                        <button
                          key={seatId}
                          onClick={() => toggleSeat(seatId)}
                          disabled={status !== "available" && !isSelected}
                          className={`w-7 h-6 rounded-md text-xs font-bold transition-all border border-amber-200 shadow-sm ${getSeatColor(seatId)} ${status === "available" || isSelected ? "hover:scale-105 cursor-pointer" : "cursor-not-allowed opacity-50"}`}
                        >
                          {letter}{position}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="w-12 text-center font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded">R{row}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderRegularBlock = (block, index) => {
    const rows = Array.from({ length: block.maxRows }, (_, rowIndex) => rowIndex + 1);
    const accentClass = index % 2 === 0 ? "border-emerald-300 bg-emerald-50/60" : "border-teal-300 bg-teal-50/60";
    const badgeClass = index % 2 === 0 ? "text-emerald-800" : "text-teal-800";

    return (
      <div key={block.id} className={`rounded-xl border p-4 ${accentClass}`}>
        <div className="text-center mb-4">
          <h3 className={`text-lg font-bold ${badgeClass}`}>{block.name}</h3>
          <p className="text-sm text-gray-600">From {getDisplayPrice(getSeatPrice(`${block.id}-R1-S1`))}</p>
        </div>

        <div className="space-y-2">
          {rows.map((row) => (
            <div key={`${block.id}-${row}`} className="flex items-center justify-center gap-3 flex-wrap">
              <div className="flex gap-1">
                {Array.from({ length: block.maxSeatsPerRow }, (_, seatIndex) => seatIndex + 1).map((seat) => {
                  const seatId = `${block.id}-R${row}-S${seat}`;
                  const isSelected = selectedSeats.includes(seatId);
                  const status = getSeatStatus(seatId);

                  return (
                    <button
                      key={seatId}
                      onClick={() => toggleSeat(seatId)}
                      disabled={status !== "available" && !isSelected}
                      className={`w-5 h-5 rounded text-xs font-bold transition-all border shadow-sm ${getSeatColor(seatId)} ${status === "available" || isSelected ? "hover:scale-110 cursor-pointer" : "cursor-not-allowed opacity-50"}`}
                    >
                      {seat}
                    </button>
                  );
                })}
              </div>
              <div className="w-10 text-center text-xs font-bold text-gray-600 bg-gray-100 px-1 py-0.5 rounded">R{row}</div>
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
          <button onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))} className="p-1.5 bg-gray-100 rounded hover:bg-gray-200">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-600">{Math.round(zoomLevel * 100)}%</span>
          <button onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.1))} className="p-1.5 bg-gray-100 rounded hover:bg-gray-200">
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
        <div className="flex flex-wrap items-center justify-center gap-4">
          {blocks.map((block) => (
            <div key={block.id} className="flex items-center gap-2 px-3 py-2 bg-amber-100 rounded-lg">
              <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
              <span className="font-semibold text-amber-800">{block.id}: {freeSeats[block.id] || 0}</span>
            </div>
          ))}
          <div className="px-4 py-2 bg-blue-500 text-white rounded-lg font-bold">Total: {totalFree}</div>
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

      <div className="overflow-auto" style={{ transform: `scale(${zoomLevel})`, transformOrigin: "top center" }}>
        <div className="min-w-max pb-4">
          <div className="text-center mb-6">
            <div className="inline-block px-12 py-3 bg-gradient-to-r from-yellow-100 to-amber-100 border-2 border-dashed border-yellow-400 rounded-lg">
              <span className="text-lg font-bold text-yellow-700">STAGE</span>
            </div>
          </div>

          {premiumBlocks.length > 0 && (
            <div className="space-y-4 mb-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-amber-700">Premium Seating</h3>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {premiumBlocks.map(renderPremiumBlock)}
              </div>
            </div>
          )}

          {premiumBlocks.length > 0 && regularBlocks.length > 0 && (
            <div className="flex justify-center my-4">
              <div className="w-3/4 h-px bg-gray-300"></div>
            </div>
          )}

          {regularBlocks.length > 0 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-bold text-emerald-700">Regular Seating</h3>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {regularBlocks.map((block, index) => renderRegularBlock(block, index))}
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedSeats.length > 0 && (
        <div className="mt-4 flex justify-end">
          <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-lg px-3 py-1">
            <Info className="w-4 h-4 text-rose-500" />
            <span className="text-rose-600 text-xs">Scroll down to continue</span>
            <button
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
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
