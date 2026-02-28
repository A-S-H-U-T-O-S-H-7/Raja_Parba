"use client"
import { useRouter } from "next/navigation";
import { ArrowLeft } from 'lucide-react';

export default function TermsAndConditions() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center text-orange-600 hover:text-orange-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl p-6 shadow-lg mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white text-center">
            Terms and Conditions
          </h1>
          <p className="text-orange-100 text-center mt-2">
            Raja Parba 2026
          </p>
          <p className="text-orange-50 text-sm text-center mt-4">
            Event Date: 13th – 15th June 2026
          </p>
          <p className="text-orange-50 text-sm text-center">
            Venue: Ram Leela Ground, Sector 21A, Noida, Uttar Pradesh
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">

          {/* 1 */}
          <Section
            title="1. Introduction"
            content="These Terms and Conditions govern participation in Raja Parba 2026 organized by Samudayik Vikas Samiti (“Organizer”). By booking a pass, reserving a stall, or attending the event, you agree to comply with these terms."
          />

          {/* 2 */}
          <Section
            title="2. Entry & Registration"
            list={[
              "Entry to the event is FREE for all visitors.",
              "A mandatory entry pass must be booked through the official website.",
              "A QR code will be generated in your profile after booking.",
              "Entry will only be allowed upon QR code verification at the venue gate."
            ]}
          />

          {/* 3 */}
          <Section
            title="3. Show Seating"
            list={[
              "General entry is free.",
              "Reserved show seating is paid and pricing is available under 'Book Your Show'.",
              "Seat bookings are subject to availability.",
              "Show seat bookings are non-transferable."
            ]}
          />

          {/* 4 */}
          <Section
            title="4. Stall Booking"
            list={[
              "Stall booking starts from ₹5000 (price subject to change).",
              "Full payment must be completed at the time of booking.",
              "Stall allocation will be done by the Organizer.",
              "Stall fees are non-refundable unless the event is canceled by the Organizer."
            ]}
          />

          {/* 5 */}
          <Section
            title="5. Payment Terms"
            list={[
              "Payments can be made via UPI, credit/debit card, or bank transfer.",
              "All payments must be completed online through the official website.",
              "Transaction charges (if applicable) will be borne by the participant."
            ]}
          />

          {/* 6 */}
          <Section
            title="6. Event Activities"
            content="The event includes drawing competitions, award ceremonies, music performances, dance programs, melody shows, and celebrity appearances. Participation in competitions is free but requires prior registration."
          />

          {/* 7 */}
          <Section
            title="7. Code of Conduct"
            list={[
              "All attendees must maintain respectful and disciplined behavior.",
              "Any misconduct, harassment, or disruptive behavior will lead to removal from the venue.",
              "The Organizer reserves the right to deny entry or remove any individual violating event rules."
            ]}
          />

          {/* 8 */}
          <Section
            title="8. Cancellation & Refund Policy"
            list={[
              "The Organizer reserves the right to cancel or reschedule the event due to unforeseen circumstances.",
              "In case of event cancellation, stall or show seat payments will be refunded.",
              "No refund will be provided for no-shows or late cancellations."
            ]}
          />

          {/* 9 */}
          <Section
            title="9. Liability"
            list={[
              "The Organizer is not responsible for any personal injury, loss, or damage during the event.",
              "Attendees are responsible for their personal belongings."
            ]}
          />

          {/* 10 */}
          <Section
            title="10. Governing Law"
            list={[
              "These Terms shall be governed by the laws of India.",
              "Any disputes shall fall under the jurisdiction of courts in G B Nagar, Uttar Pradesh."
            ]}
          />

          {/* 11 */}
          <Section
            title="11. Contact Information"
            content="For any queries, please contact: 0120-4348458 or +91 730 339 7090. Official website: www.svsamiti.com"
          />

          <p className="text-center mt-8 font-semibold text-orange-600">
            Raja Parba 2026 Organizing Team
          </p>

        </div>
      </div>
    </div>
  );
}

/* Reusable Section Component */
function Section({ title, content, list }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-orange-100 pb-2">
        {title}
      </h2>

      {content && <p className="text-gray-700">{content}</p>}

      {list && (
        <ul className="space-y-2 text-gray-700">
          {list.map((item, index) => (
            <li key={index} className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}