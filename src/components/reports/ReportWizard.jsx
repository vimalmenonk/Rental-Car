import React, { useState } from 'react';
import { useRecords } from '../../context/RecordContext';
import { 
  FileSpreadsheet, 
  Layers, 
  Calendar, 
  Building2, 
  ShieldAlert, 
  Eye, 
  ArrowRight,
  Sparkles,
  CheckSquare
} from 'lucide-react';

export const ReportWizard = () => {
  const { 
    records, 
    selectedIds, 
    settings, 
    generateCustomReport, 
    navigateTo, 
    showToast 
  } = useRecords();

  const [scope, setScope] = useState('all');
  const [dateFrom, setDateFrom] = useState('2024-01-01');
  const [dateTo, setDateTo] = useState('2024-03-31');
  
  const [reportTitle, setReportTitle] = useState(settings.reportTitle || 'ANNUAL TRANSACTION & MILEAGE TAX FILING SCHEDULE');
  const [assessmentYear, setAssessmentYear] = useState(settings.defaultFY || 'FY 2023-2024 (AY 2024-2025)');
  const [companyName, setCompanyName] = useState(settings.companyName);
  const [taxId, setTaxId] = useState(settings.taxId);

  const [includeLoan, setIncludeLoan] = useState(true);
  const [includeKM, setIncludeKM] = useState(true);
  const [includeSignatures, setIncludeSignatures] = useState(true);

  const handleBuildPreview = () => {
    let reportRecords = [];
    let scopeDesc = 'All Local Records';

    if (scope === 'all') {
      reportRecords = [...records];
      scopeDesc = `All Local Records (${records.length} Transactions)`;
    } else if (scope === 'date-range') {
      reportRecords = records.filter((r) => r.startDate >= dateFrom && r.endDate <= dateTo);
      scopeDesc = `Period Filter: ${dateFrom} to ${dateTo} (${reportRecords.length} Transactions)`;
    } else if (scope === 'selected') {
      if (selectedIds.size === 0) {
        showToast('No records currently selected in table. Falling back to all records.');
        reportRecords = [...records];
        scopeDesc = `All Local Records (${records.length} Transactions)`;
      } else {
        reportRecords = records.filter((r) => selectedIds.has(r.id));
        scopeDesc = `Selected Records (${reportRecords.length} Items)`;
      }
    }

    if (reportRecords.length === 0) {
      showToast('No transaction records found matching this scope filter.');
      return;
    }

    generateCustomReport({
      title: reportTitle,
      fy: assessmentYear,
      entity: companyName,
      taxId: taxId,
      scopeDesc: scopeDesc,
      records: reportRecords,
      options: {
        includeLoan,
        includeKM,
        includeSignatures
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* Wizard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Tax Report Generation Wizard</h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure transaction scope, assessment period, and entity headers for formal tax filing.
          </p>
        </div>

        <button
          onClick={handleBuildPreview}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all inline-flex items-center gap-2"
        >
          <Eye className="w-4 h-4" />
          <span>Preview & Build Report</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-6">
        
        {/* Step 1: Scope Selection */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <span className="w-7 h-7 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold text-xs">1</span>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Record Selection Scope</h3>
              <p className="text-xs text-slate-500">Determine which local transactions will be compiled into the tax schedule</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            
            {/* Scope Option: All */}
            <label
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                scope === 'all'
                  ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <strong className="text-xs font-bold text-slate-900">All Local Records</strong>
                <input
                  type="radio"
                  name="scope"
                  value="all"
                  checked={scope === 'all'}
                  onChange={() => setScope('all')}
                  className="text-blue-600 focus:ring-blue-500"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Include all <strong>{records.length}</strong> transactions stored in local database.
              </p>
            </label>

            {/* Scope Option: Date Range */}
            <label
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                scope === 'date-range'
                  ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <strong className="text-xs font-bold text-slate-900">Filter by Date Range</strong>
                <input
                  type="radio"
                  name="scope"
                  value="date-range"
                  checked={scope === 'date-range'}
                  onChange={() => setScope('date-range')}
                  className="text-blue-600 focus:ring-blue-500"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Specify a specific quarterly interval or custom start/end date span.
              </p>
            </label>

            {/* Scope Option: Selected Only */}
            <label
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                scope === 'selected'
                  ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <strong className="text-xs font-bold text-slate-900">Selected Records Only</strong>
                <input
                  type="radio"
                  name="scope"
                  value="selected"
                  checked={scope === 'selected'}
                  onChange={() => setScope('selected')}
                  className="text-blue-600 focus:ring-blue-500"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Include only the <strong>{selectedIds.size}</strong> records checked in the table.
              </p>
            </label>

          </div>

          {/* Conditional Date Pickers */}
          {scope === 'date-range' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 animate-fade-in mt-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Period Start Date</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Period End Date</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Tax Metadata & Entity Profile */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <span className="w-7 h-7 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold text-xs">2</span>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Tax Schedule Header & Filing Profile</h3>
              <p className="text-xs text-slate-500">Details printed on top of the generated accounting schedule</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tax Schedule Report Title</label>
              <input
                type="text"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Financial / Assessment Year</label>
              <select
                value={assessmentYear}
                onChange={(e) => setAssessmentYear(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
              >
                <option value="FY 2023-2024 (AY 2024-2025)">FY 2023-2024 (Assessment Year 2024-2025)</option>
                <option value="FY 2024-2025 (AY 2025-2026)">FY 2024-2025 (Assessment Year 2025-2026)</option>
                <option value="FY 2022-2023 (AY 2023-2024)">FY 2022-2023 (Assessment Year 2023-2024)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Filing Business Legal Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tax Registration / PAN / EIN</label>
              <input
                type="text"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Presentation Options */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <span className="w-7 h-7 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold text-xs">3</span>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Schedule Presentation Options</h3>
              <p className="text-xs text-slate-500">Enable or disable specific column schedules and declaration blocks</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-3 text-xs font-medium text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={includeLoan}
                onChange={(e) => setIncludeLoan(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Include Itemized Loan / Financed Deduction Columns & Summary</span>
            </label>

            <label className="flex items-center gap-3 text-xs font-medium text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={includeKM}
                onChange={(e) => setIncludeKM(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Include Business Travel Distance (KM) & Mileage Logs</span>
            </label>

            <label className="flex items-center gap-3 text-xs font-medium text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={includeSignatures}
                onChange={(e) => setIncludeSignatures(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Include Auditor & Preparer Signature Declaration Block</span>
            </label>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <button
            onClick={() => navigateTo('dashboard')}
            className="px-4 py-2 text-slate-600 hover:text-slate-800 text-xs font-semibold"
          >
            Cancel
          </button>
          
          <button
            onClick={handleBuildPreview}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all inline-flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            <span>Generate & Preview Tax Schedule →</span>
          </button>
        </div>

      </div>
    </div>
  );
};
