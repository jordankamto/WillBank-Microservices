import React, { useState, useEffect, ReactNode } from 'react';
import { AuthContext, AuthContextType } from './AuthContext';
import { UserInfo, LoginRequest } from '../../types/api.types';
import apiClient from '../api/apiClient';
import API_CONFIG from '../../config/api.config';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provider d'authentification
 * Gère l'état d'authentification globale de l'application
 */

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Au chargement, vérifie si un token existe en localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('userInfo');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  /**
   * Connexion de l'utilisateur
   */
  const login = async (email: string, password: string): Promise<void> => {
    try {
      const loginData: LoginRequest = { email, password };
      
      const response = await apiClient.post<{
        token: string;
        refreshToken: string;
        user: UserInfo;
      }>(API_CONFIG.ENDPOINTS.AUTH.LOGIN, loginData);

      // Stockage du token et des infos utilisateur
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('userInfo', JSON.stringify(response.user));

      setToken(response.token);
      setUser(response.user);
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  };

  /**
   * Déconnexion de l'utilisateur
   */
  const logout = (): void => {
    // Nettoyage du localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userInfo');

    setToken(null);
    setUser(null);

    // Optionnel : appel API pour invalider le token côté serveur
    try {
      apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    login,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};