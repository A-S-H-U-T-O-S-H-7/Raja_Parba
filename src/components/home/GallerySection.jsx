// components/home/GallerySection.jsx (UPDATE)
"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Playfair_Display, Cinzel } from 'next/font/google';
import { db } from '@/lib/firebase/config';
import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import Link from 'next/link';

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
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);

  useEffect(() => {
    const fetchShowcaseImages = async () => {
      const normalizeDocs = (snapshot) => {
        const seen = new Set();
        return snapshot.docs
          .map((doc) => {
            const data = doc.data();
            const imageUrl = (data.url || data.imageUrl || data.downloadURL || '').trim();
            return {
              id: doc.id,
              ...data,
              imageUrl,
            };
          })
          .filter((item) => item.imageUrl && !seen.has(item.id) && seen.add(item.id));
      };

      try {
        const q = query(
          collection(db, 'gallery'),
          where('showcase', '==', true),
          orderBy('order', 'asc'),
          orderBy('createdAt', 'desc'),
          limit(20)
        );
        const snapshot = await getDocs(q);
        let fetchedImages = normalizeDocs(snapshot);

        // Fallback for legacy docs or if showcase query returns only invalid URLs.
        if (fetchedImages.length === 0) {
          const fallbackQ = query(
            collection(db, 'gallery'),
            orderBy('createdAt', 'desc'),
            limit(20)
          );
          const fallbackSnapshot = await getDocs(fallbackQ);
          fetchedImages = normalizeDocs(fallbackSnapshot);
        }

        setImages(fetchedImages);
      } catch (error) {
        console.error('Error fetching showcase images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShowcaseImages();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsInView(true); },
      { threshold: 0.15, rootMargin: '120px 0px' }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
  }, []);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 2600);
    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    if (currentIndex >= images.length) {
      setCurrentIndex(0);
    }
  }, [images.length, currentIndex]);

  const getCardStyle = (index) => {
    const diff = index - currentIndex;
    const normalizedDiff = ((diff + images.length) % images.length);
    const position = normalizedDiff > images.length / 2 
      ? normalizedDiff - images.length 
      : normalizedDiff;

    if (position === 0) return { transform: 'translateX(0%) scale(1.2) rotateY(0deg) translateZ(0px)', opacity: 1, zIndex: 50 };
    else if (position === 1) return { transform: 'translateX(80%) scale(0.85) rotateY(-35deg) translateZ(-150px)', opacity: 0.8, zIndex: 40 };
    else if (position === 2) return { transform: 'translateX(140%) scale(0.65) rotateY(-45deg) translateZ(-300px)', opacity: 0.5, zIndex: 30 };
    else if (position === -1) return { transform: 'translateX(-80%) scale(0.85) rotateY(35deg) translateZ(-150px)', opacity: 0.8, zIndex: 40 };
    else if (position === -2) return { transform: 'translateX(-140%) scale(0.65) rotateY(45deg) translateZ(-300px)', opacity: 0.5, zIndex: 30 };
    else return { transform: 'translateX(200%) scale(0.3) rotateY(-60deg) translateZ(-500px)', opacity: 0, zIndex: 10 };
  };

  if (loading) {
    return (
      <section className="relative w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return null; // Don't show section if no showcase images
  }

  return (
    <section 
      ref={sectionRef}
      className="relative w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-6 md:py-6 overflow-hidden"
    >
      {/* ... rest of your existing JSX (same as your current GallerySection) ... */}
      {/* Replace the static galleryImages with the dynamic 'images' state */}
      
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
            Relive the vibrant moments from Raja Festival
          </p>
        </div>

        {/* 3D Coverflow Gallery */}
        <div className="relative h-[260px] sm:h-[340px] md:h-[400px] mb-8">
          <div className="gallery-container">
            {images.map((image, index) => {
              const style = getCardStyle(index);
              const isCenterCard = index === currentIndex;

              return (
                <div
                  key={image.id}
                  className="gallery-card"
                  style={{ transform: style.transform, opacity: style.opacity, zIndex: style.zIndex }}
                >
                  <div className={`card-inner ${isCenterCard ? 'center-card' : ''}`}>
                    <Image
                      src={image.imageUrl}
                      alt={image.title || 'Festival moment'}
                      fill
                      className="object-cover"
                      priority={index < 3}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                    {isCenterCard && (
                      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
                        <h3 className={`${cinzel.className} text-base md:text-xl lg:text-2xl font-semibold drop-shadow-lg`}>
                          {image.title || 'Raja Festival Moment'}
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
          {images.map((_, index) => (
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
          <Link href="/gallery" className="group relative inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/50 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative flex items-center gap-2">
              <span className={`${cinzel.className} text-sm md:text-base`}>View Full Gallery</span>
              <svg className="w-4 h-4 md:w-5 md:h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Link>
        </div>
      </div>

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
