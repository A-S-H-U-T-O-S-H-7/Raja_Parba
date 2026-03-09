import React from 'react';
import { format } from 'date-fns';

const DonationReceipt = ({ booking }) => {
  const orderId = booking?.id || 'N/A';

  const name =
    booking?.donorDetails?.name ||
    booking?.delegateDetails?.name ||
    booking?.customerDetails?.name ||
    booking?.vendorDetails?.name ||
    booking?.vendorDetails?.ownerName ||
    booking?.userDetails?.name ||
    booking?.name ||
    booking?.fullName ||
    booking?.userName ||
    booking?.displayName ||
    'N/A';

  const pan =
    booking?.delegateDetails?.pan ||
    booking?.userDetails?.pan ||
    booking?.customerDetails?.pan ||
    booking?.pan ||
    'N/A';

  const address =
    booking?.donorDetails?.address ||
    booking?.delegateDetails?.address ||
    booking?.userDetails?.address ||
    booking?.customerDetails?.address ||
    booking?.vendorDetails?.address ||
    booking?.address ||
    'N/A';

  const mobile =
    booking?.donorDetails?.mobile ||
    booking?.delegateDetails?.mobile ||
    booking?.userDetails?.phone ||
    booking?.customerDetails?.phone ||
    booking?.userDetails?.mobile ||
    booking?.vendorDetails?.phone ||
    booking?.personalDetails?.mobile ||
    booking?.phone ||
    booking?.mobile ||
    'N/A';

  const amount =
    booking?.totalAmount ||
    booking?.payment?.amount ||
    booking?.totalPrice ||
    booking?.donationAmount ||
    '0';

  let date = 'Unknown';
  try {
    if (booking?.createdAt) {
      let dateObj = booking.createdAt;
      if (booking.createdAt.toDate && typeof booking.createdAt.toDate === 'function') {
        dateObj = booking.createdAt.toDate();
      } else if (booking.createdAt.seconds) {
        dateObj = new Date(booking.createdAt.seconds * 1000);
      }
      if (dateObj instanceof Date && !isNaN(dateObj)) {
        date = format(dateObj, 'MMM dd, yyyy');
      }
    }
  } catch (error) {
    console.warn('Error formatting date:', error);
    date = 'Unknown';
  }

  return (
    <div className="w-full bg-white">
      <div className="w-full rounded-2xl border-2 border-rose-500 bg-white p-4 shadow-lg md:p-6">
        <div className="mb-3 flex items-center justify-between text-xs md:text-sm">
          <span className="rounded-md bg-green-50 px-2.5 py-1 font-semibold text-green-700">
            Reg: 345529
          </span>
          <h1 className="text-base font-bold tracking-wide text-rose-600 md:text-2xl">RECEIPT</h1>
          <span className="rounded-md bg-green-50 px-2.5 py-1 font-semibold text-green-700">
            PAN: AAJTS7550E
          </span>
        </div>

        <div className="mb-3 flex items-start gap-3 md:gap-3">
          <img
            src="/logo.png"
            alt="SVS Logo"
            className="h-12 w-12 rounded border border-rose-200 object-contain md:h-16 md:w-16"
          />
          <div className="flex-1 text-xs md:text-sm">
            <h2 className="text-sm font-bold text-rose-700 md:text-lg">Samudayik Vikas Samiti</h2>
            <p className="text-xs font-medium text-green-600 md:text-sm">80G Certified</p>
            <p className="text-gray-700">A 86/B, 2nd Floor, School Block,</p>
            <p className="text-gray-700">Chander Vihar, Delhi-110092</p>
          </div>
          <img
            src="/donationqr.jpg"
            alt="QR"
            className="h-12 w-12 rounded border border-rose-200 object-contain md:h-16 md:w-16"
          />
        </div>

        <div className="mb-3 rounded-lg bg-blue-50 px-3 py-1.5 text-xs text-gray-700 md:text-sm">
          <span className="font-semibold">ICICI Bank</span> | A/c: 083101002804 | IFSC: ICIC0000831
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-300 text-sm md:text-base">
          <div className="grid grid-cols-2">
            <div className="border-b border-r border-gray-300 bg-gray-50 px-3 py-2 md:px-4 md:py-2.5">
              <span className="font-bold">Receipt No:</span> {orderId.slice(-8)}
            </div>
            <div className="border-b border-gray-300 bg-gray-50 px-3 py-2 md:px-4 md:py-2.5">
              <span className="font-bold">Date:</span> {date}
            </div>
          </div>

          <div className="grid grid-cols-2">
            <div className="border-b border-r border-gray-300 px-3 py-2 md:px-4 md:py-2.5">
              <span className="font-bold">Name:</span> {name}
            </div>
            <div className="border-b border-gray-300 px-3 py-2 md:px-4 md:py-2.5">
              <span className="font-bold">On Account Of:</span> Donation
            </div>
          </div>

          <div className="border-b border-gray-300 px-3 py-2 md:px-4 md:py-2.5">
            <span className="font-bold">Address:</span> {address}
          </div>

          <div className="grid grid-cols-2">
            <div className="border-r border-gray-300 px-3 py-2 md:px-4 md:py-2.5">
              <span className="font-bold">Phone:</span> {mobile}
            </div>
            <div className="px-3 py-2 md:px-4 md:py-2.5">
              <span className="font-bold">PAN:</span> {pan}
            </div>
          </div>

          <div className="border-t border-gray-300 bg-gray-50 px-3 py-2.5 md:px-4 md:py-3">
            <span className="font-bold">Amount:</span>{' '}
            <span className="text-xl font-bold text-emerald-600 md:text-2xl">Rs {amount}</span>
            <span className="ml-2 text-xs text-gray-600 md:text-base">(Online Payment)</span>
          </div>
        </div>

        <div className="mt-3 flex items-end justify-between text-[10px] md:text-xs">
          <p className="text-gray-500">* Subject to realization</p>
          <div className="text-right">
            <p className="font-bold text-gray-700 md:text-sm">For Samudayik Vikas Samiti</p>
            <div className="ml-auto mt-1 w-28 border-t border-gray-400 pt-1 md:w-36">
              <p className="text-[10px] font-bold text-gray-600 md:text-xs">Authorised Signatory</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationReceipt;
