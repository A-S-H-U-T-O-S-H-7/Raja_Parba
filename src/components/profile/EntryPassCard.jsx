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

  return (
    <div className="overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200 bg-amber-100/70 px-4 py-3">
        <div className="flex items-center gap-2">
          <Ticket className="h-4 w-4 text-amber-700" />
          <p className="text-sm font-semibold text-amber-900">{isFreePass ? 'Free Entry Pass' : 'Entry Pass'}</p>
        </div>
        <span className={`rounded-full border px-2 py-1 text-xs font-medium ${getStatusClasses(booking.status)}`}>
          {booking.status === 'confirmed' ? (
            <span className="inline-flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" /> Confirmed</span>
          ) : (
            <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {booking.status || 'Pending'}</span>
          )}
        </span>
      </div>

      <div className="space-y-4 px-4 py-4">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
          <div className="rounded-xl border border-amber-100 bg-white/80 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Primary Contact</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{details?.name || 'N/A'}</p>
            <p className="text-xs text-slate-600">{details?.email || 'No email'}</p>
            <p className="inline-flex items-center gap-1 text-xs text-slate-600"><Phone className="h-3.5 w-3.5" /> {details?.mobile || 'No mobile'}</p>
            <p className="text-xs text-slate-600">Aadhar: {details?.aadharno || 'N/A'}</p>
          </div>

          <div className="rounded-xl border border-amber-100 bg-white/80 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pass Details</p>
            <p className="text-sm font-semibold text-slate-800">
              {isFreePass ? '13, 14, 15 June 2026' : `${eventDetails?.duration || '3'} day(s) pass`}
            </p>
            <p className="text-xs text-slate-600">Type: {isFreePass ? 'Free Entry Pass' : 'Entry Pass'}</p>
            <p className="text-xs text-slate-500">ID: {booking?.bookingId || booking?.id}</p>
          </div>

          <div className="rounded-xl border border-amber-100 bg-white/80 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Attendance</p>
            <p className="inline-flex items-center gap-1 text-sm font-semibold text-slate-800">
              <Users className="h-4 w-4 text-amber-700" />
              {eventDetails?.numberOfPersons || members.length || 1}
            </p>
            <p className="inline-flex items-center gap-1 text-xs text-slate-500">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(booking?.createdAt)}
            </p>
          </div>

          <div className="rounded-xl border border-amber-100 bg-white/80 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Address</p>
            <p className="inline-flex items-start gap-1 text-xs text-slate-700">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>
                {details?.address || 'N/A'}
                {details?.city ? `, ${details.city}` : ''}
                {details?.state ? `, ${details.state}` : ''}
                {details?.country ? `, ${details.country}` : ''}
                {details?.pincode ? ` - ${details.pincode}` : ''}
              </span>
            </p>
          </div>
        </div>

        {isFreePass && members.length > 0 && (
          <div className="rounded-xl border border-amber-200 bg-white/85 p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-700">Member Details</p>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
              {members.map((member, index) => (
                <div key={`${booking.id}-member-${index}`} className="rounded-lg border border-amber-100 bg-amber-50/60 p-3">
                  <p className="text-sm font-semibold text-slate-800">{member.name || `Member ${index + 1}`}</p>
                  <p className="text-xs text-slate-600">{member.phone || 'No phone'} | {member.gender || 'NA'} | Age {member.age || 'NA'}</p>
                  <p className="text-xs text-slate-600">Aadhar: {member.aadhar || 'N/A'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {booking.status === 'confirmed' && (
          <div className="text-right">
            <button
              type="button"
              onClick={() => setIsPassModalOpen(true)}
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
            >
              Pass & Receipt
            </button>
          </div>
        )}
      </div>

      <PassReceiptModal isOpen={isPassModalOpen} onClose={() => setIsPassModalOpen(false)} booking={booking} />
    </div>
  );
};

export default EntryPassCard;
