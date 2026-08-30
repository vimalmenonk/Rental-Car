import React, { useState } from 'react';
import { useRecords } from '../../context/RecordContext';
import { 
  Building2, 
  Save, 
  ShieldCheck, 
  CheckCircle2,
  IndianRupee,
  FileText
} from 'lucide-react';

export const Settings = () => {
  const { settings, setSettings, showToast } = useRecords();

  const [formSettings, setFormSettings] = useState({ ...settings });

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSettings(formSettings);
    showToast('Tax profile and report presets saved successfully');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Tax Profile & Settings</h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure business entity details and header defaults automatically populated on your tax filing schedules.
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all inline-flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Tax Filing Profile Configuration Card */}
      <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">Taxpayer / Filing Entity Information</h3>
            <p className="text-xs text-slate-500">Official business information printed on tax reports</p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Company / Firm Legal Name</label>
            <input
              type="text"
              value={formSettings.companyName}
              onChange={(e) => setFormSettings({ ...formSettings, companyName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              required
            />
            <span className="text-[11px] text-slate-400 block mt-1">Formal legal entity name printed as the taxpayer header</span>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Tax ID / PAN / GSTIN / Registration Number</label>
            <input
              type="text"
              value={formSettings.taxId}
              onChange={(e) => setFormSettings({ ...formSettings, taxId: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              required
            />
            <span className="text-[11px] text-slate-400 block mt-1">Taxpayer PAN, GSTIN, or statutory registration identifier</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Currency Standard</label>
              <select
                value={formSettings.currency}
                onChange={(e) => setFormSettings({ ...formSettings, currency: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
              >
                <option value="₹">₹ (INR — Indian Rupee)</option>
                <option value="$">$ (USD — Dollar)</option>
                <option value="€">€ (EUR — Euro)</option>
                <option value="£">£ (GBP — Pound)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Default Financial Year</label>
              <select
                value={formSettings.defaultFY}
                onChange={(e) => setFormSettings({ ...formSettings, defaultFY: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
              >
                <option value="FY 2023-2024 (AY 2024-2025)">FY 2023-2024 (AY 2024-2025)</option>
                <option value="FY 2024-2025 (AY 2025-2026)">FY 2024-2025 (AY 2025-2026)</option>
                <option value="FY 2022-2023 (AY 2023-2024)">FY 2022-2023 (AY 2023-2024)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Default Report Schedule Title</label>
            <input
              type="text"
              value={formSettings.reportTitle}
              onChange={(e) => setFormSettings({ ...formSettings, reportTitle: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100">
          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            Save Tax Profile Settings
          </button>
        </div>
      </form>

    </div>
  );
};
