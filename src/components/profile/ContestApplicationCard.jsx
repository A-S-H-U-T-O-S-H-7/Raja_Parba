import { Calendar, CheckCircle, Clock } from 'lucide-react';

const formatDate = (date) => {
  if (!date) return 'N/A';
  const d = date?.toDate ? date.toDate() : date?.seconds ? new Date(date.seconds * 1000) : new Date(date);
  if (Number.isNaN(d.getTime())) return 'N/A';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const ContestApplicationCard = ({ item, title, accent = 'rose' }) => {
  const status = (item.status || item.reviewStatus || 'pending').toLowerCase();
  const isConfirmed = status === 'confirmed' || status === 'approved';
  const eventDate = item.eventDate || item.awardDate || null;
  const eventTime = item.eventTime || item.awardTime || null;

  const themes = {
    rose: 'border-rose-200 bg-rose-50',
    pink: 'border-pink-200 bg-pink-50',
    emerald: 'border-emerald-200 bg-emerald-50',
    amber: 'border-amber-200 bg-amber-50',
  };
  const theme = themes[accent] || themes.rose;
  const detailPairs = [
    ['Gender', item.gender],
    ['Age', item.age],
    ['DOB', item.dob],
    ['Category', item.category || item.ageGroup || item.awardField],
    ['Qualification', item.educationQualification],
    ['Phone', item.phone],
    ['Email', item.email],
    ['Location', item.location || item.address],
    ['Pincode', item.pincode || item.pin],
  ].filter(([, value]) => value !== undefined && value !== null && value !== '');

  return (
    <div className={`overflow-hidden rounded-2xl border shadow-md ${theme}`}>
      <div className="flex items-center justify-between border-b border-black/10 bg-white/50 px-4 py-3">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <span className={`rounded-full border px-2 py-1 text-xs font-medium ${isConfirmed ? 'border-green-200 bg-green-100 text-green-700' : 'border-slate-200 bg-slate-100 text-slate-700'}`}>
          {isConfirmed ? (
            <span className="inline-flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" /> Confirmed</span>
          ) : (
            <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Pending</span>
          )}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 p-4 lg:grid-cols-3">
        <div className="rounded-xl border border-black/5 bg-white/85 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Applicant</p>
          <p className="mt-1 text-sm font-semibold text-slate-800">{item.name || 'N/A'}</p>
          <p className="text-xs text-slate-600">ID: {item.id}</p>
          {item.photoUrl && <a href={item.photoUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">View uploaded photo</a>}
        </div>

        <div className="rounded-xl border border-black/5 bg-white/85 p-3 lg:col-span-2">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Submitted Details</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {detailPairs.map(([label, value]) => (
              <div key={`${item.id}-${label}`} className="rounded-md bg-white/80 p-2">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">{label}</p>
                <p className="text-xs font-medium text-slate-700">{String(value)}</p>
              </div>
            ))}
          </div>

          {item.aboutSelf && (
            <div className="mt-2 rounded-md bg-white/80 p-2">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">About</p>
              <p className="text-xs text-slate-700">{item.aboutSelf}</p>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-black/10 bg-white/60 px-4 py-3">
        <p className="text-xs text-slate-700">Review Status: <span className="font-semibold">{item.reviewStatus || item.status || 'pending'}</span></p>
        <p className="inline-flex items-center gap-1 text-xs text-slate-600">
          <Calendar className="h-3.5 w-3.5" />
          Applied: {formatDate(item.createdAt)}
        </p>
        {item.adminNotes && <p className="mt-1 rounded-md bg-slate-50 p-2 text-xs text-slate-700">Notes: {item.adminNotes}</p>}
        {isConfirmed && (
          <p className="mt-1 text-xs font-medium text-green-700">
            Event: {eventDate ? formatDate(eventDate) : 'Date pending'} {eventTime ? `at ${eventTime}` : ''}
          </p>
        )}
      </div>
    </div>
  );
};

export default ContestApplicationCard;
