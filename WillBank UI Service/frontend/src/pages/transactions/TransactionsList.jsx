import { useEffect, useState } from 'react';
import { FiFilter, FiDownload } from 'react-icons/fi';
import { dashboardService } from '../../services/dashboardService';
import { formatCurrency, formatDate, getStatusBadge } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export default function TransactionsList() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: '', date: '' });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async (params = {}) => {
    try {
      setLoading(true);
      const response = await dashboardService.searchTransactions(params);
      setTransactions(response.data);
    } catch (error) {
      console.error('Erreur chargement transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    const params = {};
    if (filters.type) params.type = filters.type;
    if (filters.date) params.date = filters.date;
    fetchTransactions(params);
  };

  const handleReset = () => {
    setFilters({ type: '', date: '' });
    fetchTransactions();
  };

  const exportCSV = () => {
    const headers = ['Date', 'Type', 'Montant', 'Statut'];
    const rows = transactions.map(tx => [
      formatDate(tx.createdAt),
      tx.type,
      tx.amount,
      tx.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${Date.now()}.csv`;
    a.click();
    toast.success('Export CSV réussi');
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Transactions Globales</h1>
        <button onClick={exportCSV} className="btn-secondary flex items-center gap-2">
          <FiDownload /> Export CSV
        </button>
      </div>

      {/* Filtres */}
      <div className="card">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <FiFilter /> Filtres
        </h3>
        <form onSubmit={handleFilter} className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="input-field"
            >
              <option value="">Tous les types</option>
              <option value="DEPOSIT">Dépôt</option>
              <option value="WITHDRAWAL">Retrait</option>
              <option value="TRANSFER">Virement</option>
              <option value="PAYMENT">Paiement</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="input-field"
            />
          </div>

          <div className="flex items-end gap-2">
            <button type="submit" className="btn-primary">
              Filtrer
            </button>
            <button type="button" onClick={handleReset} className="btn-secondary">
              Réinitialiser
            </button>
          </div>
        </form>
      </div>

      {/* Tableau */}
      <div className="card overflow-x-auto">
        <p className="mb-4 text-sm text-gray-500">
          {transactions.length} transaction(s) trouvée(s)
        </p>
        <table className="w-full">
          <thead className="border-b">
            <tr className="text-left">
              <th className="pb-3">Date</th>
              <th className="pb-3">ID Transaction</th>
              <th className="pb-3">Type</th>
              <th className="pb-3">Montant</th>
              <th className="pb-3">Statut</th>
              <th className="pb-3">Message</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => {
              const statusBadge = getStatusBadge(tx.status);
              return (
                <tr key={tx.transactionId} className="table-row border-b">
                  <td className="py-3">{formatDate(tx.createdAt)}</td>
                  <td className="py-3 font-mono text-sm">{tx.transactionId.substring(0, 8)}...</td>
                  <td className="py-3">{tx.type}</td>
                  <td className="py-3 font-bold">{formatCurrency(tx.amount)}</td>
                  <td className="py-3">
                    <span className={`px-3 py-1 rounded-full text-sm ${statusBadge.bg} ${statusBadge.text}`}>
                      {statusBadge.label}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-600">{tx.message || '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}