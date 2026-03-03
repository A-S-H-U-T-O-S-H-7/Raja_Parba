import React from 'react';
import { format } from 'date-fns';

const DonationReceipt = ({ booking }) => {
  const orderId = booking?.id || "N/A";
  
  const name = booking?.donorDetails?.name ||
               booking?.delegateDetails?.name ||
               booking?.customerDetails?.name || 
               booking?.vendorDetails?.name ||
               booking?.vendorDetails?.ownerName || 
               booking?.userDetails?.name || 
               booking?.name || 
               booking?.fullName ||
               booking?.userName ||
               booking?.displayName ||
               "N/A";
  
  const pan = booking?.delegateDetails?.pan ||
              booking?.userDetails?.pan || 
              booking?.customerDetails?.pan || 
              booking?.pan || 
              "N/A";
  
  const address = booking?.donorDetails?.address ||
                  booking?.delegateDetails?.address ||
                  booking?.userDetails?.address || 
                  booking?.customerDetails?.address || 
                  booking?.vendorDetails?.address || 
                  booking?.address || 
                  "N/A";
  
  const mobile = booking?.donorDetails?.mobile ||
                 booking?.delegateDetails?.mobile ||
                 booking?.userDetails?.phone || 
                 booking?.customerDetails?.phone || 
                 booking?.userDetails?.mobile || 
                 booking?.vendorDetails?.phone || 
                 booking?.personalDetails?.mobile || 
                 booking?.phone || 
                 booking?.mobile || 
                 "N/A";
  
  const amount = booking?.totalAmount || 
                 booking?.payment?.amount || 
                 booking?.totalPrice || 
                 booking?.donationAmount || 
                 "0";

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
    <div className="max-w-md mx-auto bg-white">
      <div className="border-2 border-rose-600 rounded-xl p-4 bg-white shadow-md">
        {/* Header */}
        <div className="mb-3 flex justify-between items-center text-[10px]">
          <span className="text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded">
            Reg: 345529
          </span>
          <h1 className="text-rose-600 font-bold text-sm">RECEIPT</h1>
          <span className="text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded">
            PAN: AAJTS7550E
          </span>
        </div>

        {/* Organization Info */}
        <div className="mb-3 flex items-start gap-2">
          <img 
            src="/logo.png" 
            alt="SVS Logo" 
            className="w-10 h-10 object-contain rounded border border-rose-200"
          />
          <div className="flex-1 text-[10px]">
            <h2 className="text-rose-700 font-bold text-xs">Samudayik Vikas Samiti</h2>
            <p className="text-green-600 font-medium text-[9px]">80G Certified</p>
            <p className="text-gray-600">A 86/B, 2nd Floor, School Block,</p>
            <p className="text-gray-600">Chander Vihar, Delhi-110092</p>
          </div>
          <img 
            src="/donationqr.jpg" 
            alt="QR" 
            className="w-10 h-10 object-contain rounded border border-rose-200"
          />
        </div>

        {/* Bank Details - Updated */}
        <div className="mb-2 p-1.5 bg-blue-50 rounded text-[8px] text-gray-600">
          <span className="font-medium">🏦 ICICI Bank</span> | A/c: 083101002804 | IFSC: ICIC0000831
        </div>

        {/* Receipt Details */}
        <div className="border border-gray-300 rounded overflow-hidden text-[10px]">
          <div className="grid grid-cols-2">
            <div className="p-1.5 border-r border-b border-gray-300 bg-gray-50">
              <span className="font-bold">Receipt No:</span> {orderId.slice(-8)}
            </div>
            <div className="p-1.5 border-b border-gray-300 bg-gray-50">
              <span className="font-bold">Date:</span> {date}
            </div>
          </div>
          
          <div className="p-1.5 border-b border-gray-300">
            <span className="font-bold">Name:</span> {name}
          </div>
          
          <div className="grid grid-cols-2">
            <div className="p-1.5 border-r border-gray-300">
              <span className="font-bold">Phone:</span> {mobile}
            </div>
            <div className="p-1.5">
              <span className="font-bold">PAN:</span> {pan}
            </div>
          </div>
          
          <div className="p-1.5 border-t border-gray-300 bg-gray-50">
            <span className="font-bold">Amount:</span> <span className="text-emerald-600 font-bold">₹{amount}</span>
            <span className="ml-2 text-[8px]">(Online Payment)</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-2 flex justify-between items-end text-[8px]">
          <p className="text-gray-500">* Subject to realization</p>
          <div className="text-right">
            <p className="font-bold text-gray-700">For Samudayik Vikas Samiti</p>
            <div className="border-t border-gray-400 mt-0.5 pt-0.5 w-24 ml-auto">
              <p className="font-bold text-[8px] text-gray-600">Authorised Signatory</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationReceipt;