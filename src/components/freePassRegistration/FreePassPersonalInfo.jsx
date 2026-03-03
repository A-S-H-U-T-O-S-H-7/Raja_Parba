import React from 'react';
import { User, Phone, Mail, CreditCard } from 'lucide-react';

const FreePassPersonalInfo = ({ formData, errors, handleInputChange, handleBlur }) => {
  return (
    <div className="rounded-2xl border border-sky-200 bg-sky-50/70 p-4 md:p-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Name */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">Full Name *</label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-500" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 ${
                errors.name ? 'border-red-400' : 'border-slate-300'
              }`}
              placeholder="Enter full name"
            />
          </div>
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>

        {/* Mobile */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">Mobile Number *</label>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-500" />
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              onBlur={handleBlur}
              maxLength={10}
              className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 ${
                errors.mobile ? 'border-red-400' : 'border-slate-300'
              }`}
              placeholder="10 digit mobile"
            />
          </div>
          {errors.mobile && <p className="mt-1 text-xs text-red-600">{errors.mobile}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">Email Address *</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-500" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 ${
                errors.email ? 'border-red-400' : 'border-slate-300'
              }`}
              placeholder="Enter email"
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>

        {/* Aadhar */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">Aadhar Number *</label>
          <div className="relative">
            <CreditCard className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-500" />
            <input
              type="text"
              name="aadharno"
              value={formData.aadharno}
              onChange={handleInputChange}
              onBlur={handleBlur}
              maxLength={12}
              className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 ${
                errors.aadharno ? 'border-red-400' : 'border-slate-300'
              }`}
              placeholder="12 digit Aadhar"
            />
          </div>
          {errors.aadharno && <p className="mt-1 text-xs text-red-600">{errors.aadharno}</p>}
        </div>
      </div>
    </div>
  );
};

export default FreePassPersonalInfo;
