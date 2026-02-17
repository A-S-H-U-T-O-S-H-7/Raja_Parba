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
    // Initialize audio element with better error handling
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    
    // Try MP3 first (most compatible)
    audioRef.current.src = '/raja2.mpeg'; // Make sure you have music.mp3 in public folder
    
    // If MP3 fails, try the original mpeg
    audioRef.current.addEventListener('error', () => {
      console.log('MP3 failed, trying MPEG...');
      audioRef.current.src = '/raja2.mpeg';
    });
    
    // Success handler
    audioRef.current.addEventListener('canplaythrough', () => {
      console.log('Audio loaded successfully');
      setAudioError(false);
    });
    
    // Final error handler
    audioRef.current.addEventListener('error', (e) => {
      console.error('All audio formats failed to load');
      setAudioError(true);
    });
    
    // Cleanup
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
        // Reset src if there was an error
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
      className="relative w-full h-[390px] bg-cover bg-center overflow-x-clip overflow-y-visible"
      style={{ backgroundImage: "url('/redbg.png')" }}
    >
      {/* All your existing JSX remains exactly the same until the button section */}
      
      {/* Corner Design */}
      <div className="absolute overflow-x-hidden bottom-0 left-[-10px] md:bottom-[-10px] md:left-[-60px] w-24 h-24 md:w-72 md:h-72 z-20">
        <Image
          src="/herocorner.png"
          alt="corner design"
          fill
          className="object-contain"
        />
      </div>
      <div className="absolute top-0 left-[-10px] md:top-[-10px] md:left-[-40px] w-24 h-24 md:w-38 md:h-38 z-20">
        <Image
          src="/heromala.png"
          alt="corner design"
          fill
          className="object-contain scale-x-[-1]"
        />
      </div>
      <div className="absolute top-0 right-[-10px] md:top-[-10px] md:right-[-40px] w-24 h-24 md:w-38 md:h-38 z-20">
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
      <div className="absolute left-0 bottom-[-50px] z-20">
        <div className="relative ml-[150px] w-[130px] sm:w-[180px] md:w-[260px] swing-animation">
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
            className="relative object-contain 
                       drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]
                       brightness-95 contrast-105"
          />
        </div>
      </div>

      {/* Center Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <h1
          className={`${cinzel.className} text-3xl sm:text-4xl md:text-5xl mb-3 royal-odia-title`}
        >
          Raja Mahotsav 2026
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-[#F8E7C5] mb-2 tracking-wide">
          Celebrate the Raja Festival in Noida!
        </p>

        <p className="text-base sm:text-lg md:text-xl text-white font-medium mb-5">
          14th – 16th June, 2026
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Join the Celebration Button */}
          <Link
            href="/join"
            className="inline-block px-8 py-2 bg-white text-[#8B0000]
            font-semibold rounded-full
            transition-all duration-300
            hover:scale-105
            hover:shadow-[0_0_25px_rgba(255,215,0,0.7)]"
          >
            Join the Celebration
          </Link>

          {/* Audio Play Button */}
          <button
            onClick={togglePlay}
            disabled={audioError}
            className={`flex items-center gap-2 px-4 py-2 rounded-full 
                       backdrop-blur-sm border transition-all duration-300
                       ${audioError 
                         ? 'bg-red-500/20 border-red-500/50 cursor-not-allowed' 
                         : 'bg-white/10 border-[#ffd700]/50 hover:bg-white/20 hover:scale-105 hover:border-[#ffd700]'
                       }
                       group`}
            aria-label={isPlaying ? "Pause music" : "Play music"}
          >
            {/* Icon */}
            <div className={`w-6 h-6 rounded-full flex items-center justify-center
                            ${audioError ? 'bg-red-500/20' : 'bg-[#ffd700]/20'}`}>
              {audioError ? (
                <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              ) : isPlaying ? (
                <svg 
                  className="w-3 h-3 text-[#ffd700]" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M14 19h4V5h-4v14zm-8 0h4V5H6v14z"/>
                </svg>
              ) : (
                <svg 
                  className="w-3 h-3 text-[#ffd700] ml-0.5" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </div>
            
            {/* Text */}
            <span className={`text-sm ${audioError ? 'text-red-400' : 'text-[#F8E7C5] group-hover:text-white'}`}>
              {audioError ? 'Audio Unavailable' : (isPlaying ? 'Pause Music' : 'Play Music')}
            </span>

            {/* Equalizer Animation when playing */}
            {isPlaying && !audioError && (
              <div className="flex items-center gap-0.5 ml-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="equalizer-bar-small"
                    style={{
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            )}
          </button>
        </div>
      </div>
      
      <div 
        className="absolute w-full h-8 mt-[-20] rotate-180 z-10 bg-repeat-x bg-center"
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
        .sparkle-particle {
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: radial-gradient(circle, #ffd700 0%, #ffec8b 60%, transparent 100%);
          animation: sparkleFloat linear infinite;
        }

        @keyframes sparkleFloat {
          0% {
            transform: translateY(0) scale(0);
            opacity: 0;
          }
          50% {
            transform: translateY(-200px) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-400px) scale(0);
            opacity: 0;
          }
        }

        .equalizer-bar-small {
          width: 3px;
          height: 12px;
          background-color: #ffd700;
          border-radius: 1px;
          animation: equalizer-small 0.6s ease-in-out infinite;
        }

        @keyframes equalizer-small {
          0%, 100% { height: 6px; }
          25% { height: 12px; }
          50% { height: 8px; }
          75% { height: 10px; }
        }

        .swing-animation {
          animation: swing 3s ease-in-out infinite;
          transform-origin: top center;
        }

        @keyframes swing {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
      `}</style>
    </div>
  );
};

export default HeroContent;