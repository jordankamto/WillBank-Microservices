import apiClient from '../../../core/api/apiClient';
import API_CONFIG from '../../../config/api.config';
import { Notification } from '../../../types/api.types';

/**
 * Service pour le microservice Notification
 * Encapsule les opérations liées aux notifications
 */

class NotificationService {
  /**
   * Récupère toutes les notifications d'un client
   */
  async getNotificationsByCustomerId(customerId: string): Promise<Notification[]> {
    return apiClient.get<Notification[]>(
      API_CONFIG.ENDPOINTS.NOTIFICATIONS.BY_CUSTOMER(customerId)
    );
  }

  /**
   * Envoie une notification de test (usage interne)
   */
  async sendTestNotification(data: { customerId: string; message: string }): Promise<void> {
    return apiClient.post<void>(API_CONFIG.ENDPOINTS.NOTIFICATIONS.TEST, data);
  }
}

// Export d'une instance singleton
const notificationService = new NotificationService();
export default notificationService;