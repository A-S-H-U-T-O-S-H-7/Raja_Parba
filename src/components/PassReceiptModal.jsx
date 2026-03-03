"use client";
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import MemberPass from './MemberPass';
import DonationReceipt from './Receipt';
import DonationPart from './DonatePart';

const PassReceiptModal = ({ isOpen, onClose, booking, receiptOnly = false }) => {
  const [activeTab, setActiveTab] = useState('pass');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const bookingAmount = Number(
    booking?.totalAmount ??
    booking?.amount ??
    booking?.donationAmount ??
    booking?.payment?.amount ??
    booking?.paymentDetails?.amount ??
    booking?.showDetails?.totalPrice ??
    booking?.showDetails?.totalAmount ??
    0
  );

  const isFreeBooking = bookingAmount === 0 ||
                        booking?.eventDetails?.delegateType === 'normal';

  useEffect(() => {
    if (receiptOnly) {
      setActiveTab('receipt');
      return;
    }
    if (isFreeBooking && activeTab === 'receipt') {
      setActiveTab('pass');
    }
  }, [isFreeBooking, activeTab, receiptOnly]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Determine what to show
  const showPass = (activeTab === 'pass' || isFreeBooking) && !receiptOnly;
  const showReceipt = (activeTab === 'receipt' || receiptOnly) && booking;

  const modalContent = (
    <div 
      className="fixed  inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white  rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative animate-in fade-in zoom-in duration-300">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-1.5 bg-white/90 hover:bg-white rounded-full shadow-md transition-all duration-200 hover:scale-105"
        >
          <X size={18} className="text-gray-600" />
        </button>

        {/* Toggle - Only show if both pass and receipt are available and not receiptOnly */}
        {!isFreeBooking && !receiptOnly && (
          <div className="flex  items-center justify-center p-4 bg-gray-50 border-b border-gray-200">
            <div className="relative flex bg-white rounded-full p-1 shadow-md">
              <button
                onClick={() => setActiveTab('pass')}
                className={`relative px-8 py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${
                  activeTab === 'pass'
                    ? 'text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {activeTab === 'pass' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-orange-500 rounded-full shadow-md"></div>
                )}
                <span className="relative z-10 flex items-center gap-1">
                  <span>🎫</span> Pass
                </span>
              </button>
              <button
                onClick={() => setActiveTab('receipt')}
                className={`relative px-8 py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${
                  activeTab === 'receipt'
                    ? 'text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {activeTab === 'receipt' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-orange-500 rounded-full shadow-md"></div>
                )}
                <span className="relative z-10 flex items-center gap-1">
                  <span>🧾</span> Receipt
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Content Area - No horizontal scroll, with proper padding */}
        <div className="overflow-y-auto max-h-[65vh] md:max-h-[70vh] scrollbar-hide">
          {showPass && (
            <div className="py-0">
              <MemberPass booking={booking} />
            </div>
          )}
          
          {showReceipt && (
            <div className="p-4">
              <DonationReceipt booking={booking} />
            </div>
          )}
        </div>

        {/* Donation Part - Only if not receipt only */}
        {!receiptOnly && (
          <>
            <DonationPart />
            <div className="text-center py-3 px-4 text-sm font-semibold text-rose-600 bg-rose-50 border-t border-rose-200">
              ✨ Kindly present this complete pass at the time of entry ✨
            </div>
          </>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default PassReceiptModal;