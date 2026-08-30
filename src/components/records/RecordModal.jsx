import React, { useState, useEffect } from 'react';
import { useRecords } from '../../context/RecordContext';
import { calculateDays, formatCurrency } from '../../utils/formatters';
import { 
  X, 
  Save, 
  FileText, 
  Calendar, 
  IndianRupee, 
  Navigation, 
  User, 
  AlertTriangle,
  RotateCcw,
  Sparkles,
  PlusCircle,
  Edit
} from 'lucide-react';

export const RecordModal = () => {
  const { 
    records, 
    recordModalOpen, 
    recordModalId, 
    closeRecordModal, 
    addRecord, 
    updateRecord, 
    settings,
    setIsFormDirty 
  } = useRecords();

  if (!recordModalOpen) return null;

  const isEditing = Boolean(recordModalId);
  const existingRecord = isEditing ? records.find((r) => r.id === recordModalId) : null;

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

  // Populate form on open
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
    } else {
      setFormData({
        customerName: '',
        phone: '',
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date().toISOString().slice(0, 10),
        amount: '',
        loanAmount: '',
        km: '',
      });
    }
    setErrors({});
    setErrorList([]);
  }, [recordModalOpen, recordModalId, existingRecord]);

  // Derived calculations
  const durationDays = calculateDays(formData.startDate, formData.endDate);
  const numAmount = parseFloat(formData.amount) || 0;
  const numLoan = parseFloat(formData.loanAmount) || 0;
  const netBase = numAmount - numLoan;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsFormDirty(true);

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
      updateRecord(recordModalId, payload, andGenerate);
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
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in no-print"
      onClick={closeRecordModal}
    >
      <div 
        className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-scale-up max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
              {isEditing ? <Edit className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white tracking-tight">
                {isEditing ? `Edit Record #${existingRecord?.id || ''}` : 'Add New Transaction Record'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {isEditing ? 'Modify captured details for this customer' : 'Quick entry modal • Saved directly to local storage'}
              </p>
            </div>
          </div>
          <button
            onClick={closeRecordModal}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* Error Alert Banner */}
          {errorList.length > 0 && (
            <div className="bg-red-50 border border-red-200 p-3.5 rounded-xl flex items-start gap-3 text-red-800">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <strong className="font-semibold block">Please fix the following before saving:</strong>
                <ul className="list-disc list-inside space-y-0.5 text-red-700 text-[11px]">
                  {errorList.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); handleSave(false); }} className="space-y-5">
            
            {/* Section 1: Customer Information */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <span className="w-5 h-5 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold text-[10px]">1</span>
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Customer Information</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Customer Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Apex Global Logistics Ltd"
                    value={formData.customerName}
                    onChange={(e) => handleChange('customerName', e.target.value)}
                    className={`w-full px-3 py-2 bg-white border rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all ${
                      errors.customerName ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
                    }`}
                    required
                    autoFocus
                  />
                  {errors.customerName && <p className="text-[10px] text-red-600 mt-1 font-medium">{errors.customerName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Customer Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className={`w-full px-3 py-2 bg-white border rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all ${
                      errors.phone ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
                    }`}
                    required
                  />
                  {errors.phone && <p className="text-[10px] text-red-600 mt-1 font-medium">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Section 2: Period */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <span className="w-5 h-5 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold text-[10px]">2</span>
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Service Period</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                    className={`w-full px-3 py-2 bg-white border rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 ${
                      errors.startDate ? 'border-red-500' : 'border-slate-300'
                    }`}
                    required
                  />
                  {errors.startDate && <p className="text-[10px] text-red-600 mt-1 font-medium">{errors.startDate}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleChange('endDate', e.target.value)}
                    className={`w-full px-3 py-2 bg-white border rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 ${
                      errors.endDate ? 'border-red-500' : 'border-slate-300'
                    }`}
                    required
                  />
                  {errors.endDate && <p className="text-[10px] text-red-600 mt-1 font-medium">{errors.endDate}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Active Duration
                  </label>
                  <div className="h-[38px] px-3 bg-white border border-slate-300 rounded-lg flex items-center gap-1.5 text-xs font-bold text-blue-700">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    <span>{durationDays > 0 ? `${durationDays} Day${durationDays > 1 ? 's' : ''}` : '0 Days'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Financial Details in INR (₹) */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <span className="w-5 h-5 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold text-[10px]">3</span>
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Financial Breakdown (INR ₹)</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Gross Amount (₹) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs">₹</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => handleChange('amount', e.target.value)}
                      className={`w-full pl-7 pr-3 py-2 bg-white border rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 ${
                        errors.amount ? 'border-red-500' : 'border-slate-300'
                      }`}
                      required
                    />
                  </div>
                  {errors.amount && <p className="text-[10px] text-red-600 mt-1 font-medium">{errors.amount}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Loan / Financed (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs">₹</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={formData.loanAmount}
                      onChange={(e) => handleChange('loanAmount', e.target.value)}
                      className={`w-full pl-7 pr-3 py-2 bg-white border rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 ${
                        errors.loanAmount ? 'border-red-500' : 'border-slate-300'
                      }`}
                    />
                  </div>
                  {errors.loanAmount && <p className="text-[10px] text-red-600 mt-1 font-medium">{errors.loanAmount}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Net Balance
                  </label>
                  <div className="h-[38px] px-3 bg-white border border-slate-300 rounded-lg flex items-center justify-between text-xs font-mono font-bold">
                    <span className="text-slate-500 text-[10px]">Net:</span>
                    <span className={netBase >= 0 ? 'text-emerald-700' : 'text-red-600'}>
                      {formatCurrency(netBase, settings.currency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Travel Distance */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <span className="w-5 h-5 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold text-[10px]">4</span>
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Distance (KM)</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
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
                      className={`w-full pr-12 pl-3 py-2 bg-white border rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 ${
                        errors.km ? 'border-red-500' : 'border-slate-300'
                      }`}
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">KM</span>
                  </div>
                  {errors.km && <p className="text-[10px] text-red-600 mt-1 font-medium">{errors.km}</p>}
                </div>

                <div className="flex items-center gap-2 text-slate-500 text-[11px] bg-white p-2.5 rounded-lg border border-slate-200">
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Mileage entries are compiled for statutory vehicle travel deduction schedules.</span>
                </div>
              </div>
            </div>

          </form>

        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={closeRecordModal}
            className="px-4 py-2 text-slate-600 hover:text-slate-800 text-xs font-semibold"
          >
            Cancel
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSave(true)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-all inline-flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>Save & Generate Report</span>
            </button>
            <button
              type="button"
              onClick={() => handleSave(false)}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all inline-flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Update Record' : 'Save Record'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
