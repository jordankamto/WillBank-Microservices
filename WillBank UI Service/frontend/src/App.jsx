import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import CustomersList from './pages/customers/CustomersList';
import CustomerSearch from './pages/customers/CustomerSearch';
import CustomerDashboard from './pages/customers/CustomerDashboard';
import CustomerCreate from './pages/customers/CustomerCreate';
import AccountsList from './pages/accounts/AccountsList';
import AccountDetail from './pages/accounts/AccountDetail';
import TransactionsList from './pages/transactions/TransactionsList';
import TransactionCreate from './pages/transactions/TransactionCreate';
import Login from './pages/auth/Login';
import './App.css';

function App() {
  // const { isAuthenticated } = useAuth();

  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="customers" element={<CustomersList />} />
        <Route path="customers/search" element={<CustomerSearch />} />
        <Route path="customers/new" element={<CustomerCreate />} />
        <Route path="customers/:id/dashboard" element={<CustomerDashboard />} />
        <Route path="accounts" element={<AccountsList />} />
        <Route path="accounts/:id" element={<AccountDetail />} />
        <Route path="transactions" element={<TransactionsList />} />
        <Route path="transactions/new" element={<TransactionCreate />} />
      </Route>
    </Routes>
  );
}

export default App;
