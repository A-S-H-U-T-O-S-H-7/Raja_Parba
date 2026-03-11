"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, CheckCircle, Shield, Calendar, Users, Clock, Loader2, ArrowLeft, AlertTriangle, Sparkles } from "lucide-react";
import { format } from "date-fns";
import useUserShowBookingStore from "@/lib/stores/useUserShowBooking";
import useAuthStore from "@/lib/stores/useAuthStore";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";

export default function ShowPaymentProcess({ onBack }) {
  const [processing, setProcessing] = useState(false);
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    selectedDate,
    selectedSeats,
    userDetails,
    getTotalAmount,
    getDiscountAmount,
    getBaseAmount,
    getEarlyBirdDiscount,
    getBulkDiscount,
    processBooking,
    resetBooking,
    showSettings
  } = useUserShowBookingStore();

  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const activeShows = showSettings?.shows?.filter((show) => show.active === true || show.isActive === true) || [];
  const currentShow = activeShows.length > 0 ? activeShows[0] : null;
  const finalAmount = getTotalAmount();
  const isFreeBooking = finalAmount <= 0;

  const ensureValidBooking = () => {
    if (!user) {
      toast.error("Please login to continue");
      router.push("/login");
      return false;
    }

    const requiredFields = ["name", "email", "phone", "aadhar", "address"];
    if (requiredFields.some((field) => !userDetails[field])) {
      toast.error("Please fill all required details");
      return false;
    }

    if (!selectedSeats.length) {
      toast.error("Please choose at least one seat");
      return false;
    }

    return true;
  };

  const handlePaidBooking = async () => {
    if (!ensureValidBooking()) return;

    setProcessing(true);

    try {
      const result = await processBooking({
        method: "pending_payment",
        transactionId: `pending_${Date.now()}`
      });

      if (!result.success) {
        throw new Error(result.error || "Booking failed");
      }

      const paymentData = {
        order_id: result.bookingId,
        purpose: "show",
        amount: finalAmount.toString(),
        name: userDetails.name,
        email: userDetails.email,
        phone: userDetails.phone,
        address: userDetails.address || "Delhi, India"
      };

      const response = await fetch("/api/payment/ccavenue-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData)
      });

      const data = await response.json();

      if (!data.status) {
        throw new Error(data.errors?.join(", ") || "Payment failed");
      }

      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction";
      form.innerHTML = `
        <input type="hidden" name="encRequest" value="${data.encRequest}" />
        <input type="hidden" name="access_code" value="${data.access_code}" />
      `;
      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      toast.error(error.message || "Booking failed");
      setProcessing(false);
    }
  };

  const handleFreeBooking = async () => {
    if (!ensureValidBooking()) return;

    setProcessing(true);

    try {
      const result = await processBooking({
        method: "free_booking",
        transactionId: `free_${Date.now()}`
      });

      if (!result.success) {
        throw new Error(result.error || "Free booking failed");
      }

      await Swal.fire({
        icon: "success",
        title: "Booking Confirmed",
        text: "Your free show pass has been booked successfully.",
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        background: "#fff1f2",
        color: "#881337",
        iconColor: "#e11d48"
      });

      resetBooking();
      router.push("/profile?tab=show");
    } catch (error) {
      toast.error(error.message || "Booking failed");
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 flex flex-col justify-center items-center px-2 sm:px-4 py-4 sm:py-8">
      <div className="bg-white shadow-xl rounded-xl sm:rounded-2xl max-w-4xl w-full overflow-hidden">
        <div className="bg-gradient-to-r from-pink-400 via-pink-400 to-rose-400 px-4 sm:px-6 py-4 sm:py-5">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white text-center">
            {isFreeBooking ? "Confirm Your Free Show Pass" : "Complete Your Reservation"}
          </h2>
          <p className="text-pink-100 text-center mt-1 sm:mt-2 text-sm sm:text-base">
            {isFreeBooking ? "One final confirmation before your entry pass is issued." : "Your contribution helps support the celebration."}
          </p>
        </div>

        <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
          <div className="bg-gradient-to-br from-pink-50 via-white to-rose-50 border border-pink-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
            <h3 className="text-lg sm:text-xl font-bold text-rose-800 mb-3 sm:mb-4 flex items-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              Final Summary
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-pink-200">
                <h4 className="font-semibold text-rose-700 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-pink-500" />
                  Your Details
                </h4>
                <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-700">
                  <p><span className="font-medium text-gray-900">Name:</span> {userDetails.name || "N/A"}</p>
                  <p><span className="font-medium text-gray-900">Email:</span> {userDetails.email || "N/A"}</p>
                  <p><span className="font-medium text-gray-900">Phone:</span> {userDetails.phone || "N/A"}</p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-pink-200">
                <h4 className="font-semibold text-rose-700 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-pink-500" />
                  Show Details
                </h4>
                <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-700">
                  <p><span className="font-medium text-gray-900">Date:</span> {selectedDate ? (typeof selectedDate === "string" ? format(new Date(selectedDate), "MMM dd, yyyy") : format(selectedDate, "MMM dd, yyyy")) : "N/A"}</p>
                  <p><span className="font-medium text-gray-900">Time:</span> {currentShow ? formatTime(currentShow.timeFrom || currentShow.startTime) : "5:00 PM"} - {currentShow ? formatTime(currentShow.timeTo || currentShow.endTime) : "10:00 PM"}</p>
                  <p><span className="font-medium text-gray-900">Seats:</span> {selectedSeats.length}</p>
                  <p><span className="font-medium text-gray-900">Seat Numbers:</span> {selectedSeats.join(", ")}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-pink-100 via-white to-rose-100 border border-pink-300 rounded-lg sm:rounded-xl p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start text-center sm:text-left gap-4">
                <div className="flex-1">
                  {!isFreeBooking && (
                    <div className="space-y-1 mb-2">
                      {getEarlyBirdDiscount() > 0 && (
                        <div className="inline-block text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full mr-1">
                          {getEarlyBirdDiscount()}% Early Bird
                        </div>
                      )}
                      {getBulkDiscount() > 0 && (
                        <div className="inline-block text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          {getBulkDiscount()}% Bulk
                        </div>
                      )}
                    </div>
                  )}

                  <p className="text-xs max-w-lg mt-3 text-orange-600">
                    All passes remain subject to venue capacity, entry checks, and event guidelines.
                  </p>
                </div>

                <div className={`px-4 py-6 sm:px-6 rounded-lg sm:rounded-xl shadow-md border-2 ${isFreeBooking ? "bg-emerald-50 border-emerald-200" : "bg-white border-rose-200"}`}>
                  <div className="text-center">
                    <p className={`text-sm font-medium mb-1 ${isFreeBooking ? "text-emerald-700" : "text-rose-600"}`}>
                      {isFreeBooking ? "Booking Amount" : "Final Amount"}
                    </p>
                    <div className={`text-2xl sm:text-3xl font-bold ${isFreeBooking ? "text-emerald-700" : "text-rose-800"}`}>
                      {isFreeBooking ? "FREE" : `₹${finalAmount.toLocaleString("en-IN")}`}
                    </div>
                    {!isFreeBooking && getDiscountAmount() > 0 && (
                      <div className="mt-2 space-y-1">
                        <p className="text-xs text-gray-500 line-through">₹{getBaseAmount().toLocaleString("en-IN")}</p>
                        <p className="text-sm text-green-600 font-semibold">You saved ₹{getDiscountAmount().toLocaleString("en-IN")}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isFreeBooking ? (
            <div className="rounded-2xl border border-amber-300 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-5 sm:p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 border border-amber-300">
                  <AlertTriangle className="w-6 h-6 text-amber-700" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-amber-900">Important Note for Free Seats</h3>
                    <Sparkles className="w-5 h-5 text-rose-500" />
                  </div>
                  <p className="text-sm sm:text-base text-amber-900 leading-7">
                    Dear <span className="font-bold">{userDetails.name || "Guest"}</span>, your selected seat(s) are currently free of charge. This booking is still required because a valid show pass is mandatory for entry into the venue. <strong>We cannot guarantee that the exact free seat(s) selected now will remain reserved for you at the venue.</strong>
                  </p>
                  <p className="mt-3 text-sm text-amber-800">
                    Please arrive early and keep your confirmed show pass ready for verification at entry.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-rose-50 via-white to-pink-50 border border-rose-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
              <h3 className="text-lg sm:text-xl font-bold text-rose-800 mb-3 sm:mb-4 flex items-center">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                Secure Payment
              </h3>

              <div className="mb-3 sm:mb-4">
                <div className="flex items-center p-3 bg-white rounded-lg shadow-sm border border-rose-200">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-3" />
                  <div className="text-xs sm:text-sm">
                    <p className="font-semibold text-rose-800">Bank Grade Security</p>
                    <p className="text-rose-600">Powered by CCAvenue.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={isFreeBooking ? handleFreeBooking : handlePaidBooking}
            disabled={processing}
            className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg transition-all duration-300 transform ${
              processing
                ? "bg-gray-400 cursor-not-allowed"
                : isFreeBooking
                  ? "bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 cursor-pointer shadow-lg hover:shadow-xl"
                  : "bg-gradient-to-r from-pink-400 via-pink-500 to-rose-500 hover:from-pink-500 hover:via-pink-600 hover:to-rose-600 cursor-pointer shadow-lg hover:shadow-xl"
            } text-white`}
          >
            {processing ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin w-5 h-5 sm:w-6 sm:h-6 text-white mr-2 sm:mr-3" />
                {isFreeBooking ? "Confirming Pass..." : "Processing Booking..."}
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                {isFreeBooking ? "Confirm Free Show Pass" : `Pay ₹${finalAmount.toLocaleString("en-IN")}`}
              </span>
            )}
          </button>

          {onBack && (
            <div className="flex justify-start">
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Details
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
