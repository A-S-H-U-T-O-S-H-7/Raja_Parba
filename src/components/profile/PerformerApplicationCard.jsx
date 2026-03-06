"use client";

import { useState } from 'react';
import { Calendar, CheckCircle, Clock, Mail, Mic, Music2, Phone, Users, MapPin, User, Ticket } from 'lucide-react';
import PassReceiptModal from '../PassReceiptModal';

const formatDate = (date) => {
  if (!date) return 'N/A';
  const d = date?.toDate ? date.toDate() : date?.seconds ? new Date(date.seconds * 1000) : new Date(date);
  if (Number.isNaN(d.getTime())) return 'N/A';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const getReviewStatusStyle = (status) => {
  const s = (status || '').toLowerCase();
  if (s === 'confirmed' || s === 'approved') return 'bg-green-100 text-green-700 border border-green-200';
  if (s === 'pending' || s === 'requested') return 'bg-cyan-100 text-cyan-700 border border-cyan-200';
  return 'bg-sky-100 text-sky-700 border border-sky-200';
};

const PerformerApplicationCard = ({ item }) => {
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const status = (item.status || item.reviewStatus || 'pending').toLowerCase();
  const isConfirmed = status === 'confirmed' || status === 'approved';
  const isPending = status === 'pending' || status === 'requested';
  const eventDate = item.performanceDate || item.eventDate || null;
  const eventTime = item.performanceTime || item.eventTime || null;
  const memberNames = Array.isArray(item.memberNames) ? item.memberNames.filter(Boolean) : [];
  const reviewLabel = item.reviewStatus || item.status || 'pending';

  return (
    <div className="overflow-hidden rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-50 shadow-md">

      {/* Header — deeper cyan gradient to stand apart */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-300 bg-gradient-to-r from-cyan-200 via-sky-200 to-cyan-100 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-500 shadow-sm">
            <Mic className="h-4 w-4 text-white" />
          </div>
          <p className="text-sm font-bold tracking-tight text-slate-800">Performer Application</p>
        </div>

        <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${
          isConfirmed
            ? 'border-green-200 bg-green-100 text-green-700'
            : 'border-cyan-300 bg-white/70 text-cyan-800'
        }`}>
          {isConfirmed
            ? <><CheckCircle className="h-3.5 w-3.5" /> Confirmed</>
            : <><Clock className="h-3.5 w-3.5" /> {isPending ? 'Pending' : 'In Review'}</>
          }
        </span>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">

        {/* Applicant */}
        <div className="rounded-xl border border-cyan-200 bg-white/80 p-3.5 shadow-sm">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-cyan-600">Applicant</p>
          <p className="text-sm font-bold leading-snug text-slate-800">{item.name || 'N/A'}</p>
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
            <Mail className="h-3 w-3 shrink-0 text-cyan-500" />
            <span className="truncate text-gray-600">{item.email || 'N/A'}</span>
          </p>
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
            <Phone className="h-3 w-3 shrink-0 text-cyan-500" />
            <span className='text-gray-600' >{item.phone || 'N/A'}</span>
          </p>
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
            <User className="h-3 w-3 shrink-0 text-cyan-500" />
            <span className="text-[10px] font-semibold uppercase text-slate-600">Gender :</span>
            <span className='text-gray-600'>{item.gender || 'N/A'}</span>
          </p>
          <p className="mt-1.5 flex items-start gap-1.5 text-xs text-slate-500">
            <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-cyan-500" />
            <span className="leading-relaxed">{item.address || 'N/A'}</span>
          </p>
        </div>

        {/* Performance */}
        <div className="rounded-xl border border-sky-200 bg-white/80 p-3.5 shadow-sm">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-sky-600">Performance</p>
          <p className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
            <Music2 className="h-4 w-4 shrink-0 text-sky-500" />
            <span className="truncate">{item.performanceType || item.performanceCategory || 'N/A'}</span>
          </p>
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
            <Users className="h-3 w-3 shrink-0 text-sky-500" />
            <span>{item.participationType || 'Solo'}</span>
          </p>
          <p className="mt-1.5 text-xs text-slate-500">
            <span className="font-semibold text-slate-600">Group:</span> {item.groupName || 'N/A'}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            <span className="font-semibold text-slate-600">Members:</span> {item.memberCount || '0'}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            <span className="font-semibold text-slate-600">Track:</span> {item.trackMusicName || 'N/A'}
            {item.trackDuration ? ` (${item.trackDuration})` : ''}
          </p>
        </div>

        {/* Timeline */}
        <div className="rounded-xl border border-blue-200 bg-white/80 p-3.5 shadow-sm sm:col-span-2 lg:col-span-1">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-blue-500">Timeline</p>
          <p className="flex items-center gap-1.5 text-xs text-slate-500">
            <Calendar className="h-3 w-3 shrink-0 text-blue-400" />
            Applied: {formatDate(item.createdAt)}
          </p>
          <p className="mt-2 inline-flex items-center rounded-md border border-cyan-200 bg-gradient-to-r from-cyan-50 to-sky-50 px-2.5 py-1 font-mono text-[11px] font-semibold text-cyan-700">
            ID: {item.registrationId || item.id}
          </p>

          {/* Highlighted review status */}
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</span>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${getReviewStatusStyle(reviewLabel)}`}>
              {reviewLabel}
            </span>
          </div>

          {/* Admin notes highlighted */}
          {item.adminNotes && (
            <div className="mt-2.5 rounded-lg border border-cyan-200 bg-cyan-50 p-2.5">
              <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-cyan-600">Notes</p>
              <p className="text-xs leading-relaxed text-slate-700">{item.adminNotes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Member names */}
      {memberNames.length > 0 && (
        <div className="border-t border-cyan-200 bg-white/60 px-5 py-3.5">
          <p className="mb-2.5 text-[10px] font-bold uppercase tracking-widest text-cyan-600">Group Members</p>
          <div className="flex flex-wrap gap-2">
            {memberNames.map((name, index) => (
              <span key={`${item.id}-member-${index}`} className="rounded-full border border-cyan-200 bg-cyan-100 px-3 py-1 text-xs font-medium text-cyan-800">
                {name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Confirmed performance footer */}
      {isConfirmed && (
        <div className="border-t border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 px-5 py-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-green-700">
            <CheckCircle className="h-3.5 w-3.5" />
            Confirmed Performance: {eventDate ? formatDate(eventDate) : 'Date pending'}
            {eventTime ? ` at ${eventTime}` : ''}
          </p>
        </div>
      )}

      <div className="border-t border-cyan-200 bg-white/70 px-5 py-3">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setIsPassModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:from-cyan-600 hover:via-sky-600 hover:to-blue-700 hover:shadow-lg active:scale-95"
          >
            <Ticket className="h-3.5 w-3.5" />
            Pass
          </button>
        </div>
      </div>

      <PassReceiptModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
        booking={item}
      />
    </div>
  );
};

export default PerformerApplicationCard;
