/**
 * Configuration de l'API Gateway - Point d'entrée unique
 * Tous les appels passent par l'API Gateway qui route vers les microservices
 */

const API_CONFIG = {
  // URL de base de l'API Gateway (Spring Cloud Gateway)
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  
  // Timeout des requêtes HTTP
  TIMEOUT: 30000,
  
  // Endpoints organisés par domaine métier (aligné avec les microservices)
  ENDPOINTS: {
    // Authentification (géré par API Gateway)
    AUTH: {
      LOGIN: '/api/auth/login',
      LOGOUT: '/api/auth/logout',
      REFRESH: '/api/auth/refresh',
      REGISTER: '/api/auth/register',
      ME: '/api/auth/me'
    },
    
    // Microservice Client (Customer)
    CUSTOMERS: {
      BASE: '/api/customers',
      BY_ID: (id: string) => `/api/customers/${id}`,
      SUSPEND: (id: string) => `/api/customers/${id}/suspend`,
      ACTIVATE: (id: string) => `/api/customers/${id}/activate`,
      SEARCH: '/api/customers'
    },
    
    // Microservice Compte (Account)
    ACCOUNTS: {
      BASE: '/api/accounts',
      BY_ID: (id: string) => `/api/accounts/${id}`,
      BY_CUSTOMER: (customerId: string) => `/api/accounts/customer/${customerId}`,
      FREEZE: (id: string) => `/api/accounts/${id}/freeze`,
      BLOCK: (id: string) => `/api/accounts/${id}/block`,
      CLOSE: (id: string) => `/api/accounts/${id}/close`,
      UPDATE_BALANCE: (id: string) => `/api/accounts/${id}/balance`
    },
    
    // Microservice Transaction
    TRANSACTIONS: {
      BASE: '/api/transactions',
      DEPOSIT: '/api/transactions/deposit',
      WITHDRAW: '/api/transactions/withdraw',
      TRANSFER: '/api/transactions/transfer',
      BY_ACCOUNT: (accountId: string) => `/api/transactions/account/${accountId}`,
      PAGINATED: (accountId: string, page: number = 0, size: number = 10) => 
        `/api/transactions/account/${accountId}?page=${page}&size=${size}`
    },
    
    // Microservice Notification
    NOTIFICATIONS: {
      BASE: '/api/notifications',
      BY_CUSTOMER: (customerId: string) => `/api/notifications/customer/${customerId}`,
      TEST: '/api/notifications/test'
    },
    
    // Microservice Composite (BFF - Backend For Frontend)
    DASHBOARD: {
      BY_CUSTOMER: (customerId: string) => `/api/dashboard/${customerId}`,
      ACCOUNT_STATEMENT: (accountId: string, from: string, to: string) => 
        `/api/accounts/${accountId}/statement?from=${from}&to=${to}`,
      SEARCH_TRANSACTIONS: (type?: string, date?: string) => {
        const params = new URLSearchParams();
        if (type) params.append('type', type);
        if (date) params.append('date', date);
        return `/api/transactions/search?${params.toString()}`;
      }
    }
  },
  
  // Headers par défaut pour toutes les requêtes
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

export default API_CONFIG;