import React, { useState } from 'react';
import customerService from '../../services/customerService';
import { CreateCustomerRequest } from '../../../../types/api.types';
import { Input } from '../../../../shared/components/UI/Input/Input';
import { Button } from '../../../../shared/components/UI/Button/Button';
import { validateCustomerForm } from '../../../../core/utils/validators';
import { MESSAGES } from '../../../../config/constants';

interface CustomerFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

/**
 * Formulaire de création de client
 */

export const CustomerForm: React.FC<CustomerFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<CreateCustomerRequest>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const validation = validateCustomerForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await customerService.createCustomer(formData);
      setSuccessMessage(MESSAGES.SUCCESS.CUSTOMER_CREATED);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err: any) {
      setErrors({ general: err.message || MESSAGES.ERROR.SERVER_ERROR });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="customer-form">
      {errors.general && (
        <div className="error-container">
          <p>{errors.general}</p>
        </div>
      )}

      {successMessage && (
        <div className="success-container">
          <p>{successMessage}</p>
        </div>
      )}

      <div className="form-row">
        <Input
          name="firstName"
          label="Prénom"
          placeholder="Jean"
          value={formData.firstName}
          onChange={handleChange}
          error={errors.firstName}
          fullWidth
          required
        />

        <Input
          name="lastName"
          label="Nom"
          placeholder="DUPONT"
          value={formData.lastName}
          onChange={handleChange}
          error={errors.lastName}
          fullWidth
          required
        />
      </div>

      <Input
        name="email"
        type="email"
        label="Email"
        placeholder="jean.dupont@email.com"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        fullWidth
        required
      />

      <Input
        name="phone"
        type="tel"
        label="Téléphone"
        placeholder="699123456"
        value={formData.phone}
        onChange={handleChange}
        error={errors.phone}
        helperText="Format: 6XXXXXXXX"
        fullWidth
        required
      />

      <Input
        name="address"
        label="Adresse"
        placeholder="Douala, Cameroun"
        value={formData.address}
        onChange={handleChange}
        error={errors.address}
        fullWidth
        required
      />

      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          Créer le client
        </Button>
      </div>
    </form>
  );
};