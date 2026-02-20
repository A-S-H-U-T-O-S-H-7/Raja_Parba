"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Playfair_Display, Cinzel } from 'next/font/google';

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const cinzel = Cinzel({ 
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

const GallerySection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);

  const galleryImages = [
    { src: "/mandala.png", title: "Traditional Dance Performance", year: "2025" },
    { src: "/delegate.png", title: "Cultural Procession", year: "2025" },
    { src: "/flowerEvent1.png", title: "Food Festival Stalls", year: "2025" },
    { src: "/greenbg.png", title: "Evening Celebration", year: "2025" },
    { src: "/greenflower.png", title: "Traditional Rituals", year: "2025" },
    { src: "/havan.jpg", title: "Community Gathering", year: "2025" },
    { src: "/heroimage.png", title: "Night Festival Lights", year: "2025" }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsInView(true); },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
  }, []);

  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isInView, galleryImages.length]);

  const getCardStyle = (index) => {
    const diff = index - currentIndex;
    const normalizedDiff = ((diff + galleryImages.length) % galleryImages.length);
    const position = normalizedDiff > galleryImages.length / 2 
      ? normalizedDiff - galleryImages.length 
      : normalizedDiff;

    if (position === 0) return { transform: 'translateX(0%) scale(1.2) rotateY(0deg) translateZ(0px)', opacity: 1, zIndex: 50 };
    else if (position === 1) return { transform: 'translateX(80%) scale(0.85) rotateY(-35deg) translateZ(-150px)', opacity: 0.8, zIndex: 40 };
    else if (position === 2) return { transform: 'translateX(140%) scale(0.65) rotateY(-45deg) translateZ(-300px)', opacity: 0.5, zIndex: 30 };
    else if (position === -1) return { transform: 'translateX(-80%) scale(0.85) rotateY(35deg) translateZ(-150px)', opacity: 0.8, zIndex: 40 };
    else if (position === -2) return { transform: 'translateX(-140%) scale(0.65) rotateY(45deg) translateZ(-300px)', opacity: 0.5, zIndex: 30 };
    else return { transform: 'translateX(200%) scale(0.3) rotateY(-60deg) translateZ(-500px)', opacity: 0, zIndex: 10 };
  };

  return (
    <section 
      ref={sectionRef}
      className="relative w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-6 md:py-6 overflow-hidden"
    >
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>

      <div className="absolute top-0 left-0 w-24 h-24 md:w-32 md:h-32 z-20">
        <Image src="/goldencorner.jpg" alt="Corner decoration" fill className="object-contain" priority />
      </div>
      <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 z-20 rotate-90">
        <Image src="/goldencorner.jpg" alt="Corner decoration" fill className="object-contain" priority />
      </div>
      <div className="absolute bottom-0 left-0 w-24 h-24 md:w-32 md:h-32 z-20 -rotate-90">
        <Image src="/goldencorner.jpg" alt="Corner decoration" fill className="object-contain" priority />
      </div>
      <div className="absolute bottom-0 right-0 w-24 h-24 md:w-32 md:h-32 z-20 rotate-180">
        <Image src="/goldencorner.jpg" alt="Corner decoration" fill className="object-contain" priority />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-purple-400"></div>
            <span className="text-purple-300 text-sm font-semibold tracking-widest uppercase">Memories</span>
            <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-purple-400"></div>
          </div>
          <h2 className={`${playfair.className} text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3`}>
            Festival Gallery
          </h2>
          <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
            Relive the vibrant moments from Raja Festival 2025
          </p>
        </div>

        {/* 3D Coverflow Gallery — shorter on mobile */}
        <div className="relative h-[260px] sm:h-[340px] md:h-[400px] mb-8">
          <div className="gallery-container">
            {galleryImages.map((image, index) => {
              const style = getCardStyle(index);
              const isCenterCard = ((index - currentIndex + galleryImages.length) % galleryImages.length) === 0;

              return (
                <div
                  key={index}
                  className="gallery-card"
                  style={{ transform: style.transform, opacity: style.opacity, zIndex: style.zIndex }}
                >
                  <div className={`card-inner ${isCenterCard ? 'center-card' : ''}`}>
                    <Image
                      src={image.src}
                      alt={image.title}
                      fill
                      className="object-cover"
                      priority={index < 3}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                    {isCenterCard && (
                      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
                        <span className="text-xs font-bold text-purple-300 mb-1 block tracking-wider uppercase">
                          {image.year}
                        </span>
                        <h3 className={`${cinzel.className} text-base md:text-xl lg:text-2xl font-semibold drop-shadow-lg`}>
                          {image.title}
                        </h3>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center gap-2 mb-4 md:mb-8">
          {galleryImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'w-8 h-2 md:w-12 md:h-3 bg-gradient-to-r from-purple-500 to-pink-500'
                  : 'w-3 h-3 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="flex justify-center">
          <button className="group relative inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/50 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative flex items-center gap-2">
              <span className={`${cinzel.className} text-sm md:text-base`}>View Full Gallery</span>
              <svg className="w-4 h-4 md:w-5 md:h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent"></div>

      <style jsx>{`
        .gallery-container {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 2000px;
        }

        .gallery-card {
          position: absolute;
          width: 320px;
          height: 330px;
          transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
        }

        /* ↓ Reduced height on mobile */
        @media (max-width: 640px) {
          .gallery-card {
            width: 200px;
            height: 210px;
          }
        }

        @media (min-width: 641px) and (max-width: 768px) {
          .gallery-card {
            width: 240px;
            height: 260px;
          }
        }

        .card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          transition: all 0.5s ease;
        }

        .card-inner.center-card {
          box-shadow: 0 35px 60px -15px rgba(168, 85, 247, 0.6);
        }

        .card-inner:hover {
          box-shadow: 0 35px 60px -15px rgba(168, 85, 247, 0.8);
        }
      `}</style>
    </section>
  );
};

export default GallerySection;