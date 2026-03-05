import React from 'react';
import { CalendarDays, Minus, Plus } from 'lucide-react';

const GENDERS = ['Male', 'Female', 'Other'];

const FreePassMembersInfo = ({
  formData,
  errors,
  memberErrors,
  totalPersons,
  onIncrementPersons,
  onDecrementPersons,
  handleMemberChange,
}) => {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-4 md:p-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">Number of Persons *</label>
          <div className={`flex items-center justify-between rounded-xl border bg-white px-2 py-1.5 ${
            errors.numberOfPersons ? 'border-red-400' : 'border-slate-300'
          }`}>
            <button
              type="button"
              onClick={onDecrementPersons}
              disabled={totalPersons <= 1}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-200 text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Decrease persons"
            >
              <Minus className="h-4 w-4" />
            </button>
            <div className="px-3 text-center">
              <p className="text-xl font-bold text-slate-900">{totalPersons}</p>
            </div>
            <button
              type="button"
              onClick={onIncrementPersons}
              disabled={totalPersons >= 20}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-200 text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Increase persons"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          {errors.numberOfPersons && <p className="mt-1 text-xs text-red-600">{errors.numberOfPersons}</p>}
        </div>

        <div className="rounded-xl border border-rose-300 bg-gradient-to-r from-rose-100 via-orange-50 to-emerald-100 p-3 shadow-sm">
          <p className="text-sm font-semibold text-rose-700">Free Pass Benefit</p>
          <p className="mt-1 text-xs text-slate-700">Single registration covers all 3 event days for all members.</p>
        </div>
      </div>

      {totalPersons > 1 ? (
        <div className="mt-5 space-y-4">
          {formData.members.map((member, index) => (
            <div key={`member-${index}`} className="rounded-xl border border-rose-200 bg-white p-4">
              <h4 className="mb-3 text-base font-semibold text-slate-800"> Member {index + 1}</h4>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
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
              </div>
            </div>
          ))}
        </div>
      ) : null}

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
