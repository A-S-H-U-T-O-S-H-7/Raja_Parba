import Swal from "sweetalert2";
import confetti from "canvas-confetti";

const colorThemes = {
  amber: { from: "#f59e0b", to: "#d97706", soft: "#fef3c7" },
  blue: { from: "#2563eb", to: "#0891b2", soft: "#dbeafe" },
  emerald: { from: "#10b981", to: "#0f766e", soft: "#d1fae5" },
  rose: { from: "#e11d48", to: "#be185d", soft: "#ffe4e6" },
  violet: { from: "#7c3aed", to: "#9333ea", soft: "#f3e8ff" },
};

export const showEntryPassAlert = async ({
  registrationId,
  name = "Candidate",
  theme = "amber",
}) => {
  const palette = colorThemes[theme] || colorThemes.amber;
  let cannonCanvas = null;
  let shootCannon = null;

  await Swal.fire({
    html: `
      <style>
        .entry-pass-popup {
          background: transparent !important;
          box-shadow: none !important;
          border: 0 !important;
          padding: 0 !important;
          width: auto !important;
        }
        .entry-pass-wrap {
          position: relative;
          padding: 4px;
          overflow: hidden;
        }
        .entry-pass-glow {
          position: absolute;
          inset: 12px;
          border-radius: 22px;
          background:
            radial-gradient(circle at 20% 12%, ${palette.soft}, transparent 58%),
            radial-gradient(circle at 80% 18%, ${palette.soft}, transparent 62%),
            radial-gradient(circle at 50% 100%, #ffffff, transparent 70%);
          filter: blur(14px);
          opacity: 0.9;
        }
        .entry-pass-card {
          position: relative;
          border: 1px solid ${palette.from}33;
          border-radius: 18px;
          background: linear-gradient(165deg, #ffffff 0%, ${palette.soft} 50%, #ffffff 100%);
          padding: 16px 16px 18px;
          text-align: center;
          box-shadow:
            0 18px 32px rgba(15, 23, 42, 0.18),
            0 2px 8px rgba(124, 58, 237, 0.2);
          animation: passBounceIn 1s cubic-bezier(.12,1.35,.28,1) both;
          transform-origin: center;
        }
        .entry-pass-image-wrap {
          margin: 2px auto 10px;
          width: 100%;
          max-width: 260px;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 10px 22px rgba(15, 23, 42, 0.16);
          animation: passImageZoom 1.05s cubic-bezier(.18,1.22,.25,1) both;
        }
        .entry-pass-image {
          display: block;
          width: 100%;
          height: auto;
        }
        .entry-pass-chip {
          display: inline-block;
          border-radius: 9999px;
          padding: 4px 10px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.4px;
          color: white;
          background: linear-gradient(135deg, ${palette.from}, ${palette.to});
          margin-bottom: 8px;
        }
        .entry-pass-title {
          margin: 2px 0 0;
          font-size: 1.35rem;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: .2px;
        }
        .entry-pass-sub {
          margin: 8px 0 0;
          font-size: 1rem;
          color: #334155;
          font-weight: 700;
        }
        .entry-pass-id {
          margin: 10px 0 0;
          font-size: 0.84rem;
          font-weight: 700;
          color: ${palette.to};
          word-break: break-word;
        }
        @keyframes passBounceIn {
          0% { opacity: 0; transform: scale(0.65) translateY(44px); }
          62% { opacity: 1; transform: scale(1.08) translateY(-8px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes passImageZoom {
          0% { opacity: 0; transform: scale(0.82); }
          65% { opacity: 1; transform: scale(1.06); }
          100% { opacity: 1; transform: scale(1); }
        }
        .swal2-container {
          backdrop-filter: blur(10px);
        }
      </style>
      <div class="entry-pass-wrap">
        <div class="entry-pass-glow"></div>
        <div class="entry-pass-card">
          <div class="entry-pass-image-wrap">
            <img src="/pass.png" alt="Entry Pass" class="entry-pass-image" />
          </div>
          <span class="entry-pass-chip">ODISHA RAJA PARBA 2026</span>
          <p class="entry-pass-title">Congratulations!!</p>
          <p class="entry-pass-sub">You got an Entry Pass 🎉</p>
          <p class="entry-pass-id">Pass ID: ${registrationId || "Generating..."}</p>
          <p class="entry-pass-id">Name: ${name || "Candidate"}</p>
        </div>
      </div>
    `,
    showConfirmButton: false,
    timer: 7500,
    timerProgressBar: true,
    background: "transparent",
    allowOutsideClick: false,
    backdrop: "rgba(15, 23, 42, 0.45)",
    didOpen: () => {
      cannonCanvas = document.createElement("canvas");
      cannonCanvas.style.position = "fixed";
      cannonCanvas.style.top = "0";
      cannonCanvas.style.left = "0";
      cannonCanvas.style.width = "100vw";
      cannonCanvas.style.height = "100vh";
      cannonCanvas.style.pointerEvents = "none";
      cannonCanvas.style.zIndex = "100000";
      document.body.appendChild(cannonCanvas);

      shootCannon = confetti.create(cannonCanvas, {
        resize: true,
        useWorker: true,
      });

      shootCannon({
        particleCount: 280,
        spread: 120,
        startVelocity: 58,
        scalar: 1.05,
        origin: { x: 0.5, y: 0.38 },
        colors: [palette.from, palette.to, "#facc15", "#22c55e", "#3b82f6"],
      });
    },
    willClose: () => {
      if (shootCannon) {
        shootCannon.reset();
      }
      if (cannonCanvas && cannonCanvas.parentNode) {
        cannonCanvas.parentNode.removeChild(cannonCanvas);
      }
    },
    customClass: {
      popup: "entry-pass-popup",
    },
  });
};