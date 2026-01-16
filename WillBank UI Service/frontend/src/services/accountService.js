import api from './api';

export const accountService = {
  getAll: () => api.get('/api/accounts'),
  
  getById: (id) => api.get(`/api/accounts/${id}`),
  
  getByCustomerId: (customerId) => api.get(`/api/accounts/customer/${customerId}`),
  
  create: (account) => api.post('/api/accounts', account),
  
  freeze: (id) => api.put(`/api/accounts/${id}/freeze`),
  
  block: (id) => api.put(`/api/accounts/${id}/block`),
  
  close: (id) => api.put(`/api/accounts/${id}/close`)
};