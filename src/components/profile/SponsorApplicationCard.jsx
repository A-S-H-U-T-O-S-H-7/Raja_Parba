import { Building2, Calendar, CheckCircle, Clock, Mail, MapPin, Phone, Star } from 'lucide-react';

const formatDate = (date) => {
  if (!date) return 'N/A';
  const d = date?.toDate ? date.toDate() : date?.seconds ? new Date(date.seconds * 1000) : new Date(date);
  if (Number.isNaN(d.getTime())) return 'N/A';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const SponsorApplicationCard = ({ item }) => {
  const status = (item.status || item.reviewStatus || 'requested').toLowerCase();
  const isConfirmed = status === 'confirmed' || status === 'approved';
  const isRequested = status === 'requested' || status === 'pending';
  const confirmedDate = item.confirmedAt || item.updatedAt;

  return (
    <div className="overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 shadow-md">
      <div className="flex items-center justify-between border-b border-amber-200 bg-amber-100/70 px-4 py-3">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-amber-900">
          <Star className="h-4 w-4" />
          Sponsor Request
        </p>
        <span className={`rounded-full border px-2 py-1 text-xs font-medium ${isConfirmed ? 'border-green-200 bg-green-100 text-green-700' : 'border-amber-200 bg-amber-100 text-amber-700'}`}>
          {isConfirmed ? (
            <span className="inline-flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" /> Confirmed</span>
          ) : (
            <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {isRequested ? 'Requested' : 'In Review'}</span>
          )}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 p-4 lg:grid-cols-3">
        <div className="rounded-xl border border-amber-100 bg-white/90 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Applicant</p>
          <p className="mt-1 text-sm font-semibold text-slate-800">{item.name || 'N/A'}</p>
          <p className="inline-flex items-center gap-1 text-xs text-slate-600"><Mail className="h-3.5 w-3.5" /> {item.email || 'N/A'}</p>
          <p className="inline-flex items-center gap-1 text-xs text-slate-600"><Phone className="h-3.5 w-3.5" /> {item.phone || 'N/A'}</p>
        </div>

        <div className="rounded-xl border border-amber-100 bg-white/90 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Organization</p>
          <p className="inline-flex items-center gap-1 text-sm font-semibold text-slate-800"><Building2 className="h-4 w-4 text-amber-700" /> {item.organization || 'N/A'}</p>
          <p className="inline-flex items-start gap-1 text-xs text-slate-600"><MapPin className="mt-0.5 h-3.5 w-3.5" /> {item.address || 'N/A'}{item.city ? `, ${item.city}` : ''}</p>
        </div>

        <div className="rounded-xl border border-amber-100 bg-white/90 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Timeline</p>
          <p className="inline-flex items-center gap-1 text-xs text-slate-600"><Calendar className="h-3.5 w-3.5" /> Applied: {formatDate(item.createdAt)}</p>
          <p className="text-xs text-slate-600">ID: {item.id}</p>
          <p className="text-xs text-slate-600">Review: {item.reviewStatus || item.status || 'requested'}</p>
          {isConfirmed && <p className="text-xs font-medium text-green-700">Confirmed: {formatDate(confirmedDate)}</p>}
          {item.adminNotes && <p className="mt-1 rounded-md bg-amber-50 p-2 text-xs text-slate-700">Notes: {item.adminNotes}</p>}
        </div>
      </div>
    </div>
  );
};

export default SponsorApplicationCard;
