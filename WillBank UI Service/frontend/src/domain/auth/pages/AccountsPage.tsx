import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../core/auth/AuthContext';
import accountService from '../../account/services/accountService';
import { Account } from '../../../types/api.types';
import { Card } from '../../../shared/components/UI/Card/Card';
import { Button } from '../../../shared/components/UI/Button/Button';
import { Badge } from '../../../shared/components/UI/Badge/Badge';
import { Spinner } from '../../../shared/components/UI/Spinner/Spinner';
import { Modal } from '../../../shared/components/UI/Modal/Modal';
import { formatCurrency, formatDate } from '../../../core/utils/formatters';
import { ACCOUNT_STATUS_LABELS, ACCOUNT_TYPE_LABELS } from '../../../config/constants';
import { FiPlus, FiEye, FiLock, FiXCircle } from 'react-icons/fi';
import './AccountsPage.css';

/**
 * Page de gestion des comptes bancaires
 */

export const AccountsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadAccounts();
  }, []);

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
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des comptes');
    } finally {
      setLoading(false);
    }
  };

  const handleFreezeAccount = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir geler ce compte ?')) return;
    
    try {
      await accountService.freezeAccount(id);
      loadAccounts();
    } catch (err: any) {
      alert(err.message || 'Erreur lors du gel du compte');
    }
  };

  const handleBlockAccount = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir bloquer ce compte ?')) return;
    
    try {
      await accountService.blockAccount(id);
      loadAccounts();
    } catch (err: any) {
      alert(err.message || 'Erreur lors du blocage du compte');
    }
  };

  const getStatusVariant = (status: string): 'success' | 'danger' | 'warning' | 'default' => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'FROZEN':
        return 'warning';
      case 'BLOCKED':
      case 'CLOSED':
        return 'danger';
      default:
        return 'default';
    }
  };

  if (loading) {
    return <Spinner fullScreen />;
  }

  return (
    <div className="accounts-page">
      <div className="page-header">
        <div>
          <h1>Mes comptes bancaires</h1>
          <p>Gérez vos comptes et consultez vos soldes</p>
        </div>
        <Button
          variant="primary"
          icon={<FiPlus />}
          onClick={() => setShowCreateModal(true)}
        >
          Nouveau compte
        </Button>
      </div>

      {error && (
        <div className="error-container">
          <p>{error}</p>
        </div>
      )}

      <Card>
        {accounts.length === 0 ? (
          <p className="text-center">Aucun compte bancaire</p>
        ) : (
          <div className="accounts-table">
            <table>
              <thead>
                <tr>
                  <th>Numéro de compte</th>
                  <th>Type</th>
                  <th>Solde</th>
                  <th>Statut</th>
                  <th>Date de création</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr key={account.id}>
                    <td className="account-number">
                      {account.id.substring(0, 8)}...
                    </td>
                    <td>{ACCOUNT_TYPE_LABELS[account.type]}</td>
                    <td className="account-balance">
                      {formatCurrency(account.balance)}
                    </td>
                    <td>
                      <Badge variant={getStatusVariant(account.status)}>
                        {ACCOUNT_STATUS_LABELS[account.status]}
                      </Badge>
                    </td>
                    <td>{formatDate(account.createdAt)}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="action-btn"
                          onClick={() => navigate(`/accounts/${account.id}`)}
                          title="Voir les détails"
                        >
                          <FiEye />
                        </button>
                        {account.status === 'ACTIVE' && (
                          <>
                            <button
                              className="action-btn action-btn-warning"
                              onClick={() => handleFreezeAccount(account.id)}
                              title="Geler le compte"
                            >
                              <FiLock />
                            </button>
                            <button
                              className="action-btn action-btn-danger"
                              onClick={() => handleBlockAccount(account.id)}
                              title="Bloquer le compte"
                            >
                              <FiXCircle />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};