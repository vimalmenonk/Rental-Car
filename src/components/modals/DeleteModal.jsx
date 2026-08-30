import React from 'react';
import { useRecords } from '../../context/RecordContext';
import { formatCurrency, formatKM } from '../../utils/formatters';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export const DeleteModal = () => {
  const { deleteModalRecord, setDeleteModalRecord, deleteRecord, settings } = useRecords();

  if (!deleteModalRecord) return null;

  const handleConfirm = () => {
    deleteRecord(deleteModalRecord.id);
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in no-print"
      onClick={() => setDeleteModalRecord(null)}
    >
      <div 
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 bg-red-50 border-b border-red-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 text-red-600 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-red-950">Confirm Record Deletion</h3>
              <span className="text-[11px] text-red-700 font-mono">#{deleteModalRecord.id}</span>
            </div>
          </div>
          <button
            onClick={() => setDeleteModalRecord(null)}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-xs">
          <p className="text-slate-600">
            Are you sure you want to delete this customer transaction record from your local records?
          </p>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5 font-mono">
            <div>
              <span className="text-slate-500 font-sans text-[11px]">Customer: </span>
              <strong className="text-slate-900 font-sans">{deleteModalRecord.customerName}</strong>
            </div>
            <div>
              <span className="text-slate-500 font-sans text-[11px]">Period: </span>
              <span className="text-slate-800">{deleteModalRecord.startDate} → {deleteModalRecord.endDate}</span>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <span>Gross: <strong className="text-emerald-700">{formatCurrency(deleteModalRecord.amount, settings.currency)}</strong></span>
              <span>•</span>
              <span>Distance: <strong className="text-indigo-700">{formatKM(deleteModalRecord.km)}</strong></span>
            </div>
          </div>

          <div className="p-3 bg-red-50/60 rounded-xl border border-red-200/60 text-[11px] text-red-700">
            ⚠️ <strong>Local Action:</strong> This record will be removed from your local database.
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            onClick={() => setDeleteModalRecord(null)}
            className="px-4 py-2 text-slate-600 hover:text-slate-800 text-xs font-semibold rounded-xl"
          >
            Cancel & Keep
          </button>
          
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-sm inline-flex items-center gap-1.5 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Yes, Delete Record</span>
          </button>
        </div>

      </div>
    </div>
  );
};
