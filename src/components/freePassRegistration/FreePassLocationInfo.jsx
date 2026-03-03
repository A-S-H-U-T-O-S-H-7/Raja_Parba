import React from 'react';
import { MapPin } from 'lucide-react';

const FreePassLocationInfo = ({ formData, errors, handleInputChange, handleBlur, countries, states, cities }) => {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 md:p-5">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
        <MapPin className="h-3.5 w-3.5" />
        Location details
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {/* Country */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">Country *</label>
          <select
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`w-full rounded-xl border bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 ${
              errors.country ? 'border-red-400' : 'border-slate-300'
            }`}
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country.iso2} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
          {errors.country && <p className="mt-1 text-xs text-red-600">{errors.country}</p>}
        </div>

        {/* State */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">State *</label>
          <select
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            onBlur={handleBlur}
            disabled={!states.length}
            className={`w-full rounded-xl border bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100 ${
              errors.state ? 'border-red-400' : 'border-slate-300'
            }`}
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state.iso2} value={state.name}>
                {state.name}
              </option>
            ))}
          </select>
          {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state}</p>}
        </div>

        {/* City */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">City *</label>
          <select
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            onBlur={handleBlur}
            disabled={!cities.length}
            className={`w-full rounded-xl border bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100 ${
              errors.city ? 'border-red-400' : 'border-slate-300'
            }`}
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city.id || city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
          {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
        </div>

        {/* Pincode */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">Pincode *</label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleInputChange}
            onBlur={handleBlur}
            maxLength={6}
            className={`w-full rounded-xl border bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 ${
              errors.pincode ? 'border-red-400' : 'border-slate-300'
            }`}
            placeholder="6-digit pincode"
          />
          {errors.pincode && <p className="mt-1 text-xs text-red-600">{errors.pincode}</p>}
        </div>
      </div>

      {/* Address */}
      <div className="mt-4">
        <label className="mb-1 block text-sm font-semibold text-slate-700">Complete Address *</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          onBlur={handleBlur}
          rows={2}
          className={`w-full resize-none rounded-xl border bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 ${
            errors.address ? 'border-red-400' : 'border-slate-300'
          }`}
          placeholder="Enter complete address"
        />
        {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
      </div>
    </div>
  );
};

export default FreePassLocationInfo;
