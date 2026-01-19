import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiUser, FiMail, FiPhone, FiMapPin, FiCreditCard, FiActivity } from 'react-icons/fi';
import { customerService } from '../../services/customerService';
import { accountService } from '../../services/accountService';
import { transactionService } from '../../services/transactionService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getStatusBadge } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function CustomerDashboard() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log('CustomerDashboard rendered with id:', id);

  useEffect(() => {
    console.log('useEffect triggered with id:', id);
    fetchCustomerData();
  }, [id]);

  const fetchCustomerData = async () => {
    try {
      const [customerRes, accountsRes] = await Promise.all([
        customerService.getById(id),
        accountService.getByCustomerId(id)
        // TODO: Add transactionService.getByCustomerId(id) when backend supports it
      ]);

      setCustomer(customerRes.data);
      setAccounts(accountsRes.data || []);
      setTransactions([]); // Temporarily empty until backend supports it
    } catch (error) {
      console.error('Erreur chargement données client:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleAccountAction = async (accountId, action) => {
    try {
      if (action === 'suspend') {
        await accountService.freeze(accountId);
        toast.success('Compte suspendu');
      } else if (action === 'activate') {
        await accountService.activate(accountId);
        toast.success('Compte restauré');
      }
      fetchCustomerData(); // Recharger les données
    } catch (error) {
      console.error('Erreur action compte:', error);
      toast.error('Erreur lors de l\'action sur le compte');
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!customer) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Client non trouvé</p>
        <Link to="/customers" className="btn-primary mt-4 inline-block">
          Retour à la liste
        </Link>
      </div>
    );
  }

  const statusBadge = getStatusBadge(customer.status);

  return (
    <div className="space-y-6">
      {/* Header avec bouton retour */}
      <div className="flex items-center gap-4">
        <Link to="/customers" className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
          <FiArrowLeft size={20} />
        </Link>
        <h1 className="text-3xl font-bold">Dashboard Client</h1>
      </div>

      {/* Informations personnelles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FiUser className="text-primary-600" />
            Informations Personnelles
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Nom complet</p>
              <p className="font-medium">{customer.firstName} {customer.lastName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium flex items-center gap-2">
                <FiMail className="text-gray-400" />
                {customer.email}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Téléphone</p>
              <p className="font-medium flex items-center gap-2">
                <FiPhone className="text-gray-400" />
                {customer.phone}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Adresse</p>
              <p className="font-medium flex items-center gap-2">
                <FiMapPin className="text-gray-400" />
                {customer.address || 'Non spécifiée'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Statut</p>
              <span className={`px-3 py-1 rounded-full text-sm ${statusBadge.bg} ${statusBadge.text}`}>
                {statusBadge.label}
              </span>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="card">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FiActivity className="text-primary-600" />
            Statistiques
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-600">{accounts.length}</p>
              <p className="text-sm text-gray-500">Comptes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{transactions.length}</p>
              <p className="text-sm text-gray-500">Transactions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Comptes */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FiCreditCard className="text-primary-600" />
          Comptes ({accounts.length})
        </h3>
        {accounts.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Aucun compte trouvé</p>
        ) : (
          <div className="space-y-4">
            {accounts.map((account) => (
              <div key={account.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{account.accountNumber}</p>
                    <p className="text-sm text-gray-500">{account.accountType}</p>
                    <p className="text-lg font-bold text-green-600">
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: account.currency || 'EUR'
                      }).format(account.balance)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      account.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      account.status === 'FROZEN' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {account.status === 'ACTIVE' ? 'Actif' :
                       account.status === 'FROZEN' ? 'Suspendu' : account.status}
                    </span>
                    {account.status === 'ACTIVE' ? (
                      <button
                        onClick={() => handleAccountAction(account.id, 'suspend')}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Suspendre le compte"
                      >
                        🚫
                      </button>
                    ) : account.status === 'FROZEN' ? (
                      <button
                        onClick={() => handleAccountAction(account.id, 'activate')}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        title="Restaurer le compte"
                      >
                        ✅
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transactions récentes */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FiActivity className="text-primary-600" />
          Transactions Récentes ({transactions.length})
        </h3>
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Aucune transaction trouvée</p>
        ) : (
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
                {transactions.slice(0, 5).map((transaction) => (
                  <tr key={transaction.id} className="table-row border-b">
                    <td className="py-3">
                      {new Date(transaction.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-3">{transaction.transactionType}</td>
                    <td className="py-3 font-medium">
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: transaction.currency || 'EUR'
                      }).format(transaction.amount)}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        transaction.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        transaction.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
