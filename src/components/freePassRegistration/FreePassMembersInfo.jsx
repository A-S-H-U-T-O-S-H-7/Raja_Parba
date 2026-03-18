import React from 'react';
import { CalendarDays, Minus, Plus } from 'lucide-react';

const GENDERS = ['Male', 'Female', 'Other'];

const FreePassMembersInfo = ({ formData, errors, memberErrors, totalPersons, onIncrementPersons, onDecrementPersons, handleMemberChange }) => {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4 sm:rounded-2xl sm:p-5">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
        Group members
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {/* Counter */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700 sm:text-sm">Number of Persons *</label>
          <div className={`flex items-center justify-between rounded-xl border bg-white px-2 py-1.5 ${errors.numberOfPersons ? 'border-red-400' : 'border-slate-200'}`}>
            <button type="button" onClick={onDecrementPersons} disabled={totalPersons <= 1}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-200 text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40">
              <Minus className="h-4 w-4" />
            </button>
            <p className="text-xl font-bold text-slate-900">{totalPersons}</p>
            <button type="button" onClick={onIncrementPersons} disabled={totalPersons >= 20}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-200 text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40">
              <Plus className="h-4 w-4" />
            </button>
          </div>
          {errors.numberOfPersons && <p className="mt-1 text-xs text-red-600">{errors.numberOfPersons}</p>}
        </div>

        {/* Benefit pill */}
        <div className="flex items-center rounded-xl border border-rose-200 bg-gradient-to-r from-rose-100/80 via-orange-50 to-emerald-100/80 p-3">
          <div>
            <p className="text-xs font-semibold text-rose-700 sm:text-sm">Free Pass Benefit</p>
            <p className="mt-0.5 text-xs text-slate-600">One registration covers all 3 event days for all members.</p>
          </div>
        </div>
      </div>

      {/* Member cards */}
      {totalPersons > 1 && (
        <div className="mt-4 space-y-3">
          {formData.members.map((member, index) => (
            <div key={`member-${index}`} className="rounded-xl border border-rose-200 bg-white p-3 sm:p-4">
              <h4 className="mb-3 text-sm font-semibold text-slate-800">Member {index + 1}</h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">Full Name *</label>
                  <input type="text" value={member.name} onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                    placeholder="Member full name"
                    className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100 ${memberErrors[index]?.name ? 'border-red-400' : 'border-slate-200'}`}
                  />
                  {memberErrors[index]?.name && <p className="mt-1 text-xs text-red-600">{memberErrors[index].name}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">Gender *</label>
                  <select value={member.gender} onChange={(e) => handleMemberChange(index, 'gender', e.target.value)}
                    className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100 ${memberErrors[index]?.gender ? 'border-red-400' : 'border-slate-200'}`}>
                    <option value="">Select Gender</option>
                    {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                  {memberErrors[index]?.gender && <p className="mt-1 text-xs text-red-600">{memberErrors[index].gender}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">Age *</label>
                  <input type="number" value={member.age} onChange={(e) => handleMemberChange(index, 'age', e.target.value)} min={1} max={120}
                    placeholder="Age"
                    className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100 ${memberErrors[index]?.age ? 'border-red-400' : 'border-slate-200'}`}
                  />
                  {memberErrors[index]?.age && <p className="mt-1 text-xs text-red-600">{memberErrors[index].age}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ID reminder */}
      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
        <p className="flex items-start gap-2 text-xs font-semibold text-amber-800 sm:text-sm">
          <CalendarDays className="mt-0.5 h-4 w-4 shrink-0" />
          Please carry valid original ID proof for each member on all event days
        </p>
      </div>
    </div>
  );
};

export default FreePassMembersInfo;