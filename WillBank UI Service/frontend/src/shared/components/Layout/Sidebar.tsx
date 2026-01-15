import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiUsers, 
  FiCreditCard, 
  FiTrendingUp, 
  FiBell 
} from 'react-icons/fi';
import { ROUTES } from '../../../config/constants';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
}

interface MenuItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: <FiHome size={20} /> },
  { path: ROUTES.CUSTOMERS, label: 'Clients', icon: <FiUsers size={20} /> },
  { path: ROUTES.ACCOUNTS, label: 'Comptes', icon: <FiCreditCard size={20} /> },
  { path: ROUTES.TRANSACTIONS, label: 'Transactions', icon: <FiTrendingUp size={20} /> },
  { path: ROUTES.NOTIFICATIONS, label: 'Notifications', icon: <FiBell size={20} /> }
];

/**
 * Sidebar de navigation
 */

export const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            {isOpen && <span className="sidebar-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};