import { useApi } from '../../../core/hooks/useApi';
import dashboardService from '../services/dashboardService';
import { DashboardData, Transaction } from '../../../types/api.types';

/**
 * Hook pour gérer le dashboard
 */

export function useDashboard(customerId: string) {
  const {
    data: dashboardData,
    loading,
    error,
    execute: fetchDashboard,
  } = useApi<DashboardData>(() => dashboardService.getDashboardData(customerId));

  return {
    dashboardData,
    loading,
    error,
    fetchDashboard,
  };
}

export function useAccountStatement() {
  const {
    data: statement,
    loading,
    error,
    execute: fetchStatement,
  } = useApi((accountId: string, from: string, to: string) =>
    dashboardService.getAccountStatement(accountId, from, to)
  );

  return {
    statement,
    loading,
    error,
    fetchStatement,
  };
}

export function useDashboardTransactionSearch() {
  const {
    data: transactions,
    loading: searching,
    error: searchError,
    execute: searchTransactions,
  } = useApi<Transaction[]>(
    (type?: string, date?: string) =>
      dashboardService.searchTransactions(type, date),
    []
  );

  return {
    transactions,
    searching,
    searchError,
    searchTransactions,
  };
}
