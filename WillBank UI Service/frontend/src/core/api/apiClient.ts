import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import API_CONFIG from '../../config/api.config';
import { ApiError } from '../../types/api.types';

/**
 * Instance Axios configurée pour communiquer avec l'API Gateway
 * Gère automatiquement :
 * - L'ajout du token JWT dans les headers
 * - La gestion des erreurs HTTP
 * - Le refresh du token si nécessaire
 */

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: API_CONFIG.HEADERS
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Intercepteur de requête : ajout du token JWT
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('authToken');
        
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Log pour debug en développement
        if (process.env.NODE_ENV === 'development') {
          console.log(`🌐 ${config.method?.toUpperCase()} ${config.url}`, config.data);
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Intercepteur de réponse : gestion des erreurs
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log pour debug en développement
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ Response:`, response.data);
        }
        
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Gestion des erreurs HTTP
        if (error.response) {
          const status = error.response.status;
          
          // 401 Unauthorized : Token expiré ou invalide
          if (status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
              // Tentative de refresh du token
              const refreshToken = localStorage.getItem('refreshToken');
              
              if (refreshToken) {
                const response = await axios.post(
                  `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`,
                  { refreshToken }
                );
                
                const newToken = response.data.token;
                localStorage.setItem('authToken', newToken);
                
                // Retry la requête originale avec le nouveau token
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${newToken}`;
                }
                return this.client(originalRequest);
              }
            } catch (refreshError) {
              // Échec du refresh : déconnexion
              this.handleAuthFailure();
              return Promise.reject(refreshError);
            }
          }
          
          // 403 Forbidden
          if (status === 403) {
            console.error('❌ Accès interdit');
          }
          
          // 404 Not Found
          if (status === 404) {
            console.error('❌ Ressource introuvable');
          }
          
          // 500+ Erreur serveur
          if (status >= 500) {
            console.error('❌ Erreur serveur');
          }
        } else if (error.request) {
          // Requête envoyée mais pas de réponse
          console.error('❌ Pas de réponse du serveur');
        } else {
          // Erreur lors de la configuration de la requête
          console.error('❌ Erreur de configuration:', error.message);
        }
        
        return Promise.reject(this.normalizeError(error));
      }
    );
  }

  /**
   * Normalise les erreurs pour un format cohérent
   */
  private normalizeError(error: AxiosError): ApiError {
    if (error.response) {
      return {
        message: (error.response.data as any)?.message || error.message,
        status: error.response.status,
        errors: (error.response.data as any)?.errors,
        timestamp: new Date().toISOString()
      };
    }
    
    return {
      message: error.message || 'Une erreur est survenue',
      status: 0,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Gère l'échec d'authentification
   */
  private handleAuthFailure(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userInfo');
    
    // Redirection vers login
    window.location.href = '/login';
  }

  /**
   * Méthodes HTTP publiques
   */
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

  public async patch<T>(url: string, data?: any, config = {}): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  /**
   * Retourne l'instance Axios brute si nécessaire
   */
  public getClient(): AxiosInstance {
    return this.client;
  }
}

// Export d'une instance singleton
const apiClient = new ApiClient();
export default apiClient;