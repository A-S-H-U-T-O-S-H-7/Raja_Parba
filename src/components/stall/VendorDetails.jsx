// components/stall/VendorDetails.jsx
"use client";
import { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  CreditCard, 
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import useUserStallBookingStore from '@/lib/stores/useUserStallBookingStore';
import useAuthStore from '@/lib/stores/useAuthStore';

const businessTypes = [
  'Food & Beverages', 'Clothing & Textiles', 'Handicrafts & Art',
  'Jewelry & Accessories', 'Books & Literature', 'Religious Items',
  'Electronics & Gadgets', 'Health & Wellness', 'Beauty & Cosmetics',
  'Home & Garden', 'Toys & Games', 'Sports & Fitness', 'Other'
];

export default function VendorDetails() {
  const { vendorDetails, updateVendorDetails, setVendorDetailsValid } = useUserStallBookingStore();
  const { user } = useAuthStore();
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Auto-fill email from user account
  useEffect(() => {
    if (user?.email && !vendorDetails.email) {
      updateVendorDetails('email', user.email);
    }
  }, [user, vendorDetails.email, updateVendorDetails]);

  // Validate form on changes
  useEffect(() => {
    const isValid = validateForm();
    setVendorDetailsValid(isValid);
  }, [vendorDetails, setVendorDetailsValid]);

  const validateField = (field, value) => {
    switch(field) {
      case 'businessType':
        return value ? '' : 'Please select a business type';
      case 'ownerName':
        return value?.length >= 3 ? '' : 'Name must be at least 3 characters';
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Enter a valid email address';
      case 'phone':
        return /^[6-9]\d{9}$/.test(value) ? '' : 'Enter a valid 10-digit mobile number';
      case 'aadhar':
        const cleanAadhar = value?.replace(/\s/g, '');
        return /^[2-9]\d{11}$/.test(cleanAadhar) ? '' : 'Enter a valid 12-digit Aadhar number';
      case 'pan':
        if (!value) return '';
        return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value) ? '' : 'Enter a valid PAN (e.g., ABCDE1234F)';
      case 'address':
        return value?.length >= 5 ? '' : 'Address must be at least 5 characters';
      default:
        return '';
    }
  };

  const handleChange = (field, value) => {
    // Format input
    if (field === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 10);
    } else if (field === 'aadhar') {
      value = value.replace(/\D/g, '').slice(0, 12);
      if (value.length > 4) {
        value = value.slice(0, 4) + ' ' + value.slice(4);
      }
      if (value.length > 9) {
        value = value.slice(0, 9) + ' ' + value.slice(9);
      }
    } else if (field === 'pan') {
      value = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    }

    updateVendorDetails(field, value);
    
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, vendorDetails[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const validateForm = () => {
    const requiredFields = ['businessType', 'ownerName', 'email', 'phone', 'aadhar', 'address'];
    return requiredFields.every(field => 
      vendorDetails[field] && !validateField(field, vendorDetails[field])
    );
  };

  const getFieldStatus = (field) => {
    if (!touched[field] || !vendorDetails[field]) return null;
    return errors[field] ? 'error' : 'success';
  };

  const renderFieldIcon = (field) => {
    const status = getFieldStatus(field);
    if (status === 'success') {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    if (status === 'error') {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto p-2">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg mb-3">
          <Building className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Vendor Information</h2>
        <p className="text-gray-600">Complete your booking details</p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Business Type */}
            <div className="lg:col-span-1">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Building className="w-4 h-4 text-blue-500" />
                Business Type *
              </label>
              <select
                value={vendorDetails.businessType || ''}
                onChange={(e) => handleChange('businessType', e.target.value)}
                onBlur={() => handleBlur('businessType')}
                className={`w-full px-3 py-2.5 text-sm border-2 rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  getFieldStatus('businessType') === 'error'
                    ? 'border-red-300 bg-red-50'
                    : getFieldStatus('businessType') === 'success'
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <option value="">Select business type</option>
                {businessTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.businessType && touched.businessType && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.businessType}
                </p>
              )}
            </div>

            {/* Contact Person */}
            <div className="lg:col-span-1">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 text-green-500" />
                Contact Person *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={vendorDetails.ownerName || ''}
                  onChange={(e) => handleChange('ownerName', e.target.value)}
                  onBlur={() => handleBlur('ownerName')}
                  className={`w-full px-3 py-2.5 text-sm border-2 rounded-lg focus:ring-2 focus:ring-green-500 ${
                    getFieldStatus('ownerName') === 'error'
                      ? 'border-red-300 bg-red-50'
                      : getFieldStatus('ownerName') === 'success'
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="Your full name"
                />
                <div className="absolute right-3 top-3">
                  {renderFieldIcon('ownerName')}
                </div>
              </div>
              {errors.ownerName && touched.ownerName && (
                <p className="text-red-500 text-xs mt-1">{errors.ownerName}</p>
              )}
            </div>

            {/* Phone */}
            <div className="lg:col-span-1">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 text-orange-500" />
                Mobile Number *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={vendorDetails.phone || ''}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  onBlur={() => handleBlur('phone')}
                  className={`w-full px-3 py-2.5 text-sm border-2 rounded-lg focus:ring-2 focus:ring-orange-500 ${
                    getFieldStatus('phone') === 'error'
                      ? 'border-red-300 bg-red-50'
                      : getFieldStatus('phone') === 'success'
                      ? 'border-orange-300 bg-orange-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                />
                <div className="absolute right-3 top-3">
                  {renderFieldIcon('phone')}
                </div>
              </div>
              {errors.phone && touched.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Email */}
            <div className="lg:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 text-purple-500" />
                Email Address *
                {user?.email && vendorDetails.email === user.email && (
                  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Auto-filled</span>
                )}
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={vendorDetails.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  className={`w-full px-3 py-2.5 text-sm border-2 rounded-lg focus:ring-2 focus:ring-purple-500 ${
                    getFieldStatus('email') === 'error'
                      ? 'border-red-300 bg-red-50'
                      : getFieldStatus('email') === 'success'
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="your.email@example.com"
                />
                <div className="absolute right-3 top-3">
                  {renderFieldIcon('email')}
                </div>
              </div>
              {errors.email && touched.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Aadhar */}
            <div className="lg:col-span-1">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <CreditCard className="w-4 h-4 text-pink-500" />
                Aadhar Number *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={vendorDetails.aadhar || ''}
                  onChange={(e) => handleChange('aadhar', e.target.value)}
                  onBlur={() => handleBlur('aadhar')}
                  className={`w-full px-3 py-2.5 text-sm border-2 rounded-lg focus:ring-2 focus:ring-pink-500 ${
                    getFieldStatus('aadhar') === 'error'
                      ? 'border-red-300 bg-red-50'
                      : getFieldStatus('aadhar') === 'success'
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="XXXX XXXX XXXX"
                  maxLength={14}
                />
                <div className="absolute right-3 top-3">
                  {renderFieldIcon('aadhar')}
                </div>
              </div>
              {errors.aadhar && touched.aadhar && (
                <p className="text-red-500 text-xs mt-1">{errors.aadhar}</p>
              )}
            </div>

            {/* PAN */}
            <div className="lg:col-span-1">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <CreditCard className="w-4 h-4 text-yellow-500" />
                PAN Number <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={vendorDetails.pan || ''}
                  onChange={(e) => handleChange('pan', e.target.value)}
                  onBlur={() => handleBlur('pan')}
                  className={`w-full px-3 py-2.5 text-sm border-2 rounded-lg uppercase focus:ring-2 focus:ring-yellow-500 ${
                    getFieldStatus('pan') === 'error'
                      ? 'border-red-300 bg-red-50'
                      : getFieldStatus('pan') === 'success'
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                />
                <div className="absolute right-3 top-3">
                  {renderFieldIcon('pan')}
                </div>
              </div>
              {errors.pan && touched.pan && (
                <p className="text-red-500 text-xs mt-1">{errors.pan}</p>
              )}
            </div>

            {/* Address */}
            <div className="col-span-full">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 text-indigo-500" />
                Complete Address *
              </label>
              <div className="relative">
                <textarea
                  value={vendorDetails.address || ''}
                  onChange={(e) => handleChange('address', e.target.value)}
                  onBlur={() => handleBlur('address')}
                  rows={2}
                  className={`w-full px-3 py-2.5 text-sm border-2 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 ${
                    getFieldStatus('address') === 'error'
                      ? 'border-red-300 bg-red-50'
                      : getFieldStatus('address') === 'success'
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="Enter complete address"
                />
                <div className="absolute right-3 top-3">
                  {renderFieldIcon('address')}
                </div>
              </div>
              {errors.address && touched.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
              )}
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-1 text-sm">
            <span>ℹ️</span>
            Important Notes
          </h4>
          <ul className="text-xs text-blue-700 space-y-0.5">
            <li>• Valid for entire 3-day event</li>
            <li>• Basic facilities included</li>
            <li>• Setup: 2hrs before start</li>
          </ul>
        </div>
      </div>
    </div>
  );
}