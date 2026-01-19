import apiClient from '../../../core/api/apiClient';
import API_CONFIG from '../../../config/api.config';
import { Notification } from '../../../types/api.types';

/**
 * Service pour le microservice Notification
 */

class NotificationService {
  /**
   * Récupère toutes les notifications d'un client
   */
  async getNotificationsByCustomerId(customerId: string): Promise<Notification[]> {
    return apiClient.get(API_CONFIG.ENDPOINTS.NOTIFICATIONS.BY_CUSTOMER(customerId));
  }
}

export default new NotificationService();
