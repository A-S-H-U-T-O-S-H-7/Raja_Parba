import React from 'react';
import { User, Phone, Mail, CreditCard, AlertTriangle } from 'lucide-react';

const FreePassPersonalInfo = ({ formData, errors, handleInputChange, handleBlur }) => {
  return (
    <div className="rounded-xl border border-sky-200 bg-sky-50/60 p-4 sm:rounded-2xl sm:p-5">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
        <User className="h-3.5 w-3.5" />
        Personal details
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {/* Name */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700 sm:text-sm">Full Name *</label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-400" />
            <input
              type="text" name="name" value={formData.name}
              onChange={handleInputChange} onBlur={handleBlur}
              placeholder="Enter full name"
              className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 ${errors.name ? 'border-red-400' : 'border-slate-200'}`}
            />
          </div>
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>

        {/* Mobile */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700 sm:text-sm">Mobile Number *</label>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-400" />
            <input
              type="text" name="mobile" value={formData.mobile} maxLength={10}
              onChange={handleInputChange} onBlur={handleBlur}
              placeholder="10 digit mobile"
              className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 ${errors.mobile ? 'border-red-400' : 'border-slate-200'}`}
            />
          </div>
          {errors.mobile && <p className="mt-1 text-xs text-red-600">{errors.mobile}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700 sm:text-sm">Email Address *</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-400" />
            <input
              type="email" name="email" value={formData.email}
              onChange={handleInputChange} onBlur={handleBlur}
              placeholder="Enter email"
              className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 ${errors.email ? 'border-red-400' : 'border-slate-200'}`}
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>

        {/* Aadhar */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700 sm:text-sm">Aadhar Number *</label>
          <div className="relative">
            <CreditCard className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-400" />
            <input
              type="text" name="aadharno" value={formData.aadharno} maxLength={12}
              onChange={handleInputChange} onBlur={handleBlur}
              placeholder="12 digit Aadhar"
              className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 ${errors.aadharno ? 'border-red-400' : 'border-slate-200'}`}
            />
          </div>
          {errors.aadharno && <p className="mt-1 text-xs text-red-600">{errors.aadharno}</p>}
        </div>
      </div>

      {/* Warning note */}
      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/80 p-3 sm:p-4">
        <div className="flex gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-900 sm:text-sm">Important verification note</p>
            <p className="mt-1 text-xs leading-5 text-slate-600 sm:text-sm sm:leading-6">
              Please provide your correct <span className="font-semibold text-slate-800">Aadhaar number</span> and{' '}
              <span className="font-semibold text-slate-800">mobile number</span> for verification. Incorrect details may result in{' '}
              <span className="font-semibold text-slate-800">cancellation of the pass</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreePassPersonalInfo;