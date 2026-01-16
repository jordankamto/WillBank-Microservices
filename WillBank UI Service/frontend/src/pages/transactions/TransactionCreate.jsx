import { useState, useEffect } from 'react';
import { customerService } from '../../services/customerService';
import { accountService } from '../../services/accountService';
import { transactionService } from '../../services/transactionService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export default function TransactionCreate() {
  const [activeTab, setActiveTab] = useState('deposit'); // deposit, withdraw, transfer
  const [customers, setCustomers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerId: '',
    accountId: '',
    targetAccountId: '',
    amount: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await customerService.getAll();
      setCustomers(response.data.filter(c => c.status === 'ACTIVE'));
    } catch (error) {
      console.error('Erreur chargement clients:', error);
    }
  };

  const handleCustomerSelect = async (customerId) => {
    setFormData({ ...formData, customerId, accountId: '', targetAccountId: '' });
    try {
      const response = await accountService.getByCustomerId(customerId);
      setAccounts(response.data.filter(a => a.status === 'ACTIVE'));
    } catch (error) {
      console.error('Erreur chargement comptes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (activeTab === 'deposit') {
        await transactionService.deposit({
          accountId: formData.accountId,
          amount: parseFloat(formData.amount)
        });
        toast.success('Dépôt effectué avec succès');
      } else if (activeTab === 'withdraw') {
        await transactionService.withdraw({
          accountId: formData.accountId,
          amount: parseFloat(formData.amount)
        });
        toast.success('Retrait effectué avec succès');
      } else if (activeTab === 'transfer') {
        await transactionService.transfer({
          sourceAccountId: formData.accountId,
          targetAccountId: formData.targetAccountId,
          amount: parseFloat(formData.amount)
        });
        toast.success('Virement effectué avec succès');
      }

      setFormData({ customerId: '', accountId: '', targetAccountId: '', amount: '' });
      setAccounts([]);
    } catch (error) {
      console.error('Erreur transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Nouvelle Transaction</h1>

      <div className="card">
        {/* Tabs */}
        <div className="flex gap-2 border-b mb-6">
          <button
            onClick={() => setActiveTab('deposit')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'deposit'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Dépôt
          </button>
          <button
            onClick={() => setActiveTab('withdraw')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'withdraw'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Retrait
          </button>
          <button
            onClick={() => setActiveTab('transfer')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'transfer'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Virement
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sélection Client */}
          <div>
            <label className="block text-sm font-medium mb-2">Client</label>
            <select
              value={formData.customerId}
              onChange={(e) => handleCustomerSelect(e.target.value)}
              className="input-field"
              required
            >
              <option value="">Sélectionner un client</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.firstName} {c.lastName} - {c.email}
                </option>
              ))}
            </select>
          </div>

          {/* Compte Source */}
          {formData.customerId && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Compte {activeTab === 'transfer' ? 'Source' : ''}
              </label>
              <select
                value={formData.accountId}
                onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                className="input-field"
                required
              >
                <option value="">Sélectionner un compte</option>
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.type} - Solde: {formatCurrency(a.balance)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Compte Destination (Transfer uniquement) */}
          {activeTab === 'transfer' && formData.accountId && (
            <div>
              <label className="block text-sm font-medium mb-2">Compte Destination</label>
              <select
                value={formData.targetAccountId}
                onChange={(e) => setFormData({ ...formData, targetAccountId: e.target.value })}
                className="input-field"
                required
              >
                <option value="">Sélectionner un compte</option>
                {accounts.filter(a => a.id !== formData.accountId).map(a => (
                  <option key={a.id} value={a.id}>
                    {a.type} - Solde: {formatCurrency(a.balance)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Montant */}
          <div>
            <label className="block text-sm font-medium mb-2">Montant (XAF)</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="input-field"
              placeholder="0"
              min="1"
              step="1"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? 'Traitement...' : `Effectuer ${activeTab === 'deposit' ? 'le Dépôt' : activeTab === 'withdraw' ? 'le Retrait' : 'le Virement'}`}
          </button>
        </form>
      </div>
    </div>
  );
}