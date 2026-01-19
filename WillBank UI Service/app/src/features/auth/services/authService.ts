import { DEMO_USERS, WILLBANK_SECRET_TOKEN } from '../../../config/constants';

/**
 * Service d'authentification pour l'application mobile
 * Version simplifiée utilisant WILLBANK_SECRET_TOKEN fixe
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

    // Retourne le token fixe avec les infos utilisateur
    const response = {
      token: WILLBANK_SECRET_TOKEN,
      refreshToken: 'fixed_refresh_token', // Non utilisé mais conservé pour compatibilité
      user: {
        id: user.customerId,
        email: user.email,
        customerId: user.customerId,
        role: 'USER',
      },
    };

    return response;
  }

  /**
   * Déconnexion simulée
   */
  async logout() {
    // Simulation d'appel API de déconnexion
    return { success: true };
  }
}

export default new AuthService();
