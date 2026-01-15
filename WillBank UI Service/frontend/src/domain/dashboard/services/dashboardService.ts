import apiClient from '../../../core/api/apiClient';
import API_CONFIG from '../../../config/api.config';
import { DashboardData } from '../../../types/api.types';

/**
 * Service pour le microservice Composite (Dashboard)
 * Agrège les données de plusieurs microservices
 */

class DashboardService {
  /**
   * Récupère toutes les données du dashboard d'un client
   * Agrège : informations client + comptes + transactions récentes
   */
  async getDashboardData(customerId: string): Promise<DashboardData> {
    return apiClient.get<DashboardData>(
      API_CONFIG.ENDPOINTS.DASHBOARD.BY_CUSTOMER(customerId)
    );
  }
}

// Export d'une instance singleton
const dashboardService = new DashboardService();
export default dashboardService;