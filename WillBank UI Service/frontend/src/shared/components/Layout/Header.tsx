import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../core/auth/AuthContext';
import { FiMenu, FiBell, FiUser, FiLogOut } from 'react-icons/fi';
import { ROUTES } from '../../../config/constants';
import './Header.css';

interface HeaderProps {
  onToggleSidebar: () => void;
}

/**
 * Header de l'application
 */

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="header-menu-btn" onClick={onToggleSidebar} aria-label="Toggle menu">
          <FiMenu size={24} />
        </button>
        
        <h1 className="header-logo">WillBank</h1>
      </div>

      <div className="header-right">
        <button className="header-icon-btn" aria-label="Notifications">
          <FiBell size={20} />
          <span className="header-badge">3</span>
        </button>

        <div className="header-user-menu">
          <button
            className="header-user-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <FiUser size={20} />
            <span className="header-user-name">{user?.email}</span>
          </button>

          {showUserMenu && (
            <div className="header-dropdown">
              <button className="header-dropdown-item" onClick={() => navigate(ROUTES.PROFILE)}>
                <FiUser size={16} />
                <span>Mon profil</span>
              </button>
              <button className="header-dropdown-item" onClick={handleLogout}>
                <FiLogOut size={16} />
                <span>Déconnexion</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};