import React from 'react';
import { useRecords } from '../../context/RecordContext';
import { formatCurrency, formatKM } from '../../utils/formatters';
import { 
  FolderKanban, 
  IndianRupee, 
  Landmark, 
  Navigation, 
  PlusCircle, 
  ListOrdered, 
  FileSpreadsheet, 
  ArrowRight,
  Eye,
  Edit,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';

export const Dashboard = () => {
  const { 
    records, 
    navigateTo, 
    setDrawerRecordId, 
    openAddRecordModal,
    openEditRecordModal,
    generateSingleReport, 
    settings 
  } = useRecords();

  const totalRecords = records.length;
  const totalAmount = records.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
  const totalLoan = records.reduce((sum, r) => sum + (parseFloat(r.loanAmount) || 0), 0);
  const totalKM = records.reduce((sum, r) => sum + (parseFloat(r.km) || 0), 0);

  const recentRecords = records.slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Tax Operations Dashboard</h2>
          <p className="text-xs text-slate-500 mt-1">
            Local financial & mileage management for <strong>{settings.companyName}</strong>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('report-wizard')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-blue-400" />
            <span>Generate Tax Report</span>
          </button>
          <button
            onClick={openAddRecordModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add New Record</span>
          </button>
        </div>
      </div>

      {/* 4 Core KPI Stat Cards in INR (₹) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Records */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Records</span>
            <div className="text-2xl font-bold text-slate-900 font-mono mt-1">
              {totalRecords}
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">
              ↑ Stored locally
            </span>
          </div>
        </div>

        {/* Total Transaction Amount (₹) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Gross Amount</span>
            <div className="text-2xl font-bold text-emerald-700 font-mono mt-1">
              {formatCurrency(totalAmount, settings.currency)}
            </div>
            <span className="text-[11px] text-slate-400">
              Gross Transaction Volume
            </span>
          </div>
        </div>

        {/* Total Loan Amount (₹) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Loan Amount</span>
            <div className="text-2xl font-bold text-amber-700 font-mono mt-1">
              {formatCurrency(totalLoan, settings.currency)}
            </div>
            <span className="text-[11px] text-slate-400">
              Active Deductible Financing
            </span>
          </div>
        </div>

        {/* Total KM */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Navigation className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Travel Distance</span>
            <div className="text-2xl font-bold text-indigo-700 font-mono mt-1">
              {formatKM(totalKM)}
            </div>
            <span className="text-[11px] text-slate-400">
              Recorded Business Mileage
            </span>
          </div>
        </div>

      </div>

      {/* Quick Action Shortcuts Bar */}
      <div className="bg-slate-100/80 border border-slate-200 p-3.5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-600 font-medium">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
          <span><strong>Fast Operations:</strong> Navigate instantly with keyboard shortcuts</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openAddRecordModal}
            className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-lg font-semibold shadow-2xs transition-all flex items-center gap-1.5"
          >
            <span>+ Add Record (Popup)</span>
            <kbd className="bg-slate-100 text-slate-500 text-[10px] px-1 py-0.5 rounded">Alt+N</kbd>
          </button>
          <button
            onClick={() => navigateTo('record-list')}
            className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-lg font-semibold shadow-2xs transition-all flex items-center gap-1.5"
          >
            <span>View All Records</span>
            <kbd className="bg-slate-100 text-slate-500 text-[10px] px-1 py-0.5 rounded">Alt+R</kbd>
          </button>
          <button
            onClick={() => navigateTo('report-wizard')}
            className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-lg font-semibold shadow-2xs transition-all flex items-center gap-1.5"
          >
            <span>Generate Report</span>
            <kbd className="bg-slate-100 text-slate-500 text-[10px] px-1 py-0.5 rounded">Alt+G</kbd>
          </button>
        </div>
      </div>

      {/* Recent Records Section or Empty State */}
      {totalRecords === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto text-2xl">
            📁
          </div>
          <h3 className="text-base font-bold text-slate-900">No Transaction Records Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Your local storage is clean and ready. Add your first customer transaction to track financial metrics and generate tax reports.
          </p>
          <button
            onClick={openAddRecordModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Your First Record</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <h3 className="font-bold text-sm text-slate-900">Recently Added Records</h3>
              <span className="text-xs text-slate-400">({recentRecords.length} most recent)</span>
            </div>
            <button
              onClick={() => navigateTo('record-list')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
            >
              <span>View Full Record List</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">RECORD ID</th>
                  <th className="px-4 py-3">CUSTOMER NAME</th>
                  <th className="px-4 py-3">CONTACT NUMBER</th>
                  <th className="px-4 py-3">PERIOD</th>
                  <th className="px-4 py-3 text-right">GROSS AMOUNT (₹)</th>
                  <th className="px-4 py-3 text-right">LOAN AMOUNT (₹)</th>
                  <th className="px-4 py-3 text-right">DISTANCE</th>
                  <th className="px-4 py-3 text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {recentRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded text-[11px]">
                        {record.id}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-sans font-semibold text-slate-900">
                      {record.customerName}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {record.phone}
                    </td>
                    <td className="px-4 py-3 text-slate-600 font-sans text-[11px]">
                      {record.startDate} → {record.endDate}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-emerald-700">
                      {formatCurrency(record.amount, settings.currency)}
                    </td>
                    <td className="px-4 py-3 text-right text-amber-700">
                      {formatCurrency(record.loanAmount, settings.currency)}
                    </td>
                    <td className="px-4 py-3 text-right text-indigo-700">
                      {formatKM(record.km)}
                    </td>
                    <td className="px-4 py-3 text-center font-sans">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setDrawerRecordId(record.id)}
                          title="View Record Details"
                          className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditRecordModal(record.id)}
                          title="Edit Record (Popup)"
                          className="p-1 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => generateSingleReport(record)}
                          title="Generate Tax Report"
                          className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
