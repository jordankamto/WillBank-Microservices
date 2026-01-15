import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';
import { ROUTES } from '../../../config/constants';
import { Card } from '../../../shared/components/UI/Card/Card';
import { Button } from '../../../shared/components/UI/Button/Button';
import './RegisterPage.css';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validatePassword = (password: string) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password)
    };
  };

  const passwordStrength = validatePassword(formData.password);
  const isPasswordValid = Object.values(passwordStrength).every(v => v);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.firstName || !formData.lastName) {
      setError('Veuillez renseigner votre nom complet');
      return;
    }

    if (!isPasswordValid) {
      setError('Le mot de passe ne respecte pas les critères requis');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);

    try {
      // TODO: Implémenter l'appel API d'inscription
      console.log('Inscription:', formData);
      
      // Simuler un délai
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirection vers login après succès
      navigate(ROUTES.LOGIN);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-background">
        <div className="gradient-blob blob-1"></div>
        <div className="gradient-blob blob-2"></div>
        <div className="gradient-blob blob-3"></div>
      </div>

      <Card className="register-card">
        <div className="register-header">
          <div className="logo-container">
            <div className="logo">🏦</div>
            <h1 className="brand-name">WillBank</h1>
          </div>
          <h2 className="page-title">Créer votre compte</h2>
          <p className="tagline">Rejoignez des milliers d'utilisateurs satisfaits</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {error && (
            <div className="error-alert">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">Prénom</label>
              <div className="input-wrapper">
                <FiUser className="input-icon" />
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Jean"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Nom</label>
              <div className="input-wrapper">
                <FiUser className="input-icon" />
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Dupont"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Adresse email</label>
            <div className="input-wrapper">
              <FiMail className="input-icon" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="jean.dupont@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            
            {formData.password && (
              <div className="password-strength">
                <div className={`strength-item ${passwordStrength.length ? 'valid' : ''}`}>
                  <FiCheck /> Au moins 8 caractères
                </div>
                <div className={`strength-item ${passwordStrength.uppercase ? 'valid' : ''}`}>
                  <FiCheck /> Une lettre majuscule
                </div>
                <div className={`strength-item ${passwordStrength.lowercase ? 'valid' : ''}`}>
                  <FiCheck /> Une lettre minuscule
                </div>
                <div className={`strength-item ${passwordStrength.number ? 'valid' : ''}`}>
                  <FiCheck /> Un chiffre
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div className="terms-agreement">
            <label>
              <input type="checkbox" required />
              <span>
                J'accepte les <a href="#">conditions d'utilisation</a> et la{' '}
                <a href="#">politique de confidentialité</a>
              </span>
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            loading={loading}
            disabled={loading}
            className="submit-button"
          >
            {loading ? 'Création du compte...' : 'Créer mon compte'}
          </Button>

          <div className="login-prompt">
            <p>
              Vous avez déjà un compte ?{' '}
              <Link to={ROUTES.LOGIN} className="login-link">
                Se connecter →
              </Link>
            </p>
          </div>
        </form>

        <div className="register-footer">
          <p>© 2024-2025 WillBank • Développé par l'équipe SI-5</p>
        </div>
      </Card>
    </div>
  );
};