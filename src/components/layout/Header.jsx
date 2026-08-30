import React from 'react';
import { useRecords } from '../../context/RecordContext';
import { 
  FileText, 
  LayoutDashboard, 
  ListOrdered, 
  FileSpreadsheet, 
  Settings as SettingsIcon,
  HardDrive
} from 'lucide-react';

export const Header = () => {
  const { 
    activeScreen, 
    navigateTo, 
    records, 
    reloadDemoData, 
    clearAllRecords,
    setDeleteModalRecord,
    openAddRecordModal
  } = useRecords();

  const handleStateChange = (e) => {
    const val = e.target.value;
    if (val === 'default') {
      reloadDemoData();
      navigateTo('dashboard');
    } else if (val === 'empty-dashboard') {
      clearAllRecords();
      navigateTo('dashboard');
    } else if (val === 'empty-list') {
      navigateTo('record-list');
    } else if (val === 'add-popup') {
      openAddRecordModal();
    } else if (val === 'delete-modal') {
      navigateTo('record-list');
      if (records.length > 0) {
        setDeleteModalRecord(records[0]);
      }
    }
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 px-4 lg:px-8 py-3 transition-colors no-print">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Main Nav */}
        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white">TaxLedger</span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  Local App
                </span>
              </div>
              <span className="text-xs text-slate-400">Offline & Fast Data Entry</span>
            </div>
          </div>

          {/* Navigation Links (Add Record removed as requested) */}
          <nav className="flex items-center gap-1.5 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => navigateTo('dashboard')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeScreen === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
              <kbd className="hidden lg:inline text-[9px] bg-black/30 px-1 rounded text-slate-400">Alt+D</kbd>
            </button>

            <button
              onClick={() => navigateTo('record-list')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeScreen === 'record-list'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Record List</span>
              <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {records.length}
              </span>
              <kbd className="hidden lg:inline text-[9px] bg-black/30 px-1 rounded text-slate-400">Alt+R</kbd>
            </button>

            <button
              onClick={() => navigateTo('report-wizard')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeScreen === 'report-wizard' || activeScreen === 'report-preview'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Tax Report</span>
              <kbd className="hidden lg:inline text-[9px] bg-black/30 px-1 rounded text-slate-400">Alt+G</kbd>
            </button>

            <button
              onClick={() => navigateTo('settings')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeScreen === 'settings'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <SettingsIcon className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Right Tools: State Switcher & Local Status */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Quick Prototype State Switcher */}
          <div className="flex items-center gap-2 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
            <span className="text-[11px] font-semibold text-amber-400">State Demo:</span>
            <select
              onChange={handleStateChange}
              className="bg-slate-900 text-white text-xs border border-slate-700 rounded px-2 py-0.5 focus:outline-none focus:border-blue-500"
              defaultValue="default"
            >
              <option value="default">Normal (Active Records)</option>
              <option value="empty-dashboard">Empty State (0 Records)</option>
              <option value="add-popup">Add Record Popup Demo</option>
              <option value="delete-modal">Delete Modal Demo</option>
            </select>
          </div>

          {/* Local Status Indicator */}
          <div 
            className="flex items-center gap-2 bg-emerald-950/40 text-emerald-400 border border-emerald-800/50 px-3 py-1 rounded-full text-xs font-medium"
            title="All records are saved directly in your browser's local storage. Zero cloud transmission."
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="hidden sm:inline">Local DB:</span>
            <strong className="font-mono">Ready</strong>
          </div>
        </div>

      </div>
    </header>
  );
};
