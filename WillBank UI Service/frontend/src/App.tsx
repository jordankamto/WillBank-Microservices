import React from 'react';
import { AuthProvider } from './core/auth/AuthProvider';
import { AppRouter } from './router/AppRouter';
import './shared/styles/global.css';

/**
 * Composant racine de l'application WillBank
 */

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;