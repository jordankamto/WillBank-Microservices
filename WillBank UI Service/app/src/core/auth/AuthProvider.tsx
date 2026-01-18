import React, { useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext, AuthContextType, UserInfo } from './AuthContext';
import authService from '../../features/auth/services/authService';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provider d'authentification pour React Native
 * Gère l'état d'authentification global avec AsyncStorage
 */

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Au chargement, vérifie si un token existe en AsyncStorage
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      const storedUser = await AsyncStorage.getItem('userInfo');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'authentification:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Connexion de l'utilisateur
   */
  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await authService.login(email, password);

      // Stockage du token et des infos utilisateur
      await AsyncStorage.setItem('authToken', response.token);
      await AsyncStorage.setItem('refreshToken', response.refreshToken);
      await AsyncStorage.setItem('userInfo', JSON.stringify(response.user));

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
  const logout = async (): Promise<void> => {
    try {
      // Appel API pour invalider le token côté serveur
      await authService.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // Nettoyage du stockage local
      await AsyncStorage.multiRemove(['authToken', 'refreshToken', 'userInfo']);
      setToken(null);
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
