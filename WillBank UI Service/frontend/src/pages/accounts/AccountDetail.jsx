import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiDownload } from 'react-icons/fi';
import { accountService } from '../../services/accountService';
import { transactionService } from '../../services/transactionService';
import { customerService } from '../../services/customerService';
import { formatCurrency, formatDate, getStatusBadge } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function AccountDetail() {
  const { id } = useParams();
  const [account, setAccount] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const size = 20;

  useEffect(() => {
    fetchData();
  }, [id, page]);

  const fetchData = async () => {
    try {
      const accountRes = await accountService.getById(id);
      setAccount(accountRes.data);
      
      const customerRes = await customerService.getById(accountRes.data.customerId);
      setCustomer(customerRes.data);
      
      const transactionsRes = await transactionService.getByAccount(id, page, size);
      setTransactions(transactionsRes.data);
    } catch (error) {
      console.error('Erreur chargement détails:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!account) return <div>Compte non trouvé</div>;

  const statusBadge = getStatusBadge(account.status);
  const typeBadge = getStatusBadge(account.type);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/accounts" className="p-2 hover:bg-gray-100 rounded-lg">
          <FiArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold">Détails du Compte</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-bold mb-4">Informations Compte</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">ID Compte</p>
              <p className="font-mono text-sm">{account.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Type</p>
              <span className={`px-3 py-1 rounded-full text-sm ${typeBadge.bg} ${typeBadge.text}`}>
                {typeBadge.label}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Solde</p>
              <p className="text-3xl font-bold text-green-600">{formatCurrency(account.balance)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Statut</p>
              <span className={`px-3 py-1 rounded-full text-sm ${statusBadge.bg} ${statusBadge.text}`}>
                {statusBadge.label}
              </span>
            </div>
          </div>
        </div>

        {customer && (
          <div className="card">
            <h3 className="text-lg font-bold mb-4">Titulaire du Compte</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Nom</p>
                <p className="font-medium">{customer.firstName} {customer.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{customer.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Téléphone</p>
                <p className="font-medium">{customer.phone}</p>
              </div>
              <Link
                to={`/customers/${customer.id}/dashboard`}
                className="btn-primary inline-block"
              >
                Voir Dashboard Client
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Historique des Transactions</h3>
          <Link
            to={`/accounts/${id}/statement`}
            className="btn-secondary flex items-center gap-2"
          >
            <FiDownload /> Télécharger Relevé
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left">
                <th className="pb-3">Date</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Montant</th>
                <th className="pb-3">Statut</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => {
                const txStatusBadge = getStatusBadge(tx.status);
                return (
                  <tr key={tx.transactionId} className="table-row border-b">
                    <td className="py-3">{formatDate(tx.createdAt)}</td>
                    <td className="py-3">{tx.type}</td>
                    <td className="py-3 font-bold">{formatCurrency(tx.amount)}</td>
                    <td className="py-3">
                      <span className={`px-3 py-1 rounded-full text-sm ${txStatusBadge.bg} ${txStatusBadge.text}`}>
                        {txStatusBadge.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="btn-secondary disabled:opacity-50"
          >
            Précédent
          </button>
          <p className="text-sm text-gray-500">Page {page + 1}</p>
          <button
            onClick={() => setPage(page + 1)}
            disabled={transactions.length < size}
            className="btn-secondary disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
}