// components/admin/bookings/stalls/AdminStallPayment.jsx
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle, 
  AlertCircle, 
  FileText,
  Mail,
  Calendar,
  Store,
  User,
  Phone,
  MapPin,
  CreditCard,
  Printer,
  Download,
  ArrowLeft
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, runTransaction, serverTimestamp, collection, addDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import useStallBookingStore from '@/lib/stores/useStallBookingStore';
import useAdminAuthStore from '@/lib/stores/useAdminAuthStore';
import useThemeStore from '@/lib/stores/useThemeStore';

export default function AdminStallPayment() {
  const router = useRouter();
  const { admin } = useAdminAuthStore();
  const { isDarkMode } = useThemeStore();
  const { 
    selectedStalls, 
    vendorDetails, 
    getTotalAmount, 
    getBaseAmount, 
    getDiscountAmount,
    priceSettings,
    eventSettings,
    stallAvailability,
    resetBooking
  } = useStallBookingStore();

  const [processing, setProcessing] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  const generateBookingId = async () => {
    const { generateSequentialBookingId } = await import('@/services/bookingIdService');
    return generateSequentialBookingId('stall');
  };

  const handleConfirmBooking = async () => {
    setProcessing(true);
    
    try {
      const newBookingId = await generateBookingId();
      const bookedAt = serverTimestamp();

      await runTransaction(db, async (transaction) => {
        // Check stall availability
        const availabilityRef = doc(db, 'stallAvailability', 'current');
        const availabilityDoc = await transaction.get(availabilityRef);
        
        const currentAvailability = availabilityDoc.exists() 
          ? availabilityDoc.data().stalls || {} 
          : {};

        // Verify all selected stalls are available
        for (const stallId of selectedStalls) {
          if (currentAvailability[stallId]?.booked || currentAvailability[stallId]?.blocked) {
            throw new Error(`Stall ${stallId} is no longer available`);
          }
        }

        // Update stall availability
        const updatedAvailability = { ...currentAvailability };
        selectedStalls.forEach(stallId => {
          updatedAvailability[stallId] = {
            booked: true,
            blocked: false,
            userId: vendorDetails.email,
            vendorName: vendorDetails.ownerName,
            customerName: vendorDetails.ownerName,
            customerEmail: vendorDetails.email,
            customerPhone: vendorDetails.phone,
            bookingId: newBookingId,
            bookedAt,
            bookedByAdmin: true,
            adminUserId: admin?.id
          };
        });

        transaction.set(availabilityRef, {
          stalls: updatedAvailability,
          updatedAt: bookedAt,
          updatedBy: admin?.id
        }, { merge: true });

        // Create booking record
        const bookingRef = doc(db, 'stallBookings', newBookingId);
        transaction.set(bookingRef, {
          id: newBookingId,
          bookingId: newBookingId,
          userId: vendorDetails.email,
          vendorDetails: {
            ...vendorDetails,
            bookedByAdmin: true,
            adminUserId: admin?.id,
            adminName: admin?.name
          },
          stallIds: selectedStalls,
          numberOfStalls: selectedStalls.length,
          stallDetails: selectedStalls.map(id => ({
            id,
            price: priceSettings.defaultStallPrice
          })),
          eventDetails: {
            startDate: eventSettings.startDate,
            endDate: eventSettings.endDate,
            duration: eventSettings.duration
          },
          totalAmount: getTotalAmount(),
          baseAmount: getBaseAmount(),
          discountAmount: getDiscountAmount(),
          payment: {
            status: 'success',
            method: 'admin_booking',
            transactionId: `ADMIN_${Date.now()}`,
            amount: getTotalAmount(),
            paidAt: bookedAt,
            paymentId: `admin_${newBookingId}`
          },
          status: 'confirmed',
          type: 'stall',
          createdAt: bookedAt,
          updatedAt: bookedAt,
          bookedByAdmin: true,
          adminUserId: admin?.id
        });

        // Create or update user profile
        const userProfileRef = doc(db, 'userProfiles', vendorDetails.email);
        const userProfileDoc = await transaction.get(userProfileRef);

        if (userProfileDoc.exists()) {
          transaction.update(userProfileRef, {
            name: vendorDetails.ownerName,
            phone: vendorDetails.phone,
            aadhar: vendorDetails.aadhar,
            pan: vendorDetails.pan || '',
            address: vendorDetails.address,
            businessType: vendorDetails.businessType,
            bookings: [...(userProfileDoc.data().bookings || []), newBookingId],
            stallBookings: [...(userProfileDoc.data().stallBookings || []), newBookingId],
            updatedAt: bookedAt
          });
        } else {
          transaction.set(userProfileRef, {
            email: vendorDetails.email,
            name: vendorDetails.ownerName,
            phone: vendorDetails.phone,
            aadhar: vendorDetails.aadhar,
            pan: vendorDetails.pan || '',
            address: vendorDetails.address,
            businessType: vendorDetails.businessType,
            bookings: [newBookingId],
            stallBookings: [newBookingId],
            createdAt: bookedAt,
            updatedAt: bookedAt
          });
        }

        // Log admin activity
        const logRef = collection(db, 'adminLogs');
        transaction.set(doc(logRef), {
          adminId: admin?.id,
          adminName: admin?.name,
          action: 'create',
          entityType: 'stall_booking',
          entityId: newBookingId,
          details: `Admin booked ${selectedStalls.length} stalls for ${vendorDetails.ownerName}`,
          timestamp: bookedAt
        });
      });

      setBookingId(newBookingId);
      setBookingComplete(true);
      
      toast.success(
        <div>
          <strong>Booking Successful!</strong>
          <p className="text-sm">Booking ID: {newBookingId}</p>
        </div>
      );

      // Send email notification
      try {
        await fetch('/api/emails/booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: vendorDetails.ownerName,
            email: vendorDetails.email,
            order_id: newBookingId,
            details: `Stall Booking - ${selectedStalls.join(', ')}`,
            event_date: `${eventSettings.startDate} to ${eventSettings.endDate}`,
            booking_type: 'Stall Booking',
            amount: getTotalAmount(),
            mobile: vendorDetails.phone
          })
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
      }

    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.message || 'Failed to process booking');
    } finally {
      setProcessing(false);
    }
  };

  const handleNewBooking = () => {
    resetBooking();
    setBookingComplete(false);
    setBookingId(null);
  };

  const handlePrint = () => {
    window.print();
  };

  if (bookingComplete) {
    return (
      <div className="p-6 space-y-6">
        {/* Success Message */}
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Booking Confirmed!
          </h2>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Stall booking has been successfully created
          </p>
        </div>

        {/* Booking Summary Card */}
        <div className={`rounded-2xl border p-6 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Booking Summary
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? 'hover:bg-gray-700 text-gray-400'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                onClick={() => window.location.href = `/api/bookings/${bookingId}/pdf`}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? 'hover:bg-gray-700 text-gray-400'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Booking ID */}
            <div className="col-span-2">
              <div className={`p-4 rounded-xl ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-emerald-500" />
                  <div>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Booking ID
                    </p>
                    <p className={`text-lg font-mono font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {bookingId}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vendor Details */}
            <div className="space-y-3">
              <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Vendor Information
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-500" />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {vendorDetails.ownerName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-500" />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {vendorDetails.email}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-500" />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {vendorDetails.phone}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-500 mt-0.5" />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {vendorDetails.address}
                  </span>
                </div>
              </div>
            </div>

            {/* Stall Details */}
            <div className="space-y-3">
              <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Stall Information
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-emerald-500" />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {selectedStalls.length} Stalls: {selectedStalls.join(', ')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-500" />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {eventSettings.startDate} to {eventSettings.endDate}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-500" />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Total Amount: ₹{getTotalAmount().toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Admin Note */}
            <div className="col-span-2">
              <div className={`p-4 rounded-xl ${
                isDarkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'
              }`}>
                <div className="flex gap-3">
                  <AlertCircle className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <p className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                    Booking created by Admin {admin?.name}. Confirmation email sent to {vendorDetails.email}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleNewBooking}
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl"
          >
            Create Another Booking
          </button>
          <button
            onClick={() => router.push('/admin/bookings/stalls')}
            className={`px-6 py-3 rounded-xl font-medium transition-all border ${
              isDarkMode
                ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            View All Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Confirm Booking
        </h2>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Review and confirm the stall booking
        </p>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vendor Details */}
        <div className={`lg:col-span-1 rounded-xl border p-5 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <User className="w-4 h-4 text-emerald-500" />
            Vendor Details
          </h3>
          <div className="space-y-3">
            <div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Business Type</p>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {vendorDetails.businessType}
              </p>
            </div>
            <div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Contact Person</p>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {vendorDetails.ownerName}
              </p>
            </div>
            <div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Email</p>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {vendorDetails.email}
              </p>
            </div>
            <div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Phone</p>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {vendorDetails.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Stall Details */}
        <div className={`lg:col-span-1 rounded-xl border p-5 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <Store className="w-4 h-4 text-emerald-500" />
            Stall Details
          </h3>
          <div className="space-y-3">
            <div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Selected Stalls</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedStalls.map(id => (
                  <span key={id} className={`px-2 py-0.5 rounded text-xs font-medium ${
                    isDarkMode
                      ? 'bg-emerald-900/50 text-emerald-300'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {id}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Total Stalls</p>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedStalls.length}
              </p>
            </div>
            <div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Event Duration</p>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {eventSettings.duration} ({eventSettings.startDate} to {eventSettings.endDate})
              </p>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className={`lg:col-span-1 rounded-xl border p-5 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <CreditCard className="w-4 h-4 text-emerald-500" />
            Payment Summary
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Base Amount ({selectedStalls.length} × ₹{priceSettings.defaultStallPrice})
              </span>
              <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                ₹{getBaseAmount().toLocaleString()}
              </span>
            </div>
            
            {getDiscountAmount() > 0 && (
              <div className="flex justify-between text-green-600">
                <span className="text-sm">Discount</span>
                <span className="text-sm font-medium">-₹{getDiscountAmount().toLocaleString()}</span>
              </div>
            )}

            <div className="border-t border-gray-200 dark:border-gray-700 my-3 pt-3">
              <div className="flex justify-between">
                <span className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Total Amount
                </span>
                <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  ₹{getTotalAmount().toLocaleString()}
                </span>
              </div>
            </div>

            {getDiscountAmount() > 0 && (
              <div className="mt-3 text-xs bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-400 p-2 rounded-lg">
                You saved ₹{getDiscountAmount().toLocaleString()} on this booking!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Admin Notice */}
      <div className={`p-4 rounded-xl border ${
        isDarkMode 
          ? 'bg-yellow-900/20 border-yellow-800' 
          : 'bg-yellow-50 border-yellow-200'
      }`}>
        <div className="flex gap-3">
          <AlertCircle className={`w-5 h-5 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
          <div>
            <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
              Admin Direct Booking
            </p>
            <p className={`text-xs ${isDarkMode ? 'text-yellow-400/70' : 'text-yellow-700'}`}>
              This booking will be created immediately without payment gateway processing. 
              Payment status will be marked as "Success" and confirmation email will be sent to {vendorDetails.email}.
              The booking will appear in the vendor's profile.
            </p>
          </div>
        </div>
      </div>

      {/* Confirm Button */}
      <button
        onClick={handleConfirmBooking}
        disabled={processing}
        className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold text-lg hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
      >
        {processing ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Processing Booking...
          </>
        ) : (
          <>
            <CheckCircle className="w-5 h-5" />
            Confirm & Complete Booking
          </>
        )}
      </button>

      <p className={`text-xs text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        By clicking confirm, you agree to create this booking on behalf of the vendor.
        This action cannot be undone.
      </p>
    </div>
  );
}
