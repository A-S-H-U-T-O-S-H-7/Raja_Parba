"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ArrowLeft } from "lucide-react";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const router = useRouter();

  const faqs = [
    {
      question: "What is Raja Parba 2026?",
      answer:
        "Raja Parba 2026 is a grand Odia cultural celebration honoring womanhood and tradition. The festival will be celebrated from 13th June to 15th June 2026 with music, dance, melody programs, drawing competitions, award ceremony, and celebrity appearances."
    },
    {
      question: "Where is the event venue?",
      answer:
        "The event will take place at Ram Leela Ground, Sector 21A, Noida, Uttar Pradesh."
    },
    {
      question: "Is entry free?",
      answer:
        "Yes, entry is FREE for all visitors."
    },
    {
      question: "Is a pass required for entry?",
      answer:
        "Yes, entry is free but a mandatory entry pass is required. Visitors must book their free pass from the website."
    },
    {
      question: "How will I receive my entry pass?",
      answer:
        "After booking your free pass online, a QR code will be generated in your profile section. You must show this QR code at the entry gate for verification."
    },
    {
      question: "Are show seats free?",
      answer:
        "General entry is free. However, reserved show seating has a separate price. You can check pricing and availability in the 'Book Your Show' section."
    },
    {
      question: "What activities will happen during the festival?",
      answer:
        "The celebration includes drawing competition, award ceremony, traditional music, dance performances, melody shows, Raja swing activities, and celebrity guest appearances."
    },
    {
      question: "Is participation in performances free?",
      answer:
        "Yes, participation in cultural performances and competitions is free. Prior registration through the website is required."
    },
    {
      question: "What is the stall booking price?",
      answer:
        "Currently, stall booking starts from ₹5000. Prices may change depending on stall category and availability."
    },
    {
      question: "Will food be provided by the organizers?",
      answer:
        "No, food will not be provided by the organizers. However, multiple food stalls will be available at the venue."
    },
    {
      question: "How can I contact the organizers?",
      answer:
        "You can contact us at 0120-4348458 or +91 730 339 7090 for any inquiries."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#FFF6ED] via-[#FDE6D6] to-[#FAD2C3] py-12 px-4 sm:px-6 lg:px-8">

      {/* Mandala Background (add mandala.png inside public folder) */}
      <div className="absolute inset-0 bg-[url('/mandala.png')] bg-center bg-no-repeat bg-contain opacity-5 pointer-events-none"></div>

      <div className="relative max-w-6xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center text-red-700 hover:text-red-900 transition-colors font-medium"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-red-700 to-red-500 rounded-2xl p-8 shadow-xl mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Raja Parba 2026 – FAQs
          </h1>
          <p className="text-red-100 mt-2">
            13th June – 15th June 2026
          </p>
          <p className="text-red-100 text-sm mt-1">
            Ram Leela Ground, Sector 21A, Noida
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-5">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 border border-red-100"
            >
              <div
                className="flex justify-between items-center p-5 cursor-pointer"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                  {faq.question}
                </h3>

                <div className="text-red-600">
                  {activeIndex === index ? (
                    <Minus size={20} />
                  ) : (
                    <Plus size={20} />
                  )}
                </div>
              </div>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  activeIndex === index
                    ? "max-h-96 opacity-100 px-5 pb-5"
                    : "max-h-0 opacity-0 px-5"
                }`}
              >
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Text */}
        <p className="text-center mt-12 font-medium text-red-700">
          Raja Parba Organizing Team
        </p>
      </div>
    </div>
  );
};

export default FAQ;