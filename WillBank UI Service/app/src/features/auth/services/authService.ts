import { DEMO_USERS } from '../../../config/constants';
import API_CONFIG from '../../../config/api.config';
import apiClient from '../../../core/api/apiClient';

/**
 * Service d'authentification pour l'application mobile
 * Authentification simplifiée contre DEMO_USERS
 */

class AuthService {
  /**
   * Authentification simplifiée contre les utilisateurs demo
   */
  async login(email: string, password: string) {
    // Validation contre DEMO_USERS
    const user = DEMO_USERS.find(
      (demoUser) => demoUser.email === email && demoUser.password === password
    );

    if (!user) {
      throw new Error('Identifiants invalides');
    }

    // Simulation d'appel API pour récupérer le token
    // En production, ceci serait un vrai appel API
    const mockResponse = {
      token: 'Bearer WILLBANK_SECRET_TOKEN',
      refreshToken: 'mock_refresh_token',
      user: {
        id: user.customerId,
        email: user.email,
        customerId: user.customerId,
        role: 'CUSTOMER',
      },
    };

    return mockResponse;
  }

  /**
   * Déconnexion
   */
  async logout() {
    // Simulation d'appel API de déconnexion
    return { success: true };
  }
}

export default new AuthService();
