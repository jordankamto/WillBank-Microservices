import { useAuth } from '../../hooks/useAuth';
import { FiLogOut, FiUser } from 'react-icons/fi';

export default function Header() {
  const { user, logout } = useAuth();
  
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-600">🏦 WillBank CRM</h1>
          <p className="text-sm text-gray-500">Plateforme de gestion bancaire</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-medium">{user?.firstName} {user?.lastName}</p>
            <p className="text-sm text-gray-500">{user?.role}</p>
          </div>
          <button
            onClick={logout}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Déconnexion"
          >
            <FiLogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}