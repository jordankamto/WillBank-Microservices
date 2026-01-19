import axios from 'axios';
import { API_BASE_URL, API_TOKEN } from '../constants/users';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': API_TOKEN
  }
});

// Intercepteur de requête
api.interceptors.request.use(
  (config) => {
    console.log(`API Call: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error(`API Error: ${error.config?.url}`, error.response?.data || error.message);
    
    const message = error.response?.data?.message || error.message || 'Une erreur est survenue';
    
    if (error.response?.status === 404) {
      toast.error('Ressource non trouvée');
    } else if (error.response?.status === 400) {
      toast.error(message);
    } else if (error.response?.status === 503) {
      toast.error('Service temporairement indisponible');
    } else {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

export default api;