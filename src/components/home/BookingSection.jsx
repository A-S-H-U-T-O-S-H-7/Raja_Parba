import Link from "next/link";
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

function BookingSection({ user }) {
  return (
    <>
      

      {/* Why Book Online Section */}
      <section className="relative py-12 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `radial-gradient(circle, #dc2626 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <h3 className={`${playfair.className} text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-2 text-red-900 animate-fade-in-up`}>
            Why Book Online?
          </h3>
          
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent mx-auto mb-8"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="group text-center p-5 rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-red-200 transform hover:-translate-y-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="text-5xl mb-3 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                ⛺
              </div>
              <h4 className={`${cinzel.className} font-semibold text-lg mb-2 text-gray-900`}>
                Select Your Stall
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Choose from food, crafts, or business stalls easily.
              </p>
              <div className="w-12 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto mt-3 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300"></div>
            </div>

            {/* Card 2 */}
            <div className="group text-center p-5 rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-green-200 transform hover:-translate-y-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-5xl mb-3 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                🎤
              </div>
              <h4 className={`${cinzel.className} font-semibold text-lg mb-2 text-gray-900`}>
                Reserve Show Slots
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Book performance timing for dance, music & cultural acts.
              </p>
              <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-teal-500 mx-auto mt-3 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300"></div>
            </div>

            {/* Card 3 */}
            <div className="group text-center p-5 rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="text-5xl mb-3 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                💳
              </div>
              <h4 className={`${cinzel.className} font-semibold text-lg mb-2 text-gray-900`}>
                Secure Payment
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Safe and quick online payment with instant confirmation.
              </p>
              <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-3 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300"></div>
            </div>

            {/* Card 4 */}
            <div className="group text-center p-5 rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-purple-200 transform hover:-translate-y-2 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="text-5xl mb-3 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                📩
              </div>
              <h4 className={`${cinzel.className} font-semibold text-lg mb-2 text-gray-900`}>
                Instant Confirmation
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Get email confirmation and booking details immediately.
              </p>
              <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-3 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300"></div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </>
  );
}

export default BookingSection;