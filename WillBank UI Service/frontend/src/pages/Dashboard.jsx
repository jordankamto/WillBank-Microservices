import { useEffect, useState } from 'react';
import { FiUsers, FiCreditCard, FiActivity, FiAlertCircle } from 'react-icons/fi';
import StatCard from '../components/dashboard/StatCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { customerService } from '../services/customerService';
import { accountService } from '../services/accountService';
import { dashboardService } from '../services/dashboardService';

export default function Dashboard() {
  const [stats, setStats] = useState({ customers: 0, accounts: 0, transactions: 0 });
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);
  
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = async () => {
    try {
      const [customersRes, accountsRes] = await Promise.all([
        customerService.getAll(),
        accountService.getAll()
      ]);
      
      const customers = customersRes.data;
      const accounts = accountsRes.data;
      
      setStats({
        customers: customers.length,
        accounts: accounts.length,
        transactions: 0 // À calculer si besoin
      });
      
      // Alertes
      const pendingKYC = customers.filter(c => c.status === 'PENDING_KYC');
      const suspended = customers.filter(c => c.status === 'SUSPENDED');
      
      setAlerts([
        ...pendingKYC.map(c => ({ type: 'warning', message: `KYC en attente: ${c.firstName} ${c.lastName}` })),
        ...suspended.map(c => ({ type: 'danger', message: `Client suspendu: ${c.firstName} ${c.lastName}` }))
      ]);
      
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <LoadingSpinner />;
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard CRM</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={FiUsers} 
          label="Total Clients" 
          value={stats.customers} 
          color="primary" 
        />
        <StatCard 
          icon={FiCreditCard} 
          label="Total Comptes" 
          value={stats.accounts} 
          color="success" 
        />
        <StatCard 
          icon={FiActivity} 
          label="Transactions du jour" 
          value={stats.transactions} 
          color="warning" 
        />
      </div>
      
      {alerts.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FiAlertCircle className="text-yellow-500" />
            Alertes ({alerts.length})
          </h3>
          <div className="space-y-2">
            {alerts.map((alert, idx) => (
              <div key={idx} className={`p-3 rounded-lg ${
                alert.type === 'danger' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'
              }`}>
                {alert.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}