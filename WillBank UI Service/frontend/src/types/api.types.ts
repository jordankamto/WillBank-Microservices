/**
 * Types TypeScript pour les réponses API
 * Alignés avec les DTOs des microservices backend
 */

import { CustomerStatus, AccountType, AccountStatus, TransactionType, TransactionStatus, NotificationChannel, NotificationStatus } from '../config/constants';

// === TYPES COMMUNS ===
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
  timestamp?: string;
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
  role: 'ADMIN' | 'CLIENT';
}

// === CUSTOMER DOMAIN ===
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

export interface CreateCustomerRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

export interface UpdateCustomerRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
}

// === ACCOUNT DOMAIN ===
export interface Account {
  id: string;
  customerId: string;
  type: AccountType;
  balance: number;
  status: AccountStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountRequest {
  customerId: string;
  type: AccountType;
}

export interface UpdateBalanceRequest {
  amount: number;
}

// === TRANSACTION DOMAIN ===
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

// === NOTIFICATION DOMAIN ===
export interface Notification {
  id: string;
  customerId: string;
  channel: NotificationChannel;
  title: string;
  message: string;
  status: NotificationStatus;
  createdAt: string;
}

// === DASHBOARD/COMPOSITE DOMAIN ===
export interface DashboardData {
  customer: Customer;
  accounts: AccountWithBalance[];
  recentTransactions: Transaction[];
  totalBalance: number;
  accountsCount: number;
}

export interface AccountWithBalance extends Account {
  lastTransactionDate?: string;
  transactionCount?: number;
}

export interface AccountStatement {
  account: Account;
  transactions: Transaction[];
  openingBalance: number;
  closingBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  period: {
    from: string;
    to: string;
  };
}

export interface TransactionSearchParams {
  type?: TransactionType;
  date?: string;
  accountId?: string;
  minAmount?: number;
  maxAmount?: number;
}