"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { ArrowDownToLine, X } from "lucide-react";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";
import MemberPass from "./MemberPass";
import DonationReceipt from "./Receipt";
import DonationPart from "./DonatePart";

const PassReceiptModal = ({ isOpen, onClose, booking, receiptOnly = false }) => {
  const [activeTab, setActiveTab] = useState("pass");
  const [mounted, setMounted] = useState(false);
  const [downloading, setDownloading] = useState(false);
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
    ? "max-h-[72vh] md:max-h-[92vh]"
    : "max-h-[calc(85vh-60px)] md:max-h-[calc(98vh-90px)]";

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

  const handleDownloadPass = async () => {
    if (downloading) return;
    const source = passContentRef.current?.firstElementChild;
    if (!source) return;

    setDownloading(true);
    let offscreenWrapper = null;

    try {
      offscreenWrapper = document.createElement("div");
      offscreenWrapper.style.position = "fixed";
      offscreenWrapper.style.left = "-100000px";
      offscreenWrapper.style.top = "0";
      offscreenWrapper.style.width = `${source.scrollWidth || 420}px`;
      offscreenWrapper.style.background = "transparent";
      offscreenWrapper.style.zIndex = "-1";

      const clone = source.cloneNode(true);
      offscreenWrapper.appendChild(clone);
      document.body.appendChild(offscreenWrapper);

      // Ensure all images are fully loaded in the cloned node before rendering to PNG.
      const clonedImages = Array.from(clone.querySelectorAll("img"));
      await Promise.all(
        clonedImages.map(
          (img) =>
            new Promise((resolve) => {
              const rawSrc = img.getAttribute("src") || "";
              if (!rawSrc) {
                resolve();
                return;
              }

              if (rawSrc.startsWith("/")) {
                img.src = `${window.location.origin}${rawSrc}`;
              }

              img.crossOrigin = "anonymous";
              img.loading = "eager";
              img.decoding = "sync";

              if (img.complete && img.naturalWidth > 0) {
                resolve();
                return;
              }

              const done = () => resolve();
              img.addEventListener("load", done, { once: true });
              img.addEventListener("error", done, { once: true });

              // Don't block forever on any single image.
              setTimeout(done, 4000);
            })
        )
      );

      const dataUrl = await toPng(clone, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });
      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 8;
      const usableWidth = pageWidth - margin * 2;
      const usableHeight = pageHeight - margin * 2;
      const visualScaleFactor = 0.58;

      let renderWidth = usableWidth * visualScaleFactor;
      let renderHeight = (img.height * renderWidth) / img.width;

      if (renderHeight > usableHeight) {
        renderHeight = usableHeight;
        renderWidth = (img.width * renderHeight) / img.height;
      }

      const x = (pageWidth - renderWidth) / 2;
      const y = (pageHeight - renderHeight) / 2;
      pdf.addImage(dataUrl, "PNG", x, y, renderWidth, renderHeight, undefined, "FAST");

      const passId =
        booking?.id || booking?.bookingId || booking?.registrationId || "raja-parba-pass";
      pdf.save(`${String(passId)}-pass.pdf`);
    } catch (error) {
      console.error("Pass download failed:", error);
    } finally {
      if (offscreenWrapper && offscreenWrapper.parentNode) {
        offscreenWrapper.parentNode.removeChild(offscreenWrapper);
      }
      setDownloading(false);
    }
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
            onClick={handleDownloadPass}
            disabled={downloading}
            className="absolute top-3 left-3 z-20 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg transition hover:from-amber-500 hover:via-yellow-600 hover:to-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <ArrowDownToLine size={14} />
            {downloading ? "Downloading..." : "Download"}
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
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default PassReceiptModal;
