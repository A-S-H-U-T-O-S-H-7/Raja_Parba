import { Calendar, CheckCircle, Clock, FileText } from 'lucide-react';

const formatDate = (date) => {
  if (!date) return 'N/A';
  const d = date?.toDate ? date.toDate() : date?.seconds ? new Date(date.seconds * 1000) : new Date(date);
  if (Number.isNaN(d.getTime())) return 'N/A';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const getReviewStatusStyle = (status) => {
  const s = (status || '').toLowerCase();
  if (s === 'confirmed' || s === 'approved') return 'bg-green-100 text-green-700 border border-green-200';
  if (s === 'pending' || s === 'requested')  return 'bg-indigo-100 text-indigo-700 border border-indigo-200';
  return 'bg-blue-100 text-blue-700 border border-blue-200';
};

const ACCENTS = {
  blueIndigo: {
    card: 'border-indigo-200 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100',
    header: 'border-indigo-300 bg-gradient-to-r from-blue-200 via-indigo-200 to-blue-100',
    icon: 'from-blue-500 via-indigo-500 to-blue-600',
    applicantBox: 'border-indigo-200 bg-white/80',
    applicantTag: 'text-indigo-500',
    detailsBox: 'border-blue-200 bg-white/80',
    detailsTag: 'text-blue-500',
    detailItem: 'border-indigo-100 bg-indigo-50/60',
    detailLabel: 'text-indigo-400',
    aboutBox: 'border-blue-100 bg-blue-50/60',
    aboutLabel: 'text-blue-500',
    footer: 'border-indigo-200 bg-white/60',
    noteBox: 'border-indigo-200 bg-indigo-50',
    noteLabel: 'text-indigo-500',
    iconAccent: 'text-indigo-400',
  },
  emeraldTeal: {
    card: 'border-teal-200 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100',
    header: 'border-teal-300 bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-100',
    icon: 'from-emerald-500 via-teal-500 to-cyan-600',
    applicantBox: 'border-teal-200 bg-white/80',
    applicantTag: 'text-teal-600',
    detailsBox: 'border-emerald-200 bg-white/80',
    detailsTag: 'text-emerald-600',
    detailItem: 'border-teal-100 bg-teal-50/60',
    detailLabel: 'text-teal-500',
    aboutBox: 'border-emerald-100 bg-emerald-50/60',
    aboutLabel: 'text-emerald-600',
    footer: 'border-teal-200 bg-white/60',
    noteBox: 'border-teal-200 bg-teal-50',
    noteLabel: 'text-teal-600',
    iconAccent: 'text-teal-500',
  },
  redPink: {
    card: 'border-rose-200 bg-gradient-to-br from-red-50 via-rose-50 to-pink-100',
    header: 'border-rose-300 bg-gradient-to-r from-red-200 via-rose-200 to-pink-100',
    icon: 'from-red-500 via-rose-500 to-pink-600',
    applicantBox: 'border-rose-200 bg-white/80',
    applicantTag: 'text-rose-600',
    detailsBox: 'border-red-200 bg-white/80',
    detailsTag: 'text-red-500',
    detailItem: 'border-rose-100 bg-rose-50/60',
    detailLabel: 'text-rose-500',
    aboutBox: 'border-red-100 bg-red-50/60',
    aboutLabel: 'text-red-500',
    footer: 'border-rose-200 bg-white/60',
    noteBox: 'border-rose-200 bg-rose-50',
    noteLabel: 'text-rose-600',
    iconAccent: 'text-rose-500',
  },
  green: {
    card: 'border-green-200 bg-gradient-to-br from-green-50 via-emerald-50 to-lime-100',
    header: 'border-green-300 bg-gradient-to-r from-green-200 via-emerald-200 to-lime-100',
    icon: 'from-green-500 via-emerald-500 to-lime-600',
    applicantBox: 'border-green-200 bg-white/80',
    applicantTag: 'text-green-600',
    detailsBox: 'border-emerald-200 bg-white/80',
    detailsTag: 'text-emerald-600',
    detailItem: 'border-green-100 bg-green-50/60',
    detailLabel: 'text-green-500',
    aboutBox: 'border-emerald-100 bg-emerald-50/60',
    aboutLabel: 'text-emerald-600',
    footer: 'border-green-200 bg-white/60',
    noteBox: 'border-green-200 bg-green-50',
    noteLabel: 'text-green-600',
    iconAccent: 'text-green-500',
  },
};

const ContestApplicationCard = ({ item, title, accent = 'blueIndigo' }) => {
  const status = (item.status || item.reviewStatus || 'pending').toLowerCase();
  const isConfirmed = status === 'confirmed' || status === 'approved';
  const eventDate = item.eventDate || item.awardDate || null;
  const eventTime = item.eventTime || item.awardTime || null;
  const reviewLabel = item.reviewStatus || item.status || 'pending';
  const theme = ACCENTS[accent] || ACCENTS.blueIndigo;

  const detailPairs = [
    ['Gender',        item.gender],
    ['Age',           item.age],
    ['DOB',           item.dob],
    ['Category',      item.category || item.ageGroup || item.awardField],
    ['Qualification', item.educationQualification],
    ['Phone',         item.phone],
    ['Email',         item.email],
    ['Location',      item.location || item.address],
    ['Pincode',       item.pincode || item.pin],
  ].filter(([, v]) => v !== undefined && v !== null && v !== '');

  return (
    <div className={`overflow-hidden rounded-2xl border shadow-md ${theme.card}`}>

      {/* Header */}
      <div className={`flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3.5 ${theme.header}`}>
        <div className="flex items-center gap-2.5">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br shadow-sm ${theme.icon}`}>
            <CheckCircle className="h-4 w-4 text-white" />
          </div>
          <p className="text-sm font-bold tracking-tight text-slate-800">{title}</p>
        </div>

        <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${
          isConfirmed
            ? 'border-green-200 bg-green-100 text-green-700'
            : 'border-indigo-300 bg-white/70 text-indigo-800'
        }`}>
          {isConfirmed
            ? <><CheckCircle className="h-3.5 w-3.5" /> Confirmed</>
            : <><Clock className="h-3.5 w-3.5" /> Pending</>
          }
        </span>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 gap-3 p-5 lg:grid-cols-3">

        {/* Applicant */}
        <div className={`rounded-xl border p-3.5 shadow-sm ${theme.applicantBox}`}>
          <p className={`mb-2 text-[10px] font-bold uppercase tracking-widest ${theme.applicantTag}`}>Applicant</p>
          <p className="text-sm font-bold leading-snug text-slate-800">{item.name || 'N/A'}</p>
          <p className="mt-1 text-xs text-slate-400">ID: {item.registrationId || item.id}</p>
          {item.photoUrl && (
            <div className="mt-3">
              <div className="h-24 w-24 overflow-hidden rounded-xl border border-indigo-100 bg-white shadow-sm">
                <img
                  src={item.photoUrl}
                  alt={`${item.name || 'Candidate'} photo`}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}
          {item.profileUrl && (
            <div className="mt-3">
              <a
                href={item.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
              >
                <FileText className="h-3.5 w-3.5" />
                {item.profileFileName ? `Profile: ${item.profileFileName}` : 'View Uploaded Profile'}
              </a>
            </div>
          )}
        </div>

        {/* Details grid */}
        <div className={`rounded-xl border p-3.5 shadow-sm lg:col-span-2 ${theme.detailsBox}`}>
          <p className={`mb-3 text-[10px] font-bold uppercase tracking-widest ${theme.detailsTag}`}>Submitted Details</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {detailPairs.map(([label, value]) => (
              <div key={`${item.id}-${label}`} className={`rounded-lg border p-2 ${theme.detailItem}`}>
                <p className={`text-[10px] font-bold uppercase tracking-wider ${theme.detailLabel}`}>{label}</p>
                <p className="mt-0.5 text-xs font-semibold text-slate-700 break-words">{String(value)}</p>
              </div>
            ))}
          </div>

          {item.aboutSelf && (
            <div className={`mt-3 rounded-lg border p-2.5 ${theme.aboutBox}`}>
              <p className={`mb-0.5 text-[10px] font-bold uppercase tracking-wider ${theme.aboutLabel}`}>About</p>
              <p className="text-xs leading-relaxed text-slate-700">{item.aboutSelf}</p>
            </div>
          )}

        </div>
      </div>

      {/* Footer */}
      <div className={`border-t bg-white/60 px-5 py-3.5 ${theme.footer}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">

          {/* Left: applied date + review status */}
          <div className="flex flex-wrap items-center gap-3">
            <p className="flex items-center gap-1.5 text-xs text-slate-500">
              <Calendar className={`h-3.5 w-3.5 shrink-0 ${theme.iconAccent}`} />
              Applied: {formatDate(item.createdAt)}
            </p>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${getReviewStatusStyle(reviewLabel)}`}>
                {reviewLabel}
              </span>
            </div>
          </div>

          {/* Right: confirmed event date */}
          {isConfirmed && (
            <p className="flex items-center gap-1.5 text-xs font-semibold text-green-700">
              <CheckCircle className="h-3.5 w-3.5 shrink-0" />
              Event: {eventDate ? formatDate(eventDate) : 'Date pending'}
              {eventTime ? ` at ${eventTime}` : ''}
            </p>
          )}
        </div>

        {/* Admin notes */}
        {item.adminNotes && (
          <div className={`mt-2.5 rounded-lg border p-2.5 ${theme.noteBox}`}>
            <p className={`mb-0.5 text-[10px] font-bold uppercase tracking-widest ${theme.noteLabel}`}>Notes</p>
            <p className="text-xs leading-relaxed text-slate-700">{item.adminNotes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContestApplicationCard;
