import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiLock, FiUnlock, FiXCircle, FiCheckCircle, FiPlusCircle, FiCreditCard, FiTrendingUp } from 'react-icons/fi';
import { accountService } from '../../services/accountService';
import { customerService } from '../../services/customerService';
import { formatCurrency, getStatusBadge } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmModal from '../../components/common/ConfirmModal';
import toast from 'react-hot-toast';

export default function AccountsList() {
  const [accounts, setAccounts] = useState([]);
  const [customers, setCustomers] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null, accountId: null });
  const [newAccount, setNewAccount] = useState({ customerId: '', type: 'CURRENT' });
  const [customersList, setCustomersList] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [accountsRes, customersRes] = await Promise.all([
        accountService.getAll(),
        customerService.getAll()
      ]);
      
      setAccounts(accountsRes.data);
      setCustomersList(customersRes.data);
      
      // Map customers par ID
      const customersMap = {};
      customersRes.data.forEach(c => {
        customersMap[c.id] = c;
      });
      setCustomers(customersMap);
    } catch (error) {
      console.error('Erreur chargement comptes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action, accountId) => {
    try {
      if (action === 'freeze') {
        await accountService.freeze(accountId);
        toast.success('Compte gelé avec succès');
      } else if (action === 'activate') {
        await accountService.activate(accountId);
        toast.success('Compte dégelé avec succès');
      } else if (action === 'block') {
        await accountService.block(accountId);
        toast.success('Compte bloqué avec succès');
      } else if (action === 'close') {
        await accountService.close(accountId);
        toast.success('Compte fermé avec succès');
      }
      fetchData();
    } catch (error) {
      console.error('Erreur action compte:', error);
    }
    setConfirmModal({ isOpen: false, action: null, accountId: null });
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    try {
      await accountService.create(newAccount);
      toast.success('Compte créé avec succès');
      setShowModal(false);
      setNewAccount({ customerId: '', type: 'CURRENT' });
      fetchData();
    } catch (error) {
      console.error('Erreur création compte:', error);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestion des Comptes</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlusCircle /> Ouvrir un Compte
        </button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="border-b">
            <tr className="text-left">
              <th className="pb-3">Client</th>
              <th className="pb-3">Type</th>
              <th className="pb-3">Solde</th>
              <th className="pb-3">Statut</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => {
              const customer = customers[account.customerId];
              const statusBadge = getStatusBadge(account.status);
              const typeBadge = getStatusBadge(account.type);

              return (
                <tr key={account.id} className="table-row border-b">
                  <td className="py-4 text-left">
                    {customer ? `${customer.firstName} ${customer.lastName}` : 'Client inconnu'}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      {account.type === 'CURRENT' ? (
                        <>
                          <FiCreditCard className="text-blue-600" />
                          <span className="text-sm font-medium text-blue-600">Courant</span>
                        </>
                      ) : (
                        <>
                          <FiTrendingUp className="text-green-600" />
                          <span className="text-sm font-medium text-green-600">Épargne</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="py-4 font-bold text-green-600 text-left">
                    {formatCurrency(account.balance)}
                  </td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${statusBadge.bg} ${statusBadge.text}`}>
                      {statusBadge.label}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <Link
                        to={`/accounts/${account.id}`}
                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"
                        title="Détails"
                      >
                        <FiEye />
                      </Link>
                      
                      {account.status === 'ACTIVE' && (
                        <>
                          <button
                            onClick={() => setConfirmModal({
                              isOpen: true,
                              action: 'freeze',
                              accountId: account.id
                            })}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Geler"
                          >
                            <FiLock />
                          </button>
                          <button
                            onClick={() => setConfirmModal({
                              isOpen: true,
                              action: 'block',
                              accountId: account.id
                            })}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Bloquer"
                          >
                            <FiXCircle />
                          </button>
                        </>
                      )}

                      {account.status === 'FROZEN' && (
                        <button
                          onClick={() => setConfirmModal({
                            isOpen: true,
                            action: 'activate',
                            accountId: account.id
                          })}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                          title="Dégeler"
                        >
                          <FiUnlock />
                        </button>
                      )}

                      {account.status === 'BLOCKED' && (
                        <button
                          onClick={() => setConfirmModal({
                            isOpen: true,
                            action: 'activate',
                            accountId: account.id
                          })}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                          title="Débloquer"
                        >
                          <FiCheckCircle />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Création Compte */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Ouvrir un Nouveau Compte</h3>
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Client</label>
                <select
                  value={newAccount.customerId}
                  onChange={(e) => setNewAccount({ ...newAccount, customerId: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Sélectionner un client</option>
                  {customersList.filter(c => c.status === 'ACTIVE').map(c => (
                    <option key={c.id} value={c.id}>
                      {c.firstName} {c.lastName} ({c.email})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Type de Compte</label>
                <select
                  value={newAccount.type}
                  onChange={(e) => setNewAccount({ ...newAccount, type: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="CURRENT">Compte Courant</option>
                  <option value="SAVINGS">Compte Épargne</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)} 
                  className="btn-secondary"
                >
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  Créer le Compte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmation */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, action: null, accountId: null })}
        onConfirm={() => handleAction(confirmModal.action, confirmModal.accountId)}
        title={`${
          confirmModal.action === 'freeze' ? 'Geler' :
          confirmModal.action === 'activate' ? 'Dégeler/Débloquer' :
          confirmModal.action === 'block' ? 'Bloquer' :
          'Fermer'
        } le compte`}
        message={`Êtes-vous sûr de vouloir ${
          confirmModal.action === 'freeze' ? 'geler' :
          confirmModal.action === 'activate' ? 'dégeler/débloquer' :
          confirmModal.action === 'block' ? 'bloquer' :
          'fermer'
        } ce compte ?`}
        type={confirmModal.action === 'activate' ? 'success' : 'warning'}
      />
    </div>
  );
}
