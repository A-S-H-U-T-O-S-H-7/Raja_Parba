// components/show/ShowUserDetails.jsx
"use client";
import { useState, useEffect } from 'react';
import { User, Mail, Phone, CreditCard, MapPin, AlertCircle, CheckCircle, PhoneCall } from 'lucide-react';
import useUserShowBookingStore from '@/lib/stores/useUserShowBooking';
import useAuthStore from '@/lib/stores/useAuthStore';

export default function ShowUserDetails() {
  const { userDetails, updateUserDetails, setUserDetailsValid } = useUserShowBookingStore();
  const { user } = useAuthStore();
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Auto-fill email from user account
  useEffect(() => {
    if (user?.email && !userDetails.email) {
      updateUserDetails('email', user.email);
    }
  }, [user, userDetails.email, updateUserDetails]);

  // Validate form on changes
  useEffect(() => {
    const isValid = validateForm();
    setUserDetailsValid(isValid);
  }, [userDetails, setUserDetailsValid]);

  const validateField = (field, value) => {
    switch(field) {
      case 'name':
        return value?.length >= 3 ? '' : 'Name must be at least 3 characters';
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Enter a valid email';
      case 'phone':
        return /^[6-9]\d{9}$/.test(value) ? '' : 'Enter a valid 10-digit mobile number';
      case 'aadhar':
        return /^[2-9]\d{11}$/.test(value) ? '' : 'Enter a valid 12-digit Aadhar number';
      case 'pan':
        if (!value) return '';
        return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value) ? '' : 'Enter a valid PAN (e.g., ABCDE1234F)';
      case 'address':
        return value?.length >= 5 ? '' : 'Address must be at least 5 characters';
      case 'emergencyContact':
        if (!value) return '';
        return /^[6-9]\d{9}$/.test(value) ? '' : 'Enter a valid 10-digit number';
      default:
        return '';
    }
  };

  const handleChange = (field, value) => {
    // Format input
    if (field === 'phone' || field === 'emergencyContact') {
      value = value.replace(/\D/g, '').slice(0, 10);
    } else if (field === 'aadhar') {
      value = value.replace(/\D/g, '').slice(0, 12);
    } else if (field === 'pan') {
      value = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    }

    updateUserDetails(field, value);
    
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, userDetails[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const validateForm = () => {
    const requiredFields = ['name', 'email', 'phone', 'aadhar', 'address'];
    return requiredFields.every(field => 
      userDetails[field] && !validateField(field, userDetails[field])
    );
  };

  const getFieldStatus = (field) => {
    if (!touched[field] || !userDetails[field]) return null;
    return errors[field] ? 'error' : 'success';
  };

  const renderFieldIcon = (field) => {
    const status = getFieldStatus(field);
    if (status === 'success') {
      return <CheckCircle className="w-4 h-4 text-green-500 absolute right-3 top-3" />;
    }
    if (status === 'error') {
      return <AlertCircle className="w-4 h-4 text-red-500 absolute right-3 top-3" />;
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Your Details</h3>
          <p className="text-gray-600 text-sm">Please provide your information</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <User className="w-4 h-4 inline mr-1" />
            Full Name *
          </label>
          <div className="relative">
            <input
              type="text"
              value={userDetails.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 ${
                getFieldStatus('name') === 'error'
                  ? 'border-red-300 focus:ring-red-500'
                  : getFieldStatus('name') === 'success'
                  ? 'border-green-300 focus:ring-green-500'
                  : 'border-gray-300 focus:ring-purple-500'
              }`}
              placeholder="Enter your full name"
            />
            {renderFieldIcon('name')}
          </div>
          {errors.name && touched.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Mail className="w-4 h-4 inline mr-1" />
            Email Address *
          </label>
          <div className="relative">
            <input
              type="email"
              value={userDetails.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 ${
                getFieldStatus('email') === 'error'
                  ? 'border-red-300 focus:ring-red-500'
                  : getFieldStatus('email') === 'success'
                  ? 'border-green-300 focus:ring-green-500'
                  : 'border-gray-300 focus:ring-purple-500'
              }`}
              placeholder="your.email@example.com"
            />
            {renderFieldIcon('email')}
          </div>
          {errors.email && touched.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Phone className="w-4 h-4 inline mr-1" />
            Phone Number *
          </label>
          <div className="relative">
            <input
              type="tel"
              value={userDetails.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              onBlur={() => handleBlur('phone')}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 ${
                getFieldStatus('phone') === 'error'
                  ? 'border-red-300 focus:ring-red-500'
                  : getFieldStatus('phone') === 'success'
                  ? 'border-green-300 focus:ring-green-500'
                  : 'border-gray-300 focus:ring-purple-500'
              }`}
              placeholder="10-digit mobile number"
              maxLength={10}
            />
            {renderFieldIcon('phone')}
          </div>
          {errors.phone && touched.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Aadhar */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <CreditCard className="w-4 h-4 inline mr-1" />
            Aadhar Number *
          </label>
          <div className="relative">
            <input
              type="text"
              value={userDetails.aadhar || ''}
              onChange={(e) => handleChange('aadhar', e.target.value)}
              onBlur={() => handleBlur('aadhar')}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 ${
                getFieldStatus('aadhar') === 'error'
                  ? 'border-red-300 focus:ring-red-500'
                  : getFieldStatus('aadhar') === 'success'
                  ? 'border-green-300 focus:ring-green-500'
                  : 'border-gray-300 focus:ring-purple-500'
              }`}
              placeholder="12-digit Aadhar number"
              maxLength={12}
            />
            {renderFieldIcon('aadhar')}
          </div>
          {errors.aadhar && touched.aadhar && (
            <p className="text-red-500 text-xs mt-1">{errors.aadhar}</p>
          )}
        </div>

        {/* PAN */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <CreditCard className="w-4 h-4 inline mr-1" />
            PAN Number <span className="text-gray-400 text-xs">(Optional)</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={userDetails.pan || ''}
              onChange={(e) => handleChange('pan', e.target.value)}
              onBlur={() => handleBlur('pan')}
              className={`w-full px-4 py-2.5 border rounded-lg uppercase focus:ring-2 ${
                getFieldStatus('pan') === 'error'
                  ? 'border-red-300 focus:ring-red-500'
                  : getFieldStatus('pan') === 'success'
                  ? 'border-green-300 focus:ring-green-500'
                  : 'border-gray-300 focus:ring-purple-500'
              }`}
              placeholder="ABCDE1234F"
              maxLength={10}
            />
            {renderFieldIcon('pan')}
          </div>
          {errors.pan && touched.pan && (
            <p className="text-red-500 text-xs mt-1">{errors.pan}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <MapPin className="w-4 h-4 inline mr-1" />
            Complete Address *
          </label>
          <div className="relative">
            <textarea
              value={userDetails.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              onBlur={() => handleBlur('address')}
              rows={2}
              className={`w-full px-4 py-2.5 border rounded-lg resize-none focus:ring-2 ${
                getFieldStatus('address') === 'error'
                  ? 'border-red-300 focus:ring-red-500'
                  : getFieldStatus('address') === 'success'
                  ? 'border-green-300 focus:ring-green-500'
                  : 'border-gray-300 focus:ring-purple-500'
              }`}
              placeholder="Enter your complete address"
            />
            {renderFieldIcon('address')}
          </div>
          {errors.address && touched.address && (
            <p className="text-red-500 text-xs mt-1">{errors.address}</p>
          )}
        </div>

        {/* Emergency Contact */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <PhoneCall className="w-4 h-4 inline mr-1" />
            Emergency Contact <span className="text-gray-400 text-xs">(Optional)</span>
          </label>
          <div className="relative">
            <input
              type="tel"
              value={userDetails.emergencyContact || ''}
              onChange={(e) => handleChange('emergencyContact', e.target.value)}
              onBlur={() => handleBlur('emergencyContact')}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 ${
                getFieldStatus('emergencyContact') === 'error'
                  ? 'border-red-300 focus:ring-red-500'
                  : getFieldStatus('emergencyContact') === 'success'
                  ? 'border-green-300 focus:ring-green-500'
                  : 'border-gray-300 focus:ring-purple-500'
              }`}
              placeholder="Emergency contact number"
              maxLength={10}
            />
            {renderFieldIcon('emergencyContact')}
          </div>
          {errors.emergencyContact && touched.emergencyContact && (
            <p className="text-red-500 text-xs mt-1">{errors.emergencyContact}</p>
          )}
        </div>
      </div>
    </div>
  );
}