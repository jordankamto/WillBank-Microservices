import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiDownload } from 'react-icons/fi';
import { accountService } from '../../services/accountService';
import { dashboardService } from '../../services/dashboardService';
import { formatCurrency, formatDate, formatDateShort, getStatusBadge } from '../../utils/formatters';
import { exportStatement } from '../../utils/exportPDF';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export default function AccountStatement() {
  const { id } = useParams();
  const [account, setAccount] = useState(null);
  const [statement, setStatement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchAccount();
  }, [id]);

  const fetchAccount = async () => {
    try {
      const response = await accountService.getById(id);
      setAccount(response.data);
    } catch (error) {
      console.error('Erreur chargement compte:', error);
    }
  };

  const handleGenerateStatement = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await dashboardService.getAccountStatement(id, dates.from, dates.to);
      setStatement(response.data);
      toast.success('Relevé généré avec succès');
    } catch (error) {
      console.error('Erreur génération relevé:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (statement) {
      exportStatement(statement.account, statement.transactions, dates.from, dates.to);
      toast.success('PDF téléchargé');
    }
  };

  if (!account) return <LoadingSpinner />;

  const statusBadge = getStatusBadge(account.status);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to={`/accounts/${id}`} className="p-2 hover:bg-gray-100 rounded-lg">
          <FiArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold">Relevé de Compte</h1>
      </div>

      <div className="card">
        <h3 className="text-lg font-bold mb-4">Informations Compte</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Type</p>
            <p className="font-medium">{account.type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Solde Actuel</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(account.balance)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Statut</p>
            <span className={`px-3 py-1 rounded-full text-sm ${statusBadge.bg} ${statusBadge.text}`}>
              {statusBadge.label}
            </span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-bold mb-4">Sélectionner la Période</h3>
        <form onSubmit={handleGenerateStatement} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date de début</label>
              <input
                type="date"
                value={dates.from}
                onChange={(e) => setDates({ ...dates, from: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Date de fin</label>
              <input
                type="date"
                value={dates.to}
                onChange={(e) => setDates({ ...dates, to: e.target.value })}
                className="input-field"
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
            {loading ? 'Génération...' : 'Générer le Relevé'}
          </button>
        </form>
      </div>

      {statement && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">
              Relevé du {formatDateShort(dates.from)} au {formatDateShort(dates.to)}
            </h3>
            <button onClick={handleDownloadPDF} className="btn-primary flex items-center gap-2">
              <FiDownload /> Télécharger PDF
            </button>
          </div>

          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Nombre de transactions : <span className="font-bold">{statement.transactions.length}</span>
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr className="text-left">
                  <th className="p-3">Date</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Montant</th>
                  <th className="p-3">Statut</th>
                </tr>
              </thead>
              <tbody>
                {statement.transactions.map((tx) => {
                  const txStatusBadge = getStatusBadge(tx.status);
                  return (
                    <tr key={tx.transactionId} className="border-b hover:bg-gray-50">
                      <td className="p-3">{formatDate(tx.createdAt)}</td>
                      <td className="p-3">{tx.type}</td>
                      <td className="p-3 font-bold">{formatCurrency(tx.amount)}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${txStatusBadge.bg} ${txStatusBadge.text}`}>
                          {txStatusBadge.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}