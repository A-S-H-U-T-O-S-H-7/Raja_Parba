import { Building2, Calendar, CheckCircle, Clock, Mail, MapPin, Phone, Star } from 'lucide-react';

const formatDate = (date) => {
  if (!date) return 'N/A';
  const d = date?.toDate ? date.toDate() : date?.seconds ? new Date(date.seconds * 1000) : new Date(date);
  if (Number.isNaN(d.getTime())) return 'N/A';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const getReviewStatusStyle = (status) => {
  const s = (status || '').toLowerCase();
  if (s === 'confirmed' || s === 'approved')
    return 'bg-green-100 text-green-700 border border-green-200';
  if (s === 'pending' || s === 'requested')
    return 'bg-orange-100 text-orange-700 border border-orange-200';
  return 'bg-amber-100 text-amber-700 border border-amber-200';
};

const SponsorApplicationCard = ({ item }) => {
  const status = (item.status || item.reviewStatus || 'requested').toLowerCase();
  const isConfirmed = status === 'confirmed' || status === 'approved';
  const isRequested = status === 'requested' || status === 'pending';
  const confirmedDate = item.confirmedAt || item.updatedAt;
  const reviewLabel = item.reviewStatus || item.status || 'requested';

  return (
    <div className="overflow-hidden rounded-2xl border border-orange-200 bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 shadow-md">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-orange-200 bg-gradient-to-r from-yellow-100 via-orange-100 to-amber-100 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-400 via-orange-400 to-amber-500 shadow-sm">
            <Star className="h-4 w-4 text-white" />
          </div>
          <p className="text-sm font-bold tracking-tight text-slate-800">Sponsor Request</p>
        </div>

        <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${
          isConfirmed
            ? 'border-green-200 bg-green-100 text-green-700'
            : 'border-orange-200 bg-orange-100 text-orange-700'
        }`}>
          {isConfirmed
            ? <><CheckCircle className="h-3.5 w-3.5" /> Confirmed</>
            : <><Clock className="h-3.5 w-3.5" /> {isRequested ? 'Requested' : 'In Review'}</>
          }
        </span>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">

        {/* Applicant */}
        <div className="rounded-xl border border-yellow-200 bg-white/80 p-3.5 shadow-sm">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-yellow-500">Applicant</p>
          <p className="text-sm font-bold leading-snug text-slate-800">{item.name || 'N/A'}</p>
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
            <Mail className="h-3 w-3 shrink-0 text-yellow-500" />
            <span className="truncate">{item.email || 'N/A'}</span>
          </p>
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
            <Phone className="h-3 w-3 shrink-0 text-yellow-500" />
            <span>{item.phone || 'N/A'}</span>
          </p>
        </div>

        {/* Organization */}
        <div className="rounded-xl border border-orange-200 bg-white/80 p-3.5 shadow-sm">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-orange-500">Organization</p>
          <p className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
            <Building2 className="h-4 w-4 shrink-0 text-orange-500" />
            <span className="truncate">{item.organization || 'N/A'}</span>
          </p>
          <div className="mt-1.5 flex items-start gap-1.5">
            <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-orange-400" />
            <p className="text-xs leading-relaxed text-slate-500">
              {item.address || 'N/A'}{item.city ? `, ${item.city}` : ''}
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="rounded-xl border border-amber-200 bg-white/80 p-3.5 shadow-sm sm:col-span-2 lg:col-span-1">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-amber-500">Timeline</p>
          <p className="flex items-center gap-1.5 text-xs text-slate-500">
            <Calendar className="h-3 w-3 shrink-0 text-amber-500" />
            Applied: {formatDate(item.createdAt)}
          </p>
          <p className="mt-1 text-xs text-slate-400">ID: {item.id}</p>

          {/* Highlighted review status */}
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</span>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${getReviewStatusStyle(reviewLabel)}`}>
              {reviewLabel}
            </span>
          </div>

          {isConfirmed && (
            <p className="mt-1.5 text-xs font-semibold text-green-600">
              Confirmed: {formatDate(confirmedDate)}
            </p>
          )}
          {item.adminNotes && (
            <p className="mt-2 rounded-lg border border-amber-100 bg-amber-50 p-2 text-xs text-slate-600">
              Notes: {item.adminNotes}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SponsorApplicationCard;