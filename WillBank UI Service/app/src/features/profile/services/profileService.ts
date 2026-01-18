import apiClient from '../../../core/api/apiClient';
import API_CONFIG from '../../../config/api.config';

/**
 * Service pour le microservice Customer (Profil)
 */

class ProfileService {
  /**
   * Récupère les informations du client
   */
  async getCustomerProfile(customerId: string) {
    return apiClient.get(API_CONFIG.ENDPOINTS.CUSTOMERS.BY_ID(customerId));
  }

  /**
   * Met à jour les informations du client
   */
  async updateCustomerProfile(customerId: string, data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
  }) {
    return apiClient.put(API_CONFIG.ENDPOINTS.CUSTOMERS.BY_ID(customerId), data);
  }
}

export default new ProfileService();
