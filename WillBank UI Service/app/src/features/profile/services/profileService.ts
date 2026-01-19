import apiClient from '../../../core/api/apiClient';
import API_CONFIG from '../../../config/api.config';
import { Customer } from '../../../types/api.types';

/**
 * Service pour le microservice Customer (Profil)
 */

interface CreateCustomerRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

interface CustomerExistsResponse {
  exists: boolean;
  customerId?: string;
  status?: string;
  kycActive?: boolean;
}

class ProfileService {
  /**
   * Crée un nouveau client
   */
  async createCustomer(data: CreateCustomerRequest): Promise<Customer> {
    return apiClient.post(API_CONFIG.ENDPOINTS.CUSTOMERS.BASE, data);
  }

  /**
   * Récupère les informations du client
   */
  async getCustomerProfile(customerId: string): Promise<Customer> {
    return apiClient.get(API_CONFIG.ENDPOINTS.CUSTOMERS.BY_ID(customerId));
  }

  /**
   * Vérifie si un client existe
   */
  async checkCustomerExists(customerId: string): Promise<CustomerExistsResponse> {
    return apiClient.get(API_CONFIG.ENDPOINTS.CUSTOMERS.EXISTS(customerId));
  }

  /**
   * Recherche un client par email ou téléphone
   */
  async searchCustomer(email?: string, phone?: string): Promise<Customer[]> {
    return apiClient.get(API_CONFIG.ENDPOINTS.CUSTOMERS.SEARCH(email, phone));
  }

  /**
   * Récupère tous les clients
   */
  async getAllCustomers(): Promise<Customer[]> {
    return apiClient.get(API_CONFIG.ENDPOINTS.CUSTOMERS.BASE);
  }

  /**
   * Met à jour les informations du client
   */
  async updateCustomerProfile(customerId: string, data: Partial<CreateCustomerRequest>): Promise<Customer> {
    return apiClient.put(API_CONFIG.ENDPOINTS.CUSTOMERS.BY_ID(customerId), data);
  }

  /**
   * Suspend un client
   */
  async suspendCustomer(customerId: string): Promise<Customer> {
    return apiClient.put(API_CONFIG.ENDPOINTS.CUSTOMERS.SUSPEND(customerId));
  }

  /**
   * Active un client
   */
  async activateCustomer(customerId: string): Promise<Customer> {
    return apiClient.put(API_CONFIG.ENDPOINTS.CUSTOMERS.ACTIVATE(customerId));
  }
}

export default new ProfileService();
