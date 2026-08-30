import React, { useState, useMemo } from 'react';
import { useRecords } from '../../context/RecordContext';
import { formatCurrency, formatKM } from '../../utils/formatters';
import { 
  Search, 
  Calendar, 
  ArrowUpDown, 
  PlusCircle, 
  FileSpreadsheet, 
  Eye, 
  Edit, 
  Trash2, 
  FileText, 
  RotateCcw,
  CheckSquare,
  Square,
  Layers
} from 'lucide-react';

export const RecordList = () => {
  const { 
    records, 
    navigateTo, 
    selectedIds, 
    toggleSelectRecord, 
    selectAll, 
    clearSelection, 
    setDrawerRecordId, 
    setDeleteModalRecord, 
    openAddRecordModal,
    openEditRecordModal,
    generateSingleReport, 
    generateBatchReport,
    settings 
  } = useRecords();

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');

  // Filtered & Sorted Records
  const filteredRecords = useMemo(() => {
    return records
      .filter((r) => {
        // Search
        if (searchTerm.trim()) {
          const query = searchTerm.toLowerCase().trim();
          const matchName = (r.customerName || '').toLowerCase().includes(query);
          const matchPhone = (r.phone || '').toLowerCase().includes(query);
          const matchId = (r.id || '').toLowerCase().includes(query);
          if (!matchName && !matchPhone && !matchId) return false;
        }

        // Date from
        if (dateFrom && r.startDate < dateFrom) return false;

        // Date to
        if (dateTo && r.endDate > dateTo) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') return (b.startDate || '').localeCompare(a.startDate || '');
        if (sortBy === 'date-asc') return (a.startDate || '').localeCompare(b.startDate || '');
        if (sortBy === 'amount-desc') return (parseFloat(b.amount) || 0) - (parseFloat(a.amount) || 0);
        if (sortBy === 'amount-asc') return (parseFloat(a.amount) || 0) - (parseFloat(b.amount) || 0);
        if (sortBy === 'name-asc') return (a.customerName || '').localeCompare(b.customerName || '');
        if (sortBy === 'km-desc') return (parseFloat(b.km) || 0) - (parseFloat(a.km) || 0);
        return 0;
      });
  }, [records, searchTerm, dateFrom, dateTo, sortBy]);

  // Aggregates for filtered records
  const sumAmount = filteredRecords.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
  const sumLoan = filteredRecords.reduce((sum, r) => sum + (parseFloat(r.loanAmount) || 0), 0);
  const sumKM = filteredRecords.reduce((sum, r) => sum + (parseFloat(r.km) || 0), 0);

  const isAllSelected = filteredRecords.length > 0 && filteredRecords.every((r) => selectedIds.has(r.id));

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      clearSelection();
    } else {
      selectAll(filteredRecords.map((r) => r.id));
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setDateFrom('');
    setDateTo('');
    setSortBy('date-desc');
  };

  return (
    <div className="space-y-4 animate-fade-in pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Customer Transaction Records</h2>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full">
              {records.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Search, filter, inspect, and select records for tax filing compilation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && (
            <button
              onClick={generateBatchReport}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-all inline-flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4 text-blue-400" />
              <span>Generate Tax Schedule ({selectedIds.size})</span>
            </button>
          )}
          <button
            onClick={openAddRecordModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all inline-flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add New Record</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar Card */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          {/* Search Input */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by customer name, phone, or REC ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
            <kbd className="hidden sm:inline absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] bg-slate-200 text-slate-600 px-1 rounded">
              /
            </kbd>
          </div>

          {/* Date From */}
          <div className="md:col-span-2 flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500 shrink-0">From:</span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
            />
          </div>

          {/* Date To */}
          <div className="md:col-span-2 flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500 shrink-0">To:</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
            />
          </div>

          {/* Sort By */}
          <div className="md:col-span-3 flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500 shrink-0">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
            >
              <option value="date-desc">Period (Newest First)</option>
              <option value="date-asc">Period (Oldest First)</option>
              <option value="amount-desc">Amount (Highest First)</option>
              <option value="amount-asc">Amount (Lowest First)</option>
              <option value="name-asc">Customer Name (A-Z)</option>
              <option value="km-desc">Distance (Highest KM)</option>
            </select>
          </div>

          {/* Reset Filters */}
          <div className="md:col-span-1 flex justify-end">
            <button
              onClick={handleResetFilters}
              title="Reset all filters"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Floating Batch Selection Bar */}
      {selectedIds.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl flex items-center justify-between text-xs text-blue-900 animate-slide-up">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>
              <strong>{selectedIds.size}</strong> of {filteredRecords.length} records selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={generateBatchReport}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs"
            >
              Compile Tax Report for Selected
            </button>
            <button
              onClick={clearSelection}
              className="px-3 py-1.5 bg-white border border-blue-300 hover:bg-blue-100 text-blue-800 rounded-lg font-medium"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Master Data Grid Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredRecords.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center mx-auto text-xl">
              🔍
            </div>
            <h3 className="font-bold text-sm text-slate-900">No Matching Records Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No transactions match your search keyword or selected date parameters.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Filters & Show All</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 select-none">
                <tr>
                  <th className="px-4 py-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleToggleSelectAll}
                      className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3">RECORD ID</th>
                  <th className="px-4 py-3">CUSTOMER NAME</th>
                  <th className="px-4 py-3">CONTACT NUMBER</th>
                  <th className="px-4 py-3">PERIOD DATES</th>
                  <th className="px-4 py-3 text-right">GROSS AMOUNT (₹)</th>
                  <th className="px-4 py-3 text-right">LOAN AMOUNT (₹)</th>
                  <th className="px-4 py-3 text-right">DISTANCE</th>
                  <th className="px-4 py-3 text-center w-36">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredRecords.map((record) => {
                  const isSelected = selectedIds.has(record.id);
                  return (
                    <tr
                      key={record.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSelected ? 'bg-blue-50/60' : ''
                      }`}
                    >
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRecord(record.id)}
                          className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>
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
                            title="View Details"
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openEditRecordModal(record.id)}
                            title="Edit Record (Popup)"
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => generateSingleReport(record)}
                            title="Generate Single Report"
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteModalRecord(record)}
                            title="Delete Record"
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer & Aggregates Summary */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <span className="text-slate-500 font-medium">
            Showing <strong className="text-slate-900 font-mono">{filteredRecords.length}</strong> of{' '}
            <strong className="text-slate-900 font-mono">{records.length}</strong> records
          </span>

          <div className="flex items-center gap-3 font-mono">
            <span>
              Filtered Gross: <strong className="text-emerald-700">{formatCurrency(sumAmount, settings.currency)}</strong>
            </span>
            <span className="text-slate-300">•</span>
            <span>
              Filtered Loan: <strong className="text-amber-700">{formatCurrency(sumLoan, settings.currency)}</strong>
            </span>
            <span className="text-slate-300">•</span>
            <span>
              Filtered Distance: <strong className="text-indigo-700">{formatKM(sumKM)}</strong>
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
