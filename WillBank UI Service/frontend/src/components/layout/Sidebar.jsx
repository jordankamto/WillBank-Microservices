import { NavLink } from 'react-router-dom';
import { 
  FiHome, FiUsers, FiCreditCard, FiActivity, 
  FiSearch, FiPlusCircle, FiBell 
} from 'react-icons/fi';

const menuItems = [
  { to: '/', icon: FiHome, label: 'Dashboard' },
  { to: '/customers', icon: FiUsers, label: 'Clients' },
  { to: '/customers/search', icon: FiSearch, label: 'Recherche Client' },
  { to: '/accounts', icon: FiCreditCard, label: 'Comptes' },
  { to: '/transactions', icon: FiActivity, label: 'Transactions' },
  { to: '/transactions/new', icon: FiPlusCircle, label: 'Nouvelle Transaction' }
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}