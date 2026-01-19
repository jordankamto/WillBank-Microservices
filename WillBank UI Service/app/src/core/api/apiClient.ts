import axios, { AxiosInstance, AxiosError } from 'axios';
import API_CONFIG from '../../config/api.config';
import { WILLBANK_SECRET_TOKEN } from '../../config/constants';

/**
 * Client HTTP pour React Native
 * Utilise un token fixe WILLBANK_SECRET_TOKEN pour l'authentification
 */

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        ...API_CONFIG.HEADERS,
        'Authorization': `Bearer ${WILLBANK_SECRET_TOKEN}`,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Intercepteur de requête - log uniquement
    this.client.interceptors.request.use(
      (config) => {
        if (__DEV__) {
          console.log(`${config.method?.toUpperCase()} ${config.url}`);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Intercepteur de réponse - log et normalisation d'erreur
    this.client.interceptors.response.use(
      (response) => {
        if (__DEV__) {
          console.log('Response:', response.data);
        }
        return response;
      },
      (error: AxiosError) => {
        return Promise.reject(this.normalizeError(error));
      }
    );
  }

  private normalizeError(error: AxiosError): any {
    if (error.response) {
      return {
        message: (error.response.data as any)?.message || error.message,
        status: error.response.status,
        errors: (error.response.data as any)?.errors,
      };
    }

    return {
      message: error.message || 'Une erreur est survenue',
      status: 0,
    };
  }

  public async get<T>(url: string, config = {}): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: any, config = {}): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: any, config = {}): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config = {}): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

const apiClient = new ApiClient();
export default apiClient;
