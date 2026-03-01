import React from 'react';
import { CalendarDays, Users } from 'lucide-react';

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
    <section className="rounded-2xl border border-cyan-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
          <Users className="h-5 w-5 text-cyan-600" />
          Pass Members
        </h3>
        <div className="rounded-full bg-cyan-50 px-4 py-1 text-sm font-medium text-cyan-700">
          Event Days: 13, 14, 15 June 2026
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Number of Persons *</label>
          <input
            type="number"
            name="numberOfPersons"
            min={0}
            max={20}
            value={formData.numberOfPersons}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`w-full rounded-xl border px-3 py-2 text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 ${errors.numberOfPersons ? 'border-red-500' : 'border-slate-300'}`}
          />
          {errors.numberOfPersons && <p className="mt-1 text-xs text-red-600">{errors.numberOfPersons}</p>}
        </div>
        <div className="rounded-xl border border-cyan-100 bg-gradient-to-r from-cyan-50 to-blue-50 p-3 text-sm text-slate-700">
          <p className="font-semibold text-slate-800">Free Pass Note</p>
          <p>No payment required. One pass booking covers all 3 event days.</p>
        </div>
      </div>

      {Number(formData.numberOfPersons) > 0 ? (
        <div className="mt-5 space-y-4">
          {formData.members.map((member, index) => (
            <div key={`member-${index}`} className="rounded-2xl border border-slate-200 p-4">
              <h4 className="mb-3 text-base font-semibold text-slate-900">Member {index + 1}</h4>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Name *</label>
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 ${memberErrors[index]?.name ? 'border-red-500' : 'border-slate-300'}`}
                    placeholder="Member full name"
                  />
                  {memberErrors[index]?.name && <p className="mt-1 text-xs text-red-600">{memberErrors[index].name}</p>}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Phone *</label>
                  <input
                    type="text"
                    value={member.phone}
                    onChange={(e) => handleMemberChange(index, 'phone', e.target.value)}
                    maxLength={10}
                    className={`w-full rounded-lg border px-3 py-2 text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 ${memberErrors[index]?.phone ? 'border-red-500' : 'border-slate-300'}`}
                    placeholder="10 digit mobile"
                  />
                  {memberErrors[index]?.phone && <p className="mt-1 text-xs text-red-600">{memberErrors[index].phone}</p>}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Gender *</label>
                  <select
                    value={member.gender}
                    onChange={(e) => handleMemberChange(index, 'gender', e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 ${memberErrors[index]?.gender ? 'border-red-500' : 'border-slate-300'}`}
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
                  <label className="mb-1 block text-sm font-medium text-slate-700">Age *</label>
                  <input
                    type="number"
                    value={member.age}
                    onChange={(e) => handleMemberChange(index, 'age', e.target.value)}
                    min={1}
                    max={120}
                    className={`w-full rounded-lg border px-3 py-2 text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 ${memberErrors[index]?.age ? 'border-red-500' : 'border-slate-300'}`}
                    placeholder="Age"
                  />
                  {memberErrors[index]?.age && <p className="mt-1 text-xs text-red-600">{memberErrors[index].age}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-slate-700">Aadhar Number *</label>
                  <input
                    type="text"
                    value={member.aadhar}
                    onChange={(e) => handleMemberChange(index, 'aadhar', e.target.value)}
                    maxLength={12}
                    className={`w-full rounded-lg border px-3 py-2 text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 ${memberErrors[index]?.aadhar ? 'border-red-500' : 'border-slate-300'}`}
                    placeholder="12 digit Aadhar"
                  />
                  {memberErrors[index]?.aadhar && <p className="mt-1 text-xs text-red-600">{memberErrors[index].aadhar}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          Member detail fields will appear after you enter number of persons.
        </div>
      )}

      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
        <p className="inline-flex items-center gap-2 font-medium">
          <CalendarDays className="h-4 w-4" />
          Please carry valid original ID proof for each member during all event dates.
        </p>
      </div>
    </section>
  );
};

export default FreePassMembersInfo;
