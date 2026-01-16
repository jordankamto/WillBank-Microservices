import api from './api';

export const dashboardService = {
  getCustomerDashboard: (customerId) => api.get(`/api/dashboard/${customerId}`),
  
  getAccountStatement: (accountId, from, to) => 
    api.get(`/api/dashboard/accounts/${accountId}/statement?from=${from}&to=${to}`),
  
  searchTransactions: (params) => {
    const query = new URLSearchParams();
    if (params.type) query.append('type', params.type);
    if (params.date) query.append('date', params.date);
    return api.get(`/api/dashboard/transactions/search?${query.toString()}`);
  }
};