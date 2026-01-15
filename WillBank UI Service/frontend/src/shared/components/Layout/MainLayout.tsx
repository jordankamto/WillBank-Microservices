import React, { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import './MainLayout.css';

interface MainLayoutProps {
  children: ReactNode;
}

/**
 * Layout principal de l'application
 * Contient Header, Sidebar, contenu principal et Footer
 */

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="main-layout">
      <Header onToggleSidebar={toggleSidebar} />
      
      <div className="main-layout-container">
        <Sidebar isOpen={sidebarOpen} />
        
        <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <div className="content-wrapper">{children}</div>
          <Footer />
        </main>
      </div>
    </div>
  );
};