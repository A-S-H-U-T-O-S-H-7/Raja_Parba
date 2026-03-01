import React from 'react';
import { MapPin } from 'lucide-react';

const FreePassLocationInfo = ({ formData, errors, handleInputChange, handleBlur, countries, states, cities }) => {
  return (
    <section className="rounded-2xl border border-cyan-100 bg-white p-5 shadow-sm">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
        <MapPin className="h-5 w-5 text-cyan-600" />
        Location Details
      </h3>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Country *</label>
          <select
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`w-full rounded-xl border px-3 py-2 text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 ${errors.country ? 'border-red-500' : 'border-slate-300'}`}
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

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">State *</label>
          <select
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            onBlur={handleBlur}
            disabled={!states.length}
            className={`w-full rounded-xl border px-3 py-2 text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 disabled:bg-slate-100 ${errors.state ? 'border-red-500' : 'border-slate-300'}`}
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

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">City *</label>
          <select
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            onBlur={handleBlur}
            disabled={!cities.length}
            className={`w-full rounded-xl border px-3 py-2 text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 disabled:bg-slate-100 ${errors.city ? 'border-red-500' : 'border-slate-300'}`}
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

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Pincode *</label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleInputChange}
            onBlur={handleBlur}
            maxLength={6}
            className={`w-full rounded-xl border px-3 py-2 text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 ${errors.pincode ? 'border-red-500' : 'border-slate-300'}`}
            placeholder="6-digit pincode"
          />
          {errors.pincode && <p className="mt-1 text-xs text-red-600">{errors.pincode}</p>}
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1 block text-sm font-medium text-slate-700">Complete Address *</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          onBlur={handleBlur}
          rows={2}
          className={`w-full resize-none rounded-xl border px-3 py-2 text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 ${errors.address ? 'border-red-500' : 'border-slate-300'}`}
          placeholder="Enter complete address"
        />
        {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
      </div>
    </section>
  );
};

export default FreePassLocationInfo;
