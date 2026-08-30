import React from 'react';
import { useRecords } from '../../context/RecordContext';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

export const Toast = () => {
  const { toast } = useRecords();

  if (!toast.visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 animate-slide-up">
      {toast.type === 'error' ? (
        <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
      ) : (
        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
      )}
      <span className="text-xs font-medium">{toast.message}</span>
    </div>
  );
};
