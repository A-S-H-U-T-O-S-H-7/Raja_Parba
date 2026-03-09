"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Printer, X } from "lucide-react";
import MemberPass from "./MemberPass";
import DonationReceipt from "./Receipt";
import DonationPart from "./DonatePart";

const PassReceiptModal = ({ isOpen, onClose, booking, receiptOnly = false }) => {
  const [activeTab, setActiveTab] = useState("pass");
  const [mounted, setMounted] = useState(false);
  const [passScale, setPassScale] = useState(1);
  const [passScaledHeight, setPassScaledHeight] = useState(null);
  const passViewportRef = useRef(null);
  const passContentRef = useRef(null);

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

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const showPass = (activeTab === "pass" || isFreeBooking) && !receiptOnly;
  const showReceipt = (activeTab === "receipt" || receiptOnly) && booking;
  const isReceiptView = showReceipt && !showPass;
  const modalMaxWidthClass = isReceiptView ? "max-w-4xl" : "max-w-lg";
  const modalHeightClass = isReceiptView
    ? "max-h-[78vh] md:max-h-[92vh]"
    : "max-h-[calc(90vh-80px)] md:max-h-[calc(98vh-102px)]";

  const fitPassToViewport = useCallback(() => {
    if (!isOpen || !showPass || !passViewportRef.current || !passContentRef.current) return;

    const viewport = passViewportRef.current;
    const content = passContentRef.current;

    const viewportWidth = viewport.clientWidth || window.innerWidth;
    const viewportHeight = viewport.clientHeight || Math.max(window.innerHeight - 140, 320);
    const contentWidth = content.scrollWidth || viewportWidth;
    const contentHeight = content.scrollHeight || viewportHeight;

    const nextScale = Math.min(1, viewportWidth / contentWidth, viewportHeight / contentHeight);
    const isMobileViewport = viewportWidth < 768;
    const tunedScale = isMobileViewport ? nextScale * 0.94 : nextScale * 0.82;
    const minScale = isMobileViewport ? 0.52 : 0.38;
    const maxScale = isMobileViewport ? 0.9 : 0.76;
    const safeScale = Math.max(minScale, Math.min(maxScale, tunedScale));

    setPassScale(safeScale);
    setPassScaledHeight(Math.ceil(contentHeight * safeScale) + (isMobileViewport ? 2 : 4));
  }, [isOpen, showPass]);

  useEffect(() => {
    if (!isOpen || !showPass) return;

    const raf = requestAnimationFrame(() => fitPassToViewport());
    const onResize = () => fitPassToViewport();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [isOpen, showPass, booking, fitPassToViewport]);

  const handlePrintPass = () => {
    document.body.classList.add("print-pass-mode");
    const clearPrintMode = () => document.body.classList.remove("print-pass-mode");
    window.addEventListener("afterprint", clearPrintMode, { once: true });
    setTimeout(() => {
      window.print();
      setTimeout(clearPrintMode, 1200);
    }, 120);
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className={`relative my-2 w-full ${modalMaxWidthClass} overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in duration-300`}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 rounded-full bg-white/90 p-1.5 shadow-md transition-all duration-200 hover:scale-105 hover:bg-white"
        >
          <X size={18} className="text-gray-600" />
        </button>

        {showPass && (
          <button
            onClick={handlePrintPass}
            className="absolute top-3 left-3 z-20 inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md transition hover:bg-indigo-700"
          >
            <Printer size={14} />
            Print / Save PDF
          </button>
        )}

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
            <div
              ref={passViewportRef}
              className="print-pass-target flex w-full items-center justify-center overflow-hidden bg-gradient-to-b from-[#1e3a8a] via-[#4f46e5] to-[#c2410c] py-0"
            >
              <div
                className="w-full"
                style={{
                  height: passScaledHeight ? `${passScaledHeight}px` : "auto",
                }}
              >
                <div
                  ref={passContentRef}
                  style={{
                    transform: `scale(${passScale})`,
                    transformOrigin: "top center",
                    width: "100%",
                  }}
                >
                  <MemberPass booking={booking} />
                </div>
              </div>
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
            <div className="border-t border-rose-200 bg-rose-50 px-1 md:px-4 py-2 md:py-3 text-center text-sm font-semibold text-rose-600">
              Kindly present this entry pass at the time of entry
            </div>
          </>
        )}
      </div>
      <style jsx global>{`
        @media print {
          @page {
            size: auto;
            margin: 6mm;
          }
          body.print-pass-mode * {
            visibility: hidden !important;
          }
          body.print-pass-mode .print-pass-target,
          body.print-pass-mode .print-pass-target * {
            visibility: visible !important;
          }
          body.print-pass-mode .print-pass-target {
            position: static !important;
            margin: 0 !important;
            width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
            overflow: visible !important;
            background: white !important;
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          body.print-pass-mode .print-pass-target [style*="transform: scale"] {
            transform: none !important;
            height: auto !important;
          }
          body.print-pass-mode .print-pass-target > div {
            height: auto !important;
          }
        }
      `}</style>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default PassReceiptModal;
