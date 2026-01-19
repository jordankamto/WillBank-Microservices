import { useApi } from '../../../core/hooks/useApi';
import notificationService from '../services/notificationService';
import { Notification } from '../../../types/api.types';

/**
 * Hook pour gérer les notifications
 */

export function useNotifications(customerId: string) {
  const {
    data: notifications,
    loading,
    error,
    execute: fetchNotifications,
  } = useApi<Notification[]>(
    () => notificationService.getNotificationsByCustomerId(customerId),
    []
  );

  return {
    notifications,
    loading,
    error,
    fetchNotifications,
  };
}
