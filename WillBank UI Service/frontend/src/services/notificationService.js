import api from './api';

export const notificationService = {
  getByCustomerId: (customerId) => api.get(`/api/notifications/customer/${customerId}`)
};