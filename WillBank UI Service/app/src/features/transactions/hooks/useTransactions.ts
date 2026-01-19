import { useApi, useApiMutation } from '../../../core/hooks/useApi';
import transactionService from '../services/transactionService';
import { Transaction } from '../../../types/api.types';
import { TransactionType } from '../../../config/constants';

/**
 * Hook pour gérer les transactions
 */

interface DepositData {
  accountId: string;
  amount: number;
  description?: string;
}

interface WithdrawalData {
  accountId: string;
  amount: number;
  description?: string;
}

interface TransferData {
  sourceAccountId: string;
  targetAccountId: string;
  amount: number;
  description?: string;
}

export function useTransactions(accountId?: string) {
  const {
    data: transactions,
    loading,
    error,
    execute: fetchTransactions,
  } = useApi<Transaction[]>(
    accountId
      ? () => transactionService.getTransactionsByAccountId(accountId)
      : () => Promise.resolve([]),
    []
  );

  const {
    loading: depositing,
    error: depositError,
    success: depositSuccess,
    mutate: deposit,
    reset: resetDeposit,
  } = useApiMutation<Transaction, DepositData>(transactionService.deposit.bind(transactionService));

  const {
    loading: withdrawing,
    error: withdrawalError,
    success: withdrawalSuccess,
    mutate: withdraw,
    reset: resetWithdrawal,
  } = useApiMutation<Transaction, WithdrawalData>(transactionService.withdraw.bind(transactionService));

  const {
    loading: transferring,
    error: transferError,
    success: transferSuccess,
    mutate: transfer,
    reset: resetTransfer,
  } = useApiMutation<Transaction, TransferData>(transactionService.transfer.bind(transactionService));

  return {
    // Data
    transactions,

    // States
    loading,
    error,
    depositing,
    depositError,
    depositSuccess,
    withdrawing,
    withdrawalError,
    withdrawalSuccess,
    transferring,
    transferError,
    transferSuccess,

    // Actions
    fetchTransactions,
    deposit,
    withdraw,
    transfer,

    // Reset functions
    resetDeposit,
    resetWithdrawal,
    resetTransfer,
  };
}

export function useTransactionSearch() {
  const {
    data: searchResults,
    loading: searching,
    error: searchError,
    execute: searchTransactions,
  } = useApi<Transaction[]>(
    (type?: TransactionType, date?: string) =>
      transactionService.searchTransactions(type, date),
    []
  );

  return {
    searchResults,
    searching,
    searchError,
    searchTransactions,
  };
}

export function useTransactionsPaginated(accountId: string) {
  const {
    data: transactions,
    loading,
    error,
    execute: fetchTransactions,
  } = useApi<Transaction[]>(
    (page: number = 0, size: number = 20) =>
      transactionService.getTransactionsPaginated(accountId, page, size),
    []
  );

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
  };
}
