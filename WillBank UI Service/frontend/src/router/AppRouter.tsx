import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../core/auth/ProtectedRoute';
import { MainLayout } from '../shared/components/Layout/MainLayout';
import { ROUTES } from '../config/constants';

// Pages
import { LoginPage } from '../domain/auth/pages/LoginPage';
import { RegisterPage } from '../domain/auth/pages/RegisterPage';
import { DashboardPage } from '../domain/auth/pages/DashboardPage';
import { CustomersPage } from '../domain/auth/pages/CustomersPage';
//import { CustomerDetailsPage } from '../domain/customer/pages/CustomerDetailsPage';
import { AccountsPage } from '../domain/auth/pages/AccountsPage';
//import { AccountDetailsPage } from '../domain/account/pages/AccountDetailsPage';
import { TransactionsPage } from '../domain/auth/pages/TransactionsPage';

/**
 * Router principal de l'application
 * Gère toutes les routes et la protection des pages
 */

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route publique : Login */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Routes protégées */}
        <Route
          path="/*"
          
          element={
            
            <ProtectedRoute>
              <MainLayout>
                <Routes>
                  <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
                  <Route path={ROUTES.CUSTOMERS} element={<CustomersPage />} />
                  {/* <Route path="/customers/:id" element={<CustomerDetailsPage />} /> */}
                  <Route path={ROUTES.ACCOUNTS} element={<AccountsPage />} />
                  {/* <Route path="/accounts/:id" element={<AccountDetailsPage />} /> */}
                  <Route path={ROUTES.TRANSACTIONS} element={<TransactionsPage />} />
                  
                  {/* Redirection par défaut vers Dashboard */}
                  <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
                  
                  {/* Page 404 */}
                  <Route path="*" element={<div>Page non trouvée</div>} />
                  
                </Routes>
              </MainLayout>
            </ProtectedRoute>
            
          }
        />
      </Routes>
    </BrowserRouter>
  );
};