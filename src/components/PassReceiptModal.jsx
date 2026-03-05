"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import MemberPass from "./MemberPass";
import DonationReceipt from "./Receipt";
import DonationPart from "./DonatePart";

const PassReceiptModal = ({ isOpen, onClose, booking, receiptOnly = false }) => {
  const [activeTab, setActiveTab] = useState("pass");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const bookingAmount = Number(
    booking?.totalAmount ??
      booking?.amount ??
      booking?.donationAmount ??
      booking?.payment?.amount ??
      booking?.paymentDetails?.amount ??
      booking?.showDetails?.totalPrice ??
      booking?.showDetails?.totalAmount ??
      0
  );

  const isFreeBooking = bookingAmount === 0 || booking?.eventDetails?.delegateType === "normal";

  useEffect(() => {
    if (receiptOnly) {
      setActiveTab("receipt");
      return;
    }
    if (isFreeBooking && activeTab === "receipt") {
      setActiveTab("pass");
    }
  }, [isFreeBooking, activeTab, receiptOnly]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const showPass = (activeTab === "pass" || isFreeBooking) && !receiptOnly;
  const showReceipt = (activeTab === "receipt" || receiptOnly) && booking;
  const isReceiptView = showReceipt && !showPass;
  const isFreePassBooking = booking?.category === "free_pass" || booking?.eventDetails?.delegateType === "freePass";
  const modalMaxWidthClass = isReceiptView ? "max-w-4xl" : "max-w-lg";
  const modalHeightClass = isReceiptView
    ? "max-h-[78vh] md:max-h-[84vh]"
    : isFreePassBooking
      ? "max-h-[72vh] md:max-h-[78vh]"
      : "max-h-[65vh] md:max-h-[70vh]";

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className={`relative w-full ${modalMaxWidthClass} overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in duration-300`}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 rounded-full bg-white/90 p-1.5 shadow-md transition-all duration-200 hover:scale-105 hover:bg-white"
        >
          <X size={18} className="text-gray-600" />
        </button>

        {!isFreeBooking && !receiptOnly && (
          <div className="flex items-center justify-center border-b border-gray-200 bg-gray-50 p-4">
            <div className="relative flex rounded-full bg-white p-1 shadow-md">
              <button
                onClick={() => setActiveTab("pass")}
                className={`relative rounded-full px-8 py-2.5 text-sm font-medium transition-all duration-300 ${
                  activeTab === "pass" ? "text-white" : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {activeTab === "pass" && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 to-orange-500 shadow-md"></div>
                )}
                <span className="relative z-10 flex items-center gap-1">
                  <span>Pass</span>
                </span>
              </button>
              <button
                onClick={() => setActiveTab("receipt")}
                className={`relative rounded-full px-8 py-2.5 text-sm font-medium transition-all duration-300 ${
                  activeTab === "receipt" ? "text-white" : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {activeTab === "receipt" && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 to-orange-500 shadow-md"></div>
                )}
                <span className="relative z-10 flex items-center gap-1">
                  <span>Receipt</span>
                </span>
              </button>
            </div>
          </div>
        )}

        <div className={`scrollbar-hide overflow-y-auto ${modalHeightClass}`}>
          {showPass && (
            <div className="py-0">
              <MemberPass booking={booking} />
            </div>
          )}

          {showReceipt && (
            <div className="p-4 md:p-6">
              <DonationReceipt booking={booking} />
            </div>
          )}
        </div>

        {!receiptOnly && activeTab !== "receipt" && (
          <>
            <DonationPart />
            <div className="border-t border-rose-200 bg-rose-50 px-4 py-3 text-center text-sm font-semibold text-rose-600">
              Kindly present this complete pass at the time of entry
            </div>
          </>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default PassReceiptModal;
