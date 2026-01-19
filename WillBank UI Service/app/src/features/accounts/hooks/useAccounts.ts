import { useApi, useApiMutation } from '../../../core/hooks/useApi';
import accountService from '../services/accountService';
import { Account } from '../../../types/api.types';

/**
 * Hook pour gérer les comptes bancaires
 */

export function useAccounts(customerId?: string) {
  const {
    data: accounts,
    loading,
    error,
    execute: fetchAccounts,
  } = useApi<Account[]>(
    customerId
      ? () => accountService.getAccountsByCustomerId(customerId)
      : () => accountService.getAllAccounts(),
    []
  );

  const {
    loading: creatingAccount,
    error: createError,
    success: accountCreated,
    mutate: createAccount,
    reset: resetCreate,
  } = useApiMutation<Account, { customerId: string; type: 'CURRENT' | 'SAVINGS' }>(
    accountService.createAccount.bind(accountService)
  );

  const {
    loading: freezingAccount,
    error: freezeError,
    success: accountFrozen,
    mutate: freezeAccount,
    reset: resetFreeze,
  } = useApiMutation<any, string>(accountService.freezeAccount.bind(accountService));

  const {
    loading: blockingAccount,
    error: blockError,
    success: accountBlocked,
    mutate: blockAccount,
    reset: resetBlock,
  } = useApiMutation<any, string>(accountService.blockAccount.bind(accountService));

  const {
    loading: closingAccount,
    error: closeError,
    success: accountClosed,
    mutate: closeAccount,
    reset: resetClose,
  } = useApiMutation<any, string>(accountService.closeAccount.bind(accountService));

  return {
    // Data
    accounts,

    // States
    loading,
    error,
    creatingAccount,
    createError,
    accountCreated,
    freezingAccount,
    freezeError,
    accountFrozen,
    blockingAccount,
    blockError,
    accountBlocked,
    closingAccount,
    closeError,
    accountClosed,

    // Actions
    fetchAccounts,
    createAccount,
    freezeAccount,
    blockAccount,
    closeAccount,

    // Reset functions
    resetCreate,
    resetFreeze,
    resetBlock,
    resetClose,
  };
}

export function useAccount(accountId: string) {
  const {
    data: account,
    loading,
    error,
    execute: fetchAccount,
  } = useApi<Account>(() => accountService.getAccountById(accountId));

  return {
    account,
    loading,
    error,
    fetchAccount,
  };
}
