import React, { useState, useEffect } from 'react';
import { Ticket, ArrowRight, Sparkles, MapPin, Star } from 'lucide-react';
import Link from 'next/link';

export default function EventBanner() {
  const [pulse, setPulse] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [particles, setParticles] = useState([]);
  const [dayIndex, setDayIndex] = useState(0);

  const days = [
    { label: '13 June', emoji: '🌸' },
    { label: '14 June', emoji: '🌺' },
    { label: '15 June', emoji: '🌼' },
  ];

  useEffect(() => {
    const pts = Array.from({ length: 14 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
      size: Math.random() * 5 + 2,
      duration: Math.random() * 4 + 4,
    }));
    setParticles(pts);

    const pulseInterval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 700);
    }, 3200);

    const dayInterval = setInterval(() => {
      setDayIndex(prev => (prev + 1) % days.length);
    }, 1800);

    return () => {
      clearInterval(pulseInterval);
      clearInterval(dayInterval);
    };
  }, []);

  return (
    <div
      className="w-full py-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 35%, #312e81 65%, #1e1b4b 100%)',
        minHeight: '165px',
      }}
    >
      {/* Top shimmer accent */}
      <div className="absolute top-0 left-0 right-0 h-[3px] overflow-hidden">
        <div
          style={{
            width: '200%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent 0%, #f59e0b 30%, #fbbf24 50%, #f59e0b 70%, transparent 100%)',
            animation: 'shimmerLine 2.2s linear infinite',
          }}
        />
      </div>

      {/* Floating gold particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            background: 'rgba(251, 191, 36, 0.5)',
            animation: `floatUp ${p.duration}s ${p.delay}s ease-in-out infinite`,
            bottom: 0,
          }}
        />
      ))}

      {/* Background glow orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div style={{ position: 'absolute', top: '50%', left: '10%', transform: 'translate(-50%,-50%)', width: 280, height: 280, background: 'radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%)', animation: 'orbitGlow 7s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', top: '50%', right: '5%', transform: 'translate(50%,-50%)', width: 220, height: 220, background: 'radial-gradient(circle, rgba(245,158,11,0.18) 0%, transparent 70%)', animation: 'orbitGlow 7s 3.5s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 180, height: 180, background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', animation: 'orbitGlow 9s 1s ease-in-out infinite' }} />
      </div>

      {/* ── DESKTOP LAYOUT (md+) ── */}
      <div className="hidden md:flex relative items-center h-full px-8 gap-6" style={{ minHeight: '165px' }}>

        {/* Left block — festival identity */}
        <div className="flex flex-col gap-2 shrink-0 w-48">
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-1.5 rounded-full px-3 py-1"
              style={{ background: 'rgba(99,102,241,0.28)', border: '1px solid rgba(129,140,248,0.45)' }}
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400" style={{ animation: 'blink 1.2s ease-in-out infinite' }} />
              <span className="text-indigo-200 text-[10px] font-bold tracking-widest uppercase">Live Event</span>
            </div>
          </div>
          <div>
            <p className="text-yellow-400 text-lg font-black leading-none tracking-tight" style={{ textShadow: '0 0 20px rgba(251,191,36,0.5)' }}>
              Raja Parba
            </p>
            <p className="text-indigo-300 text-xs font-medium mt-0.5">Odisha's Sacred Festival</p>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <MapPin className="w-3 h-3 text-indigo-400" />
            <span className="text-indigo-300 text-xs">Noida, Delhi NCR</span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px self-stretch my-5" style={{ background: 'linear-gradient(to bottom, transparent, rgba(129,140,248,0.4), transparent)' }} />

        {/* Center block — main headline + dates */}
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-400" style={{ animation: 'spin 4s linear infinite' }} />
            <h2 className="text-white text-xl font-black text-center leading-tight tracking-tight">
              Celebrating <span style={{ color: '#fbbf24', textShadow: '0 0 16px rgba(251,191,36,0.4)' }}>Culture, Dance &amp; Tradition</span>
            </h2>
            <Sparkles className="w-4 h-4 text-yellow-400" style={{ animation: 'spin 4s linear infinite reverse' }} />
          </div>
          <p className="text-indigo-300 text-sm text-center leading-relaxed max-w-sm">
            3 days of music, folk art, authentic cuisine &amp; the spirit of Odisha — right here in the heart of NCR
          </p>
          {/* Cycling date badges */}
          <div className="flex items-center gap-2">
            {days.map((d, i) => (
              <div
                key={d.label}
                className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-all duration-500"
                style={{
                  background: i === dayIndex ? 'rgba(251,191,36,0.2)' : 'rgba(99,102,241,0.15)',
                  border: i === dayIndex ? '1px solid rgba(251,191,36,0.6)' : '1px solid rgba(129,140,248,0.25)',
                  color: i === dayIndex ? '#fbbf24' : '#a5b4fc',
                  transform: i === dayIndex ? 'scale(1.1)' : 'scale(1)',
                  boxShadow: i === dayIndex ? '0 0 10px rgba(251,191,36,0.3)' : 'none',
                }}
              >
                <span>{d.emoji}</span>
                <span>{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-px self-stretch my-5" style={{ background: 'linear-gradient(to bottom, transparent, rgba(129,140,248,0.4), transparent)' }} />

        {/* Right block — CTA */}
        <div className="shrink-0 flex flex-col items-center gap-3 w-48">
          <p className="text-indigo-300 text-xs text-center">FREE · No hidden fees · Instant confirmation</p>
          <Link href="/delegate">
            <button
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              className="relative overflow-hidden flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm text-gray-900 w-full justify-center"
              style={{
                background: hovered
                  ? 'linear-gradient(135deg, #fde047, #f59e0b, #d97706)'
                  : 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                boxShadow: pulse
                  ? '0 0 0 8px rgba(251,191,36,0.25), 0 0 28px rgba(251,191,36,0.65)'
                  : hovered
                  ? '0 0 20px rgba(251,191,36,0.7)'
                  : '0 0 14px rgba(251,191,36,0.45)',
                transform: pulse ? 'scale(1.08)' : hovered ? 'scale(1.04)' : 'scale(1)',
                transition: 'all 0.25s ease',
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)',
                  transform: hovered ? 'translateX(100%)' : 'translateX(-100%)',
                  transition: 'transform 0.55s ease',
                }}
              />
              <Ticket className="w-4 h-4 relative z-10" style={{ transform: hovered ? 'rotate(12deg) scale(1.2)' : 'none', transition: 'transform 0.25s' }} />
              <span className="relative z-10">
                Get{' '}
                <span style={{ color: '#1e1b4b', fontWeight: 900, display: 'inline-block', animation: 'wiggle 1s ease-in-out infinite' }}>
                  FREE
                </span>{' '}
                Pass
              </span>
              <ArrowRight className="w-4 h-4 relative z-10" style={{ transform: hovered ? 'translateX(4px)' : 'none', transition: 'transform 0.25s' }} />
            </button>
          </Link>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            ))}
            <span className="text-indigo-300 text-[10px] ml-1">Odisha's Finest</span>
          </div>
        </div>
      </div>

      {/* ── MOBILE LAYOUT (< md) ── */}
      <div className="flex md:hidden relative flex-col items-center justify-center px-4 py-4 gap-3 text-center" style={{ minHeight: '165px' }}>

        {/* Top row: badge + location */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1" style={{ background: 'rgba(99,102,241,0.28)', border: '1px solid rgba(129,140,248,0.4)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: 'blink 1.2s ease-in-out infinite' }} />
            <span className="text-indigo-200 text-[10px] font-bold tracking-widest uppercase">Raja Parba</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-indigo-400" />
            <span className="text-indigo-300 text-[10px]">Noida, Delhi NCR</span>
          </div>
        </div>

        {/* Headline */}
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400 shrink-0" style={{ animation: 'spin 4s linear infinite' }} />
          <p className="text-white text-sm font-black leading-snug">
            Odisha's <span style={{ color: '#fbbf24' }}>Raja Parba</span> Festival — <span style={{ color: '#a5f3fc' }}>3 Days of Joy</span>
          </p>
          <Sparkles className="w-3.5 h-3.5 text-yellow-400 shrink-0" style={{ animation: 'spin 4s linear infinite reverse' }} />
        </div>

        {/* Cycling date badges row */}
        <div className="flex items-center gap-1.5">
          {days.map((d, i) => (
            <div
              key={d.label}
              className="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition-all duration-500"
              style={{
                background: i === dayIndex ? 'rgba(251,191,36,0.2)' : 'rgba(99,102,241,0.15)',
                border: i === dayIndex ? '1px solid rgba(251,191,36,0.6)' : '1px solid rgba(129,140,248,0.2)',
                color: i === dayIndex ? '#fbbf24' : '#a5b4fc',
                transform: i === dayIndex ? 'scale(1.1)' : 'scale(1)',
                boxShadow: i === dayIndex ? '0 0 8px rgba(251,191,36,0.3)' : 'none',
              }}
            >
              <span>{d.emoji}</span>
              <span>{d.label}</span>
            </div>
          ))}
        </div>

        {/* CTA Button — full width on mobile */}
        <Link href="/delegate" className="w-full">
          <button
            className="relative overflow-hidden flex items-center justify-center gap-2 w-full py-3 rounded-xl font-black text-sm text-gray-900"
            style={{
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              boxShadow: pulse
                ? '0 0 0 6px rgba(251,191,36,0.25), 0 0 22px rgba(251,191,36,0.6)'
                : '0 0 14px rgba(251,191,36,0.45)',
              transform: pulse ? 'scale(1.04)' : 'scale(1)',
              transition: 'all 0.25s ease',
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)',
                animation: 'shineSweep 2.5s ease-in-out infinite',
              }}
            />
            <Ticket className="w-4 h-4 relative z-10" />
            <span className="relative z-10">
              Get{' '}
              <span style={{ color: '#1e1b4b', fontWeight: 900, display: 'inline-block', animation: 'wiggle 1s ease-in-out infinite' }}>
                FREE
              </span>{' '}
              Entry Pass
            </span>
            <ArrowRight className="w-4 h-4 relative z-10" />
          </button>
        </Link>
      </div> 
      
      {/* Footer Border */}
      <div
        className="absolute w-full h-5 md:h-8 mt-[-2px] md:mt-[-10] rotate-180 z-10 bg-repeat-x bg-center"
        style={{
          backgroundImage: 'url(/footerborder.png)',
          backgroundSize: 'auto 100%'
        }}
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      ></div>


      {/* Bottom shimmer accent */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] overflow-hidden">
        <div
          style={{
            width: '200%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent 0%, #6366f1 30%, #818cf8 50%, #6366f1 70%, transparent 100%)',
            animation: 'shimmerLine 3s linear infinite reverse',
          }}
        />
      </div>

      <style>{`
        @keyframes shimmerLine {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        @keyframes shineSweep {
          0% { transform: translateX(-100%); }
          60%, 100% { transform: translateX(100%); }
        }
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          15% { opacity: 0.85; }
          85% { opacity: 0.3; }
          100% { transform: translateY(-80px) scale(0.3); opacity: 0; }
        }
        @keyframes orbitGlow {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.9; }
          50% { transform: translate(-50%, -50%) scale(1.4); opacity: 0.3; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.15; }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-5deg) scale(1.08); }
          50% { transform: rotate(5deg) scale(1.15); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeDay {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}