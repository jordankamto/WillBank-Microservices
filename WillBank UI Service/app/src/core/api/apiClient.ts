import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_CONFIG from '../../config/api.config';

/**
 * Client HTTP pour React Native
 * Gère les tokens JWT avec AsyncStorage
 */

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: API_CONFIG.HEADERS,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Intercepteur de requête
    this.client.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('authToken');
        
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        if (__DEV__) {
          console.log(`🌐 ${config.method?.toUpperCase()} ${config.url}`);
        }
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Intercepteur de réponse
    this.client.interceptors.response.use(
      (response) => {
        if (__DEV__) {
          console.log('✅ Response:', response.data);
        }
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const refreshToken = await AsyncStorage.getItem('refreshToken');
            
            if (refreshToken) {
              const response = await axios.post(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`,
                { refreshToken }
              );
              
              const newToken = response.data.token;
              await AsyncStorage.setItem('authToken', newToken);
              
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
              }
              
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            await this.handleAuthFailure();
            return Promise.reject(refreshError);
          }
        }
        
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

  private async handleAuthFailure(): Promise<void> {
    await AsyncStorage.multiRemove(['authToken', 'refreshToken', 'userInfo']);
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