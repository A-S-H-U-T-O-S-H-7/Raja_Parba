// stores/useShowBookingStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db } from '@/lib/firebase/config';
import { 
  doc, 
  getDoc,
  setDoc, 
  updateDoc, 
  increment, 
  serverTimestamp, 
  onSnapshot,
  collection,
  query,
  where,
  writeBatch
} from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import useAuthStore from './useAuthStore';
import { formatDateKey } from '@/utils/dateUtils';
import { calculatePriceBreakdown, getNextBulkMilestone } from '@/utils/pricingUtils';
import {
  getBlockPrice,
  getSeatBlock,
  normalizeShowPricing,
  normalizeShowSettings
} from '@/utils/showSeatUtils';

// Seat types configuration
const SEAT_TYPES = {
  VIP: { name: 'VIP Sofa', capacity: 1, basePrice: 1200 },
  REGULAR_C: { name: 'Block C Regular', capacity: 1, basePrice: 600 },
  REGULAR_D: { name: 'Block D Regular', capacity: 1, basePrice: 400 }
};

const useUserShowBookingStore = create(
  persist(
    (set, get) => ({
      // State
      selectedSeats: [],
      selectedDate: null,
      selectedShift: 'evening',
      seatAvailability: {},
      userDetails: {
        name: '',
        email: '',
        phone: '',
        aadhar: '',
        pan: '',
        address: '',
        emergencyContact: ''
      },
      priceSettings: {
        blockPrices: {},
        earlyBirdDiscounts: [],
        bulkBookingDiscounts: [],
        taxRate: 0
      },
      eventSettings: null,
      showSettings: null,
      loading: false,
      currentStep: 1,
      isUserDetailsValid: false,
      
      // Real-time listeners
      unsubscribePricing: null,
      unsubscribePricingMirror: null,
      unsubscribeShowSettings: null,
      unsubscribeAvailability: null,
      rawShowPricing: {},
      rawConsolidatedShowPricing: {},

      applyMergedPricing: () => {
        const { rawShowPricing, rawConsolidatedShowPricing, showSettings } = get();
        const mergedPricing = {
          ...rawConsolidatedShowPricing,
          ...rawShowPricing,
          blockPrices: {
            ...(rawConsolidatedShowPricing?.blockPrices || {}),
            ...(rawShowPricing?.blockPrices || {})
          }
        };

        set({
          priceSettings: normalizeShowPricing(mergedPricing, showSettings)
        });
      },

      // Initialize all listeners
      initializeListeners: () => {
        get().setupPricingListener();
        get().setupShowSettingsListener();
        if (get().selectedDate) {
          get().setupAvailabilityListener(get().selectedDate);
        }
      },

      // Setup pricing listener
      setupPricingListener: () => {
        const pricingRef = doc(db, 'settings', 'showPricing');
        
        const unsubscribe = onSnapshot(pricingRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            const newPriceSettings = {
              ...normalizeShowPricing(data, get().showSettings),
              taxRate: Number(data.taxRate || 0)
            };
            
            set({ priceSettings: newPriceSettings });
            
            // Recalculate total if seats are selected
            if (get().selectedSeats.length > 0) {
              toast.success('💰 Show pricing updated!', { duration: 3000 });
            }
          }
        }, (error) => {
          console.error('Error listening to show pricing:', error);
        });

        set({ unsubscribePricing: unsubscribe });
      },

      setupPricingListener: () => {
        const pricingRef = doc(db, 'settings', 'showPricing');
        const consolidatedPricingRef = doc(db, 'settings', 'pricing');

        const unsubscribe = onSnapshot(pricingRef, (docSnap) => {
          set({ rawShowPricing: docSnap.exists() ? docSnap.data() : {} });
          get().applyMergedPricing();

          if (get().selectedSeats.length > 0) {
            toast.success('Show pricing updated', { duration: 3000 });
          }
        }, (error) => {
          console.error('Error listening to show pricing:', error);
        });

        const unsubscribeMirror = onSnapshot(consolidatedPricingRef, (docSnap) => {
          set({ rawConsolidatedShowPricing: docSnap.exists() ? (docSnap.data()?.show || {}) : {} });
          get().applyMergedPricing();
        }, (error) => {
          console.error('Error listening to consolidated show pricing:', error);
        });

        set({ unsubscribePricing: unsubscribe, unsubscribePricingMirror: unsubscribeMirror });
      },

      // Setup show settings listener
      setupShowSettingsListener: () => {
        const showSettingsRef = doc(db, 'settings', 'shows');
        
        const unsubscribe = onSnapshot(showSettingsRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = normalizeShowSettings(docSnap.data());
            set({ 
              showSettings: data,
              eventSettings: data.eventDates || null
            });
            set((state) => ({
              priceSettings: normalizeShowPricing(state.priceSettings, data)
            }));
          }
        }, (error) => {
          console.error('Error listening to show settings:', error);
        });

        set({ unsubscribeShowSettings: unsubscribe });
      },

      setupShowSettingsListener: () => {
        const showSettingsRef = doc(db, 'settings', 'shows');
        
        const unsubscribe = onSnapshot(showSettingsRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = normalizeShowSettings(docSnap.data());
            set({
              showSettings: data,
              eventSettings: data.eventDates || null
            });
            get().applyMergedPricing();
          }
        }, (error) => {
          console.error('Error listening to show settings:', error);
        });

        set({ unsubscribeShowSettings: unsubscribe });
      },

      // Setup availability listener
      setupAvailabilityListener: (date) => {
        if (!date) return;
        
        const dateObj = new Date(date);
        const dateKey = formatDateKey(dateObj);
        const availabilityRef = doc(db, 'showSeatAvailability', dateKey);
        
        const unsubscribe = onSnapshot(availabilityRef, (docSnap) => {
          if (docSnap.exists()) {
            set({ seatAvailability: docSnap.data().seats || {} });
          } else {
            set({ seatAvailability: {} });
          }
        }, (error) => {
          console.error('Error fetching seat availability:', error);
        });

        set({ unsubscribeAvailability: unsubscribe });
      },

      // Cleanup all listeners
      cleanupListeners: () => {
        const { unsubscribePricing, unsubscribeShowSettings, unsubscribeAvailability } = get();
        if (unsubscribePricing) unsubscribePricing();
        if (unsubscribeShowSettings) unsubscribeShowSettings();
        if (unsubscribeAvailability) unsubscribeAvailability();
      },

      cleanupListeners: () => {
        const {
          unsubscribePricing,
          unsubscribePricingMirror,
          unsubscribeShowSettings,
          unsubscribeAvailability
        } = get();
        if (unsubscribePricing) unsubscribePricing();
        if (unsubscribePricingMirror) unsubscribePricingMirror();
        if (unsubscribeShowSettings) unsubscribeShowSettings();
        if (unsubscribeAvailability) unsubscribeAvailability();
      },

      // Get seat price based on seat ID
      getSeatPrice: (seatId) => {
        const { priceSettings, showSettings } = get();
        return getBlockPrice({ showPricing: priceSettings, showSettings, seatId, fallbackPrice: 0 });
      },

      // Get seat status
      getSeatStatus: (seatId) => {
        const { seatAvailability } = get();
        const availability = seatAvailability[seatId] || {};
        if (availability.blocked) return 'blocked';
        if (availability.booked) return 'booked';
        return 'available';
      },

      // Get seat color based on status
      getSeatColor: (seatId) => {
        const status = get().getSeatStatus(seatId);
        const isSelected = get().selectedSeats.includes(seatId);
        
        if (isSelected) return 'bg-blue-600 text-white ring-2 ring-blue-300';
        
        switch(status) {
          case 'booked': return 'bg-gray-400 cursor-not-allowed';
          case 'blocked': return 'bg-gray-600 cursor-not-allowed';
          default:
            const seatStr = String(seatId);
            const block = getSeatBlock(get().showSettings, seatStr);
            if (block?.type === 'premium') {
              return 'bg-gradient-to-br from-amber-300 to-yellow-400 hover:from-amber-400 hover:to-yellow-500';
            }
            return 'bg-emerald-400 hover:bg-emerald-500';
        }
      },

      // Toggle seat selection
      toggleSeat: (seatId) => {
        const { selectedSeats, getSeatStatus, getSeatPrice } = get();
        const status = getSeatStatus(seatId);
        
        if (status !== 'available' && !selectedSeats.includes(seatId)) {
          toast.error(`Seat ${seatId} is ${status}`);
          return;
        }

        if (selectedSeats.length >= 10 && !selectedSeats.includes(seatId)) {
          toast.error('Maximum 10 seats allowed');
          return;
        }

        set((state) => ({
          selectedSeats: state.selectedSeats.includes(seatId)
            ? state.selectedSeats.filter(id => id !== seatId)
            : [...state.selectedSeats, seatId]
        }));
      },

      // Set selected date
      setSelectedDate: (date) => {
        const dateStr = date instanceof Date ? date.toISOString() : date;
        
        // Cleanup old availability listener
        if (get().unsubscribeAvailability) {
          get().unsubscribeAvailability();
        }
        
        // Setup new availability listener
        get().setupAvailabilityListener(dateStr);
        
        set({ 
          selectedDate: dateStr,
          selectedSeats: []
        });
      },

      // Set date and shift
      setDateAndShift: (date, shift) => {
        const dateStr = date instanceof Date ? date.toISOString() : date;
        
        if (get().unsubscribeAvailability) {
          get().unsubscribeAvailability();
        }
        
        get().setupAvailabilityListener(dateStr);
        
        set({ 
          selectedDate: dateStr,
          selectedShift: shift,
          selectedSeats: []
        });
      },

      // Update user details
      updateUserDetails: (field, value) => {
        set((state) => ({
          userDetails: { ...state.userDetails, [field]: value }
        }));
      },

      // Set user details validation
      setUserDetailsValid: (isValid) => set({ isUserDetailsValid: isValid }),

      // Set current step
      setCurrentStep: (step) => set({ currentStep: step }),

      // Next step
      nextStep: () => {
        const { currentStep, selectedDate, selectedSeats, isUserDetailsValid } = get();
        
        if (currentStep === 1 && !selectedDate) {
          toast.error('Please select a date');
          return false;
        }
        
        if (currentStep === 2 && selectedSeats.length === 0) {
          toast.error('Please select at least one seat');
          return false;
        }
        
        if (currentStep === 3 && !isUserDetailsValid) {
          toast.error('Please fill all required details correctly');
          return false;
        }
        
        if (currentStep < 4) {
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

      // Clear selection
      clearSelection: () => set({ selectedSeats: [] }),

      // Reset booking
      resetBooking: () => {
        get().cleanupListeners();
        set({
          selectedSeats: [],
          selectedDate: null,
          selectedShift: 'evening',
          userDetails: {
            name: '',
            email: '',
            phone: '',
            aadhar: '',
            pan: '',
            address: '',
            emergencyContact: ''
          },
          currentStep: 1,
          isUserDetailsValid: false
        });
      },

      // Price calculation functions
      getBaseAmount: () => {
        const { selectedSeats, getSeatPrice } = get();
        return selectedSeats.reduce((sum, seatId) => sum + getSeatPrice(seatId), 0);
      },

      getPricingBreakdown: () => {
        const { selectedSeats, priceSettings, eventSettings, getSeatPrice } = get();
        const quantity = selectedSeats.length;
        
        if (quantity === 0) {
          return {
            baseAmount: 0,
            discountAmount: 0,
            taxAmount: 0,
            totalAmount: 0,
            discounts: { earlyBird: { percent: 0 }, bulk: { percent: 0 }, combined: { percent: 0 } }
          };
        }

        const baseAmount = selectedSeats.reduce((sum, seatId) => sum + getSeatPrice(seatId), 0);
        const averagePrice = baseAmount / quantity;

        const eventDate = eventSettings?.startDate ? new Date(eventSettings.startDate) : null;

        const breakdown = calculatePriceBreakdown({
          basePrice: averagePrice,
          quantity,
          selectedDate: eventDate,
          earlyBirdDiscounts: priceSettings.earlyBirdDiscounts,
          bulkDiscounts: priceSettings.bulkBookingDiscounts,
          quantityKey: 'minSeats',
          taxRate: priceSettings.taxRate
        });

        const combinedDiscountPercent = breakdown.discounts.combined.percent;
        const discountAmount = Math.round((baseAmount * combinedDiscountPercent) / 100);

        return {
          ...breakdown,
          baseAmount,
          discountAmount,
          totalAmount: baseAmount - discountAmount + breakdown.taxAmount
        };
      },

      getDiscountAmount: () => get().getPricingBreakdown().discountAmount,
      getTotalAmount: () => get().getPricingBreakdown().totalAmount,
      getEarlyBirdDiscount: () => get().getPricingBreakdown().discounts.earlyBird.percent,
      getBulkDiscount: () => get().getPricingBreakdown().discounts.bulk.percent,

      getNextMilestone: () => {
        const { selectedSeats, priceSettings } = get();
        return getNextBulkMilestone(
          selectedSeats.length,
          priceSettings.bulkBookingDiscounts,
          'minSeats'
        );
      },

      getCurrentDiscountInfo: () => {
        const breakdown = get().getPricingBreakdown();
        const combinedDiscount = breakdown.discounts.combined;
        
        if (!combinedDiscount.applied || combinedDiscount.percent === 0) return null;

        if (combinedDiscount.earlyBird && combinedDiscount.bulk) {
          return {
            type: 'combined',
            percent: combinedDiscount.percent,
            label: 'Early Bird + Bulk Discount',
            earlyBird: combinedDiscount.earlyBird,
            bulk: combinedDiscount.bulk
          };
        }
        
        if (combinedDiscount.earlyBird) {
          return {
            type: 'earlyBird',
            percent: combinedDiscount.percent,
            label: 'Early Bird Discount'
          };
        }
        
        if (combinedDiscount.bulk) {
          return {
            type: 'bulk',
            percent: combinedDiscount.percent,
            label: 'Bulk Discount'
          };
        }
        
        return null;
      },

      // Process booking
      processBooking: async (paymentDetails) => {
        const { selectedSeats, selectedDate, selectedShift, userDetails, getTotalAmount } = get();
        const { user } = useAuthStore.getState();

        if (!user) {
          toast.error('Please login to book seats');
          return { success: false };
        }

        if (selectedSeats.length === 0 || !selectedDate) {
          toast.error('Please select seats and date');
          return { success: false };
        }

        set({ loading: true });

        try {
          const { generateSequentialBookingId } = await import('@/services/bookingIdService');
          const bookingId = await generateSequentialBookingId('show');
          
          const dateObj = new Date(selectedDate);
          const dateKey = formatDateKey(dateObj);
          const expiryTime = paymentDetails.method === 'pending_payment' 
            ? new Date(Date.now() + 5 * 60 * 1000) 
            : null;

          // Create booking document
          const bookingRef = doc(db, 'showBookings', bookingId);
          const bookingData = {
            id: bookingId,
            bookingId,
            userId: user.uid,
            userEmail: user.email,
            showDetails: {
              date: selectedDate,
              time: selectedShift,
              selectedSeats,
              totalPrice: getTotalAmount()
            },
            seats: selectedSeats.map(seatId => ({
              seatId,
              price: get().getSeatPrice(seatId),
              section: String(seatId).split('-')[0]
            })),
            userDetails,
            paymentDetails,
            status: paymentDetails.method === 'pending_payment' ? 'pending' : 'confirmed',
            createdAt: serverTimestamp(),
            expiryTime,
            eventType: 'show'
          };

          await setDoc(bookingRef, bookingData);

          // Update seat availability
          const availabilityRef = doc(db, 'showSeatAvailability', dateKey);
          const currentDoc = await getDoc(availabilityRef);
          const currentSeats = currentDoc.exists() ? currentDoc.data().seats || {} : {};
          
          const updatedSeats = { ...currentSeats };
          selectedSeats.forEach(seatId => {
            updatedSeats[seatId] = {
              booked: paymentDetails.method !== 'pending_payment',
              blocked: paymentDetails.method === 'pending_payment',
              bookingId,
              userId: user.uid,
              bookedAt: paymentDetails.method !== 'pending_payment' ? serverTimestamp() : null,
              blockedAt: paymentDetails.method === 'pending_payment' ? serverTimestamp() : null,
              expiryTime
            };
          });

          await setDoc(availabilityRef, {
            seats: updatedSeats,
            lastUpdated: serverTimestamp()
          }, { merge: true });

          // Update stats
          const statsRef = doc(db, 'showStats', dateKey);
          await setDoc(statsRef, {
            date: dateKey,
            totalBookings: increment(1),
            totalSeatsBooked: increment(selectedSeats.length),
            totalRevenue: increment(getTotalAmount()),
            lastUpdated: serverTimestamp()
          }, { merge: true });

          set((state) => ({
            loading: false,
            selectedSeats: paymentDetails.method === 'pending_payment' ? state.selectedSeats : []
          }));
          
          return { success: true, bookingId };

        } catch (error) {
          console.error('Error processing booking:', error);
          toast.error('Failed to book seats');
          set({ loading: false });
          return { success: false, error: error.message };
        }
      }
    }),
    {
      name: 'show-booking-storage',
      version: 2,
      migrate: (persistedState) => {
        if (!persistedState || typeof persistedState !== 'object') {
          return persistedState;
        }
        return {
          userDetails: persistedState.userDetails || {
            name: '',
            email: '',
            phone: '',
            aadhar: '',
            pan: '',
            address: '',
            emergencyContact: ''
          }
        };
      },
      partialize: (state) => ({
        userDetails: state.userDetails
      })
    }
  )
);

export default useUserShowBookingStore;
