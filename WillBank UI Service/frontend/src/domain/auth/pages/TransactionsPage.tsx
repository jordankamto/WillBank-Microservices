import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../core/auth/AuthContext';
import transactionService from '../../transaction/services/transactionService';
import accountService from '../../account/services/accountService';
import { Transaction, Account } from '../../../types/api.types';
import { Card } from '../../../shared/components/UI/Card/Card';
import { Button } from '../../../shared/components/UI/Button/Button';
import { Badge } from '../../../shared/components/UI/Badge/Badge';
import { Spinner } from '../../../shared/components/UI/Spinner/Spinner';
import { Modal } from '../../../shared/components/UI/Modal/Modal';
import { formatCurrency, formatDateTime } from '../../../core/utils/formatters';
import { TRANSACTION_TYPE_LABELS } from '../../../config/constants';
import { FiArrowDownCircle, FiArrowUpCircle, FiRefreshCw, FiFilter } from 'react-icons/fi';
import './TransactionsPage.css';

/**
 * Page de gestion des transactions
 */

export const TransactionsPage: React.FC = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionType, setTransactionType] = useState<'DEPOSIT' | 'WITHDRAW' | 'TRANSFER'>('DEPOSIT');

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccountId) {
      loadTransactions(selectedAccountId);
    }
  }, [selectedAccountId]);

  const loadAccounts = async () => {
    if (!user?.customerId) {
      setError('Identifiant client non disponible');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await accountService.getAccountsByCustomerId(user.customerId);
      setAccounts(data);
      if (data.length > 0) {
        setSelectedAccountId(data[0].id);
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des comptes');
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async (accountId: string) => {
    try {
      setLoading(true);
      const data = await transactionService.getTransactionsByAccountId(accountId);
      setTransactions(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleNewTransaction = (type: 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER') => {
    setTransactionType(type);
    setShowTransactionModal(true);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
        return <FiArrowDownCircle className="transaction-icon transaction-icon-deposit" />;
      case 'WITHDRAW':
        return <FiArrowUpCircle className="transaction-icon transaction-icon-withdraw" />;
      case 'TRANSFER':
        return <FiRefreshCw className="transaction-icon transaction-icon-transfer" />;
      default:
        return null;
    }
  };

  const getTransactionVariant = (type: string): 'success' | 'danger' | 'default' => {
    switch (type) {
      case 'DEPOSIT':
        return 'success';
      case 'WITHDRAW':
        return 'danger';
      default:
        return 'default';
    }
  };

  if (loading && accounts.length === 0) {
    return <Spinner fullScreen />;
  }

  const selectedAccount = accounts.find(acc => acc.id === selectedAccountId);

  return (
    <div className="transactions-page">
      <div className="page-header">
        <div>
          <h1>Transactions</h1>
          <p>Gérez vos opérations bancaires</p>
        </div>
        <div className="header-actions">
          <Button
            variant="success"
            icon={<FiArrowDownCircle />}
            onClick={() => handleNewTransaction('DEPOSIT')}
          >
            Dépôt
          </Button>
          <Button
            variant="danger"
            icon={<FiArrowUpCircle />}
            onClick={() => handleNewTransaction('WITHDRAW')}
          >
            Retrait
          </Button>
          <Button
            variant="primary"
            icon={<FiRefreshCw />}
            onClick={() => handleNewTransaction('TRANSFER')}
          >
            Virement
          </Button>
        </div>
      </div>

      {error && (
        <div className="error-container">
          <p>{error}</p>
        </div>
      )}

      {/* Sélecteur de compte */}
      <Card>
        <div className="account-selector">
          <label htmlFor="account-select">Compte sélectionné :</label>
          <select
            id="account-select"
            value={selectedAccountId}
            onChange={(e) => setSelectedAccountId(e.target.value)}
            className="account-select"
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.id.substring(0, 8)}... - {formatCurrency(account.balance)}
              </option>
            ))}
          </select>
          {selectedAccount && (
            <div className="account-info">
              <span className="account-balance-label">Solde disponible :</span>
              <span className="account-balance-value">
                {formatCurrency(selectedAccount.balance)}
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* Liste des transactions */}
      <Card title="Historique des transactions">
        {loading ? (
          <Spinner />
        ) : transactions.length === 0 ? (
          <p className="text-center">Aucune transaction pour ce compte</p>
        ) : (
          <div className="transactions-list">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="transaction-card">
                <div className="transaction-left">
                  {getTransactionIcon(transaction.type)}
                  <div className="transaction-details">
                    <div className="transaction-type">
                      <Badge variant={getTransactionVariant(transaction.type)}>
                        {TRANSACTION_TYPE_LABELS[transaction.type]}
                      </Badge>
                    </div>
                    <p className="transaction-id">ID: {transaction.id.substring(0, 12)}...</p>
                    <p className="transaction-date">
                      {formatDateTime(transaction.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="transaction-right">
                  <span className={`transaction-amount ${
                    transaction.type === 'DEPOSIT' ? 'amount-positive' : 'amount-negative'
                  }`}>
                    {transaction.type === 'DEPOSIT' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};