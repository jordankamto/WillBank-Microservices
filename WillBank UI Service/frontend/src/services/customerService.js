import api from './api';

export const customerService = {
  getAll: () => api.get('/api/customers'),
  
  getById: (id) => api.get(`/api/customers/${id}`),
  
  search: (params) => {
    const query = new URLSearchParams();
    if (params.email) query.append('email', params.email);
    if (params.phone) query.append('phone', params.phone);
    return api.get(`/api/customers?${query.toString()}`);
  },
  
  create: (customer) => api.post('/api/customers', customer),
  
  update: (id, customer) => api.put(`/api/customers/${id}`, customer),
  
  activate: (id) => api.put(`/api/customers/${id}/activate`),
  
  suspend: (id) => api.put(`/api/customers/${id}/suspend`),
  
  checkExists: (id) => api.get(`/api/customers/${id}/exists`)
};