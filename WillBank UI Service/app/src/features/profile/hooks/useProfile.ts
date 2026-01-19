import { useApi, useApiMutation } from '../../../core/hooks/useApi';
import profileService from '../services/profileService';
import { Customer } from '../../../types/api.types';

/**
 * Hook pour gérer le profil client
 */

interface CreateCustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

interface UpdateCustomerData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export function useProfile(customerId?: string) {
  const {
    data: profile,
    loading,
    error,
    execute: fetchProfile,
  } = useApi<Customer | null>(
    customerId ? () => profileService.getCustomerProfile(customerId) : () => Promise.resolve(null),
    null
  );

  const {
    loading: updatingProfile,
    error: updateError,
    success: profileUpdated,
    mutate: updateProfile,
    reset: resetUpdate,
  } = useApiMutation<Customer, { customerId: string; data: UpdateCustomerData }>(
    ({ customerId, data }) => profileService.updateCustomerProfile(customerId, data)
  );

  const {
    loading: suspendingCustomer,
    error: suspendError,
    success: customerSuspended,
    mutate: suspendCustomer,
    reset: resetSuspend,
  } = useApiMutation<Customer, string>(profileService.suspendCustomer.bind(profileService));

  const {
    loading: activatingCustomer,
    error: activateError,
    success: customerActivated,
    mutate: activateCustomer,
    reset: resetActivate,
  } = useApiMutation<Customer, string>(profileService.activateCustomer.bind(profileService));

  return {
    // Data
    profile,

    // States
    loading,
    error,
    updatingProfile,
    updateError,
    profileUpdated,
    suspendingCustomer,
    suspendError,
    customerSuspended,
    activatingCustomer,
    activateError,
    customerActivated,

    // Actions
    fetchProfile,
    updateProfile,
    suspendCustomer,
    activateCustomer,

    // Reset functions
    resetUpdate,
    resetSuspend,
    resetActivate,
  };
}

export function useCustomerSearch() {
  const {
    data: customers,
    loading: searching,
    error: searchError,
    execute: searchCustomers,
  } = useApi<Customer[]>(
    (email?: string, phone?: string) =>
      email || phone
        ? profileService.searchCustomer(email, phone)
        : profileService.getAllCustomers(),
    []
  );

  return {
    customers,
    searching,
    searchError,
    searchCustomers,
  };
}

export function useCustomerCreation() {
  const {
    loading: creatingCustomer,
    error: createError,
    success: customerCreated,
    mutate: createCustomer,
    reset: resetCreate,
  } = useApiMutation<Customer, CreateCustomerData>(profileService.createCustomer.bind(profileService));

  return {
    creatingCustomer,
    createError,
    customerCreated,
    createCustomer,
    resetCreate,
  };
}

export function useCustomerCheck() {
  const {
    data: customerStatus,
    loading: checking,
    error: checkError,
    execute: checkCustomer,
  } = useApi((customerId: string) => profileService.checkCustomerExists(customerId));

  return {
    customerStatus,
    checking,
    checkError,
    checkCustomer,
  };
}
