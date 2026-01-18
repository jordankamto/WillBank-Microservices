import apiClient from '../../../core/api/apiClient';
import API_CONFIG from '../../../config/api.config';

/**
 * Service pour le microservice Composite (Dashboard)
 * Agrège les données de plusieurs microservices
 */

class DashboardService {
  /**
   * Récupère toutes les données du dashboard d'un client
   */
  async getDashboardData(customerId: string) {
    return apiClient.get(API_CONFIG.ENDPOINTS.DASHBOARD.BY_CUSTOMER(customerId));
  }
}

export default new DashboardService();