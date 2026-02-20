"use client";

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

const ExperienceSection = () => {
  const experiences = [
    {
      title: "Raja Swing & Games",
      description: "Experience the joy of traditional swings and participate in festive games",
      image: "/raja-swing.png"
    },
    
    {
      title: "Pitha & Delicacies",
      description: "Savor authentic Odia delicacies and traditional sweet pithas",
      image: "/pitha-delicacies.png"
    },
    {
      title: "Dance & Music",
      description: "Immerse yourself in the vibrant folk dances and melodious music",
      image: "/raja-celebration.png"
    },
    
  ];

  return (
    <>
<section className="relative w-full min-h-[300px] bg-gradient-to-b from-green-800/90 to-green-900/90 overflow-x-clip overflow-y-visible">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/greenbg1.png"
            alt="Festive background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-green-800/70 to-green-900/80 mix-blend-multiply"></div>
        </div>
        
        {/* Top border */}
        <div 
          className="absolute w-full h-4 rotate-180 mt-[-1px] bg-repeat-x bg-center"
          style={{
            backgroundImage: 'url(/goldenborder.png)',
            backgroundSize: 'auto 100%'
          }}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        ></div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-amber-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl"></div>
        
        {/* Content Container */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          {/* Header with Decorative Underline */}
          <div className="text-center mb-8 md:mb-10">
            <h2 className={`${playfair.className} text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg`}>
              Experience the Festivities!
            </h2>
            <div className="flex items-center justify-center gap-2">
              <div className="w-12 h-0.5 bg-amber-300 rounded-full"></div>
              <div className="w-20 h-1 bg-amber-400 rounded-full"></div>
              <div className="w-12 h-0.5 bg-amber-300 rounded-full"></div>
            </div>
          </div>

          {/* Experience Cards */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 lg:gap-8">
            {experiences.map((experience, index) => (
              <div 
                key={index}
                className="group flex-1 flex flex-col items-center text-center transform transition-all duration-300 hover:-translate-y-2"
              >
                {/* Image Circle with Hover Effect */}
                <div className="relative mb-4">
                  <div className="w-28 h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 p-1.5 shadow-xl shadow-black/20 group-hover:shadow-2xl group-hover:shadow-amber-400/30 transition-all duration-300">
                    <div className="relative w-full h-full rounded-full bg-white overflow-hidden">
                      <Image
                        src={experience.image}
                        alt={experience.title}
                        fill
                        className="object-contain transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  {/* Decorative Ring Animation */}
                  <div className="absolute inset-0 rounded-full border-2 border-amber-300/50 opacity-0 group-hover:opacity-100 scale-110 group-hover:scale-125 transition-all duration-500"></div>
                </div>

                {/* Text Content with Enhanced Design */}
                <div className="bg-white/95 max-w-[300px] backdrop-blur-md rounded-xl px-2 py-1 shadow-xl border border-amber-200/50 hover:border-amber-300 transition-all duration-300 w-full">
                  <h3 className={`${cinzel.className} text-base md:text-lg font-bold text-green-800 mb-1 group-hover:text-amber-700 transition-colors duration-300`}>
                    {experience.title}
                  </h3>
                  <p className="text-gray-700 text-xs md:text-sm leading-relaxed">
                    {experience.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Decorative Pattern */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"></div>
        </div>

        {/* Floating Particles Effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-amber-300/40 rounded-full animate-pulse"></div>
          <div className="absolute top-3/4 right-1/3 w-3 h-3 bg-amber-400/30 rounded-full animate-pulse delay-700"></div>
          <div className="absolute bottom-1/4 right-1/4 w-1.5 h-1.5 bg-amber-200/40 rounded-full animate-pulse delay-300"></div>
        </div>

        {/* Corner Design - Fixed to overlap outside */}
        <div className="absolute bottom-[-30px] left-[-15px] md:bottom-[-60px] md:left-[-50px] w-32 h-32 md:w-72 md:h-72 z-20">
          <Image
            src="/greencorner.png"
            alt="corner design"
            fill
            className="object-contain transform "
          />
        </div>
        <div className="absolute   bottom-[-30px] right-[-15px] md:bottom-[-60px] md:right-[-50px] w-32 h-32 md:w-72 md:h-72 z-20">
          <Image
            src="/greencorner.png"
            alt="corner design"
            fill
            className="object-contain scale-x-[-1] transform "
          />
        </div>
      </section>
    </>
  );
};

export default ExperienceSection;