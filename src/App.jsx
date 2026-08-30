import React, { useEffect } from 'react';
import { useRecords } from './context/RecordContext';
import { Header } from './components/layout/Header';
import { Toast } from './components/layout/Toast';
import { Dashboard } from './components/dashboard/Dashboard';
import { RecordList } from './components/records/RecordList';
import { RecordModal } from './components/records/RecordModal';
import { RecordDrawer } from './components/records/RecordDrawer';
import { ReportWizard } from './components/reports/ReportWizard';
import { ReportPreview } from './components/reports/ReportPreview';
import { Settings } from './components/settings/Settings';
import { DeleteModal } from './components/modals/DeleteModal';

export const AppContent = () => {
  const { 
    activeScreen, 
    navigateTo, 
    openAddRecordModal,
    closeRecordModal,
    setDrawerRecordId, 
    setDeleteModalRecord 
  } = useRecords();

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Global Alt shortcuts
      if (e.altKey && !e.ctrlKey) {
        if (e.key.toLowerCase() === 'd') {
          e.preventDefault();
          navigateTo('dashboard');
        } else if (e.key.toLowerCase() === 'r') {
          e.preventDefault();
          navigateTo('record-list');
        } else if (e.key.toLowerCase() === 'n') {
          e.preventDefault();
          openAddRecordModal();
        } else if (e.key.toLowerCase() === 'g') {
          e.preventDefault();
          navigateTo('report-wizard');
        }
      }

      // Escape to close modals / drawers
      if (e.key === 'Escape') {
        closeRecordModal();
        setDrawerRecordId(null);
        setDeleteModalRecord(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigateTo, openAddRecordModal, closeRecordModal, setDrawerRecordId, setDeleteModalRecord]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeScreen === 'dashboard' && <Dashboard />}
        {activeScreen === 'record-list' && <RecordList />}
        {activeScreen === 'report-wizard' && <ReportWizard />}
        {activeScreen === 'report-preview' && <ReportPreview />}
        {activeScreen === 'settings' && <Settings />}
      </main>

      {/* Global Add & Edit Record Modal Popup */}
      <RecordModal />

      {/* Slide-over Drawer for Record Details */}
      <RecordDrawer />

      {/* Confirmation & Safety Modals */}
      <DeleteModal />

      {/* Global Toast */}
      <Toast />
    </div>
  );
};

export default function App() {
  return <AppContent />;
}
