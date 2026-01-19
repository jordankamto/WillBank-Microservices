import apiClient from '../../../core/api/apiClient';
import API_CONFIG from '../../../config/api.config';
import { DashboardData, Transaction } from '../../../types/api.types';

/**
 * Service pour le microservice Composite (Dashboard)
 * Agrège les données de plusieurs microservices
 */

class DashboardService {
  /**
   * Récupère toutes les données du dashboard d'un client
   */
  async getDashboardData(customerId: string): Promise<DashboardData> {
    return apiClient.get(API_CONFIG.ENDPOINTS.DASHBOARD.BY_CUSTOMER(customerId));
  }

  /**
   * Récupère le relevé de compte sur une période
   */
  async getAccountStatement(accountId: string, from: string, to: string) {
    return apiClient.get(
      API_CONFIG.ENDPOINTS.DASHBOARD.ACCOUNT_STATEMENT(accountId, from, to)
    );
  }

  /**
   * Recherche des transactions depuis le dashboard
   */
  async searchTransactions(type?: string, date?: string): Promise<Transaction[]> {
    return apiClient.get(API_CONFIG.ENDPOINTS.DASHBOARD.TRANSACTIONS_SEARCH(type, date));
  }
}

export default new DashboardService();
