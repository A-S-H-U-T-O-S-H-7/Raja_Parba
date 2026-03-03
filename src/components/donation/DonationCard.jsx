import React, { useState } from "react";
import { format } from "date-fns";
import { Heart, MapPin, Calendar, IndianRupee, User, CheckCircle, Clock } from "lucide-react";
import PassReceiptModal from "@/components/PassReceiptModal";

const DonationCard = ({ donation }) => {
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
      case "completed":
        return <CheckCircle className="h-4 w-4 text-pink-600" />;
      case "pending_payment":
        return <Clock className="h-4 w-4 text-pink-400" />;
      default:
        return <Clock className="h-4 w-4 text-pink-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
      case "completed":
        return "border-pink-200 bg-pink-100 text-pink-800";
      case "pending_payment":
        return "border-pink-100 bg-pink-50 text-pink-600";
      default:
        return "border-gray-200 bg-gray-100 text-gray-600";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "confirmed":
      case "completed":
        return "Donation Received";
      case "pending_payment":
        return "Payment Pending";
      default:
        return status;
    }
  };

  const donationDate =
    donation.createdAt instanceof Date
      ? donation.createdAt
      : donation.createdAt?.toDate
      ? donation.createdAt.toDate()
      : new Date(donation.createdAt);

  const isSuccessfulDonation = ["confirmed", "completed"].includes(
    String(donation?.status || "").toLowerCase()
  );

  return (
    <>
      <div className="w-full overflow-hidden rounded-xl border border-pink-100 bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 shadow-sm transition-all duration-200 hover:shadow-md">
        <div className="border-b border-pink-200 bg-gradient-to-r from-pink-100 to-rose-100 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 fill-pink-600 text-pink-600" />
              <span className="text-sm font-semibold text-pink-800">Donation</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${getStatusColor(donation.status)}`}>
                {getStatusIcon(donation.status)}
                {getStatusText(donation.status)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3 p-4">
          <div className="py-2 text-center">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-pink-700">
              <IndianRupee className="h-6 w-6" />
              <span>{donation.amount?.toLocaleString() || "0"}</span>
            </div>
            <p className="mt-1 text-xs text-pink-600">
              {donation.taxExemption?.eligible && (
                <span className="rounded-full bg-pink-100 px-2 py-0.5">80G Tax Exemption Available</span>
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-lg border border-pink-100 bg-white/70 p-3">
              <div className="flex items-start gap-2">
                <User className="mt-0.5 h-4 w-4 text-pink-600" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-800">{donation.donorDetails?.name || "Anonymous"}</p>
                  <p className="truncate text-xs text-gray-600">{donation.donorDetails?.email || ""}</p>
                </div>
              </div>
            </div>

            {(donation.donorDetails?.city || donation.donorDetails?.state) && (
              <div className="rounded-lg border border-pink-100 bg-white/70 p-3">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 text-pink-600" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-800">
                      {[donation.donorDetails?.city, donation.donorDetails?.state, donation.donorDetails?.country]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-lg border border-pink-100 bg-white/70 p-3">
              <div className="mb-2 flex items-start gap-2">
                <Calendar className="mt-0.5 h-4 w-4 text-pink-600" />
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{format(donationDate, "MMM dd, yyyy")}</p>
                  <p className="text-xs text-gray-600">{format(donationDate, "hh:mm a")}</p>
                </div>
              </div>

              <div className="border-t border-pink-100 pt-2">
                <p className="font-mono text-xs text-gray-500">ID: {donation.id || donation.donationId}</p>
              </div>
            </div>
          </div>

          {isSuccessfulDonation && (
            <div className="flex justify-end border-t border-pink-200 pt-2">
              <button
                type="button"
                onClick={() => setIsReceiptModalOpen(true)}
                className="rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-pink-700"
              >
                Pass & Receipt
              </button>
            </div>
          )}
        </div>
      </div>

      <PassReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        booking={donation}
        receiptOnly
      />
    </>
  );
};

export default DonationCard;
