import React from 'react';
import { CalendarDays } from 'lucide-react';

const GENDERS = ['Male', 'Female', 'Other'];

const FreePassMembersInfo = ({
  formData,
  errors,
  memberErrors,
  handleInputChange,
  handleMemberChange,
  handleBlur,
}) => {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-4 md:p-5">
      <div className="mb-4 flex justify-end">
        <div className="rounded-full border border-rose-300 bg-white px-4 py-1.5 text-sm font-semibold text-rose-700">
          Event: 13, 14, 15 June 2026
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">Number of Persons *</label>
          <input
            type="number"
            name="numberOfPersons"
            min={0}
            max={20}
            value={formData.numberOfPersons}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`w-full rounded-xl border bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100 ${
              errors.numberOfPersons ? 'border-red-400' : 'border-slate-300'
            }`}
          />
          {errors.numberOfPersons && <p className="mt-1 text-xs text-red-600">{errors.numberOfPersons}</p>}
        </div>

        <div className="rounded-xl border border-rose-200 bg-white p-3">
          <p className="text-sm font-semibold text-rose-700">Free Pass Benefit</p>
          <p className="mt-1 text-xs text-slate-600">Single registration covers all 3 event days for all members.</p>
        </div>
      </div>

      {Number(formData.numberOfPersons) > 0 ? (
        <div className="mt-5 space-y-4">
          {formData.members.map((member, index) => (
            <div key={`member-${index}`} className="rounded-xl border border-rose-200 bg-white p-4">
              <h4 className="mb-3 text-base font-semibold text-slate-800">Member {index + 1}</h4>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                    className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100 ${
                      memberErrors[index]?.name ? 'border-red-400' : 'border-slate-300'
                    }`}
                    placeholder="Member full name"
                  />
                  {memberErrors[index]?.name && <p className="mt-1 text-xs text-red-600">{memberErrors[index].name}</p>}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">Phone *</label>
                  <input
                    type="text"
                    value={member.phone}
                    onChange={(e) => handleMemberChange(index, 'phone', e.target.value)}
                    maxLength={10}
                    className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100 ${
                      memberErrors[index]?.phone ? 'border-red-400' : 'border-slate-300'
                    }`}
                    placeholder="10 digit mobile"
                  />
                  {memberErrors[index]?.phone && <p className="mt-1 text-xs text-red-600">{memberErrors[index].phone}</p>}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">Gender *</label>
                  <select
                    value={member.gender}
                    onChange={(e) => handleMemberChange(index, 'gender', e.target.value)}
                    className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100 ${
                      memberErrors[index]?.gender ? 'border-red-400' : 'border-slate-300'
                    }`}
                  >
                    <option value="">Select Gender</option>
                    {GENDERS.map((gender) => (
                      <option key={gender} value={gender}>
                        {gender}
                      </option>
                    ))}
                  </select>
                  {memberErrors[index]?.gender && <p className="mt-1 text-xs text-red-600">{memberErrors[index].gender}</p>}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">Age *</label>
                  <input
                    type="number"
                    value={member.age}
                    onChange={(e) => handleMemberChange(index, 'age', e.target.value)}
                    min={1}
                    max={120}
                    className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100 ${
                      memberErrors[index]?.age ? 'border-red-400' : 'border-slate-300'
                    }`}
                    placeholder="Age"
                  />
                  {memberErrors[index]?.age && <p className="mt-1 text-xs text-red-600">{memberErrors[index].age}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block text-xs font-semibold text-slate-700">Aadhar Number *</label>
                  <input
                    type="text"
                    value={member.aadhar}
                    onChange={(e) => handleMemberChange(index, 'aadhar', e.target.value)}
                    maxLength={12}
                    className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100 ${
                      memberErrors[index]?.aadhar ? 'border-red-400' : 'border-slate-300'
                    }`}
                    placeholder="12 digit Aadhar"
                  />
                  {memberErrors[index]?.aadhar && <p className="mt-1 text-xs text-red-600">{memberErrors[index].aadhar}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-rose-200 bg-white p-6 text-center">
          <p className="text-sm text-slate-600">Member details will appear after selecting number of persons.</p>
        </div>
      )}

      <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-3">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-amber-800">
          <CalendarDays className="h-4 w-4" />
          Please carry valid original ID proof for each member on all event days
        </p>
      </div>
    </div>
  );
};

export default FreePassMembersInfo;
