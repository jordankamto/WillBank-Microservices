/**
 * Constantes métier de l'application WillBank
 * Alignées avec le Domain-Driven Design et les Value Objects
 */

// === CUSTOMER DOMAIN ===
export enum CustomerStatus {
  PENDING_KYC = 'PENDING_KYC',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  CLOSED = 'CLOSED'
}

export const CUSTOMER_STATUS_LABELS: Record<CustomerStatus, string> = {
  [CustomerStatus.PENDING_KYC]: 'En attente KYC',
  [CustomerStatus.ACTIVE]: 'Actif',
  [CustomerStatus.SUSPENDED]: 'Suspendu',
  [CustomerStatus.CLOSED]: 'Fermé'
};

export const CUSTOMER_STATUS_COLORS: Record<CustomerStatus, string> = {
  [CustomerStatus.PENDING_KYC]: '#FFA500',
  [CustomerStatus.ACTIVE]: '#28A745',
  [CustomerStatus.SUSPENDED]: '#DC3545',
  [CustomerStatus.CLOSED]: '#6C757D'
};

// === ACCOUNT DOMAIN ===
export enum AccountType {
  CURRENT = 'CURRENT',
  SAVINGS = 'SAVINGS'
}

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  [AccountType.CURRENT]: 'Compte Courant',
  [AccountType.SAVINGS]: 'Compte Épargne'
};

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  FROZEN = 'FROZEN',
  BLOCKED = 'BLOCKED',
  CLOSED = 'CLOSED'
}

export const ACCOUNT_STATUS_LABELS: Record<AccountStatus, string> = {
  [AccountStatus.ACTIVE]: 'Actif',
  [AccountStatus.FROZEN]: 'Gelé',
  [AccountStatus.BLOCKED]: 'Bloqué',
  [AccountStatus.CLOSED]: 'Fermé'
};

export const ACCOUNT_STATUS_COLORS: Record<AccountStatus, string> = {
  [AccountStatus.ACTIVE]: '#28A745',
  [AccountStatus.FROZEN]: '#17A2B8',
  [AccountStatus.BLOCKED]: '#FFC107',
  [AccountStatus.CLOSED]: '#6C757D'
};

// === TRANSACTION DOMAIN ===
export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  TRANSFER = 'TRANSFER',
  PAYMENT = 'PAYMENT'
}

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  [TransactionType.DEPOSIT]: 'Dépôt',
  [TransactionType.WITHDRAWAL]: 'Retrait',
  [TransactionType.TRANSFER]: 'Virement',
  [TransactionType.PAYMENT]: 'Paiement Marchand'
};

export const TRANSACTION_TYPE_ICONS: Record<TransactionType, string> = {
  [TransactionType.DEPOSIT]: '💰',
  [TransactionType.WITHDRAWAL]: '💸',
  [TransactionType.TRANSFER]: '🔄',
  [TransactionType.PAYMENT]: '🛒'
};

export enum TransactionStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED'
}

export const TRANSACTION_STATUS_LABELS: Record<TransactionStatus, string> = {
  [TransactionStatus.SUCCESS]: 'Réussie',
  [TransactionStatus.FAILED]: 'Échouée'
};

export const TRANSACTION_STATUS_COLORS: Record<TransactionStatus, string> = {
  [TransactionStatus.SUCCESS]: '#28A745',
  [TransactionStatus.FAILED]: '#DC3545'
};

// === NOTIFICATION DOMAIN ===
export enum NotificationChannel {
  EMAIL = 'EMAIL',
  PUSH = 'PUSH'
}

export enum NotificationStatus {
  SENT = 'SENT',
  FAILED = 'FAILED'
}

// === BUSINESS RULES (Règles métier) ===
export const BUSINESS_RULES = {
  // Limites de transaction (en XAF - Franc CFA)
  MIN_DEPOSIT: 1000,
  MAX_WITHDRAWAL: 500000,
  MAX_TRANSFER: 1000000,
  MIN_TRANSFER: 100,
  
  // Règles de compte
  ACCOUNT_PER_CUSTOMER: {
    [AccountType.CURRENT]: 1,  // 1 seul compte courant par client
    [AccountType.SAVINGS]: 5   // Maximum 5 comptes épargne
  },
  
  // Historique
  TRANSACTION_HISTORY_DAYS: 90,
  MAX_STATEMENT_DAYS: 365,
  
  // Validation
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  PHONE_REGEX: /^(237)?[6][0-9]{8}$/,  // Format Cameroun
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
};

// === MESSAGES UTILISATEUR ===
export const MESSAGES = {
  SUCCESS: {
    CUSTOMER_CREATED: 'Client créé avec succès',
    CUSTOMER_UPDATED: 'Informations du client mises à jour',
    CUSTOMER_SUSPENDED: 'Client suspendu',
    CUSTOMER_ACTIVATED: 'Client activé',
    
    ACCOUNT_CREATED: 'Compte créé avec succès',
    ACCOUNT_FROZEN: 'Compte gelé',
    ACCOUNT_BLOCKED: 'Compte bloqué',
    ACCOUNT_CLOSED: 'Compte fermé',
    
    TRANSACTION_SUCCESS: 'Transaction effectuée avec succès',
    DEPOSIT_SUCCESS: 'Dépôt effectué avec succès',
    WITHDRAWAL_SUCCESS: 'Retrait effectué avec succès',
    TRANSFER_SUCCESS: 'Virement effectué avec succès'
  },
  
  ERROR: {
    NETWORK: 'Erreur de connexion au serveur',
    UNAUTHORIZED: 'Session expirée, veuillez vous reconnecter',
    FORBIDDEN: 'Accès non autorisé',
    NOT_FOUND: 'Ressource introuvable',
    SERVER_ERROR: 'Erreur serveur, veuillez réessayer',
    VALIDATION: 'Veuillez vérifier les informations saisies',
    
    INSUFFICIENT_BALANCE: 'Solde insuffisant',
    ACCOUNT_BLOCKED: 'Compte bloqué, opération impossible',
    TRANSACTION_FAILED: 'Transaction échouée'
  },
  
  CONFIRM: {
    DELETE_CUSTOMER: 'Êtes-vous sûr de vouloir fermer ce client ?',
    SUSPEND_CUSTOMER: 'Confirmer la suspension du client ?',
    CLOSE_ACCOUNT: 'Êtes-vous sûr de vouloir fermer ce compte ?',
    LARGE_TRANSFER: 'Montant important, confirmer le virement ?'
  }
};

// === PAGINATION ===
export const PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_SIZE: 10,
  SIZE_OPTIONS: [10, 20, 50, 100]
};

// === FORMATS ===
export const DATE_FORMAT = 'dd/MM/yyyy';
export const DATETIME_FORMAT = 'dd/MM/yyyy HH:mm:ss';
export const TIME_FORMAT = 'HH:mm';
export const CURRENCY = 'XAF';
export const LOCALE = 'fr-FR';

// === ROUTES ===
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  CUSTOMERS: '/customers',
  CUSTOMER_DETAILS: '/customers/:id',
  ACCOUNTS: '/accounts',
  ACCOUNT_DETAILS: '/accounts/:id',
  TRANSACTIONS: '/transactions',
  NOTIFICATIONS: '/notifications',
  PROFILE: '/profile',
  SETTINGS: '/settings'
};