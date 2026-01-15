import React from 'react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

/**
 * Composant Input réutilisable
 */

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  fullWidth = false,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const inputClasses = [
    'input',
    error ? 'input-error' : '',
    icon ? 'input-with-icon' : '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  const wrapperClasses = [
    'input-wrapper',
    fullWidth ? 'input-full-width' : ''
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClasses}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}
      
      <div className="input-container">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          id={inputId}
          className={inputClasses}
          {...props}
        />
      </div>
      
      {error && <p className="input-error-text">{error}</p>}
      {!error && helperText && <p className="input-helper-text">{helperText}</p>}
    </div>
  );
};