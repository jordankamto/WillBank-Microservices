/**
 * Types TypeScript pour les réponses API Mobile
 * Identiques à l'application web pour la cohérence
 */

import { CustomerStatus, AccountType, AccountStatus, TransactionType, TransactionStatus } from '../config/constants';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// === AUTHENTICATION ===
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: UserInfo;
}

export interface UserInfo {
  id: string;
  email: string;
  customerId?: string;
  role: string;
}

// === CUSTOMER ===
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  status: CustomerStatus;
  createdAt: string;
  updatedAt: string;
}

// === ACCOUNT ===
export interface Account {
  id: string;
  customerId: string;
  type: AccountType;
  balance: number;
  status: AccountStatus;
  createdAt: string;
  updatedAt: string;
}

// === TRANSACTION ===
export interface Transaction {
  id: string;
  accountId: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  description?: string;
  createdAt: string;
}

export interface DepositRequest {
  accountId: string;
  amount: number;
  description?: string;
}

export interface WithdrawalRequest {
  accountId: string;
  amount: number;
  description?: string;
}

export interface TransferRequest {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description?: string;
}

// === NOTIFICATION ===
export interface Notification {
  id: string;
  customerId: string;
  channel: string;
  title: string;
  message: string;
  status: string;
  createdAt: string;
}

// === DASHBOARD ===
export interface DashboardData {
  customer: Customer;
  accounts: Account[];
  recentTransactions: Transaction[];
  totalBalance: number;
  accountsCount: number;
}