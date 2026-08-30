import React from 'react';
import { useRecords } from '../../context/RecordContext';
import { calculateDays, formatCurrency, formatKM } from '../../utils/formatters';
import { 
  X, 
  Edit, 
  Trash2, 
  FileText, 
  Calendar, 
  IndianRupee, 
  Navigation, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';

export const RecordDrawer = () => {
  const { 
    records, 
    drawerRecordId, 
    setDrawerRecordId, 
    openEditRecordModal, 
    setDeleteModalRecord, 
    generateSingleReport,
    settings 
  } = useRecords();

  if (!drawerRecordId) return null;

  const record = records.find((r) => r.id === drawerRecordId);
  if (!record) return null;

  const durationDays = calculateDays(record.startDate, record.endDate);
  const numAmount = parseFloat(record.amount) || 0;
  const numLoan = parseFloat(record.loanAmount) || 0;
  const netBase = numAmount - numLoan;
  const avgKmPerDay = durationDays > 0 ? (parseFloat(record.km) / durationDays).toFixed(1) : 0;

  const handleEdit = () => {
    setDrawerRecordId(null);
    openEditRecordModal(record.id);
  };

  const handleDelete = () => {
    setDrawerRecordId(null);
    setDeleteModalRecord(record);
  };

  const handleGenerateReport = () => {
    setDrawerRecordId(null);
    generateSingleReport(record);
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex justify-end animate-fade-in no-print"
      onClick={() => setDrawerRecordId(null)}
    >
      <div 
        className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col animate-slide-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-200 flex items-start justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 font-mono text-xs font-bold px-2 py-0.5 rounded">
                {record.id}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Local Record</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">{record.customerName}</h3>
          </div>
          <button
            onClick={() => setDrawerRecordId(null)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          
          {/* Customer Details Block */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-[11px] text-slate-400 uppercase tracking-wider block">Customer Information</span>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-slate-500 block text-[11px]">Full Name:</span>
                <strong className="text-slate-900 text-xs block font-sans">{record.customerName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Contact Number:</span>
                <strong className="text-slate-900 font-mono text-xs block">{record.phone}</strong>
              </div>
            </div>
          </div>

          {/* Period Details Block */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-[11px] text-slate-400 uppercase tracking-wider block">Period of Service</span>
            <div className="grid grid-cols-3 gap-2 pt-1 font-mono">
              <div>
                <span className="text-slate-500 block text-[11px]">Start Date:</span>
                <span className="font-semibold text-slate-800">{record.startDate}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">End Date:</span>
                <span className="font-semibold text-slate-800">{record.endDate}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Total Active:</span>
                <span className="font-bold text-blue-700 font-sans">{durationDays} Days</span>
              </div>
            </div>
          </div>

          {/* Financial Breakdown Card */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
            <span className="font-bold text-[11px] text-slate-400 uppercase tracking-wider block">Financial Summary (INR ₹)</span>
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between items-center text-slate-700">
                <span>Gross Transaction Amount:</span>
                <strong className="text-emerald-700">{formatCurrency(record.amount, settings.currency)}</strong>
              </div>
              <div className="flex justify-between items-center text-slate-700">
                <span>Loan / Financed Deduction:</span>
                <strong className="text-amber-700">- {formatCurrency(record.loanAmount, settings.currency)}</strong>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between items-center font-bold text-slate-900 text-sm">
                <span>Net Base Balance:</span>
                <span className={netBase >= 0 ? 'text-slate-900' : 'text-red-600'}>
                  {formatCurrency(netBase, settings.currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Travel & Distance Block */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-[11px] text-slate-400 uppercase tracking-wider block">Mileage & Travel</span>
            <div className="grid grid-cols-2 gap-3 pt-1 font-mono">
              <div>
                <span className="text-slate-500 block text-[11px]">Logged Distance:</span>
                <strong className="text-indigo-700 font-bold text-sm block">{formatKM(record.km)}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Average / Day:</span>
                <strong className="text-slate-800 text-xs block">{avgKmPerDay} KM / Day</strong>
              </div>
            </div>
          </div>

          {/* Audit Metadata */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-3">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Stored Locally (No Cloud)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Created: {record.createdAt || 'N/A'}</span>
            </div>
          </div>

        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-2">
          <button
            onClick={handleDelete}
            className="px-3 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleEdit}
              className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Record</span>
            </button>
            <button
              onClick={handleGenerateReport}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all shadow-sm"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>Generate Report</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
