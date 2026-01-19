import apiClient from '../../../core/api/apiClient';
import API_CONFIG from '../../../config/api.config';
import { Transaction } from '../../../types/api.types';
import { TransactionType } from '../../../config/constants';

/**
 * Service pour le microservice Transaction
 * Gestion des transactions bancaires
 */

interface DepositRequest {
  accountId: string;
  amount: number;
  description?: string;
}

interface WithdrawalRequest {
  accountId: string;
  amount: number;
  description?: string;
}

interface TransferRequest {
  sourceAccountId: string;
  targetAccountId: string;
  amount: number;
  description?: string;
}

class TransactionService {
  /**
   * Effectue un dépôt
   */
  async deposit(data: DepositRequest): Promise<Transaction> {
    return apiClient.post(API_CONFIG.ENDPOINTS.TRANSACTIONS.DEPOSIT, data);
  }

  /**
   * Effectue un retrait
   */
  async withdraw(data: WithdrawalRequest): Promise<Transaction> {
    return apiClient.post(API_CONFIG.ENDPOINTS.TRANSACTIONS.WITHDRAW, data);
  }

  /**
   * Effectue un virement
   */
  async transfer(data: TransferRequest): Promise<Transaction> {
    return apiClient.post(API_CONFIG.ENDPOINTS.TRANSACTIONS.TRANSFER, data);
  }

  /**
   * Récupère les transactions d'un compte
   */
  async getTransactionsByAccountId(accountId: string): Promise<Transaction[]> {
    return apiClient.get(API_CONFIG.ENDPOINTS.TRANSACTIONS.BY_ACCOUNT(accountId));
  }

  /**
   * Récupère les transactions avec pagination
   */
  async getTransactionsPaginated(accountId: string, page: number = 0, size: number = 20): Promise<Transaction[]> {
    return apiClient.get(
      API_CONFIG.ENDPOINTS.TRANSACTIONS.PAGINATED(accountId, page, size)
    );
  }

  /**
   * Recherche des transactions par type et/ou date
   */
  async searchTransactions(type?: TransactionType, date?: string): Promise<Transaction[]> {
    return apiClient.get(API_CONFIG.ENDPOINTS.TRANSACTIONS.SEARCH(type, date));
  }
}

export default new TransactionService();
