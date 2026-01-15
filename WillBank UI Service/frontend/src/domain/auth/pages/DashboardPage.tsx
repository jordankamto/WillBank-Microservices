import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../core/auth/AuthContext';
import dashboardService from '../../dashboard/services/dashboardService';
import { DashboardData } from '../../../types/api.types';
import { Card } from '../../../shared/components/UI/Card/Card';
import { Spinner } from '../../../shared/components/UI/Spinner/Spinner';
import { Badge } from '../../../shared/components/UI/Badge/Badge';
import { formatCurrency, formatDateTime } from '../../../core/utils/formatters';
import { 
  ACCOUNT_STATUS_LABELS, 
  ACCOUNT_TYPE_LABELS,
  TRANSACTION_TYPE_LABELS 
} from '../../../config/constants';
import { FiUsers, FiCreditCard, FiTrendingUp, FiDollarSign } from 'react-icons/fi';
import './DashboardPage.css';

/**
 * Page Dashboard - Vue d'ensemble pour le client
 */

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    if (!user?.customerId) {
      setError('Identifiant client non disponible');
      setLoading(false);
      return;
    }

    try {
      const data = await dashboardService.getDashboardData(user.customerId);
      setDashboardData(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement du dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner fullScreen />;
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
      </div>
    );
  }

  if (!dashboardData) {
    return <div>Aucune donnée disponible</div>;
  }

  const { customer, accounts, recentTransactions, totalBalance, accountsCount } = dashboardData;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Bienvenue, {customer.firstName} {customer.lastName}</h1>
        <p>Voici un aperçu de vos comptes bancaires</p>
      </div>

      {/* Statistiques */}
      <div className="dashboard-stats">
        <Card className="stat-card">
          <div className="stat-content">
            <div className="stat-icon stat-icon-primary">
              <FiDollarSign size={24} />
            </div>
            <div>
              <p className="stat-label">Solde total</p>
              <h3 className="stat-value">{formatCurrency(totalBalance)}</h3>
            </div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-content">
            <div className="stat-icon stat-icon-success">
              <FiCreditCard size={24} />
            </div>
            <div>
              <p className="stat-label">Nombre de comptes</p>
              <h3 className="stat-value">{accountsCount}</h3>
            </div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-content">
            <div className="stat-icon stat-icon-info">
              <FiTrendingUp size={24} />
            </div>
            <div>
              <p className="stat-label">Transactions récentes</p>
              <h3 className="stat-value">{recentTransactions.length}</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Comptes */}
      <Card title="Mes comptes">
        <div className="accounts-grid">
          {accounts.map((account) => (
            <div key={account.id} className="account-item">
              <div className="account-header">
                <span className="account-type">{ACCOUNT_TYPE_LABELS[account.type]}</span>
                <Badge variant={account.status === 'ACTIVE' ? 'success' : 'danger'}>
                  {ACCOUNT_STATUS_LABELS[account.status]}
                </Badge>
              </div>
              <p className="account-id">N° {account.id.substring(0, 8)}...</p>
              <h3 className="account-balance">{formatCurrency(account.balance)}</h3>
            </div>
          ))}
        </div>
      </Card>

      {/* Transactions récentes */}
      <Card title="Transactions récentes">
        {recentTransactions.length === 0 ? (
          <p className="text-center">Aucune transaction récente</p>
        ) : (
          <div className="transactions-list">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="transaction-item">
                <div>
                  <p className="transaction-type">
                    {TRANSACTION_TYPE_LABELS[transaction.type]}
                  </p>
                  <p className="transaction-date">
                    {formatDateTime(transaction.createdAt)}
                  </p>
                </div>
                <div className="transaction-amount">
                  <span className={transaction.type === 'DEPOSIT' ? 'amount-positive' : 'amount-negative'}>
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