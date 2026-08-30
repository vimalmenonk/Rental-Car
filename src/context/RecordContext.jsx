import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_RECORDS, DEFAULT_SETTINGS } from '../utils/seedData';

const RecordContext = createContext(null);

const STORAGE_KEYS = {
  RECORDS: 'taxledger_records_v2',
  SETTINGS: 'taxledger_settings_v2',
};

export const RecordProvider = ({ children }) => {
  // 1. Records State with Local Persistence
  const [records, setRecords] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RECORDS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading local records:', e);
    }
    return INITIAL_RECORDS;
  });

  // 2. Settings State with Local Persistence
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error loading settings:', e);
    }
    return DEFAULT_SETTINGS;
  });

  // 3. Navigation & Screen Router
  const [activeScreen, setActiveScreen] = useState('dashboard');

  // 4. Record Modal (Add / Edit Popup) State
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [recordModalId, setRecordModalId] = useState(null); // null = Add, string = Edit

  // 5. Batch Selection
  const [selectedIds, setSelectedIds] = useState(new Set());

  // 6. Drawer & Modals State
  const [drawerRecordId, setDrawerRecordId] = useState(null);
  const [deleteModalRecord, setDeleteModalRecord] = useState(null);
  const [unsavedModalOpen, setUnsavedModalOpen] = useState(false);
  const [pendingNavScreen, setPendingNavScreen] = useState(null);
  const [isFormDirty, setIsFormDirty] = useState(false);

  // 7. Report Preview Data
  const [activeReport, setActiveReport] = useState(() => ({
    title: DEFAULT_SETTINGS.reportTitle,
    fy: DEFAULT_SETTINGS.defaultFY,
    entity: DEFAULT_SETTINGS.companyName,
    taxId: DEFAULT_SETTINGS.taxId,
    scopeDesc: 'All Local Records',
    records: INITIAL_RECORDS,
  }));

  // 8. Toast Notifications
  const [toast, setToast] = useState({ message: '', visible: false, type: 'success' });

  // Save to localStorage whenever records change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to persist records locally:', e);
    }
  }, [records]);

  // Save settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to persist settings locally:', e);
    }
  }, [settings]);

  // Notification helper
  const showToast = (message, type = 'success') => {
    setToast({ message, visible: true, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3200);
  };

  // Modal Controls for Add / Edit Record Popup
  const openAddRecordModal = () => {
    setRecordModalId(null);
    setRecordModalOpen(true);
  };

  const openEditRecordModal = (id) => {
    setRecordModalId(id);
    setRecordModalOpen(true);
  };

  const closeRecordModal = () => {
    setRecordModalOpen(false);
    setRecordModalId(null);
    setIsFormDirty(false);
  };

  // Safe Navigation Guard
  const navigateTo = (screenId) => {
    setActiveScreen(screenId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // CRUD Operations
  const addRecord = (recordData, andGenerate = false) => {
    const newIdNum = records.length + 1;
    const newId = `REC-${String(newIdNum).padStart(4, '0')}`;
    const newRecord = {
      ...recordData,
      id: newId,
      createdAt: new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setRecords((prev) => [newRecord, ...prev]);
    setIsFormDirty(false);
    closeRecordModal();
    showToast(`Record #${newId} saved successfully`);

    if (andGenerate) {
      generateSingleReport(newRecord);
    }
    return newRecord;
  };

  const updateRecord = (id, updatedData, andGenerate = false) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              ...updatedData,
              updatedAt: new Date().toISOString(),
            }
          : r
      )
    );
    setIsFormDirty(false);
    closeRecordModal();
    showToast(`Record #${id} updated successfully`);

    const updatedRecord = records.find((r) => r.id === id);
    if (andGenerate && updatedRecord) {
      generateSingleReport({ ...updatedRecord, ...updatedData });
    }
  };

  const deleteRecord = (id) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    showToast(`Record #${id} deleted`);
    setDeleteModalRecord(null);
  };

  // Selection
  const toggleSelectRecord = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = (ids) => {
    setSelectedIds(new Set(ids));
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  // Report Generator Triggers
  const generateSingleReport = (record) => {
    setActiveReport({
      title: `INDIVIDUAL TAX TRANSACTION SCHEDULE — ${record.customerName}`,
      fy: settings.defaultFY,
      entity: settings.companyName,
      taxId: settings.taxId,
      scopeDesc: `Single Record #${record.id} (${record.customerName})`,
      records: [record],
    });
    navigateTo('report-preview');
  };

  const generateBatchReport = () => {
    const selected = records.filter((r) => selectedIds.has(r.id));
    if (selected.length === 0) return;
    setActiveReport({
      title: `BATCH TAX FILING TRANSACTION SCHEDULE (${selected.length} ITEMS)`,
      fy: settings.defaultFY,
      entity: settings.companyName,
      taxId: settings.taxId,
      scopeDesc: `Batch Selection of ${selected.length} Records`,
      records: selected,
    });
    navigateTo('report-preview');
  };

  const generateCustomReport = (reportConfig) => {
    setActiveReport(reportConfig);
    navigateTo('report-preview');
  };

  const reloadDemoData = () => {
    setRecords([...INITIAL_RECORDS]);
    setSelectedIds(new Set());
    showToast('Demo dataset (12 records) restored');
  };

  const clearAllRecords = () => {
    setRecords([]);
    setSelectedIds(new Set());
    showToast('All local records cleared');
  };

  return (
    <RecordContext.Provider
      value={{
        records,
        settings,
        setSettings,
        activeScreen,
        recordModalOpen,
        recordModalId,
        openAddRecordModal,
        openEditRecordModal,
        closeRecordModal,
        selectedIds,
        drawerRecordId,
        setDrawerRecordId,
        deleteModalRecord,
        setDeleteModalRecord,
        unsavedModalOpen,
        setUnsavedModalOpen,
        isFormDirty,
        setIsFormDirty,
        activeReport,
        toast,
        showToast,
        navigateTo,
        addRecord,
        updateRecord,
        deleteRecord,
        toggleSelectRecord,
        selectAll,
        clearSelection,
        generateSingleReport,
        generateBatchReport,
        generateCustomReport,
        reloadDemoData,
        clearAllRecords,
      }}
    >
      {children}
    </RecordContext.Provider>
  );
};

export const useRecords = () => {
  const context = useContext(RecordContext);
  if (!context) throw new Error('useRecords must be used within RecordProvider');
  return context;
};
