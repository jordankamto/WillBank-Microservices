import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency, formatDate } from './formatters';

export const exportStatement = (account, transactions, fromDate, toDate) => {
  const doc = new jsPDF();
  
  // En-tête
  doc.setFontSize(20);
  doc.text('WillBank', 20, 20);
  doc.setFontSize(12);
  doc.text('Relevé de Compte', 20, 30);
  
  // Infos compte
  doc.setFontSize(10);
  doc.text(`Type: ${account.type}`, 20, 45);
  doc.text(`Période: ${formatDateShort(fromDate)} - ${formatDateShort(toDate)}`, 20, 52);
  doc.text(`Solde actuel: ${formatCurrency(account.balance)}`, 20, 59);
  
  // Tableau transactions
  const tableData = transactions.map(tx => [
    formatDateShort(tx.createdAt),
    tx.type,
    formatCurrency(tx.amount),
    tx.status
  ]);
  
  doc.autoTable({
    startY: 70,
    head: [['Date', 'Type', 'Montant', 'Statut']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [30, 58, 138] }
  });
  
  doc.save(`releve_${account.id}_${Date.now()}.pdf`);
};