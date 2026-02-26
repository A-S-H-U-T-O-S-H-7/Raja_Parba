// components/stall/StallPaymentProcess.jsx
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Shield, AlertCircle, Loader2 } from 'lucide-react';
import useUserStallBookingStore from '@/lib/stores/useUserStallBookingStore';
import useAuthStore from '@/lib/stores/useAuthStore';
import { toast } from 'react-hot-toast';

export default function StallPaymentProcess() {
  const [processing, setProcessing] = useState(false);
  const router = useRouter();
  const { user } = useAuthStore();
  const { 
    selectedStalls, 
    vendorDetails, 
    getTotalAmount,
    eventDetails,
    processBooking,
    clearSelection
  } = useUserStallBookingStore();

  useEffect(() => {
    // Redirect if no stalls selected
    if (selectedStalls.length === 0) {
      router.push('/stall-booking');
    }
  }, [selectedStalls, router]);

  const initiatePayment = async () => {
    // Validate vendor details
    const requiredFields = ['ownerName', 'email', 'phone', 'businessType', 'aadhar', 'address'];
    if (requiredFields.some(field => !vendorDetails[field])) {
      toast.error('Please fill all required vendor details');
      return;
    }
    
    if (selectedStalls.length === 0) {
      toast.error('Please select at least one stall');
      return;
    }
    
    setProcessing(true);
    
    try {
      // Generate booking ID
      const { generateSequentialBookingId } = await import('@/services/bookingIdService');
      const bookingId = await generateSequentialBookingId('stall');
      
      // Create pending booking
      const result = await processBooking({
        status: 'pending_payment',
        method: 'ccavenue'
      }, bookingId);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create booking');
      }
      
      // Prepare payment data for CCAvenue
      const paymentData = {
        order_id: bookingId,
        purpose: 'stall_booking',
        amount: getTotalAmount().toString(),
        name: vendorDetails.ownerName,
        email: vendorDetails.email,
        phone: vendorDetails.phone,
        address: vendorDetails.address || 'Delhi, India'
      };
      
      // Send request to CCAvenue API
      const response = await fetch('/api/payment/ccavenue-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.status) {
        throw new Error(data.errors ? data.errors.join(', ') : 'Payment request failed');
      }
      
      if (!data.encRequest || !data.access_code) {
        throw new Error('Invalid response from payment API');
      }
      
      // Redirect to CCAvenue
      submitToCCAvenue(data.encRequest, data.access_code, bookingId);
      
    } catch (error) {
      toast.error(error.message || 'Failed to initiate payment');
      setProcessing(false);
    }
  };
  
  const submitToCCAvenue = (encRequest, accessCode, bookingId) => {
    try {
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction';
      form.target = '_self';
      form.style.display = 'none';
      
      const encInput = document.createElement('input');
      encInput.type = 'hidden';
      encInput.name = 'encRequest';
      encInput.value = encRequest;
      form.appendChild(encInput);
      
      const accInput = document.createElement('input');
      accInput.type = 'hidden';
      accInput.name = 'access_code';
      accInput.value = accessCode;
      form.appendChild(accInput);
      
      document.body.appendChild(form);
      form.submit();
      
      setTimeout(() => {
        if (document.body.contains(form)) {
          document.body.removeChild(form);
        }
      }, 1000);
      
    } catch (error) {
      toast.error('Failed to redirect to payment gateway');
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col justify-center items-center px-2 sm:px-4 py-4 sm:py-8">
      <div className="bg-white shadow-xl rounded-xl sm:rounded-2xl max-w-4xl w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 sm:px-6 py-4 sm:py-5">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white text-center">
            Complete Stall Payment
          </h2>
          <p className="text-blue-100 text-center mt-1 sm:mt-2 text-sm sm:text-base">
            Your contribution supports our community initiatives
          </p>
        </div>

        <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
          {/* Booking Summary */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
            <h3 className="text-lg sm:text-xl font-bold text-blue-800 mb-3 sm:mb-4 flex items-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                <span className="text-white font-bold text-sm sm:text-base">📋</span>
              </div>
              Booking Summary
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
              {/* Vendor Details */}
              <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-blue-200">
                <h4 className="font-semibold text-blue-700 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                  <span className="text-base sm:text-lg mr-2">👤</span>
                  Vendor Details
                </h4>
                <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-700">
                  <p><span className="font-medium">Contact:</span> {vendorDetails.ownerName}</p>
                  <p><span className="font-medium">Email:</span> {vendorDetails.email}</p>
                  <p><span className="font-medium">Phone:</span> {vendorDetails.phone}</p>
                  <p><span className="font-medium">Business:</span> {vendorDetails.businessType}</p>
                </div>
              </div>

              {/* Stall Details */}
              <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-blue-200">
                <h4 className="font-semibold text-blue-700 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                  <span className="text-base sm:text-lg mr-2">🏢</span>
                  Stall Details
                </h4>
                <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-700">
                  <p><span className="font-medium">Stalls:</span> {selectedStalls.join(', ')}</p>
                  <p><span className="font-medium">Count:</span> {selectedStalls.length}</p>
                  <p><span className="font-medium">Duration:</span> {eventDetails.formattedDuration}</p>
                </div>
              </div>
            </div>

            {/* Total Amount */}
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-300 rounded-lg sm:rounded-xl p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
                <div className="mb-2 sm:mb-0">
                  <h4 className="text-base sm:text-lg font-semibold text-purple-800">Total Amount</h4>
                  <p className="text-xs max-w-lg mt-2 sm:text-sm text-orange-600">
                    All payments are considered donations to SVS and eligible for 80G exemption.
                  </p>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-purple-800 bg-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-md">
                  ₹{getTotalAmount().toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
            <h3 className="text-lg sm:text-xl font-bold text-indigo-800 mb-3 sm:mb-4 flex items-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-indigo-500 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                <span className="text-white font-bold text-sm sm:text-base">💳</span>
              </div>
              Secure Payment
            </h3>
            
            {/* Security Info */}
            <div className="mb-3 sm:mb-4">
              <div className="flex items-center p-3 bg-white rounded-lg shadow-sm border border-indigo-200">
                <Shield className="text-indigo-600 mr-3 w-5 h-5 sm:w-6 sm:h-6" />
                <div className="text-xs sm:text-sm">
                  <p className="font-semibold text-indigo-800">Bank Grade Security</p>
                  <p className="text-indigo-600">Powered by CCAvenue - India's leading payment gateway</p>
                </div>
              </div>
            </div>

            {/* Payment Button */}
            <button
              onClick={initiatePayment}
              disabled={processing}
              className={`w-full py-3 cursor-pointer sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg transition-all duration-300 transform ${
                processing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
              } text-white`}
            >
              {processing ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin h-5 w-5 sm:h-6 sm:w-6 text-white mr-2 sm:mr-3" />
                  Processing Payment...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                  Pay ₹{getTotalAmount().toLocaleString()}
                </span>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-2 sm:mt-3">
              By clicking "Pay", you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}