import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiUserCheck, FiUserX, FiPlus } from 'react-icons/fi';
import { customerService } from '../../services/customerService';
import { getStatusBadge } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmModal from '../../components/common/ConfirmModal';
import toast from 'react-hot-toast';

export default function CustomersList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null, customerId: null });
  
  useEffect(() => {
    fetchCustomers();
  }, []);
  
  const fetchCustomers = async () => {
    try {
      const response = await customerService.getAll();
      setCustomers(response.data);
    } catch (error) {
      console.error('Erreur chargement clients:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleActivate = async (id) => {
    try {
      await customerService.activate(id);
      toast.success('Client activé avec succès');
      fetchCustomers();
    } catch (error) {
      console.error('Erreur activation:', error);
    }
  };
  
  const handleSuspend = async (id) => {
    try {
      await customerService.suspend(id);
      toast.success('Client suspendu');
      fetchCustomers();
    } catch (error) {
      console.error('Erreur suspension:', error);
    }
    setConfirmModal({ isOpen: false, action: null, customerId: null });
  };
  
  if (loading) return <LoadingSpinner />;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Liste des Clients</h1>
        <Link to="/customers/new" className="btn-primary flex items-center gap-2">
          <FiPlus /> Nouveau Client
        </Link>
      </div>
      
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="border-b">
            <tr className="text-left">
              <th className="pb-3">Nom</th>
              <th className="pb-3">Email</th>
              <th className="pb-3">Téléphone</th>
              <th className="pb-3">Statut</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => {
              const badge = getStatusBadge(customer.status);
              return (
                <tr key={customer.id} className="table-row border-b">
                  <td className="py-4">
                    {customer.firstName} {customer.lastName}
                  </td>
                  <td className="py-4">{customer.email}</td>
                  <td className="py-4">{customer.phone}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${badge.bg} ${badge.text}`}>
                      {badge.label}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <Link
                        to={`/customers/${customer.id}/dashboard`}
                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Voir Dashboard"
                      >
                        <FiEye />
                      </Link>
                      
                      {customer.status === 'PENDING_KYC' && (
                        <button
                          onClick={() => handleActivate(customer.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Activer KYC"
                        >
                          <FiUserCheck />
                        </button>
                      )}
                      
                      {customer.status === 'ACTIVE' && (
                        <button
                          onClick={() => setConfirmModal({ 
                            isOpen: true, 
                            action: 'suspend', 
                            customerId: customer.id 
                          })}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Suspendre"
                        >
                          <FiUserX />
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
      
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, action: null, customerId: null })}
        onConfirm={() => handleSuspend(confirmModal.customerId)}
        title="Suspendre le client"
        message="Êtes-vous sûr de vouloir suspendre ce client ? Tous ses comptes seront gelés."
        type="danger"
      />
    </div>
  );
}