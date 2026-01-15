import apiClient from '../../../core/api/apiClient';
import API_CONFIG from '../../../config/api.config';
import { Customer, CreateCustomerRequest, UpdateCustomerRequest } from '../../../types/api.types';

/**
 * Service pour le microservice Customer
 * Encapsule toutes les opérations liées aux clients
 */

class CustomerService {
  /**
   * Récupère tous les clients
   */
  async getAllCustomers(): Promise<Customer[]> {
    return apiClient.get<Customer[]>(API_CONFIG.ENDPOINTS.CUSTOMERS.BASE);
  }

  /**
   * Récupère un client par ID
   */
  async getCustomerById(id: string): Promise<Customer> {
    return apiClient.get<Customer>(API_CONFIG.ENDPOINTS.CUSTOMERS.BY_ID(id));
  }

  /**
   * Recherche des clients par email ou téléphone
   */
  async searchCustomers(query: { email?: string; phone?: string }): Promise<Customer[]> {
    const params = new URLSearchParams();
    if (query.email) params.append('email', query.email);
    if (query.phone) params.append('phone', query.phone);
    
    return apiClient.get<Customer[]>(
      `${API_CONFIG.ENDPOINTS.CUSTOMERS.SEARCH}?${params.toString()}`
    );
  }

  /**
   * Crée un nouveau client
   */
  async createCustomer(data: CreateCustomerRequest): Promise<Customer> {
    return apiClient.post<Customer>(API_CONFIG.ENDPOINTS.CUSTOMERS.BASE, data);
  }

  /**
   * Met à jour un client existant
   */
  async updateCustomer(id: string, data: UpdateCustomerRequest): Promise<Customer> {
    return apiClient.put<Customer>(API_CONFIG.ENDPOINTS.CUSTOMERS.BY_ID(id), data);
  }

  /**
   * Suspend un client
   */
  async suspendCustomer(id: string): Promise<Customer> {
    return apiClient.put<Customer>(API_CONFIG.ENDPOINTS.CUSTOMERS.SUSPEND(id));
  }

  /**
   * Active un client
   */
  async activateCustomer(id: string): Promise<Customer> {
    return apiClient.put<Customer>(API_CONFIG.ENDPOINTS.CUSTOMERS.ACTIVATE(id));
  }
}

// Export d'une instance singleton
const customerService = new CustomerService();
export default customerService;