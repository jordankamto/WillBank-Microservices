import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import customerService from '../../customer/services/customerService';
import { Customer } from '../../../types/api.types';
import { Card } from '../../../shared/components/UI/Card/Card';
import { Button } from '../../../shared/components/UI/Button/Button';
import { Badge } from '../../../shared/components/UI/Badge/Badge';
import { Spinner } from '../../../shared/components/UI/Spinner/Spinner';
import { Modal } from '../../../shared/components/UI/Modal/Modal';
import { CustomerForm } from '../../customer/components/CustomerForm/CustomerForm';
import { formatDate, formatPhone } from '../../../core/utils/formatters';
import { CUSTOMER_STATUS_LABELS } from '../../../config/constants';
import { FiPlus, FiEdit, FiEye } from 'react-icons/fi';


//import './CustomersPage.css';

/**
 * Page de gestion des clients
 */

export const CustomersPage: React.FC = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerService.getAllCustomers();
      setCustomers(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des clients');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    loadCustomers();
  };

  const getStatusVariant = (status: string): 'success' | 'danger' | 'warning' | 'default' => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'SUSPENDED':
        return 'danger';
      case 'PENDING_KYC':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading) {
    return <Spinner fullScreen />;
  }

  return (
    <div className="customers-page">
      <div className="page-header">
        <div>
          <h1>Gestion des clients</h1>
          <p>Liste de tous les clients de WillBank</p>
        </div>
        <Button
          variant="primary"
          icon={<FiPlus />}
          onClick={() => setShowCreateModal(true)}
        >
          Nouveau client
        </Button>
      </div>

      {error && (
        <div className="error-container">
          <p>{error}</p>
        </div>
      )}

      <Card>
        {customers.length === 0 ? (
          <p className="text-center">Aucun client enregistré</p>
        ) : (
          <div className="customers-table">
            <table>
              <thead>
                <tr>
                  <th>Nom complet</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th>Statut</th>
                  <th>Date de création</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="customer-name">
                      {customer.firstName} {customer.lastName}
                    </td>
                    <td>{customer.email}</td>
                    <td>{formatPhone(customer.phone)}</td>
                    <td>
                      <Badge variant={getStatusVariant(customer.status)}>
                        {CUSTOMER_STATUS_LABELS[customer.status]}
                      </Badge>
                    </td>
                    <td>{formatDate(customer.createdAt)}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="action-btn"
                          onClick={() => navigate(`/customers/${customer.id}`)}
                          title="Voir les détails"
                        >
                          <FiEye />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal de création */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Créer un nouveau client"
      >
        <CustomerForm onSuccess={handleCreateSuccess} onCancel={() => setShowCreateModal(false)} />
      </Modal>
    </div>
  );
};