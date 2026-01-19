import React, { useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext, AuthContextType, UserInfo } from './AuthContext';
import { WILLBANK_SECRET_TOKEN, DEMO_USERS } from '../../config/constants';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provider d'authentification pour React Native
 * Version simplifiée utilisant WILLBANK_SECRET_TOKEN fixe
 */

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Au chargement, charge l'utilisateur par défaut
  useEffect(() => {
    loadDefaultUser();
  }, []);

  const loadDefaultUser = async () => {
    try {
      // Utilise le premier utilisateur demo par défaut
      const defaultUser = DEMO_USERS[0];
      const userInfo: UserInfo = {
        id: defaultUser.customerId,
        email: defaultUser.email,
        customerId: defaultUser.customerId,
        role: 'USER',
      };

      setToken(WILLBANK_SECRET_TOKEN);
      setUser(userInfo);

      // Stockage en AsyncStorage pour la persistance
      await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
    } catch (error) {
      console.error('Erreur lors du chargement de l\'utilisateur:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Connexion simulée - utilise les utilisateurs demo
   */
  const login = async (email: string, password: string): Promise<void> => {
    try {
      const demoUser = DEMO_USERS.find(user => user.email === email && user.password === password);

      if (!demoUser) {
        throw new Error('Identifiants invalides');
      }

      const userInfo: UserInfo = {
        id: demoUser.customerId,
        email: demoUser.email,
        customerId: demoUser.customerId,
        role: 'USER',
      };

      setToken(WILLBANK_SECRET_TOKEN);
      setUser(userInfo);

      // Stockage en AsyncStorage
      await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  };

  /**
   * Déconnexion simulée
   */
  const logout = async (): Promise<void> => {
    try {
      // Nettoyage du stockage local
      await AsyncStorage.removeItem('userInfo');
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const value: AuthContextType = {
    user,
    token: WILLBANK_SECRET_TOKEN, // Toujours utiliser le token fixe
    isAuthenticated: !!user, // Authentifié si un utilisateur est défini
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
