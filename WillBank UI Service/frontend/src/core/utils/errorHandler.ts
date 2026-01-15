import { ApiError } from '../../types/api.types';
import { MESSAGES } from '../../config/constants';

/**
 * Gestionnaire d'erreurs centralisé
 */

/**
 * Extrait un message d'erreur lisible depuis une erreur API
 */
export const getErrorMessage = (error: any): string => {
  // Si c'est déjà une ApiError
  if (error && typeof error === 'object' && 'message' in error) {
    const apiError = error as ApiError;
    
    // Erreurs de validation
    if (apiError.errors && Object.keys(apiError.errors).length > 0) {
      const firstError = Object.values(apiError.errors)[0];
      return Array.isArray(firstError) ? firstError[0] : String(firstError);
    }
    
    return apiError.message;
  }
  
  // Erreur de type Error standard
  if (error instanceof Error) {
    return error.message;
  }
  
  // String directe
  if (typeof error === 'string') {
    return error;
  }
  
  // Fallback
  return MESSAGES.ERROR.SERVER_ERROR;
};

/**
 * Détermine le message d'erreur en fonction du code HTTP
 */
export const getHttpErrorMessage = (status: number): string => {
  switch (status) {
    case 400:
      return MESSAGES.ERROR.VALIDATION;
    case 401:
      return MESSAGES.ERROR.UNAUTHORIZED;
    case 403:
      return MESSAGES.ERROR.FORBIDDEN;
    case 404:
      return MESSAGES.ERROR.NOT_FOUND;
    case 500:
    case 502:
    case 503:
    case 504:
      return MESSAGES.ERROR.SERVER_ERROR;
    default:
      return MESSAGES.ERROR.NETWORK;
  }
};

/**
 * Vérifie si une erreur est une erreur réseau
 */
export const isNetworkError = (error: any): boolean => {
  return !error.response && error.request;
};

/**
 * Vérifie si une erreur est une erreur d'authentification
 */
export const isAuthError = (error: any): boolean => {
  return error.response && (error.response.status === 401 || error.response.status === 403);
};

/**
 * Vérifie si une erreur est une erreur de validation
 */
export const isValidationError = (error: any): boolean => {
  return error.response && error.response.status === 400;
};

/**
 * Formate les erreurs de validation pour l'affichage dans les formulaires
 */
export const formatValidationErrors = (error: ApiError): Record<string, string> => {
  if (!error.errors) return {};
  
  const formattedErrors: Record<string, string> = {};
  
  Object.entries(error.errors).forEach(([field, messages]) => {
    if (Array.isArray(messages) && messages.length > 0) {
      formattedErrors[field] = messages[0];
    } else if (typeof messages === 'string') {
      formattedErrors[field] = messages;
    }
  });
  
  return formattedErrors;
};

/**
 * Log une erreur de manière structurée
 */
export const logError = (error: any, context?: string): void => {
  if (process.env.NODE_ENV === 'development') {
    console.group(`❌ Error${context ? ` in ${context}` : ''}`);
    console.error('Error object:', error);
    console.error('Message:', getErrorMessage(error));
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    console.groupEnd();
  }
};

/**
 * Crée une erreur personnalisée
 */
export const createError = (message: string, status: number = 500): ApiError => {
  return {
    message,
    status,
    timestamp: new Date().toISOString()
  };
};