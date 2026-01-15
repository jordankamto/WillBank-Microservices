import { BUSINESS_RULES } from '../../config/constants';
import { ValidationResult } from '../../types/common.types';

/**
 * Validateurs pour les formulaires
 * Respectent les règles métier définies dans BUSINESS_RULES
 */

/**
 * Valide un email
 */
export const validateEmail = (email: string): string | null => {
  if (!email) return 'L\'email est requis';
  if (!BUSINESS_RULES.EMAIL_REGEX.test(email)) {
    return 'Format d\'email invalide';
  }
  return null;
};

/**
 * Valide un numéro de téléphone camerounais
 */
export const validatePhone = (phone: string): string | null => {
  if (!phone) return 'Le numéro de téléphone est requis';
  
  const cleaned = phone.replace(/\s/g, '');
  
  if (!BUSINESS_RULES.PHONE_REGEX.test(cleaned)) {
    return 'Format de téléphone invalide (ex: 699123456)';
  }
  
  return null;
};

/**
 * Valide un nom (prénom ou nom de famille)
 */
export const validateName = (name: string, fieldName: string = 'Ce champ'): string | null => {
  if (!name) return `${fieldName} est requis`;
  
  if (name.length < BUSINESS_RULES.MIN_NAME_LENGTH) {
    return `${fieldName} doit contenir au moins ${BUSINESS_RULES.MIN_NAME_LENGTH} caractères`;
  }
  
  if (name.length > BUSINESS_RULES.MAX_NAME_LENGTH) {
    return `${fieldName} ne peut pas dépasser ${BUSINESS_RULES.MAX_NAME_LENGTH} caractères`;
  }
  
  return null;
};

/**
 * Valide une adresse
 */
export const validateAddress = (address: string): string | null => {
  if (!address) return 'L\'adresse est requise';
  if (address.length < 5) return 'L\'adresse doit contenir au moins 5 caractères';
  return null;
};

/**
 * Valide un montant de dépôt
 */
export const validateDepositAmount = (amount: number): string | null => {
  if (!amount || amount <= 0) return 'Le montant doit être supérieur à 0';
  
  if (amount < BUSINESS_RULES.MIN_DEPOSIT) {
    return `Le montant minimum de dépôt est ${BUSINESS_RULES.MIN_DEPOSIT} XAF`;
  }
  
  return null;
};

/**
 * Valide un montant de retrait
 */
export const validateWithdrawalAmount = (amount: number, balance: number): string | null => {
  if (!amount || amount <= 0) return 'Le montant doit être supérieur à 0';
  
  if (amount > balance) {
    return 'Solde insuffisant';
  }
  
  if (amount > BUSINESS_RULES.MAX_WITHDRAWAL) {
    return `Le montant maximum de retrait est ${BUSINESS_RULES.MAX_WITHDRAWAL} XAF`;
  }
  
  return null;
};

/**
 * Valide un montant de virement
 */
export const validateTransferAmount = (amount: number, balance: number): string | null => {
  if (!amount || amount <= 0) return 'Le montant doit être supérieur à 0';
  
  if (amount < BUSINESS_RULES.MIN_TRANSFER) {
    return `Le montant minimum de virement est ${BUSINESS_RULES.MIN_TRANSFER} XAF`;
  }
  
  if (amount > balance) {
    return 'Solde insuffisant';
  }
  
  if (amount > BUSINESS_RULES.MAX_TRANSFER) {
    return `Le montant maximum de virement est ${BUSINESS_RULES.MAX_TRANSFER} XAF`;
  }
  
  return null;
};

/**
 * Valide un mot de passe
 */
export const validatePassword = (password: string): string | null => {
  if (!password) return 'Le mot de passe est requis';
  
  if (password.length < 8) {
    return 'Le mot de passe doit contenir au moins 8 caractères';
  }
  
  if (!/[A-Z]/.test(password)) {
    return 'Le mot de passe doit contenir au moins une majuscule';
  }
  
  if (!/[a-z]/.test(password)) {
    return 'Le mot de passe doit contenir au moins une minuscule';
  }
  
  if (!/[0-9]/.test(password)) {
    return 'Le mot de passe doit contenir au moins un chiffre';
  }
  
  return null;
};

/**
 * Valide la confirmation de mot de passe
 */
export const validatePasswordConfirmation = (password: string, confirmation: string): string | null => {
  if (!confirmation) return 'La confirmation du mot de passe est requise';
  
  if (password !== confirmation) {
    return 'Les mots de passe ne correspondent pas';
  }
  
  return null;
};

/**
 * Valide un formulaire complet de création de client
 */
export const validateCustomerForm = (data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};
  
  const firstNameError = validateName(data.firstName, 'Le prénom');
  if (firstNameError) errors.firstName = firstNameError;
  
  const lastNameError = validateName(data.lastName, 'Le nom');
  if (lastNameError) errors.lastName = lastNameError;
  
  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;
  
  const phoneError = validatePhone(data.phone);
  if (phoneError) errors.phone = phoneError;
  
  const addressError = validateAddress(data.address);
  if (addressError) errors.address = addressError;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Valide une période de dates
 */
export const validateDateRange = (from: string, to: string): string | null => {
  if (!from || !to) return 'Les deux dates sont requises';
  
  const fromDate = new Date(from);
  const toDate = new Date(to);
  
  if (fromDate > toDate) {
    return 'La date de début doit être antérieure à la date de fin';
  }
  
  const diffInDays = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays > BUSINESS_RULES.MAX_STATEMENT_DAYS) {
    return `La période ne peut pas dépasser ${BUSINESS_RULES.MAX_STATEMENT_DAYS} jours`;
  }
  
  return null;
};