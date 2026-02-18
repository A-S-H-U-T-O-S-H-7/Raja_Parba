"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Sparkles, Camera, Users } from 'lucide-react';

const CardSection = () => {
  const cards = [
    {
      title: "About Raja Parba",
      description: "Celebrating the divine womanhood and the rhythm of monsoon, where every heart dances with joy and traditions come alive.",
      link: "about-raja",
      linkText: "Learn More",
      image: "/aboutraja1.png",
      icon: Heart
    },
    {
      title: "Event Highlights",
      description: "From colorful swings to melodious folk songs, immerse yourself in the vibrant celebrations that touch your soul.",
      link: "#",
      linkText: "View Events",
      image: "/eventhighlight1.png",
      icon: Sparkles
    },
    {
      title: "Photo Gallery",
      description: "Precious moments frozen in time, capturing the laughter, colors, and traditions of this beautiful festival.",
      link: "#",
      linkText: "View Photos",
      image: "/raja-gallery.png",
      icon: Camera
    },
    {
      title: "Our Guests",
      description: "Welcoming honored souls who grace our celebration and make this festival even more memorable.",
      link: "#",
      linkText: "Meet Our Guests",
      image: "/guestbanner.png",
      icon: Users
    }
  ];

  // Floating hearts animation data
  const floatingHearts = [...Array(8)].map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 5,
    size: Math.floor(Math.random() * 24) + 16, // 16-40px
    duration: Math.floor(Math.random() * 8) + 8, // 8-16s
    startY: Math.random() * 100 
  }));

  // Create flower border pattern (repeating)
  const flowerBorderPattern = [...Array(12)].map((_, i) => ({
    id: i,
    left: `${(i * 8.33)}%`, // Distribute evenly (100/12 ≈ 8.33%)
    delay: i * 0.2,
    size: Math.random() * 10 + 20, // 20-30px
  }));

  return (
    <>
    <div className='bg-linear-to-br from-rose-200 via-amber-50 to-rose-200 '>
    {/* Top Flower Border */}
      {/* <div 
        className="w-full mt-[-6px] h-8 sm:h-12 bg-repeat-x bg-center"
        style={{
          backgroundImage: 'url(/meriborder.png)',
          backgroundSize: 'auto 100%'
        }}
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      ></div> */}
    <section className="relative w-full py-4 md:py-16 px-2 md:px-16 overflow-hidden">

      

      {/* Artistic Background Elements */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        {/* Floral branch pattern - top left */}
        <div className="absolute top-10 left-10 w-48 h-48 opacity-30">
          <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M40,120 Q60,80 90,95 Q120,110 140,80 Q160,50 150,20" stroke="#B31B1B" strokeWidth="2" strokeOpacity="0.3" fill="none"/>
            <circle cx="148" cy="25" r="5" fill="#B31B1B" fillOpacity="0.3"/>
            <circle cx="135" cy="75" r="4" fill="#FFA500" fillOpacity="0.3"/>
            <circle cx="95" cy="100" r="6" fill="#B31B1B" fillOpacity="0.3"/>
            <circle cx="45" cy="115" r="4" fill="#FFA500" fillOpacity="0.3"/>
          </svg>
        </div>

        {/* Floral branch pattern - bottom right */}
        <div className="absolute bottom-10 right-10 w-48 h-48 opacity-30 rotate-180">
          <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M40,120 Q60,80 90,95 Q120,110 140,80 Q160,50 150,20" stroke="#B31B1B" strokeWidth="2" strokeOpacity="0.3" fill="none"/>
            <circle cx="148" cy="25" r="5" fill="#B31B1B" fillOpacity="0.3"/>
            <circle cx="135" cy="75" r="4" fill="#FFA500" fillOpacity="0.3"/>
            <circle cx="95" cy="100" r="6" fill="#B31B1B" fillOpacity="0.3"/>
            <circle cx="45" cy="115" r="4" fill="#FFA500" fillOpacity="0.3"/>
          </svg>
        </div>

        {/* Floating Hearts - Now visible */}
        {floatingHearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="absolute"
            style={{
              left: heart.left,
              top: `${heart.startY}vh`,
              zIndex: 1,
            }}
            animate={{
              y: [null, '-100vh'],
              x: [0, Math.sin(heart.id) * 50, 0],
              rotate: [0, 360],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              y: {
                duration: heart.duration,
                repeat: Infinity,
                ease: "linear",
                delay: heart.delay,
              },
              x: {
                duration: heart.duration / 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: heart.delay,
              },
              rotate: {
                duration: heart.duration,
                repeat: Infinity,
                ease: "linear",
                delay: heart.delay,
              },
              opacity: {
                duration: heart.duration,
                repeat: Infinity,
                ease: "linear",
                delay: heart.delay,
                times: [0, 0.3, 1],
              },
            }}
          >
            <Heart 
              size={heart.size} 
              className="text-rose-400/40 fill-rose-400/40" 
              strokeWidth={1.5}
            />
          </motion.div>
        ))}

        {/* Decorative small flowers with animation */}
        <div className="absolute top-1/4 right-1/4">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8" r="3" fill="#FFA500" fillOpacity="0.2"/>
              <circle cx="8" cy="12" r="3" fill="#FFA500" fillOpacity="0.2"/>
              <circle cx="16" cy="12" r="3" fill="#FFA500" fillOpacity="0.2"/>
              <circle cx="12" cy="16" r="3" fill="#FFA500" fillOpacity="0.2"/>
            </svg>
          </motion.div>
        </div>

        <div className="absolute bottom-1/3 left-1/4">
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -15, 15, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8" r="4" fill="#B31B1B" fillOpacity="0.2"/>
              <circle cx="8" cy="12" r="4" fill="#B31B1B" fillOpacity="0.2"/>
              <circle cx="16" cy="12" r="4" fill="#B31B1B" fillOpacity="0.2"/>
              <circle cx="12" cy="16" r="4" fill="#B31B1B" fillOpacity="0.2"/>
            </svg>
          </motion.div>
        </div>
      </div>

      <div className="max-w-8xl mx-auto relative" style={{ zIndex: 10 }}>
        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6">
          {cards.map((card, index) => {
            const IconComponent = card.icon;
            
            return (
              <div 
                key={index}
                className="relative bg-linear-to-br from-yellow-100 via-amber-50 to-yellow-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-amber-400"
              >
                {/* Blue Corner Design - positioned at bottom-right corner */}
                <div className="absolute bottom-0 right-[-12px] md:right-[-18px] w-25 h-25 md:w-35 md:h-35 z-10">
                  <Image
                    src="/bluecorner1.png"
                    alt="corner design"
                    fill
                    className="object-contain transform"
                  />
                </div>

                {/* Image Container */}
                <div className="relative w-full h-48 overflow-hidden">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                {/* Content Container */}
                <div className="p-2 md:p-4 relative bg-white/30 backdrop-blur-[2px]">
                  {/* Title - Changed to stylish Devanagari-style font */}
                  <h3 className="text-lg md:text-xl text-center font-bold text-[#B31B1B] mb-3" 
                      style={{ 
                        fontFamily: "'Poppins', 'Nirmala UI', 'Segoe UI', sans-serif",
                        fontWeight: 600,
                        letterSpacing: "0.5px",
                        textTransform: "uppercase",
                        textShadow: "1px 1px 2px rgba(0,0,0,0.1)"
                      }}>
                    {card.title}
                  </h3>
               
                  {/* Description - 2 lines with heart-touching content */}
                  <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-4 line-clamp-2">
                    {card.description}
                  </p>
                  
                  {/* Divider Line */}
                  <div className="w-full h-px bg-gray-200 my-4"></div>
                  
                  {/* Button with Lucide icon - Enhanced colors */}
                  <div className='flex justify-center'>
                    <Link 
                      href={card.link}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 px-4 py-2 rounded-md text-white font-medium text-sm hover:from-orange-500 hover:to-orange-700 transition-all duration-300 shadow-md hover:shadow-lg group"
                    >
                      <IconComponent size={16} className="group-hover:scale-110 transition-transform duration-300" />
                      <span>{card.linkText}</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      
    </section>
    <div 
        className="w-full  h-8  bg-repeat-x  bg-center"
        style={{
          backgroundImage: 'url(/pinkborder.png)',
          backgroundSize: 'auto 100%'
        }}
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      ></div>
    </div>
    </>
  );
};

export default CardSection;