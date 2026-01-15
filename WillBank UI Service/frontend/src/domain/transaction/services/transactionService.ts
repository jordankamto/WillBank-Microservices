import apiClient from '../../../core/api/apiClient';
import API_CONFIG from '../../../config/api.config';
import { 
  Transaction, 
  DepositRequest, 
  WithdrawalRequest, 
  TransferRequest,
  PaginatedResponse,
  TransactionSearchParams
} from '../../../types/api.types';

/**
 * Service pour le microservice Transaction
 * Encapsule toutes les opérations liées aux transactions bancaires
 */

class TransactionService {
  /**
   * Effectue un dépôt
   */
  async deposit(data: DepositRequest): Promise<Transaction> {
    return apiClient.post<Transaction>(API_CONFIG.ENDPOINTS.TRANSACTIONS.DEPOSIT, data);
  }

  /**
   * Effectue un retrait
   */
  async withdraw(data: WithdrawalRequest): Promise<Transaction> {
    return apiClient.post<Transaction>(API_CONFIG.ENDPOINTS.TRANSACTIONS.WITHDRAW, data);
  }

  /**
   * Effectue un virement
   */
  async transfer(data: TransferRequest): Promise<Transaction> {
    return apiClient.post<Transaction>(API_CONFIG.ENDPOINTS.TRANSACTIONS.TRANSFER, data);
  }

  /**
   * Récupère les transactions d'un compte
   */
  async getTransactionsByAccountId(accountId: string): Promise<Transaction[]> {
    return apiClient.get<Transaction[]>(
      API_CONFIG.ENDPOINTS.TRANSACTIONS.BY_ACCOUNT(accountId)
    );
  }

  /**
   * Récupère les transactions d'un compte avec pagination
   */
  async getTransactionsPaginated(
    accountId: string, 
    page: number = 0, 
    size: number = 10
  ): Promise<PaginatedResponse<Transaction>> {
    return apiClient.get<PaginatedResponse<Transaction>>(
      API_CONFIG.ENDPOINTS.TRANSACTIONS.PAGINATED(accountId, page, size)
    );
  }

  /**
   * Recherche des transactions selon différents critères
   */
  async searchTransactions(params: TransactionSearchParams): Promise<Transaction[]> {
    const url = API_CONFIG.ENDPOINTS.DASHBOARD.SEARCH_TRANSACTIONS(
      params.type, 
      params.date
    );
    return apiClient.get<Transaction[]>(url);
  }
}

// Export d'une instance singleton
const transactionService = new TransactionService();
export default transactionService;