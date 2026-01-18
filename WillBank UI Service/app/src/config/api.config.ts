/**
 * Configuration API pour l'application mobile
 * Pointe vers l'API Gateway du backend
 */

const API_CONFIG = {
  // URL de l'API Gateway (à adapter selon l'environnement)
  BASE_URL: __DEV__ 
    ? 'http://10.0.2.2:8080' // Android Emulator
    : 'https://api.willbank.com',
  
  TIMEOUT: 30000,
  
  // Endpoints identiques à l'application web
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      LOGOUT: '/api/auth/logout',
      REFRESH: '/api/auth/refresh',
      REGISTER: '/api/auth/register',
      ME: '/api/auth/me',
    },
    
    CUSTOMERS: {
      BASE: '/api/customers',
      BY_ID: (id: string) => `/api/customers/${id}`,
    },
    
    ACCOUNTS: {
      BASE: '/api/accounts',
      BY_ID: (id: string) => `/api/accounts/${id}`,
      BY_CUSTOMER: (customerId: string) => `/api/accounts/customer/${customerId}`,
    },
    
    TRANSACTIONS: {
      BASE: '/api/transactions',
      DEPOSIT: '/api/transactions/deposit',
      WITHDRAW: '/api/transactions/withdraw',
      TRANSFER: '/api/transactions/transfer',
      BY_ACCOUNT: (accountId: string) => `/api/transactions/account/${accountId}`,
      PAGINATED: (accountId: string, page: number = 0, size: number = 10) => 
        `/api/transactions/account/${accountId}?page=${page}&size=${size}`,
    },
    
    NOTIFICATIONS: {
      BY_CUSTOMER: (customerId: string) => `/api/notifications/customer/${customerId}`,
    },
    
    DASHBOARD: {
      BY_CUSTOMER: (customerId: string) => `/api/dashboard/${customerId}`,
      ACCOUNT_STATEMENT: (accountId: string, from: string, to: string) => 
        `/api/accounts/${accountId}/statement?from=${from}&to=${to}`,
    },
  },
  
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

export default API_CONFIG;