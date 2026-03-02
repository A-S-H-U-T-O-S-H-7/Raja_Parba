"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import useAuthStore from '@/lib/stores/useAuthStore';
import { useLocationData } from '@/hooks/useLocationData';
import { Heart, Mail, Phone, MapPin, Globe, Building2, MapPinned, Lock, Shield, IndianRupee } from 'lucide-react';

export default function DonationForm({ donorType = 'indian', setDonorType }) {
  // Use props if provided, otherwise fallback to local state
  const [localDonorType, setLocalDonorType] = useState('indian');
  const currentDonorType = donorType || localDonorType;
  const currentSetDonorType = setDonorType || setLocalDonorType;
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    fullName: '',
    email: '',
    mobile: '',
    address: '',
    country: '',
    state: '',
    city: '',
    pincode: ''
  });
  const [errors, setErrors] = useState({});

  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();
  
  // Use location data hook similar to delegate form
  const { countries, states, cities, loading } = useLocationData(formData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...formData, [name]: value };
    
    // Clear dependent fields when country or state changes
    if (name === 'country') {
      updatedData = { ...updatedData, state: '', city: '' };
    } else if (name === 'state') {
      updatedData = { ...updatedData, city: '' };
    }
    
    setFormData(updatedData);
  };

  const validateForm = () => {
    const fieldErrors = {};
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      fieldErrors.amount = 'Please enter a valid donation amount';
    }
    
    if (!formData.fullName || formData.fullName.trim().length < 2) {
      fieldErrors.fullName = 'Please enter your full name';
    }
    
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      fieldErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.mobile || !/^[0-9]{10}$/.test(formData.mobile.replace(/\D/g, ''))) {
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
    
    return fieldErrors;
  };

  const handleSubmit = async () => {
    if (processing || authLoading) return;
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setErrors({});
    setProcessing(true);
    
    try {
      // Create donation record in Firebase first
      const donationId = await createDonationRecord();
      
      // Initiate CCAvenue payment with updated API
      await initiatePayment(donationId);
      
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(error.message || 'Failed to process donation. Please try again.');
      setProcessing(false);
    }
  };
  
  const createDonationRecord = async () => {
    const donationId = 'DN' + Date.now();
    
    try {
      const { db } = await import('@/lib/firebase');
      const { auth } = await import('@/lib/firebase');
      const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
      const resolvedUser = user || auth.currentUser || null;
      
      const donationRef = doc(db, 'donations', donationId);
      
      await setDoc(donationRef, {
        id: donationId,
        donationId,
        userId: resolvedUser?.uid || null,
        name: formData.fullName,
        email: formData.email,
        phone: formData.mobile.replace(/\D/g, ''),
        donorDetails: {
          name: formData.fullName,
          email: formData.email,
          mobile: formData.mobile.replace(/\D/g, ''),
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          pincode: formData.pincode,
          donorType: currentDonorType
        },
        amount: parseFloat(formData.amount),
        currency: 'INR',
        status: 'pending_payment',
        paymentGateway: 'ccavenue',
        purpose: 'donation',
        donorType: currentDonorType,
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
  };
  
  const initiatePayment = async (donationId) => {
    try {
      // Prepare payment data
      const paymentData = {
        order_id: donationId,
        purpose: 'donation',
        amount: parseFloat(formData.amount).toFixed(2),
        name: formData.fullName,
        email: formData.email,
        phone: formData.mobile.replace(/\D/g, ''),
        address: `${formData.address}, ${formData.city}, ${formData.state}, ${formData.pincode}`,
        donor_type: currentDonorType,
        country: formData.country || 'india'
      };
      
      // CRITICAL FIX: Create FormData instead of JSON
      const formDataObj = new FormData();
      formDataObj.append('order_id', paymentData.order_id);
      formDataObj.append('purpose', paymentData.purpose);
      formDataObj.append('amount', paymentData.amount);
      formDataObj.append('name', paymentData.name);
      formDataObj.append('email', paymentData.email);
      formDataObj.append('phone', paymentData.phone);
      formDataObj.append('address', paymentData.address);
      formDataObj.append('donor_type', paymentData.donor_type);
      formDataObj.append('country', paymentData.country);
      
      console.log('🚀 Sending payment request:', {
        order_id: paymentData.order_id,
        amount: paymentData.amount,
        name: paymentData.name,
        email: paymentData.email
      });
      
      // Use existing CCAvenue request API - now with FormData
      const response = await fetch('/api/payment/ccavenue-request', {
        method: 'POST',
        // NO Content-Type header - browser sets it automatically with boundary
        body: formDataObj // Send as FormData, not JSON
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📥 Payment API response:', {
        status: data.status,
        hasEncRequest: !!data.encRequest,
        hasAccessCode: !!data.access_code
      });
      
      if (!data.status) {
        const errorMessage = data.errors ? data.errors.join(', ') : 'Payment request failed';
        throw new Error(errorMessage);
      }
      
      if (!data.encRequest || !data.access_code) {
        throw new Error('Invalid response from payment API');
      }
      
      // Submit to CCAvenue (this will redirect to CCAvenue and eventually to success page)
      submitToCCAvenue(data.encRequest, data.access_code);
      
    } catch (error) {
      console.error('Payment initiation failed:', error);
      throw error;
    }
  };
  
  const submitToCCAvenue = (encRequest, accessCode) => {
    try {
      // Create form dynamically - same pattern as existing PaymentProcess.jsx
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction';
      form.target = '_self';
      form.style.display = 'none';
      
      // Add encrypted request input
      const encInput = document.createElement('input');
      encInput.type = 'hidden';
      encInput.name = 'encRequest';
      encInput.value = encRequest;
      form.appendChild(encInput);
      
      // Add access code input
      const accInput = document.createElement('input');
      accInput.type = 'hidden';
      accInput.name = 'access_code';
      accInput.value = accessCode;
      form.appendChild(accInput);
      
      // Append form to body and submit
      document.body.appendChild(form);
      form.submit();
      
      // Clean up
      setTimeout(() => {
        if (document.body.contains(form)) {
          document.body.removeChild(form);
        }
      }, 1000);
      
    } catch (error) {
      console.error('Form submission error:', error);
      throw new Error('Failed to redirect to payment gateway');
    }
  };

  return (
    <div className="lg:col-span-3 bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50 rounded-2xl shadow-xl p-6 border border-pink-200 h-fit">
      {/* Decorative Header */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
        <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-amber-600 bg-clip-text text-transparent">
          Make a Difference Today
        </h2>
        <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
      </div>
      
      <div className="space-y-4">
        {/* Donor Type and Amount in same row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-purple-500" />
              Donor Type*
            </label>
            <select
              value={currentDonorType}
              onChange={(e) => currentSetDonorType(e.target.value)}
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent focus:outline-none transition-all duration-200 text-gray-900 text-sm shadow-sm hover:shadow-md"
            >
              <option value="indian">🇮🇳 Indian Donors</option>
              <option value="foreign">🌍 NRI/Foreign Donors</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
              <IndianRupee className="w-3.5 h-3.5 text-blue-500" />
              Donation Amount*
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="Enter amount"
                className="w-full pl-8 pr-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 text-sm shadow-sm hover:shadow-md"
                required
              />
            </div>
            {errors.amount && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><span className="w-1 h-1 bg-red-500 rounded-full"></span>{errors.amount}</p>}
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-green-500" />
            Full Name*
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent focus:outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 text-sm shadow-sm hover:shadow-md"
            required
          />
          {errors.fullName && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><span className="w-1 h-1 bg-red-500 rounded-full"></span>{errors.fullName}</p>}
        </div>

        {/* Email and Mobile in same row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-yellow-500" />
              Email Address*
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your@email.com"
              className="w-full px-4 py-3 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent focus:outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 text-sm shadow-sm hover:shadow-md"
              required
            />
            {errors.email && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><span className="w-1 h-1 bg-red-500 rounded-full"></span>{errors.email}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-orange-500" />
              Mobile Number*
            </label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              placeholder="9876543210"
              className="w-full px-4 py-3 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 text-sm shadow-sm hover:shadow-md"
              required
            />
            {errors.mobile && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><span className="w-1 h-1 bg-red-500 rounded-full"></span>{errors.mobile}</p>}
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-teal-500" />
            Address*
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Enter your complete address"
            rows="3"
            className="w-full px-4 py-3 bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent focus:outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 resize-none text-sm shadow-sm hover:shadow-md"
            required
          />
          {errors.address && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><span className="w-1 h-1 bg-red-500 rounded-full"></span>{errors.address}</p>}
        </div>

        {/* Country, State, City, Pincode in grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-violet-500" />
              Country*
            </label>
            <select 
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full px-3 py-3 bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-xl focus:ring-2 focus:ring-violet-400 focus:border-transparent focus:outline-none text-gray-900 text-xs shadow-sm hover:shadow-md"
              disabled={loading.countries}
            >
              <option value="">Select Country</option>
              {countries && countries.length > 0 ? (
                countries.map(country => (
                  <option key={country.iso2 || country.name} value={country.name}>
                    {country.name}
                  </option>
                ))
              ) : (
                <option value="India">🇮🇳 India</option>
              )}
            </select>
            {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-fuchsia-500" />
              State*
            </label>
            <select
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className="w-full px-3 py-3 bg-gradient-to-r from-fuchsia-50 to-pink-50 border border-fuchsia-200 rounded-xl focus:ring-2 focus:ring-fuchsia-400 focus:border-transparent focus:outline-none text-gray-900 text-xs shadow-sm hover:shadow-md"
              disabled={!states || !states.length || loading.states}
            >
              <option value="">Select State</option>
              {states && states.length > 0 ? (
                states.map(state => (
                  <option key={state.iso2 || state.name} value={state.name}>
                    {state.name}
                  </option>
                ))
              ) : (
                <option value="">Select country first</option>
              )}
            </select>
            {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
              <MapPinned className="w-3.5 h-3.5 text-rose-500" />
              City*
            </label>
            <select
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full px-3 py-3 bg-gradient-to-r from-rose-50 to-red-50 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-transparent focus:outline-none text-gray-900 text-xs shadow-sm hover:shadow-md"
              disabled={!cities || !cities.length || loading.cities}
            >
              <option value="">Select City</option>
              {cities && cities.length > 0 ? (
                cities.map(city => (
                  <option key={city.id || city.name} value={city.name}>
                    {city.name}
                  </option>
                ))
              ) : (
                <option value="">Select state first</option>
              )}
            </select>
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-sky-500" />
              Pincode*
            </label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              placeholder="PIN"
              maxLength="6"
              className="w-full px-3 py-3 bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-xl focus:ring-2 focus:ring-sky-400 focus:border-transparent focus:outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 text-xs shadow-sm hover:shadow-md"
              required
            />
            {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
          </div>
        </div>

        {/* Security Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-[10px] text-gray-500">
          <span className="flex items-center gap-1"><Lock className="w-3 h-3 text-green-500" /> 256-bit Secure</span>
          <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-blue-500" /> PCI Compliant</span>
          <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-pink-500" /> 80G Certified</span>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={processing}
          className={`w-full font-bold py-4 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 mt-2 relative overflow-hidden group ${
            processing 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500 hover:from-orange-600 hover:via-pink-600 hover:to-rose-600 cursor-pointer'
          } text-white shadow-lg`}
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
          <span className="relative z-10 flex items-center justify-center gap-2 text-lg">
            {processing ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                Processing Donation...
              </>
            ) : (
              <>
                <Heart className="w-5 h-5 fill-white animate-pulse" />
                Donate Now 
              </>
            )}
          </span>
        </button>
      </div>
    </div>
  );
}
