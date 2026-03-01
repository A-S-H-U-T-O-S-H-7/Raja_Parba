// stores/useStallBookingStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db } from '@/lib/firebase/config';
import { 
  doc, 
  getDoc, 
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
  runTransaction,
  serverTimestamp 
} from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import useAuthStore from './useAuthStore';

const useUserStallBookingStore = create(
  persist(
    (set, get) => ({
      // State
      selectedStalls: [],
      vendorDetails: {
        businessType: '',
        ownerName: '',
        email: '',
        phone: '',
        address: '',
        aadhar: '',
        pan: ''
      },
      priceSettings: {
        defaultStallPrice: 5000,
        earlyBirdDiscounts: [],
        bulkBookingDiscounts: []
      },
      stallSettings: null,
      stallAvailability: {},
      eventDetails: {
        startDate: null,
        endDate: null,
        duration: '3 days',
        formattedDuration: 'June 13 - June 15, 2026 (3 Days)'
      },
      loading: false,
      currentStep: 1,
      isVendorDetailsValid: false,

      // Real-time listeners
      unsubscribePricing: null,
      unsubscribeStallSettings: null,
      unsubscribeAvailability: null,

      // Initialize all listeners
      initializeListeners: () => {
        get().setupPricingListener();
        get().setupStallSettingsListener();
        get().setupAvailabilityListener();
      },

      // Setup pricing listener
      setupPricingListener: () => {
        const pricingRef = doc(db, 'settings', 'stallPricing');
        
        const unsubscribe = onSnapshot(pricingRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            const fallbackDefaultPrice = Number(get().stallSettings?.defaultPrice) || 5000;
            const parsedSeatPrice = Number(data.seatPrice);
            const parsedDefaultStallPrice = Number(data.defaultStallPrice);
            set({
              priceSettings: {
                defaultStallPrice: parsedSeatPrice || parsedDefaultStallPrice || fallbackDefaultPrice,
                earlyBirdDiscounts: data.earlyBirdDiscounts || [],
                bulkBookingDiscounts: data.bulkBookingDiscounts || []
              }
            });
            
            if (get().selectedStalls.length > 0) {
              toast.success('💰 Stall pricing updated! Your total has been recalculated.', {
                duration: 4000
              });
            }
          }
        }, (error) => {
          console.error('Error listening to stall pricing:', error);
        });

        set({ unsubscribePricing: unsubscribe });
      },

      // Setup stall settings listener
      setupStallSettingsListener: () => {
        const stallSettingsRef = doc(db, 'settings', 'stalls');
        
        const unsubscribe = onSnapshot(stallSettingsRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            set((state) => ({
              stallSettings: data,
              priceSettings: {
                ...state.priceSettings,
                defaultStallPrice: Number(state.priceSettings.defaultStallPrice) || Number(data.defaultPrice) || 5000
              }
            }));
            
            // Set event date for discount calculations
            if (data.eventDates?.startDate) {
              const eventDate = new Date(data.eventDates.startDate);
              if (!isNaN(eventDate.getTime())) {
                set(state => ({
                  eventDetails: {
                    ...state.eventDetails,
                    startDate: eventDate,
                    endDate: data.eventDates.endDate ? new Date(data.eventDates.endDate) : null,
                    duration: get().calculateDuration(data.eventDates.startDate, data.eventDates.endDate),
                    formattedDuration: get().formatDuration(data.eventDates.startDate, data.eventDates.endDate)
                  }
                }));
              }
            }
          }
        }, (error) => {
          console.error('Error listening to stall settings:', error);
        });

        set({ unsubscribeStallSettings: unsubscribe });
      },

      // Setup availability listener
      setupAvailabilityListener: () => {
        const availabilityRef = doc(db, 'stallAvailability', 'current');
        
        const unsubscribe = onSnapshot(availabilityRef, (docSnap) => {
          try {
            if (docSnap.exists()) {
              set({ stallAvailability: docSnap.data().stalls || {} });
            } else {
              set({ stallAvailability: {} });
            }
          } catch (error) {
            console.error('Error processing stall availability:', error);
          }
        }, (error) => {
          console.error('Error listening to stall availability:', error);
        });

        set({ unsubscribeAvailability: unsubscribe });
      },

      // Cleanup all listeners
      cleanupListeners: () => {
        const { unsubscribePricing, unsubscribeStallSettings, unsubscribeAvailability } = get();
        if (unsubscribePricing) unsubscribePricing();
        if (unsubscribeStallSettings) unsubscribeStallSettings();
        if (unsubscribeAvailability) unsubscribeAvailability();
      },

      // Generate stalls based on settings
      generateStalls: () => {
        const { stallSettings } = get();
        const totalStalls = stallSettings?.totalStalls || 70;

        // Always honor totalStalls so admin changes (e.g. 70 -> 100) reflect immediately.
        const configuredStallsMap = new Map(
          (stallSettings?.stalls || []).map((stall) => [stall.id, stall])
        );

        return Array.from({ length: totalStalls }, (_, i) => ({
          id: `S${i + 1}`,
          number: i + 1,
          name: configuredStallsMap.get(`S${i + 1}`)?.name || `Stall S${i + 1}`,
          size: configuredStallsMap.get(`S${i + 1}`)?.size || '10x10 ft',
          price: Number(configuredStallsMap.get(`S${i + 1}`)?.price) || Number(stallSettings?.defaultPrice) || Number(get().priceSettings.defaultStallPrice) || 5000,
          isActive: configuredStallsMap.get(`S${i + 1}`)?.isActive !== false
        })).filter((stall) => stall.isActive !== false);
      },

      getStallUnitPrice: (stallId) => {
        const { stallSettings, priceSettings } = get();
        const configuredStall = stallSettings?.stalls?.find(stall => stall.id === stallId);
        // Price Settings should drive user booking price.
        return Number(priceSettings.defaultStallPrice) || Number(configuredStall?.price) || Number(stallSettings?.defaultPrice) || 5000;
      },

      // Get stall status
      getStallStatus: (stallId) => {
        const { stallAvailability } = get();
        const availability = stallAvailability[stallId];
        if (!availability) return 'available';
        if (availability.blocked) return 'blocked';
        if (availability.booked) return 'booked';
        return 'available';
      },

      // Get stall color based on status and selection
      getStallColor: (stallId) => {
        const status = get().getStallStatus(stallId);
        const isSelected = get().selectedStalls.includes(stallId);
        
        if (isSelected) return 'bg-blue-600 text-white shadow-md border border-blue-400 ring-2 ring-blue-200';
        if (status === 'booked') return 'bg-gray-400 text-white border border-gray-300 cursor-not-allowed opacity-70';
        if (status === 'blocked') return 'bg-gray-600 text-gray-300 border border-gray-500 cursor-not-allowed opacity-70';
        return 'bg-green-500 text-white hover:bg-green-600 border border-green-400 hover:shadow-sm transition-all duration-200';
      },

      // Toggle stall selection
      toggleStall: (stallId) => {
        const { selectedStalls, getStallStatus } = get();
        const status = getStallStatus(stallId);
        
        if (status !== 'available' && !selectedStalls.includes(stallId)) {
          toast.error(`Stall ${stallId} is ${status}`);
          return;
        }
        
        set({
          selectedStalls: selectedStalls.includes(stallId)
            ? selectedStalls.filter(id => id !== stallId)
            : [...selectedStalls, stallId]
        });
      },

      // Remove stall
      removeStall: (stallId) => {
        set(state => ({
          selectedStalls: state.selectedStalls.filter(id => id !== stallId)
        }));
      },

      // Clear all selections
      clearSelection: () => set({ selectedStalls: [] }),

      // Update vendor details
      updateVendorDetails: (field, value) => {
        set(state => ({
          vendorDetails: { ...state.vendorDetails, [field]: value }
        }));
      },

      // Set vendor details object
      setVendorDetails: (details) => set({ vendorDetails: details }),

      // Set vendor details validation
      setVendorDetailsValid: (isValid) => set({ isVendorDetailsValid: isValid }),

      // Set current step
      setCurrentStep: (step) => set({ currentStep: step }),

      // Next step
      nextStep: () => {
        const { currentStep, selectedStalls, isVendorDetailsValid } = get();
        
        if (currentStep === 1 && selectedStalls.length === 0) {
          toast.error('Please select at least one stall');
          return false;
        }
        
        if (currentStep === 2 && !isVendorDetailsValid) {
          toast.error('Please fill all required vendor details correctly');
          return false;
        }
        
        if (currentStep < 3) {
          set({ currentStep: currentStep + 1 });
          return true;
        }
        
        return false;
      },

      // Previous step
      prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) {
          set({ currentStep: currentStep - 1 });
        }
      },

      // Price calculation utilities
      calculatePriceBreakdown: () => {
        const { selectedStalls, priceSettings, eventDetails, getStallUnitPrice } = get();
        const quantity = selectedStalls.length;
        
        // Calculate base amount
        const baseAmount = selectedStalls.reduce((sum, stallId) => sum + getStallUnitPrice(stallId), 0);
        
        // Calculate early bird discount
        let earlyBirdPercent = 0;
        if (eventDetails.startDate && priceSettings.earlyBirdDiscounts?.length > 0) {
          const today = new Date();
          const daysUntilEvent = Math.ceil((eventDetails.startDate - today) / (1000 * 60 * 60 * 24));
          
          for (const discount of priceSettings.earlyBirdDiscounts) {
            if (discount.isActive && daysUntilEvent >= discount.daysBeforeEvent) {
              earlyBirdPercent = Math.max(earlyBirdPercent, discount.discountPercent);
            }
          }
        }
        
        // Calculate bulk discount
        let bulkPercent = 0;
        if (priceSettings.bulkBookingDiscounts?.length > 0) {
          for (const discount of priceSettings.bulkBookingDiscounts) {
            if (discount.isActive && quantity >= discount.minSeats) {
              bulkPercent = Math.max(bulkPercent, discount.discountPercent);
            }
          }
        }
        
        // Use the higher discount
        const discountPercent = Math.max(earlyBirdPercent, bulkPercent);
        const discountAmount = (baseAmount * discountPercent) / 100;
        const totalAmount = baseAmount - discountAmount;
        
        return {
          baseAmount,
          discountAmount,
          totalAmount,
          earlyBirdPercent,
          bulkPercent,
          discountPercent
        };
      },

      getBaseAmount: () => get().calculatePriceBreakdown().baseAmount,
      getDiscountAmount: () => get().calculatePriceBreakdown().discountAmount,
      getTotalAmount: () => get().calculatePriceBreakdown().totalAmount,
      getEarlyBirdDiscount: () => get().calculatePriceBreakdown().earlyBirdPercent,
      getBulkDiscount: () => get().calculatePriceBreakdown().bulkPercent,

      getNextMilestone: () => {
        const { selectedStalls, priceSettings } = get();
        const quantity = selectedStalls.length;
        
        if (!priceSettings.bulkBookingDiscounts?.length) return null;
        
        const nextMilestone = priceSettings.bulkBookingDiscounts
          .filter(d => d.isActive && d.minSeats > quantity)
          .sort((a, b) => a.minSeats - b.minSeats)[0];
        
        if (nextMilestone) {
          return {
            quantityNeeded: nextMilestone.minSeats - quantity,
            discountPercent: nextMilestone.discountPercent
          };
        }
        
        return null;
      },

      // Generate booking ID
      generateBookingId: async () => {
        const { generateSequentialBookingId } = await import('@/services/bookingIdService');
        return await generateSequentialBookingId('stall');
      },

      // Process booking
      processBooking: async (paymentData, bookingId) => {
        const { selectedStalls, vendorDetails, getTotalAmount, eventDetails } = get();
        const { user } = useAuthStore.getState();
        
        if (!user) {
          toast.error('Please log in to continue');
          return { success: false };
        }
        
        try {
          const generatedBookingId = bookingId || await get().generateBookingId();
          
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

            // Block stalls temporarily (5 minutes)
            const expiryTime = new Date(Date.now() + 5 * 60 * 1000);
            const updatedAvailability = { ...currentAvailability };
            
            selectedStalls.forEach(stallId => {
              updatedAvailability[stallId] = {
                booked: false,
                blocked: true,
                userId: user.uid,
                vendorName: vendorDetails.ownerName,
                businessName: vendorDetails.businessType,
                bookingId: generatedBookingId,
                blockedAt: serverTimestamp(),
                expiryTime
              };
            });

            transaction.set(availabilityRef, {
              stalls: updatedAvailability,
              updatedAt: serverTimestamp()
            }, { merge: true });

            // Create booking record
            const bookingRef = doc(db, 'stallBookings', generatedBookingId);
            transaction.set(bookingRef, {
              id: generatedBookingId,
              bookingId: generatedBookingId,
              userId: user.uid,
              vendorDetails,
              stallIds: selectedStalls,
              stalls: selectedStalls.map(stallId => ({
                stallId,
                price: get().getStallUnitPrice(stallId)
              })),
              numberOfStalls: selectedStalls.length,
              duration: eventDetails.duration || '3 days',
              totalAmount: getTotalAmount(),
              payment: {
                ...paymentData,
                amount: getTotalAmount()
              },
              status: paymentData.status || 'pending_payment',
              type: 'stall',
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              expiryTime,
              eventDetails: {
                startDate: eventDetails.startDate || null,
                endDate: eventDetails.endDate || null,
                duration: eventDetails.duration || '3 days',
                type: 'vendor_stall'
              }
            });
          });
          
          return { success: true, bookingId: generatedBookingId };
        } catch (error) {
          console.error('Booking error:', error);
          toast.error(error.message || 'Failed to process booking');
          return { success: false, error: error.message };
        }
      },

      // Helper functions
      calculateDuration: (startDate, endDate) => {
        if (!startDate || !endDate) return '3 days';
        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        return `${days} day${days > 1 ? 's' : ''}`;
      },

      formatDuration: (startDate, endDate) => {
        if (!startDate || !endDate) return 'Date will be announced';
        const start = new Date(startDate);
        const end = new Date(endDate);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        return `${months[start.getMonth()]} ${start.getDate()} - ${months[end.getMonth()]} ${end.getDate()}, ${end.getFullYear()} (${days} Days)`;
      },

      // Reset store
      reset: () => {
        get().cleanupListeners();
        set({
          selectedStalls: [],
          vendorDetails: {
            businessType: '',
            ownerName: '',
            email: '',
            phone: '',
            address: '',
            aadhar: '',
            pan: ''
          },
          currentStep: 1,
          isVendorDetailsValid: false
        });
      }
    }),
    {
      name: 'stall-booking-storage',
      version: 2,
      migrate: (persistedState) => {
        if (!persistedState || typeof persistedState !== 'object') {
          return persistedState;
        }
        return {
          vendorDetails: persistedState.vendorDetails || {
            businessType: '',
            ownerName: '',
            email: '',
            phone: '',
            address: '',
            aadhar: '',
            pan: ''
          }
        };
      },
      partialize: (state) => ({
        // Keep only form data; flow state should reset on refresh
        vendorDetails: state.vendorDetails
      })
    }
  )
);

export default useUserStallBookingStore;
