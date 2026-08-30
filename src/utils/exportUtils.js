export const exportRecordsToCSV = (records, filename = 'TaxReport_Export.csv') => {
  if (!records || records.length === 0) return false;

  const headers = [
    'Record ID',
    'Customer Name',
    'Contact Number',
    'Start Date',
    'End Date',
    'Gross Amount ($)',
    'Loan Amount ($)',
    'Net Base Balance ($)',
    'Distance (KM)',
    'Created Timestamp'
  ];

  const csvRows = [headers.join(',')];

  records.forEach((r) => {
    const net = (parseFloat(r.amount) || 0) - (parseFloat(r.loanAmount) || 0);
    const row = [
      `"${r.id}"`,
      `"${(r.customerName || '').replace(/"/g, '""')}"`,
      `"${(r.phone || '').replace(/"/g, '""')}"`,
      `"${r.startDate}"`,
      `"${r.endDate}"`,
      parseFloat(r.amount) || 0,
      parseFloat(r.loanAmount) || 0,
      net,
      parseFloat(r.km) || 0,
      `"${r.createdAt || ''}"`
    ];
    csvRows.push(row.join(','));
  });

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
};

export const exportDatabaseJSON = (records, settings) => {
  const data = {
    application: "TaxLedger Pro",
    exportVersion: "1.0",
    exportedAt: new Date().toISOString(),
    settings: settings,
    totalRecords: records.length,
    records: records
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `taxledger_local_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
};
