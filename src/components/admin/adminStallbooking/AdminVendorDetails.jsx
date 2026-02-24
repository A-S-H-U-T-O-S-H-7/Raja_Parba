// components/admin/bookings/stalls/AdminVendorDetails.jsx
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
  CheckCircle,
  IdCard,
  Briefcase
} from 'lucide-react';
import useStallBookingStore from '@/lib/stores/useStallBookingStore';
import useThemeStore from '@/lib/stores/useThemeStore';

const businessTypes = [
  'Food & Beverages', 'Clothing & Textiles', 'Handicrafts & Art',
  'Jewelry & Accessories', 'Books & Literature', 'Religious Items',
  'Electronics & Gadgets', 'Health & Wellness', 'Beauty & Cosmetics',
  'Home & Garden', 'Toys & Games', 'Sports & Fitness', 'Other'
];

export default function AdminVendorDetails() {
  const { isDarkMode } = useThemeStore();
  const { vendorDetails, updateVendorDetails } = useStallBookingStore();
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validation functions
  const validateField = (field, value) => {
    switch(field) {
      case 'businessType':
        return value ? '' : 'Business type is required';
      case 'ownerName':
        return value?.length >= 3 ? '' : 'Name must be at least 3 characters';
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Enter a valid email address';
      case 'phone':
        return /^[6-9]\d{9}$/.test(value?.replace(/\D/g, '')) ? '' : 'Enter a valid 10-digit mobile number';
      case 'address':
        return value?.length >= 5 ? '' : 'Address must be at least 5 characters';
      case 'aadhar':
        const cleanAadhar = value?.replace(/\s/g, '');
        return /^[2-9]\d{11}$/.test(cleanAadhar) ? '' : 'Enter a valid 12-digit Aadhar number';
      case 'pan':
        if (!value) return ''; // PAN is optional
        return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value) ? '' : 'Enter a valid PAN (e.g., ABCDE1234F)';
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
      // Format Aadhar with spaces
      if (value.length > 4) {
        value = value.slice(0, 4) + ' ' + value.slice(4);
      }
      if (value.length > 9) {
        value = value.slice(0, 9) + ' ' + value.slice(9);
      }
    } else if (field === 'pan') {
      value = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    }

    updateVendorDetails({ [field]: value });
    
    // Validate on change
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, vendorDetails[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  // Check if form is valid
  const isFormValid = () => {
    const requiredFields = ['businessType', 'ownerName', 'email', 'phone', 'address', 'aadhar'];
    return requiredFields.every(field => 
      vendorDetails[field] && !validateField(field, vendorDetails[field])
    );
  };

  useEffect(() => {
    // Notify parent component about validation status
    const isValid = isFormValid();
    // You can emit this to parent if needed
  }, [vendorDetails]);

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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Vendor Information
        </h2>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Enter vendor details for the stall booking
        </p>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Business Type */}
        <div>
          <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <Briefcase className="w-4 h-4 text-emerald-500" />
            Business Type <span className="text-red-500">*</span>
          </label>
          <select
            value={vendorDetails.businessType || ''}
            onChange={(e) => handleChange('businessType', e.target.value)}
            onBlur={() => handleBlur('businessType')}
            className={`w-full px-4 py-3 rounded-xl border transition-all ${
              getFieldStatus('businessType') === 'error'
                ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-700'
                : getFieldStatus('businessType') === 'success'
                ? 'border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-700'
                : isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
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
        <div>
          <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <User className="w-4 h-4 text-emerald-500" />
            Contact Person <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={vendorDetails.ownerName || ''}
              onChange={(e) => handleChange('ownerName', e.target.value)}
              onBlur={() => handleBlur('ownerName')}
              className={`w-full px-4 py-3 rounded-xl border transition-all ${
                getFieldStatus('ownerName') === 'error'
                  ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-700'
                  : getFieldStatus('ownerName') === 'success'
                  ? 'border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-700'
                  : isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
              placeholder="Vendor's full name"
            />
            <div className="absolute right-3 top-3">
              {renderFieldIcon('ownerName')}
            </div>
          </div>
          {errors.ownerName && touched.ownerName && (
            <p className="text-red-500 text-xs mt-1">{errors.ownerName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <Mail className="w-4 h-4 text-emerald-500" />
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="email"
              value={vendorDetails.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              className={`w-full px-4 py-3 rounded-xl border transition-all ${
                getFieldStatus('email') === 'error'
                  ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-700'
                  : getFieldStatus('email') === 'success'
                  ? 'border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-700'
                  : isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
              placeholder="vendor@example.com"
            />
            <div className="absolute right-3 top-3">
              {renderFieldIcon('email')}
            </div>
          </div>
          {errors.email && touched.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <Phone className="w-4 h-4 text-emerald-500" />
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="tel"
              value={vendorDetails.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              onBlur={() => handleBlur('phone')}
              className={`w-full px-4 py-3 rounded-xl border transition-all ${
                getFieldStatus('phone') === 'error'
                  ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-700'
                  : getFieldStatus('phone') === 'success'
                  ? 'border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-700'
                  : isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
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

        {/* Aadhar */}
        <div>
          <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <IdCard className="w-4 h-4 text-emerald-500" />
            Aadhar Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={vendorDetails.aadhar || ''}
              onChange={(e) => handleChange('aadhar', e.target.value)}
              onBlur={() => handleBlur('aadhar')}
              className={`w-full px-4 py-3 rounded-xl border transition-all ${
                getFieldStatus('aadhar') === 'error'
                  ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-700'
                  : getFieldStatus('aadhar') === 'success'
                  ? 'border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-700'
                  : isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
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

        {/* PAN (Optional) */}
        <div>
          <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <CreditCard className="w-4 h-4 text-emerald-500" />
            PAN Number <span className="text-gray-400 text-xs">(Optional)</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={vendorDetails.pan || ''}
              onChange={(e) => handleChange('pan', e.target.value)}
              onBlur={() => handleBlur('pan')}
              className={`w-full px-4 py-3 rounded-xl border transition-all uppercase ${
                getFieldStatus('pan') === 'error'
                  ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-700'
                  : getFieldStatus('pan') === 'success'
                  ? 'border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-700'
                  : isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
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

        {/* Address - Full Width */}
        <div className="col-span-1 md:col-span-2">
          <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <MapPin className="w-4 h-4 text-emerald-500" />
            Complete Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <textarea
              value={vendorDetails.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              onBlur={() => handleBlur('address')}
              rows={3}
              className={`w-full px-4 py-3 rounded-xl border transition-all resize-none ${
                getFieldStatus('address') === 'error'
                  ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-700'
                  : getFieldStatus('address') === 'success'
                  ? 'border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-700'
                  : isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
              placeholder="Enter vendor's complete address with city, state, pincode"
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

      {/* Progress Indicator */}
      <div className={`mt-6 p-4 rounded-xl ${
        isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Form Completion
          </span>
          <span className={`text-sm font-bold ${
            isFormValid() ? 'text-green-600' : 'text-orange-600'
          }`}>
            {isFormValid() ? '✓ Valid' : 'Incomplete'}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${Object.values(vendorDetails).filter(v => v).length / 7 * 100}%` 
            }}
          ></div>
        </div>
        <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {isFormValid() 
            ? 'All required fields are filled correctly' 
            : 'Please fill all required fields marked with *'}
        </p>
      </div>
    </div>
  );
}