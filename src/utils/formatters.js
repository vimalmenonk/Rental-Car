export const formatCurrency = (amount, currencySymbol = '₹') => {
  const val = parseFloat(amount) || 0;
  return `${currencySymbol} ${val.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatKM = (km) => {
  const val = parseFloat(km) || 0;
  return `${val.toLocaleString('en-IN', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} KM`;
};

export const calculateDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const d1 = new Date(startDate);
  const d2 = new Date(endDate);
  const diffTime = d2 - d1;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays > 0 ? diffDays : 0;
};

export const formatDateDisplay = (dateString) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};
