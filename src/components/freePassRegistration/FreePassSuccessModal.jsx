import React, { useEffect } from 'react';
import { CheckCircle2, Home } from 'lucide-react';

const FreePassSuccessModal = ({ isOpen, onClose, onGoHome }) => {
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      onGoHome();
    }, 2500);

    return () => clearTimeout(timer);
  }, [isOpen, onGoHome]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-9 w-9 text-emerald-600" />
        </div>

        <h3 className="text-center text-2xl font-bold text-slate-900">Free Pass Booked</h3>
        <p className="mt-2 text-center text-sm text-slate-600">
          Your pass for June 13, 14, and 15, 2026 is confirmed. Confirmation mail has been initiated.
        </p>

        <button
          type="button"
          onClick={onGoHome}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-3 font-semibold text-white transition hover:from-cyan-700 hover:to-blue-700"
        >
          <span className="inline-flex items-center gap-2">
            <Home className="h-4 w-4" />
            Go To Home
          </span>
        </button>
        <button
          type="button"
          onClick={onClose}
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          Stay Here
        </button>
      </div>
    </div>
  );
};

export default FreePassSuccessModal;
