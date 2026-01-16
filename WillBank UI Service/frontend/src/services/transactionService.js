import api from './api';

export const transactionService = {
  deposit: (data) => api.post('/api/transactions/deposit', data),
  
  withdraw: (data) => api.post('/api/transactions/withdraw', data),
  
  transfer: (data) => api.post('/api/transactions/transfer', data),
  
  getByAccount: (accountId, page = 0, size = 20) => 
    api.get(`/api/transactions/account/${accountId}?page=${page}&size=${size}`),
  
  search: (params) => {
    const query = new URLSearchParams();
    if (params.type) query.append('type', params.type);
    if (params.date) query.append('date', params.date);
    return api.get(`/api/transactions/search?${query.toString()}`);
  }
};