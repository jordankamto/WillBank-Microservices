import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../core/auth/AuthContext';
import { Input } from '../../../shared/components/UI/Input/Input';
import { Button } from '../../../shared/components/UI/Button/Button';
import { Card } from '../../../shared/components/UI/Card/Card';
import { ROUTES } from '../../../config/constants';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(ROUTES.DASHBOARD);
    } catch (err: any) {
      setError(err.message || 'Identifiants invalides');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="gradient-blob blob-1"></div>
        <div className="gradient-blob blob-2"></div>
        <div className="gradient-blob blob-3"></div>
      </div>

      <Card className="login-card">
        <div className="login-header">
          <div className="logo-container">
            <div className="logo">🏦</div>
            <h1 className="brand-name">WillBank</h1>
          </div>
          <p className="tagline">Votre banque digitale de confiance</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-alert">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Adresse email</label>
            <div className="input-wrapper">
              <FiMail className="input-icon" />
              <input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
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
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Se souvenir de moi</span>
            </label>
            <a href="#" className="forgot-password">Mot de passe oublié ?</a>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            loading={loading}
            disabled={!email || !password || loading}
            className="submit-button"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>

          <div className="divider">
            <span>OU</span>
          </div>

          <div className="register-prompt">
            <p>Vous n'avez pas encore de compte ?</p>
            <Link to="/register" className="register-link">
              Créer un compte gratuitement →
            </Link>
          </div>
        </form>

        <div className="login-footer">
          <p>© 2024-2025 WillBank • Développé par l'équipe SI-5</p>
        </div>
      </Card>
    </div>
  );
};