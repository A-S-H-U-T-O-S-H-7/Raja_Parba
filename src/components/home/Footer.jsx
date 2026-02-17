import React from 'react';
import { Facebook, Twitter, Youtube, Calendar, Images, Users, Star, Mic, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
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

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full relative overflow-x-clip">

     

      {/* Corner Designs - Fixed positioning to prevent scrollbar */}
      <div className="absolute top-[-70px] left-[-20px] md:left-[-50px] w-32 h-32 md:w-48 md:h-48 z-20 pointer-events-none">
        <Image
          src="/footercorner.png"
          alt="corner design"
          fill
          className="object-contain object-left-top"
          priority={false}
        />
      </div>
      
      <div className="absolute top-[-70px] right-[-20px] md:right-[-50px] w-32 h-32 md:w-48 md:h-48 z-20 pointer-events-none">
        <Image
          src="/footercorner.png"
          alt="corner design"
          fill
          className="object-contain object-right-top transform scale-x-[-1]"
          priority={false}
        />
      </div>

      

      {/* Main Footer Section */}
      <div 
        className="bg-cover bg-center bg-no-repeat text-gray-300 relative z-10"
        style={{
          backgroundImage: "url('/greenbg2.png')",
        }}
      >
         <div 
          className="absolute w-full h-8 mt-[-15] rotate-180 z-10 bg-repeat-x bg-center"
          style={{
            backgroundImage: 'url(/footerborder.png)',
            backgroundSize: 'auto 100%'
          }}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        ></div>
        {/* Overlay for better text readability */}
        <div className="bg-gradient-to-b from-green-900/90 to-green-950/90 backdrop-blur-[2px]">
          <div className="container mx-auto px-4 py-8 relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-6 md:gap-8 mb-2">
            
              {/* Company Logo and About - Takes 2 columns on large screens */}
              <div className="lg:col-span-2 space-y-4">
                {/* Logo - Fixed size issue */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative w-48 h-16 md:w-56 md:h-20">
                    <img 
                      src="/header-logo.png" 
                      alt="Samudayik Vikas Samiti Logo" 
                      className="object-contain w-full h-full"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <span className={`${cinzel.className} text-white font-bold text-lg md:text-xl hidden absolute inset-0 flex items-center`}>SVS</span>
                  </div>
                </div>
                
                {/* About Company - Enhanced typography */}
                <div>
                  <h4 className={`${playfair.className} text-xl md:text-2xl font-bold text-white relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-16 after:bg-amber-500 mb-4`}>
                    About Us
                  </h4>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    <span className="font-semibold text-amber-300">
                      The Samudayik Vikas Samiti
                    </span>{" "}
                    is a registered society under societies registration act XXI, 1860, 
                    registered on dated 16th March 1999 to promote, facilitate, conduct and co-ordinate social 
                    actions/programs for the emancipation and uplift of the weaker sections particularly those 
                    socially challenged.
                  </p>
                </div>

                {/* Social Media */}
                <div className="mt-6">
                  <p className={`${cinzel.className} text-sm font-medium mb-3 text-gray-200`}>
                    Follow Us
                  </p>
                  <div className="flex gap-4">
                    <a 
                      href="https://www.facebook.com/svsindia/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center bg-amber-500 p-2 rounded-full hover:bg-amber-600 transition-colors duration-300 group shadow-lg hover:shadow-amber-500/30"
                      style={{ width: "46px", height: "46px" }}
                    >
                      <Facebook size={20} className="text-white" />
                    </a>
                    <a 
                      href="https://x.com/svsamiti" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center bg-amber-500 p-2 rounded-full hover:bg-amber-600 transition-colors duration-300 group shadow-lg hover:shadow-amber-500/30"
                      style={{ width: "46px", height: "46px" }}
                    >
                      <Twitter size={20} className="text-white" />
                    </a>
                    <a 
                      href="https://www.youtube.com/channel/UCLS9IOa-Gkh0PTGD81givxA?view_as=subscriber" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center bg-amber-500 p-2 rounded-full hover:bg-amber-600 transition-colors duration-300 group shadow-lg hover:shadow-amber-500/30"
                      style={{ width: "46px", height: "46px" }}
                    >
                      <Youtube size={20} className="text-white" />
                    </a>
                  </div>
                </div>
              </div>

              {/* NEW COLUMN 1: Raja Mahotsav Links - Enhanced typography */}
              <div className="space-y-4">
                <h4 className={`${playfair.className} text-lg font-bold text-white relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-16 after:bg-amber-500`}>
                  Raja Mahotsav
                </h4>
                <div className="space-y-3">
                  <Link href="/about-raja" className="flex items-center gap-2 text-gray-200 text-sm lg:text-base hover:text-amber-300 hover:translate-x-1 transition-all duration-300 group">
                    <Calendar size={16} className="text-amber-400 group-hover:scale-110 transition-transform" />
                    <span>About Raja</span>
                  </Link>
                  <Link href="/gallery" className="flex items-center gap-2 text-gray-200 text-sm lg:text-base hover:text-amber-300 hover:translate-x-1 transition-all duration-300 group">
                    <Images size={16} className="text-amber-400 group-hover:scale-110 transition-transform" />
                    <span>Gallery</span>
                  </Link>
                  <Link href="/events" className="flex items-center gap-2 text-gray-200 text-sm lg:text-base hover:text-amber-300 hover:translate-x-1 transition-all duration-300 group">
                    <Calendar size={16} className="text-amber-400 group-hover:scale-110 transition-transform" />
                    <span>Events</span>
                  </Link>
                  <Link href="/our-guests" className="flex items-center gap-2 text-gray-200 text-sm lg:text-base hover:text-amber-300 hover:translate-x-1 transition-all duration-300 group">
                    <Users size={16} className="text-amber-400 group-hover:scale-110 transition-transform" />
                    <span>Our Guests</span>
                  </Link>
                  <Link href="/sponsor" className="flex items-center gap-2 text-gray-200 text-sm lg:text-base hover:text-amber-300 hover:translate-x-1 transition-all duration-300 group">
                    <Star size={16} className="text-amber-400 group-hover:scale-110 transition-transform" />
                    <span>Become a Sponsor</span>
                  </Link>
                  <Link href="/performer" className="flex items-center gap-2 text-gray-200 text-sm lg:text-base hover:text-amber-300 hover:translate-x-1 transition-all duration-300 group">
                    <Mic size={16} className="text-amber-400 group-hover:scale-110 transition-transform" />
                    <span>Join as a Performer</span>
                  </Link>
                </div>
              </div>

              {/* NEW COLUMN 2: Book Now Buttons - Enhanced typography */}
              <div className="space-y-4">
                <h4 className={`${playfair.className} text-lg font-bold text-white relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-16 after:bg-amber-500`}>
                  Book Now
                </h4>
                <div className="space-y-4">
                  <Link 
                    href="/book-stall" 
                    className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-3 px-4 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <ShoppingBag size={20} />
                    Book Your Stall
                  </Link>
                  <Link 
                    href="/book-seat" 
                    className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-armchair"><path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"/><path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0Z"/><path d="M5 18v2"/><path d="M19 18v2"/></svg>
                    Book Your Show 
                  </Link>
                  
                  {/* Decorative element */}
                  <div className="mt-4 p-3 bg-white/10 rounded-lg border border-amber-500/30 backdrop-blur-sm">
                    <p className={`${cinzel.className} text-xs text-amber-200 text-center`}>
                      Limited seats available!<br />Book now to avoid disappointment.
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Details - Enhanced typography */}
              <div className="space-y-4">
                <h4 className={`${playfair.className} text-lg font-bold text-white relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-16 after:bg-amber-500`}>
                  Contact Details
                </h4>
                <div className="space-y-3 text-gray-200">
                  <div className="flex items-start space-x-2">
                    <span className="text-amber-300 font-medium min-w-[60px]">Tel:</span>
                    <span className="text-sm lg:text-base">0120-4348458</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-amber-300 font-medium min-w-[60px]">Phone:</span>
                    <span className="text-sm lg:text-base">+91 730 339 7090</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-amber-300 font-medium min-w-[60px]">Email:</span>
                    <a href="mailto:info@svsamiti.com" className="text-sm lg:text-base hover:text-amber-300 transition-colors">
                      info@svsamiti.com
                    </a>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-amber-300 font-medium min-w-[60px]">Website:</span>
                    <a href="http://www.svsamiti.com" className="text-sm lg:text-base hover:text-amber-300 transition-colors">
                      www.svsamiti.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Addresses - Enhanced typography */}
              <div className="space-y-6">
                {/* Corporate Address */}
                <div>
                  <h4 className={`${playfair.className} text-lg font-bold text-white relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-16 after:bg-amber-500 mb-4`}>
                    Corporate Address
                  </h4>
                  <div className="text-gray-200 text-sm lg:text-base leading-relaxed">
                    <p>C-316 B & C, C Block,</p>
                    <p>Sector 10, Noida,</p>
                    <p>Uttar Pradesh 201301</p>
                  </div>
                </div>

                {/* Registered Address */}
                <div>
                  <h4 className={`${playfair.className} text-lg font-bold text-white relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-16 after:bg-amber-500 mb-4`}>
                    Registered Address
                  </h4>
                  <div className="text-gray-200 text-sm lg:text-base leading-relaxed">
                    <p>A 86/B, 2nd Floor,</p>
                    <p>School Block, Chander Vihar,</p>
                    <p>Delhi-110092</p>
                  </div>
                </div>
              </div>

              {/* Important Links - Enhanced typography */}
              <div className="space-y-4">
                <h4 className={`${playfair.className} text-lg font-bold text-white relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-16 after:bg-amber-500 mb-4`}>
                  Important Links
                </h4>
                <div className="space-y-3">
                  <Link href="/faqs" className="block text-gray-200 text-sm lg:text-base hover:text-amber-300 hover:translate-x-1 transition-all duration-300">
                    FAQs
                  </Link>
                  <Link href="/privacy-policy" className="block text-gray-200 text-sm lg:text-base hover:text-amber-300 hover:translate-x-1 transition-all duration-300">
                    Privacy Policy
                  </Link>
                  <Link href="/terms-and-conditions" className="block text-gray-200 text-sm lg:text-base hover:text-amber-300 hover:translate-x-1 transition-all duration-300">
                    Terms & Conditions
                  </Link>
                  <Link href="/refund-cancel-policy" className="block text-gray-200 text-sm lg:text-base hover:text-amber-300 hover:translate-x-1 transition-all duration-300">
                    Refund & Cancellation Policy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar - Full width before footer image */}
      <div className="w-full bg-gradient-to-r from-red-950 to-red-950 py-2 px-4 text-center relative z-10">
        <p className={`${cinzel.className} text-amber-100 text-sm md:text-base font-medium`}>
          © {currentYear} Samudayik Vikas Samiti. All Rights Reserved.
        </p>
      </div>

      {/* Tribal Border */}
      <div 
        className="relative w-full h-20 bg-repeat-x bg-bottom"
        style={{
          backgroundImage: 'url(/tribalborder.png)',
          backgroundSize: 'auto 100%',
          backgroundPosition: 'bottom'
        }}
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      ></div>
    </footer>
  );
} 

export default Footer;