"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, Ban, Phone } from "lucide-react";

export default function RefundCancellationPolicy() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-8 flex items-center text-orange-600 hover:text-orange-800 transition-colors font-medium"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-500 rounded-2xl p-8 shadow-xl mb-10 text-center">
          <div className="flex justify-center items-center mb-4">
            <FileText className="h-10 w-10 text-white mr-3" />
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Refund & Cancellation Policy
            </h1>
          </div>
          <p className="text-orange-100 text-lg font-medium">
            Raja Parba 2026
          </p>
          <p className="text-orange-50 text-sm mt-2">
            13th – 15th June 2026
          </p>
          <p className="text-orange-50 text-sm">
            Ram Leela Ground, Sector 21A, Noida, Uttar Pradesh
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 space-y-10">

          {/* Entry Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-3">
              1. Entry Pass Policy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Entry to Raja Parba 2026 is <strong>free of cost</strong>. 
              However, a <strong>mandatory entry pass</strong> must be booked 
              through the official website. Upon successful booking, a 
              <strong>QR code</strong> will be generated in the user profile, 
              which must be presented at the venue for verification.
            </p>
            <p className="text-gray-700 mt-4">
              Since entry passes are issued free of charge, 
              <strong>no refund policy applies</strong> to entry registrations.
            </p>
          </section>

          {/* Paid Booking Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-3">
              2. Show Seat & Stall Booking Policy
            </h2>

            <ul className="space-y-3 text-gray-700 leading-relaxed">
              <li>
                • Reserved show seating is paid and subject to availability.
              </li>
              <li>
                • Stall booking starts from ₹5000 (price subject to change).
              </li>
              <li>
                • Full payment must be made at the time of booking.
              </li>
              <li>
                • Once payment is successfully processed, the booking is considered confirmed.
              </li>
            </ul>
          </section>

          {/* Refund Policy */}
          <section>
            <div className="flex items-center mb-4">
              <Ban className="h-6 w-6 text-red-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3 w-full">
                3. Refund & Cancellation Terms
              </h2>
            </div>

            <ul className="space-y-4 text-gray-700 leading-relaxed">
              <li>
                • All payments made towards show seat booking or stall booking 
                are <strong>non-refundable</strong> once confirmed.
              </li>
              <li>
                • No refund shall be issued for participant cancellation, 
                change of plans, scheduling conflicts, or failure to attend the event.
              </li>
              <li>
                • In the event that Raja Parba 2026 is officially cancelled 
                by the Organizer due to unforeseen circumstances, government 
                restrictions, safety concerns, or other valid reasons, 
                the paid booking amount shall be refunded.
              </li>
              <li>
                • If the event is conducted as scheduled and the participant 
                does not attend for any reason, the amount paid shall be 
                treated as a <strong>voluntary donation</strong> towards 
                event organization and management expenses.
              </li>
            </ul>
          </section>

          {/* Organizer Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-3">
              4. Organizer’s Rights
            </h2>
            <p className="text-gray-700 leading-relaxed">
              The Organizer reserves the right to modify, reschedule, 
              or cancel the event due to circumstances beyond control 
              including but not limited to weather conditions, 
              government directives, public safety concerns, or force majeure events.
            </p>
          </section>

          {/* Contact */}
          <section>
            <div className="flex items-center mb-4">
              <Phone className="h-6 w-6 text-orange-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3 w-full">
                5. Contact Information
              </h2>
            </div>
            <p className="text-gray-700">
              For any queries regarding this Refund & Cancellation Policy, 
              please contact:
            </p>
            <p className="text-gray-800 font-medium mt-3">
              Phone: 0120-4348458
            </p>
            <p className="text-gray-800 font-medium">
              Mobile: +91 730 339 7090
            </p>
            <p className="text-gray-800 font-medium">
              Website: www.svsamiti.com
            </p>
          </section>

          {/* Footer */}
          <div className="text-center pt-8 border-t">
            <p className="text-gray-700 font-semibold">
              Raja Parba 2026 Organizing Team
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Samudayik Vikas Samiti
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}