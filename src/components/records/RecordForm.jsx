import React, { useState, useEffect } from 'react';
import { useRecords } from '../../context/RecordContext';
import { calculateDays, formatCurrency } from '../../utils/formatters';
import { 
  ArrowLeft, 
  Save, 
  FileText, 
  Calendar, 
  DollarSign, 
  Navigation, 
  User, 
  AlertTriangle,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const RecordForm = () => {
  const { 
    records, 
    editingRecordId, 
    addRecord, 
    updateRecord, 
    navigateTo, 
    settings,
    setIsFormDirty 
  } = useRecords();

  const isEditing = Boolean(editingRecordId);
  const existingRecord = isEditing ? records.find((r) => r.id === editingRecordId) : null;

  // Form State
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    startDate: '',
    endDate: '',
    amount: '',
    loanAmount: '',
    km: '',
  });

  const [errors, setErrors] = useState({});
  const [errorList, setErrorList] = useState([]);

  // Populate data when editing
  useEffect(() => {
    if (existingRecord) {
      setFormData({
        customerName: existingRecord.customerName || '',
        phone: existingRecord.phone || '',
        startDate: existingRecord.startDate || '',
        endDate: existingRecord.endDate || '',
        amount: existingRecord.amount !== undefined ? existingRecord.amount : '',
        loanAmount: existingRecord.loanAmount !== undefined ? existingRecord.loanAmount : '',
        km: existingRecord.km !== undefined ? existingRecord.km : '',
      });
      setIsFormDirty(false);
    } else {
      setFormData({
        customerName: '',
        phone: '',
        startDate: '',
        endDate: '',
        amount: '',
        loanAmount: '',
        km: '',
      });
      setIsFormDirty(false);
    }
  }, [editingRecordId, existingRecord]);

  // Derived values
  const durationDays = calculateDays(formData.startDate, formData.endDate);
  const numAmount = parseFloat(formData.amount) || 0;
  const numLoan = parseFloat(formData.loanAmount) || 0;
  const netBase = numAmount - numLoan;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsFormDirty(true);

    // Clear individual error
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const errorMessages = [];

    // Customer Name
    if (!formData.customerName.trim() || formData.customerName.trim().length < 2) {
      newErrors.customerName = 'Customer name is required (min 2 characters).';
      errorMessages.push('Customer Name is required.');
    }

    // Phone
    const phonePattern = /^[+]?[0-9\-\(\)\s]{7,18}$/;
    if (!formData.phone.trim() || !phonePattern.test(formData.phone.trim())) {
      newErrors.phone = 'Valid telephone or mobile number required (7-18 digits).';
      errorMessages.push('Valid Customer Contact Number is required.');
    }

    // Dates
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required.';
      errorMessages.push('Start Date is required.');
    }
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required.';
      errorMessages.push('End Date is required.');
    }
    if (formData.startDate && formData.endDate) {
      if (formData.endDate < formData.startDate) {
        newErrors.endDate = `End Date (${formData.endDate}) cannot be earlier than Start Date (${formData.startDate}).`;
        errorMessages.push('End Date cannot precede Start Date.');
      }
    }

    // Amount
    if (formData.amount === '' || isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) < 0) {
      newErrors.amount = 'Gross transaction amount must be a positive number.';
      errorMessages.push('Transaction Amount must be greater than or equal to 0.');
    }

    // Loan Amount
    if (formData.loanAmount !== '' && (isNaN(parseFloat(formData.loanAmount)) || parseFloat(formData.loanAmount) < 0)) {
      newErrors.loanAmount = 'Loan amount must be 0 or positive.';
      errorMessages.push('Loan Amount must be greater than or equal to 0.');
    }

    // KM
    if (formData.km === '' || isNaN(parseFloat(formData.km)) || parseFloat(formData.km) < 0) {
      newErrors.km = 'Distance KM must be a valid non-negative number.';
      errorMessages.push('Distance (KM) is required.');
    }

    setErrors(newErrors);
    setErrorList(errorMessages);

    return errorMessages.length === 0;
  };

  const handleSave = (andGenerate = false) => {
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const payload = {
      customerName: formData.customerName.trim(),
      phone: formData.phone.trim(),
      startDate: formData.startDate,
      endDate: formData.endDate,
      amount: parseFloat(formData.amount) || 0,
      loanAmount: parseFloat(formData.loanAmount) || 0,
      km: parseFloat(formData.km) || 0,
    };

    if (isEditing) {
      updateRecord(editingRecordId, payload, andGenerate);
    } else {
      addRecord(payload, andGenerate);
    }
  };

  const handleReset = () => {
    setFormData({
      customerName: '',
      phone: '',
      startDate: '',
      endDate: '',
      amount: '',
      loanAmount: '',
      km: '',
    });
    setErrors({});
    setErrorList([]);
    setIsFormDirty(false);
  };

  // Keyboard shortcut Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (e.shiftKey) {
          handleSave(true);
        } else {
          handleSave(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [formData, isEditing, editingRecordId]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in pb-12">
      
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <button
            onClick={() => navigateTo('record-list')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Record List</span>
          </button>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {isEditing ? `Edit Record #${existingRecord?.id || ''}` : 'Add New Transaction Record'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isEditing 
              ? 'Update the recorded details for this customer. Changes will overwrite locally.'
              : 'Enter customer, period, financial details and mileage. All data is saved on your device.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            type="button"
            onClick={() => handleSave(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-all inline-flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4 text-blue-400" />
            <span>Save & Generate</span>
          </button>
          <button
            type="button"
            onClick={() => handleSave(false)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all inline-flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Record</span>
            <kbd className="hidden sm:inline bg-black/20 text-[10px] px-1 py-0.5 rounded text-white/90">Ctrl+S</kbd>
          </button>
        </div>
      </div>

      {/* Validation Error Alert Banner */}
      {errorList.length > 0 && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3 text-red-800">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <strong className="font-semibold block">Please correct the following issues before saving:</strong>
            <ul className="list-disc list-inside space-y-0.5 text-red-700">
              {errorList.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Grouped Form Fields */}
      <form onSubmit={(e) => { e.preventDefault(); handleSave(false); }} className="space-y-6">
        
        {/* Section 1: Customer Information */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <span className="w-7 h-7 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold text-xs">1</span>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Customer Information</h3>
              <p className="text-xs text-slate-500">Legal entity or individual client identification</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Customer Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Apex Global Logistics Ltd"
                value={formData.customerName}
                onChange={(e) => handleChange('customerName', e.target.value)}
                className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all ${
                  errors.customerName ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
                }`}
                required
              />
              {errors.customerName && <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.customerName}</p>}
              <span className="text-[11px] text-slate-400 block mt-1">Name printed on official tax filing schedule</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Customer Contact Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="e.g. +1 (555) 234-5678"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all ${
                  errors.phone ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
                }`}
                required
              />
              {errors.phone && <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.phone}</p>}
              <span className="text-[11px] text-slate-400 block mt-1">Primary phone number for taxpayer contact reference</span>
            </div>
          </div>
        </div>

        {/* Section 2: Date Range */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <span className="w-7 h-7 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold text-xs">2</span>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Period of Service / Transaction</h3>
              <p className="text-xs text-slate-500">Transaction start and conclusion dates</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all ${
                  errors.startDate ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
                }`}
                required
              />
              {errors.startDate && <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.startDate}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all ${
                  errors.endDate ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
                }`}
                required
              />
              {errors.endDate && <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.endDate}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Calculated Active Duration
              </label>
              <div className="h-[42px] px-3.5 bg-slate-100 border border-slate-200 rounded-xl flex items-center gap-2 text-xs font-bold text-blue-700">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>{durationDays > 0 ? `${durationDays} Day${durationDays > 1 ? 's' : ''}` : '0 Days'}</span>
              </div>
              <span className="text-[11px] text-slate-400 block mt-1">Auto-calculated inclusive duration</span>
            </div>
          </div>
        </div>

        {/* Section 3: Financial Details */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <span className="w-7 h-7 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold text-xs">3</span>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Financial & Transaction Breakdown</h3>
              <p className="text-xs text-slate-500">Gross revenue volume and financing / loan portions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Gross Transaction Amount ($) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => handleChange('amount', e.target.value)}
                  className={`w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all ${
                    errors.amount ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
                  }`}
                  required
                />
              </div>
              {errors.amount && <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.amount}</p>}
              <span className="text-[11px] text-slate-400 block mt-1">Total gross billable amount</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Loan / Financed Amount ($)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.loanAmount}
                  onChange={(e) => handleChange('loanAmount', e.target.value)}
                  className={`w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all ${
                    errors.loanAmount ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.loanAmount && <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.loanAmount}</p>}
              <span className="text-[11px] text-slate-400 block mt-1">Financed or deductible liability portion</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Net Base Balance
              </label>
              <div className="h-[42px] px-3.5 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between text-xs font-mono font-bold text-slate-900">
                <span className="text-slate-500 text-[11px]">Net:</span>
                <span className={netBase >= 0 ? 'text-emerald-700' : 'text-red-600'}>
                  {formatCurrency(netBase, settings.currency)}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block mt-1">Computed as (Amount - Loan)</span>
            </div>
          </div>
        </div>

        {/* Section 4: Travel Distance (KM) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <span className="w-7 h-7 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold text-xs">4</span>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Travel & Distance Details</h3>
              <p className="text-xs text-slate-500">Business travel log and vehicle mileage deductions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Distance (KM) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="e.g. 850.0"
                  value={formData.km}
                  onChange={(e) => handleChange('km', e.target.value)}
                  className={`w-full pr-12 pl-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all ${
                    errors.km ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
                  }`}
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">KM</span>
              </div>
              {errors.km && <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.km}</p>}
              <span className="text-[11px] text-slate-400 block mt-1">Total recorded odometer / trip distance</span>
            </div>

            <div className="bg-slate-50 border border-dashed border-slate-200 p-3 rounded-xl flex items-start gap-2.5 text-xs text-slate-600">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Tax Schedule Note:</strong>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Mileage entries are compiled for statutory vehicle travel allowance schedules during annual filing.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <button
            type="button"
            onClick={() => navigateTo('record-list')}
            className="px-4 py-2 text-slate-600 hover:text-slate-800 text-xs font-semibold"
          >
            Cancel
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSave(true)}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-all inline-flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Save & Generate Report</span>
            </button>
            <button
              type="button"
              onClick={() => handleSave(false)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all inline-flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Update Record' : 'Save Record'}</span>
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};
