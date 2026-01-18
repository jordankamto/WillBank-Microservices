/**
 * Constantes métier pour l'application mobile
 * Identiques à l'application web pour la cohérence
 */

export enum CustomerStatus {
  PENDING_KYC = 'PENDING_KYC',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  CLOSED = 'CLOSED',
}

export enum AccountType {
  CURRENT = 'CURRENT',
  SAVINGS = 'SAVINGS',
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  FROZEN = 'FROZEN',
  BLOCKED = 'BLOCKED',
  CLOSED = 'CLOSED',
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  TRANSFER = 'TRANSFER',
  PAYMENT = 'PAYMENT',
}

export enum TransactionStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

// Labels en français
export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  [AccountType.CURRENT]: 'Compte Courant',
  [AccountType.SAVINGS]: 'Compte Épargne',
};

export const ACCOUNT_STATUS_LABELS: Record<AccountStatus, string> = {
  [AccountStatus.ACTIVE]: 'Actif',
  [AccountStatus.FROZEN]: 'Gelé',
  [AccountStatus.BLOCKED]: 'Bloqué',
  [AccountStatus.CLOSED]: 'Fermé',
};

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  [TransactionType.DEPOSIT]: 'Dépôt',
  [TransactionType.WITHDRAWAL]: 'Retrait',
  [TransactionType.TRANSFER]: 'Virement',
  [TransactionType.PAYMENT]: 'Paiement',
};

// Règles métier
export const BUSINESS_RULES = {
  MIN_DEPOSIT: 1000,
  MAX_WITHDRAWAL: 500000,
  MAX_TRANSFER: 1000000,
  MIN_TRANSFER: 100,
  PHONE_REGEX: /^(237)?[6][0-9]{8}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

// Messages
export const MESSAGES = {
  SUCCESS: {
    TRANSACTION_SUCCESS: 'Transaction effectuée avec succès',
    DEPOSIT_SUCCESS: 'Dépôt effectué avec succès',
    WITHDRAWAL_SUCCESS: 'Retrait effectué avec succès',
    TRANSFER_SUCCESS: 'Virement effectué avec succès',
  },
  ERROR: {
    NETWORK: 'Erreur de connexion',
    UNAUTHORIZED: 'Session expirée',
    SERVER_ERROR: 'Erreur serveur',
    INSUFFICIENT_BALANCE: 'Solde insuffisant',
  },
};

// Formats
export const DATE_FORMAT = 'dd/MM/yyyy';
export const DATETIME_FORMAT = 'dd/MM/yyyy HH:mm';
export const CURRENCY = 'XAF';
export const LOCALE = 'fr-FR';

// Demo users pour authentification simplifiée
export const DEMO_USERS = [
  {
    email: "client1@willbank.com",
    password: "password123",
    customerId: "uuid-client-1"
  },
  {
    email: "client2@willbank.com",
    password: "password456",
    customerId: "uuid-client-2"
  }
];
