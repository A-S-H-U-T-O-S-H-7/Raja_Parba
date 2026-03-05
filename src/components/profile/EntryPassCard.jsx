"use client";
import { useState } from 'react';
import { Calendar, CheckCircle, Clock, MapPin, Phone, Ticket, Users } from 'lucide-react';
import PassReceiptModal from '../PassReceiptModal';

const formatDate = (value) => {
  if (!value) return 'N/A';
  const date = value?.toDate ? value.toDate() : value?.seconds ? new Date(value.seconds * 1000) : new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getStatusClasses = (status) => {
  if (status === 'confirmed') return 'bg-green-100 text-green-700 border-green-200';
  if (status === 'pending_payment') return 'bg-amber-100 text-amber-700 border-amber-200';
  return 'bg-slate-100 text-slate-700 border-slate-200';
};

const EntryPassCard = ({ booking }) => {
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);

  const isFreePass = booking?.category === 'free_pass' || booking?.eventDetails?.delegateType === 'freePass';
  const members = booking?.eventDetails?.members || [];
  const details = booking?.delegateDetails || {};
  const eventDetails = booking?.eventDetails || {};
  const personsFromField = Number(eventDetails?.numberOfPersons || 0);
  const totalPersons = personsFromField
    ? (members.length === personsFromField ? personsFromField + 1 : personsFromField)
    : (members.length + 1);

  return (
    <div className="overflow-hidden rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 via-orange-50 to-rose-50 shadow-md">
      {/* â”€â”€ Header â”€â”€ */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-200 bg-gradient-to-r from-purple-100 via-orange-50 to-rose-100 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 via-purple-400 to-purple-700 shadow-sm">
            <Ticket className="h-4 w-4 text-white" />
          </div>
          <p className="text-sm font-bold tracking-tight text-slate-800">
            {isFreePass ? 'Free Entry Pass' : 'Entry Pass'}
          </p>
        </div>

        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(booking.status)}`}>
          {booking.status === 'confirmed' ? (
            <span className="inline-flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5" /> Confirmed
            </span>
          ) : (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {booking.status || 'Pending'}
            </span>
          )}
        </span>
      </div>

      {/* â”€â”€ Body â”€â”€ */}
      <div className="space-y-4 px-5 py-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

          {/* Primary Contact */}
          <div className="rounded-xl border border-purple-200 bg-white/80 p-3.5 shadow-sm">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-purple-500">Primary Contact</p>
            <p className="text-sm font-bold leading-snug text-slate-800">{details?.name || 'N/A'}</p>
            <p className="mt-1 text-xs text-slate-500">{details?.email || 'No email'}</p>
            <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-slate-500">
              <Phone className="h-3 w-3 text-purple-500" /> {details?.mobile || 'No mobile'}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">Aadhar: {details?.aadharno || 'N/A'}</p>
          </div>

          {/* Pass Details */}
          <div className="rounded-xl border border-orange-200 bg-white/80 p-3.5 shadow-sm">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-orange-500">Pass Details</p>
            <p className="text-sm font-bold leading-snug text-slate-800">
              {isFreePass ? '13, 14, 15 June 2026' : `${eventDetails?.duration || '3'} Day Pass`}
            </p>
            <p className="mt-1 text-xs text-slate-500">Type: {isFreePass ? 'Free Entry Pass' : 'Entry Pass'}</p>
            <p className="mt-0.5 text-xs text-slate-400">ID: {booking?.bookingId || booking?.id}</p>
          </div>

          {/* Attendance */}
          <div className="rounded-xl border border-sky-200 bg-white/80 p-3.5 shadow-sm">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-sky-500">Attendance</p>
            <p className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-800">
              <Users className="h-4 w-4 text-sky-500" />
              {totalPersons} Person(s)
            </p>
            <div className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500">
              <Calendar className="h-3 w-3 text-sky-500" />
              <span>{formatDate(booking?.createdAt)}</span>
            </div>
          </div>

          {/* Address */}
          <div className="rounded-xl border border-rose-200 bg-white/80 p-3.5 shadow-sm">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-rose-500">Address</p>
            <div className="flex items-start gap-1.5">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-500" />
              <p className="text-xs leading-relaxed text-slate-600">
                {details?.address || 'N/A'}
                {details?.city ? `, ${details.city}` : ''}
                {details?.state ? `, ${details.state}` : ''}
                {details?.country ? `, ${details.country}` : ''}
                {details?.pincode ? ` - ${details.pincode}` : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Members */}
        {isFreePass && members.length > 0 && (
          <div className="rounded-xl border border-purple-200 bg-white/70 p-4 shadow-sm">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-purple-500">Member Details</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {members.map((member, index) => (
                <div key={`${booking.id}-member-${index}`} className="rounded-lg border border-purple-200 bg-purple-100/60 p-3">
                  <p className="text-sm font-semibold text-slate-800">{member.name || `Member ${index + 1}`}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{member.gender || 'NA'} - Age {member.age || 'NA'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        {booking.status === 'confirmed' && (
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={() => setIsPassModalOpen(true)}
              className="rounded-md bg-gradient-to-r from-purple-500 via-purple-400 to-purple-700 px-5 py-2 text-sm font-semibold text-white shadow-md transition-all hover:opacity-90 hover:shadow-lg active:scale-95"
            >
              Pass & Receipt
            </button>
          </div>
        )}
      </div>

      {/* Modal â€” untouched */}
      <PassReceiptModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
        booking={booking}
      />
    </div>
  );
};

export default EntryPassCard;

