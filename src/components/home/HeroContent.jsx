"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Cinzel } from "next/font/google";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const HeroContent = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    audioRef.current.src = '/raja2.mpeg';

    audioRef.current.addEventListener('error', () => {
      console.log('MP3 failed, trying MPEG...');
      audioRef.current.src = '/raja2.mpeg';
    });

    audioRef.current.addEventListener('canplaythrough', () => {
      console.log('Audio loaded successfully');
      setAudioError(false);
    });

    audioRef.current.addEventListener('error', (e) => {
      console.error('All audio formats failed to load');
      setAudioError(true);
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        if (audioError) {
          audioRef.current.src = '/raja2.mpeg';
          setAudioError(false);
        }

        const playPromise = audioRef.current.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch(error => {
              console.log("Playback failed:", error);
              setAudioError(true);
            });
        }
      }
    }
  };

  return (
    <div
      className="relative w-full hero-height bg-cover bg-center overflow-x-clip overflow-y-visible"
      style={{ backgroundImage: "url('/redbg.png')" }}
    >

      {/* Corner Design — Bottom Left */}
      <div className="absolute overflow-x-hidden bottom-0 left-[-20px] md:bottom-[-10px] md:left-[-60px] w-38 h-38 sm:w-42 sm:h-42 md:w-72 md:h-72 z-20">
        <Image
          src="/herocorner.png"
          alt="corner design"
          fill
          className="object-contain"
        />
      </div>

      {/* Corner Design — Top Left */}
      <div className="absolute top-0 left-[-30px] md:top-[-10px] md:left-[-40px] w-28 h-28 sm:w-32 sm:h-32 md:w-38 md:h-38 z-20">
        <Image
          src="/heromala.png"
          alt="corner design"
          fill
          className="object-contain scale-x-[-1]"
        />
      </div>

      {/* Corner Design — Top Right */}
      <div className="absolute top-0 right-[-30px] md:top-[-10px] md:right-[-40px] w-28 h-28 sm:w-32 sm:h-32 md:w-38 md:h-38 z-20">
        <Image
          src="/heromala.png"
          alt="corner design"
          fill
          className="object-contain"
        />
      </div>

      {/* Sparkle Particles */}
      {[...Array(28)].map((_, i) => (
        <span
          key={i}
          className="sparkle-particle"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: "-20px",
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${4 + Math.random() * 6}s`,
          }}
        />
      ))}

      {/* Swing Girl */}
      <div className="absolute left-0 bottom-[50px] sm:bottom-[-40px] md:bottom-[-50px] z-10 md:z-20">
        <div className="relative opacity-80 md:opacity-100 ml-[80px] sm:ml-[120px] md:ml-[150px] w-[190px] sm:w-[130px] md:w-[260px] swing-animation">
          <Image
            src="/rajadoli.png"
            alt="Raja Doli"
            width={300}
            height={380}
            priority
            className="object-contain"
          />
        </div>
      </div>

      {/* Odisha Map */}
      <div className="absolute right-10 bottom-[90px] md:bottom-[5px] z-0 md:z-20  block">
        <div className="relative mr-[-30px] mb-10 md:mb-5 m md:mr-[120px] w-[140px] sm:w-[200px] md:w-[500px] md:h-[300px] scale-110 opacity-50">
          <Image
            src="/odisha.png"
            alt="odisha"
            width={330}
            height={380}
            priority
            className="object-contain"
          />
        </div>
      </div>

      {/* Right Side Kalash */}
      <div className="absolute right-0 bottom-0 z-10 flex items-end justify-end h-full pr-0">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#b30000]/40 to-[#b30000] blur-xl scale-110 rounded-full"></div>
          <Image
            src="/herokalash.png"
            alt="Kalash"
            width={320}
            height={300}
            priority
            className="relative object-contain w-[120px] sm:w-[200px] md:w-[320px]
                       drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]
                       brightness-95 contrast-105"
          />
        </div>
      </div>

      {/* Center Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8 gap-2 sm:gap-3">
        
        {/* Title */}
        <h1
          className={`${cinzel.className} text-2xl sm:text-3xl md:text-5xl royal-odia-title leading-tight`}
        >
          Raja Mahotsav 2026
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm md:text-lg text-[#F8E7C5] tracking-wide">
          Celebrate the Raja Festival in Noida!
        </p>

        {/* ✨ Date Badge */}
        <div className="date-badge">
          <span className="date-badge-inner">
            13th – 15th June, 2026
          </span>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-1 sm:mt-2">
          
          {/* Join the Celebration Button */}
          <Link
            href="/join"
            className="inline-block px-6 sm:px-8 py-2 bg-white text-[#8B0000]
            text-sm sm:text-base font-semibold rounded-full
            transition-all duration-300
            hover:scale-105
            hover:shadow-[0_0_25px_rgba(255,215,0,0.7)]"
          >
            Join the Celebration
          </Link>

          {/* ✨ Audio Play Button with Glow */}
          <button
            onClick={togglePlay}
            disabled={audioError}
            className={`music-btn ${audioError ? 'music-btn--error' : ''} ${isPlaying ? 'music-btn--playing' : ''}`}
            aria-label={isPlaying ? "Pause music" : "Play music"}
          >
            {/* Icon */}
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0
                            ${audioError ? 'bg-red-500/20' : 'bg-[#ffd700]/20'}`}>
              {audioError ? (
                <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              ) : isPlaying ? (
                <svg className="w-3 h-3 text-[#ffd700]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 19h4V5h-4v14zm-8 0h4V5H6v14z"/>
                </svg>
              ) : (
                <svg className="w-3 h-3 text-[#ffd700] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </div>

            {/* Text */}
            <span className={`text-sm whitespace-nowrap ${audioError ? 'text-red-400' : 'text-[#F8E7C5]'}`}>
              {audioError ? 'Audio Unavailable' : (isPlaying ? 'Pause Music' : 'Play Music')}
            </span>

            {/* Equalizer Animation when playing */}
            {isPlaying && !audioError && (
              <div className="flex items-center gap-0.5 ml-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="equalizer-bar-small"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            )}

            {/* Glow ring overlay (for non-error state) */}
            {!audioError && <span className="music-btn-glow-ring" />}
          </button>
        </div>
      </div>

      {/* Footer Border */}
      <div
        className="absolute w-full h-5 md:h-8 mt-[-10px] md:mt-[-20] rotate-180 z-10 bg-repeat-x bg-center"
        style={{
          backgroundImage: 'url(/footerborder.png)',
          backgroundSize: 'auto 100%'
        }}
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      ></div>

      {/* CSS Styles */}
      <style>{`
        /* Hero height responsive */
        .hero-height {
          height: 340px;
        }
        @media (min-width: 640px) {
          .hero-height { height: 370px; }
        }
        @media (min-width: 768px) {
          .hero-height { height: 390px; }
        }

        /* ─── Sparkle ─── */
        .sparkle-particle {
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: radial-gradient(circle, #ffd700 0%, #ffec8b 60%, transparent 100%);
          animation: sparkleFloat linear infinite;
        }

        @keyframes sparkleFloat {
          0%   { transform: translateY(0) scale(0); opacity: 0; }
          50%  { transform: translateY(-200px) scale(1); opacity: 1; }
          100% { transform: translateY(-400px) scale(0); opacity: 0; }
        }

        /* ─── Equalizer ─── */
        .equalizer-bar-small {
          width: 3px;
          height: 12px;
          background-color: #ffd700;
          border-radius: 1px;
          animation: equalizer-small 0.6s ease-in-out infinite;
        }
        @keyframes equalizer-small {
          0%, 100% { height: 6px; }
          25%       { height: 12px; }
          50%       { height: 8px; }
          75%       { height: 10px; }
        }

        /* ─── Swing ─── */
        .swing-animation {
          animation: swing 3s ease-in-out infinite;
          transform-origin: top center;
        }
        @keyframes swing {
          0%, 100% { transform: rotate(-3deg); }
          50%       { transform: rotate(3deg); }
        }

        /* ─────────────────────────────────────────
           DATE BADGE
        ───────────────────────────────────────── */
        .date-badge {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
          border-radius: 9999px;
          background: linear-gradient(135deg, #ffd700, #ff8c00, #ffd700, #ffec8b);
          background-size: 300% 300%;
          animation: dateGradientMove 3s ease infinite;
          box-shadow:
            0 0 12px rgba(255, 215, 0, 0.6),
            0 0 28px rgba(255, 140, 0, 0.35),
            inset 0 0 6px rgba(255, 215, 0, 0.2);
        }

        @keyframes dateGradientMove {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .date-badge-inner {
          display: inline-block;
          padding: 5px 20px;
          border-radius: 9999px;
          background: rgba(120, 0, 0, 0.85);
          backdrop-filter: blur(6px);
          font-size: 0.85rem;
          font-weight: 700;
          color: #ffd700;
          letter-spacing: 0.08em;
          white-space: nowrap;
          text-shadow: 0 0 8px rgba(255, 215, 0, 0.7);
        }

        @media (min-width: 640px) {
          .date-badge-inner { font-size: 0.95rem; padding: 6px 24px; }
        }
        @media (min-width: 768px) {
          .date-badge-inner { font-size: 1.1rem; padding: 7px 28px; }
        }

        /* ─────────────────────────────────────────
           MUSIC BUTTON
        ───────────────────────────────────────── */
        .music-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          border-radius: 9999px;
          border: 1.5px solid rgba(255, 215, 0, 0.55);
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(8px);
          cursor: pointer;
          transition: all 0.3s ease;
          overflow: hidden;
          /* ✨ Glow effect */
          box-shadow:
            0 0 10px rgba(255, 215, 0, 0.35),
            0 0 22px rgba(255, 140, 0, 0.2),
            inset 0 0 8px rgba(255, 215, 0, 0.07);
          animation: musicBtnPulse 2.5s ease-in-out infinite;
        }

        /* Pulsing glow animation */
        @keyframes musicBtnPulse {
          0%, 100% {
            box-shadow:
              0 0 10px rgba(255, 215, 0, 0.35),
              0 0 22px rgba(255, 140, 0, 0.2),
              inset 0 0 8px rgba(255, 215, 0, 0.07);
            border-color: rgba(255, 215, 0, 0.55);
          }
          50% {
            box-shadow:
              0 0 18px rgba(255, 215, 0, 0.7),
              0 0 40px rgba(255, 140, 0, 0.45),
              inset 0 0 12px rgba(255, 215, 0, 0.15);
            border-color: rgba(255, 215, 0, 0.9);
          }
        }

        .music-btn:hover {
          background: rgba(255, 255, 255, 0.16);
          transform: scale(1.05);
          box-shadow:
            0 0 22px rgba(255, 215, 0, 0.75),
            0 0 48px rgba(255, 140, 0, 0.5),
            inset 0 0 14px rgba(255, 215, 0, 0.2);
          border-color: #ffd700;
          animation: none;
        }

        /* When actively playing — stronger glow */
        .music-btn--playing {
          background: rgba(255, 215, 0, 0.12);
          border-color: #ffd700;
          animation: musicBtnPlayingPulse 1.5s ease-in-out infinite;
        }

        @keyframes musicBtnPlayingPulse {
          0%, 100% {
            box-shadow:
              0 0 14px rgba(255, 215, 0, 0.5),
              0 0 32px rgba(255, 140, 0, 0.35),
              inset 0 0 10px rgba(255, 215, 0, 0.12);
          }
          50% {
            box-shadow:
              0 0 24px rgba(255, 215, 0, 0.9),
              0 0 56px rgba(255, 140, 0, 0.55),
              inset 0 0 18px rgba(255, 215, 0, 0.22);
          }
        }

        /* Error state — red tones */
        .music-btn--error {
          border-color: rgba(239, 68, 68, 0.5);
          background: rgba(239, 68, 68, 0.1);
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.25);
          cursor: not-allowed;
          animation: none;
        }

        /* Rotating glow ring (decorative) */
        .music-btn-glow-ring {
          position: absolute;
          inset: -3px;
          border-radius: 9999px;
          background: conic-gradient(
            transparent 30%,
            rgba(255, 215, 0, 0.45) 50%,
            transparent 70%
          );
          animation: rotatRing 3s linear infinite;
          pointer-events: none;
          z-index: -1;
        }

        @keyframes rotatRing {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default HeroContent;