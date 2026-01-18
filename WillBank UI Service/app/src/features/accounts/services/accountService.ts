import apiClient from '../../../core/api/apiClient';
import API_CONFIG from '../../../config/api.config';

/**
 * Service pour le microservice Account
 * Gestion des comptes bancaires
 */

class AccountService {
  /**
   * Récupère tous les comptes d'un client
   */
  async getAccountsByCustomerId(customerId: string) {
    return apiClient.get(API_CONFIG.ENDPOINTS.ACCOUNTS.BY_CUSTOMER(customerId));
  }

  /**
   * Récupère un compte par ID
   */
  async getAccountById(id: string) {
    return apiClient.get(API_CONFIG.ENDPOINTS.ACCOUNTS.BY_ID(id));
  }

  /**
   * Récupère le relevé de compte sur une période
   */
  async getAccountStatement(accountId: string, from: string, to: string) {
    return apiClient.get(
      API_CONFIG.ENDPOINTS.DASHBOARD.ACCOUNT_STATEMENT(accountId, from, to)
    );
  }
}

export default new AccountService();