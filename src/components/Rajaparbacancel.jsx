"use client";

import { useState, useEffect } from "react";


export default function RajaParbaCancel({
  photoSrc = null,
  videoSrc = null,
  showOncePerSession = true,
  onClose,
}) {
  const [open, setOpen]       = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (showOncePerSession) {
      const seen = sessionStorage.getItem("raja_parba_2026_seen");
      if (seen) { onClose?.(); return; }
    }
    setOpen(true);
    const t = setTimeout(() => setVisible(true), 30);
    return () => clearTimeout(t);
  }, []);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      setOpen(false);
      if (showOncePerSession) sessionStorage.setItem("raja_parba_2026_seen", "true");
      onClose?.();
    }, 380);
  };

  const isLocalVideo = videoSrc && !videoSrc.includes("youtube") && !videoSrc.includes("youtu.be");

  if (!open) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');

        .rpc-font-body    { font-family: 'DM Sans', sans-serif; }
        .rpc-font-serif   { font-family: 'Libre Baskerville', serif; }

        .rpc-modal-bg {
          background: linear-gradient(160deg, #fef9f0 0%, #fdf3e0 40%, #fefcf7 100%);
        }
        .rpc-top-stripe {
          background: linear-gradient(90deg, #7a4a10, #c8923e, #f0d080, #c8923e, #7a4a10);
        }
        .rpc-divider-line {
          background: linear-gradient(90deg, transparent, #d4a84b88, #d4a84b, #d4a84b88, transparent);
        }
        .rpc-photo-ring {
          box-shadow: 0 8px 28px rgba(120,75,15,.22), 0 0 0 5px #fef0d0;
        }

        /* Backdrop fade */
        .rpc-backdrop-hidden { opacity: 0; pointer-events: none; }
        .rpc-backdrop-shown  { opacity: 1; }

        /* Modal scale-in */
        .rpc-modal-hidden { opacity: 0; transform: scale(.95) translateY(24px); }
        .rpc-modal-shown  { opacity: 1; transform: scale(1) translateY(0); }

        /* Diya flicker */
        @keyframes rpc-flicker {
          0%,100% { transform: scaleY(1) rotate(-2deg); opacity: 1; }
          35%     { transform: scaleY(1.08) rotate(2deg); opacity: .78; }
          65%     { transform: scaleY(.95) rotate(-1deg); opacity: .94; }
        }
        .rpc-flame  { display: inline-block; animation: rpc-flicker 2.5s ease-in-out infinite; }
        .rpc-flame2 { animation-delay: .85s; }

        /* Blinking dot */
        @keyframes rpc-blink { 0%,100%{opacity:1} 50%{opacity:.25} }
        .rpc-blink { animation: rpc-blink 1.8s ease-in-out infinite; }

        /* Cancelled badge ring pulse */
        @keyframes rpc-ring {
          0%   { box-shadow: 0 0 0 0   rgba(185,28,28,.35); }
          70%  { box-shadow: 0 0 0 8px rgba(185,28,28,0); }
          100% { box-shadow: 0 0 0 0   rgba(185,28,28,0); }
        }
        .rpc-badge-pulse { animation: rpc-ring 2.2s ease-out infinite; }

        /* Scrollbar */
        .rpc-scroll::-webkit-scrollbar       { width: 6px; }
        .rpc-scroll::-webkit-scrollbar-track { background: #f0e5cc; border-radius: 0 18px 18px 0; }
        .rpc-scroll::-webkit-scrollbar-thumb { background: #c8923e; border-radius: 6px; }
        .rpc-scroll::-webkit-scrollbar-thumb:hover { background: #a0702a; }
      `}</style>

      {/* ── Backdrop ── */}
      <div
        className={`rpc-backdrop-${visible ? "shown" : "hidden"} fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-opacity duration-300`}
        style={{ background: "rgba(20,12,4,0.72)", backdropFilter: "blur(5px)" }}
      >

        {/* ── Modal ── */}
        <div
          className={`
            rpc-modal-${visible ? "shown" : "hidden"}
            rpc-modal-bg rpc-font-body rpc-scroll
            relative w-full max-w-lg max-h-[80vh]
            overflow-y-auto rounded-2xl
            transition-all duration-400
          `}
          style={{ boxShadow: "0 40px 100px rgba(0,0,0,0.32), 0 0 0 1px rgba(200,150,60,0.22)" }}
        >

          {/* Top gold stripe */}
          <div className="rpc-top-stripe h-1.5 w-full rounded-t-2xl" />

          {/* ── HEADER ── */}
          <div className="px-4 pt-5 pb-0 text-center">

            {/* Diyas */}
            <div className="text-2xl mb-1 md:mb-3" style={{ letterSpacing: 10 }}>
              <span className="rpc-flame">🪔</span>
              <span className="inline-block w-4 md:w-6" />
              <span className="rpc-flame rpc-flame2">🪔</span>
            </div>

            {/* Shanti line */}
            <p className="rpc-font-serif text-[11px] uppercase tracking-[0.22em] text-amber-700 mb-4">
              ॐ शान्ति &nbsp;·&nbsp; श्रद्धांजलि
            </p>

            {/* Main heading */}
            <h1 className="rpc-font-serif text-xl md:text-2xl font-bold text-stone-900 mb-1.5 leading-snug">
              An Important Notice
            </h1>

            {/* Sub heading */}
            <p className="rpc-font-serif italic text-sm text-amber-800 mb-6">
              Odisha Raja Parba 2026 &mdash; Samudayik Vikas Samiti
            </p>

            {/* ── Photo ── */}
            <div className="flex justify-center mb-5">
              <div
                className="rpc-photo-ring relative w-40 h-48 rounded-xl overflow-hidden flex-shrink-0 border-[3px] border-amber-400"
                style={{ background: "#f5e8cc" }}
              >
                {photoSrc ? (
                  <>
                    <img
                      src={photoSrc}
                      alt="Mrs. Sudipta Mohanty"
                      className="w-full h-full object-cover block"
                    />
                    <div
                      className="absolute bottom-0 left-0 right-0 px-2 pb-2 pt-5 text-center"
                      style={{ background: "linear-gradient(transparent, rgba(15,8,0,.82))" }}
                    >
                      <p className="rpc-font-serif text-[11px] text-amber-50 m-0">
                        Mrs. Sudipta Mohanty
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 px-3">
                    <span className="text-3xl">🖼️</span>
                    <p className="text-[10px] text-amber-600 text-center italic leading-snug">
                      Pass <code>photoSrc</code><br />prop to show photo
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Name & role under photo */}
            <p className="rpc-font-serif text-lg font-bold text-stone-900 mb-1">
              Mrs. Sudipta Mohanty
            </p>
            <p className="text-xs text-amber-700 tracking-wide mb-1">
              Promoter, Samudayik Vikas Samiti
            </p>
            <p className="text-[11px] text-amber-600 uppercase tracking-widest mb-6">
              18 April 2026 &nbsp;·&nbsp; Eternal Rest
            </p>

            {/* Divider */}
            <div className="rpc-divider-line h-px mb-0" />
          </div>

          {/* ── BODY ── */}
          <div className="px-4 md:px-8 pt-3 md:pt-5 pb-6 md:pb-8">

            {/* Cancelled badge */}
            <div className="flex justify-center mb-3 md:mb-5">
              <span
                className="rpc-badge-pulse inline-flex items-center gap-2 px-3 md:px-5 py-1 md:py-2.5 rounded-lg bg-red-100 border-[1.5px] border-red-400 text-red-800 text-sm font-bold tracking-wide"
              >
                <span className="rpc-blink w-2 h-2 rounded-full bg-red-600 flex-shrink-0 inline-block" />
                Event Cancelled &nbsp;·&nbsp; 13–15 June 2026
              </span>
            </div>

            {/* Salutation */}
            <p className="rpc-font-serif italic text-sm text-amber-900 text-center mb-5 leading-relaxed">
              Dear members of the Odisha community in Delhi NCR,
            </p>

            {/* Body paragraphs */}
            <div className="text-[15px] leading-[1.82] text-stone-800 space-y-3 mb-6">
              <p>
                It is with deep sorrow that we inform you of the passing of{" "}
                <strong className="text-stone-900">Mrs. Sudipta Mohanty</strong>,
                promoter of Samudayik Vikas Samiti, on{" "}
                <strong className="text-stone-900">18 April 2026</strong>.
              </p>
              <p>
                In view of this untimely loss, the scheduled{" "}
                <strong className="text-stone-900">Odisha Raja Parba 2026 (13–15 June 2026)</strong>{" "}
                at <strong className="text-stone-900">Noida Stadium</strong> has been{" "}
                <span className="text-red-700 font-bold">cancelled</span>.
                We know this news will be disheartening, and we extend our heartfelt condolences to her family.
              </p>
              <p>
                We plan to hold Raja Parba in{" "}
                <strong className="text-stone-900">2027</strong> to honour her memory
                and hope for your continued support then.
              </p>
            </div>

            {/* Alternative event box */}
            <div className="bg-green-50 border border-green-300 rounded-xl p-4 mb-6">
              <p className="text-[11px] font-bold uppercase tracking-widest text-green-700 mb-2">
                🌸 &nbsp;Alternative Celebration — Gurgaon
              </p>
              <p className="text-sm leading-relaxed text-green-900 mb-2">
                You are warmly invited to join the Raja Parba being organized in{" "}
                <strong>Gurgaon</strong> by{" "}
                <strong>Mr. Askhya Samal</strong>, Founder of{" "}
                <strong>Kalinga Bharati Foundation</strong>.
              </p>
              <p className="text-xs text-green-800 italic">
                For details, please contact Mr. Askhya Samal or follow updates from Kalinga Bharati Foundation.
              </p>
            </div>

            {/* Tribute video */}
            <div className="mb-6">
              <p className="text-[11px] font-bold uppercase tracking-widest text-amber-700 text-center mb-3">
                🎞️ &nbsp;Tribute Video
              </p>
              <div
                className="rounded-xl overflow-hidden border border-amber-400 w-full"
                style={{ height: 280, background: "#f5e8cc", boxShadow: "0 4px 16px rgba(120,75,15,.12)" }}
              >
                {videoSrc ? (
                  isLocalVideo ? (
                    <video
                      src={videoSrc}
                      controls
                      className="w-full h-full object-cover block"
                    />
                  ) : (
                    <iframe
                      src={videoSrc}
                      className="w-full h-full block border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="Tribute video"
                    />
                  )
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-lg text-amber-700 border border-dashed border-amber-400"
                      style={{ background: "#eddcb8" }}
                    >
                      ▶
                    </div>
                    <p className="text-sm text-amber-700 text-center italic leading-snug">
                      Tribute video coming soon<br />
                      <span className="text-xs opacity-60">Pass <code>videoSrc</code> prop to embed</span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="rpc-divider-line h-px mb-5" />

            {/* Closing line */}
            <p className="rpc-font-serif italic text-sm text-amber-800 text-center mb-4">
              Thank you for your understanding during this difficult time.
            </p>

            {/* Signature */}
            <div className="text-center">
              <p className="rpc-font-serif italic text-base text-stone-800 mb-1">
                With sympathy,
              </p>
              <p className="text-[13px] font-semibold text-amber-700 tracking-wide">
                Samudayik Vikas Samiti Organizing Committee
              </p>
            </div>
          </div>

          {/* Bottom gold stripe */}
          <div className="rpc-top-stripe h-1.5 w-full rounded-b-2xl" />

        </div>
      </div>
    </>
  );
}