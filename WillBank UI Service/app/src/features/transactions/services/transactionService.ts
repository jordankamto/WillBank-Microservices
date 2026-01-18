import apiClient from '../../../core/api/apiClient';
import API_CONFIG from '../../../config/api.config';

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
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description?: string;
}

class TransactionService {
  /**
   * Effectue un dépôt
   */
  async deposit(data: DepositRequest) {
    return apiClient.post(API_CONFIG.ENDPOINTS.TRANSACTIONS.DEPOSIT, data);
  }

  /**
   * Effectue un retrait
   */
  async withdraw(data: WithdrawalRequest) {
    return apiClient.post(API_CONFIG.ENDPOINTS.TRANSACTIONS.WITHDRAW, data);
  }

  /**
   * Effectue un virement
   */
  async transfer(data: TransferRequest) {
    return apiClient.post(API_CONFIG.ENDPOINTS.TRANSACTIONS.TRANSFER, data);
  }

  /**
   * Récupère les transactions d'un compte
   */
  async getTransactionsByAccountId(accountId: string) {
    return apiClient.get(API_CONFIG.ENDPOINTS.TRANSACTIONS.BY_ACCOUNT(accountId));
  }

  /**
   * Récupère les transactions avec pagination
   */
  async getTransactionsPaginated(accountId: string, page: number = 0, size: number = 10) {
    return apiClient.get(
      API_CONFIG.ENDPOINTS.TRANSACTIONS.PAGINATED(accountId, page, size)
    );
  }
}

export default new TransactionService();