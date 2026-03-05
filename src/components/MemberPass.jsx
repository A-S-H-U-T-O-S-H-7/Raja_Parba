import React, { useEffect, useState } from "react";

const MemberPass = ({ booking, participantName, purpose }) => {
  const bookingId = booking?.id || booking?.bookingId || "N/A";
  const isFreePass = booking?.category === "free_pass" || booking?.eventDetails?.delegateType === "freePass";

  const name =
    booking?.delegateDetails?.name ||
    booking?.userDetails?.name ||
    booking?.customerDetails?.name ||
    booking?.vendorDetails?.ownerName ||
    booking?.vendorDetails?.name ||
    booking?.donorDetails?.name ||
    booking?.name ||
    participantName ||
    "Participant";

  // Determine pass type
  const getPassType = () => {
    if (booking?.category === "free_pass" || booking?.eventDetails?.delegateType === "freePass") return "FREE PASS";
    if (booking?.showDetails) return "SHOW RESERVATION";
    if (booking?.stallIds || booking?.type === "stall") return "STALL RESERVATION";
    if (booking?.delegateDetails) return "DELEGATE PASS";
    return purpose?.toUpperCase() || "VISITOR";
  };

  const passType = getPassType();

  const showSeatNumbers = (booking?.showDetails?.selectedSeats || [])
    .map((seat) => {
      if (typeof seat === "string") return seat;
      if (typeof seat === "object") return seat?.seatId || seat?.id || seat?.number || "";
      return String(seat || "");
    })
    .filter(Boolean);

  const stallNumbers = (booking?.stallIds || [])
    .map((stall) => String(stall))
    .filter(Boolean);

  // Format date for show reservation
  const getShowDate = () => {
    if (booking?.showDetails?.date) {
      try {
        const date = new Date(booking.showDetails.date);
        return date.toLocaleDateString('en-IN', { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric' 
        });
      } catch {
        return null;
      }
    }
    return null;
  };

  const showDate = getShowDate();
  const freePassMembersCountRaw = Number(booking?.eventDetails?.numberOfPersons || 0);
  const freePassMembersLength = Array.isArray(booking?.eventDetails?.members) ? booking.eventDetails.members.length : 0;
  const freePassMembersCount = freePassMembersCountRaw
    ? (freePassMembersLength === freePassMembersCountRaw ? freePassMembersCountRaw + 1 : freePassMembersCountRaw)
    : (freePassMembersLength + 1);

  const qrData = `RAJA PARBA 2026 | ID:${bookingId} | Name:${name} | Type:${passType}`;
  
  const primaryQrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
  const fallbackQrSrc = `https://quickchart.io/qr?size=200&text=${encodeURIComponent(qrData)}`;

  const [qrSrc, setQrSrc] = useState(primaryQrSrc);
  const [usedFallbackQr, setUsedFallbackQr] = useState(false);

  useEffect(() => {
    setQrSrc(primaryQrSrc);
    setUsedFallbackQr(false);
  }, [primaryQrSrc]);

  const shortCode = String(bookingId).replace(/[^a-zA-Z0-9]/g, "").slice(-8).toUpperCase() || "RAJA2026";

  return (
    <div className="relative min-h-[70vh] bg-gradient-to-b from-[#1e3a8a] via-[#4f46e5] to-[#c2410c] p-2 md:p-4 flex items-center justify-center">
      {/* White Dots Pattern - Cross lines effect */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Diagonal cross lines */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(10)].map((_, i) => (
              <div
                key={`line-1-${i}`}
                className="absolute w-full h-px bg-white transform -rotate-45 origin-left"
                style={{ top: `${i * 15}%`, left: 0 }}
              />
            ))}
          </div>
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(10)].map((_, i) => (
              <div
                key={`line-2-${i}`}
                className="absolute w-full h-px bg-white transform rotate-45 origin-left"
                style={{ top: `${i * 15}%`, right: 0 }}
              />
            ))}
          </div>
        </div>
        
        {/* Dot pattern overlay */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-lg">
        {/* White Card with Side Cuts */}
        <div className="relative bg-white rounded-3xl shadow-2xl overflow-visible">
          {/* Half-circle cuts on white card - matching gradient colors */}
          <div className="absolute top-1/2 left-2 md:left-0 transform -translate-y-1/2 -translate-x-3 w-5 h-10 md:w-6 md:h-12 bg-gradient-to-b from-[#4b43df] via-[#4f46e5] to-[#524aed] rounded-r-full"></div>
          <div className="absolute top-1/2 right-2 md:right-0 transform -translate-y-1/2 translate-x-3 w-5 h-10 md:w-6 md:h-12 bg-gradient-to-b from-[#4840d7] via-[#4f46e5] to-[#544cea] rounded-l-full"></div>
          
          <div className="p-6">
            {/* ID on top right */}
            <div className="mb-4 text-right">
              <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs font-mono font-semibold text-gray-600">
                ID: {bookingId}
              </span>
            </div>

            {/* Logo and Title Section - Centered */}
            <div className="flex flex-col items-center mb-2">
              <div className="flex items-center gap-4 mb-1">
                <img
                  src="/raja-logo.png"
                  alt="Raja Logo"
                  className="h-18 w-18 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="text-left">
                  <p className="font-['Playfair_Display'] text-xl font-black text-indigo-900 leading-tight">Odisha</p>
                  <p className="font-['Playfair_Display'] text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-orange-500 bg-clip-text text-transparent leading-tight">Raja Parba</p>
                  <p className="font-['Playfair_Display'] text-lg font-bold text-orange-600">2026</p>
                </div>
              </div>
              
              {/* Quote */}
              <div className="text-center px-2 md:px-4 py-1 pb-6 rounded-full">
                <p className="font-['Caveat'] text-sm italic font-medium text-purple-700">
                  👸 Celebrate her. Respect her. Rise with her.
                </p>
              </div>
            </div>

            {/* Show Date if applicable - non-button style */}
            {showDate && (
              <div className="mb-4 text-center">
                <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 rounded-full text-sm font-semibold shadow-sm">
                  📅 Show Date: {showDate}
                </span>
              </div>
            )}

            {isFreePass && (
              <div className="mb-4 rounded-lg border border-emerald-200 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 p-3 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Free Pass Details</p>
                <p className="mt-1 text-sm font-bold text-emerald-900">Members: {freePassMembersCount}</p>
                <p className="mt-0.5 text-sm font-semibold text-teal-800">Date: 13 June - 15 June, 2026</p>
              </div>
            )}

            {/* QR Code Section */}
            <div className="relative mx-auto mb-4 w-fit">
              <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-indigo-300"></div>
              <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-indigo-300"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-indigo-300"></div>
              <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-indigo-300"></div>
              <div className="p-3 bg-gradient-to-br from-indigo-50 to-orange-50 rounded-2xl">
                <img
                  src={qrSrc}
                  alt="QR Code"
                  className="h-44 w-44 object-contain"
                  onError={() => {
                    if (!usedFallbackQr) {
                      setQrSrc(fallbackQrSrc);
                      setUsedFallbackQr(true);
                    }
                  }}
                />
              </div>
            </div>

            {/* Short Code */}
            <div className="mb-4 text-center">
              <span className="font-['Courier_New'] text-xl font-bold tracking-[0.25em] text-gray-700">
                {shortCode}
              </span>
            </div>

            {/* Name Section */}
            <div className="relative mb-4">
              <div className="absolute -top-2 left-4 px-3 bg-white text-xs font-semibold text-indigo-600">
                NAME
              </div>
              <div className="border-2 border-indigo-100 rounded-lg p-2 md:p-4 bg-gradient-to-r from-indigo-50/50 to-orange-50/50">
                <p className="text-center text-xl font-bold text-gray-800 break-words">
                  {name}
                </p>
              </div>
            </div>

            {/* Pass Type - Normal text styling for SHOW RESERVATION */}
            {passType === "SHOW RESERVATION" ? (
              <div className="relative mb-4">
                <div className="py-2 md:py-3 px-4 bg-gradient-to-r from-indigo-50 to-amber-50 rounded-lg text-center border border-indigo-200">
                  <p className="font-['Montserrat'] text-lg md:text-xl font-black bg-gradient-to-r from-indigo-600 to-orange-500 bg-clip-text text-transparent">
                    {passType}
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-orange-500 rounded-lg blur opacity-50"></div>
                <div className="relative py-4 px-4 bg-gradient-to-r from-indigo-600 to-orange-500 rounded-lg text-center transform hover:scale-105 transition-transform">
                  <p className="font-['Montserrat'] text-2xl font-black tracking-wider text-white">
                    {passType}
                  </p>
                </div>
              </div>
            )}

            {passType === "SHOW RESERVATION" && showSeatNumbers.length > 0 && (
              <div className="mb-4 rounded-lg border border-indigo-200 bg-indigo-50/70 p-3">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">Seat No.</p>
                <p className="break-words text-sm font-bold text-indigo-900">{showSeatNumbers.join(", ")}</p>
              </div>
            )}

            {passType === "STALL RESERVATION" && stallNumbers.length > 0 && (
              <div className="mb-4 rounded-lg border border-fuchsia-200 bg-fuchsia-50/70 p-3">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-fuchsia-700">Stall No.</p>
                <p className="break-words text-sm font-bold text-fuchsia-900">{stallNumbers.join(", ")}</p>
              </div>
            )}

            {/* Footer - Samudayik Vikas Samiti with updated design */}
            <div className="mt-4 flex items-center justify-center gap-3 border-t-2 border-indigo-100 pt-2 md:pt-4">
              <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-amber-200 shadow-md hover:shadow-lg hover:border-amber-400 transition-all duration-300 flex-shrink-0">
                <img
                  src="/logo.png"
                  alt="Samudayik Vikas Samiti"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] xs:text-xs md:text-sm font-bold text-amber-800 hover:text-amber-900 transition-colors whitespace-nowrap">
                  Samudayik Vikas
                </span>
                <span className="text-[10px] xs:text-xs md:text-sm font-bold text-amber-800 hover:text-amber-900 transition-colors whitespace-nowrap">
                  Samiti
                </span>
                <span className="text-[8px] xs:text-[10px] md:text-xs text-amber-500 hover:text-amber-600 transition-colors">
                  svsamiti.com
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberPass;
