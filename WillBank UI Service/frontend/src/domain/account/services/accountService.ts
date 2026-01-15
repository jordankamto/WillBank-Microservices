import apiClient from '../../../core/api/apiClient';
import API_CONFIG from '../../../config/api.config';
import { Account, CreateAccountRequest, AccountStatement } from '../../../types/api.types';

/**
 * Service pour le microservice Account
 * Encapsule toutes les opérations liées aux comptes bancaires
 */

class AccountService {
  /**
   * Récupère tous les comptes
   */
  async getAllAccounts(): Promise<Account[]> {
    return apiClient.get<Account[]>(API_CONFIG.ENDPOINTS.ACCOUNTS.BASE);
  }

  /**
   * Récupère un compte par ID
   */
  async getAccountById(id: string): Promise<Account> {
    return apiClient.get<Account>(API_CONFIG.ENDPOINTS.ACCOUNTS.BY_ID(id));
  }

  /**
   * Récupère tous les comptes d'un client
   */
  async getAccountsByCustomerId(customerId: string): Promise<Account[]> {
    return apiClient.get<Account[]>(
      API_CONFIG.ENDPOINTS.ACCOUNTS.BY_CUSTOMER(customerId)
    );
  }

  /**
   * Crée un nouveau compte
   */
  async createAccount(data: CreateAccountRequest): Promise<Account> {
    return apiClient.post<Account>(API_CONFIG.ENDPOINTS.ACCOUNTS.BASE, data);
  }

  /**
   * Gèle un compte
   */
  async freezeAccount(id: string): Promise<Account> {
    return apiClient.put<Account>(API_CONFIG.ENDPOINTS.ACCOUNTS.FREEZE(id));
  }

  /**
   * Bloque un compte
   */
  async blockAccount(id: string): Promise<Account> {
    return apiClient.put<Account>(API_CONFIG.ENDPOINTS.ACCOUNTS.BLOCK(id));
  }

  /**
   * Ferme un compte
   */
  async closeAccount(id: string): Promise<Account> {
    return apiClient.put<Account>(API_CONFIG.ENDPOINTS.ACCOUNTS.CLOSE(id));
  }

  /**
   * Récupère le relevé de compte sur une période
   */
  async getAccountStatement(accountId: string, from: string, to: string): Promise<AccountStatement> {
    return apiClient.get<AccountStatement>(
      API_CONFIG.ENDPOINTS.DASHBOARD.ACCOUNT_STATEMENT(accountId, from, to)
    );
  }
}

// Export d'une instance singleton
const accountService = new AccountService();
export default accountService;