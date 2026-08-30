import React from 'react';
import { useRecords } from '../../context/RecordContext';
import { formatCurrency, formatKM } from '../../utils/formatters';
import { exportRecordsToCSV } from '../../utils/exportUtils';
import { 
  Printer, 
  Download, 
  ArrowLeft, 
  Building2, 
  FileCheck, 
  ShieldCheck 
} from 'lucide-react';

export const ReportPreview = () => {
  const { activeReport, navigateTo, settings, showToast } = useRecords();

  const reportRecords = activeReport.records || [];
  const options = activeReport.options || { includeLoan: true, includeKM: true, includeSignatures: true };

  // Totals
  const totalAmount = reportRecords.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
  const totalLoan = reportRecords.reduce((sum, r) => sum + (parseFloat(r.loanAmount) || 0), 0);
  const totalNet = totalAmount - totalLoan;
  const totalKM = reportRecords.reduce((sum, r) => sum + (parseFloat(r.km) || 0), 0);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const success = exportRecordsToCSV(reportRecords, `TaxSchedule_${activeReport.fy.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
    if (success) {
      showToast('Tax Schedule CSV exported successfully');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 animate-fade-in">
      
      {/* Top Action Bar (Hidden on Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm no-print">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('report-wizard')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-blue-50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Wizard</span>
          </button>
          <div className="h-4 w-px bg-slate-200"></div>
          <span className="text-xs font-bold text-slate-700">Official Tax Schedule Preview</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-2xs inline-flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Export to CSV / Excel</span>
          </button>
          
          <button
            onClick={handlePrint}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md inline-flex items-center gap-2 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet Container */}
      <div className="flex justify-center">
        <div className="report-sheet bg-white w-full max-w-4xl p-10 md:p-14 border border-slate-300 shadow-xl rounded-sm font-sans space-y-8 text-slate-900">
          
          {/* Header Block */}
          <div className="text-center border-b-2 border-slate-900 pb-6 space-y-2">
            <div className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
              OFFICIAL TAX FILING TRANSACTION & MILEAGE SCHEDULE • LOCAL AUDIT
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 uppercase font-sans">
              {activeReport.title}
            </h1>
            <div className="text-xs text-slate-600 font-mono flex items-center justify-center gap-4 flex-wrap pt-1">
              <span><strong>Assessment Period:</strong> {activeReport.fy}</span>
              <span>•</span>
              <span><strong>Generated Date:</strong> {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span>•</span>
              <span><strong>Local Storage Ver:</strong> 1.0</span>
            </div>
          </div>

          {/* Section 1: Taxpayer / Filing Entity Information */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold tracking-wider uppercase text-slate-900 border-b border-slate-900 pb-1 font-sans">
              1. TAXPAYER / FILING ENTITY INFORMATION
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs py-2">
              <div>
                <span className="text-slate-500 block text-[11px]">Business Legal Name:</span>
                <strong className="text-slate-900 font-sans">{activeReport.entity}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Tax ID / PAN / GSTIN:</span>
                <strong className="text-slate-900 font-mono">{activeReport.taxId}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Reporting Scope:</span>
                <span className="text-slate-800">{activeReport.scopeDesc}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Document Ref:</span>
                <span className="text-slate-800 font-mono">TLP-LOCAL-2024-001</span>
              </div>
            </div>
          </div>

          {/* Section 2: Itemized Transaction Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold tracking-wider uppercase text-slate-900 border-b border-slate-900 pb-1 font-sans">
              2. ITEMIZED TRANSACTION & DISTANCE SCHEDULE
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-300 font-mono">
                <thead className="bg-slate-100 font-sans font-bold text-slate-900 border-b border-slate-300">
                  <tr>
                    <th className="p-2 border-r border-slate-300 w-8 text-center">#</th>
                    <th className="p-2 border-r border-slate-300">CUSTOMER NAME</th>
                    <th className="p-2 border-r border-slate-300">CONTACT NUMBER</th>
                    <th className="p-2 border-r border-slate-300">PERIOD DATES</th>
                    <th className="p-2 border-r border-slate-300 text-right">GROSS AMOUNT (₹)</th>
                    {options.includeLoan && (
                      <th className="p-2 border-r border-slate-300 text-right">LOAN AMOUNT (₹)</th>
                    )}
                    {options.includeKM && (
                      <th className="p-2 text-right">DISTANCE</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {reportRecords.map((r, index) => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="p-2 border-r border-slate-300 text-center text-slate-500 text-[11px]">
                        {String(index + 1).padStart(2, '0')}
                      </td>
                      <td className="p-2 border-r border-slate-300 font-sans font-semibold text-slate-900">
                        {r.customerName}
                      </td>
                      <td className="p-2 border-r border-slate-300 text-slate-600">
                        {r.phone}
                      </td>
                      <td className="p-2 border-r border-slate-300 text-slate-700 text-[11px]">
                        {r.startDate} to {r.endDate}
                      </td>
                      <td className="p-2 border-r border-slate-300 text-right font-bold text-slate-900">
                        {formatCurrency(r.amount, settings.currency)}
                      </td>
                      {options.includeLoan && (
                        <td className="p-2 border-r border-slate-300 text-right text-slate-700">
                          {formatCurrency(r.loanAmount, settings.currency)}
                        </td>
                      )}
                      {options.includeKM && (
                        <td className="p-2 text-right text-slate-800">
                          {formatKM(r.km)}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Consolidated Financial & Distance Totals */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold tracking-wider uppercase text-slate-900 border-b border-slate-900 pb-1 font-sans">
              3. CONSOLIDATED FINANCIAL & DISTANCE TOTALS
            </h3>
            <div className="bg-slate-50 border border-slate-300 p-4 rounded-xs">
              <table className="w-full text-xs font-mono">
                <tbody>
                  <tr className="border-b border-slate-200 py-1.5">
                    <td className="py-1 font-sans text-slate-700">Total Itemized Transaction Entries:</td>
                    <td className="py-1 text-right font-bold text-slate-900">{reportRecords.length} Records</td>
                  </tr>
                  <tr className="border-b border-slate-200 py-1.5">
                    <td className="py-1 font-sans text-slate-700">Total Gross Transaction Amount:</td>
                    <td className="py-1 text-right font-bold text-slate-900">{formatCurrency(totalAmount, settings.currency)}</td>
                  </tr>
                  {options.includeLoan && (
                    <tr className="border-b border-slate-200 py-1.5">
                      <td className="py-1 font-sans text-slate-700">Total Loan / Financing Deductions:</td>
                      <td className="py-1 text-right font-bold text-amber-800">- {formatCurrency(totalLoan, settings.currency)}</td>
                    </tr>
                  )}
                  <tr className="border-b-2 border-slate-900 py-2 bg-slate-100/80 font-bold text-sm">
                    <td className="py-2 px-1 font-sans text-slate-900">Net Transaction Base Value:</td>
                    <td className="py-2 px-1 text-right text-slate-900">{formatCurrency(totalNet, settings.currency)}</td>
                  </tr>
                  {options.includeKM && (
                    <tr className="py-1.5">
                      <td className="py-1 font-sans text-slate-700">Total Recorded Business Mileage:</td>
                      <td className="py-1 text-right font-bold text-slate-900">{formatKM(totalKM)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Declaration & Signatures */}
          {options.includeSignatures && (
            <div className="space-y-6 pt-4">
              <h3 className="text-xs font-bold tracking-wider uppercase text-slate-900 border-b border-slate-900 pb-1 font-sans">
                4. DECLARATION & AUDIT VERIFICATION
              </h3>
              <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                I hereby declare and certify that the particulars furnished in this schedule are true, correct, and derived from verified local records and transaction books for the aforementioned assessment period.
              </p>

              <div className="grid grid-cols-2 gap-12 pt-8">
                <div className="space-y-1">
                  <div className="border-b border-slate-900 h-8"></div>
                  <strong className="text-xs font-bold text-slate-900 block font-sans">Prepared By (Accountant / Bookkeeper)</strong>
                  <span className="text-[10px] text-slate-500 block">Date: ________________________</span>
                </div>

                <div className="space-y-1">
                  <div className="border-b border-slate-900 h-8"></div>
                  <strong className="text-xs font-bold text-slate-900 block font-sans">Authorized Signatory / Taxpayer</strong>
                  <span className="text-[10px] text-slate-500 block">Stamp & Official Signature</span>
                </div>
              </div>
            </div>
          )}

          {/* Footer Notice */}
          <div className="border-t border-slate-200 pt-4 text-center text-[10px] text-slate-400 font-mono">
            * Note: Tax calculation schedules and statutory rates will be populated according to approved client formulas. Stored locally without third-party cloud database dependencies.
          </div>

        </div>
      </div>

    </div>
  );
};
