/**
 * Types communs utilisés dans toute l'application
 */

// === UI TYPES ===
export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface SelectOption {
  value: string;
  label: string;
}

// === FORM TYPES ===
export interface FormFieldError {
  message: string;
  field: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// === TABLE TYPES ===
export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

// === PAGINATION TYPES ===
export interface PaginationState {
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

// === LOADING STATES ===
export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// === MODAL TYPES ===
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

// === NOTIFICATION TYPES (UI) ===
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}