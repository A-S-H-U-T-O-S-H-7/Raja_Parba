import React from 'react';
import { MapPin } from 'lucide-react';

const FreePassLocationInfo = ({ formData, errors, handleInputChange, handleBlur, countries, states, cities }) => {
  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 sm:rounded-2xl sm:p-5">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
        <MapPin className="h-3.5 w-3.5" />
        Location details
      </div>

      {/* 2-col on mobile, 4-col on md+ */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {/* Country */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700 sm:text-sm">Country *</label>
          <select
            name="country" value={formData.country} onChange={handleInputChange} onBlur={handleBlur}
            className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 ${errors.country ? 'border-red-400' : 'border-slate-200'}`}
          >
            <option value="">Select Country</option>
            {countries.map((c) => <option key={c.iso2} value={c.name}>{c.name}</option>)}
          </select>
          {errors.country && <p className="mt-1 text-xs text-red-600">{errors.country}</p>}
        </div>

        {/* State */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700 sm:text-sm">State *</label>
          <select
            name="state" value={formData.state} onChange={handleInputChange} onBlur={handleBlur} disabled={!states.length}
            className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100 ${errors.state ? 'border-red-400' : 'border-slate-200'}`}
          >
            <option value="">Select State</option>
            {states.map((s) => <option key={s.iso2} value={s.name}>{s.name}</option>)}
          </select>
          {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state}</p>}
        </div>

        {/* City */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700 sm:text-sm">City *</label>
          <select
            name="city" value={formData.city} onChange={handleInputChange} onBlur={handleBlur} disabled={!cities.length}
            className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100 ${errors.city ? 'border-red-400' : 'border-slate-200'}`}
          >
            <option value="">Select City</option>
            {cities.map((c) => <option key={c.id || c.name} value={c.name}>{c.name}</option>)}
          </select>
          {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
        </div>

        {/* Pincode */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700 sm:text-sm">Pincode *</label>
          <input
            type="text" name="pincode" value={formData.pincode} maxLength={6}
            onChange={handleInputChange} onBlur={handleBlur}
            placeholder="6-digit"
            className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 ${errors.pincode ? 'border-red-400' : 'border-slate-200'}`}
          />
          {errors.pincode && <p className="mt-1 text-xs text-red-600">{errors.pincode}</p>}
        </div>
      </div>

      {/* Address — full width */}
      <div className="mt-3">
        <label className="mb-1 block text-xs font-semibold text-slate-700 sm:text-sm">Complete Address *</label>
        <textarea
          name="address" value={formData.address} onChange={handleInputChange} onBlur={handleBlur} rows={2}
          placeholder="Enter complete address"
          className={`w-full resize-none rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 ${errors.address ? 'border-red-400' : 'border-slate-200'}`}
        />
        {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
      </div>
    </div>
  );
};

export default FreePassLocationInfo;
