import { Calendar, CheckCircle, Clock, Mail, Mic, Music2, Phone, Users } from 'lucide-react';

const formatDate = (date) => {
  if (!date) return 'N/A';
  const d = date?.toDate ? date.toDate() : date?.seconds ? new Date(date.seconds * 1000) : new Date(date);
  if (Number.isNaN(d.getTime())) return 'N/A';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const PerformerApplicationCard = ({ item }) => {
  const status = (item.status || item.reviewStatus || 'pending').toLowerCase();
  const isConfirmed = status === 'confirmed' || status === 'approved';
  const eventDate = item.performanceDate || item.eventDate || null;
  const eventTime = item.performanceTime || item.eventTime || null;
  const memberNames = Array.isArray(item.memberNames) ? item.memberNames.filter(Boolean) : [];

  return (
    <div className="overflow-hidden rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50 shadow-md">
      <div className="flex items-center justify-between border-b border-cyan-200 bg-cyan-100/70 px-4 py-3">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-900">
          <Mic className="h-4 w-4" />
          Performer Application
        </p>
        <span className={`rounded-full border px-2 py-1 text-xs font-medium ${isConfirmed ? 'border-green-200 bg-green-100 text-green-700' : 'border-cyan-200 bg-cyan-100 text-cyan-700'}`}>
          {isConfirmed ? (
            <span className="inline-flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" /> Confirmed</span>
          ) : (
            <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Pending</span>
          )}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 p-4 lg:grid-cols-3">
        <div className="rounded-xl border border-cyan-100 bg-white/90 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Applicant</p>
          <p className="mt-1 text-sm font-semibold text-slate-800">{item.name || 'N/A'}</p>
          <p className="inline-flex items-center gap-1 text-xs text-slate-600"><Mail className="h-3.5 w-3.5" /> {item.email || 'N/A'}</p>
          <p className="inline-flex items-center gap-1 text-xs text-slate-600"><Phone className="h-3.5 w-3.5" /> {item.phone || 'N/A'}</p>
          <p className="text-xs text-slate-600">Gender: {item.gender || 'N/A'}</p>
          <p className="text-xs text-slate-600">Address: {item.address || 'N/A'}</p>
        </div>

        <div className="rounded-xl border border-cyan-100 bg-white/90 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Performance</p>
          <p className="inline-flex items-center gap-1 text-sm font-semibold text-slate-800"><Music2 className="h-4 w-4 text-cyan-700" /> {item.performanceType || item.performanceCategory || 'N/A'}</p>
          <p className="inline-flex items-center gap-1 text-xs text-slate-600"><Users className="h-3.5 w-3.5" /> {item.participationType || 'Solo'}</p>
          <p className="text-xs text-slate-600">Group: {item.groupName || 'N/A'} | Members: {item.memberCount || '0'}</p>
          <p className="text-xs text-slate-600">Track: {item.trackMusicName || 'N/A'} ({item.trackDuration || 'N/A'})</p>
        </div>

        <div className="rounded-xl border border-cyan-100 bg-white/90 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Timeline</p>
          <p className="inline-flex items-center gap-1 text-xs text-slate-600"><Calendar className="h-3.5 w-3.5" /> Applied: {formatDate(item.createdAt)}</p>
          <p className="text-xs text-slate-600">ID: {item.id}</p>
          <p className="text-xs text-slate-600">Review: {item.reviewStatus || item.status || 'pending'}</p>
          {item.adminNotes && <p className="mt-1 rounded-md bg-cyan-50 p-2 text-xs text-slate-700">Notes: {item.adminNotes}</p>}
        </div>
      </div>

      {memberNames.length > 0 && (
        <div className="border-t border-cyan-200 bg-white/70 px-4 py-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-cyan-800">Group Member Names</p>
          <div className="flex flex-wrap gap-2">
            {memberNames.map((name, index) => (
              <span key={`${item.id}-member-${index}`} className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs text-cyan-800">
                {name}
              </span>
            ))}
          </div>
        </div>
      )}

      {isConfirmed && (
        <div className="border-t border-cyan-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Scheduled Performance: {eventDate ? formatDate(eventDate) : 'Date pending'} {eventTime ? `at ${eventTime}` : ''}
        </div>
      )}
    </div>
  );
};

export default PerformerApplicationCard;
