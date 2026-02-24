import React from 'react';
import { X, Mic, User, Mail, Phone, MapPin, Music2, Users, UserCircle2 } from 'lucide-react';
import PortalModal from '../home/PortalModal';

const performanceOptions = ['Song', 'Dance', 'Others'];
const participationOptions = ['Solo', 'Group'];

const PerformerModal = ({
  showPerformerModal,
  setShowPerformerModal,
  performerForm,
  setPerformerForm,
  handlePerformerSubmit
}) => {
  const updateField = (field, value) => {
    setPerformerForm((prev) => ({ ...prev, [field]: value }));
  };

  const setPerformanceType = (type) => {
    if (type === 'Others') {
      setPerformerForm((prev) => ({
        ...prev,
        performanceCategory: type,
        performanceType: prev.customPerformanceType || '',
      }));
      return;
    }

    setPerformerForm((prev) => ({
      ...prev,
      performanceCategory: type,
      performanceType: type,
      customPerformanceType: '',
    }));
  };

  const setParticipationType = (type) => {
    if (type === 'Solo') {
      setPerformerForm((prev) => ({
        ...prev,
        participationType: type,
        groupName: '',
        memberCount: '',
        memberNames: [],
      }));
      return;
    }

    setPerformerForm((prev) => ({
      ...prev,
      participationType: type,
    }));
  };

  const onMemberCountChange = (rawValue) => {
    const cleanValue = rawValue.replace(/\D/g, '');
    const count = cleanValue ? Math.min(parseInt(cleanValue, 10), 20) : 0;

    setPerformerForm((prev) => {
      const currentMembers = Array.isArray(prev.memberNames) ? prev.memberNames : [];
      const nextMembers = Array.from({ length: count }, (_, index) => currentMembers[index] || '');

      return {
        ...prev,
        memberCount: cleanValue ? String(count) : '',
        memberNames: nextMembers,
      };
    });
  };

  const onMemberNameChange = (index, value) => {
    setPerformerForm((prev) => {
      const nextMembers = Array.isArray(prev.memberNames) ? [...prev.memberNames] : [];
      nextMembers[index] = value;
      return {
        ...prev,
        memberNames: nextMembers,
      };
    });
  };

  const groupMemberCount = parseInt(performerForm?.memberCount || '0', 10) || 0;

  return (
    <PortalModal
      isOpen={showPerformerModal}
      onClose={() => setShowPerformerModal(false)}
      className="!bg-transparent !border-0  !max-h-[95vh] !overflow-visible"
    >
      <div className="relative w-full max-w-md md:max-w-lg lg:max-w-xl rounded-3xl border border-cyan-200 bg-gradient-to-br from-cyan-50 via-white to-indigo-50 shadow-2xl overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600" />

        <div className="p-5 sm:p-7">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 shadow-md">
                <Mic className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800">Performer Application</h3>
                <p className="text-xs sm:text-sm text-slate-600">Fill your details and talent profile.</p>
              </div>
            </div>
            <button
              onClick={() => setShowPerformerModal(false)}
              className="rounded-full p-1 text-slate-400 transition-colors hover:text-slate-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-600" />
              <input
                type="text"
                placeholder="Full Name"
                value={performerForm?.name || ''}
                onChange={(e) => updateField('name', e.target.value)}
                className="w-full rounded-xl border border-cyan-200 bg-white/90 py-3 pl-11 pr-4 text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                required
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-600" />
              <input
                type="email"
                placeholder="Email Address"
                value={performerForm?.email || ''}
                onChange={(e) => updateField('email', e.target.value)}
                className="w-full rounded-xl border border-cyan-200 bg-white/90 py-3 pl-11 pr-4 text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                required
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-600" />
              <input
                type="tel"
                placeholder="Phone Number"
                value={performerForm?.phone || ''}
                onChange={(e) => updateField('phone', e.target.value)}
                className="w-full rounded-xl border border-cyan-200 bg-white/90 py-3 pl-11 pr-4 text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                required
              />
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-4 h-5 w-5 text-cyan-600" />
              <textarea
                placeholder="Address"
                value={performerForm?.address || ''}
                onChange={(e) => updateField('address', e.target.value)}
                className="w-full resize-none rounded-xl border border-cyan-200 bg-white/90 py-3 pl-11 pr-4 text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                rows={3}
                required
              />
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-slate-700">Gender</p>
              <div className="grid grid-cols-3 gap-2">
                {['Male', 'Female', 'Other'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => updateField('gender', option)}
                    className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                      performerForm?.gender === option
                        ? 'border-cyan-500 bg-cyan-500 text-white'
                        : 'border-cyan-200 bg-white text-slate-700 hover:border-cyan-400'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-slate-700">Performance Type</p>
              <div className="grid grid-cols-3 gap-2">
                {performanceOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setPerformanceType(option)}
                    className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                      performerForm?.performanceCategory === option
                        ? 'border-indigo-500 bg-indigo-500 text-white'
                        : 'border-cyan-200 bg-white text-slate-700 hover:border-indigo-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {performerForm?.performanceCategory === 'Others' && (
              <div className="relative">
                <Music2 className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-600" />
                <input
                  type="text"
                  placeholder="Write your performance type"
                  value={performerForm?.customPerformanceType || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setPerformerForm((prev) => ({
                      ...prev,
                      customPerformanceType: value,
                      performanceType: value,
                    }));
                  }}
                  className="w-full rounded-xl border border-cyan-200 bg-white/90 py-3 pl-11 pr-4 text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                  required
                />
              </div>
            )}

            <div>
              <p className="mb-2 text-sm font-semibold text-slate-700">Solo or Group</p>
              <div className="grid grid-cols-2 gap-2">
                {participationOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setParticipationType(option)}
                    className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                      performerForm?.participationType === option
                        ? 'border-cyan-600 bg-cyan-600 text-white'
                        : 'border-cyan-200 bg-white text-slate-700 hover:border-cyan-400'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {performerForm?.participationType === 'Group' && (
              <div className="rounded-2xl border border-cyan-200 bg-white/80 p-3 sm:p-4 space-y-3">
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-600" />
                  <input
                    type="text"
                    placeholder="Group Name"
                    value={performerForm?.groupName || ''}
                    onChange={(e) => updateField('groupName', e.target.value)}
                    className="w-full rounded-xl border border-cyan-200 bg-white py-3 pl-11 pr-4 text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                    required
                  />
                </div>

                <div className="relative">
                  <UserCircle2 className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-600" />
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="How many members?"
                    value={performerForm?.memberCount || ''}
                    onChange={(e) => onMemberCountChange(e.target.value)}
                    className="w-full rounded-xl border border-cyan-200 bg-white py-3 pl-11 pr-4 text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                    required
                  />
                </div>

                {groupMemberCount > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-slate-500">
                      Member names (optional)
                    </p>
                    {Array.from({ length: groupMemberCount }).map((_, index) => (
                      <input
                        key={`member-${index}`}
                        type="text"
                        placeholder={`Member ${index + 1} Name`}
                        value={performerForm?.memberNames?.[index] || ''}
                        onChange={(e) => onMemberNameChange(index, e.target.value)}
                        className="w-full rounded-xl border border-cyan-200 bg-white py-2.5 px-3 text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="relative">
              <Music2 className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-600" />
              <input
                type="text"
                placeholder="Track / Music Name"
                value={performerForm?.trackMusicName || ''}
                onChange={(e) => updateField('trackMusicName', e.target.value)}
                className="w-full rounded-xl border border-cyan-200 bg-white/90 py-3 pl-11 pr-4 text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                required
              />
            </div>

            <button
              onClick={handlePerformerSubmit}
              className="mt-2 w-full rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 px-4 py-3 font-semibold text-white shadow-md transition hover:shadow-lg hover:scale-[1.01]"
            >
              Submit Performer Request
            </button>

            <p className="pb-1 text-center text-xs text-slate-600">
              Our team will contact you within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </PortalModal>
  );
};

export default PerformerModal;
