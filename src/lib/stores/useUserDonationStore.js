// stores/useDonationStore.js
import { create } from 'zustand';
import { db } from '@/lib/firebase/config';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { useLocationData } from '@/hooks/useLocationData';

const useUserDonationStore = create((set, get) => ({
  // State
  donorType: 'indian',
  processing: false,
  formData: {
    amount: '',
    fullName: '',
    email: '',
    mobile: '',
    address: '',
    country: '',
    state: '',
    city: '',
    pincode: ''
  },
  errors: {},

  // Actions
  setDonorType: (type) => set({ donorType: type }),

  updateFormData: (field, value) => set((state) => {
    const newFormData = { ...state.formData, [field]: value };
    
    // Clear dependent fields when country or state changes
    if (field === 'country') {
      newFormData.state = '';
      newFormData.city = '';
    } else if (field === 'state') {
      newFormData.city = '';
    }
    
    return { formData: newFormData };
  }),

  clearForm: () => set({
    formData: {
      amount: '',
      fullName: '',
      email: '',
      mobile: '',
      address: '',
      country: '',
      state: '',
      city: '',
      pincode: ''
    },
    errors: {}
  }),

  setErrors: (errors) => set({ errors }),

  clearErrors: () => set({ errors: {} }),

  setProcessing: (status) => set({ processing: status }),

  // Form validation
  validateForm: () => {
    const { formData } = get();
    const fieldErrors = {};

    // Clean phone number
    const cleanPhone = formData.mobile.replace(/\D/g, '');
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      fieldErrors.amount = 'Please enter a valid donation amount';
    }
    
    if (!formData.fullName || formData.fullName.trim().length < 2) {
      fieldErrors.fullName = 'Please enter your full name';
    }
    
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      fieldErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.mobile || !/^[0-9]{10}$/.test(cleanPhone)) {
      fieldErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }
    
    if (!formData.address || formData.address.trim().length < 10) {
      fieldErrors.address = 'Please enter a complete address';
    }
    
    if (!formData.country || formData.country.trim().length < 2) {
      fieldErrors.country = 'Please select your country';
    }
    
    if (!formData.state || formData.state.trim().length < 2) {
      fieldErrors.state = 'Please select your state';
    }
    
    if (!formData.city || formData.city.trim().length < 2) {
      fieldErrors.city = 'Please select your city';
    }
    
    if (!formData.pincode || !/^[0-9]{6}$/.test(formData.pincode)) {
      fieldErrors.pincode = 'Please enter a valid 6-digit pincode';
    }

    set({ errors: fieldErrors });
    return Object.keys(fieldErrors).length === 0;
  },

  // Create donation record
  createDonationRecord: async (user) => {
    const { formData, donorType } = get();
    const donationId = 'DN' + Date.now() + Math.random().toString(36).substring(2, 6).toUpperCase();

    try {
      const donationRef = doc(db, 'donations', donationId);
      
      await setDoc(donationRef, {
        id: donationId,
        donationId,
        userId: user?.uid || null,
        donorDetails: {
          name: formData.fullName,
          email: formData.email,
          mobile: formData.mobile.replace(/\D/g, ''),
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          pincode: formData.pincode,
        },
        amount: parseFloat(formData.amount),
        currency: 'INR',
        status: 'pending_payment',
        paymentGateway: 'ccavenue',
        purpose: 'donation',
        donorType,
        taxExemption: {
          eligible: true,
          section: '80G',
          certificateRequired: true
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        expiryTime: new Date(Date.now() + 15 * 60 * 1000)
      });

      return donationId;
    } catch (error) {
      console.error('Donation creation failed:', error);
      throw new Error('Failed to create donation record');
    }
  },

  // Initiate payment
  initiatePayment: async (donationId) => {
    const { formData, donorType } = get();

    try {
      const paymentData = {
        order_id: donationId,
        purpose: 'donation',
        amount: parseFloat(formData.amount),
        name: formData.fullName,
        email: formData.email,
        phone: formData.mobile.replace(/\D/g, ''),
        address: `${formData.address}, ${formData.city}, ${formData.state}, ${formData.pincode}`,
        donor_type: donorType,
        country: formData.country || 'india'
      };
      
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
      
      // Submit to CCAvenue
      get().submitToCCAvenue(data.encRequest, data.access_code);
      
    } catch (error) {
      console.error('Payment initiation failed:', error);
      throw error;
    }
  },

  // Submit to CCAvenue
  submitToCCAvenue: (encRequest, accessCode) => {
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
      console.error('Form submission error:', error);
      throw new Error('Failed to redirect to payment gateway');
    }
  },

  // Handle form submission
  handleSubmit: async (user) => {
    const { validateForm, setProcessing, createDonationRecord, initiatePayment } = get();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setProcessing(true);
    
    try {
      const donationId = await createDonationRecord(user);
      await initiatePayment(donationId);
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(error.message || 'Failed to process donation. Please try again.');
      setProcessing(false);
    }
  },

  // Reset
  reset: () => set({
    donorType: 'indian',
    processing: false,
    formData: {
      amount: '',
      fullName: '',
      email: '',
      mobile: '',
      address: '',
      country: '',
      state: '',
      city: '',
      pincode: ''
    },
    errors: {}
  })
}));

export default useUserDonationStore;