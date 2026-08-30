import React from 'react';
import { useRecords } from '../../context/RecordContext';
import { AlertCircle, X } from 'lucide-react';

export const UnsavedModal = () => {
  const { unsavedModalOpen, setUnsavedModalOpen, confirmDiscardAndNavigate } = useRecords();

  if (!unsavedModalOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in no-print"
      onClick={() => setUnsavedModalOpen(false)}
    >
      <div 
        className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-slate-200 overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 bg-amber-50 border-b border-amber-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-amber-950">Unsaved Changes</h3>
            </div>
          </div>
          <button
            onClick={() => setUnsavedModalOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 text-xs text-slate-600 space-y-2">
          <p>
            You have modified transaction details in the form. If you navigate away now, your edits will be discarded.
          </p>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            onClick={confirmDiscardAndNavigate}
            className="px-3.5 py-2 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-xl"
          >
            Discard Changes
          </button>
          
          <button
            onClick={() => setUnsavedModalOpen(false)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm"
          >
            Stay on Form
          </button>
        </div>

      </div>
    </div>
  );
};
