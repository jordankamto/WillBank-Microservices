import apiClient from '../../../core/api/apiClient';
import API_CONFIG from '../../../config/api.config';
import { Account } from '../../../types/api.types';

/**
 * Service pour le microservice Account
 * Gestion des comptes bancaires
 */

interface CreateAccountRequest {
  customerId: string;
  type: 'CURRENT' | 'SAVINGS';
}

interface UpdateBalanceRequest {
  balance: number;
}

class AccountService {
  /**
   * Récupère tous les comptes
   */
  async getAllAccounts(): Promise<Account[]> {
    return apiClient.get(API_CONFIG.ENDPOINTS.ACCOUNTS.BASE);
  }

  /**
   * Crée un nouveau compte
   */
  async createAccount(data: CreateAccountRequest): Promise<Account> {
    return apiClient.post(API_CONFIG.ENDPOINTS.ACCOUNTS.BASE, data);
  }

  /**
   * Récupère un compte par ID
   */
  async getAccountById(id: string): Promise<Account> {
    return apiClient.get(API_CONFIG.ENDPOINTS.ACCOUNTS.BY_ID(id));
  }

  /**
   * Récupère tous les comptes d'un client
   */
  async getAccountsByCustomerId(customerId: string): Promise<Account[]> {
    return apiClient.get(API_CONFIG.ENDPOINTS.ACCOUNTS.BY_CUSTOMER(customerId));
  }

  /**
   * Gèle un compte
   */
  async freezeAccount(id: string): Promise<any> {
    return apiClient.put(API_CONFIG.ENDPOINTS.ACCOUNTS.FREEZE(id));
  }

  /**
   * Bloque un compte
   */
  async blockAccount(id: string): Promise<any> {
    return apiClient.put(API_CONFIG.ENDPOINTS.ACCOUNTS.BLOCK(id));
  }

  /**
   * Ferme un compte
   */
  async closeAccount(id: string): Promise<any> {
    return apiClient.put(API_CONFIG.ENDPOINTS.ACCOUNTS.CLOSE(id));
  }

  /**
   * Met à jour le solde d'un compte (utilisation interne)
   */
  async updateBalance(id: string, balance: number): Promise<any> {
    return apiClient.put(API_CONFIG.ENDPOINTS.ACCOUNTS.BY_ID(id) + '/balance', { balance });
  }

  /**
   * Récupère le relevé de compte sur une période
   */
  async getAccountStatement(accountId: string, from: string, to: string) {
    return apiClient.get(
      API_CONFIG.ENDPOINTS.DASHBOARD.ACCOUNT_STATEMENT(accountId, from, to)
    );
  }
}

export default new AccountService();
