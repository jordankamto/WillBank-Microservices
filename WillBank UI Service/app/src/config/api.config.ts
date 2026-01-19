/**
 * Configuration API pour l'application mobile
 * Pointe vers l'API Gateway du backend sur localhost:8080
 */

const API_CONFIG = {
  // URL de l'API Gateway - Remplacer YOUR_LOCAL_IP par votre adresse IP réseau
  // Exemple: 'http://192.168.1.100:8080'
  BASE_URL: __DEV__
    ? 'http://192.168.1.112:8080' // ← REMPLACEZ PAR VOTRE IP RÉSEAU (trouvée avec node find-ip.js)
    : 'http://10.0.2.2:8080', // Android Emulator

  TIMEOUT: 30000,

  // Endpoints basés sur l'analyse des contrôleurs backend
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
      EXISTS: (id: string) => `/api/customers/${id}/exists`,
      SEARCH: (email?: string, phone?: string) => {
        const params = new URLSearchParams();
        if (email) params.append('email', email);
        if (phone) params.append('phone', phone);
        return `/api/customers${params.toString() ? '?' + params.toString() : ''}`;
      },
      SUSPEND: (id: string) => `/api/customers/${id}/suspend`,
      ACTIVATE: (id: string) => `/api/customers/${id}/activate`,
    },

    ACCOUNTS: {
      BASE: '/api/accounts',
      BY_ID: (id: string) => `/api/accounts/${id}`,
      BY_CUSTOMER: (customerId: string) => `/api/accounts/customer/${customerId}`,
      FREEZE: (id: string) => `/api/accounts/${id}/freeze`,
      BLOCK: (id: string) => `/api/accounts/${id}/block`,
      CLOSE: (id: string) => `/api/accounts/${id}/close`,
    },

    TRANSACTIONS: {
      BASE: '/api/transactions',
      DEPOSIT: '/api/transactions/deposit',
      WITHDRAW: '/api/transactions/withdraw',
      TRANSFER: '/api/transactions/transfer',
      BY_ACCOUNT: (accountId: string) => `/api/transactions/account/${accountId}`,
      PAGINATED: (accountId: string, page: number = 0, size: number = 20) =>
        `/api/transactions/account/${accountId}?page=${page}&size=${size}`,
      SEARCH: (type?: string, date?: string) => {
        const params = new URLSearchParams();
        if (type) params.append('type', type);
        if (date) params.append('date', date);
        return `/api/transactions/search${params.toString() ? '?' + params.toString() : ''}`;
      },
    },

    NOTIFICATIONS: {
      BY_CUSTOMER: (customerId: string) => `/api/notifications/customer/${customerId}`,
    },

    DASHBOARD: {
      BY_CUSTOMER: (customerId: string) => `/api/dashboard/${customerId}`,
      ACCOUNT_STATEMENT: (accountId: string, from: string, to: string) =>
        `/api/dashboard/accounts/${accountId}/statement?from=${from}&to=${to}`,
      TRANSACTIONS_SEARCH: (type?: string, date?: string) => {
        const params = new URLSearchParams();
        if (type) params.append('type', type);
        if (date) params.append('date', date);
        return `/api/dashboard/transactions/search${params.toString() ? '?' + params.toString() : ''}`;
      },
    },
  },

  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

export default API_CONFIG;
