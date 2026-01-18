import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CURRENCY, LOCALE, DATE_FORMAT, DATETIME_FORMAT } from '../../config/constants';

/**
 * Utilitaires de formatage pour React Native
 */

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: CURRENCY,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat(LOCALE).format(value);
};

export const formatDate = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, DATE_FORMAT, { locale: fr });
  } catch (error) {
    return 'Date invalide';
  }
};

export const formatDateTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, DATETIME_FORMAT, { locale: fr });
  } catch (error) {
    return 'Date invalide';
  }
};

export const formatRelativeDate = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const now = new Date();
    const diffInMs = now.getTime() - dateObj.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Aujourd'hui";
    if (diffInDays === 1) return "Hier";
    if (diffInDays < 7) return `Il y a ${diffInDays} jours`;
    if (diffInDays < 30) return `Il y a ${Math.floor(diffInDays / 7)} semaines`;
    return formatDate(date);
  } catch (error) {
    return 'Date invalide';
  }
};

export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('237')) {
    const number = cleaned.substring(3);
    return `+237 ${number.charAt(0)} ${number.substring(1, 3)} ${number.substring(3, 5)} ${number.substring(5, 7)} ${number.substring(7)}`;
  }
  
  if (cleaned.length === 9) {
    return `${cleaned.charAt(0)} ${cleaned.substring(1, 3)} ${cleaned.substring(3, 5)} ${cleaned.substring(5, 7)} ${cleaned.substring(7)}`;
  }
  
  return phone;
};

export const formatAccountNumber = (accountId: string): string => {
  if (accountId.length <= 8) return accountId;
  return `${accountId.substring(0, 4)}***${accountId.substring(accountId.length - 4)}`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};