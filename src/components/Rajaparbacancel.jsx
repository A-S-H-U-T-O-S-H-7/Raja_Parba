"use client";

import { useState, useEffect } from "react";

/**
 * RajaParbaCancel — Modal popup for Odisha Raja Parba 2026 cancellation
 *
 * USAGE in page.js:
 *   import RajaParbaCancel from "@/components/RajaParbaCancel";
 *   <RajaParbaCancel
 *     photoSrc="/sudiptamohanty.jpeg"
 *     videoSrc="/sudipta_mohanty_video.mp4"
 *     showOncePerSession={false}
 *     onClose={() => setNoticeClosed(true)}
 *   />
 *
 * PROPS:
 *   photoSrc           {string}    – Photo URL
 *   videoSrc           {string}    – Video URL or YouTube embed URL
 *   showOncePerSession {boolean}   – If true, only shows once per browser session (default: true)
 *   onClose            {function}  – Called when modal is closed
 */
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

  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [open]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      setOpen(false);
      if (showOncePerSession) sessionStorage.setItem("raja_parba_2026_seen", "true");
      onClose?.();
    }, 380);
  };

  // Detect if videoSrc is a local file (not YouTube)
  const isLocalVideo = videoSrc && !videoSrc.includes("youtube") && !videoSrc.includes("youtu.be");

  if (!open) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');

        .rpc-backdrop {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(20, 12, 4, 0.70);
          backdrop-filter: blur(5px);
          display: flex; align-items: center; justify-content: center;
          padding: 16px;
          transition: opacity .35s ease;
          overscroll-behavior: contain;
          touch-action: none;
        }
        .rpc-backdrop-hidden { opacity: 0; pointer-events: none; }
        .rpc-backdrop-shown  { opacity: 1; }

        .rpc-modal {
          /* Soft warm gradient background */
          background: linear-gradient(160deg, #fef9f0 0%, #fdf3e0 40%, #fefcf7 100%);
          border-radius: 18px;
          width: 100%;
          max-width: 560px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow:
            0 40px 100px rgba(0,0,0,0.32),
            0 0 0 1px rgba(200,150,60,0.22);
          transition: opacity .4s ease, transform .4s cubic-bezier(.22,1,.36,1);
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overscroll-behavior: contain;
          touch-action: pan-y;
        }
        .rpc-modal-hidden { opacity:0; transform: scale(.95) translateY(24px); }
        .rpc-modal-shown  { opacity:1; transform: scale(1)   translateY(0);    }

        /* Visible scrollbar */
        .rpc-modal::-webkit-scrollbar       { width: 6px; }
        .rpc-modal::-webkit-scrollbar-track { background: #f0e5cc; border-radius: 0 18px 18px 0; }
        .rpc-modal::-webkit-scrollbar-thumb { background: #c8923e; border-radius: 6px; }
        .rpc-modal::-webkit-scrollbar-thumb:hover { background: #a0702a; }

        @keyframes rpc-flicker {
          0%,100% { transform: scaleY(1)    rotate(-2deg); opacity: 1;   }
          35%     { transform: scaleY(1.08) rotate(2deg);  opacity: .78; }
          65%     { transform: scaleY(.95)  rotate(-1deg); opacity: .94; }
        }
        .rpc-flame  { display:inline-block; animation: rpc-flicker 2.5s ease-in-out infinite; }
        .rpc-flame2 { animation-delay: .85s; }

        @keyframes rpc-blink { 0%,100%{opacity:1} 50%{opacity:.25} }
        .rpc-blink { animation: rpc-blink 1.8s ease-in-out infinite; }

        /* Cancelled badge pulse ring */
        @keyframes rpc-ring {
          0%   { box-shadow: 0 0 0 0 rgba(185,28,28,.35); }
          70%  { box-shadow: 0 0 0 8px rgba(185,28,28,0);  }
          100% { box-shadow: 0 0 0 0 rgba(185,28,28,0);    }
        }
        .rpc-cancelled-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: #fee2e2;
          border: 1.5px solid #f87171;
          color: #991b1b;
          border-radius: 8px;
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.04em;
          animation: rpc-ring 2.2s ease-out infinite;
        }

        .rpc-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #d4a84b88, #d4a84b, #d4a84b88, transparent);
          margin: 20px 0;
        }
      `}</style>

      {/* Backdrop */}
      <div className={`rpc-backdrop ${visible ? "rpc-backdrop-shown" : "rpc-backdrop-hidden"}`}>

        {/* Modal */}
        <div className={`rpc-modal ${visible ? "rpc-modal-shown" : "rpc-modal-hidden"}`}>

          {/* ── Top gold stripe ── */}
          <div style={{
            height: 5,
            background: "linear-gradient(90deg, #7a4a10, #c8923e, #f0d080, #c8923e, #7a4a10)",
            borderRadius: "18px 18px 0 0",
          }} />

          {/* ── Header ── */}
          <div style={{ padding: "28px 32px 0", textAlign: "center" }}>

            {/* Diyas */}
            <div style={{ fontSize: 24, marginBottom: 14, letterSpacing: 10 }}>
              <span className="rpc-flame">🪔</span>
              <span style={{ display: "inline-block", width: 28 }} />
              <span className="rpc-flame rpc-flame2">🪔</span>
            </div>

            {/* Shanti */}
            <p style={{
              fontFamily: "'Libre Baskerville', serif",
              fontSize: 11, letterSpacing: "0.24em",
              color: "#b8832a", marginBottom: 16, textTransform: "uppercase",
            }}>
              ॐ शान्ति &nbsp;·&nbsp; श्रद्धांजलि
            </p>

            {/* Main heading */}
            <h1 style={{
              fontFamily: "'Libre Baskerville', serif",
              fontSize: 26, fontWeight: 700,
              color: "#1a0e04", marginBottom: 6, lineHeight: 1.2,
            }}>
              An Important Notice
            </h1>

            {/* Sub heading */}
            <p style={{
              fontFamily: "'Libre Baskerville', serif",
              fontStyle: "italic", fontSize: 14,
              color: "#7a5220", marginBottom: 24,
            }}>
              Odisha Raja Parba 2026 &mdash; Samudayik Vikas Samiti
            </p>

            {/* ── Photo ── */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
              <div style={{
                width: 160, height: 190, borderRadius: 12, overflow: "hidden",
                border: "3px solid #d4a84b",
                boxShadow: "0 8px 28px rgba(120,75,15,.22), 0 0 0 5px #fef0d0",
                background: "#f5e8cc",
                position: "relative", flexShrink: 0,
              }}>
                {photoSrc ? (
                  <>
                    <img src={photoSrc} alt="Mrs. Sudipta Mohanty"
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    <div style={{
                      position: "absolute", bottom: 0, left: 0, right: 0,
                      padding: "20px 8px 8px",
                      background: "linear-gradient(transparent, rgba(15,8,0,.82))",
                      textAlign: "center",
                    }}>
                      <p style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 11, color: "#fdf6e0", margin: 0 }}>
                        Mrs. Sudipta Mohanty
                      </p>
                    </div>
                  </>
                ) : (
                  <div style={{ width:"100%", height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8 }}>
                    <div style={{ fontSize: 30 }}>🖼️</div>
                    <p style={{ fontSize:10, color:"#c8923e", textAlign:"center", padding:"0 10px", fontStyle:"italic", lineHeight:1.45 }}>
                      Pass <code>photoSrc</code><br />prop to show photo
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Name under photo */}
            <p style={{
              fontFamily: "'Libre Baskerville', serif",
              fontSize: 18, fontWeight: 700,
              color: "#1a0e04", marginBottom: 3,
            }}>
              Mrs. Sudipta Mohanty
            </p>
            <p style={{ fontSize: 12, color: "#9a7040", marginBottom: 5, letterSpacing: "0.04em" }}>
              Promoter, Samudayik Vikas Samiti
            </p>
            <p style={{ fontSize: 11, color: "#b8832a", letterSpacing: "0.16em", marginBottom: 24, textTransform: "uppercase" }}>
              18 April 2026 &nbsp;·&nbsp; Eternal Rest
            </p>

            <div className="rpc-divider" />
          </div>

          {/* ── Body ── */}
          <div style={{ padding: "4px 32px 30px" }}>

            {/* ── Cancelled badge — highlighted ── */}
            <div style={{ textAlign: "center", marginBottom: 22 }}>
              <span className="rpc-cancelled-badge">
                <span className="rpc-blink" style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: "#dc2626", display: "inline-block", flexShrink: 0,
                }} />
                Event Cancelled &nbsp;·&nbsp; 13–15 June 2026
              </span>
            </div>

            {/* Salutation */}
            <p style={{
              fontFamily: "'Libre Baskerville', serif",
              fontStyle: "italic", fontSize: 14,
              color: "#5a3e18", textAlign: "center",
              marginBottom: 18, lineHeight: 1.65,
            }}>
              Dear members of the Odisha community in Delhi NCR,
            </p>

            {/* Body paragraphs */}
            <div style={{ fontSize: 15, lineHeight: 1.82, color: "#3a2810" }}>
              <p style={{ marginBottom: 14 }}>
                It is with deep sorrow that we inform you of the passing of{" "}
                <strong style={{ color: "#1a0e04" }}>Mrs. Sudipta Mohanty</strong>,
                promoter of Samudayik Vikas Samiti, on{" "}
                <strong style={{ color: "#1a0e04" }}>18 April 2026</strong>.
              </p>
              <p style={{ marginBottom: 14 }}>
                In view of this untimely loss, the scheduled{" "}
                <strong style={{ color: "#1a0e04" }}>Odisha Raja Parba 2026 (13–15 June 2026)</strong>{" "}
                at <strong style={{ color: "#1a0e04" }}>Noida Stadium</strong> has been{" "}
                <span style={{ color: "#991b1b", fontWeight: 700 }}>cancelled</span>.
                We know this news will be disheartening, and we extend our heartfelt condolences to her family.
              </p>
              <p style={{ marginBottom: 22 }}>
                We plan to hold Raja Parba in{" "}
                <strong style={{ color: "#1a0e04" }}>2027</strong> to honour her memory
                and hope for your continued support then.
              </p>
            </div>

            {/* Alternative event */}
            <div style={{
              background: "linear-gradient(135deg, #f0fdf5, #e8f8ee)",
              border: "1px solid #6ee7a0",
              borderRadius: 12, padding: "16px 20px", marginBottom: 22,
            }}>
              <p style={{
                fontSize: 11, fontWeight: 700, letterSpacing: "0.16em",
                color: "#15803d", marginBottom: 10, textTransform: "uppercase",
              }}>
                🌸 &nbsp;Alternative Celebration — Gurgaon
              </p>
              <p style={{ fontSize: 14.5, lineHeight: 1.78, color: "#14532d", marginBottom: 8 }}>
                You are warmly invited to join the Raja Parba being organized in{" "}
                <strong>Gurgaon</strong> by{" "}
                <strong>Mr. Askhya Samal</strong>, Founder of{" "}
                <strong>Kalinga Bharati Foundation</strong>.
              </p>
              <p style={{ fontSize: 13, color: "#166534", fontStyle: "italic" }}>
                For details, please contact Mr. Askhya Samal or follow updates from Kalinga Bharati Foundation.
              </p>
            </div>

            {/* ── Tribute Video ── */}
            <div style={{ marginBottom: 26 }}>
              <p style={{
                fontSize: 11, fontWeight: 700, letterSpacing: "0.16em",
                color: "#b8832a", textAlign: "center",
                marginBottom: 12, textTransform: "uppercase",
              }}>
                🎞️ &nbsp;Tribute Video
              </p>
              <div style={{
                borderRadius: 12, overflow: "hidden",
                border: "1.5px solid #d4a84b",
                background: "#f5e8cc",
                /* Fix: use fixed height instead of aspect-ratio so iframe fills it */
                height: 280,
                display: "flex",
                boxShadow: "0 4px 16px rgba(120,75,15,.12)",
              }}>
                {videoSrc ? (
                  isLocalVideo ? (
                    <video
                      src={videoSrc}
                      controls
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  ) : (
                    <iframe
                      src={videoSrc}
                      style={{ width: "100%", height: "100%", border: "none", display: "block" }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="Tribute video"
                    />
                  )
                ) : (
                  <div style={{
                    width: "100%", display: "flex",
                    flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12,
                  }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: "50%",
                      background: "#eddcb8", border: "1.5px dashed #c8923e",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 20, color: "#b8832a",
                    }}>▶</div>
                    <p style={{ fontSize: 13, color: "#b8832a", textAlign: "center", fontStyle: "italic", lineHeight: 1.5 }}>
                      Tribute video coming soon<br />
                      <span style={{ fontSize: 11, opacity: .65 }}>Pass <code>videoSrc</code> prop to embed</span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="rpc-divider" />

            {/* Closing */}
            <p style={{
              fontFamily: "'Libre Baskerville', serif",
              fontStyle: "italic", fontSize: 13,
              color: "#7a5220", textAlign: "center", marginBottom: 16,
            }}>
              Thank you for your understanding during this difficult time.
            </p>

            {/* Signature */}
            <div style={{ textAlign: "center" }}>
              <p style={{
                fontFamily: "'Libre Baskerville', serif",
                fontStyle: "italic", fontSize: 16,
                color: "#2e1a08", marginBottom: 4,
              }}>
                With sympathy,
              </p>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#b8832a", letterSpacing: "0.06em" }}>
                Samudayik Vikas Samiti Organizing Committee
              </p>
            </div>
          </div>

          {/* ── Bottom gold stripe ── */}
          <div style={{
            height: 5,
            background: "linear-gradient(90deg, #7a4a10, #c8923e, #f0d080, #c8923e, #7a4a10)",
            borderRadius: "0 0 18px 18px",
          }} />
        </div>
      </div>
    </>
  );
}
