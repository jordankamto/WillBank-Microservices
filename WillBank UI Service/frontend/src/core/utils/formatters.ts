import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CURRENCY, LOCALE, DATE_FORMAT, DATETIME_FORMAT } from '../../config/constants';

/**
 * Utilitaires de formatage pour l'affichage des données
 */

/**
 * Formate un montant en devise (XAF)
 * @example formatCurrency(150000) => "150 000 XAF"
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: CURRENCY,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Formate un nombre avec séparateurs de milliers
 * @example formatNumber(1500000) => "1 500 000"
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat(LOCALE).format(value);
};

/**
 * Formate une date au format dd/MM/yyyy
 * @example formatDate("2024-01-15T10:30:00") => "15/01/2024"
 */
export const formatDate = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, DATE_FORMAT, { locale: fr });
  } catch (error) {
    return 'Date invalide';
  }
};

/**
 * Formate une date avec heure au format dd/MM/yyyy HH:mm:ss
 * @example formatDateTime("2024-01-15T10:30:45") => "15/01/2024 10:30:45"
 */
export const formatDateTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, DATETIME_FORMAT, { locale: fr });
  } catch (error) {
    return 'Date invalide';
  }
};

/**
 * Formate une date relative (il y a X jours)
 * @example formatRelativeDate("2024-01-10") => "Il y a 5 jours"
 */
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
    if (diffInDays < 365) return `Il y a ${Math.floor(diffInDays / 30)} mois`;
    return `Il y a ${Math.floor(diffInDays / 365)} ans`;
  } catch (error) {
    return 'Date invalide';
  }
};

/**
 * Formate un numéro de téléphone camerounais
 * @example formatPhone("237699123456") => "+237 6 99 12 34 56"
 */
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

/**
 * Tronque un texte avec ellipse
 * @example truncateText("Un très long texte", 10) => "Un très lo..."
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Formate un nom complet (capitalisation)
 * @example formatFullName("jean", "DUPONT") => "Jean DUPONT"
 */
export const formatFullName = (firstName: string, lastName: string): string => {
  const capitalizeFirst = (str: string) => 
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  
  return `${capitalizeFirst(firstName)} ${lastName.toUpperCase()}`;
};

/**
 * Formate un numéro de compte (masquage partiel)
 * @example formatAccountNumber("ACC123456789") => "ACC***6789"
 */
export const formatAccountNumber = (accountId: string): string => {
  if (accountId.length <= 8) return accountId;
  const visible = 4;
  const masked = accountId.length - (visible * 2);
  return accountId.substring(0, visible) + '*'.repeat(masked) + accountId.substring(accountId.length - visible);
};

/**
 * Formate un pourcentage
 * @example formatPercentage(0.1567) => "15.67%"
 */
export const formatPercentage = (value: number, decimals: number = 2): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};