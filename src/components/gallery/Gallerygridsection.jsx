// app/gallery/page.jsx (UPDATE)
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { db } from '@/lib/firebase/config';
import { collection, query, orderBy, getDocs, limit, startAfter } from 'firebase/firestore';

const PAGE_SIZE = 24;

// Lightbox Component (keep as is)
function Lightbox({ img, images, onClose, onNav }) {
  const idx = images.findIndex((i) => i.id === img.id);

  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && idx > 0) onNav(idx - 1);
      if (e.key === "ArrowRight" && idx < images.length - 1) onNav(idx + 1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [idx, images.length, onClose, onNav]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/90 backdrop-blur-xl"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-lg border border-amber-400/40 text-amber-400 bg-amber-400/10 hover:bg-amber-400/20 transition-colors"
      >
        ✕
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full px-4 py-1.5 bg-amber-400/10 border border-amber-400/25">
        <span className="text-amber-400 text-xs tracking-widest">
          {idx + 1} / {images.length}
        </span>
      </div>

      {/* Prev */}
      <button
        onClick={(e) => { e.stopPropagation(); if (idx > 0) onNav(idx - 1); }}
        disabled={idx === 0}
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center text-2xl border border-amber-400/30 text-amber-400 bg-amber-400/10 disabled:opacity-20 hover:bg-amber-400/20 transition-colors"
      >
        ‹
      </button>

      {/* Next */}
      <button
        onClick={(e) => { e.stopPropagation(); if (idx < images.length - 1) onNav(idx + 1); }}
        disabled={idx === images.length - 1}
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center text-2xl border border-amber-400/30 text-amber-400 bg-amber-400/10 disabled:opacity-20 hover:bg-amber-400/20 transition-colors"
      >
        ›
      </button>

      {/* Polaroid frame */}
      <motion.div
        key={img.id}
        initial={{ opacity: 0, scale: 0.93, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white p-2.5 pb-14 shadow-2xl mx-auto max-w-xl">
          <div className="relative w-full bg-amber-50 overflow-hidden" style={{ height: "clamp(240px, 52vh, 500px)" }}>
            <Image src={img.url} alt={img.title || 'Gallery image'} fill className="object-contain" />
          </div>
          <div className="flex items-center justify-center h-14">
            <p className="text-sm italic text-amber-900/60 text-center" style={{ fontFamily: "'Lora', serif" }}>
              {img.title || 'Raja Festival Moment'}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Gallery Card Component (keep as is)
function GalleryCard({ img, idx, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: (idx % 24) * 0.018 }}
      className="group relative overflow-hidden cursor-pointer rounded-sm aspect-square bg-amber-100 shadow-sm hover:shadow-lg transition-shadow duration-300"
      onClick={() => onClick(img)}
    >
      <Image
        src={img.url}
        alt={img.title || 'Gallery image'}
        fill
        loading="lazy"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
      />

      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-amber-900/70 via-amber-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Top gold bar */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-amber-400 to-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Label */}
      <p
        className="absolute bottom-0 inset-x-0 px-3 pb-2.5 text-white text-xs italic translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
        style={{ fontFamily: "'Lora', serif" }}
      >
        {img.title || 'Raja Festival Moment'}
      </p>

      {/* Expand */}
      <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-amber-500 text-xs opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 shadow">
        ⤢
      </div>
    </motion.div>
  );
}

// Main Gallery Page
export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [lightboxImg, setLightboxImg] = useState(null);
  const sentinelRef = useRef(null);
  const lastDocRef = useRef(null);
  const isFetchingRef = useRef(false);

  const fetchImages = useCallback(async () => {
    if (isFetchingRef.current || !hasMore) return;
    
    isFetchingRef.current = true;
    setLoading(true);
    try {
      let q = query(
        collection(db, 'gallery'),
        orderBy('order', 'asc'),
        orderBy('createdAt', 'desc'),
        limit(PAGE_SIZE)
      );

      if (lastDocRef.current) {
        q = query(q, startAfter(lastDocRef.current));
      }

      const snapshot = await getDocs(q);
      const newImages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      if (snapshot.docs.length > 0) {
        lastDocRef.current = snapshot.docs[snapshot.docs.length - 1];
      }

      setImages(prev => {
        const seen = new Set(prev.map((item) => item.id));
        const merged = [...prev];
        newImages.forEach((item) => {
          if (!seen.has(item.id)) {
            seen.add(item.id);
            merged.push(item);
          }
        });
        return merged;
      });
      setHasMore(snapshot.docs.length === PAGE_SIZE);
      
      // Get total count (you might want a separate count query)
      if (total === 0) {
        const countSnapshot = await getDocs(collection(db, 'gallery'));
        setTotal(countSnapshot.size);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, [hasMore, total]);

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) fetchImages(); },
      { rootMargin: "400px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [fetchImages]);

  const handleNav = useCallback((i) => {
    if (i >= 0 && i < images.length) setLightboxImg(images[i]);
  }, [images]);

  return (
    <main>
      
      <section className="bg-amber-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-3 sm:px-5 py-8">

          {/* Count */}
          <div className="mb-5 flex items-center justify-between flex-wrap gap-3">
            <p className="text-sm text-amber-800/60">
              <span className="text-amber-600 font-semibold">{images.length}</span>
              {" "}of{" "}
              <span className="text-amber-600 font-semibold">{total}</span>
              {" "}moments
            </p>
            <p className="text-xs tracking-widest uppercase text-amber-400">
              Scroll to discover more ↓
            </p>
          </div>

          {/* Grid — 2 col mobile, 3 tablet, 4 desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
            {images.map((img, idx) => (
              <GalleryCard key={img.id} img={img} idx={idx} onClick={setLightboxImg} />
            ))}
          </div>

          {/* Sentinel */}
          <div ref={sentinelRef} className="mt-10 flex justify-center items-center h-16">
            {loading && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 rounded-full border-2 border-amber-200 border-t-amber-500"
              />
            )}
            {!hasMore && images.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-full px-6 py-2.5 bg-amber-100 border border-amber-300"
              >
                <span>🎊</span>
                <p className="text-sm italic text-amber-700" style={{ fontFamily: "'Lora', serif" }}>
                  You've seen all {total} moments — what a celebration!
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {lightboxImg && (
          <Lightbox
            img={lightboxImg}
            images={images}
            onClose={() => setLightboxImg(null)}
            onNav={handleNav}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
